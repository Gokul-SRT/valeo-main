import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from '../../index'
import store from 'store'
import serverApi from '../../Api/service/serverAPI'
import * as demoapi from '../../Api/service/demoapi'
import * as jwt from '../../Api/service/jwt'
import actions from './actions'

const mapAuthProviders = {
  jwt: {
    login: jwt.login,
    register: jwt.register,
    currentAccount: jwt.currentAccount,
    logout: jwt.logout,
  },
}

export function* LOGIN({ payload }) {
  const { username, password } = payload
  // mark loading
  yield put({ type: 'user/SET_STATE', payload: { loading: true } })

  // defensive: settings may not exist yet in the store
  const { authProvider: autProviderName = 'jwt' } = yield select((state) => state.settings || {})
  // pick provider safely
  const provider = mapAuthProviders[autProviderName] || mapAuthProviders['jwt']

  console.log('[LOGIN saga] starting login, provider:', autProviderName, { username })
  console.log('[LOGIN saga] payload:', { username, password })

  try {
    const success = yield call(provider.login, password, username)
    console.log('[LOGIN saga] provider.login returned:', success)

    // Normalize response shape: handle axios response, arrays, or nested data
  let respRaw = success
  if (Array.isArray(success)) respRaw = success[0]
  if (success && success.data && Array.isArray(success.data)) respRaw = success.data[0] || success.data
  const resp = respRaw?.data || respRaw || null

  if (resp) {
  // Accept multiple token field names returned by different backends
  const token = resp?.token || resp?.jwtToken || resp?.accessToken || null
    if (token) {
      const usernrole = resp.role
      const nameuser = resp.name
      const userimg = resp.masterUserInfo?.logoIMGPath
      const userbackground = resp.masterUserInfo?.backGroundIMGPath
      const userFirName = resp.masterUserInfo?.userFirstName
      const userLstName = resp.masterUserInfo?.userLastName

      yield put({
        type: 'user/SET_STATE',
        payload: {
          id: '1',
          name: nameuser,
          email: '',
          role: usernrole,
          authorized: true,
          userlogo: userimg,
          userbgimg: userbackground,
          userfullname: `${userFirName}${' '}${userLstName}`,
        },
      })
      // Parse menu safely (it might be a JSON string or already an object)
      let menuData = null
      try {
        menuData = typeof resp.menu === 'string' ? JSON.parse(resp.menu) : resp.menu
      } catch (e) {
        console.warn('[LOGIN saga] failed to parse menu:', e)
        menuData = resp.menu || null
      }

      if (menuData) {
        yield store.set('app.menu', menuData)

        yield put({
          type: 'menu/SET_STATE',
          payload: {
            menuData,
          },
        })
      }

      // Show notification first so it isn't lost if navigation reloads the page
      console.debug('[LOGIN saga] login success, notifying user:', { usernrole })
      notification.success({
        message: 'Logged In',
        description: `Welcome Back ! ${usernrole}`,
      })

      // Navigate after a short delay so the toast is visible
      try {
        const destination = '/onboard?default=ProductionDashboard'
        // Attempt to navigate via the shared history (if the app uses a HistoryRouter)
        try {
          if (history && typeof history.push === 'function') {
            history.push(destination)
          }
        } catch (e) {
          // ignore
        }

        // Always set window.location.href as a robust fallback (works for BrowserRouter/HashRouter)
        try {
          setTimeout(() => {
            try { window.location.href = destination } catch (e) {}
          }, 350)
        } catch (e) {
          // ignore
        }
      } catch (err) {
        // last-resort fallback
        try { setTimeout(() => { window.location.href = '/onboard?default=ProductionDashboard' }, 350) } catch (e) {}
      }
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
      // Only show login failed notification if we're not logged in
      if (!token) {
        notification.success({
          message: 'Login Failed',
          description: success.returnMsg || 'Invalid credentials',
        })
      }
    }
  }
  if (!success) {
    // Only show login failed notification if we're not logged in
    const isAuthorized = yield select(state => state.user.authorized)
    if (!isAuthorized) {
      notification.success({
        message: 'Login Failed',
        description: 'Something went wrong! Check your internet connection.',
      })
    }
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
} catch (err) {
  // Ensure any runtime error during login clears the loading flag and is surfaced
  console.error('[LOGIN saga] unexpected error during login:', err?.response || err)
  try {
    yield put({
      type: 'user/SET_STATE',
      payload: { loading: false },
    })
  } catch (e) {
    // ignore put failure
  }

  // Only show login failed notification if we're not logged in
  const isAuthorized = yield select(state => state.user.authorized)
  if (!isAuthorized) {
    // Try to show a user-friendly message if available
    const errMsg = err?.response?.data?.message || err?.message || 'Login failed'
    try {
      notification.error({
        message: 'Login Failed',
        description: errMsg,
      })
    } catch (e) {}
  }
}

}
export function* REGISTER({ payload }) {
  const { email, password, name } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[authProvider].register, email, password, name)
  if (success) {
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
    yield history.push('/')
    notification.success({
      message: 'Succesful Registered',
      description: 'You have successfully registered!',
    })
  }
  if (!success) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider } = yield select(state => state.settings)
  const response = yield call(mapAuthProviders[authProvider].currentAccount)

  if (response) {
    const username = store.get('adminname')
    const userrole = store.get('adminrole')
    const fistnam = store.get('firstname')
    const lastnam = store.get('lastname')
    const logdsj = store.get('logopath')
    const bgfjs = store.get('bgimg')

    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: '1',
        name: username,
        email: '',
        role: userrole,
        authorized: true,
        userlogo: logdsj,
        userbgimg: bgfjs,
        userfullname: `${fistnam}${' '}${lastnam}`,
      },
    })
  }
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  const { authProvider } = yield select(state => state.settings)
  yield call(mapAuthProviders[authProvider].logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      name: '',
      role: '',
      email: '',
      avatar: '',
      authorized: false,
      loading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.REGISTER, REGISTER),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}