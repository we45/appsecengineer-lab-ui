import { api } from 'src/boot/axios'

const cbInstance = window.Chargebee?.init()

export function checkout(baseURL, data) {
  return new Promise((resolve, reject) => {
    cbInstance.openCheckout({
      hostedPage: async () => {
        return await api
          .post(baseURL, data, {
            headers: { 'content-type': 'application/json' }
          })
          .then((response) => {
            return response.data.data
          })
          .catch((error) => {
            console.error('ERROR', error)
            if (error.response.status === 400) {
              const errorMsgs = {}
              if (error.response?.data?.message) {
                const { message } = error.response.data
                if (typeof message === 'string') {
                  errorMsgs.custom = true
                  errorMsgs.custom_msg = message
                } else {
                  Object.entries(message).forEach(([key, value]) => {
                    errorMsgs[key] = true
                    errorMsgs[`${key}_msg`] = typeof value === 'object' ? value.toString() : value
                  })
                }
              }
              reject({ errorMsgs })
            }
          })
      },
      step: (value) => {},
      loaded: () => {},
      close: () => {},
      success: (hostedPageId) => {
        resolve(hostedPageId)
      },
      error: (error) => {
        console.error('checkout error', error)
      }
    })
  })
}
