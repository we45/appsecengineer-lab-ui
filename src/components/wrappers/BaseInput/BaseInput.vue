<template>
  <div :class="`base-input ${wrapper.class}`" :style="wrapper.style">
    <q-input :dense="!noDense" :outlined="!noOutlined" v-bind="$attrs" :class="inputClass" :style="inputStyle" :label="label">
      <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="scope">
        <slot :key="slot.name" :name="slot.name" v-bind="scope" />
      </template>
    </q-input>
  </div>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
import { inputFieldProps } from '../props/inputProps'
import { computed } from 'vue'
export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    ...inputFieldProps,
    inputClass: [String, Object, Array],
    inputStyle: [String, Object, Array]
  },
  setup(props, { slots, attrs }) {
    const wrapper = computed(() => ({
      class: attrs.class,
      style: attrs.style
    }))
    return {
      slots: useSlots(slots, ['label']),
      wrapper
    }
  }
}
</script>
