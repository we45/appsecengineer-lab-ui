<script setup>
import VideoCam from 'assets/icons/VideoCam.vue'
import Pencil from 'assets/icons/Pencil.vue'
import Lab from 'assets/icons/Lab.vue'

import { useQuasar } from 'quasar'

defineProps({
  activities: {
    type: Array,
    required: true
  }
})

const $q = useQuasar()
</script>

<template>
  <AseCard flatCard sectionClass="q-pa-none column items-center justify-start no-wrap">
    <div
      class="avenir-bold text-uppercase full-width row items-center justify-center"
      :style="{
        opacity: '.7',
        fontSize: '10px',
        height: '44px'
      }"
    >
      Recent Activities
    </div>
    <q-separator class="full-width" />
    <div
      class="full-width q-pa-md col-grow column justify-start no-wrap"
      :style="{
        gap: '1rem',
        maxHeight: '14rem',
        overflowY: 'scroll'
      }"
    >
      <div v-if="!activities.length" class="activity-row row justify-center items-center no-wrap">
        <p class="q-mb-none">No data</p>
      </div>

      <div v-for="(activity, index) in activities" :key="index" class="activity-row row items-center no-wrap">
        <div class="icon bg-primary row items-center justify-center q-mr-sm">
          <VideoCam v-if="['event', 'vid'].includes(activity.type)" />
          <Lab v-else-if="activity.type === 'lab'" />
          <Pencil v-else-if="activity.type === 'assignment'" />
        </div>
        <div>
          <div
            class="avenir-bold text-capitalize"
            :style="{
              fontSize: '12px'
            }"
          >
            {{ activity.action + ' ' + `${activity.type === 'vid' ? 'video' : activity.type}` }}
          </div>
          <div
            :style="{
              fontSize: '10px',
              maxWidth: '8rem',
              textWrap: 'wrap'
            }"
          >
            {{ activity.name }}
          </div>
        </div>
        <div class="badge q-pa-xs q-ml-auto" :class="{ dark: $q.dark.isActive }">
          {{ activity.date }}
        </div>
      </div>
    </div>
  </AseCard>
</template>

<style lang="scss" scoped>
.activity-row {
  .icon {
    height: 26px;
    width: 26px;
    clip-path: circle();
  }
  .badge {
    font-size: 9px;
    border-radius: 3px;
    align-self: start;
    background-color: $bg-surface;
    color: $text-secondary;
    &.dark {
      background-color: $secondary;
    }
  }
}
</style>
