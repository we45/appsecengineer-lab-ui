import jwt_decode from 'jwt-decode'
import { defineStore } from 'pinia'
import { LocalStorage, Notify } from 'quasar'
import config from 'src/config'
import { reactive } from 'vue'
import { apiMacroMeta, api } from 'src/boot/axios'

const useLoginStore = defineStore('loginStore', {
  state: () => ({
    token: '',
    refreshToken: '',
    accessToken: '',
    expTime: '',
    email: '',
    isLoggedIn: false, // used in place of isLogged
    isVerify: false,
    isError: false,
    isVerifyError: false,
    errormsg: '',
    welcome: false,
    errorMsgStatus: false,
    queryParamRedirection: '',
    isUserTypeChange: LocalStorage.getItem('type'),
    isUserSubsChange: LocalStorage.getItem('subs_'),
    statusOfApi: false,
    user: reactive(LocalStorage.getItem('user') ?? {}),
    isLoading: false,
    is_security_champion: Boolean(LocalStorage.getItem('is_security_champion')),
    security_champion_teams: JSON.parse(LocalStorage.getItem('security_champion_teams') || '[]')
  }),
  actions: {
    async LOGIN_SUCCESS(token) {
      LocalStorage.set('timeStampLogin', '')
      const decodedData = jwt_decode(token.IdToken)
      this.token = token.IdToken
      this.refreshToken = token.RefreshToken
      this.accessToken = token.AccessToken
      const date = new Date()
      const expSetTime = date.setSeconds(date.getSeconds() + 14400)
      this.expTime = expSetTime
      this.email = decodedData.email
      LocalStorage.set('token', this.token)
      LocalStorage.set('expTime', this.expTime)
      LocalStorage.set('rtoken', this.refreshToken)
      LocalStorage.set('publishLoginAPi', 'on')
      const user = {
        email: decodedData.email,
        firstName: decodedData.given_name,
        lastName: decodedData.family_name,
        picture: `${decodedData.picture ? `https://${decodedData.picture}` : ''}`
      }

      LocalStorage.set('user', user)
      if (token.verify) {
        if (token.verify === 'OPTIONAL') {
          LocalStorage.set('verify', 'OPTIONAL')
        } else if (token.verify === 'FORCE') {
          LocalStorage.set('verify', 'FORCE')
        }
      }
      const localStorgeRedirection = LocalStorage.getItem('queryParamRedirection', '')
      if (localStorgeRedirection !== null && localStorgeRedirection !== undefined && localStorgeRedirection !== '') {
        if (localStorgeRedirection.length > 8) {
          window.location.href = this.queryParamRedirection
          LocalStorage.set('queryParamRedirection', '')
          LocalStorage.set('timeStampLogin', '')
        } else {
          if (token.type === 'FT') {
            window.location = '/portal/upgrade'
          } else {
            window.location = '/portal/running-labs'
          }
          LocalStorage.set('timeStampLogin', '')
        }
      } else {
        const redirectUrl = LocalStorage.getItem('redirectUrl', '')
        if (redirectUrl) {
          window.location.href = decodeURIComponent(redirectUrl)
          LocalStorage.remove('redirectUrl')
        } else {
          window.location = '/portal/running-labs'
        }
      }
    },
    STATUS_OF_API(data) {
      this.statusOfApi = data
    },
    IS_USER_TYPE_CHANGE(data) {
      this.isUserTypeChange = data
    },
    IS_USER_SUBS_CHANGE(data) {
      this.isUserSubsChange = data
    },
    REFRESH_TOKEN(token) {
      const decodedData = jwt_decode(token.IdToken)
      this.token = token.IdToken
      this.accessToken = token.AccessToken
      const date = new Date()
      const expSetTime = date.setSeconds(date.getSeconds() + 14400)
      this.expTime = expSetTime
      this.email = decodedData.email
      LocalStorage.set('token', this.token)
      LocalStorage.set('expTime', this.expTime)
    },
    IS_LOGIN_STATUS(data) {
      this.isLoggedIn = data
    },
    IS_VERIFY_STATUS(data) {
      this.isVerify = data
    },
    IS_LOGIN_ERROR(data) {
      this.isError = data
    },
    IS_VERIFY_ERROR(data) {
      this.isVerifyError = data
    },
    IS_LOGIN_ERROR_MSG(data) {
      this.errormsg = data
    },
    WELCOME_STATUS(data) {
      this.welcome = data
    },
    ERROR_MSG_STATIS(data) {
      this.errorMsgStatus = data
    },
    SET_QUERY_PARAM_URL(data) {
      this.queryParamRedirection = data
    },
    IS_VALID_RECAPTCH(data) {
      this.validRecaptch = data
    },
    afterRecaptchValid(payload) {
      this.IS_VALID_RECAPTCH(payload)
    },
    isLoginErrorDisable() {
      this.IS_LOGIN_ERROR(false)
      this.ERROR_MSG_STATIS(false)
      this.IS_LOGIN_ERROR_MSG(' ')
    },

    /**
     * isLoginStatus changed to setLoginStatus
     */
    setLoginStatus(payload) {
      this.IS_LOGIN_ERROR(false)
      this.IS_LOGIN_STATUS(payload)
    },
    isVerifyStatus(payload) {
      this.IS_VERIFY_ERROR(false)
      this.IS_VERIFY_STATUS(payload)
    },
    setQueryParamUrl(payload) {
      this.SET_QUERY_PARAM_URL(payload)
    },
    setUserType(payload) {
      this.IS_USER_TYPE_CHANGE(payload)
      LocalStorage.set('type', payload)
    },
    setUserSubs(payload) {
      LocalStorage.set('subs_', payload)
      this.IS_USER_SUBS_CHANGE(payload)
    },
    loginUser(payload) {
      LocalStorage.set('trial', 'false')
      LocalStorage.remove('verify')
      LocalStorage.remove('isOwasp')
      api
        .post('login', payload)
        .then((res) => {
          this.IS_LOGIN_STATUS(false)
          if (res.data.message === 'Confirm Password') {
            this.router.push('/confirm-user')
          } else if (res.data.success) {
            LocalStorage.set('isOwasp', res.data.data.mem)
            LocalStorage.set('trial', res.data.data.trial)
            LocalStorage.set('is_admin', res.data.data.is_admin)
            LocalStorage.set('type', res.data.data._type)
            LocalStorage.set('sub_', res.data.data.subs)
            LocalStorage.set('is_security_champion', Boolean(res.data.data.is_security_champion))
            LocalStorage.set('security_champion_teams', JSON.stringify(res.data.data.security_champion_teams || []))
            this.LOGIN_SUCCESS({ ...res.data.data, ...{ type: res.data.data._type } })

            LocalStorage.remove('userId')

            this.WELCOME_STATUS(true)
            this.IS_VALID_RECAPTCH(false)
            setTimeout(() => {
              this.WELCOME_STATUS(false)
            }, 1000)
            // }

            this.ERROR_MSG_STATIS(false)
          } else {
            if (res.data.message === 'Company subscription has been expired') {
              this.router.push('/subscription-expired')
            } else if (res.data.message === 'Subscription has been expired') {
              this.router.push('/individual-subscription-expired')
            } else {
              this.IS_LOGIN_STATUS(false)
              this.IS_LOGIN_ERROR(true)
              this.ERROR_MSG_STATIS(true)
              this.IS_VALID_RECAPTCH(false)
              this.IS_LOGIN_ERROR_MSG(res.data.data)
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
            }
          }
        })
        .catch((error) => {
          this.IS_LOGIN_STATUS(false)
          this.IS_LOGIN_ERROR(true)
          this.ERROR_MSG_STATIS(true)
          this.IS_VALID_RECAPTCH(false)
          this.IS_LOGIN_ERROR_MSG(error)
          if (error.response.status === 400) {
            if (error.response.data.message === 'User account not verified! Please confirm signup') {
              this.router.push('/login')
            }
          }

          if (error.toString() === 'Error: Network Error') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
          } else if (error.response.data.message !== 'User account not verified! Please confirm signup') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        })
    },
    SET_IS_LOADING(payload) {
      this.isLoading = payload
    },
    async loginUserVerify(payload, router) {
      LocalStorage.set('trial', 'false')
      LocalStorage.remove('verify')

      try {
        const response = await api.post('auth/respond', payload)
        this.IS_VERIFY_STATUS(false)

        if (response.data.success) {
          const { data } = response.data
          console.log(data)

          this.LOGIN_SUCCESS({ ...data.AuthenticationResult, ...{ type: data.custom._type } })
          LocalStorage.set('trial', data.custom.trial)
          LocalStorage.set('is_admin', data.custom.is_admin)
          LocalStorage.set('manager', data.custom.manager)
          LocalStorage.set('type', data.custom._type)
          LocalStorage.set('sub_', data.custom.sub_)
          LocalStorage.set('is_security_champion', Boolean(data.custom.is_security_champion))
          LocalStorage.set('security_champion_teams', JSON.stringify(data.custom.security_champion_teams || []))
          LocalStorage.remove('userId')
        } else {
          const { message, data } = response.data
          switch (message) {
            case 'Company subscription has been expired':
              router.push('/subscription-expired')
              break
            case 'Subscription has been expired':
              router.push('/individual-subscription-expired')
              break
            default:
              this.IS_LOGIN_STATUS(false)
              this.IS_LOGIN_ERROR(true)
              this.ERROR_MSG_STATIS(true)
              this.IS_VALID_RECAPTCH(false)
              this.IS_LOGIN_ERROR_MSG(data)
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message })
              break
          }
        }
      } catch (error) {
        this.IS_VERIFY_STATUS(false)
        this.IS_VERIFY_ERROR(true)

        switch (error.response.status) {
          case 400:
            if (error.response.data.message.session) {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Session Expired' })
            } else if (error.response.data.message === 'Wrong code') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Invalid link' })
            } else if (error.response.data.message === 'Code has expired') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Code has expired' })
            } else if (error.toString() === 'Error: Network Error') {
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: 'Please check your internet connection'
              })
            } else {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
            }
            router.push({ name: 'login', query: { email: payload.username } })
            // router.push('/login')
            break
          case 403:
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Not Authorized' })
            // router.push('/login')
            break
          case error.response.status >= 500:
            if (typeof error.response.data.message === 'string') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server error' })
              router.push('/login')
            }
            break
          default:
            router.push('/login')
            break
        }
      }
    },

    async refreshToken() {
      const rtoken = LocalStorage.getItem('rtoken')
      const payload = {
        refresh_token: rtoken
      }
      await api
        .post('user/refresh-token', payload, {
          headers: {
            Authorization: LocalStorage.getItem('token')
          }
        })
        .then((res) => {
          if (res.data.success) {
            this.REFRESH_TOKEN(res.data.data.AuthenticationResult)
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            LocalStorage.remove('startTime')
            LocalStorage.remove('expTime')
            LocalStorage.remove('token')
            LocalStorage.remove('rtoken')
            LocalStorage.remove('userId')
            LocalStorage.remove('user')
            LocalStorage.remove('provisionInfo')
            LocalStorage.remove('is_admin')
            LocalStorage.remove('trial')
            LocalStorage.remove('isOwasp')
            LocalStorage.remove('sub_')
            LocalStorage.remove('is_security_champion')
            LocalStorage.remove('security_champion_teams')
            this.router.push('/')
          }
        })
      await apiMacroMeta
        .post('publish-login', {})
        .then(async (res) => res.data)
        .catch(async (error) => error)
        .finally(() => {})
    },
    // async refreshToken() {
    //   const refreshToken = LocalStorage.getItem('rtoken')
    //   try {
    //   } catch (error) {}
    // },
    async loginData(payload) {
      this.STATUS_OF_API(false)

      await api
        .post('auth/signin', payload)
        .then((res) => {
          if (res.data.success) {
            this.STATUS_OF_API(true)
            this.IS_LOGIN_STATUS(false)
          }
        })
        .catch((error) => {
          this.STATUS_OF_API(false)
          this.IS_LOGIN_STATUS(false)
          if (error.response.status === 400) {
            if (typeof error.response.data.message === 'string') {
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: 'Invalid email address.'
              })
            }
          } else {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
          LocalStorage.remove('startTime')
          LocalStorage.remove('expTime')
          LocalStorage.remove('token')
          LocalStorage.remove('rtoken')
          LocalStorage.remove('userId')
          LocalStorage.remove('user')
          LocalStorage.remove('provisionInfo')
          LocalStorage.remove('is_admin')
          LocalStorage.remove('trial')
          LocalStorage.remove('isOwasp')
          LocalStorage.remove('sub_')
          LocalStorage.remove('is_security_champion')
          LocalStorage.remove('security_champion_teams')
          this.router.push('/')
        })
    },
    logout() {
      LocalStorage.remove('startTime')
      LocalStorage.remove('expTime')
      LocalStorage.remove('token')
      LocalStorage.remove('rtoken')
      LocalStorage.remove('user')
      LocalStorage.remove('provisionInfo')
      LocalStorage.remove('is_admin')
      LocalStorage.remove('trial')
      LocalStorage.remove('sub_')
      LocalStorage.remove('is_security_champion')
      LocalStorage.remove('security_champion_teams')
    },

    // New Implementation
    async loginWithSso(payload) {
      try {
        this.SET_IS_LOADING(true)
        const res = await api.post(`tenantmatch`, payload)
        if (res.data.success) {
          window.location.replace(
            `https://${config.tenantBaseUrl}/authorize?response_type=code&identity_provider=${res.data.data.provider}&client_id=${config.clientTenantId}&redirect_uri=https://${config.tenantCallbackUrl}/callback`
          )
        }
      } catch (error) {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Invalid request'
        })
      } finally {
        this.SET_IS_LOADING(false)
      }
    }
  },
  getters: {
    hasToken(state) {
      return LocalStorage.has('token') && LocalStorage.getItem('token') !== null
    },
    loginStatus(state) {
      return state.isLoggedIn
    },
    verifyStatus(state) {
      return state.isVerify
    },
    fetchToken(state) {
      return state.token
    },
    loginWelcome(state) {
      return state.welcome
    },
    loginErrorStatus(state) {
      return state.isError
    },
    loginVerifyErrorStatus(state) {
      return state.isVerifyError
    },
    loginErrorMessage(state) {
      return state.errormsg
    },
    loginErrorMessageStatus(state) {
      return state.errorMsgStatus
    },
    isCompanyAdmin() {
      const isCmpAdmin = LocalStorage.getItem('is_admin', false)
      if (isCmpAdmin === 'undefined') return false
      return isCmpAdmin
    },

    isCompanyManager() {
      const isCmpManager = LocalStorage.getItem('manager', false)
      if (isCmpManager === 'undefined') return false
      return isCmpManager
    },
    isTrial() {
      return LocalStorage.getItem('trial')
    },
    isSubs() {
      return LocalStorage.getItem('sub_') ? LocalStorage.getItem('sub_') !== 'true' : true
    },
    parentUser() {
      // const isTrialPeriod = Boolean(LocalStorage.getItem('trial'))
      // // const a = Boolean(isCmpAdmin);
      // const a = LocalStorage.getItem('trail') === 'false' ? false : true
      return LocalStorage.getItem('sub_') ? LocalStorage.getItem('sub_') : false
    },
    verifyUserType() {
      return LocalStorage.getItem('verify') || ''
    },
    isUserType(state) {
      // const isFreeUserInfo = LocalStorage.getItem('type')
      // const a = Boolean(isCmpAdmin);
      return state.isUserTypeChange ? state.isUserTypeChange : LocalStorage.getItem('type')
    },
    fetchUserInfo() {
      const userInfo = LocalStorage.getItem('user')
      return userInfo
    },
    apiStatus(state) {
      return state.statusOfApi
    },
    isIndividualUser() {
      const token = LocalStorage.getItem('token')
      const decoded = jwt_decode(token ?? '')
      return !decoded?.hasOwnProperty('custom:company_id')
    },
    isSecurityChampion() {
      return Boolean(LocalStorage.getItem('is_security_champion'))
    },
    securityChampionTeams() {
      return JSON.parse(LocalStorage.getItem('security_champion_teams') || '[]')
    }
  }
})

export { useLoginStore }
