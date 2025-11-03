<template>
  <q-markup-table v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-markup-table>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseMarkupTable',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
