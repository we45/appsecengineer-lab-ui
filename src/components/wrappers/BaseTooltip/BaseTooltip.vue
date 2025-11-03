<template>
  <q-tooltip v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-tooltip>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseTooltip',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
