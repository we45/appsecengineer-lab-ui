<script setup>
import { useQuasar } from 'quasar'

defineProps({
  idealFor: {
    type: String,
    default: '--'
  }
})

const $q = useQuasar()
</script>

<template>
  <div class="ideal-for-chip column items-center justify-center" style="flex-grow: 1" role="note" aria-label="Ideal Audience">
    <p class="q-mb-none q-px-sm" style="font-size: 0.7rem">
      <span
        class="label avenir-bold q-mr-sm"
        :class="[
          {
            'text-electric-indigo': !$q.dark.isActive
          }
        ]"
      >
        Ideal for:
      </span>
      {{ idealFor?.length ? idealFor : '--' }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.ideal-for-chip {
  background-color: $bg-surface;
  border-radius: 1rem;
  height: 2rem;
}
</style>

<style lang="scss">
.q-dark {
  .ideal-for-chip {
    border: 1px solid $border-3 !important;
    :deep(.label) {
      color: $secondary;
    }
  }
}
</style>
