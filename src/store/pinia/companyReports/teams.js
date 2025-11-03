import { defineStore } from 'pinia'
import { api, apiMacroMeta } from 'src/boot/axios'
import { getDateRangeOneYearAgo, getTimeSpent } from 'src/utils/dateHelper'
import { timeSinceFromEpoch } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useCompanyTeamsReports = defineStore('companyTeamsReports', () => {
  const colors = [
    '#FF8C8C', // Soft Red
    '#FFB380', // Peachy Beige
    '#FFFF99', // Light Lemon
    '#99FF99', // Mint Green
    '#80CFFF', // Light Sky Blue
    '#C18EFF', // Lavender
    '#FF80FF', // Hot Pink
    '#FF80CC', // Fuchsia Pink
    '#E6A9EC', // Light Lilac
    '#A2FFFF', // Pale Cyan
    '#9CFF80', // Pale Green
    '#FFD580', // Soft Yellow
    '#FF6600', // Coral Orange
    '#FFB366', // Light Orange
    '#FF99CC', // Light Magenta
    '#F0B3FF', // Light Violet
    '#F9CC99', // Soft Apricot
    '#FF8099', // Light Salmon
    '#F2F2F2', // Very Light Gray
    '#B3B3B3', // Soft Gray
    '#A0D9B1', // Minty Green
    '#B2D9FF', // Light Sky Blue
    '#C8A7FF', // Lilac
    '#FFB3FF', // Light Orchid
    '#FF66CC', // Hot Pink
    '#FF99FF', // Light Purple
    '#FF66FF', // Bright Violet
    '#F9D9FF', // Pale Lavender
    '#E0C2B8', // Light Tan
    '#D8A7A1', // Dusty Rose
    '#F4D0A1', // Apricot
    '#F5B28D', // Peachy Tan
    '#F9E2A6', // Soft Yellow
    '#E4A7FF', // Soft Purple
    '#FFE1D2', // Very Light Peach
    '#F0B8D8', // Soft Pink
    '#C1E8F7', // Light Aqua
    '#D1E8D4', // Pale Green
    '#C2D9E9', // Soft Periwinkle
    '#F2E8D5', // Light Cream
    '#F9D5E3', // Light Rose
    '#D9A9FF', // Light Lavender
    '#FFCD99', // Light Caramel
    '#E5D1D8', // Soft Blush
    '#FF9A80', // Soft Coral
    '#FFE4D9', // Creamy Beige
    '#D1F2B8', // Pale Lime Green
    '#C4E8FF', // Pale Blue
    '#F8A0D4', // Soft Pink
    '#D4D1E0', // Light Slate Gray
    '#A8E8C5', // Light Mint
    '#FFE6B3', // Light Lemon Yellow
    '#FFC7FF' // Soft Lavender Pink
  ]

  const teams = ref([])
  const learningPathReport = ref({
    labels: {},
    data: []
  })

  async function handleAsyncOperation(callback, errCallback) {
    try {
      return await callback()
    } catch (error) {
      return errCallback ? errCallback?.(error) : undefined
    }
  }

  function fetchTeams() {
    return handleAsyncOperation(
      async () => {
        const res = await api.post('team/list', {})
        const { data } = res
        if (data.success) {
          teams.value = data.data.Items

          const learningPathData = []
          teams.value?.forEach((team, index) => {
            learningPathReport.value.labels[team?.team_name] = team?.team_name

            team.timeSpent = getTimeSpent((team.video_minutes + team?.lab_minutes) * 60)
            team?.stat?.forEach?.((statData) => {
              if (!learningPathReport.value.labels.hasOwnProperty(statData?.lp)) {
                learningPathReport.value.labels[statData?.lp] = statData?.lp
              }
              learningPathData.push({
                from: team?.team_name,
                to: statData?.lp,
                flow: statData?.percentage,
                color: colors[index] ?? '#ffaeb0'
              })
            })
          })

          learningPathReport.value.data = learningPathData
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  function fetchTeamsActivity(teamId) {
    return handleAsyncOperation(async () => {
      const res = await apiMacroMeta.post('team/user-stats', {
        select: 'overall',
        team_id: teamId
      })

      const obj = {
        activity: {
          data: [],
          dateRange: null
        },
        assignments: [],
        completedAssignments: [],
        courses: [],
        challenges_completed: 0,
        assignments_completed: 0,
        labs_completed: 0,
        activities: []
      }

      if (res.data.success) {
        const { activity, assignments, progress, stat, recent, assign_completed } = res.data?.data

        obj.activity.dateRange = getDateRangeOneYearAgo(activity)
        let max = 0
        let min = 1000
        activity?.forEach((act) => {
          max = Math.max(act.activity, max)
          min = Math.min(act.activity, min)
          obj.activity.data.push([act.date, act.activity])
        })

        obj.assignments = assignments?.map(setTimeSpentInAssignment)
        obj.completedAssignments = assign_completed?.map(setTimeSpentInAssignment) ?? []

        obj.courses = progress?.map((courseProgress) => {
          courseProgress.progress = courseProgress?.averageProgress
          courseProgress.timeSpent = courseProgress?.duration ?? 0

          delete courseProgress?.averageProgress
          delete courseProgress?.duration
          return courseProgress
        })

        obj.assignments_completed = stat?.assignments_completed ?? 0
        obj.challenges_completed = stat?.challenges_completed ?? 0
        obj.labs_completed = stat?.labs_completed ?? 0
        obj.activity.max = max
        obj.activity.min = min
        obj.activities = recent?.map((activity) => {
          const date = timeSinceFromEpoch(activity?.date)

          const details = activity.activity?.split('_')

          return {
            date,
            name: activity.item,
            icon: '',
            action: details[0],
            type: details[1].substring(0, 3)
          }
        })
      }

      return obj
    })
  }

  function setTimeSpentInAssignment(assignment) {
    const data = {
      ...(assignment?.assign ?? assignment),
      timeSpent: 0
    }

    if (assignment?.assign) {
      data.timeSpent = (assignment?.time_spent?.lab_duration ?? 0) + (assignment?.time_spent?.vid_duration ?? 0)
      data.users = assignment?.users ?? []
    } else {
      data.timeSpent = (assignment?.assign?.time_spent?.lab_duration ?? 0) + (assignment?.assign?.time_spent?.vid_duration ?? 0)
    }

    return data
  }

  async function searchTeams(payload) {
    try {
      const { data } = await api.post('company/search-team', {
        name: payload
      })
      teams.value = data?.data?.data.map((team) => ({
        created_on: team.created_on,
        pk: team.pk,
        search_name: team.search_name,
        team_name: team.team_name.toString(),
        sk: team.sk,
        timeSpent: getTimeSpent(((team?.lab_minutes ?? 0) + (team?.video_minutes ?? 0)) * 60)
      }))
      return data
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  return {
    teams,
    learningPathReport,
    fetchTeams,
    fetchTeamsActivity,
    searchTeams
  }
})
