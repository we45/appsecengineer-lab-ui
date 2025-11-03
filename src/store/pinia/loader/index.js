import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useGlobalLoaderStore = defineStore('globaLoader', () => {
  const isLoading = shallowRef(false)

  function start() {
    isLoading.value = true
  }
  function stop() {
    isLoading.value = false
  }

  return { isLoading, start, stop }
})
