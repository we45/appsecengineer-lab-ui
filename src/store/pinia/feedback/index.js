import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useFeedbackStore = defineStore('feedback', () => {
  const detailedInfo = ref({
    filterId: '',
    goNext: true
  })
  const isLoading = ref(false)
  const submitProgressMessage = ref({})
  const individualPopupEnabled = ref(false)

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      console.log(error)
      return errorCallback ? errorCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }

  function submitProgress(payload) {
    return manageLoading(
      async () => {
        const res = await api.post('event/feedback/submit', payload, { noLoading: true })
        if (res.data.success) {
          Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Feedback successfully submitted' })
        }
      },
      (error) => {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    )
  }
  function fetchProgressStatus(payload) {
    return manageLoading(
      async () => {
        submitProgressMessage.value = {}
        const res = await api.post('event/feedback/fetch', payload)
        if (res.data.success) {
          submitProgressMessage.value = res.data
        }
      },
      (error) => {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    )
  }

  return {
    detailedInfo,
    isLoading,
    submitProgressMessage,
    individualPopupEnabled,
    submitProgress,
    fetchProgressStatus
  }
})
