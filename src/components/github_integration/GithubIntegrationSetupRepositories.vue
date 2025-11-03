<script setup>
import { useGithubIntegration } from 'src/composables/useGithubIntegrations'
import { computed, ref } from 'vue'

const props = defineProps({
  selectedRepos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['onComplete'])

const { isLoading, repositories, createWebhook } = useGithubIntegration()

const selectedRepos = ref(props.selectedRepos)

const repoOptions = computed(() => {
  return repositories?.value?.map((repo) => {
    return {
      label: repo?.name,
      value: repo?.full_name
    }
  })
})

async function handleSubmit() {
  emit('onComplete', selectedRepos.value)
}
</script>

<template>
  <q-form @submit.prevent="handleSubmit">
    <AseQSelect
      v-model="selectedRepos"
      placeholder="Select GitHub Repositories"
      emit-value
      map-options
      use-input
      clearable
      multiple
      :options="repoOptions"
    />
    <div class="q-mt-md"><AseButton label="Add Repositories" type="submit" :loading="isLoading" :disabled="!selectedRepos?.length" /></div>
  </q-form>
</template>
