import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { urlSafeBase64Encode } from '../../../utils/reuseFunctions'
import { ref } from 'vue'
import config from 'src/config'

export const useBadgeStore = defineStore('badge', () => {
  const isLoading = ref(false)
  const badgeUserInfo = ref({})
  const badgeInfo = ref({})
  const badgeError = ref('')
  const badges = ref([])
  const streaks = ref([])
  const statusOfApi = ref(false)

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (err) {
      console.log(err)
      return errorCallback ? errorCallback(err) : undefined
    } finally {
      isLoading.value = false
    }
  }

  function fetchBadges(payload) {
    return manageLoading(
      async () => {
        const response = await api.post(config.badgeUrl + 'badges', payload)
        badges.value = response.data.data
      },
      (err) => (badgeError.value = err)
    )
  }

  function fetchStreaks(payload) {
    return manageLoading(
      async () => {
        const response = await api.post(config.macroMetaUrl + 'streaks', payload)
        streaks.value = response.data.data
      },
      (err) => (badgeError.value = err)
    )
  }
  function fetchPublicStreaks(payload) {
    return manageLoading(
      async () => {
        const response = await api.post(config.macroMetaUrl + 'public-streaks', payload)
        streaks.value = response.data.data
      },
      (err) => (badgeError.value = err)
    )
  }
  function fetchBadgeInfo(payload) {
    return manageLoading(
      async () => {
        const response = await api.post('badge-info', payload)
        const badgeUserInfo = {
          fullName: response.data.full_name
        }
        badgeUserInfo.value = badgeUserInfo
        response.data.data.forEach((badge) => {
          const badgeInfo = {
            name: badge.badge_name,
            description: badge.event_description,
            skills: badge.skills,
            logo: badge.logo,
            url: `https://learning.appsecengineer.com/badge/${urlSafeBase64Encode(badge.sk)}`
          }
          badgeInfo.value = badgeInfo
        })
        statusOfApi.value = true
      },
      (err) => (badgeError.value = err)
    )
  }
  return {
    isLoading,
    badgeUserInfo,
    badgeInfo,
    badgeError,
    badges,
    streaks,
    statusOfApi,
    fetchBadgeInfo,
    fetchStreaks,
    fetchBadges,
    fetchPublicStreaks
  }
})
