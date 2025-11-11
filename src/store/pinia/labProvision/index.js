import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { apiProvisional, integration } from 'src/boot/axios'

export const useLabProvisionStore = defineStore('labProvision', () => {
  async function startProvisioner(payload) {
    try {
      // Use integration API with token-based auth if token_data is provided
      if (payload.token_data && payload.partner_id) {
        const { token_data, partner_id, lab_id } = payload
        const res = await integration.post('provisioner/lab-start-server', {
          token: token_data,
          partner_id: partner_id,
          lab_id: lab_id
        })
        return res.data
      } else {
        // Use regular apiProvisional for non-token flows
        const res = await apiProvisional.post('provision/start-server', payload)
        return res.data
      }
    } catch (err) {
      return err
    }
  }

  async function progressProvisioner(payload) {
    try {
      // Use integration API with token-based auth if token_data is provided
      if (payload.token_data && payload.partner_id) {
        const { token_data, partner_id, lab_id } = payload
        const res = await integration.post('provisioner/lab-get-progress', {
          token: token_data,
          partner_id: partner_id,
          lab_id: lab_id
        })
        return res.data
      } else {
        // Use regular apiProvisional for non-token flows
        const res = await apiProvisional.post('provision/get-progress', payload)
        return res.data
      }
    } catch (error) {
      if (error?.response?.status === 500) {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error?.response?.data?.message })
      }
      return error
    }
  }

  return { startProvisioner, progressProvisioner }
})
