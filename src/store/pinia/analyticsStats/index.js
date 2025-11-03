import { api } from 'src/boot/axios'
import { dateFormatReadable, colorBasedOnIndex } from 'src/utils/reuseFunctions'
import { apiMacroMeta } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const initialParams = { title: '', name: '', isStats: false, extra: {}, isProgress: false }
function getInitialState({ title, name, isStats, extra, isProgress } = initialParams) {
  return {
    title,
    name,
    data: [],
    labels: [],
    colors: [],
    ...(isStats && { values_list: [], single_line: [], scatter_line: [] }),
    ...(isProgress && {
      colors: ['#AED6F1', '#85C1E9', '#5DADE2', '#2874A6', '#21618C'],
      gitColors: ['#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#144620'],
      gitColorsUpdated: ['#9cc7a6', '#8eb998', '#2B9943', '#288D3E', '#248139', '#217534', '#1E692E'],
      values_list: [],
      max: 10,
      min: 0
    }),
    ...extra
  }
}

export const useAnalyticsStatsStore = defineStore('analyticsStatsStore', () => {
  const isLoading = ref(false)
  const monthlyStats = ref(getInitialState({ title: 'Monthly Stats', isStats: true }))
  const weeklyStats = ref(getInitialState({ title: 'Monthly report', isStats: true }))
  const topCourses = ref(
    getInitialState({
      title: 'Top Five Courses',
      name: 'Top Five Courses',
      extra: { static_data: [] }
    })
  )
  const teamWeeklyReport = ref(
    getInitialState({
      title: 'Weekly Report',
      name: 'Weekly Report',
      extra: { static_data: [] }
    })
  )
  const teamMonthlyReport = ref(
    getInitialState({
      title: 'Monthly Report',
      name: 'Monthly Report',
      extra: { static_data: [] }
    })
  )
  const userCourses = ref(
    getInitialState({
      title: 'Individual course minutes used',
      name: 'Course',
      extra: { static_data: [] }
    })
  )
  const userLabs = ref(
    getInitialState({
      title: 'Individual lab minutes used',
      name: 'Lab'
    })
  )
  const userTotalStats = ref(
    getInitialState({
      title: 'Courses/Labs Stats',
      name: 'Stats'
    })
  )
  const topTeams = ref(
    getInitialState({
      title: 'Active teams',
      name: 'Team'
    })
  )
  const usersStats = ref(
    getInitialState({
      title: 'User stats',
      name: 'User stats',
      extra: { values_list: [] }
    })
  )
  const dateProgressStats = ref(
    getInitialState({
      title: 'User Activity',
      name: 'User Activity',
      extra: { values_list: [], max: 10, min: 0 },
      isProgress: true
    })
  )
  const dateUserProgressStats = ref(
    getInitialState({
      title: 'User Activity',
      name: 'User Activity',
      isProgress: true
    })
  )
  const dateTeamProgressStats = ref(
    getInitialState({
      title: 'User Activity',
      name: 'User Activity',
      isProgress: true
    })
  )
  const allDateUserProgressStats = ref(
    getInitialState({
      title: 'User Activity',
      name: 'User Activity',
      isProgress: true
    })
  )
  const individualDateUserProgressStats = ref({
    data: {}
  })
  const individualDateTeamProgressStats = ref({
    data: {}
  })
  const allIndividualDateUserProgressStats = ref({
    data: {}
  })
  const individualDateUserDetailedProgressStats = ref({
    data: {}
  })
  const allIndividualDateUserDetailedProgressStats = ref({
    data: {}
  })
  const individualDateTeamDetailedProgressStats = ref({
    data: {}
  })
  const individualDateProgressStats = ref({
    data: {}
  })

  async function manageLoading(callback, errorCallback) {
    try {
      isLoading.value = true
      return await callback()
    } catch (err) {
      console.log(err)
      return errorCallback ? errorCallback(err) : null
    } finally {
      isLoading.value = false
    }
  }

  function generateSummaryStats(responseData) {
    const progressData = {
      data: responseData,
      list_values: []
    }
    Object.entries(responseData).forEach(([key, value]) => {
      if (value.event.event_name) {
        const summary = {
          lab: 0,
          vid: 0,
          quiz: 0,
          media: 0,
          download: 0,
          item_ttl: 0,
          total_mins: 0
        }
        value.items.forEach((subData) => {
          if (subData.item_ttl) {
            summary.item_ttl += Math.ceil(subData.item_ttl / 60) || 1
          }
          const da = Number(subData.item_ttl)
          const hour = Math.floor(Math.floor(da / 3600)) | 0
          const minutes = Math.floor((da % 3600) / 60) | 0
          const seconds = Math.floor((da % 3600) % 60) | 0
          if (subData.sk.includes('lab')) {
            summary.lab = summary.lab + 1
          } else if (subData.sk.includes('vid')) {
            summary.vid = summary.vid + 1
          } else if (subData.sk.includes('quiz')) {
            summary.quiz = summary.quiz + 1
          } else if (subData.sk.includes('media')) {
            summary.media = summary.media + 1
          } else if (subData.sk.includes('download')) {
            summary.download = summary.download + 1
          }
          let default_val = seconds > 29 ? 1 : 0
          const val_data = hour * 60 + minutes + default_val
          let add_default_value = val_data <= 0 ? 1 : 0
          summary.total_mins += val_data + add_default_value
        })
        progressData.list_values.push({
          event_id: key,
          name: value.event.event_name,
          logo: value.event.logo,
          summary: summary
        })
      }
    })
    return progressData
  }

  function generateDetailedProgressStats(response) {
    const progressData = {
      data: [],
      list_values: [],
      summary: {
        lab: 0,
        vid: 0,
        quiz: 0,
        media: 0,
        download: 0,
        item_ttl: 0,
        total_mins: 0
      }
    }
    if (response.data.success) {
      response.data.data.forEach((info) => {
        info.item_ttl && (progressData.summary.item_ttl = progressData.summary.item_ttl + info.item_ttl)
        const da = Number(info.item_ttl)
        const hour = Math.floor(Math.floor(da / 3600)) | 0
        const minutes = Math.floor((da % 3600) / 60) | 0
        const seconds = Math.floor((da % 3600) % 60) | 0
        let type = 'lab'
        if (info.id.includes('lab')) {
          progressData.summary.lab = progressData.summary.lab + 1
          type = 'lab'
        } else if (info.id.includes('vid')) {
          progressData.summary.vid = progressData.summary.vid + 1
          type = 'vid'
        } else if (info.id.includes('quiz')) {
          progressData.summary.quiz = progressData.summary.quiz + 1
          type = 'quiz'
        } else if (info.id.includes('media')) {
          progressData.summary.media = progressData.summary.media + 1
          type = 'media'
        } else if (info.id.includes('download')) {
          type = 'download'
          progressData.summary.download = progressData.summary.download + 1
        }

        let default_val = seconds > 29 ? 1 : 0
        const val_data = hour * 60 + minutes + default_val
        let add_default_value = val_data <= 0 ? 1 : 0
        progressData.summary.total_mins += val_data + add_default_value

        progressData.data.push({
          id: info.id,
          name: info.name,
          item_ttl: info.item_ttl,
          type,
          time_mins: val_data + add_default_value
        })
      })
      return progressData
    }
  }

  function fetchCompanyStatsAction(payload) {
    return manageLoading(async () => {
      const res = await apiMacroMeta.post('company-stats', payload)
      isLoading.value = false
      monthlyStats.value = {
        labels: res.data.monthly.dates.map((dateConvMonth) => dateFormatReadable(dateConvMonth)),
        colors: ['#4FA0E1', '#58D8A5', '#EC8937', '#6900FF'],
        title: 'Monthly report',
        name: 'Monthly report',
        data: [
          {
            label: 'Course mins',
            data: res.data.monthly.course_minutes,
            bgColor: '#FF5E62'
          },
          {
            label: 'Lab mins',
            data: res.data.monthly.lab_minutes,
            bgColor: '#6600FF'
          },
          {
            label: 'Video mins',
            data: res.data.monthly.video_minutes,
            bgColor: '#00DA9F'
          }
        ]
      }
      weeklyStats.value = {
        labels: res.data.weekly.dates.map((dateConv) => dateFormatReadable(dateConv)),
        colors: ['#4FA0E1', '#58D8A5', '#EC8937', '#6900FF'],
        title: 'Weekly report',
        name: 'Weekly report',
        data: [
          {
            label: 'Course mins',
            data: res.data.weekly.course_minutes,
            bgColor: '#FF5E62'
          },
          {
            label: 'Lab mins',
            data: res.data.weekly.lab_minutes,
            bgColor: '#6600FF'
          }
        ]
      }

      const newTopCourses = {
        data: [],
        labels: [],
        colors: [],
        values: [],
        static_data: [],
        title: 'Top Five Courses',
        name: 'Top Five Courses'
      }
      const color = [
        '#4FA0E1',
        '#58D8A5',
        '#EC8937',
        '#6900FF',
        '#5E64EA',
        '#FF5733',
        '#6f4a8e',
        '#3282b8',
        '#00c698',
        '#0097A7',
        '#CC6699',
        '#9CCC65',
        '#FFB300',
        '#DCE775',
        '#5C6BC0',
        '#99CCFF',
        '#00ACC1',
        '#9575CD',
        '#D9B277',
        '#CACAC3',
        '#2B3766',
        '#BA674B',
        '#C9352B',
        '#8639A7',
        '#ad8528',
        '#7593C9',
        '#9de3b6',
        '#1B1B53',
        '#8787e0',
        '#bf8673',
        '#c266c4',
        '#CC9E76',
        '#C7A876',
        '#EFC5AB',
        '#90348A',
        '#164E80'
      ]
      let index = 0
      res.data.top_courses?.forEach((info) => {
        const common = { name: info.course_name, itemStyle: { color: color[index] } }
        newTopCourses.data.push({
          value: info.duration,
          ...common
        })
        // newTopCourses.static_data.push({
        //   value: info.enrollment_count + 5 * (10 * (5 - index)),
        //   ...common
        // })
        newTopCourses.labels.push(common.name)
        // newTopCourses.values.push(info.enrollment_count)
        index = index + 1
      })
      topCourses.value = newTopCourses

      const newTopTeams = {
        data: [],
        labels: [],
        colors: [],
        title: 'Active team',
        name: 'Team'
      }
      let loopIndex = 0
      res.data.top_teams?.forEach((info) => {
        loopIndex = loopIndex + 1
        newTopTeams.data.push({
          name: info.name,
          value: info.course_minutes,
          itemStyle: { color: colorBasedOnIndex(loopIndex) }
        })
        newTopTeams.labels.push(info.name)
      })
      topTeams.value = newTopTeams
    })
  }

  function fetchUserStats() {
    return manageLoading(async () => {
      const res = await api.get('company/user-counts')
      if (!res.data.success) return
      usersStats.value = {
        data: [
          { name: 'Admin users', value: res.data.data.admin_users || 0 },
          { name: 'Normal users', value: res.data.data.users || 0 },
          { name: 'Inactive users', value: res.data.data.inactive || 0 }
        ],
        labels: ['Admin users', 'Normal users', 'Inactive users'],
        colors: ['#4FA0E1', '#58D8A5', '#EC8937'],
        title: 'Users stats',
        name: 'Users stats',
        values_list: [res.data.data.admin_users || 0, res.data.data.users || 0, res.data.data.inactive || 0]
      }
    })
  }
  function fetchDateProgressStats(payloadYear) {
    return manageLoading(async () => {
      const res = await api.get(`progress/chart-data/${payloadYear}`)
      dateProgressStats.value = getInitialState({
        title: 'User Activity',
        name: 'User Activity',
        isProgress: true,
        extra: {
          max: res.data.sucess ? Math.ceil(res.data.data.max_value / 10) * 10 + 1 : 11,
          min: 1,
          data: res.data.success ? res.data.data.data : [],
          values_list: res.data.success ? Object.entries(res.data.data.original_data).map(([key, value]) => [key, value]) : []
        }
      })
    })
  }

  function fetchTeamProgressStats(payloadYear) {
    return manageLoading(async () => {
      const res = await api.get(`progress/chart-data/${payloadYear}`)
      dateTeamProgressStats.value = getInitialState({
        title: res.data.success ? 'Team Activity' : 'User Activity',
        name: res.data.success ? 'Team Activity' : 'User Activity',
        isProgress: true,
        extra: {
          max: res.data.sucess ? Math.ceil(res.data.data.max_value / 10) * 10 + 1 : 11,
          min: 1,
          data: res.data.success ? res.data.data.data : [],
          values_list: res.data.success ? Object.entries(res.data.data.original_data).map(([key, value]) => [key, value]) : []
        }
      })
    })
  }

  function fetchUserDateProgressStats(payload) {
    return manageLoading(async () => {
      const res = await apiMacroMeta.post('user-activity', payload.payload)
      let max_value = res.data.success ? 1 : 11
      const data = res.data.success
        ? res.data?.data.map((activity) => {
            activity.activity > max_value && (max_value = activity.activity)
            return [activity.date, activity.activity]
          })
        : []
      dateUserProgressStats.value = getInitialState({
        title: 'User Activity',
        name: 'User Activity',
        isProgress: true,
        extra: {
          max: max_value,
          min: 1,
          data,
          values_list: data
        }
      })
    })
  }

  function fetchAllUserDateProgressStats(payload) {
    return manageLoading(async () => {
      const res = await apiMacroMeta.post('user-activity', payload.payload)
      let max_value = res.data.success ? 1 : 11
      const data = res.data.success
        ? res.data?.data.map((activity) => {
            activity.activity > max_value && (max_value = activity.activity)
            return [activity.date, activity.activity]
          })
        : []
      allDateUserProgressStats.value = getInitialState({
        title: 'User Activity',
        name: 'User Activity',
        isProgress: true,
        extra: {
          max: max_value,
          min: 1,
          data,
          values_list: data
        }
      })
    })
  }

  function fetchDateUserProgressStatsByDate(payload) {
    return manageLoading(async () => {
      const res = await api.post(`progress/by/${payload.date}`, payload.payload)
      individualDateProgressStats.value = res.data.success
        ? generateSummaryStats(res.data.data)
        : {
            data: {}
          }
    })
  }

  function fetchAllDateUserProgressStatsByDate(payload) {
    return manageLoading(async () => {
      const res = await api.get(`progress/by/${payload.date}`)
      allIndividualDateUserProgressStats.value = res.data.success
        ? generateSummaryStats(res.data.data)
        : {
            data: {}
          }
    })
  }

  function fetchDateUserDetailedProgressStatsByDate(payload) {
    return manageLoading(async () => {
      const res = await api.post(`progress/by/${payload.date}/${payload.event_id}`, payload.payload)
      individualDateUserDetailedProgressStats.value = generateDetailedProgressStats(res)
    })
  }

  function fetchAllDateUserDetailedProgressStatsByDate(payload) {
    return manageLoading(async () => {
      const res = await api.get(`progress/by/${payload.date}/${payload.event_id}`)
      allIndividualDateUserDetailedProgressStats.value = generateDetailedProgressStats(res)
    })
  }

  function fetchTeamDetailedProgressStatsByDate(payload) {
    return manageLoading(async () => {
      const res = await api.get(`progress/by/${payload.date}/${payload.event_id}`)
      individualDateTeamDetailedProgressStats.value = generateDetailedProgressStats(res)
    })
  }

  return {
    isLoading,
    monthlyStats,
    weeklyStats,
    topCourses,
    teamWeeklyReport,
    teamMonthlyReport,
    userCourses,
    userLabs,
    userTotalStats,
    topTeams,
    usersStats,
    dateProgressStats,
    individualDateProgressStats,
    dateUserProgressStats,
    dateTeamProgressStats,
    allDateUserProgressStats,
    individualDateUserProgressStats,
    individualDateTeamProgressStats,
    allIndividualDateUserProgressStats,
    individualDateUserDetailedProgressStats,
    allIndividualDateUserDetailedProgressStats,
    individualDateTeamDetailedProgressStats,
    fetchCompanyStatsAction,
    fetchUserStats,
    fetchDateProgressStats,
    fetchTeamProgressStats,
    fetchUserDateProgressStats,
    fetchAllUserDateProgressStats,
    fetchDateUserProgressStatsByDate,
    fetchAllDateUserProgressStatsByDate,
    fetchDateUserDetailedProgressStatsByDate,
    fetchAllDateUserDetailedProgressStatsByDate,
    fetchTeamDetailedProgressStatsByDate
  }
})
