import { defineStore } from 'pinia'
import { api, apiMacroMeta } from 'src/boot/axios'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'

const useAssignmentCourse = defineStore('assignmentCourse', () => {
  const assignmentCourses = ref([])
  const expiredCourses = ref([])
  const draftCourses = ref([])
  const payload = ref({})
  const expiredPayload = ref({})
  const draftPayload = ref({})
  const searchData = ref('')
  const statusData = ref('active')
  const loading = ref(false)
  const fetchingMore = ref(false)
  const hasMoreData = ref(true)
  const updateStatus = ref(false)
  const fetchAssignmentCourseDetailsError = ref(false)
  const optionsStatusData = [
    { label: 'Active', value: 'active', color: 'indigo-7' },
    { label: 'Expired', value: 'expired', color: 'indigo-7' },
    { label: 'Draft', value: 'draft', color: 'indigo-7' }
  ]

  // Add local state for direct component use
  const localAssignmentCourses = ref([])
  const localLastEvaluatedKey = ref(null)

  const assignmentDetails = ref({})
  const pagination = ref({
    page: 1,
    limit: 50,
    total: 0
  })

  async function fetchAssignmentCourse(status, reset = false, courseStatus = 'active') {
    if (status === 'created' || status === 'deleted' || reset) {
      updateStatus.value = true
      if (courseStatus === 'active') {
        assignmentCourses.value = []
        payload.value = {}
      } else if (courseStatus === 'expired') {
        expiredCourses.value = []
        expiredPayload.value = {}
      } else if (courseStatus === 'draft') {
        draftCourses.value = []
        draftPayload.value = {}
      }
      hasMoreData.value = true
    }

    if (!hasMoreData.value) return

    if (reset) {
      loading.value = true
    } else {
      fetchingMore.value = true
    }

    try {
      let currentPayload
      if (courseStatus === 'active') {
        currentPayload = payload.value
      } else if (courseStatus === 'expired') {
        currentPayload = expiredPayload.value
      } else {
        currentPayload = draftPayload.value
      }

      const apiPayload = {
        ...(reset ? {} : currentPayload),
        status: courseStatus
      }

      const response = await api.post('company/assign/list', apiPayload)
      const newItems = response?.data?.data?.Items ?? []
      const lastEvaluatedKey = response.data?.data?.LastEvaluatedKey

      if (courseStatus === 'active') {
        if (payload.value.LastEvaluatedKey && !reset) {
          assignmentCourses.value.push(...newItems)
        } else {
          assignmentCourses.value = newItems
        }
        payload.value.LastEvaluatedKey = lastEvaluatedKey
      } else if (courseStatus === 'expired') {
        if (expiredPayload.value.LastEvaluatedKey && !reset) {
          expiredCourses.value.push(...newItems)
        } else {
          expiredCourses.value = newItems
        }
        expiredPayload.value.LastEvaluatedKey = lastEvaluatedKey
      } else {
        if (draftPayload.value.LastEvaluatedKey && !reset) {
          draftCourses.value.push(...newItems)
        } else {
          draftCourses.value = newItems
        }
        draftPayload.value.LastEvaluatedKey = lastEvaluatedKey
      }

      // Update hasMoreData based on lastEvaluatedKey
      hasMoreData.value = Boolean(lastEvaluatedKey)

      return response?.data?.data
    } catch (err) {
      console.warn(err)
    } finally {
      updateStatus.value = false
      loading.value = false
      fetchingMore.value = false
    }
  }

  // New function to fetch assignment courses with local state
  async function fetchLocalAssignmentCourses(params, reset = false) {
    if (reset) {
      localAssignmentCourses.value = []
      localLastEvaluatedKey.value = null
      hasMoreData.value = true
    }

    if (!hasMoreData.value) return

    try {
      const apiPayload = {
        ...params
      }

      // Add last evaluated key if available and not resetting
      if (localLastEvaluatedKey.value && !reset) {
        apiPayload.LastEvaluatedKey = localLastEvaluatedKey.value
      }

      const response = await api.post('company/assign/list', apiPayload)
      const newItems = response?.data?.data?.Items ?? []
      const newLastEvaluatedKey = response.data?.data?.LastEvaluatedKey

      // Update state
      if (reset) {
        localAssignmentCourses.value = newItems
      } else {
        localAssignmentCourses.value = [...localAssignmentCourses.value, ...newItems]
      }

      localLastEvaluatedKey.value = newLastEvaluatedKey
      hasMoreData.value = Boolean(newLastEvaluatedKey)

      return response?.data?.data
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  async function loadMore() {
    if (loading.value || fetchingMore.value || !hasMoreData.value) return
    return fetchAssignmentCourse(null, false, statusData.value)
  }

  function resetState(courseStatus = 'active') {
    if (courseStatus === 'active') {
      assignmentCourses.value = []
      payload.value = {}
    } else if (courseStatus === 'expired') {
      expiredCourses.value = []
      expiredPayload.value = {}
    } else {
      draftCourses.value = []
      draftPayload.value = {}
    }
    hasMoreData.value = true
  }

  async function fetchAssignmentCourseDetails(payload = {}, loader = true) {
    loading.value = Boolean(loader)
    fetchAssignmentCourseDetailsError.value = false
    try {
      const response = await api.post(`company/assign/get`, {
        ...payload,
        page: pagination.value.page,
        limit: pagination.value.limit
      })
      assignmentDetails.value = response.data?.data
      pagination.value.total = assignmentDetails.value?.report?.total_users ?? 0
      return response.data?.data
    } catch (err) {
      console.warn(err)
      fetchAssignmentCourseDetailsError.value = true
    } finally {
      loading.value = false
    }
  }

  async function fetchAssignmentById(id) {
    loading.value = true
    try {
      const response = await api.post(`company/assign/get`, {
        assign_id: id,
        extra: 'a_'
      })
      return response.data?.data
    } catch (err) {
      console.warn(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchAssignmentCourseMetrics(payload) {
    try {
      const response = await apiMacroMeta.post('assignment/metrics/compute', payload)

      Notify.create({
        message: response?.data?.message ?? 'Metrics computed successfully',
        type: 'positive',
        position: 'top'
      })
      return response.data?.data
    } catch (err) {
      console.warn(err)
    }
  }

  function updatePagination(newPagination) {
    pagination.value = {
      ...pagination.value,
      ...newPagination
    }
  }

  const filteredAssignmentCourse = computed(() => {
    // Get the appropriate course list based on status
    let currentCourses
    if (statusData.value === 'expired') {
      currentCourses = expiredCourses.value
    } else if (statusData.value === 'draft') {
      currentCourses = draftCourses.value
    } else {
      currentCourses = assignmentCourses.value
    }

    // Apply search filter if needed
    if (!searchData.value) return currentCourses

    return currentCourses.filter((item) => {
      return item.name.toLowerCase().includes(searchData.value.toLowerCase())
    })
  })

  return {
    fetchAssignmentCourseDetailsError,
    assignmentCourses,
    expiredCourses,
    draftCourses,
    fetchAssignmentCourse,
    resetState,
    payload,
    expiredPayload,
    draftPayload,
    searchData,
    optionsStatusData,
    statusData,
    loading,
    fetchingMore,
    hasMoreData,
    loadMore,
    filteredAssignmentCourse,
    updateStatus,
    fetchAssignmentCourseDetails,
    assignmentDetails,
    pagination,
    updatePagination,
    fetchAssignmentCourseMetrics,
    fetchAssignmentById,
    // New local state exports
    localAssignmentCourses,
    fetchLocalAssignmentCourses
  }
})

export { useAssignmentCourse }
