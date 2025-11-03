import { ref } from 'vue'
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export const useMsOauthStore = defineStore('msOauth', () => {
  const isLoading = ref(false)
  const statusOfAPI = ref(false)
  const status_of_change = ref({ code: 500, data: {}, msg: '', status: false })
  const queryParamRedirection = ref('')

  function loginSuccess(token) {
    const decodedData = jwt_decode(token.id_token)
    const date = new Date()
    const expSetTime = date.setSeconds(date.getSeconds() + 14400)
    LocalStorage.set('token', token.id_token)
    LocalStorage.set('expTime', expSetTime)
    LocalStorage.set('rtoken', token.refresh_token)
    LocalStorage.set('trial', token.trial)
    LocalStorage.set('is_admin', token.is_admin)
    const user = {
      email: decodedData.email,
      firstName: decodedData.given_name,
      lastName: decodedData.family_name
    }
    LocalStorage.set('breadcrumbs', [])
    LocalStorage.set('user', user)

    if (LocalStorage.getItem('queryParamRedirection') || false) {
      window.location.href = LocalStorage.getItem('queryParamRedirection')
    } else {
      if (user.email) {
        window.location = '/portal/running-labs'
      }
    }
  }

  async function msLoginOauth() {
    try {
      statusOfAPI.value = false
      status_of_change.value = { code: 500, data: '', msg: '', status: false }
      isLoading.value = true
      const res = await api.get(
        'https://uat-appsecengineer.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=7kfpv3oqpdfkrd5h7imhd0vee4&redirect_uri=https://learning.appsecengineer.com/oauth/'
      )
      if (!res.data.success) return
      Array(['msRefreshToken', 'startTime', 'expTime', 'token', 'rtoken', 'userId', 'user', 'provisionInfo', 'is_admin', 'trial']).forEach(
        (key) => LocalStorage.remove(key)
      )
      LocalStorage.set('trial', 'false')
      LocalStorage.set('is_admin', 'false')
      statusOfAPI.value = true
    } catch (error) {
      statusOfAPI.value = false
      status_of_change.value = {
        code: error.response,
        data: error.response,
        msg: error.response.message,
        status: false
      }
    } finally {
      isLoading.value = false
    }
  }
  async function login_user(payload) {
    try {
      //const msLoginUrl = '/token-exchange'
      statusOfAPI.value = false
      const res = await axios.post('/token-exchange', payload)
      if (!res) return
      Array([
        'msRefreshToken',
        'startTime',
        'expTime',
        'token',
        'rtoken',
        'user',
        'provisionInfo',
        'is_admin',
        'trial',
        'breadCum'
      ]).forEach((key) => LocalStorage.remove(key))
      statusOfAPI.value = true
      loginSuccess(res.data.data)
    } catch (error) {
      if (error.response.status !== 400) return
      status_of_change.value = {
        code: error.response,
        data: error.response,
        msg: error.response.data.message,
        status: false
      }
      if (error.response.data.message === 'Company subscription has been expired') {
        window.location.href = window.origin + '/subscription-expired'
      } else if (error.response.data.message === 'Subscription has been expired') {
        this.$router.push('/individual-subscription-expired')
      }
      statusOfAPI.value = false
    } finally {
      isLoading.value = false
    }
  }
  return {
    isLoading,
    statusOfAPI,
    status_of_change,
    queryParamRedirection,
    msLoginOauth,
    login_user
  }
})
