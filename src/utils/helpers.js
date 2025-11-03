import { QSpinnerFacebook, QSpinnerBox, QSpinnerInfinity } from 'quasar'
import axios from 'axios'
import config from '../config'
import { LocalStorage } from 'quasar'

export function redirectFunction(url, type = '_blank') {
  window.open(url, type)
}

export function getCurentYear() {
  return new Date().getFullYear()
}

export function loader({
  spinnerColor = 'white',
  spinner = QSpinnerFacebook,
  spinnerSize = 140,
  message = 'Hang On...',
  messageColor = 'white'
}) {
  return {
    spinner,
    spinnerColor,
    spinnerSize,
    message,
    messageColor
  }
}

export function secondLoader({
  spinnerColor = 'white',
  spinner = QSpinnerInfinity,
  spinnerSize = 140,
  message = 'Hang on...',
  messageColor = 'white'
}) {
  return {
    spinner,
    spinnerColor,
    spinnerSize,
    message,
    messageColor
  }
}

export function manageApiResponse(data, isError) {
  let response = {}
  if (isError) {
    const res = data?.response?.data ?? data?.response
    response = {
      message: 'Something went wrong',
      ...(res ?? {}),
      success: false
    }

    if (!res) {
      console.warn(data)
    }
  } else {
    response = {
      ...data?.data,
      success: true
    }
  }

  return response
}

export async function handleApiRequest(apiFunction, args = []) {
  let response = { success: true, data: null }
  try {
    const data = await apiFunction(...args)
    response.success = true
    response.data = manageApiResponse(data)
  } catch (error) {
    response.data = manageApiResponse(error, true)
  } finally {
    return response
  }
}

//check route Authentication
export async function isAuthenticated(to) {
  const excludedPaths = ['/', '/login', '/oauth']

  if (excludedPaths.includes(to.path)) {
    const expTime = LocalStorage.getItem('expTime')

    if (expTime) {
      const currentTime = new Date().getTime()

      if (currentTime <= parseInt(expTime)) {
        return true
      }

      try {
        const res = await refreshAccessToken()

        if (res.data.success) {
          LocalStorage.set('token', res.data.data.IdToken)
          LocalStorage.set('expTime', calculateExpirationTime())
          return true
        }
      } catch (error) {
        handleNetworkError()
      }

      return false
    }

    if (to.path === '/') {
      window.location.href = '/portal/running-labs'
    }

    return true
  }

  const user = LocalStorage.getItem('user')
  const token = LocalStorage.getItem('token')
  const rtoken = LocalStorage.getItem('rtoken')

  if (!user || !token || !rtoken) {
    redirectWithHistoryRoute()
    return false
  }

  return true
}

async function refreshAccessToken() {
  const payload = {
    refresh_token: LocalStorage.getItem('rtoken')
  }
  return await axios.post(config.baseURLApi + 'user/refresh-token', payload)
}

function calculateExpirationTime() {
  return new Date().setSeconds(new Date().getSeconds() + 14400)
}

function handleNetworkError() {
  const keysToRemove = ['startTime', 'expTime', 'token', 'isOwasp', 'rtoken', 'user', 'userId', 'provisionInfo', 'sub_']

  keysToRemove.forEach((key) => LocalStorage.remove(key))

  window.location.href = '/'
}

export function getMinutesInHr(minutes = 0) {
  let hours = Math.floor(minutes / 60)
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes % 60
  minutes = minutes < 10 ? '0' + minutes : minutes
  return `${hours}h :${minutes}m`
}

export function randomIndexes(defaultCount = 4, max = 6) {
  if (max < defaultCount) {
    let randoms = []
    for (let i = 0; i < max; i++) {
      randoms.push(i)
    }
    return randoms
  } else {
    let randomSet = new Set()
    while (randomSet.size < defaultCount) {
      let random = Math.floor(Math.random() * max)
      if (!randomSet.has(random)) {
        randomSet.add(random)
      }
    }
    return [...randomSet]
  }
}
export function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

export function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

export function isArray(value) {
  return Array.isArray(value)
}

export function areEqual(val1, val2) {
  if (isArray(val1) && isArray(val2)) {
    if (val1.length !== val2.length) return false
    for (let i = 0; i < val1.length; i++) {
      if (!areEqual(val1[i], val2[i])) return false
    }
    return true
  } else if (isObject(val1) && isObject(val2)) {
    const keys1 = Object.keys(val1)
    const keys2 = Object.keys(val2)
    if (keys1.length !== keys2.length) return false
    for (const key of keys1) {
      if (!areEqual(val1[key], val2[key])) return false
    }
    return true
  } else {
    return val1 === val2
  }
}

export function generateChangedObject(oldObj, newObj) {
  const changedObj = {}

  for (const key in oldObj) {
    if (![oldObj[key], newObj[key]].includes(undefined)) {
      if (!areEqual(oldObj[key], newObj[key])) {
        changedObj[key] = newObj[key]
      }
    }
  }

  return changedObj
}

export function isCompanyAdmin() {
  const isCmpAdmin = LocalStorage.getItem('is_admin', false)
  if (isCmpAdmin === 'undefined') return false
  return isCmpAdmin
}

export function redirectWithHistoryRoute() {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)

  if (!url.searchParams.has('redirect')) {
    const redirectUrl = '/?redirect=' + encodeURIComponent(currentUrl)
    window.location.href = redirectUrl
  }
}
