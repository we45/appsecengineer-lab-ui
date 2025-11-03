<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'
import config from './config'
import useAppIcons from 'src/composables/useAppIcons.js'
import { useSocket } from 'src/composables/useSocket.js'
import { initializeClearFeed } from 'src/utils/clearfeed.js'
useAppIcons()

const route = useRoute()
useSocket()

watch(route, (to, _from) => {
  if (to.meta.title !== 'Course Intro') {
    window.document.title = to.meta.title || 'AppSecEngineer'
  }
})

// Watch for user authentication changes
watch(
  () => LocalStorage.getItem('user'),
  async (newUser, oldUser) => {
    // Reinitialize ClearFeed when user logs in/out
    if (window.origin === 'https://learning.appsecengineer.com') {
      await initializeClearFeed()
    }
  },
  { deep: true }
)

onMounted(async () => {
  config.chargebee
  // Initialize ClearFeed chat widget

  if (window.origin === 'https://learning.appsecengineer.com') {
    await initializeClearFeed()
  }
})

onUpdated(() => {
  config.chargebee
})
</script>
