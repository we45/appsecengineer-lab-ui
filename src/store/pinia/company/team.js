import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { getTimeSpent } from 'src/utils/dateHelper'
const useCompanyTeam = defineStore('companyTeam', () => {
  const companyTeams = ref([])
  const payload = ref({
    LastEvaluatedKey: undefined,
    name: undefined
  })
  const companyData = ref([])
  const loading = ref(false)
  const isLoading = ref(false)
  const statusOfTeamAPI = ref({ status: false, data: '', info: [], message: '' })

  async function fetchCompanyTeam(payload) {
    loading.value = true
    try {
      const { data } = await api.post('team/list', payload)
      companyData.value = data.data

      const modifiedData =
        data?.data?.Items.map((team) => ({
          created_on: team.created_on,
          pk: team.pk,
          search_name: team.search_name,
          team_name: team.team_name.toString(),
          sk: team.sk,
          timeSpent: getTimeSpent(((team?.lab_minutes ?? 0) + (team?.video_minutes ?? 0)) * 60)
        })) || []

      if (payload?.LastEvaluatedKey) {
        companyTeams.value.push(...modifiedData)
      } else {
        companyTeams.value = modifiedData
      }
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadAllTeams() {
    const MAX_API_CALLS = 20
    let calls = 0
    await fetchCompanyTeam()
    while (calls < MAX_API_CALLS && companyData.value?.LastEvaluatedKey) {
      try {
        await fetchCompanyTeam({
          LastEvaluatedKey: companyData.value?.LastEvaluatedKey
        })
        calls++
      } catch (err) {
        break
      }
    }
  }

  // Delete company team
  async function deleteCompanyTeam(payload) {
    loading.value = true
    try {
      const res = await api.post('team/delete', payload)
      if (res.data.success) {
        companyTeams.value = companyTeams.value.filter((team) => team.sk !== payload.team_id)
        fetchCompanyTeam({})
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully deleted' })
      } else {
        $q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: `${res.data.message}`
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  // Update Team
  async function updateCompanyTeam(payload) {
    loading.value = true
    try {
      const res = await api.post('team/update', payload)
      if (res.data.success) {
        statusOfTeamAPI.value = { status: false, data: '', info: [], message: res.data.message }
        fetchCompanyTeam({})
        Notify.create({ type: 'positive', position: 'top', progress: true, message: 'The team has been successfully updated' })
      } else {
        $q.notify({
          type: 'negative',
          message: `${res.data.message}`,
          position: 'top',
          progress: true,
          icon: 'warning'
        })
      }
    } catch (err) {
      console.log(err)
      Notify.create({ type: 'negative', position: 'top', progress: true, message: `${err.response.data.message}` })
    } finally {
      loading.value = false
    }
  }

  function clearSearch() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = undefined
    companyTeams.value = []
    fetchCompanyTeam()
  }

  async function searchTeams() {
    payload.value.LastEvaluatedKey = undefined
    payload.value.name = search
    companyTeams.value = []
    fetchCompanyTeam(true)
  }

  async function searchTeams() {
    loading.value = true
    try {
      const { data } = await api.post('company/search-team', payload.value)
      // companyTeams.value.push(...(data?.data?.data ?? []))
      const companyTeamData = data?.data?.data.map((team) => ({
        created_on: team.created_on,
        pk: team.pk,
        search_name: team.search_name,
        team_name: team.team_name.toString(),
        sk: team.sk,
        timeSpent: getTimeSpent(((team?.lab_minutes ?? 0) + (team?.video_minutes ?? 0)) * 60)
      }))
      companyTeams.value = companyTeamData
      payload.value.LastEvaluatedKey = data?.LastEvaluatedKey
      return data
    } catch (err) {
      console.warn(err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    fetchCompanyTeam,
    companyTeams,
    payload,
    loading,
    clearSearch,
    searchTeams,
    deleteCompanyTeam,
    updateCompanyTeam,
    statusOfTeamAPI,
    isLoading,
    companyData,
    loadAllTeams
  }
})

export { useCompanyTeam }
