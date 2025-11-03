<script setup>
import Skill from 'assets/icons/Skill.vue'

import { useQuasar } from 'quasar'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const $q = useQuasar()
</script>

<template>
  <AseCard flatCard sectionClass="q-pa-none column items-center justify-start" role="region" aria-labelledby="skills-title">
    <div
      id="skills-title"
      class="avenir-bold text-uppercase full-width row items-center justify-center"
      :style="{
        opacity: '.7',
        fontSize: '10px',
        height: '44px'
      }"
    >
      Skill Gained
    </div>
    <q-separator class="full-width" />
    <div
      class="full-width q-pa-md col-grow column justify-end no-wrap"
      :style="{ gap: '1rem', maxHeight: '14rem', overflowY: 'scroll' }"
      aria-live="polite"
      role="list"
    >
      <div v-if="!data.length" class="activity-row row justify-center items-center no-wrap">
        <p class="q-mb-none">No skills gained yet</p>
      </div>

      <div v-for="(activity, index) in data" :key="index" class="activity-row row items-center no-wrap" role="listitem">
        <div class="icon bg-primary row items-center justify-center q-mr-sm">
          <Skill />
        </div>

        <div
          class="avenir-bold"
          :style="{
            fontSize: '12px'
          }"
        >
          {{ activity.label }}
        </div>

        <div
          class="badge q-pa-xs q-ml-auto"
          :class="[{ dark: $q.dark.isActive }]"
          :aria-label="`Time spent on ${activity.label}: ${activity.time}`"
        >
          {{ activity.time }}
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
