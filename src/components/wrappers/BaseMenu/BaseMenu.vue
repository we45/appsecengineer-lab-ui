<template>
  <q-menu v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-menu>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseMenu',
  inheritAttrs: false,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
