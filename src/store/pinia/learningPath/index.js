import { api, apiTests } from 'src/boot/axios'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { scorm } from 'src/boot/axios'

export const useLearningPathStore = defineStore('learningPathStore', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const learningPathList = ref([])
  const learningPathListPopular = ref([])
  const learningPathOptions = ref([])
  const learningPathChallengeCounts = ref([])

  function getLpData(response, publicUrl) {
    if (publicUrl) return response?.data?.data ?? []
    return response?.data?.data?.data ?? []
  }
  async function fetchLearningPath(payload, publicUrl = undefined) {
    try {
      isLoading.value = true
      const res = publicUrl ? await scorm.get('lp') : await api.post('learning-path/list', payload)
      if (res.data.success) {
        const learningPaths = []
        const lpOptions = []

        const lpData = getLpData(res, publicUrl)

        lpData.forEach((learningPath) => {
          learningPaths.push({
            name: learningPath.learning_path_name,
            description: learningPath.description,
            logo: learningPath.logo,
            id: learningPath.sk,
            courses: learningPath.courses || 0,
            price_id: learningPath.price_id || '',
            price: learningPath.pricing?.price || 99,
            created_on: learningPath.created_on
          })
          lpOptions.push({
            label: learningPath.learning_path_name,
            value: learningPath.sk,
            logo: learningPath.logo
          })
        })
        lpOptions.sort((a, b) => {
          const nameA = a.label.toLowerCase()
          const nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        learningPathList.value = learningPaths
        learningPathOptions.value = lpOptions
      }
    } catch (err) {
      isError.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function popularLearningPath() {
    try {
      isLoading.value = true
      const res = api.get('lps/popular')
      if (res.data.success) {
        const learningPaths = []
        Object.entries(res.data.data).forEach(([key, value]) => {
          if (value.sk && value.learning_path_name) {
            learningPaths.push({
              name: value.learning_path_name,
              logo: value.logo,
              description: value.description,
              id: value.sk,
              count: value.count,
              courses: value.courses || 0
            })
          }
        })
        const sortedObj = learningPaths.sort((a, b) => b.count - a.count)
        learningPathListPopular.value = sortedObj
      }
    } catch (err) {
      isError.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function loadLPWithChallengeCount() {
    try {
      isLoading.value = true
      const res = await apiTests.post('challenge/list', { lp: true })
      if (!res.data?.success) return
      learningPathChallengeCounts.value = res.data?.data ?? []
    } catch (error) {
      isError.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    isError,
    learningPathListPopular,
    learningPathOptions,
    learningPathList,
    fetchLearningPath,
    popularLearningPath,
    loadLPWithChallengeCount,
    learningPathChallengeCounts
  }
})
