import axios from 'axios'
import store from 'store'
import { notification } from 'antd'

const apiServer = axios.create({
  baseURL: 'http://localhost:8901/',
  // http://15.206.108.18/
  // http://10.130.15.79:5000/10.103.20.30
  // timeout: 1000,
  headers: { 
    'Content-Type': 'application/json',                   
   },
})

apiServer.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.AccessToken = accessToken
  }
  return request
})

apiServer.interceptors.response.use(undefined, errorin => {
  const { response } = errorin
  const { error } = response.data
  if (error) {
    if (error !== 'Bad Request') {
      notification.warning({
        message: error,
      })
    }
  }
})

export default apiServer
