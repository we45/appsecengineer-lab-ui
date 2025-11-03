<script setup>
import { useGithubIntegration } from 'src/composables/useGithubIntegrations'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { required } from 'src/utils/rules'
import { ref, shallowRef } from 'vue'

const emit = defineEmits(['onCompleted', 'onFailed'])

const { setupCredentials, isLoading } = useGithubIntegration()

const formData = ref({
  access_token: '',
  cloud_url: '',
  is_cloud: true
})

async function handleSubmit() {
  const { access_token, cloud_url, is_cloud } = formData.value

  const credentials = urlSafeBase64Encode(
    JSON.stringify({
      username: '',
      password: access_token
    })
  )

  const success = await setupCredentials({
    credentials,
    is_cloud,
    cloud_url
  })
  emit(success ? 'onCompleted' : 'onFailed')
}
</script>

<template>
  <q-form @submit.prevent="handleSubmit" class="q-gutter-lg q-mt-sm">
    <AseInput v-model="formData.access_token" label="Access Token *" type="password" :rules="required" />
    <AseInput v-model="formData.cloud_url" label="URL *" :rules="required" />
    <AseCheckbox v-model="formData.is_cloud" label="Is cloud" />
    <div class="q-mt-md">
      <AseButton label="Save Credentials" type="submit" :loading="isLoading" />
    </div>
  </q-form>
</template>
