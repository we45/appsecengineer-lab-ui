import axios from 'axios'
import config from '../config'
import { return_success_refresh_token } from './saveNewToken'
import { LocalStorage } from 'quasar'

const jwtToken = LocalStorage.getItem('token')

const instance = axios.create({
  baseURL: config.baseURLApi,
  headers: {
    Authorization: jwtToken
  }
})
instance.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    if (error.response.status === 401) {
      if (error.response.data.message === 'The incoming token has expired') {
        return return_success_refresh_token(error.response.data.message).then(async (refreshTokenResponse) => {
          await axios.interceptors.request.use(async function (config) {
            const token = LocalStorage.getItem('token')
            config.headers.Authorization = token
            return config
          })
          if (refreshTokenResponse === LocalStorage.getItem('token')) {
            const reCallApi = error.response.config
            reCallApi.headers.Authorization = LocalStorage.getItem('token')
            instance.interceptors.request.use((request) => {
              request.headers.Authorization = LocalStorage.getItem('token')
              return request
            })
            return axios(reCallApi)
          }
        })
      } else if (error.response.data.message === 'Unauthorized') {
        window.location.href = '/'
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default instance
