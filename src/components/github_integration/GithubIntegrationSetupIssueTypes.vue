<script setup>
import { useGithubIntegration } from 'src/composables/useGithubIntegrations'
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  selectedRepos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['onComplete', 'onBack'])

const { isLoading, issueTypes, labels, loadIssueTypes, loadLabels, createWebhook } = useGithubIntegration()

const selectedRepos = ref(props.selectedRepos)
const repoFilters = ref({})
const isSubmitting = ref(false)
const isDataLoaded = ref(false)

selectedRepos.value.forEach((repoFullName) => {
  repoFilters.value[repoFullName] = {
    issue_types: [],
    labels: []
  }
})

const columns = [
  {
    name: 'repository',
    label: 'Repository',
    field: 'repository',
    align: 'left'
  },
  {
    name: 'issue_types',
    label: 'Issue Types',
    field: 'issue_types',
    align: 'left'
  },
  {
    name: 'labels',
    label: 'Labels',
    field: 'labels',
    align: 'left'
  }
]

const rows = computed(() => {
  return selectedRepos.value.map((repoFullName) => ({
    repository: repoFullName,
    issue_types: repoFilters.value[repoFullName]?.issue_types || [],
    labels: repoFilters.value[repoFullName]?.labels || []
  }))
})

const getIssueTypesForRepo = () => {
  const types = issueTypes.value || []
  return types.map((type) => ({ label: type.name, value: type.name }))
}

const getLabelsForRepo = (repoFullName) => {
  const repoLabels = labels.value?.[repoFullName] || []
  return repoLabels.map((label) => ({ label: label.name, value: label.name }))
}

onMounted(async () => {
  if (selectedRepos.value.length > 0) {
    const orgName = selectedRepos.value[0].split('/')[0]
    await loadIssueTypes({ org: orgName })
    await loadLabels(selectedRepos.value)
    isDataLoaded.value = true
  }
})

async function handleSubmit() {
  isSubmitting.value = true

  const payload = {
    selected_repos: selectedRepos.value,
    repo_filters: {}
  }

  selectedRepos.value.forEach((repoFullName) => {
    const filters = repoFilters.value[repoFullName]
    if (filters.issue_types.length > 0 || filters.labels.length > 0) {
      payload.repo_filters[repoFullName] = {
        issue_types: filters.issue_types,
        labels: filters.labels
      }
    }
  })

  await createWebhook(payload)
  emit('onComplete')
  isSubmitting.value = false
}
</script>

<template>
  <div>
    <div v-if="isLoading && !isDataLoaded" class="text-center q-py-lg">
      <q-spinner color="primary" size="2em" />
      <div class="q-mt-sm text-body1">Loading issue types and labels...</div>
    </div>

    <q-form v-else @submit.prevent="handleSubmit">
      <AseTable :columns="columns" :rows="rows" :is-loading="isLoading" row-key="repository" empty-label="No repositories selected">
        <template #body-cell-issue_types="props">
          <q-td :props="props">
            <AseQSelect
              v-model="repoFilters[props.row.repository].issue_types"
              placeholder="Select Issue Types"
              multiple
              emit-value
              map-options
              :options="getIssueTypesForRepo()"
              :loading="!isDataLoaded"
              dense
            />
          </q-td>
        </template>

        <!-- Labels Column -->
        <template #body-cell-labels="props">
          <q-td :props="props">
            <AseQSelect
              v-model="repoFilters[props.row.repository].labels"
              placeholder="Select Labels"
              multiple
              emit-value
              map-options
              :options="getLabelsForRepo(props.row.repository)"
              :loading="!isDataLoaded"
              dense
            />
          </q-td>
        </template>
      </AseTable>
      <div class="row q-gutter-sm q-mt-md">
        <AseButton label="Back" outline variant="secondary" @click="emit('onBack')" />
        <AseButton label="Complete Setup" variant="primary" type="submit" :loading="isSubmitting" />
      </div>
    </q-form>
  </div>
</template>
