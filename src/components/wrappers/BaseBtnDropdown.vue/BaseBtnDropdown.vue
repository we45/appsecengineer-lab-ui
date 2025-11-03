<template>
  <q-btn-dropdown
    v-bind="$attrs"
    :flat="flat"
    class="base-btn-dropdown"
    :class="{
      active
    }"
    bordered
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-btn-dropdown>
</template>
<script>
import { useQuasar } from 'quasar'
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseBtnDropdown',
  inheritAttrs: false,

  props: {
    flat: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const $q = useQuasar()

    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style lang="scss">
.base-btn-dropdown {
  border: 1px solid $border-1 !important;
  &.active {
    background-color: $bg-surface !important;
  }
}
</style>
