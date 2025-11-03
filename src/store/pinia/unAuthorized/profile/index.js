import { defineStore } from 'pinia'
import { apiMacroMeta } from 'src/boot/axios'

export const usePublicProfileStore = defineStore('publicProfile', () => {
  async function fetchUser({ payload }) {
    const response = {
      success: undefined,
      data: []
    }
    try {
      const data = await apiMacroMeta.post('public-profile/overview', payload)
      response.success = true
      response.data = data.data
      return response
    } catch (err) {
      response.success = false
      return response
    }
  }

  return { fetchUser }
})
