import { inject, provide, computed, ref, watch } from 'vue'
import { api, apiTests } from 'src/boot/axios'
import { useAsyncOperation } from './useAsyncOperation'
import { negativeNotify, positiveNotify } from 'src/utils/notify'

const symbol = Symbol('securityChampions')

function useSecurityChampionsState() {
  const { isLoading, manageAsyncOperation } = useAsyncOperation()

  const fetchedChampion = ref(null)
  const championStats = ref(null)
  const teamMembers = ref(new Map())
  const selectedTeam = ref(null)
  const selectedSecurityChampion = ref(null)

  const learningJourneys = ref({
    data: [],
    loading: false
  })

  const champions = ref({
    data: [],
    loading: false,
    pagination: undefined
  })

  const knowledgeFeed = ref({
    data: [],
    loading: false,
    currentPage: 1,
    hasMore: false,
    error: null
  })

  const subscription = ref({
    loading: false,
    error: null,
    success: false
  })

  function fetchDashboardStats() {
    return manageAsyncOperation(async () => {
      const res = await api.get('security-champion/dashboard')
      championStats.value = res.data.data
    })
  }

  function fetchTeamUsers(payload) {
    let teamMembersData = teamMembers.value.get(payload.team_id)

    if (!teamMembersData) {
      teamMembers.value.set(payload.team_id, {
        data: [],
        pagination: undefined
      })
      teamMembersData = teamMembers.value.get(payload.team_id)
    }

    return manageAsyncOperation(async () => {
      const res = await api.post('team/list-users', payload)
      const users = res.data.data.Items
      if (payload.LastEvaluatedKey) {
        teamMembersData.data.push(...users)
      } else {
        teamMembersData.data = users
      }
      teamMembersData.pagination = res.data.data.LastEvaluatedKey ?? undefined
    })
  }

  async function loadAllTeamMembers(payload) {
    const existingData = teamMembers.value.get(payload.team_id)
    if (existingData?.data?.length && !existingData?.data?.pagination) {
      return
    }

    let API_CALLS = 50
    do {
      await fetchTeamUsers({
        ...payload,
        LastEvaluatedKey: teamMembers.value.get(payload.team_id)?.pagination ?? undefined
      })
      API_CALLS--
    } while (teamMembers.value.get(payload.team_id).pagination && API_CALLS > 0)
  }

  function addChampion(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await api.post('security-champion', payload)
        if (res.data.success) {
          updateChampionStatus(payload.team_id, payload.email, true)
          positiveNotify('Champion assigned successfully!')
        }
      },
      () => {
        negativeNotify('Failed to assign champion. Please try again.')
      }
    )
  }

  function removeChampion(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await api.delete('security-champion', {
          data: payload
        })
        if (res.data.success) {
          updateChampionStatus(payload.team_id, payload.email, false)
          positiveNotify('Champion removed successfully!')
        }
      },
      () => {
        negativeNotify('Failed to remove champion. Please try again.')
      }
    )
  }

  function fetchChampionCollection(payload = {}) {
    return manageAsyncOperation(
      async () => {
        const res = await api.post('security-champion/collection', payload)
        if (res.data.success) {
          //sort based on level
          learningJourneys.value.data = res.data.data.sort((a, b) => a.level - b.level)
        }
      },
      () => {
        learningJourneys.value.data = []
      },
      (loading) => {
        learningJourneys.value.loading = loading
      }
    )
  }

  function updateChampionStatus(teamId, email, isChampion) {
    const teamMembersData = teamMembers.value.get(teamId)
    if (teamMembersData?.data) {
      const userIndex = teamMembersData.data.findIndex((user) => {
        const userEmail = user.sk?.split('#')?.[1] ?? ''
        return userEmail === email
      })
      if (userIndex !== -1) {
        teamMembersData.data[userIndex].is_champion = isChampion
      }
    }
    updateChampionStats(teamId, email, isChampion)
  }

  function updateChampionStats(teamId, email, isChampion) {
    const teamIndex = championStats.value.teams.findIndex((team) => team.sk === teamId)
    if (teamIndex !== -1) {
      if (!championStats.value.teams?.[teamIndex]?.champions) {
        championStats.value.teams[teamIndex].champions = []
      }

      if (isChampion) {
        championStats.value.teams[teamIndex].champions.push(email)
      } else {
        championStats.value.teams[teamIndex].champions = championStats.value.teams[teamIndex].champions.filter(
          (champion) => champion !== email
        )
      }
    }
  }

  function fetchSecurityChampions() {
    return manageAsyncOperation(
      async () => {
        const { pagination } = champions.value

        const res = await api.post('company/users-list', {
          all: true,
          LastEvaluatedKey: pagination ?? undefined
        })

        if (res.data.success) {
          const championsData = res.data.data.Items?.filter((user) => user?.is_security_champion)

          if (pagination) {
            champions.value.data.push(...championsData)
          } else {
            champions.value.data = championsData
          }

          champions.value.pagination = res.data.data?.LastEvaluatedKey
        }
      },
      (err) => {
        champions.value.pagination = undefined
      }
    )
  }

  async function loadAllChampions() {
    let API_CALLS = 50
    champions.value.loading = true
    do {
      await fetchSecurityChampions()
      API_CALLS--
    } while (champions.value.pagination && API_CALLS > 0)
    champions.value.loading = false
  }

  function fetchKnowledgeFeedNews(payload = {}) {
    return manageAsyncOperation(
      async () => {
        const params = {
          page: payload.page || 1,
          limit: payload.limit || 20,
          ...payload
        }

        const res = await apiTests.get('/knowledge-feed/news', {
          params
        })

        if (res.data.success) {
          if (payload.page && payload.page > 1) {
            knowledgeFeed.value.data.push(...res.data.data.news_items)
          } else {
            knowledgeFeed.value.data = res.data.data.news_items
          }
          knowledgeFeed.value.currentPage = res.data.data.next_page || payload.page || 1
          knowledgeFeed.value.hasMore = res.data.data.has_more || false
          knowledgeFeed.value.error = null
        } else {
          knowledgeFeed.value.error = 'Failed to fetch news'
        }
      },
      (err) => {
        knowledgeFeed.value.error = err.response?.data?.message || 'Failed to load news'
        if (!payload.page || payload.page === 1) {
          knowledgeFeed.value.data = []
        }
      },
      (loading) => {
        knowledgeFeed.value.loading = loading
      }
    )
  }

  function refreshKnowledgeFeed() {
    knowledgeFeed.value.error = null
    return fetchKnowledgeFeedNews()
  }

  function subscribeToKnowledgeFeed(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await apiTests.post('/knowledge-feed/subscribe', {
          topics: payload.topics,
          subscribe: payload.subscribe
        })

        if (res.data.success) {
          subscription.value.success = true
          subscription.value.error = null
          positiveNotify('Successfully subscribed to knowledge feed!')
        } else {
          subscription.value.error = res.data.message || 'Failed to subscribe'
        }
      },
      (err) => {
        console.log(err)
        subscription.value.error = err.response?.data?.message?.topics ?? 'Failed to subscribe to knowledge feed'
        negativeNotify(subscription.value.error)
      },
      (loading) => {
        subscription.value.loading = loading
      }
    )
  }

  function resetSubscription() {
    subscription.value = {
      loading: false,
      error: null,
      success: false
    }
  }

  const teamOptions = computed(() => {
    const teams = championStats.value?.teams ?? []
    return teams
      .filter((team) => team.has_champions)
      .map((team) => ({
        label: team.team_name,
        value: team.sk,
        champions: team?.champions ?? []
      }))
  })

  watch(selectedTeam, () => {
    selectedSecurityChampion.value = null
    learningJourneys.value.data = []
  })

  watch(selectedSecurityChampion, () => {
    if (selectedSecurityChampion.value && selectedTeam.value) {
      fetchChampionCollection({
        team_id: selectedTeam.value?.value,
        email: selectedSecurityChampion.value
      })
    }
  })

  return {
    isLoading,
    fetchedChampion,
    championStats,
    teamMembers,
    fetchDashboardStats,
    fetchTeamUsers,
    loadAllTeamMembers,
    addChampion,
    removeChampion,
    fetchChampionCollection,
    teamOptions,
    selectedTeam,
    selectedSecurityChampion,
    learningJourneys,
    loadAllChampions,
    fetchSecurityChampions,
    champions,
    knowledgeFeed,
    fetchKnowledgeFeedNews,
    refreshKnowledgeFeed,
    subscription,
    subscribeToKnowledgeFeed,
    resetSubscription
  }
}

export function provideSecurityChampions() {
  const state = useSecurityChampionsState()
  provide(symbol, state)
  return state
}

export function useSecurityChampions() {
  return inject(symbol)
}
