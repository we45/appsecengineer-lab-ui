<template>
  <q-file v-bind="$attrs" ref="file" class="file-input">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-file>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseFile',
  inheritAttrs: true,
  setup(_, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style lang="scss">
.file-input {
  .q-field__native {
    color: black !important;
  }
}
</style>
