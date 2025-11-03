<template>
  <q-circular-progress v-bind="$attrs" :font-size="fontSize" :value="value" :thickness="thickness" :color="color" :track-color="trackColor">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-circular-progress>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseBtn',
  inheritAttrs: false,
  props: {
    fontSize: {
      default: '12px',
      type: String
    },
    value: {
      type: Number,
      default: 19
    },
    thickness: {
      type: Number,
      default: 0.3
    },
    color: {
      type: String,
      default: 'black-12'
    },
    trackColor: {
      type: String,
      default: 'green-12'
    }
  },
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style></style>
