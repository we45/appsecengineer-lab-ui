<template>
  <div v-if="isLoading" class="column items-center justify-center" style="min-height: 400px">
    <q-spinner color="primary" size="3em" />
    <div class="text-primary q-mt-md">Loading G2 Review Form...</div>
  </div>
  <iframe
    v-else-if="state"
    :src="`https://www.g2.com/partnerships/AppSecEngineer/users/login.embed?state=${state}&email=${encodeURIComponent(email)}`"
    style="width: 80vw; height: 80vh; max-width: 100%; border: none"
  ></iframe>
  <div v-else class="column items-center justify-center" style="min-height: 400px">
    <q-icon name="error" color="negative" size="3em" />
    <div class="text-negative q-mt-md">Unable to load review form</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLoginStore } from 'src/store/pinia/login'
import config from '../../config'
import { api } from 'src/boot/axios'

const loginStore = useLoginStore()

const state = ref('')
const email = ref('')
const isLoading = ref(true)

onMounted(() => {
  generateG2Review()
})

async function generateG2Review() {
  try {
    isLoading.value = true
    const data = await api.post(`${config.g2TokenUrl}g2/token`, {})
    console.log('data', data)
    state.value = data?.data?.data?.state
    email.value = data?.data?.data?.email
  } catch (error) {
    console.log('error ', error)
  } finally {
    isLoading.value = false
  }
}
</script>
