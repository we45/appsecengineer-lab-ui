import { defineStore } from 'pinia'
import { api, apiMacroMeta } from 'src/boot/axios'
import { getDateRangeOneYearAgo, getTimeSpent } from 'src/utils/dateHelper'
import { ref } from 'vue'

export const useCompanyUserReports = defineStore('companyUserReports', () => {
  const users = ref([])
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const hasNextPage = ref(false)

  async function handleAsyncOperation(callback, errCallback) {
    try {
      return await callback()
    } catch (error) {
      return errCallback ? errCallback?.(error) : undefined
    }
  }

  function fetchTopUsers({ select, page = 1, limit = 50 }) {
    return handleAsyncOperation(async () => {
      const res = await apiMacroMeta.post('top-users', {
        select,
        page,
        limit
      })

      const { data, success } = res.data

      if (success) {
        const newUsers = data?.data ?? []
        totalUsers.value = data?.total ?? 0
        hasNextPage.value = data?.next ?? false
        currentPage.value = page

        newUsers?.forEach((user, index) => {
          user.timeSpent = getTimeSpent((user.course_minutes + user.lab_minutes) * 60)
          user.position = (page - 1) * limit + index + 1
        })

        if (page > 1) {
          users.value = [...users.value, ...newUsers]
        } else {
          users.value = newUsers
        }
      }
    })
  }

  function fetchUserActiveCourses(email) {
    return handleAsyncOperation(async () => {
      const res = await api.post('company/users-active-courses', {
        email
      })
      const data = { courses: [], assignments: [] }
      if (res.data.success) {
        data.courses = res.data.data?.map((course) => {
          course.timeSpent = (course?.lab_duration ?? 0) + (course?.vid_duration ?? 0)
          return course
        })
        data.assignments = res.data.assignments ?? []
      }
      return data
    })
  }

  function fetchUserCompletedCourses(email) {
    return handleAsyncOperation(async () => {
      const res = await api.post('company/users-completed-courses', {
        email
      })
      const data = { courses: [], assignments: [] }
      if (res.data.success) {
        data.courses = res.data.data?.map((course) => {
          course.timeSpent = (course?.lab_duration ?? 0) + (course?.vid_duration ?? 0)
          course.progress = 100
          return course
        })
        data.assignments = res.data.assignments ?? []
      }
      return data
    })
  }

  function fetchUserStats(email) {
    return handleAsyncOperation(async () => {
      const res = await apiMacroMeta.post('user-report', {
        user_id: email
      })

      const stats = [
        {
          title: 'Completed challenges',
          value: res.data.challenges_completed ?? 0
        },
        {
          title: 'Completed labs',
          value: res.data.labs_completed ?? 0
        },
        {
          title: 'Enrolled courses',
          value: res.data.total_enrolled ?? 0
        }
      ]

      const activity = []
      let dateRange = getDateRangeOneYearAgo()
      let max = 0
      let min = 1000
      res.data.dashboard?.forEach((act) => {
        max = Math.max(act.activity, max)
        min = Math.min(act.activity, min)
        activity.push([act.date, act.activity])
      })

      return {
        stats,
        activity,
        dateRange,
        max,
        min
      }
    })
  }

  return {
    users,
    totalUsers,
    currentPage,
    hasNextPage,
    fetchTopUsers,
    fetchUserActiveCourses,
    fetchUserCompletedCourses,
    fetchUserStats
  }
})
