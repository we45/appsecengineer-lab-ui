<template>
  <q-card v-bind="$attrs" flat>
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-card>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseCard',
  inheritAttrs: false,

  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
