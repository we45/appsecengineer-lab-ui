import { defineStore } from 'pinia'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Notify, LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useConfirmUser = defineStore('confirmUser', () => {
  const isFetch = ref(false)
  const verificationOptional = ref(false)
  const verificationFixed = ref(false)
  const resendCodeStatus = ref(false)
  const resendCodeLinkStatus = ref(false)
  const isError = ref('')
  const token = ref('')
  const refreshToken = ref('')
  const accessToken = ref('')
  const expTime = ref('')
  const email = ref('')
  const isSetNewPassword = ref(false)
  const errorConfirmUser = ref({
    old_password: false,
    old_password_msg: '',
    new_password: false,
    new_password_msg: '',
    email: false,
    email_msg: '',
    confirm_password: false,
    confirm_password_msg: ''
  })
  const errorConfirmCode = ref({ status: false, code: false, code_msg: '', email: false, email_msg: '' })
  const errorResendCode = ref({ status: false, email: false, email_msg: '' })
  const errorResendCodeLink = ref({ status: false, access_token: false, access_token_msg: '' })
  const errorConfirmVerificationOptional = ref({ status: false, access_token: false, access_token_msg: '' })
  const errorConfirmVerificationFixed = ref({ status: false, access_token: false, access_token_msg: '', code: false, code_msg: '' })

  const router = useRouter()

  async function manageLoading(callback, errCallback = undefined) {
    try {
      return await callback()
    } catch (error) {
      console.log(error)
      return errCallback ? errCallback(error) : undefined
    } finally {
    }
  }
  function isConfirmUserStatus(payload) {
    isFetch.value = payload
  }
  function isResendCodeStatus(data) {
    resendCodeStatus.value = data
  }
  function errorMsgResetVerificationFixed(data) {
    errorConfirmVerificationFixed.value = Object.assign(errorConfirmVerificationFixed, data)
  }

  const getAssignedObject = (old, newData) => Object.assign(old, newData)

  function confirmUser(payload) {
    return manageLoading(
      async () => {
        isFetch.value = true
        errorConfirmUser.value = getAssignedObject(errorConfirmUser.value, {
          old_password: false,
          old_password_msg: '',
          new_password: false,
          new_password_msg: '',
          email: false,
          email_msg: ''
        })
        const res = await api.post('confirm-signup', payload)
        res.data.success
          ? router.push('/')
          : Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: res.data.message
            })
        isFetch.value = false
      },
      (error) => {
        isFetch.value = false
        isError.value = error
        if (error.response.status === 400) {
          const err_msgs = {
            old_password: false,
            old_password_msg: '',
            new_password: false,
            new_password_msg: '',
            email: false,
            email_msg: '',
            confirm_password: false,
            confirm_password_msg: ''
          }
          const { old_password, new_password, email } = error.response.data.message
          if (old_password) {
            err_msgs.old_password = true
            err_msgs.old_password_msg = typeof old_password === 'object' ? old_password.toString() : old_password
          }
          if (new_password) {
            err_msgs.new_password = true
            err_msgs.new_password_msg = typeof new_password === 'object' ? new_password.toString() : new_password
          }
          if (email) {
            err_msgs.email = true
            err_msgs.email_msg = typeof email === 'object' ? email.toString() : email
          }
          errorConfirmUser.value = getAssignedObject(errorConfirmUser.value, err_msgs)
          if (typeof error.response.data.message !== 'string') return false
        }
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    )
  }

  function confirmCode(payload) {
    return manageLoading(
      async () => {
        isFetch.value = true
        const errDetails = { status: false, code: false, code_msg: '', email: false, email_msg: '' }
        errorConfirmCode.value = getAssignedObject(errorConfirmCode.value, errDetails)
        const res = await axios.post('signup/confirm', payload)
        if (res.data.success) {
          router.push('/')
          errDetails.status = true
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: res.data.message
          })
        }
        errorConfirmCode.value = getAssignedObject(errorConfirmCode.value, errDetails)
        isFetch.value = false
      },
      (error) => {
        isFetch.value = true
        errorConfirmUser.value = getAssignedObject(errorConfirmUser.value, error)
        if (error.response.status === 400) {
          const err_msgs = { status: false, code: false, code_msg: '', email: false, email_msg: '' }
          const { code, email } = error.response.data.message
          if (code) {
            err_msgs.code = true
            err_msgs.code_msg = typeof code === 'object' ? code.toString() : code
          }
          if (email) {
            err_msgs.email = true
            err_msgs.email_msg = typeof email === 'object' ? email.toString() : email
          }
          errorConfirmCode.value = getAssignedObject(errorConfirmCode.value, err_msgs)
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      }
    )
  }

  function resendCode(payload) {
    return manageLoading(
      async () => {
        resendCodeStatus.value = true
        const errDetails = { status: false, email: false, email_msg: '' }
        const res = await axios.post('signup/resend-code', payload)
        errDetails.status = res.data.success
        errorResendCode.value = errDetails
        Notify.create({
          type: res.data.success ? 'positive' : 'negative',
          position: 'top',
          progress: true,
          ...(res.data.success ? [{ icon: 'warning' }] : []),
          message: res.data.success ? 'Email verification code has been sent' : res.data.message
        })
        resendCodeStatus.value = false
      },
      (error) => {
        resendCodeStatus.value = false
        if (error.response.status === 400) {
          const err_msgs = { status: false, email: false, email_msg: '' }
          const { email } = error.response.data.message
          if (email) {
            err_msgs.email = true
            err_msgs.email_msg = typeof email === 'object' ? email.toString() : email
          }
          errorResendCode.value = err_msgs
          if (typeof error.response.data.message === 'string') return
        }
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      }
    )
  }

  function resendCodeLink(payload) {
    return manageLoading(
      async () => {
        resendCodeLinkStatus.value = true
        errorConfirmCode.value = getAssignedObject(errorConfirmCode.value, {
          status: false,
          access_token: false,
          access_token_msg: ''
        })
        const res = await api.post('signup/email/verify', payload)
        if (res.data.success) {
          errorConfirmCode.value = getAssignedObject(errorConfirmCode.value, {
            status: true,
            access_token: false,
            access_token_msg: ''
          })
          const userInfo = LocalStorage.getItem('user')
          Notify.create({
            type: 'positive',
            position: 'top',
            progress: true,
            message: `Verification code has been sent to ${userInfo.email}.`
          })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
        resendCodeLinkStatus.value = false
      },
      (error) => {
        resendCodeLinkStatus.value = false
        if (error.response.status === 400) {
          const err_msgs = { status: false, access_token: false, access_token_msg: '' }
          const { access_token } = error.response.data.message
          if (access_token) {
            err_msgs.access_token = true
            err_msgs.access_token_msg = typeof access_token === 'object' ? access_token.toString() : access_token
          }
          errorResendCodeLink.value = err_msgs
          if (typeof error.response.data.message !== 'string') return
        }
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      }
    )
  }

  function confirmVerificationFixed(payload) {
    return manageLoading(
      async () => {
        verificationFixed.value = true
        errorConfirmVerificationFixed.value = { status: false, access_token: false, access_token_msg: '', code: false, code_msg: '' }
        const res = await api.post('signup/email/confirm', payload)
        if (res.data.success) {
          errorConfirmVerificationFixed.value = { status: true, access_token: false, access_token_msg: '', code: false, code_msg: '' }
          LocalStorage.remove('verify')
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
        verificationFixed.value = false
      },
      (error) => {
        verificationFixed.value = false
        if (error.response.status === 400) {
          const err_msgs = {
            status: false,
            access_token: false,
            access_token_msg: '',
            code: false,
            code_msg: ''
          }
          const { access_token, code } = error.response.data.message
          if (access_token) {
            err_msgs.access_token = true
            err_msgs.access_token_msg = typeof access_token === 'object' ? access_token.toString() : access_token
          }
          if (code) {
            err_msgs.code = true
            err_msgs.code_msg = typeof code === 'object' ? code.toString() : code
          }
          errorConfirmVerificationFixed.value = err_msgs
        }
        if (typeof error.response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }

  return {
    isFetch,
    verificationOptional,
    verificationFixed,
    resendCodeStatus,
    resendCodeLinkStatus,
    isError,
    token,
    refreshToken,
    accessToken,
    expTime,
    email,
    isSetNewPassword,
    errorConfirmUser,
    errorConfirmCode,
    errorResendCode,
    errorResendCodeLink,
    errorConfirmVerificationOptional,
    errorConfirmVerificationFixed,
    confirmUser,
    resendCode,
    confirmCode,
    confirmVerificationFixed,
    resendCodeLink,
    isConfirmUserStatus,
    isResendCodeStatus,
    errorMsgResetVerificationFixed
  }
})
