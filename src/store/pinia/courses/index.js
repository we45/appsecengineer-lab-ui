import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { api, apiAnalytics, apiAsegpt } from 'src/boot/axios'
import { setCourseItem, modifyCourseInfo } from 'src/utils/module/course'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useRouter } from 'vue-router'
import { CacheService } from 'src/service/CacheService'
import { Notify } from 'quasar'

const COURSE = 'course'
const PLAYGROUND = 'playground'
const CHALLENGE = 'challenge'
const LIVE_COURSE = 'live-course'
const CUSTOM_COURSE = 'custom'

export const useCoursesStore = defineStore('coursesStore', () => {
  const analyticsInfo = ref({ userUsedMinutes: 0 }) //
  const coursesData = ref([])
  const courseInfo = ref({})
  const dashboardAnalytics = ref({}) //
  const dashboardCoursesData = ref([])
  const feedBackStatus = ref(false)
  const feedBackItemDetails = ref({})
  let isFiltering = false

  const paginationState = ref({
    [COURSE]: {
      loaded: 0,
      allLoaded: false
    },
    [PLAYGROUND]: {
      loaded: 0,
      allLoaded: false
    },
    [CHALLENGE]: {
      loaded: 0,
      allLoaded: false
    },
    [LIVE_COURSE]: {
      loaded: 0,
      allLoaded: false
    },
    [CUSTOM_COURSE]: {
      loaded: 0,
      allLoaded: false
    }
  })

  const courseFilters = ref({
    search: '',
    learningPath: [],
    proficiency: [],
    progress: [],
    carrer: [],
    tags: [],
    isCustom: false
  })

  const instructorInfo = ref([])
  const isLoading = ref(false)
  const statusOfMarkingApi = ref(false)
  const isMarking = shallowRef(false)

  const gptAnswer = ref('')
  const isGptAnswerFetched = ref(false)
  const courseListAbortController = ref(null)
  const courseEnrollAbortController = ref(null)
  const loadedFilters = ref([])

  const tags = ref([])
  const tagOptions = ref([])
  const popularTags = ref([])
  const isActive = ref(false)
  const fetchCourseInfoError = ref()
  const selectedCourseInfo = ref({
    rawInfo: null,
    activeContentDetails: {
      subject: null,
      content: null
    }
  })
  const router = useRouter()

  async function manageLoading(callback, loading = true, errCallback = null) {
    try {
      loading && (isLoading.value = true)
      return await callback?.()
    } catch (error) {
      console.log(error)
      return await errCallback?.(error)
    } finally {
      loading && (isLoading.value = false)
    }
  }

  function fetchDashboardCourses() {
    return manageLoading(async () => {
      const res = await api.get('user/dashboard')
      const courseData =
        res?.data?.data?.items?.map(setCourseItem)?.sort((a, b) => {
          return a?.event_name?.localeCompare(b?.event_name)
        }) ?? []
      dashboardCoursesData.value = courseData.map((item) => {
        return {
          ...item,
          disabled: !res?.data?.data?.subs?.includes(item.id)
        }
      })
    })
  }
  function fetchDashboardAnalyticsInfo(payload) {
    return manageLoading(async () => {
      const res = await apiAnalytics.post('company/user/stats-key', payload)
      if (res.data.success) {
        analyticsInfo.value = {
          userUsedMinutes: res.data.data.course_minutes | 0
        }
      }
    })
  }
  function fetchCourses() {
    return manageLoading(async () => {
      const res = await api.get('course/list-courses')
      coursesData.value = res?.data?.data?.items?.map(setCourseItem)?.sort((a, b) => a?.event_name?.localeCompare(b?.event_name)) ?? []
    })
  }
  async function filterCourses(payload, apiCall = false, loading = true) {
    if (courseListAbortController.value) {
      await courseListAbortController.value?.abort()
    }
    if (isFiltering) return
    isFiltering = true

    try {
      let filterType = payload?.types[0]?.toLowerCase()

      if (filterType === 'live_course') {
        filterType = 'live-course'
      }

      if (paginationState.value[filterType].loaded === 0 && !paginationState.value[filterType].allLoaded) {
        coursesData.value = []
      }

      isLoading.value = loading

      const cache = new CacheService('filter-courses')
      await cache.open()

      const res = await cache.getIfExist(filterType)
      const isCached = loadedFilters.value.includes(filterType)

      if (!res || !isCached || (apiCall && !paginationState.value[filterType]?.allLoaded)) {
        if (isCached && !paginationState.value[filterType]?.allLoaded) {
          coursesData.value = res ?? []
        } else {
          await cache.deleteIfExist(filterType)
        }

        courseListAbortController.value = new AbortController()
        const signal = courseListAbortController.value?.signal

        const PER_PAGE_VALUE = 50

        const response = await api.post(
          `course/filter?page=${paginationState.value[filterType].loaded + 1}&per_page=${PER_PAGE_VALUE}`,
          payload,
          {
            signal,
            noLoading: true
          }
        )
        paginationState.value[filterType].loaded++

        const modifiedData = response?.data?.data?.items?.map(setCourseItem) ?? []

        if (modifiedData?.length < PER_PAGE_VALUE) {
          paginationState.value[filterType].allLoaded = true
        }

        coursesData.value.push(...modifiedData)

        courseListAbortController.value = null

        await cache.add(coursesData.value, filterType)
        loadedFilters.value.push(filterType)
        return
      }

      coursesData.value = res ?? []
    } catch (error) {
      if (error.code === 'ERR_CANCELED' && !coursesData.value.length) setTimeout(() => (isLoading.value = true))
    } finally {
      isLoading.value = false
      isFiltering = false
    }
  }

  async function enrollCourse(eventId, loading = true) {
    const status = {
      data: null,
      cancelled: false
    }
    try {
      loading && (isLoading.value = true)
      if (courseEnrollAbortController.value) {
        courseEnrollAbortController.value?.abort()
      }

      courseEnrollAbortController.value = new AbortController()
      const signal = courseEnrollAbortController.value?.signal

      const res = await api.post('course/info', { event_id: eventId }, { signal })
      if (res.data.success) {
        status.data = res.data?.data
        if (res.data?.data?.is_enrolled) {
          // Dashboard store removed - statistics not updated
          // useDashboardStore().dashboardStatistics.total_enrolled += 1
        }
      }
    } catch (err) {
      if (err.code === 'ERR_CANCELED') {
        loading && setTimeout(() => (isLoading.value = true))
        status.cancelled = true
      }
      if (err.response.status === 403) {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          message: err.response?.data?.message || 'Failed to enroll course',
          icon: 'report_problem'
        })
      }
    } finally {
      loading && (isLoading.value = false)
      return status
    }
  }

  function setCourseInfo(course) {
    selectedCourseInfo.value = {
      rawInfo: modifyCourseInfo(course)
    }
  }

  function markTopicCompleted(payload, subjectId, contentId) {
    return manageLoading(
      async () => {
        isMarking.value = true
        statusOfMarkingApi.value = false
        sessionStorage.setItem('feedback', false)
        feedBackStatus.value = false
        feedBackItemDetails.value = {}
        let manual = true
        payload.manual ? delete payload.manual : (manual = false)
        const res = await api.post('item/mark', payload)
        if (res.data.success) {
          await syncCompletedContent(subjectId, contentId)
          statusOfMarkingApi.value = true
          feedBackItemDetails.value = { ...payload, manual }
          if (Object.entries(res.data.data).length > 0) {
            if (res.data.data.feedback && res.data.data.completed) {
              feedBackItemDetails.value = { ...payload, feedback_completed: true }
              feedBackStatus.value = true
            } else if (res.data.data.feedback && res.data.data.badge) {
              feedBackItemDetails.value = {
                ...payload,
                feedback_badge: true,
                redirect_badge_id: res.data.data.badge
              }
              feedBackStatus.value = true
            } else if (res.data.data.feedback) {
              feedBackStatus.value = true
            } else if (res.data.data.completed) {
              router.push(`/portal/course-info/completed/${urlSafeBase64Encode(payload.event_id)}/`)
            } else if (res.data.data.badge) {
              router.push(
                `/portal/course-info/completed/${urlSafeBase64Encode(payload.event_id)}/${urlSafeBase64Encode(res.data.data.badge)}`
              )
            }
          }
        }
        isMarking.value = false
      },
      false,
      (err) => {
        isMarking.value = false
      }
    )
  }

  function getCompletionProgress(eventId) {
    return manageLoading(
      async () => {
        isMarking.value = true
        const res = await api.get(`event/progress/${eventId}`)
        if (res.data.success) {
          selectedCourseInfo.value.rawInfo.progress = res.data.data?.in_progress ?? 0
          const course = { ...selectedCourseInfo.value.rawInfo }
          await syncUpdatedCourseInCache(course)
        }
        isMarking.value = false
      },
      false,
      () => {
        isMarking.value = false
      }
    )
  }

  async function syncCompletedContent(subjectId, contentId) {
    const course = { ...(selectedCourseInfo.value.rawInfo ?? {}) }

    const selectedSubject = course?.items?.find((subject) => {
      return subject?._key === subjectId
    })
    if (!selectedSubject) return

    const selectedContent = selectedSubject?.items?.find((content) => {
      return content?._key === contentId
    })
    if (!selectedContent) return
    selectedContent.completed = true
    course.completed_items++

    const completedItems = course?.completed_items ?? 0
    const totalItems = course?.total_items ?? 0
    const progress = Math.round((completedItems / totalItems) * 100)

    course.progress = progress

    selectedCourseInfo.value.rawInfo = course
    await syncUpdatedCourseInCache(course)
  }
  function clearStoragePopup(payload) {
    feedBackStatus.value = payload
    sessionStorage.setItem('feedback', payload)
  }
  function fetchGptAnswer(payload) {
    return manageLoading(
      async () => {
        isGptAnswerFetched.value = true
        const res = await apiAsegpt.post('asegpt/query', payload)
        if (res.data.success) {
          gptAnswer.value = res.data.data
          isGptAnswerFetched.value = false
        }
      },
      (err) => {
        gptAnswer.value = err.message
        isGptAnswerFetched.value = false
      }
    )
  }

  function fetchTags(payload, loading = true) {
    return manageLoading(async () => {
      const res = await api.post('search/tags/popular', payload)
      if (res.data?.success) {
        console.log('res.data?.data?.tags', res.data?.data?.tags[0])
        popularTags.value = res.data?.data?.tags?.[0].map((item) => item.tag) || []
      }
    }, loading)
  }

  function searchTags(payload, loading = true) {
    return manageLoading(async () => {
      const res = await api.post('search/tags/autocomplete', payload)
      if (res.data?.success) {
        tagOptions.value = res.data?.data?.tags || []
      }
    }, loading)
  }

  function resetFilters() {
    courseFilters.value = {
      search: '',
      learningPath: [],
      proficiency: [],
      progress: [],
      carrer: [],
      tags: [],
      isCustom: false
    }
    tagOptions.value = []
  }

  function setActiveContentDetails(selectedSubject, selectedContent) {
    selectedCourseInfo.value.activeContentDetails = {
      subject: selectedSubject,
      content: selectedContent
    }
  }

  function findAndSetActiveSubjectAndContent(subjectId, contentId) {
    if (!selectedCourseInfo.value.rawInfo) return

    const subject = selectedCourseInfo.value.rawInfo?.items?.find((subject) => {
      return subject?._key === subjectId
    })
    const content = subject?.items?.find((content) => content?._key === contentId)

    selectedCourseInfo.value.activeContentDetails = {
      subject,
      content
    }
  }

  function fetchAndSetCourseInfo(eventId, setInfo = true, noLoading = false) {
    return manageLoading(
      async () => {
        const res = await api.post('course/info', { event_id: eventId }, { noLoading })
        if (res.data.success) {
          const rawInfo = {
            ...(res.data.data ?? {}),
            ...(res.data?.data?.course ?? {})
          }
          delete rawInfo?.course
          setInfo && setCourseInfo(rawInfo)
          return rawInfo
        }
      },
      !noLoading,
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          message: error?.response?.data?.message ?? 'Selected course is not part of subscription. Please upgrade to enroll',
          icon: 'report_problem'
        })
      }
    )
  }

  function syncUpdatedCourseInCache(course) {
    return manageLoading(async () => {
      const filterType = course.event_status?.replaceAll('_', '-')

      const cache = new CacheService('filter-courses')
      await cache.open()

      const cachedCourses = await cache.getIfExist(filterType)

      const courseIndex = cachedCourses?.findIndex((cacheCourse) => cacheCourse?._key === course._key)

      if (courseIndex >= 0) {
        cachedCourses[courseIndex] = course
        await cache.add(cachedCourses, filterType)
      }
    }, false)
  }

  return {
    isLoading,
    coursesData,
    courseInfo,
    instructorInfo,
    dashboardAnalytics,
    analyticsInfo,
    statusOfMarkingApi,
    feedBackStatus,
    feedBackItemDetails,
    dashboardCoursesData,
    fetchDashboardCourses,
    fetchDashboardAnalyticsInfo,
    fetchCourses,
    filterCourses,
    markTopicCompleted,
    clearStoragePopup,
    fetchGptAnswer,
    gptAnswer,
    isGptAnswerFetched,
    tags,
    searchTags,
    tagOptions,
    isActive,
    paginationState,
    setCourseInfo,
    courseFilters,
    resetFilters,
    fetchCourseInfoError,
    selectedCourseInfo,
    setActiveContentDetails,
    findAndSetActiveSubjectAndContent,
    fetchAndSetCourseInfo,
    enrollCourse,
    syncUpdatedCourseInCache,
    syncCompletedContent,
    isMarking,
    getCompletionProgress,
    fetchTags,
    popularTags
  }
})
