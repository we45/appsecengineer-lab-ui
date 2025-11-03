<template>
  <q-tooltip
    anchor="center right"
    self="top middle"
    class="q-pa-lg floating_tooltip shadow-deep"
    max-width="20rem"
    role="tooltip"
    :aria-label="`${data.event_name}. ${data.description?.substring(0, 250)}${data.description?.length > 250 ? '...' : ''}`"
  >
    <h6 class="course_tooltip_title avenir-bold q-ma-none q-mb-md" role="heading" aria-describedby="course-title" aria-level="4">
      {{ data.event_name ?? data?.name }}
    </h6>

    <p class="q-mb-none text-caption course_tooltip_desc">
      <span>{{ data.description?.substring(0, 250) }}</span>
      <span v-if="data.description?.length > 250">...</span>
    </p>
  </q-tooltip>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const $q = useQuasar()

const isDark = computed(() => $q.dark.isActive)
</script>

<style lang="scss" scoped>
.course_tooltip_title {
  font-size: 1rem;
  line-height: normal;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
}

.course_tooltip_desc {
  word-break: break-word;
}
</style>
<style lang="scss">
.floating_tooltip {
  background-color: $bg-dark !important;
  overflow: hidden;
  border-radius: 15px !important;
}
</style>
