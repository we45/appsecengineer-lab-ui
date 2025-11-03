import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserActivity = defineStore('userActivity', () => {
  const isActivityDisabled = ref(false)

  function enableActivity() {
    isActivityDisabled.value = false
  }

  function disableActivity() {
    isActivityDisabled.value = true
  }

  return {
    isActivityDisabled,
    enableActivity,
    disableActivity
  }
})
