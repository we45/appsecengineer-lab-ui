<template>
  <div :class="`base-select ${wrapper.class}`" :style="wrapper.style">
    <q-select
      ref="baseSelect"
      v-model="value"
      :dense="!noDense"
      :option-label="optionLabel"
      :option-value="optionValue"
      :options="modifiedOptions"
      :outlined="!noOutlined"
      :use-input="useInput"
      :use-chips="useChips"
      input-debounce="0"
      v-bind="$attrs"
      @filter="filter"
      :borderless="borderless"
      :dropdown-icon="dropdownIcon"
      :placeholder="placeholder"
      :class="selectClass"
      :style="selectStyle"
    >
      <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="scope">
        <slot :key="slot.name" :name="slot.name" v-bind="scope" />
      </template>
      <template v-slot:selected-item="scope" v-if="useSelectedItemSlot">
        <slot name="selected-item" v-bind="scope">
          <q-chip
            removable
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="primary"
            text-color="white"
            square
            class="q-my-none"
            style="padding-right: 20px"
          >
            {{ getOptionLabel(scope.opt) }}
          </q-chip>
        </slot>
      </template>
      <template v-slot:selected v-if="useSelectedSlot">
        <slot name="selected">
          <span class="q-placeholder">{{ placeholder }}</span>
        </slot>
      </template>
    </q-select>
  </div>
</template>
<script>
import { inputSelectProps } from '../props/inputProps'
import { useSlots } from 'src/composables/useSlots'
import BaseLabel from '../BaseLabel/BaseLabel.vue'
import { computed, ref } from 'vue'

export default {
  name: 'BaseSelect',
  inheritAttrs: false,
  props: {
    ...inputSelectProps,
    borderless: {
      type: Boolean,
      default: false
    },
    dropdownIcon: {
      type: String,
      default: 'expand_more'
    },
    placeholder: String,
    modelValue: [String, Object, Number, Array, Boolean],
    selectClass: [String, Object, Array],
    selectStyle: [String, Object, Array]
  },
  components: { BaseLabel },
  setup(props, { slots, emit, attrs }) {
    const baseSelect = ref()
    const modifiedOptions = ref(props.options)
    const value = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
    })
    const wrapper = computed(() => ({
      class: attrs.class,
      style: attrs.style
    }))
    function filter(inputValue, update, abort) {
      if (props.onFilter) {
        emit('filter', inputValue, update, abort)
      } else {
        update(() => {
          modifiedOptions.value = filterOptions(inputValue)
        })
      }
    }
    function getOptionLabel(opt) {
      return baseSelect.value?.getOptionLabel(opt)
    }
    function filterOptions(inputValue) {
      if (inputValue.trim() === '') {
        return props.options
      }
      const needle = inputValue.toLowerCase()
      return props.options?.filter((option) => {
        const label = getOptionLabel(option)
        return label.toLowerCase().includes(needle)
      })
    }
    const hasValue = computed(() => {
      const val = value.value
      return (Array.isArray(val) && val.length) || (!Array.isArray(val) && val)
    })
    const useSelectedItemSlot = computed(() => {
      return props.useChips && hasValue.value
    })
    const useSelectedSlot = computed(() => {
      return !props.useInput && !hasValue.value
    })

    return {
      baseSelect,
      slots: useSlots(slots, ['label']),
      modifiedOptions,
      filter,
      filterOptions,
      value,
      getOptionLabel,
      hasValue,
      useSelectedItemSlot,
      useSelectedSlot,
      wrapper
    }
  },
  emits: ['filter', 'update:modelValue']
}
</script>
<style lang="scss">
.q-field_native.row.items-center {
  span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
