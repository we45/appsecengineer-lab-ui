import { format } from 'quasar'

export const date = [(val) => /^-?[\d]+[/-][0-1]\d[/-][0-3]\d$/.test(val) || 'Please provide a valid date']

export const email = [(val, rules) => rules.email(val) || 'Please provide a valid email']

export const number = [(val) => /^[0-9]+$/.test(val) || 'Only numbers are allowed']

export const required = [(val) => !!val || 'Required field']
export const customRequired = (message = 'This field is required.') => [
  (val) => (val !== undefined && val !== null && val !== '' && val !== 0) || message
]

export const url = [(val) => !val || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(val) || 'Please provide a valid URL']

export const shortName = [
  (val) => val.length >= 2 || 'The minimum is 2 characters',
  (val) => val.length <= 50 || 'The maximum is 50 characters',
  (val) => /^[a-zA-Z0-9 ]+$/.test(val) || 'Special characters are not allowed'
]

export const longName = [
  (val) => val.length >= 2 || 'The minimum is 2 characters',
  (val) => val.length <= 200 || 'The maximum is 200 characters',
  (val) => /^[a-zA-Z0-9 ]+$/.test(val) || 'Special characters are not allowed'
]

export function min(min) {
  return [
    (val) => {
      if (isNaN(val)) return true
      return parseInt(val) >= min || `The minimum is ${min}`
    }
  ]
}

export function max(max) {
  return [
    (val) => {
      if (isNaN(val)) return true
      return (val >= 0 && parseInt(val) <= max) || `The maximum is ${max}`
    }
  ]
}

export function minLength(min) {
  return [(val) => val?.length >= min || `The minimum is ${min} characters`]
}

export function maxLength(max) {
  return [(val) => val?.length <= max || `The maximum is ${max} characters`]
}

export function fileSize(max = 5000000) {
  return [(val) => val || 'Required field', (val) => val.size < max || `The maximum file size is ${format.humanStorageSize(max)}`]
}

export function between(val1, val2) {
  return [(val) => betweenValidation(val, val1, val2)]
}
export function sameAs(val2) {
  return [(val) => sameAsValidation(val, val2)]
}

export function optionArrayRequired(message = 'Please select an option') {
  return [(val) => !!val?.length || message]
}
export function objectRequired(message = 'Please select an option') {
  return [(val) => !!Object.keys(val ?? {}).length || message]
}

function sameAsValidation(val, val2) {
  if (val !== val2) return `${val} must be equal to ${val2}`
  return true
}
function betweenValidation(val, val1, val2) {
  if (val < val1 || val > val2) {
    return `Value must be between ${val1} and ${val2}`
  }
  return true
}
