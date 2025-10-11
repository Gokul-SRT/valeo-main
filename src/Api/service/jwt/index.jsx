import apiClient from '../../fakeapi'
import serverApi from '../serverAPI'
import store from 'store'

// Helper: Set cookie
function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; SameSite=Lax; expires=${expires}`;
  // For HTTPS cross-port in production, use:
  // document.cookie = `${name}=${value}; path=/; SameSite=None; Secure; expires=${expires}`;
}

// Helper: Delete cookie
function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export async function login(password, username) {
  return serverApi
    .post(
      `authenticate`,
      { password, username },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      if (!response) return false

      const data = response.data || {}
      const token = data.token || data.jwtToken || data.accessToken || null

      if (token) {
        try { store.set('accessToken', token) } catch (e) {}
        try { localStorage.setItem('accessToken', token) } catch (e) {}
        setCookie('accessToken', token) // ✅ store cookie

        if (data.masterUserInfo) {
          try { store.set('tenantId', data.masterUserInfo.tenantId) } catch(e){}
          try { store.set('branchCode', data.masterUserInfo.branchCode) } catch(e){}
          try { store.set('bgimg', data.masterUserInfo.backGroundIMGPath) } catch(e){}
          try { store.set('logopath', data.masterUserInfo.logoIMGPath) } catch(e){}
          try { store.set('firstname', data.masterUserInfo.userFirstName) } catch(e){}
          try { store.set('lastname', data.masterUserInfo.userLastName) } catch(e){}
        }

        try { store.set('adminname', data.name) } catch(e){}
        try { store.set('adminrole', data.role) } catch(e){}
      }

      try { setJwtFromResponse(data) } catch(e) {}

      return data
    })
    .catch(err => {
      console.error(err)
      throw err
    })
}

export function setJwtFromResponse(respData) {
  if (!respData) return null
  const data = Array.isArray(respData) ? respData[0] : respData
  if (!data || typeof data !== 'object') return null

  const token = data?.jwtToken || data?.token || data?.accessToken || null
  if (token) {
    try { store.set('accessToken', token) } catch(e){}
    try { localStorage.setItem('accessToken', token) } catch(e){}
    setCookie('accessToken', token) // ✅ store cookie
  }

  if (data?.tenantID) store.set('tenantId', data.tenantID)
  else if (data?.tenantId) store.set('tenantId', data.tenantId)
  else if (data?.masterUserInfo?.tenantId) store.set('tenantId', data.masterUserInfo.tenantId)

  if (data?.userName) store.set('username', data.userName)
  if (data?.empFirstNane) store.set('firstname', data.empFirstNane)
  if (data?.empLastName) store.set('lastname', data.empLastName)
  if (data?.empID) store.set('empID', data.empID)

  if (data?.roleName) store.set('adminrole', data.roleName)
  if (data?.roleCode) store.set('roleCode', data.roleCode)
  if (data?.landingPageId) store.set('landingPageId', data.landingPageId)

  return token
}

export async function register(email, password, name) {
  return apiClient
    .post('/auth/register', { email, password, name })
    .then(response => {
      if (!response) return false
      const { accessToken } = response.data
      if (accessToken) {
        store.set('accessToken', accessToken)
        localStorage.setItem('accessToken', accessToken)
        setCookie('accessToken', accessToken) // ✅ store cookie
        store.set('tenantId', 're')
        store.set('branchCode', 'rev')
      }
      return response.data
    })
    .catch(err => console.error(err))
}

export async function currentAccount() {
  store.set('accessToken', store.get('accessToken'))
  store.set('tenantId', store.get('tenantId'))
  store.set('branchCode', store.get('branchCode'))
  store.set('adminrole', store.get('adminrole'))
  store.set('adminname', store.get('adminname'))
  store.set('menu', store.get('menu'))

  return store.get('accessToken')
}

export async function logout() {
  return apiClient
    .get('/auth/logout')
    .then(() => {
      store.remove('accessToken')
      localStorage.removeItem('accessToken')
      deleteCookie('accessToken') // ✅ remove cookie
      return true
    })
    .catch(err => console.error(err))
}
