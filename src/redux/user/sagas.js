import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { notification } from 'antd'
import { history } from '../../index'
import store from 'store'
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
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const { authProvider: autProviderName } = yield select(state => state.settings)
  const success = yield call(mapAuthProviders[autProviderName].login, password, username)

  if (success) {
    if (success.token) {
      const usernrole = success.role
      const nameuser = success.name
      const userimg = success.masterUserInfo.logoIMGPath
      const userbackground = success.masterUserInfo.backGroundIMGPath
      const userFirName = success.masterUserInfo.userFirstName
      const userLstName = success.masterUserInfo.userLastName

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
      const menuData = JSON.parse(success.menu)

      yield store.set(`app.menu`, menuData)

      yield put({
        type: 'menu/SET_STATE',
        payload: {
          menuData,
        },
      })

      // Show notification first so it isn't lost if navigation reloads the page
      console.debug('[LOGIN saga] login success, notifying user:', { usernrole })
      notification.success({
        message: 'Logged In',
        description: `Welcome Back ! ${usernrole}`,
      })

      // Navigate after a short delay so the toast is visible
      try {
        if (history && typeof history.push === 'function') {
          setTimeout(() => {
            try { history.push('/') } catch (e) { try { window.location.href = '/' } catch (e2) {} }
          }, 350)
        } else if (typeof window !== 'undefined') {
          setTimeout(() => { try { window.location.href = '/' } catch (e) {} }, 350)
        }
      } catch (err) {
        // last-resort fallback
        try { setTimeout(() => { window.location.href = '/' }, 350) } catch (e) {}
      }
    } else {
      yield put({
        type: 'user/SET_STATE',
        payload: {
          loading: false,
        },
      })
      notification.success({
        message: 'Logged Failed',
        description: success.returnMsg,
      })
    }
  }
  if (!success) {
    notification.success({
      message: 'Login Failed',
      description: 'Something went wrong! Check your internet connection.',
    })
    yield put({
      type: 'user/SET_STATE',
      payload: {
        loading: false,
      },
    })
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
