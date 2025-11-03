<template>
  <div class="full-width full-height row items-center justify-center" v-bind="$attrs">
    <q-spinner-grid v-if="loading" color="primary" size="2em" />
    <slot v-else />
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'

defineComponent({ name: 'BaseComponentLoader' })

defineProps({
  loading: {
    type: Boolean,
    required: () => true
  },
  label: {
    type: String,
    default: () => ''
  }
})
</script>
