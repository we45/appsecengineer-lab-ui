<template>
  <q-card-section v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-card-section>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseCardSection',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
