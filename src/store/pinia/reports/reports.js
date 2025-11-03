import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiMacroMeta } from 'src/boot/axios'

const useReportsStore = defineStore('reportsStore', () => {
  const leaderboards = ref([])
  const proficiencyReports = ref([])
  const learningPathReports = ref([])
  const learningPathCompleted = ref([])
  const skills = ref([])

  async function leaderboardStats(payload = {}) {
    try {
      const { data } = await apiMacroMeta.post('company-leaderboard', payload)
      leaderboards.value = data?.data ?? []
    } catch (err) {
      console.warn(err)
    }
  }

  async function fetchProficiencyReports(payload = {}) {
    try {
      const { data } = await apiMacroMeta.post('proficiency-report', payload)
      proficiencyReports.value = data?.data ?? []
    } catch (err) {
      console.warn(err)
    }
  }
  async function fetchSkills() {
    try {
      const { data } = await apiMacroMeta.get('company/skill-report')
      skills.value = data?.data ?? []
    } catch (err) {
      console.warn(err)
    }
  }
  //b398t74m8h.execute-api.us-east-2.amazonaws.com/staging/company/lp-report

  async function fetchLearningPath() {
    try {
      const { data } = await apiMacroMeta.get('company/lp-report')
      learningPathReports.value = data?.data ?? []
    } catch (err) {
      console.warn(err)
    }
  }
  // company/lp-completed-report
  async function fetchLearningCompletePath() {
    try {
      const { data } = await apiMacroMeta.get('company/lp-completed-report')
      learningPathCompleted.value = data?.data ?? []
    } catch (err) {
      console.warn(err)
    }
  }

  return {
    leaderboards,
    leaderboardStats,
    fetchProficiencyReports,
    proficiencyReports,
    fetchSkills,
    skills,
    fetchLearningPath,
    fetchLearningCompletePath,
    learningPathReports,
    learningPathCompleted
  }
})

export { useReportsStore }
