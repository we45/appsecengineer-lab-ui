<script setup>
import { ref } from 'vue'
import GithubIntegrationSetupCredentials from './GithubIntegrationSetupCredentials.vue'
import GithubIntegrationSetupRepositories from './GithubIntegrationSetupRepositories.vue'
import GithubIntegrationSetupIssueTypes from './GithubIntegrationSetupIssueTypes.vue'
import { useGithubIntegration } from 'src/composables/useGithubIntegrations'

const { loadRepositories, deleteCredentials } = useGithubIntegration()

defineEmits(['onComplete'])

const steps = {
  SETUP_CRED: 'setup_credentials',
  SETUP_REPOS: 'setup_repositories',
  SETUP_FILTERS: 'setup_issue_types_labels'
}
const step = ref(steps.SETUP_CRED)
const selectedRepos = ref([])

async function onSetupCredentials() {
  const success = await loadRepositories()
  if (!success) {
    deleteCredentials(false)
  } else {
    step.value = steps.SETUP_REPOS
  }
}

function onSetupRepositories(repos) {
  selectedRepos.value = repos || []
  step.value = steps.SETUP_FILTERS
}

function onBackToRepositories() {
  step.value = steps.SETUP_REPOS
}

function onFailedSetupCredentials() {
  deleteCredentials(false)
}
</script>

<template>
  <AseStepper v-model="step" horizontal>
    <q-step
      :name="steps.SETUP_CRED"
      title="Setup Credentials"
      icon="account_circle"
      active-icon="account_circle"
      done-icon="admin_panel_settings"
    >
      <GithubIntegrationSetupCredentials
        v-if="step === steps.SETUP_CRED"
        @on-completed="onSetupCredentials"
        @on-failed="onFailedSetupCredentials"
      />
    </q-step>

    <q-step
      :name="steps.SETUP_REPOS"
      color="red"
      title="Setup Repositories"
      icon="folder_copy"
      active-icon="folder_copy"
      done-icon="admin_panel_settings"
    >
      <GithubIntegrationSetupRepositories
        v-if="step === steps.SETUP_REPOS"
        :selected-repos="selectedRepos"
        @on-complete="onSetupRepositories"
      />
    </q-step>

    <q-step
      :name="steps.SETUP_FILTERS"
      color="green"
      title="Setup Issue Types & Labels"
      icon="label"
      active-icon="label"
      done-icon="check_circle"
    >
      <GithubIntegrationSetupIssueTypes
        v-if="step === steps.SETUP_FILTERS"
        :selected-repos="selectedRepos"
        @on-complete="$emit('onComplete')"
        @on-back="onBackToRepositories"
      />
    </q-step>
  </AseStepper>
</template>
