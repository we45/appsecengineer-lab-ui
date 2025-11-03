import { Notify } from 'quasar'

export function notify({ success = true, message = 'Success', position = 'top-right', errors = [], timeout = 1000 }) {
  Notify.create({
    message,
    position,
    type: success ? 'positive' : 'negative',
    timeout
  })
}

export function positiveNotify(message) {
  Notify.create({
    message,
    position: 'top',
    type: 'positive',
    timeout: 1000
  })
}

export function negativeNotify(message) {
  Notify.create({
    message,
    position: 'top',
    type: 'negative',
    timeout: 1000
  })
}
