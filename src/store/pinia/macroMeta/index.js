import { defineStore } from 'pinia'
import { apiMacroMeta } from 'src/boot/axios'
import { computed, ref } from 'vue'

export const useMacroMetaStore = defineStore('macrometaStore', () => {
  const isLoading = ref(false)
  const userStats = ref({})
  const recentVideos = ref({})
  const recentLabs = ref({})
  const dateRange = ref({
    startDate: '',
    endDate: '',
    endDate_status: false,
    endDate_status_msg: '',
    startDate_status: false,
    startDate_status_msg: ''
  })
  const saveToken = ref('')

  async function manageLoading(callback, errCallback = undefined, toggleLoad = true) {
    try {
      toggleLoad && (isLoading.value = true)
      return await callback()
    } catch (error) {
      console.log(error)
      return errCallback ? errCallback(error) : undefined
    } finally {
      toggleLoad && (isLoading.value = false)
    }
  }

  function generateToken(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('generate-api-token', payload)
        saveToken.value = res.data.token || ''
      },
      (err) => err
    )
  }
  function fetchToken() {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.get('get-api-token')
        saveToken.value = res.data.data || ''
      },
      (err) => err
    )
  }
  function deleteToken(payload) {
    return manageLoading(
      async () => {
        await apiMacroMeta.delete('revoke-api-token')
        saveToken.value = ''
      },
      (err) => err
    )
  }
  function publishLogin(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('publish-login', payload)
        return res.data
      },
      (err) => err,
      false
    )
  }
  function publishCourseStats(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('publish-media-click', payload)
        return res.data
      },
      (err) => err,
      false
    )
  }

  function publishVideoStats(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('publish-video-watch', payload)
        return res.data
      },
      (err) => err,
      false
    )
  }

  function publishUpgradeStats(payload) {
    return manageLoading(
      async () => {
        const res = await apiMacroMeta.post('publish-upgrade-interest', payload)
        return res.data
      },
      (err) => err,
      false
    )
  }

  function fetchUserReportStats(payload) {
    return manageLoading(async () => {
      userStats.value = {}
      const res = await apiMacroMeta.post('user-stats', payload)
      userStats.value = res.data
    })
  }

  function fetchRecentVideosUser(payload) {
    return manageLoading(async () => {
      recentVideos.value = {}
      const res = await apiMacroMeta.post('recent-videos', payload)
      recentVideos.value = res.data
    })
  }

  function fetchRecentLabsUser(payload) {
    return manageLoading(async () => {
      recentLabs.value = {}
      const res = await apiMacroMeta.post('recent-labs', payload)
      recentLabs.value = res.data
    })
  }

  const userStatsActivity = computed(() => {
    const allDateUserProgressStats = {
      data: [],
      labels: [],
      colors: ['#AED6F1', '#85C1E9', '#5DADE2', '#2874A6', '#21618C'],
      gitColors: ['#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#144620'],
      gitColorsUpdated: ['#9cc7a6', '#8eb998', '#2B9943', '#288D3E', '#248139', '#217534', '#1E692E'],
      title: 'User Activity',
      name: 'User Activity',
      values_list: [],
      max: 10,
      min: 0
    }
    let max_value = 1
    if (userStats.value.dashboard) {
      for (const activity of userStats.value.dashboard) {
        allDateUserProgressStats.values_list.push([activity.date, activity.activity])
        if (activity.activity > max_value) {
          max_value = activity.activity
        }
      }
    }
    allDateUserProgressStats.colors = ['#AED6F1', '#85C1E9', '#5DADE2', '#2874A6', '#21618C']
    allDateUserProgressStats.gitColors = ['#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#144620']
    allDateUserProgressStats.gitColorsUpdated = ['#9cc7a6', '#8eb998', '#2B9943', '#288D3E', '#248139', '#217534', '#1E692E']
    allDateUserProgressStats.max = Math.ceil(max_value / 10) * 10 + 1
    allDateUserProgressStats.min = 1
    return allDateUserProgressStats
  })

  return {
    isLoading,
    userStats,
    recentVideos,
    recentLabs,
    dateRange,
    saveToken,
    userStatsActivity,
    fetchRecentLabsUser,
    fetchRecentVideosUser,
    fetchUserReportStats,
    publishUpgradeStats,
    publishVideoStats,
    publishCourseStats,
    publishLogin,
    deleteToken,
    fetchToken,
    generateToken
  }
})
