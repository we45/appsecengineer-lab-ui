import { inject, provide } from 'vue'
import { apiCourseGenerator, api, apiQuiz } from 'src/boot/axios'
import { ref } from 'vue'
import { negativeNotify, positiveNotify } from 'src/utils/notify'

const symbol = Symbol('creatorStudio')

function useCourseGenerationState() {
  const STATUS = {
    ALL: {
      label: 'All',
      value: 'ALL'
    },
    SUBMITTED: {
      label: 'Submitted',
      value: 'SUBMITTED'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      value: 'IN_PROGRESS'
    },
    GENERATING_COVER_IMAGE: {
      label: 'Generating Cover Image',
      value: 'GENERATING_COVER_IMAGE'
    },
    RESEARCHING_TOPIC: {
      label: 'Researching Topic',
      value: 'RESEARCHING_TOPIC'
    },
    WRITING_VOICEOVERS: {
      label: 'Writing Voiceovers',
      value: 'WRITING_VOICEOVERS'
    },
    ENGAGING_TRAINER: {
      label: 'Engaging Trainer',
      value: 'ENGAGING_TRAINER'
    },
    FINALIZING: {
      label: 'Finalizing',
      value: 'FINALIZING'
    },
    COMPLETED: {
      label: 'Completed',
      value: 'COMPLETED'
    },
    FAILED: {
      label: 'Failed',
      value: 'FAILED'
    },
    CANCELLED: {
      label: 'Cancelled',
      value: 'CANCELLED'
    }
  }
  const ORDER = {
    ASC: {
      label: 'Ascending',
      value: 'ASC'
    },
    DESC: {
      label: 'Descending',
      value: 'DESC'
    }
  }
  const DEFAULT_PAGINATION = {
    page: 1,
    limit: 20
  }

  const isLoading = ref(false)
  const courses = ref([])
  const learningPaths = ref([])
  const currentCourse = ref(null)
  const filters = ref({
    search_term: undefined,
    sort_order: ORDER?.DESC.value,
    filter_by: STATUS?.ALL.value
  })
  const pagination = ref({ ...DEFAULT_PAGINATION })
  const hasMoreCourses = ref(false)
  const pollInterval = ref(null)

  async function manageAsyncOperation(callback, errCallback = null) {
    try {
      isLoading.value = true
      return await callback?.()
    } catch (error) {
      console.log(error)
      return await errCallback?.(error)
    } finally {
      isLoading.value = false
    }
  }

  async function loadCourses(loadMore) {
    if (!loadMore) {
      pagination.value = {
        ...DEFAULT_PAGINATION,
        sort_by: filters.value.sort_by,
        sort_order: filters.value.sort_order
      }
    }
    return fetchCourses()
  }

  async function fetchCourses(payload = {}) {
    return manageAsyncOperation(async () => {
      const { search_term, filter_by, sort_by, sort_order } = filters.value

      const finalPayload = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search_term: search_term?.length > 1 ? search_term : undefined,
        filter_by: filter_by === STATUS.ALL.value ? undefined : filter_by,
        sort_by: sort_by || undefined,
        sort_order: sort_order || ORDER?.DESC.value,
        ...payload
      }

      const res = await apiCourseGenerator.post('course-generation/search', finalPayload)

      if (res.data.success) {
        const data = res.data.data?.data ?? []

        if (pagination.value.page > 1) {
          courses.value.push(...data)
        } else {
          courses.value = data
        }

        hasMoreCourses.value = Boolean(res.data.data?.has_more)
        if (hasMoreCourses.value) {
          pagination.value.page++
        }
      }

      return res.data
    })
  }

  function generateCourse(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await apiCourseGenerator.post('course-generation', payload)
        if (res.data.success) {
          courses.value.unshift(res.data.data)
          positiveNotify('Course has been queued for creation')
        }
      },
      (err) => {
        negativeNotify(err.response.data.message)
      }
    )
  }

  async function fetchCourseDetails(courseId, noLoading = false) {
    return manageAsyncOperation(async () => {
      if (noLoading) {
        isLoading.value = false
      }
      const res = await apiCourseGenerator.get(`course-generation/${courseId}`, { noLoading })
      if (res.data.success) {
        currentCourse.value = res.data.data
        //can we also update in this courses
        const index = courses.value.findIndex((course) => course._key === courseId)
        if (index !== -1) {
          courses.value[index] = res.data.data
        }
      }
    })
  }

  async function deleteCourse(courseId) {
    return manageAsyncOperation(async () => {
      const res = await apiCourseGenerator.delete(`course-generation/${courseId}`)
      if (res.data.success) {
        const index = courses.value.findIndex((course) => course._key === courseId)
        if (index !== -1) {
          courses.value.splice(index, 1)
        }
        positiveNotify('Course deleted successfully')
      }
      return res.data
    })
  }

  // Fetch learning path list from external API
  async function fetchLearningPaths() {
    return manageAsyncOperation(async () => {
      const res = await api.post('learning-path/list')
      if (res.data && res.data.success) {
        learningPaths.value = res.data?.data?.data || []
      }
    })
  }

  async function finalizeCourse(courseId) {
    return manageAsyncOperation(async () => {
      const res = await apiCourseGenerator.put(`course-generation/${courseId}`)
      console.log(res)
      if (res.data.success) {
        // Fetch updated course data with full quiz details
        await fetchCourseDetails(courseId)
        positiveNotify('Course finalized successfully')
      }
    })
  }

  async function pollCourseStatus(courseId, intervalMs = 10000) {
    const FINAL_STATUSES = [STATUS.COMPLETED.value, STATUS.FAILED.value, STATUS.CANCELLED.value]

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          await fetchCourseDetails(courseId, true)

          if (!currentCourse.value) {
            clearPollInterval()
            reject(new Error('Course not found'))
            return
          }

          const currentStatus = currentCourse.value.status

          if (FINAL_STATUSES.includes(currentStatus)) {
            clearPollInterval()
            resolve(currentCourse.value)
          }
        } catch (error) {
          clearPollInterval()
          reject(error)
        }
      }

      pollInterval.value = setInterval(poll, intervalMs)
      // Run first poll immediately
      poll()
    })
  }

  function clearPollInterval() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      pollInterval.value = null
    }
  }

  return {
    isLoading,
    courses,
    currentCourse,
    STATUS,
    ORDER,
    filters,
    pagination,
    hasMoreCourses,
    loadCourses,
    generateCourse,
    fetchCourseDetails,
    fetchLearningPaths,
    learningPaths,
    deleteCourse,
    finalizeCourse,
    pollCourseStatus,
    clearPollInterval
  }
}

export function provideCourseGeneration() {
  const state = useCourseGenerationState()
  provide(symbol, state)
  return state
}

export function useCourseGeneration() {
  return inject(symbol)
}
