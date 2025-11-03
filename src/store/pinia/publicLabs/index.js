import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { integration } from 'src/boot/axios'
import { differenceDates, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, ref } from 'vue'

const usePublicLabsStore = defineStore('publicLabs', () => {
  const publicLabsData = ref([])
  const isLoading = ref(false)
  const isLoadingLabs = ref(false)
  const labList = ref([])
  const labInstructionInfo = ref('')
  const profileDetailedInfo = ref({})
  const isServerDeleted = ref(false)
  const videos = ref([])
  const courses = ref([])
  const expiredTime = ref(LocalStorage.getItem('EXPIRED_TIME') || 0)
  const courseFilters = ref({
    search: '',
    learningPath: [],
    proficiency: [],
    progress: [],
    carrer: []
  })

  const fetchPublicLabInstructionInfo = computed(() => labInstructionInfo.value)

  const labs = computed(() => publicLabsData.value)

  //! TODO I strongly believe it's not getting used, verify and remove it
  async function selectLabs(lab_id, ltik) {
    isLoading.value = true
    try {
      const response = await integration.post('ltiaas/select/lab', { item_id: lab_id, ltik })

      if (response.data && response.data.success && response.data.data) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = response.data.data
        // Append the form to the body
        document.body.appendChild(tempDiv)
        // Find and submit the form
        const form = tempDiv.querySelector('form')
        if (form) {
          form.submit()
        } else {
          console.error('Form not found in the response data.')
        }

        // Clean up by removing the temporary div after submission
        document.body.removeChild(tempDiv)
      }

      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function getLabDetails(lab_id, ltik) {
    isLoading.value = true
    try {
      const response = await integration.post(`ltiaas/launch/lab/get?ltik=${ltik}`, { lab_id })
      const baseCondition = Object.keys(response.data.data.running_labs).length > 0

      labList.value = [
        {
          name: response.data.data.lab.lab_name,
          event_id: response.data.data.lab.event_id || response.data.data.running_labs.event_id,
          id: response.data.data.lab.sk,
          lab_id: urlSafeBase64Encode(response.data.data.lab.sk),
          description: response.data.data.lab.description,
          regions: response.data.data.lab.regions,
          challenge_id: response.data.data.lab.challenge_id || '',
          url_badge: response.data.data.url || '',
          is_alive: baseCondition ? response.data.data.running_labs.is_active : false,

          ...(baseCondition
            ? {
                dns_entry: 'https://' + response.data.data.running_labs.dns_entry,
                dns_pass_entry: response.data.data.running_labs.dns_entry,
                ipv4: response.data.data.running_labs.ipv4,
                password: response.data.data.running_labs.password,
                running_ttl: response.data.data.running_labs.running_ttl,
                created_on: response.data.data.running_labs.created_on,
                port_map: response.data.data.running_labs.port_map,
                running_instance_id: response.data.data.running_labs.pk,
                instance_id: response.data.data.running_labs.sk
              }
            : {}),

          ...(baseCondition && response.data?.data?.running_labs?.cloud_type === 'multi'
            ? {
                cloud_type: response.data.data.lab.cloud_type,
                password: response.data?.data?.running_labs?.credentials?.password,
                is_alive: true
              }
            : {}),

          ...(response.data.data.lab.is_cloud
            ? {
                ou_id: response.data.data.lab.ou_id,
                cloud_type: response.data.data.lab.cloud_type,
                is_cloud: response.data.data.lab.is_cloud
              }
            : {})
        }
      ]
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function getInstructions(lab_id, event_id, ltik) {
    isLoading.value = true
    try {
      const response = await integration.post(`ltiaas/launch/lab/instruction?ltik=${ltik}`, {
        lab_id,
        event_id
      })
      labInstructionInfo.value = response.data.data
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfileDetailedInformation(ltik) {
    isLoading.value = true
    try {
      const res = await integration.get(`ltiaas/launch/user/profile?ltik=${ltik}`)
      const detailedInfo = res.data.data
      profileDetailedInfo.value = detailedInfo

      const d = new Date()
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      month.length < 2 && (month = '0' + month)
      day.length < 2 && (day = '0' + day)

      const finalDate = [year, month, day].join('-')
      const infoTime = differenceDates(detailedInfo.start_date, detailedInfo.end_date, finalDate)
      LocalStorage.set('EXPIRED_TIME', infoTime)

      LocalStorage.set('weekly_digest_email', detailedInfo.weekly_digest_email ?? false)

      LocalStorage.set('company_report_email', detailedInfo.company_report_email ?? false)
      expiredTime.value = infoTime || LocalStorage.getItem('EXPIRED_TIME') || 0
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function startProvisioner(payload) {
    try {
      const res = await integration.post(`ltiaas/launch/lab/start-server?ltik=${payload.ltik}`, payload)
      return res
    } catch (err) {
      return err
    }
  }

  async function progressProvisioner(payload) {
    try {
      const res = await integration.post(`ltiaas/launch/lab/get-progress?ltik=${payload.ltik}`, payload)
      return res
    } catch (err) {
      return err
    }
  }

  async function deleteLabServer(payload) {
    try {
      isServerDeleted.value = true
      const res = await integration.post(`ltiaas/launch/lab/delete-server?ltik=${payload.ltik}`, payload)
      if (!res.data.success) return
      isServerDeleted.value = false
      res.data.data.mark
    } catch (error) {
      console.log(error)
      if (error.response.status === 401 && error.response.data.message === 'The incoming token has expired') {
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'Token expired renewing new token' })
      } else if (typeof error.response.data.message === 'string') {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
      }
    }
  }

  async function selectVideo(video_id, ltik) {
    isLoading.value = true
    try {
      const res = await integration.post('ltiaas/select/video', { item_id: video_id, ltik })

      if (res.data && res.data.success && res.data.data) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = res.data.data
        // Append the form to the body
        document.body.appendChild(tempDiv)
        // Find and submit the form
        const form = tempDiv.querySelector('form')
        if (form) {
          form.submit()
        } else {
          console.error('Form not found in the response data.')
        }

        // Clean up by removing the temporary div after submission
        document.body.removeChild(tempDiv)
      }
      return res
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPublicCourses(ltik) {
    isLoading.value = true
    try {
      const PER_PAGE_VALUE = 100
      let page = 1
      let allLoaded = false
      let API_CALL_LIMIT = 7

      let loadedData = []

      while (API_CALL_LIMIT > 0 && !allLoaded) {
        const res = await integration.post(`ltiaas/launch/courses/list?ltik=${ltik}&page=${page}&per_page=${PER_PAGE_VALUE}`, {})
        loadedData = loadedData.concat(
          res.data.data.items?.map((course) => {
            return {
              ...course,
              ...course.course
            }
          })
        )
        if (res.data.data.items.length < PER_PAGE_VALUE) {
          allLoaded = true
          break
        }
        page++
        API_CALL_LIMIT--
      }
      courses.value = loadedData
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCourseLabs(course_id, ltik) {
    isLoading.value = true
    try {
      const res = await integration.post(`ltiaas/list-course-labs?ltik=${ltik}`, { event_id: course_id })
      publicLabsData.value = res.data.data.data
      return res
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCourseVideos(course_id, ltik) {
    isLoading.value = true
    try {
      const res = await integration.post(`ltiaas/list-course-videos?ltik=${ltik}`, { event_id: course_id })
      videos.value = res.data.data.videos
      return res
    } catch (error) {
      console.log(error)
    } finally {
      isLoading.value = false
    }
  }

  function resetFilters() {
    courseFilters.value = {
      search: '',
      learningPath: [],
      proficiency: [],
      progress: [],
      carrer: []
    }
  }

  return {
    publicLabsData,
    isLoading,
    selectLabs,
    getLabDetails,
    getInstructions,
    labList,
    fetchPublicLabInstructionInfo,
    fetchProfileDetailedInformation,
    profileDetailedInfo,
    startProvisioner,
    progressProvisioner,
    deleteLabServer,
    videos,
    selectVideo,
    fetchPublicCourses,
    courses,
    labs,
    isLoadingLabs,
    fetchCourseLabs,
    fetchCourseVideos,
    courseFilters,
    resetFilters
  }
})

export { usePublicLabsStore }
