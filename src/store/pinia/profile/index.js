import axiosCustom from 'axios'
import { LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import config from 'src/config'
import { differenceDates } from 'src/utils/reuseFunctions'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import jwt_decode from 'jwt-decode'

export const useProfileStore = defineStore('profileStore', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const subscriptionInfo = ref({})
  const listUserBadges = ref([])
  const paginatedBadge = ref({})
  const profileDetailedInfo = ref({})
  const achievementsList = ref([])
  const paymentInfo = ref({})
  const paymentSubscriptionInfo = ref({})
  const accessableSubs = ref({})
  const expiredTime = ref(LocalStorage.getItem('EXPIRED_TIME') || 0)
  const totalBadges = ref(0)
  const paginationBadges = ref({})
  const coursesAndChallenges = ref([])
  const preferencesSubmitted = ref(false)
  const recommendedFilters = ref({})
  const securityChampionTeams = ref([])
  const newsfeedSubscribe = ref(false)
  const newsfeedTopics = ref([])

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (err) {
      console.log(err)
      return errorCallback ? errorCallback() : undefined
    } finally {
      isLoading.value = false
    }
  }

  function fetchUserSubscriptionInfo() {
    return manageLoading(async () => {
      const res = await api.get('user/subscription-info')
      if (res.data.success) {
        subscriptionInfo.value = {
          subscriptionType: res.data.data.subscription_type,
          startDate: res.data.data.start_date,
          endDate: res.data.data.end_date
        }
      }
    })
  }

  function fetchProfileDetailedInformation(loading = true) {
    return manageLoading(async () => {
      !loading && (isLoading.value = false)
      const res = await api.get('user/profile', {
        params: {
          settings: true,
          analytics: true
        }
      })
      if (res.data.success) {
        let detailedInfo = res.data.data ?? {}
        if (detailedInfo?.security_champion_teams) {
          securityChampionTeams.value = detailedInfo?.security_champion_teams ?? []
        }
        detailedInfo = {
          ...detailedInfo,
          ...(detailedInfo?.analytics ?? {}),
          ...(detailedInfo?.settings ?? {})
        }
        profileDetailedInfo.value = detailedInfo
        const d = new Date()
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        const year = d.getFullYear()

        month.length < 2 && (month = '0' + month)
        day.length < 2 && (day = '0' + day)

        const finalDate = [year, month, day].join('-')
        const infoTime = differenceDates(detailedInfo.start_date, detailedInfo.end_date, finalDate)
        LocalStorage.set('EXPIRED_TIME', infoTime)

        LocalStorage.set('weekly_digest_email', detailedInfo.weekly_digest_email ?? false)

        LocalStorage.set('company_report_email', detailedInfo.company_report_email ?? false)
        expiredTime.value = infoTime || LocalStorage.getItem('EXPIRED_TIME') || 0

        preferencesSubmitted.value = detailedInfo.preferences_submitted ?? false

        if (preferencesSubmitted.value && detailedInfo.recommended_filters) {
          recommendedFilters.value = detailedInfo.recommended_filters
        }

        newsfeedSubscribe.value = detailedInfo.subscribe ?? false
        newsfeedTopics.value = detailedInfo.topics ?? []
      }
    })
  }

  function fetchAchievements(payload = {}) {
    return manageLoading(async () => {
      const res = await api.post('user/achievements', payload)
      if (!res.data.success) return
      achievementsList.value = [...achievementsList.value, ...(res.data.data.results || [])]
      totalBadges.value = res.data.data.total ?? 0
    })
  }

  function fetchPublicBadges(payload) {
    return manageLoading(async () => {
      const res = await api.post(config.macroMetaUrl + 'public-profile/get-badges', payload)
      if (!res.data.success) return
      paginationBadges.value = res.data.data.pagination_info ?? {}
      achievementsList.value = [...achievementsList.value, ...(res.data.data.results || [])]
    })
  }

  function getSubscriptionInfo(payload) {
    return manageLoading(async () => {
      var url = ['IND', 'FT'].includes(localStorage.getItem('type')) ? config.baseURLIndividual : config.baseURLEnterprise
      const res = await axiosCustom.post(url + 'webhook/checkout', payload)
      if (!res.data.success) return
      paymentInfo.value = res.data.data
    })
  }
  function fetchUserBillingInfo() {
    const negativeNotify = () =>
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        icon: 'warning',
        message: 'Not able to find the billing information. Please contact help@appsecengineer.com'
      })
    return manageLoading(
      async () => {
        const res = await api.get('chargebee/subscriptions')

        if (res.data.success) {
          paymentSubscriptionInfo.value = res.data.data
        } else {
          negativeNotify()
        }
      },
      (err) => {
        negativeNotify()
      }
    )
  }
  function fetchAccessableSubs() {
    const negativeNotify = () =>
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        icon: 'warning',
        message: 'Not able to find the billing information. Please contact help@appsecengineer.com'
      })
    return manageLoading(
      async () => {
        const res = await api.get('chargebee/subscriptions')
        if (res.data.success) {
          const activePlans = {}
          res.data.data.subscriptions.map((subs) => (activePlans[subs] = true))
          accessableSubs.value = { ...res.data.data, ...activePlans }
        } else {
          negativeNotify()
        }
      },
      (err) => {
        negativeNotify
        negativeNotify()
      }
    )
  }
  function updateProfileInfo(payload) {
    return manageLoading(
      async () => {
        const user = LocalStorage.getItem('user')
        // if (payload.first_name) isLoading.value = true
        const res = await api.post('user/update-profile-info', payload)
        user.firstName = payload.first_name
        user.lastName = payload.last_name
        if (payload.first_name || payload.last_name) LocalStorage.set('user', user)
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          icon: 'check',
          message: res?.data?.message ?? 'Profile updated successfully'
        })
        return user
      },
      () => false
    )
  }
  function updateProfilePicture(payload) {
    return manageLoading(
      async () => {
        const user = LocalStorage.getItem('user')
        const res = await api.post('user/upload-profile-image', payload)
        user.picture = 'https://' + res.data.data
        LocalStorage.set('user', user)
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          icon: 'check',
          message: res?.data?.message ?? 'Profile picture updated successfully'
        })
        return user
      },
      () => false
    )
  }
  function fetchCoursesAndChallenges(payload) {
    return manageLoading(
      async () => {
        const res = await api.post(config.macroMetaUrl + 'public-profile/courses-and-challenges', payload)
        coursesAndChallenges.value = res.data.data
        return res.data.data
      },
      () => false
    )
  }

  function generateApiToken() {
    return manageLoading(async () => {
      const token = LocalStorage.getItem('token')
      const decoded = jwt_decode(token ?? '')

      const res = await api.post(`${config.generateTokenUrl}generate-token`, {
        user_id: decoded.sub
      })
      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        icon: 'check',
        message: 'Token generated successfully'
      })

      return res
    })
  }

  function disableToken() {
    return manageLoading(
      async () => {
        const token = LocalStorage.getItem('token')
        const decoded = jwt_decode(token ?? '')

        const res = await api.post(`${config.generateTokenUrl}disable-token`, {
          user_id: decoded.sub
        })
        console.log(res)

        return res
      },
      (err) => false
    )
  }

  return {
    isLoading,
    isError,
    subscriptionInfo,
    profileDetailedInfo,
    listUserBadges,
    paginatedBadge,
    achievementsList,
    paymentInfo,
    paymentSubscriptionInfo,
    accessableSubs,
    expiredTime,
    totalBadges,
    paginationBadges,
    coursesAndChallenges,
    preferencesSubmitted,
    recommendedFilters,
    newsfeedSubscribe,
    newsfeedTopics,
    fetchUserSubscriptionInfo,
    fetchProfileDetailedInformation,
    fetchAchievements,
    fetchPublicBadges,
    getSubscriptionInfo,
    fetchUserBillingInfo,
    updateProfileInfo,
    fetchCoursesAndChallenges,
    fetchAccessableSubs,
    updateProfilePicture,
    generateApiToken,
    disableToken,
    securityChampionTeams
  }
})
