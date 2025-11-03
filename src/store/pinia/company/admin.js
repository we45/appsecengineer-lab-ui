import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

import { ref } from 'vue'
const useCompanyAdmin = defineStore('companyAdmin', () => {
  const adminUsers = ref([])
  const loading = ref(false)

  const payload = ref({
    LastEvaluatedKey: undefined
  })
  async function fetchAdminUsers() {
    loading.value = true
    try {
      const { data } = await api.post('company/list-admin-user', payload.value)
      adminUsers.value.push(...(data?.data?.Items ?? []))
      payload.value.LastEvaluatedKey = data?.data?.LastEvaluatedKey
    } catch (err) {
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    fetchAdminUsers,
    adminUsers,
    loading,
    payload
  }
})

export { useCompanyAdmin }
