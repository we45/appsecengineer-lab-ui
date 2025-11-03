<template>
  <q-toggle v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-toggle>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseToggle',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
