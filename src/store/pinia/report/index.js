import { Notify } from 'quasar'
import { defineStore } from 'pinia'
import { colorBasedOnIndex } from 'src/utils/reuseFunctions'
import { apiMacroMeta } from 'src/boot/axios'
import { ref } from 'vue'

export const useReportStore = defineStore('report', () => {
  const isLoading = ref(false)
  const selectedActionItem = ref('dashboard')
  const selectedUserActionItem = ref('Overall')
  const selectedTeamUserActionItem = ref('Overall')
  const teamUserStats = ref({
    topFiveMonthly: [],
    outlineDataMonthly: [],
    topFiveOverall: [],
    outlineDataOverall: [],
    fullListMonthly: [],
    fullListOverall: [],
    data: [],
    dataLabels: [],
    month: '',
    list: [],
    outliners: [],
    currentUsers: 0
  })
  const companyUserStats = ref({
    topFiveMonthly: [],
    outlineDataMonthly: [],
    topFiveOverall: [],
    outlineDataOverall: [],
    fullListMonthly: [],
    fullListOverall: [],
    data: [],
    dataLabels: [],
    month: '',
    list: [],
    outliners: [],
    currentUsers: 0
  })
  const statsUserCountData = ref({
    count: 0,
    items: {},
    totalUsersCount: 0,
    totalBadgesCount: 0
  })
  const statsTeamCountData = ref({
    count: 0,
    items: {},
    totalUsersCount: 0,
    totalBadgesCount: 0
  })

  async function manageLoading(callback, errCallback = undefined, finallyCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      console.log(error)
      return errCallback ? errCallback(error) : errCallback
    } finally {
      isLoading.value = false
      return finallyCallback
    }
  }

  function setUserActionSelectedItem(data) {
    selectedUserActionItem.value = data
  }

  function setSelectedItem(data) {
    selectedActionItem.value = data
  }

  function setTeamUserActionSelectedItem(data) {
    selectedTeamUserActionItem.value = data
  }

  function fetchTeamStatsCountFun(payload) {
    return manageLoading(async () => {
      const res = await apiMacroMeta.post('team/badges-count', payload)
      if (res.data.success) {
        statsTeamCountData.value = {
          ...res.data,
          totalBadgesCount: res.data.data.items.map((data) => data.badges).reduce((accumulator, value) => accumulator + value, 0),
          totalUsersCount: Object.keys(res.data.data.items).length || 0
        }
        return statsTeamCountData.value
      }
      return {}
    })
  }

  async function fetchTeamsUsersStats(payload) {
    const totalListUsers = []
    const outlineListUsers = []
    const graphData = []
    let graphDataLabels = []
    let loopIndex = 0

    try {
      const res = await apiMacroMeta.post('team/user-stats', payload)
      if (res.data.success) {
        res.data.data.items.forEach((user) => {
          const addObjUser = {}
          const objUser = {
            email: user.email,
            'First name': user.first_name,
            'Last name': user.last_name,
            'Course Minutes': user.course_minutes,
            'Lab minutes': user.lab_minutes,
            'Account status': user.account_status
          }
          const keys = ['email', 'first_name', 'last_name', 'enrolled_courses', 'course_minutes', 'lab_minutes', 'account_status']
          Object.entries(user).forEach(([key, value]) => {
            if (key && value && !keys.includes(key)) {
              addObjUser[key] = value
            }
          })
          loopIndex = loopIndex + 1
          const finalObjUser = { ...objUser, ...addObjUser }
          totalListUsers.push(finalObjUser)

          if (user.course_minutes === 0) {
            const addObjUserOutlier = {}
            Object.entries(user).forEach(([key, value]) => {
              if (key && value && !keys.includes(key)) {
                addObjUserOutlier[key] = value
              }
            })

            const finalObjUserOultier = { ...objUser, ...addObjUserOutlier }
            outlineListUsers.push(finalObjUserOultier)
          } else {
            graphData.push({
              name: user.email,
              value: user.course_minutes,
              itemStyle: { color: colorBasedOnIndex(loopIndex) }
            })
          }
        })
        if (res.data.data.pagination) {
          payload.pagination = res.data.data.pagination
        }
      }
    } catch (error) {
      Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
    }
    const sortedObj = totalListUsers.sort((a, b) => a['Course Minutes'] - b['Course Minutes'])
    const totalList = totalListUsers.sort((a, b) => b['Course Minutes'] - a['Course Minutes'])
    let graphDataInfo = graphData.sort((a, b) => b.value - a.value)

    graphDataInfo.length > 5 && (graphDataInfo = graphDataInfo.slice(0, 5))
    graphDataInfo.map((labels) => graphDataLabels.push(labels.name))
    graphDataLabels.length > 5 && (graphDataLabels = graphDataLabels.slice(0, 5))

    let seletedMonth = payload.select === 'monthly' ? payload.query : ''

    teamUserStats.value = {
      fullListMonthly: totalListUsers,
      list: totalList,
      outlineDataMonthly: outlineListUsers,
      topFiveMonthly: sortedObj,
      data: graphDataInfo,
      dataLabels: graphDataLabels,
      fullListOverall: totalListUsers,
      outlineDataOverall: outlineListUsers,
      topFiveOverall: sortedObj,
      month: seletedMonth,
      outliners: outlineListUsers,
      currentUsers: graphData.length
    }
  }

  async function fetchCompanyStatsReport(payload) {
    const totalListUsers = []
    const outlineListUsers = []
    const graphData = []
    let graphDataLabels = []
    let loopIndex = 0

    try {
      const res = await apiMacroMeta.post('top-users', payload)
      if (res.data.success) {
        res.data.data?.data?.forEach((user) => {
          loopIndex = loopIndex + 1
          const finalObj = {
            email: user.email,
            'First name': user.first_name,
            'Last name': user.last_name,
            'Course Minutes': user.course_minutes || 0,
            'Lab minutes': user.lab_minutes || 0,
            'Account status': user.account_status,
            ...user
          }
          const keyData = {}

          const keys = ['email', 'first_name', 'last_name', 'course_name', 'lab_minutes', 'account_status']
          Object.entries(user).forEach(([key, value]) => {
            !keys.includes(key) && (keyData[key] = value)
          })
          totalListUsers.push({ ...finalObj, ...keyData })
          if (user.course_minutes === 0 || user.course_minutes === null) {
            const keyDataOut = {}
            Object.entries(user).forEach(([key, value]) => {
              !keys.includes(key) && (keyDataOut[key] = value)
            })
            outlineListUsers.push({ ...finalObj, ...keyDataOut })
          } else {
            graphData.push({
              name: user.email,
              value: user.course_minutes,
              itemStyle: { color: colorBasedOnIndex(loopIndex) }
            })
          }
        })
        statsUserCountData.value.totalUsersCount = res.data?.data?.total ?? 0
        statsUserCountData.value.totalBadgesCount = res.data?.data?.badges ?? 0
      }
    } catch (error) {
      Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    }

    const sortedObj = totalListUsers.sort((a, b) => a['Course Minutes'] - b['Course Minutes'])
    let graphDataInfo = graphData.sort((a, b) => b.value - a.value)
    const totalList = totalListUsers.sort((a, b) => b['Course Minutes'] - a['Course Minutes'])
    graphDataInfo.length > 5 && (graphDataInfo = graphDataInfo.slice(0, 5))
    graphDataInfo.map((labels) => graphDataLabels.push(labels.name))
    graphDataLabels.length > 5 && (graphDataLabels = graphDataLabels.slice(0, 5))
    let seletedMonth = payload.select === 'monthly' ? payload.query : ''

    companyUserStats.value = {
      fullListMonthly: totalListUsers,
      list: totalList,
      outlineDataMonthly: outlineListUsers,
      topFiveMonthly: sortedObj,
      data: graphDataInfo,
      dataLabels: graphDataLabels,
      fullListOverall: totalListUsers,
      outlineDataOverall: outlineListUsers,
      topFiveOverall: sortedObj,
      month: seletedMonth,
      outliners: outlineListUsers,
      currentUsers: graphData.length
    }
  }

  return {
    statsTeamCountData,
    isLoading,
    statsUserCountData,
    teamUserStats,
    companyUserStats,
    selectedUserActionItem,
    fetchTeamStatsCountFun,
    fetchTeamsUsersStats,
    fetchCompanyStatsReport,
    setUserActionSelectedItem,
    selectedActionItem,
    selectedTeamUserActionItem,
    setSelectedItem,
    setTeamUserActionSelectedItem
  }
})
