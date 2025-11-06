import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useAssessmentStore = defineStore('assessment', () => {
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
