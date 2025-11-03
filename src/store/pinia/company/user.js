import { defineStore } from 'pinia'
import { api, apiTests } from 'src/boot/axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
const useCompanyUsers = defineStore('companyUsers', () => {
  const companyUsers = ref({
    data: [],
    LastEvaluatedKey: undefined
  })
  const userRecommendations = ref({
    data: [],
    LastEvaluatedKey: undefined
  })
  const isLoading = ref(false)

  async function manageAsyncOperation(callback, errCallback = null) {
    try {
      isLoading.value = true
      return await callback?.()
    } catch (error) {
      console.log(error)
      return await errCallback?.(error)
    } finally {
      isLoading.value = false
    }
  }

  function fetchCompanyUser(payload = {}) {
    return manageAsyncOperation(async () => {
      const { data } = await api.post('company/users-list', { all: true, ...payload })
      const items = data?.data?.Items ?? []
      if (payload.LastEvaluatedKey) {
        companyUsers.value.data.push(...items)
      } else {
        companyUsers.value.data = items
      }
      companyUsers.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
    })
  }

  function searchCompanyUser(payload = {}) {
    return manageAsyncOperation(async () => {
      const { data } = await api.post('company/search-user', payload)
      const items = data?.data?.data ?? []
      if (payload.LastEvaluatedKey) {
        companyUsers.value.data.push(...items)
      } else {
        companyUsers.value.data = items
      }
      companyUsers.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
    })
  }

  function fetchUserRecommendations(payload = {}) {
    return manageAsyncOperation(async () => {
      const { data } = await apiTests.get('user/forms/preference')
      console.log('data', data)
      userRecommendations.value.data = data.data.fields ?? []

      return data?.data?.fields ?? []
    })
  }

  function submitUserRecommendations(payload = {}) {
    return manageAsyncOperation(async () => {
      const { data } = await apiTests.post('user/forms/preference', payload)
      Notify.create({ type: 'positive', position: 'top', progress: true, message: `${data.message}` })
      return data
    })
  }

  return {
    fetchUserRecommendations,
    fetchCompanyUser,
    companyUsers,
    isLoading,
    userRecommendations,
    searchCompanyUser,
    submitUserRecommendations
  }
})

export { useCompanyUsers }
