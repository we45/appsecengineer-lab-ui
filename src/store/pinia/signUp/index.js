import { defineStore } from 'pinia'
import { Notify, LocalStorage } from 'quasar'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'

export const useSignUpStore = defineStore('signUp', () => {
  const isRegistered = ref(false)
  const isError = ref(false)
  const errormsg = ref('')
  const isConfirm = ref(false)
  const existUser = ref(false)
  const validRecaptch = ref(false)
  const errorCreateUser = ref({
    status: false,
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: '',
    password: false,
    password_msg: '',
    confirm_password: false,
    confirm_password_msg: ''
  })
  const errorOWASPCreateUser = ref({
    status: false,
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: '',
    password: false,
    password_msg: '',
    confirm_password: false,
    confirm_password_msg: ''
  })
  const errorTrainingCreateUser = ref({
    status: false,
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: '',
    password: false,
    password_msg: '',
    confirm_password: false,
    confirm_password_msg: ''
  })
  const errorFreeUser = ref({
    status: false,
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    email: false,
    email_msg: '',
    organization: false,
    organization_msg: '',
    interests: false,
    interests_msg: '',
    role: false,
    role_msg: '',
    outcome: false,
    outcome_msg: '',
    training: false,
    training_msg: '',
    password: false,
    password_msg: '',
    confirm_password: false,
    confirm_password_msg: ''
  })
  const getCompanyAttrs = ref({ custom: [] })

  const router = useRouter()

  function isRegisterStatus(payload) {
    isError.value = false
    isRegistered.value = payload
  }
  async function userCompanySignUp(payload) {
    try {
      LocalStorage.remove('userId')
      errorCreateUser.value = {
        status: false,
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        email: false,
        email_msg: '',
        password: false,
        password_msg: '',
        confirm_password: false,
        confirm_password_msg: ''
      }
      const res = await api.post('company-signup', payload)
      if (res.data.success) {
        errorCreateUser.value = {
          status: true,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          password: false,
          password_msg: '',
          confirm_password: false,
          confirm_password_msg: ''
        }
        isRegistered.value = false
        if (res.data.message === 'User Already Exists') {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User Already Exists!!!' })
          router.push({ name: 'login' })
          isRegistered.value = false
          existUser.value = true
        } else if (res.data.message === 'Please sign in with existing credentials') {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Please sign in with existing credentials' })
          router.push({ name: 'login' })
        } else {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Congratulations! Successfully registered.' })
          router.push({ name: 'login' })
          isRegistered.value = false
        }
      } else {
        errormsg.value = res.data.message
        isRegistered.value = false
        Notify.create({ type: 'positive', position: 'top', progress: true, icon: 'warning', message: res.data.data })
      }
    } catch (error) {
      isRegistered.value = false
      isError.value = true
      errormsg.value = error
      if (error.toString() === 'Error: Network Error') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
      }
      if (error.response.status === 400) {
        const err_msgs = { status: false }
        Object.entries(payload).forEach(([key, value]) => {
          err_msgs[key] = false
          err_msgs[key + '_msg'] = ''
        })
        Object.entries(error.response.data.message).forEach(([key, value]) => {
          if (typeof error.response.data.message[key] === 'object') {
            err_msgs[key] = true
            err_msgs[key + '_msg'] = error.response.data.message[key].toString()
          } else {
            err_msgs[key] = true
            err_msgs[key + '_msg'] = value
          }
        })
        errorCreateUser.value = err_msgs
        if (error.response.data.message) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } else {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }
  async function OWASPUserSignUp(payload) {
    try {
      LocalStorage.remove('userId')
      errorOWASPCreateUser.value = {
        status: false,
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        email: false,
        email_msg: '',
        password: false,
        password_msg: '',
        confirm_password: false,
        confirm_password_msg: ''
      }
      const res = await api.post('partner/signup', payload)
      if (res.data.success) {
        errorOWASPCreateUser.value = {
          status: true,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          password: false,
          password_msg: '',
          confirm_password: false,
          confirm_password_msg: ''
        }
        isRegistered.value = false
        if (res.data.message === 'User Already Exists') {
          router.push({ name: 'login' })
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User Already Exists!!!' })
          isRegistered.value = false
          existUser.value = true
        } else if (res.data.message === 'Please sign in with existing credentials') {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Please sign in with existing credentials' })
          router.push({ name: 'login' })
        } else {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Congratulations! Successfully registered.' })
          router.push({ name: 'login' })
          isRegistered.value = false
        }
      } else {
        errormsg.value = res.data.message
        isRegistered.value = false
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.data })
      }
    } catch (error) {
      isRegistered.value = false
      isError.value = true
      errormsg.value = error
      if (error.toString() === 'Error: Network Error') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
      }
      if (error.response.status === 400) {
        const err_msgs = {
          status: false,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          password: false,
          password_msg: '',
          confirm_password: false,
          confirm_password_msg: ''
        }
        if (error.response.data.message.first_name) {
          if (typeof error.response.data.message.first_name === 'object') {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name.toString()
          } else {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name
          }
        }
        if (error.response.data.message.last_name) {
          if (typeof error.response.data.message.last_name === 'object') {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name.toString()
          } else {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name
          }
        }
        if (error.response.data.message.email) {
          if (typeof error.response.data.message.email === 'object') {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email.toString()
          } else {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email
          }
        }
        if (error.response.data.message.partner_id) {
          if (typeof error.response.data.message.partner_id === 'object') {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: `Company: ${error.response.data.message.partner_id.toString()}`
            })
          } else {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: `Company: ${error.response.data.message.partner_id}`
            })
          }
        }
        if (error.response.data.message.password) {
          if (typeof error.response.data.message.password === 'object') {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password.toString()
          } else {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password
          }
        }
        errorOWASPCreateUser.value = err_msgs
        if (
          !error.response.data.message.first_name &&
          !error.response.data.message.last_name &&
          !error.response.data.message.email &&
          !error.response.data.message.password &&
          !error.response.data.message.partner_id
        ) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } else {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }
  async function trainingUserSignUp(payload) {
    try {
      LocalStorage.remove('userId')
      errorTrainingCreateUser.value = {
        status: false,
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        email: false,
        email_msg: '',
        password: false,
        password_msg: '',
        confirm_password: false,
        confirm_password_msg: ''
      }
      const res = await api.post('training/signup', payload)
      if (res.data.success) {
        errorTrainingCreateUser.value = {
          status: true,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          password: false,
          password_msg: '',
          confirm_password: false,
          confirm_password_msg: ''
        }
        isRegistered.value = false
        if (res.data.message === 'User Already Exists') {
          router.push({ name: 'login' })
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'User Already Exists!!!' })
          isRegistered.value = false
          existUser.value = true
        } else if (res.data.message === 'Please sign in with existing credentials') {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Please sign in with existing credentials' })
          router.push({ name: 'login' })
        } else {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Congratulations! Successfully registered.' })
          router.push({ name: 'login' })
          isRegistered.value = false
        }
      } else {
        errormsg.value = res.data.message
        isRegistered.value = false
        Notify.create({ type: 'positive', position: 'top', progress: true, icon: 'warning', message: res.data.data })
      }
    } catch (error) {
      isRegistered.value = false
      isError.value = true
      errormsg.value = error
      if (error.toString() === 'Error: Network Error') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
      }
      if (error.response.status === 400) {
        const err_msgs = {
          status: false,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          password: false,
          password_msg: '',
          confirm_password: false,
          confirm_password_msg: ''
        }
        if (error.response.data.message.first_name) {
          if (typeof error.response.data.message.first_name === 'object') {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name.toString()
          } else {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name
          }
        }
        if (error.response.data.message.last_name) {
          if (typeof error.response.data.message.last_name === 'object') {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name.toString()
          } else {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name
          }
        }
        if (error.response.data.message.email) {
          if (typeof error.response.data.message.email === 'object') {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email.toString()
          } else {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email
          }
        }
        if (error.response.data.message.training_id) {
          if (typeof error.response.data.message.training_id === 'object') {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: `Company: ${error.response.data.message.training_id.toString()}`
            })
          } else {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: `Company: ${error.response.data.message.training_id}`
            })
          }
        }
        if (error.response.data.message.password) {
          if (typeof error.response.data.message.password === 'object') {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password.toString()
          } else {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password
          }
        }
        errorTrainingCreateUser.value = err_msgs
        if (
          !error.response.data.message.first_name &&
          !error.response.data.message.last_name &&
          !error.response.data.message.email &&
          !error.response.data.message.password &&
          !error.response.data.message.training_id
        ) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } else {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }
  async function userFreeAcountSignUp(payload) {
    try {
      LocalStorage.remove('userId')
      errorFreeUser.value = {
        status: false,
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        email: false,
        email_msg: '',
        organization: false,
        organization_msg: '',
        interests: false,
        interests_msg: '',
        role: false,
        role_msg: '',
        outcome: false,
        outcome_msg: '',
        training: false,
        training_msg: '',
        password: false,
        password_msg: ''
      }
      const res = await api.post('user-signup', payload)
      if (res.data.success) {
        errorFreeUser.value = {
          status: true,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          organization: false,
          organization_msg: '',
          interests: false,
          interests_msg: '',
          role: false,
          role_msg: '',
          outcome: false,
          outcome_msg: '',
          training: false,
          training_msg: '',
          password: false,
          password_msg: ''
        }
        isRegistered.value = false
        if (res.data.message === 'User Already Exists') {
          router.push({ name: 'login' })
          isRegistered.value = false
          existUser.value = true
        } else {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Congratulations! Successfully registered.' })
          router.push({ name: 'login' })
          isRegistered.value = false
        }
      } else {
        errormsg.value = res.data.message
        isRegistered.value = false
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.data })
      }
    } catch (error) {
      isRegistered.value = false
      isError.value = true
      errormsg.value = error
      if (error.toString() === 'Error: Network Error') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
      }
      if (error.response.status === 400) {
        const err_msgs = {
          status: false,
          first_name: false,
          first_name_msg: '',
          last_name: false,
          last_name_msg: '',
          email: false,
          email_msg: '',
          organization: false,
          organization_msg: '',
          interest: false,
          interest_msg: '',
          role: false,
          role_msg: '',
          outcome: false,
          outcome_msg: '',
          training: false,
          training_msg: '',
          password: false,
          password_msg: ''
        }
        if (error.response.data.message.first_name) {
          if (typeof error.response.data.message.first_name === 'object') {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name.toString()
          } else {
            err_msgs.first_name = true
            err_msgs.first_name_msg = error.response.data.message.first_name
          }
        }
        if (error.response.data.message.last_name) {
          if (typeof error.response.data.message.last_name === 'object') {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name.toString()
          } else {
            err_msgs.last_name = true
            err_msgs.last_name_msg = error.response.data.message.last_name
          }
        }
        if (error.response.data.message.email) {
          if (typeof error.response.data.message.email === 'object') {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email.toString()
          } else {
            err_msgs.email = true
            err_msgs.email_msg = error.response.data.message.email
          }
        }
        if (error.response.data.message.password) {
          if (typeof error.response.data.message.password === 'object') {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password.toString()
          } else {
            err_msgs.password = true
            err_msgs.password_msg = error.response.data.message.password
          }
        }
        if (error.response.data.message.organization) {
          if (typeof error.response.data.message.organization === 'object') {
            err_msgs.organization = true
            err_msgs.organization_msg = error.response.data.message.organization.toString()
          } else {
            err_msgs.organization = true
            err_msgs.organization_msg = error.response.data.message.organization
          }
        }
        if (error.response.data.message.interest) {
          if (typeof error.response.data.message.interest === 'object') {
            err_msgs.interest = true
            err_msgs.interest_msg = error.response.data.message.interest.toString()
          } else {
            err_msgs.interest = true
            err_msgs.interest_msg = error.response.data.message.interest
          }
        }
        if (error.response.data.message.role) {
          if (typeof error.response.data.message.role === 'object') {
            err_msgs.role = true
            err_msgs.role_msg = error.response.data.message.role.toString()
          } else {
            err_msgs.role = true
            err_msgs.role_msg = error.response.data.message.role
          }
        }
        if (error.response.data.message.outcome) {
          if (typeof error.response.data.message.outcome === 'object') {
            err_msgs.outcome = true
            err_msgs.outcome_msg = error.response.data.message.outcome.toString()
          } else {
            err_msgs.outcome = true
            err_msgs.outcome_msg = error.response.data.message.outcome
          }
        }
        if (error.response.data.message.training) {
          if (typeof error.response.data.message.training === 'object') {
            err_msgs.training = true
            err_msgs.training_msg = error.response.data.message.training.toString()
          } else {
            err_msgs.training = true
            err_msgs.training_msg = error.response.data.message.training
          }
        }
        errorFreeUser.value = err_msgs
        if (typeof error.response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } else {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }
  async function confirmSignUp(payload) {
    try {
      const data = {
        email: payload.email,
        code: payload.code
      }
      const res = await api.post('confirm-signup', data)
      if (res.data.success) {
        router.push({ name: 'login' })
        isConfirm.value = false
      }
    } catch (error) {}
  }
  async function companyAttrsGetAction(payload) {
    try {
      getCompanyAttrs.value = { custom: [] }
      const res = await api.post('company/attrs/get', payload)
      if (res.data.success) {
        const finalData = res.data.data.map((ds) => ({ key: ds, value: '' }))
        getCompanyAttrs.value = { custom: finalData }
        isRegistered.value = false
      }
    } catch (error) {
      getCompanyAttrs.value = { custom: [] }
      isRegistered.value = false
    }
  }
  async function recaptchValidate(payload) {
    try {
      const res = await api.post('validate-recaptch', payload)

      if (res.data.success) {
        validRecaptch.value = true
        if (location.host === res.data.data.hostname || location.host === 'localhost:2046') {
          validRecaptch.value = true
        } else {
          validRecaptch.value = false
        }
      } else {
        validRecaptch.value = false
      }
      return res.data.success
    } catch (error) {
      validRecaptch.value = false
      if (error.response.status === 400) {
        validRecaptch.value = false
      }
      return false
    }
  }
  return {
    isRegistered,
    isError,
    errormsg,
    isConfirm,
    existUser,
    validRecaptch,
    errorCreateUser,
    errorOWASPCreateUser,
    errorTrainingCreateUser,
    errorFreeUser,
    getCompanyAttrs,
    isRegisterStatus,
    userCompanySignUp,
    OWASPUserSignUp,
    trainingUserSignUp,
    userFreeAcountSignUp,
    confirmSignUp,
    companyAttrsGetAction,
    recaptchValidate
  }
})
