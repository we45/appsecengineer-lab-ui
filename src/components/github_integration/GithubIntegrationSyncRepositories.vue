<script setup>
import { useGithubIntegration } from 'src/composables/useGithubIntegrations'
import { computed, onMounted, ref } from 'vue'

const { isLoading, repositories, syncedRepositories, loadRepositories, loadSyncedRepositories, updateWebhook } = useGithubIntegration()

const selectedRepositories = ref([])
const isResyncing = ref(false)
const selectKey = ref(0)
const showEditDialog = ref(false)
const tableLoading = ref(false)

onMounted(async () => {
  tableLoading.value = true
  await Promise.all([loadRepositories(), fetchSyncedRepositories()])
  tableLoading.value = false
})

const repoOptions = computed(() => {
  return repositories?.value?.map((repo) => {
    return {
      label: repo?.name,
      value: repo?.full_name
    }
  })
})

const columns = [
  { name: 'name', label: 'Repository Name', field: 'name', align: 'left', style: 'width: 35%' },
  { name: 'owner', label: 'Organization', field: 'owner', align: 'left', style: 'width: 35%' },
  { name: 'url', label: 'Repository URL', field: 'url', align: 'right', style: 'width: 30%' }
]

const syncedReposData = computed(() => {
  return repositories.value
    ?.filter((repo) => syncedRepositories.value?.includes(repo.full_name))
    ?.map((repo) => ({
      name: repo.name,
      owner: repo.owner || '',
      url: repo.url || ''
    }))
})

function openRepositoryUrl(url) {
  if (url) {
    window.open(url, '_blank')
  }
}

async function fetchSyncedRepositories() {
  try {
    await loadSyncedRepositories()
    selectedRepositories.value = syncedRepositories.value ?? []
    console.log('Fetched synced repositories:', syncedRepositories.value)
  } catch (error) {
    console.error('Error fetching synced repositories:', error)
  }
}

async function handleSubmit() {
  try {
    isResyncing.value = true
    await updateWebhook({
      selected_repos: selectedRepositories.value
    })
    await fetchSyncedRepositories()
    selectKey.value++
    showEditDialog.value = false
  } catch (error) {
    console.error('Error updating webhook:', error)
  } finally {
    isResyncing.value = false
  }
}

function openEditDialog() {
  selectedRepositories.value = syncedRepositories.value ?? []
  showEditDialog.value = true
}
</script>

<template>
  <div>
    <div class="row items-center justify-between q-mb-sm q-px-sm">
      <div class="row items-center">
        <div class="avenir-bold">Synced Repositories</div>
        <q-badge v-if="syncedReposData?.length" color="primary" class="q-ml-sm">
          {{ syncedReposData.length }}
        </q-badge>
      </div>
      <AseButton label="Edit" icon="edit" flat color="primary" @click="openEditDialog" />
    </div>

    <AseTable
      :rows="syncedReposData"
      :columns="columns"
      row-key="name"
      flat
      bordered
      :isLoading="tableLoading || isLoading"
      :emptyLabel="'No repositories synced'"
      :rows-per-page-options="[0]"
      style="max-height: calc(100vh - 300px)"
      :hide-bottom="syncedReposData.length > 0"
    >
      <template v-slot:body-cell-url="props">
        <q-td :props="props">
          <AseButton
            variant="secondary"
            icon="open_in_new"
            label="Open Repository"
            class="text-weight-medium"
            @click="openRepositoryUrl(props.row.url)"
          />
        </q-td>
      </template>
    </AseTable>

    <AseDialog v-model="showEditDialog" title="Edit Synced Repositories" persistent>
      <q-form @submit.prevent="handleSubmit">
        <AseQSelect
          :key="selectKey"
          v-model="selectedRepositories"
          label="Synced GitHub Repository"
          placeholder="Select GitHub Repositories"
          emit-value
          map-options
          use-input
          clearable
          multiple
          :loading="isLoading && !isResyncing"
          :options="repoOptions"
        />
        <div class="q-mt-md row justify-end">
          <AseButton label="Cancel" flat class="q-mr-sm" @click="showEditDialog = false" />
          <AseButton label="Save" type="submit" :loading="isResyncing" :disabled="!selectedRepositories?.length" />
        </div>
      </q-form>
    </AseDialog>
  </div>
</template>
