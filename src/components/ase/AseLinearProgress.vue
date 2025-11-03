<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 1
  },
  height: {
    type: String,
    default: '6px'
  },
  trackColor: {
    type: String,
    default: '#cdcdda33'
  },
  color: {
    type: String,
    default: 'secondary'
  },
  rounded: {
    type: Boolean,
    default: true
  },
  animationSpeed: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'sm'
  }
})

const progressHeight = computed(() => {
  return props.height
})

const borderRadius = computed(() => {
  return props.rounded ? props.height : '0px'
})
</script>

<template>
  <q-linear-progress
    :value="value"
    :size="size"
    :track-color="trackColor"
    :rounded="rounded"
    :animation-speed="animationSpeed"
    :color="color"
    class="ase-linear-progress"
    :class="{ [`progress-${color}`]: color }"
    v-bind="$attrs"
  />
</template>

<style lang="scss" scoped>
.ase-linear-progress {
  height: v-bind(progressHeight) !important;
  border-radius: v-bind(borderRadius);

  :deep(.q-linear-progress__model) {
    background-color: var(--color-secondary);
  }

  &.progress-secondary :deep(.q-linear-progress__model) {
    background-color: var(--color-secondary);
  }

  &.progress-primary :deep(.q-linear-progress__model) {
    background-color: var(--color-primary);
  }

  &.progress-accent :deep(.q-linear-progress__model) {
    background-color: var(--color-accent);
  }

  &.progress-success :deep(.q-linear-progress__model) {
    background-color: var(--color-success);
  }

  &.progress-warning :deep(.q-linear-progress__model) {
    background-color: var(--color-warning);
  }

  &.progress-error :deep(.q-linear-progress__model) {
    background-color: var(--color-error);
  }

  &.progress-info :deep(.q-linear-progress__model) {
    background-color: var(--color-info);
  }
}
</style>
