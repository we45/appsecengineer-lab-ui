import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { apiProvisional } from 'src/boot/axios'

export const useLabProvisionStore = defineStore('labProvision', () => {
  async function startProvisioner(payload) {
    try {
      const res = await apiProvisional.post('provision/start-server', payload)
      return res.data
    } catch (err) {
      return err
    }
  }

  async function progressProvisioner(payload) {
    try {
      const res = await apiProvisional.post('provision/get-progress', payload)
      return res.data
    } catch (error) {
      if (error?.response?.status === 500) {
        Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error?.response?.data?.message })
      }
      return error
    }
  }

  return { startProvisioner, progressProvisioner }
})
