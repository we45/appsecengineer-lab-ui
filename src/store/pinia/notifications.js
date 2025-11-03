import { defineStore } from 'pinia'
import { LocalStorage, Notify, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

import { computed, ref } from 'vue'
const useNotificationStore = defineStore('notificationStore', () => {
  const $q = useQuasar()
  const notifications = ref([])
  const statusLoading = ref(false)
  const isLoading = ref(false)
  const unreadCountNotifications = ref(0)
  const query = ref({
    page_number: 1,
    max_items: 20,
    filter_status: undefined,
    next_token: undefined
  })

  const user = computed(() => {
    return LocalStorage.getItem('user')
  })
  async function fetchNotifications({ payload }) {
    try {
      isLoading.value = true
      const requestPayload = {
        ...payload,
        ...query.value
      }
      const { data } = await api.post('notification/query-handler', requestPayload)
      notifications.value.push(...data?.data?.items) ?? []
      query.value.page_number = data?.data?.next_token?.next_page ?? undefined
    } catch (error) {
      query.value.page_number = undefined
      notifications.value = []
      return false
    } finally {
      isLoading.value = false
    }
  }
  async function readNotifications({ payload }) {
    try {
      const data = await api.post('notification/query-handler', payload)
      return data
    } catch (error) {
      return false
    }
  }
  async function changeSingleStatus({ payload }) {
    try {
      payload.readall && (statusLoading.value = true)

      const { data } = await api.post('notification/change-status', payload)
      if (payload.readall) {
        notifications.value = notifications.value.map((ele) => {
          return {
            ...ele,
            status: 'read'
          }
        })
      }
      $q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        icon: 'success',
        message: data?.message ?? 'Process successfully changed status'
      })

      return data
    } catch (error) {
      return false
    } finally {
      statusLoading.value = false
    }
  }

  return {
    fetchNotifications,
    notifications,
    readNotifications,
    changeSingleStatus,
    user,
    query,
    statusLoading,
    unreadCountNotifications,
    isLoading
  }
})

export { useNotificationStore }
