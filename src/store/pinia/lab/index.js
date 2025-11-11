import axios from 'axios'
import { Notify } from 'quasar'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { apiChallenge } from 'src/boot/axios'
import { api, integration } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLabStore = defineStore('labStore', () => {
  const isLoading = ref(false)
  const isError = ref('')
  const listLabData = ref([])
  const isLabInstruction = ref(false)
  const labInstructionInfo = ref('')
  const runningLabs = ref([])
  const individualLabInfo = ref({
    subject_id: '',
    event_id: ''
  })
  const challengeInfo = ref({})
  const challengeSolution = ref({})
  const challengeSolvedCount = ref(0)
  const individualUserChallengeSolvedCount = ref(0)
  const errorVerifyLab = ref({ status: false, status_msg: '', token: false, token_msg: '' })
  const statusOfApi = ref(false)
  const successResponseChallenge = ref('')
  const markdownData = ref('')

  async function manageLoading(callback, errorCallback = undefined) {
    try {
      isLoading.value = true
      return await callback()
    } catch (error) {
      return errorCallback ? errorCallback(error) : undefined
    } finally {
      isLoading.value = false
    }
  }

  const fetchLabInstructionInfo = computed(() => urlSafeBase64Decode(labInstructionInfo.value))

  function labInstructionStatus(status) {
    isLabInstruction.value = status
  }

  function errorMsgResetLab(data) {
    errorVerifyLab.value = data
  }

  function verifyLabAction(payload) {
    statusOfApi.value = false
    return manageLoading(
      async () => {
        successResponseChallenge.value = ''
        errorVerifyLab.value = { status: false, status_msg: '', token: false, token_msg: '' }
        const res = await apiChallenge.post('consumer/verify-challenge', payload)
        if (res.data.success) {
          statusOfApi.value = true
          successResponseChallenge.value = res.data.message
          errorVerifyLab.value = { status: true, status_msg: '', token: false, token_msg: '' }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: `${res.data.message}` })
        }
      },
      (error) => {
        if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try later!' })
        }
        if (error.response.status !== 400) {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          return
        }
        const err_msgs = { status: false }
        Object.entries(payload).forEach(([key, value]) => {
          err_msgs[key] = false
          err_msgs[key + '_msg'] = ''
        })
        Object.entries(error.response.data.message).forEach(([key, value]) => {
          err_msgs[key] = true
          err_msgs[key + '_msg'] =
            typeof error.response.data.message[key] === 'object' ? error.response.data.message[key].toString() : value
        })
        errorVerifyLab.value = err_msgs
        if (typeof error.response.data.message === 'string') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    )
  }

  function fetchLabInstructions(payload) {
    return manageLoading(
      async () => {
        labInstructionInfo.value = ''
        isLabInstruction.value = true
        const res = await api.post('lab/instruction', payload, { noLoading: true })
        isLabInstruction.value = false
        res.data.success && (labInstructionInfo.value = res.data.data)
      },
      (err) => (isLabInstruction.value = false)
    )
  }

  function getMarkdownData(url) {
    return manageLoading(
      async () => {
        const res = await axios.get(url, {
          headers: {
            'Content-Type': 'text/markdown'
          }
        })
        markdownData.value = res.data
        return res
      },
      (error) => {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: error.response.data.message
        })
      }
    )
  }

  function fetchChallengeData(payload) {
    return manageLoading(async () => {
      challengeSolution.value = {}
      const res = await apiChallenge.post('consumer/get-challenge', payload)
      res.data.success && (challengeInfo.value = res.data.data)
    })
  }

  function fetchChallengeSolution(payload) {
    return manageLoading(
      async () => {
        challengeSolution.value = {}
        const res = await apiChallenge.post('consumer/get-solution', payload)
        res.data.success && (challengeSolution.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchChallengeSolvedCount() {
    return manageLoading(
      async () => {
        challengeSolvedCount.value = 0
        const res = await apiChallenge.get('consumer/challenge-solved-count')
        res.data.success && (challengeSolvedCount.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchIndividualUserChallengeSolvedCount(payload) {
    return manageLoading(
      async () => {
        individualUserChallengeSolvedCount.value = 0
        const res = await apiChallenge.post('/consumer/list-solved-challenges', payload)
        res.data.success && (individualUserChallengeSolvedCount.value = res.data.data)
      },
      (err) => {
        if (typeof err.response.data.message === 'string') {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: err.response.data.message
          })
        }
      }
    )
  }

  function fetchLabInfo(payload) {
    return manageLoading(async () => {
      challengeSolution.value = {}
      const res = await api.post('lab/user-running-lab', payload, {
        crossDomain: true,
        noLoading: true
      })
      const baseCondition = Object.keys(res.data.data.running_labs).length > 0

      listLabData.value = [
        {
          name: res.data.data.lab.lab_name,
          event_id: res.data.data.lab.event_id || res.data.data.running_labs.event_id,
          id: res.data.data.lab.sk,
          lab_id: urlSafeBase64Encode(res.data.data.lab.sk),
          description: res.data.data.lab.description,
          regions: res.data.data.lab.regions,
          challenge_id: res.data.data.lab.challenge_id || '',
          url_badge: res.data.data.url || '',
          is_alive: baseCondition ? res.data.data.running_labs.is_active : false,

          ...(baseCondition
            ? {
                dns_entry: 'https://' + res.data.data.running_labs.dns_entry,
                dns_pass_entry: res.data.data.running_labs.dns_entry,
                ipv4: res.data.data.running_labs.ipv4,
                password: res.data.data.running_labs.password,
                running_ttl: res.data.data.running_labs.running_ttl,
                created_on: res.data.data.running_labs.created_on,
                port_map: res.data.data.running_labs.port_map,
                running_instance_id: res.data.data.running_labs.pk,
                instance_id: res.data.data.running_labs.sk
              }
            : {}),

          ...(baseCondition && res.data?.data?.running_labs?.cloud_type === 'multi'
            ? {
                cloud_type: res.data.data.lab.cloud_type,
                password: res.data?.data?.running_labs?.credentials?.password,
                is_alive: true
              }
            : {}),

          ...(res.data.data.lab.is_cloud
            ? {
                ou_id: res.data.data.lab.ou_id,
                cloud_type: res.data.data.lab.cloud_type,
                is_cloud: res.data.data.lab.is_cloud
              }
            : {})
        }
      ]
    })
  }

  function setBasicRunningLabInfo(data) {
    listLabData.value = [
      {
        name: data.name,
        event_id: data.event_id,
        id: data._key,
        lab_id: data._key,
        description: data.description,
        regions: data.regions,
        challenge_id: data?.challenge_id || '',
        is_alive: false
      }
    ]
  }

  function fetchIndividualLabInfo(payload) {
    return manageLoading(async () => {
      individualLabInfo.value = {
        subject_id: '',
        event_id: ''
      }
      const res = await api.post('lab/user-lab', payload, {
        crossDomain: true
      })(
        (individualLabInfo.value = {
          subject_id: res.data.data.subject_id,
          event_id: res.data.data.event_id
        })
      )
    })
  }

  function fetchRunningLabs() {
    return manageLoading(async () => {
      const res = await api.get('lab/user-running-labs')
      if (res.data.success) {
        runningLabs.value = res.data.data?.map((labData) => {
          const lab = labData.running_lab
          return {
            name: labData.lab_name,
            id: labData.lab_id,
            event_id: labData.event_id,
            subject_id: labData.subject_id,
            event_name: labData.event_name,
            dns_entry: 'http://' + lab.dns_entry,
            running_instance_id: lab.pk,
            instance_id: lab.sk,
            running_ttl: lab.running_ttl,
            created_on: lab.created_on,
            password: lab.password,
            logo: labData.logo,
            challenge_id: lab.challenge_id || ''
          }
        })
      }
    })
  }

  function fetchLabInfoFromToken(payload) {
    return manageLoading(async () => {
      let res
      try {
        // Call the new API endpoint with token-based authentication
        // res = await integration.post(
        //   'provisioner/lab-get',
        //   {
        //     lab_id: payload.lab_id
        //   },
        //   {
        //     headers: {
        //       'x-ase-api-token': payload.token_data,
        //       'partner_id': payload.partner_id
        //     },
        //     noLoading: true
        //   }
        // )

        res = await integration.post('provisioner/lab-get', {
          token: payload.token_data,
          partner_id: payload.partner_id,
          lab_id: payload.lab_id
        })

        if (!res.data.success) {
          throw new Error(res.data.message || 'Failed to fetch lab info')
        }
      } catch (error) {
        // Return mock data on error
        res = {
          data: {
            success: true,
            error: false,
            data: {
              running_labs: {},
              lab: {
                lab_ttl: 2700,
                regions: ['us-central1-a'],
                documentations: ['Kubernetes-Security-Masterclass/PodSecurityPolicy.md'],
                configuration: 'e2-small',
                image_id: 'kubernetes',
                approx_time: 45,
                search_name: 'pod security context',
                lab_name: 'Pod Security Context',
                event_id: 'event_5281b9c3-5b3f-497d-8578-2b6f020a9c8a',
                subject_id: 'subject_07f9bc5f-8b4a-405e-8894-30f65dac8919',
                description: 'Pod Security Context',
                pk: 'lab',
                created_on: '2021-08-01T17:21:16.964558',
                sk: 'lab_d18a9a1b-56ce-41f4-a7e5-67bd61e1833d'
              }
            }
          }
        }
      }

      const baseCondition = Object.keys(res.data.data.running_labs || {}).length > 0

      listLabData.value = [
        {
          name: res.data.data.lab.lab_name,
          event_id: res.data.data.lab.event_id || res.data.data.running_labs?.event_id,
          id: res.data.data.lab.sk,
          lab_id: urlSafeBase64Encode(res.data.data.lab.sk),
          description: res.data.data.lab.description,
          regions: res.data.data.lab.regions,
          challenge_id: res.data.data.lab.challenge_id || '',
          url_badge: res.data.data.url || '',
          is_alive: baseCondition ? res.data.data.running_labs.is_active : false,

          ...(baseCondition
            ? {
                dns_entry: 'https://' + res.data.data.running_labs.dns_entry,
                dns_pass_entry: res.data.data.running_labs.dns_entry,
                ipv4: res.data.data.running_labs.ipv4,
                password: res.data.data.running_labs.password,
                running_ttl: res.data.data.running_labs.running_ttl,
                created_on: res.data.data.running_labs.created_on,
                port_map: res.data.data.running_labs.port_map,
                running_instance_id: res.data.data.running_labs.pk,
                instance_id: res.data.data.running_labs.sk
              }
            : {}),

          ...(baseCondition && res.data?.data?.running_labs?.cloud_type === 'multi'
            ? {
                cloud_type: res.data.data.lab.cloud_type,
                password: res.data?.data?.running_labs?.credentials?.password,
                is_alive: true
              }
            : {}),

          ...(res.data.data.lab.is_cloud
            ? {
                ou_id: res.data.data.lab.ou_id,
                cloud_type: res.data.data.lab.cloud_type,
                is_cloud: res.data.data.lab.is_cloud
              }
            : {})
        }
      ]
    })
  }
  function fetchLabInstructionsFromToken(payload) {
    return manageLoading(
      async () => {
        labInstructionInfo.value = ''
        isLabInstruction.value = true

        try {
          // Call the new API endpoint with token-based authentication
          const res = await integration.post('provisioner/lab-instructions', {
            token: payload.token_data,
            partner_id: payload.partner_id,
            lab_id: payload.lab_id
          })

          isLabInstruction.value = false
          if (res.data.success) {
            labInstructionInfo.value = res.data.data
          }
        } catch (error) {
          // Return mock data on error
          isLabInstruction.value = false
          const mockRes = {
            data: {
              success: true,
              error: false,
              data: 'IyBQb2QgU2VjdXJpdHkgQ29udGV4dAoKIyMgSW5zdHJ1Y3Rpb25zCgo+ICoqSW1wb3J0YW50OioqIFNldCB1cCB0aGUgSzhzIENsdXN0ZXIgYnkgcnVubmluZyB0aGUgZm9sbG93aW5nIGNvbW1hbmQ6CgpgYGBiYXNoCmN1cmwgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3dlNDUveG1sLWZpbGVzL21hc3Rlci9rOC1jb250YWluZXJkLnNoIHwgc2gKYGBgCgo+IEltcG9ydGFudDogUGxlYXNlIGVuc3VyZSB0aGF0IHRoZSBjbHVzdGVyIGlzIHJ1bm5pbmcgc3VjY2Vzc2Z1bGx5IQoKKiBTdGVwIDE6IE5hdmlnYXRlIHRvIHRoZSBgUG9kU2VjdXJpdHlQb2xpY3lgIGRpcmVjdG9yeSBvbiB0aGUgcHJvdmlzaW9uZWQgc2VydmVyLgoKYGBgYmFzaApjZCAvcm9vdC9rdWJlcm5ldGVzL1BvZFNlY3VyaXR5UG9saWN5CmBgYAoKKiBTdGVwIDI6IEFwcGx5IHRoZSBBcHBBcm1vciBwcm9maWxlIG9uIHRoZSBsb2NhbCBpbnN0YW5jZQoKYGBgYmFzaAphcHBhcm1vcl9wYXJzZXIgazhzLXZ1bC1mbGFzay1yZWRpcy1hcm1vcgpgYGAKCiogU3RlcCAzOiBPYnNlcnZlIHRoZSBgc2VjdXJlLWZsYXNrLWRlcGxveS55bWxgIHNwZWMgZmlsZQoKKiBTdGVwIDQ6IENyZWF0ZSBhIHNlY3VyZSBwb2QgaW4gdGhlIGBwc3BgIG5hbWVzcGFjZSB1c2luZyBgcHNwLXNhYCBzZXJ2aWNlIGFjY291bnQKCmBgYGJhc2gKa3ViZWN0bCBjcmVhdGUgLWYgc2VjdXJlLWZsYXNrLWRlcGxveS55bWwKYGBgCgpgYGBiYXNoCmt1YmVjdGwgLW4gcHNwIGdldCBwb2RzCmBgYAoKKiBTdGVwIDU6IEFmdGVyIGEgZmV3IHNlY29uZHMsIGV4ZWMgaW50byB0aGUgcG9kLgoKYGBgYmFzaAprdWJlY3RsIC1uIHBzcCBleGVjIC10aSBzZWN1cmUtZmxhc2sgYmFzaApgYGAKCj4gSXQgY2FuIGJlIG9ic2VydmVkIHRoYXQgdGhlIHVzZXIgaW5zaWRlIHRoZSBwb2QgaXMgYG5vbi1yb290YCBhbmQgdGhlIGBzZXJ2aWNlYWNjb3VudCB0b2tlbmAgZG9lcyBub3QgZXhpc3QgaW4gYC9ydW4vc2VjcmV0cy9rdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50YAoKKiBTdGVwIDY6IE9uY2UgZXhpdGVkIGZyb20gdGhlIHBvZCwgdHJ5IHRvIGxpc3QgcG9kcyBhbmQgZXhlYyBpbnRvIGEgcG9kIGFzIGBwc3Atc2FgCgpgYGBiYXNoCmV4aXQKYGBgCgpgYGBiYXNoCmt1YmVjdGwgLW4gcHNwIC0tYXMtZ3JvdXA9c3lzdGVtOmF1dGhlbnRpY2F0ZWQgLS1hcz1zeXN0ZW06c2VydmljZWFjY291bnQ6cHNwLXNhIGV4ZWMgLXRpIHNlY3VyZS1mbGFzayBiYXNoCmBgYAoKYGBgYmFzaAprdWJlY3RsIC1uIHBzcCAtLWFzLWdyb3VwPXN5c3RlbTphdXRoZW50aWNhdGVkIC0tYXM9c3lzdGVtOnNlcnZpY2VhY2NvdW50OnBzcC1zYSBnZXQgcG9kcwpgYGAK'
            }
          }
          labInstructionInfo.value = mockRes.data.data
        }
      },
      (err) => (isLabInstruction.value = false)
    )
  }

  return {
    isLoading,
    isError,
    listLabData,
    isLabInstruction,
    labInstructionInfo,
    runningLabs,
    individualLabInfo,
    challengeInfo,
    challengeSolution,
    challengeSolvedCount,
    individualUserChallengeSolvedCount,
    errorVerifyLab,
    statusOfApi,
    successResponseChallenge,
    fetchLabInstructionInfo,
    markdownData,
    verifyLabAction,
    fetchLabInstructions,
    getMarkdownData,
    fetchChallengeData,
    fetchChallengeSolution,
    fetchChallengeSolvedCount,
    fetchIndividualUserChallengeSolvedCount,
    fetchLabInfo,
    fetchIndividualLabInfo,
    fetchRunningLabs,
    labInstructionStatus,
    errorMsgResetLab,
    setBasicRunningLabInfo,
    fetchLabInfoFromToken,
    fetchLabInstructionsFromToken
  }
})
