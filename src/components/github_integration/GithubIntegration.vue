<script setup>
import { provideGithubIntegration } from 'src/composables/useGithubIntegrations'
import GithubIntegrationConnect from './GithubIntegrationConnect.vue'
import { onMounted, shallowRef } from 'vue'
import GithubIntegrationSyncRepositories from './GithubIntegrationSyncRepositories.vue'

const { isLoading, status, checkStatus, deleteCredentials } = provideGithubIntegration()

const showConnect = shallowRef(false)
const isDisconnecting = shallowRef(false)

onMounted(() => {
  checkStatus()
})

async function disconnectGithub() {
  isDisconnecting.value = true
  await deleteCredentials()
  isDisconnecting.value = false
  checkStatus()
}

function onConnected() {
  checkStatus()
  showConnect.value = false
}
</script>

<template>
  <AseCard>
    <template v-if="status">
      <div class="row items-center justify-end">
        <AseButton label="Disconnect Github" icon="commit" :loading="isDisconnecting" @click="disconnectGithub" />
      </div>
      <div class="q-mt-md">
        <GithubIntegrationSyncRepositories />
      </div>
    </template>

    <template v-else>
      <div class="row items-center justify-end">
        <AseButton v-if="!showConnect" label="Connect Github" icon="commit" @click="showConnect = true" />
      </div>
      <GithubIntegrationConnect v-if="showConnect" @on-complete="onConnected" />
      <p v-else-if="isLoading" class="text-center q-my-md" style="font-style: italic">Checking Github Connection Status...</p>
      <p v-else class="text-center q-my-md" style="font-style: italic">Github is not connected</p>
    </template>
  </AseCard>
</template>
