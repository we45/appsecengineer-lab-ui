import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { scorm } from 'src/boot/axios'
import { computed, ref } from 'vue'

const useScormStore = defineStore('scorm', () => {
  const isLoading = ref(false)
  const _destinations = ref([])
  const _ltiInfo = ref({})
  const _destinationInfo = ref({})
  const _courses = ref([])
  const _launchUrl = ref('')
  const _dispatchId = ref('')
  const _newDestination = ref({})
  const isDestinationSet = ref(false)

  const destinations = computed(() => _destinations.value)
  const ltiInfo = computed(() => _ltiInfo.value)
  const destinationInfo = computed(() => _destinationInfo.value)
  const courses = computed(() => _courses.value)
  const launchUrl = computed(() => _launchUrl.value)

  async function getDestinations() {
    isLoading.value = true
    try {
      const response = await scorm.get('scorm/destination/list')
      _destinations.value = response.data.data.destinations
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createDestination(payload) {
    isLoading.value = true
    try {
      const response = await scorm.post('scorm/destination/create', payload)
      _newDestination.value = response.data.data
      _destinations.value.push(_newDestination.value)

      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Destination created successfully' })
    } catch (error) {
      Notify.create({ type: 'negative', position: 'top', progress: true, message: 'Failed to create destination' })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getLtiInfo(payload) {
    isLoading.value = true
    try {
      const response = await scorm.post('scorm/lti13/get', payload)
      _ltiInfo.value = response.data.data
      isDestinationSet.value = false
    } catch (error) {
      isDestinationSet.value = true
      Notify.create({ type: 'negative', position: 'top', progress: true, message: error.response.data.message })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function setDestination(payload) {
    isLoading.value = true
    try {
      await scorm.post('scorm/destination/set', payload)
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getDestination(payload) {
    isLoading.value = true
    try {
      const response = await scorm.post('scorm/destination/get', payload)
      _destinationInfo.value = response.data.data
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function listCourses() {
    isLoading.value = true
    try {
      const response = await scorm.get('scorm/course/list')
      _courses.value = response.data.courses
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createDispatch(payload) {
    isLoading.value = true
    try {
      const response = await scorm.post('scorm/dispatch/create', payload)
      _dispatchId.value = response.data.data.dispatch_id
      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Dispatch created successfully' })
    } catch (error) {
      Notify.create({ type: 'negative', position: 'top', progress: true, message: 'Failed to Select Course' })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getLaunchUrl() {
    isLoading.value = true
    try {
      const response = await scorm.post('scorm/lti13/dispatch/url', { dispatchId: _dispatchId.value })
      _launchUrl.value = response.data.lti_info.target_link_uri
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    _destinations,
    destinations,
    _ltiInfo,
    ltiInfo,
    _destinationInfo,
    destinationInfo,
    _courses,
    courses,
    _launchUrl,
    launchUrl,
    isDestinationSet,
    getDestinations,
    createDestination,
    getLtiInfo,
    setDestination,
    getDestination,
    listCourses,
    createDispatch,
    getLaunchUrl
  }
})

export { useScormStore }
