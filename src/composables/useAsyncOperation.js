import { ref } from 'vue'

export function useAsyncOperation() {
  const isLoading = ref(false)

  async function manageAsyncOperation(callback, errCallback = null, setLoading = null) {
    try {
      isLoading.value = true
      if (setLoading) {
        setLoading(true)
      }
      return await callback?.()
    } catch (error) {
      return await errCallback?.(error)
    } finally {
      isLoading.value = false
      if (setLoading) {
        setLoading(false)
      }
    }
  }

  return {
    isLoading,
    manageAsyncOperation
  }
}
