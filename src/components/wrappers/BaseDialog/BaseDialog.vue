<template>
  <q-dialog v-bind="$attrs" persistent @escape-key="$emit('close')">
    <q-card :style="style">
      <slot name="header" v-if="!noheader">
        <q-card-section class="row justify-between">
          <div>
            <div class="text-h6 text-bold">{{ title }}</div>
            <div class="text-subtitle1">{{ subtitle }}</div>
          </div>
          <div>
            <BaseBtn color="primary" icon="close" round size="sm" v-close-popup @click="$emit('close')" />
          </div>
        </q-card-section>
      </slot>
      <slot name="separator">
        <q-separator />
      </slot>
      <slot />
      <slot name="footer" />
    </q-card>
  </q-dialog>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseDialog',
  inheritAttrs: false,
  props: {
    noheader: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    style: {
      type: Object,
      default: () => {
        return {
          width: '700px',
          maxWidth: '80vw'
        }
      }
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
