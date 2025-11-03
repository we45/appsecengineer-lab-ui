import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { useProfileStore } from '../profile'

export const useAssessmentStore = defineStore('assessment', () => {
  const profileStore = useProfileStore()

  const assessmentLoading = ref(false)
  const assignAssignmentLoading = ref(false)
  const assessments = ref({
    assessment_count: 0,
    assessment_data: []
  })
  const userAssign = ref([])

  async function fetchAssessments() {
    assessmentLoading.value = true
    try {
      const queryParams = {
        assessments: true
      }
      const response = await api.get('user/profile', {
        params: queryParams
      })
      assessments.value = {
        ...assessments.value,
        ...response?.data?.data?.assessments_info
      }
      if (response?.data?.data?.security_champion_teams) {
        profileStore.securityChampionTeams = response?.data?.data?.security_champion_teams ?? []
      }
    } catch (error) {
      console.warn(error)
    } finally {
      assessmentLoading.value = false
    }
  }

  async function fetchUserAssign() {
    assignAssignmentLoading.value = true
    // company/user/assign
    try {
      const response = await api.post('company/user/assign')
      userAssign.value = [...(response.data.data?.Items ?? [])]
    } catch (error) {
      console.warn(error)
    } finally {
      assignAssignmentLoading.value = false
    }
  }

  return {
    assessments,
    fetchAssessments,
    assessmentLoading,
    fetchUserAssign,
    userAssign,
    assignAssignmentLoading
  }
})
