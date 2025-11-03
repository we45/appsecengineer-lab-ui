<template>
  <div
    class="full-width content-center text-center bg-grey-3 row flex-center"
    style="height: 100vh"
    role="region"
    aria-label="Video Player"
  >
    <q-video
      v-if="videoId"
      :src="`https://player.vimeo.com/video/${videoId}/?title=true&transparent=0&controls=1&background=false&byline=true&portrait=true`"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      style="border: 1px solid #ccc; width: 760px; height: 515px"
      role="application"
      aria-label="Course video player"
    ></q-video>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useRoute } from 'vue-router'

const route = useRoute()
const video_url = urlSafeBase64Decode(route.query.video_url) + '/' + encodeURIComponent(route.query.ltik)

const videoId = video_url.match(/\/(\d+)\//)?.[1] || ''
</script>

<style lang="scss" scoped></style>
