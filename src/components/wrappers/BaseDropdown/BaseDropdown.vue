<template>
  <q-btn-dropdown
    v-bind="$attrs"
    :outline="!noOutlined"
    :no-caps="!caps"
    :menu-offset="menu - offset"
    :color="color"
    :dropdown-icon="dropdowmIcon"
    class="base-btn"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :name="slot.name" :key="slot.name" />
    </template>
  </q-btn-dropdown>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseDropdown',
  inheritAttrs: false,
  props: {
    caps: {
      type: Boolean,
      default: false
    },
    noOutlined: {
      type: Boolean,
      default: false
    },
    menuOffset: {
      type: Array,
      default: () => [0, 10]
    },
    dropdownIcon: {
      type: String,
      default: 'expand_more'
    }
  },
  setup() {
    return {
      useSlots: useSlots()
    }
  }
}
</script>
