import { defineStore } from 'pinia'
import { Notify, useQuasar } from 'quasar'
import { api, apiQuiz } from 'src/boot/axios'
import { loader, secondLoader } from 'src/utils/helpers'
import { ref, shallowRef } from 'vue'
import { useCoursesStore } from '../courses'

const useAiChallengesStore = defineStore('aiChallenges', () => {
  const $q = useQuasar()
  const challenges = ref([])
  const challengeDetails = ref([])
  const specificChallenges = ref([])
  const filteredChallenges = ref([])
  const currentPage = ref(1)
  const pageInfo = ref([])
  const isLoading = shallowRef(false)
  const listedChallenges = ref([])
  const attachedChallenges = ref([])
  const quizData = ref([])
  const getQuizAnswer = ref([])
  const isNextPage = ref(false)
  const isFiltered = ref(false)
  const isVulnerabilityMapLoading = ref(false)

  const programmingLanguagesWithVulnerabilities = ref([])

  function $reset() {
    challenges.value = []
    currentPage.value = 1
    filteredChallenges.value = []
    isFiltered.value = false
  }

  function $resetQuizAnswer() {
    getQuizAnswer.value = []
  }

  function $resetQuizState() {
    getQuizAnswer.value = []
    quizData.value = []
  }

  async function fetchSavedChallenges(reset = false) {
    $q.loading.show(secondLoader({}))
    try {
      isLoading.value = true
      if (reset) {
        challenges.value = []
      }
      const { data: res } = await apiQuiz.get(`custom-challenges?page=${currentPage.value || 1}`)
      if (res.success) {
        challenges.value.push(...res.data)
        isNextPage.value = res.next
        isFiltered.value = false
        return res
      } else {
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          timeout: 1000,
          color: 'red',
          message: 'Fetching saved challenges failed'
        })
        return false
      }
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      isLoading.value = false
      $q.loading.hide()
    }
  }

  async function postNewChallenge(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data: res } = await apiQuiz.post('custom-challenge/generate', payload)
      challengeDetails.value = res.data

      return res
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function saveChallenge(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data } = await apiQuiz.post('custom-challenges', payload)

      challenges.value = []
      currentPage.value = 1
      await fetchSavedChallenges()

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function fetchSpecificChallenge(payload) {
    try {
      const { data } = await apiQuiz.get('custom-challenges', {
        params: {
          query: payload
        }
      })

      specificChallenges.value = data.data

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
    }
  }

  async function deleteChallenge(payload, showLoader = true) {
    showLoader && $q.loading.show(secondLoader({}))
    try {
      isLoading.value = true
      const { data } = await apiQuiz.delete('custom-challenges', {
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const index = challenges.value.findIndex((challenge) => challenge.key !== payload)
      challenges.value.splice(index, 1)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Removed Challenge',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error removing challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      showLoader && $q.loading.hide()
      isLoading.value = false
    }
  }

  async function filterChallenges(payload) {
    $q.loading.show(secondLoader({}))
    try {
      const { data } = await apiQuiz.get('custom-challenges', {
        params: {
          language: payload.language,
          framework: payload.framework,
          difficulty: payload.difficulty
        }
      })

      filteredChallenges.value = data.data
      listedChallenges.value = filteredChallenges.value
      challenges.value = filteredChallenges.value
      pageInfo.value = data.page_info
      isFiltered.value = true

      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function listChallenges() {
    try {
      isLoading.value = true

      const SIZE = 20
      const MAX_API_CALL = 15
      let page = 1
      let next = true
      let calls = 0

      let tmpData = []

      while (calls < MAX_API_CALL && next) {
        const { data } = await apiQuiz.get(`custom-challenges?page=${page}&size=${SIZE}`)
        tmpData.push(...(data.data ?? []))
        next = data.next
        page++
        calls++
      }
      listedChallenges.value = tmpData
      return tmpData
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function attachChallenge(payload) {
    $q.loading.show(loader({}))
    try {
      const { data } = await apiQuiz.post('publish-challenge', payload)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Challenge attached',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error attaching challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      $q.loading.hide()
    }
  }

  async function detachChallenge(payload, loading = true) {
    loading && $q.loading.show(loader({}))
    try {
      const { data } = await apiQuiz.delete('publish-challenge', { data: payload })

      const index = listedChallenges.value.findIndex((challenge) => challenge._id === payload)
      listedChallenges.value.splice(index, 1)

      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Challenge detached',
        icon: 'done'
      })

      return data
    } catch (err) {
      console.warn(err)
      Notify.create({
        type: 'negative',
        position: 'top',
        progress: true,
        message: 'Error detaching challenge',
        icon: 'report_problem'
      })

      return false
    } finally {
      loading && $q.loading.hide()
    }
  }

  async function setQuizData(data) {
    quizData.value = data
  }

  async function validateAnswer(payload) {
    try {
      // isLoading.value = true
      const { data } = await apiQuiz.post('/evaluate-challenge', payload)
      getQuizAnswer.value = data.data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      // isLoading.value = false
    }
  }

  async function validateCodeAnswer(payload, id) {
    const coursesStore = useCoursesStore()
    try {
      const { data } = await apiQuiz.post('/validate-code', payload)
      getQuizAnswer.value = data.data ?? {}
      const isPass = data.data.is_correct

      if (isPass) {
        const subjectId = coursesStore.selectedCourseInfo.activeContentDetails?.subject?._key
        const contentId = coursesStore.selectedCourseInfo.activeContentDetails?.content?._key

        coursesStore.markTopicCompleted(
          {
            event_id: payload.event_id,
            item_id: id
          },
          subjectId,
          contentId
        )
      }

      if (!payload.show_answer) {
        Notify.create({
          type: isPass ? 'positive' : 'negative',
          position: 'top',
          progress: true,
          message: isPass ? 'Correct' : 'Incorrect',
          icon: isPass ? 'done' : 'report_problem'
        })
      }

      return isPass
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  async function fetchVulnerabilityMap() {
    try {
      isVulnerabilityMapLoading.value = true
      const { data } = await apiQuiz.get('vulnerability-map')
      programmingLanguagesWithVulnerabilities.value = generatePV(data?.data || {})
      return true
    } catch (err) {
      console.warn('Failed to fetch vulnerability map:', err)
      programmingLanguagesWithVulnerabilities.value = []
      return false
    } finally {
      isVulnerabilityMapLoading.value = false
    }
  }

  function generatePV(data) {
    if (!data) return []

    const languages = data?.languages || []
    const vulnerabilities = data?.vulnerabilities || []

    const languageVulnerability = vulnerabilities.find((vulnerability) => vulnerability?.support === 'languages')
    const getLanguageVulnerabilities = languageVulnerability?.vulnerability || []

    const languageWithVulnerabilities = languages.map((item) => ({
      support: item,
      vulnerability: getLanguageVulnerabilities
    }))

    const removeLanguageVulnerabilities = vulnerabilities.filter((item) => item?.support !== 'languages')

    const mergedData = [...languageWithVulnerabilities, ...removeLanguageVulnerabilities]

    return mergedData
  }

  return {
    challenges,
    challengeDetails,
    specificChallenges,
    filteredChallenges,
    currentPage,
    pageInfo,
    isLoading,
    listedChallenges,
    attachedChallenges,
    quizData,
    getQuizAnswer,
    isNextPage,
    isFiltered,
    fetchSavedChallenges,
    postNewChallenge,
    saveChallenge,
    fetchSpecificChallenge,
    deleteChallenge,
    filterChallenges,
    attachChallenge,
    listChallenges,
    detachChallenge,
    $reset,
    validateAnswer,
    validateCodeAnswer,
    $resetQuizAnswer,
    $resetQuizState,
    setQuizData,
    fetchVulnerabilityMap,
    programmingLanguagesWithVulnerabilities,
    isVulnerabilityMapLoading
  }
})

export { useAiChallengesStore }
