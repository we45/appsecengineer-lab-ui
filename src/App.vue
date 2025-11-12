<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(route, (to, _from) => {
  if (to.meta.title !== 'Course Intro') {
    window.document.title = to.meta.title || 'AppSecEngineer'
  }
})
</script>
