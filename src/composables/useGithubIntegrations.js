import { Notify } from 'quasar'
import { integration } from 'src/boot/axios'
import { inject, provide, ref, shallowRef } from 'vue'

const symbol = Symbol('githubIntegration')

function useGithubIntegrationState() {
  const isLoading = ref(false)
  const status = ref(false)
  const repositories = ref([])
  const syncedRepositories = ref([])
  const issueTypes = ref([])
  const labels = ref({})

  async function manageAsyncLoading(callback, errCallback) {
    try {
      isLoading.value = true
      return await callback?.()
    } catch (error) {
      return errCallback ? errCallback?.(error) : null
    } finally {
      isLoading.value = false
    }
  }

  function showMessage(message, isError = false) {
    Notify.create({
      type: isError ? 'negative' : 'positive',
      position: 'top',
      progress: true,
      timeout: 5000,
      message: isError ? `Error: ${message}` : `Success: ${message}`
    })
  }

  function checkStatus() {
    return manageAsyncLoading(
      async () => {
        const res = await integration.get('integration/github')
        status.value = res.data?.data?.status ?? false
      },
      () => {
        status.value = null
      }
    )
  }

  function setupCredentials(payload) {
    return manageAsyncLoading(
      async () => {
        const res = await integration.post('integration/github', payload)
        if (res.data.success) {
          showMessage('Started initializing GitHub credentials.')
        }
        return res.data.success
      },
      () => false
    )
  }

  function deleteCredentials(showAlert = true) {
    return manageAsyncLoading(async () => {
      await integration.delete('integration/github')
      showAlert && showMessage('Github integration has been removed successfully.')
    })
  }

  function loadRepositories() {
    return manageAsyncLoading(
      async () => {
        let allRepositories = []
        let page = 1
        let hasMorePages = true
        const perPage = 100
        const maxPages = 30 // Safety limit to prevent infinite loops

        while (hasMorePages && page <= maxPages) {
          try {
            const res = await integration.get('integration/github/repos', {
              params: {
                per_page: perPage,
                page: page
              }
            })

            if (!res.data.success) {
              // If the request fails, break the loop
              break
            }

            const repos = res.data?.data?.repos ?? []

            // If no repositories are returned, we've reached the end
            if (repos.length === 0) {
              hasMorePages = false
              break
            }

            // Add repositories to our collection
            allRepositories = [...allRepositories, ...repos]

            // If we got fewer than perPage repositories, we've reached the end
            if (repos.length < perPage) {
              hasMorePages = false
            } else {
              page++
            }
          } catch (error) {
            // On any error, break the loop to prevent infinite loops
            console.error(`Error fetching repositories page ${page}:`, error)
            break
          }
        }

        // Update repositories with all fetched data
        repositories.value = allRepositories

        return allRepositories.length > 0
      },
      () => false
    )
  }

  function loadSyncedRepositories() {
    return manageAsyncLoading(
      async () => {
        const res = await integration.get('integration/github/synced')
        if (res.data.success) {
          syncedRepositories.value = res.data?.data?.synced ?? []
        }
        return res.data.success
      },
      () => false
    )
  }

  function createWebhook(payload) {
    return manageAsyncLoading(
      async () => {
        const res = await integration.post('integration/github/hooks', payload)
        if (res.data.success) {
          showMessage('Github repositories have been configured successfully.')
        }
        return res.data.success
      },
      () => false
    )
  }

  function updateWebhook(payload) {
    return manageAsyncLoading(
      async () => {
        const res = await integration.patch('integration/github/hooks', payload)
        if (res.data.success) {
          showMessage('Github repositories have been re-synced successfully.')
        }
        return res.data.success
      },
      () => false
    )
  }

  function loadIssueTypes(org) {
    return manageAsyncLoading(
      async () => {
        const res = await integration.post('integration/github/issue-types', org)
        if (res.data.success) {
          issueTypes.value = res.data?.data ?? []
        }
        return res.data.success
      },
      () => false
    )
  }

  function loadLabels(repos) {
    return manageAsyncLoading(
      async () => {
        const res = await integration.post('integration/github/labels', { repos })
        if (res.data.success) {
          labels.value = res.data?.data ?? {}
        }
        return res.data.success
      },
      () => false
    )
  }

  return {
    isLoading,
    status,
    repositories,
    syncedRepositories,
    issueTypes,
    labels,
    checkStatus,
    setupCredentials,
    deleteCredentials,
    loadRepositories,
    loadSyncedRepositories,
    createWebhook,
    updateWebhook,
    loadIssueTypes,
    loadLabels
  }
}

export function provideGithubIntegration() {
  const state = useGithubIntegrationState()
  provide(symbol, state)
  return state
}

export function useGithubIntegration() {
  return inject(symbol)
}
