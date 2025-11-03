<template>
  <q-inner-loading v-bind="$attrs">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
    <div class="text-center">
      <q-spinner-grid color="primary" size="2em" v-if="!hideDefaultSpinner" class="text-center" />
      <div class="text-subtitile1 q-my-md" v-if="label">{{ label }}</div>
    </div>
  </q-inner-loading>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseInnerLoading',
  inheritAttrs: false,
  props: {
    hideDefaultSpinner: {
      type: Boolean,
      default: false
    },
    defaultSpinner: {
      type: String,
      default: 'q-spinner-grid'
    },
    color: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: '2em'
    },
    label: {
      type: String,
      default: ''
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
