<template>
  <q-option-group v-bind="$attrs" class="q-br-4 q-px-lg ase-option-group" :class="optionClass">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-option-group>
</template>
<script>
import { useQuasar } from 'quasar'
import { useSlots } from 'src/composables/useSlots'
import { computed } from 'vue'
export default {
  name: 'BaseOptionGroup',
  inheritAttrs: false,
  props: {
    optionClass: {
      type: String,
      default: 'bordered'
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
