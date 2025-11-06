import { defineStore } from 'pinia'
import { setCourseItem } from 'src/utils/module/course'
import { computed, ref } from 'vue'
import { api, apiMacroMeta } from 'src/boot/axios'
import { useAsyncOperation } from 'src/composables/useAsyncOperation'

const useDashboardStore = defineStore('dashboardStore', () => {
  const { manageAsyncOperation } = useAsyncOperation()

  const dashboardLoading = ref(false)
  const dashboardCourses = ref([])

  const dashboardStatistics = ref({})
  const dashboardStatisticsLoading = ref(false)

  const suggestiveCourses = ref([])
  const suggestiveCoursesLoading = ref(false)

  const suggestiveChallengeCourses = ref([])
  const suggestiveChallengeCoursesLoading = ref(false)

  const recommendedCourses = ref([])
  const recommendedCoursesLoading = ref(false)

  async function fetchDashboardCourses() {
    if (dashboardCourses.value.length) return
    dashboardLoading.value = true
    try {
      const res = await api.get('user/dashboard')
      const courseData = res?.data?.data?.items.map(setCourseItem)?.sort((a, b) => a?.event_name?.localeCompare(b?.event_name)) ?? []
      const filterCourses = courseData.map((item) => {
        return {
          ...item,
          disabled: !res?.data?.data?.subs?.includes(item.id)
        }
      })
      dashboardCourses.value = filterCourses ?? []
    } catch (e) {
      console.warn(e)
    } finally {
      dashboardLoading.value = false
    }
  }

  async function fetchDashboardStatistics({ payload = {} }) {
    dashboardStatisticsLoading.value = true
    try {
      const response = await apiMacroMeta.post('user-stats', payload)
      dashboardStatistics.value = response?.data ?? {}
    } catch (e) {
      console.warn(e)
    } finally {
      dashboardStatisticsLoading.value = false
    }
  }

  async function fetchDashboardSuggestiveCourses(challenge = false) {
    if (challenge) {
      suggestiveChallengeCoursesLoading.value = true
    } else {
      suggestiveCoursesLoading.value = true
    }
    try {
      let payload = {
        status: ['not_started', 'new'],
        types: ['course']
      }
      if (challenge) {
        payload.types = ['challenge']
      }
      const res = await api.post('course/filter?page=1&per_page=40', payload, { noLoading: true })
      const data = res?.data?.data?.items?.map((item) => ({ ...setCourseItem(item) })) ?? []

      if (challenge) {
        suggestiveChallengeCourses.value = data
      } else {
        suggestiveCourses.value = data
      }
    } catch (error) {
      console.warn(error)
    } finally {
      if (challenge) {
        suggestiveChallengeCoursesLoading.value = false
      } else {
        suggestiveCoursesLoading.value = false
      }
    }
  }

  async function fetchRecommendedCourses() {
    return manageAsyncOperation(
      async () => {
        const payload = {
          levels: [],
          roles: [],
          learning_paths: [],
          status: ['not_started', 'new']
        }

        const response = await api.post('course/filter?page=1&per_page=50', payload)

        const data = response?.data?.data?.items?.map((item) => ({ ...setCourseItem(item) })) ?? []
        recommendedCourses.value = data
      },
      (error) => {
        console.log('error', error)
      },
      (loading) => {
        recommendedCoursesLoading.value = loading
      }
    )
  }

  const dashboardStats = computed(() => {
    return [
      {
        count: dashboardStatistics.value?.badges || 0,
        title: 'Number of Badges'
      },
      {
        count: dashboardStatistics.value?.challenges_completed || 0,
        title: 'Completed Challenges'
      },
      {
        count: dashboardStatistics.value?.labs_completed || 0,
        title: 'Labs Completed'
      },
      {
        count: dashboardStatistics.value?.leaderboard || 0,
        title: 'Leaderboard Position'
      },
      {
        count: dashboardStatistics.value?.total_enrolled || 0,
        title: 'Enrolled Courses'
      },
      {
        count: dashboardStatistics.value.total_course_minutes || 0,
        title: 'Total minutes spent'
      }
    ]
  })

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

    if (dashboardStatistics.value?.dashboard) {
      for (const activity of dashboardStatistics.value?.dashboard) {
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
    dashboardCourses,
    fetchDashboardCourses,
    dashboardLoading,
    dashboardStatistics,
    fetchDashboardStatistics,
    dashboardStatisticsLoading,
    dashboardStats,
    userStatsActivity,
    suggestiveCourses,
    suggestiveCoursesLoading,
    fetchDashboardSuggestiveCourses,
    suggestiveChallengeCourses,
    suggestiveChallengeCoursesLoading,
    recommendedCourses,
    recommendedCoursesLoading,
    fetchRecommendedCourses
  }
})

export { useDashboardStore }
