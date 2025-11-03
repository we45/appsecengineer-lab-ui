import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useRouter, useRoute } from 'vue-router'
const useAuthStore = defineStore('authStore', () => {
  const router = useRouter()
  const route = useRoute()

  async function validateToken(payload = {}) {
    try {
      const { data } = await api.post('token-exchange', payload)
      if (data.success) {
        setLoginData(data?.data)
      } else {
        setExpiredData(data)
      }
      return data
    } catch (err) {
      catchError(err.response, payload)
      return err
    }
  }

  function setLoginData(data) {
    LocalStorage.set('timeStampLogin', '')
    const decodedData = jwtDecode(data.id_token)
    LocalStorage.set('token', data.id_token)
    LocalStorage.set('rtoken', data.refresh_token)
    LocalStorage.set('publishLoginAPi', 'on')
    const user = {
      email: decodedData.email,
      firstName: decodedData.given_name,
      lastName: decodedData.family_name,
      picture: `${decodedData.picture ? `https://${decodedData.picture}` : ''}`
    }

    LocalStorage.set('trial', data.custom.trial)
    LocalStorage.set('is_admin', data.custom.is_admin)
    LocalStorage.set('type', data.custom._type)
    LocalStorage.set('sub_', data.custom.sub_)
    LocalStorage.set('user', user)
    const redirectUrl = LocalStorage.getItem('redirectUrl', '')
    if (redirectUrl) {
      window.location.href = decodeURIComponent(redirectUrl)
      LocalStorage.remove('redirectUrl')
    } else {
      window.location = '/portal/running-labs'
    }
  }

  function setExpiredData(data) {
    switch (data.message) {
      case 'Company subscription has been expired':
        router.push('/subscription-expired')
        break
      case 'Subscription has been expired':
        router.push('/individual-subscription-expired')
        break
      default:
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: data.message })
        router.push({ name: 'login' })
        break
    }
  }

  function catchError(response, payload) {
    switch (response.status) {
      case 400:
        if (response.data.message.session) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Session Expired' })
        } else if (response.data.message === 'Wrong code') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Invalid link' })
        } else if (response.data.message === 'Code has expired') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Code has expired' })
        } else if (response.toString() === 'Error: Network Error') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: 'Please check your internet connection'
          })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: response.data.message })
        }
        router.push({ name: 'login', query: { email: payload.username } })
        // router.push('/login')
        break
      case 403:
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Not Authorized' })
        break
      case response.status >= 500:
        if (typeof response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server error' })
          router.push({ name: 'login', query: { redirect: route.fullPath } })
        }
        break
      default:
        router.push({ name: 'login', query: { redirect: route.fullPath } })
        break
    }
  }

  return {
    validateToken
  }
})

export { useAuthStore }
