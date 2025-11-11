import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { apiProvisional, integration } from 'src/boot/axios'
import { useAsyncOperation } from 'src/composables/useAsyncOperation'
import { ref } from 'vue'

export const useLabProvisionStore = defineStore('labProvision', () => {
  const { isLoading, manageAsyncOperation } = useAsyncOperation()
  const labData = ref({
    data: null,
    instructions: undefined
  })

  const loaders = ref({
    startProvisioner: false,
    progressProvisioner: false,
    fetchLabInfo: false,
    fetchLabInstructions: false,
    stopProvisioner: false
  })

  async function startProvisioner(payload) {
    return manageAsyncOperation(
      async () => {
        if (payload.token_data && payload.partner_id) {
          const { token_data, partner_id, lab_id } = payload
          const res = await integration.post('provisioner/lab-start-server', {
            token: token_data,
            partner_id: partner_id,
            lab_id: lab_id
          })
          return res.data
        } else {
          const res = await apiProvisional.post('provision/start-server', payload)
          return res.data
        }
      },
      (err) => {
        console.log(err)
      },
      (loading) => {
        loaders.value.startProvisioner = loading
      }
    )
  }

  async function progressProvisioner(payload) {
    return manageAsyncOperation(
      async () => {
        if (payload.token_data && payload.partner_id) {
          const { token_data, partner_id, lab_id } = payload
          const res = await integration.post('provisioner/lab-get-progress', {
            token: token_data,
            partner_id: partner_id,
            lab_id: lab_id
          })
          return res.data
        } else {
          const res = await apiProvisional.post('provision/get-progress', payload)
          return res.data
        }
      },
      () => {
        if (error?.response?.status === 500) {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: error?.response?.data?.message
          })
        }
      },
      (loading) => {
        loaders.value.progressProvisioner = loading
      }
    )
  }

  async function fetchLabInfo(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await integration.post('provisioner/lab-get', payload)
        if (res.data.success) {
          const data = res.data.data
          labData.value.data = {
            ...(data.lab ?? {}),
            ...(data.running_labs ?? {}),
            is_alive: Object.keys(data.running_labs ?? {}).length > 0
          }
        }
      },
      (err) => {
        console.log(err)
      },
      (loading) => {
        loaders.value.fetchLabInfo = loading
      }
    )
  }

  async function fetchLabInstructions(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await integration.post('provisioner/lab-instructions', payload)
        if (res.data.success) {
          labData.value.instructions = res.data.data ?? undefined
        }
      },
      (err) => {
        console.log(err)
      },
      (loading) => {
        loaders.value.fetchLabInstructions = loading
      }
    )
  }

  async function stopProvisioner(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await integration.post('provisioner/delete-server', payload)
        if (res.data.success) {
          labData.value.data.is_alive = false
        }
      },
      (err) => {
        console.log(err)
      },
      (loading) => {
        loaders.value.stopProvisioner = loading
      }
    )
  }

  return {
    startProvisioner,
    progressProvisioner,
    fetchLabInfo,
    fetchLabInstructions,
    stopProvisioner,

    isLoading,
    labData,
    loaders
  }
})
