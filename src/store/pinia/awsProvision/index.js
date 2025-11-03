import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
export const useAwsProvisionStore = defineStore('awsProvision', () => {
  const isLoading = ref(false)
  const isAccountCreated = ref(false)
  const accountInfo = ref({})
  const error = ref({})

  async function getAWSAccountStatus(payload) {
    try {
      isLoading.value = true
      const res = await api.post('aws/status', payload)
      accountInfo.value = res.data?.success
        ? {
            url: res.data.data.url,
            secret_key: res.data.data.secret_key,
            access_key: res.data.data.access_key,
            username: res.data.data.username,
            password: res.data.data.password
          }
        : {}
      isAccountCreated.value = res.data?.success
    } catch (error) {
      error.value = error
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }
  return {
    isLoading,
    isAccountCreated,
    accountInfo,
    error,
    getAWSAccountStatus
  }
})
