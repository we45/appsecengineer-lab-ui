<script setup>
import { computed, useSlots as useContextSlots } from 'vue'
import { useSlots } from 'src/composables/useSlots'
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const props = defineProps({
  fillVariant: {
    type: String,
    default: 'filled',
    validator: (value) => {
      return ['filled', 'outlined'].includes(value)
    }
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  wrapperClass: {
    type: String || Array || Object,
    required: false,
    default: ''
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  options: {
    type: Array,
    default: () => []
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  hideNoOptionLabel: {
    type: Boolean,
    default: false
  },
  showMore: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  noOptionLabel: {
    type: String,
    default: 'No options'
  }
})

const emit = defineEmits(['focus', 'blur', 'loadMoreItems'])

const slots = useSlots(useContextSlots())
const $q = useQuasar()

const selectRef = ref(null)
const isFocused = ref(false)
const search = ref('')

const getOptionValue = computed(() => getPropValueFn(props.optionValue, 'value'))
const getOptionLabel = computed(() => getPropValueFn(props.optionLabel, 'props'))
const filteredOptions = computed(() => {
  if (Array.isArray(props.options)) {
    return props.options.filter((opt) => {
      const label = getOptionLabel.value(opt).toString()
      const value = getOptionValue.value(opt).toString()

      return label.toLowerCase().includes(search.value.toLowerCase()) || value.toLowerCase().includes(search.value.toLowerCase())
    })
  }

  return props.options
})

function onInputValue(val) {
  search.value = val
}

function getPropValueFn(userPropName, defaultPropName) {
  if (typeof userPropName === 'function') return userPropName
  const propName = userPropName !== void 0 ? userPropName : defaultPropName
  return (opt) => (opt !== null && typeof opt === 'object' && propName in opt ? opt[propName] : opt)
}

function handleFocus() {
  isFocused.value = true
  setInputPlaceholder()
  emit('focus')
}

function handleBlur() {
  isFocused.value = false
  setInputPlaceholder()
  emit('blur')
}

function setInputPlaceholder() {
  if (selectRef?.value && (!selectRef.value.modelValue || selectRef.value.modelValue.length === 0)) {
    const input = selectRef.value.$el.querySelector(selectRef.value?.useInput ? '.q-field__input' : '.q-field__focus-target')
    if (input) {
      input.placeholder = isFocused.value ? props.placeholder : ''
    }
  }
}
</script>

<template>
  <div class="ase-q-select-wrapper q-mb-xs" :class="wrapperClass">
    <p v-if="label" class="ase-q-select-label q-mb-sm q-mt-sm q-ml-xs">{{ label }}</p>
    <q-select
      v-bind="$attrs"
      ref="selectRef"
      hide-hint
      outlined
      flat
      :clearable="clearable"
      class="ase-q-select"
      input-debounce="0"
      :class="[fillVariant, { dark: $q.dark.isActive }]"
      :multiple="multiple"
      :options="filteredOptions"
      @click="handleFocus"
      @blur="handleBlur"
      @clear="handleFocus"
      @input-value="onInputValue"
    >
      <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
        <slot :key="slot.name" :name="slot.name" v-bind="props" />
      </template>

      <template v-if="((multiple && !selectRef?.modelValue?.length) || !selectRef?.modelValue) && !isFocused" #selected>
        <div class="text-placeholder">{{ placeholder }}</div>
      </template>

      <template v-if="multiple && selectRef?.modelValue?.length > 0" v-slot:selected-item="scope">
        <q-chip
          dense
          removable
          :tabindex="scope.tabindex"
          @remove="
            () => {
              scope.removeAtIndex(scope.index)
              isFocused = true
            }
          "
        >
          {{ scope.opt?.label || scope.opt }}
        </q-chip>
      </template>

      <template v-if="!(hideNoOptionLabel && !options?.length)" v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">{{ noOptionLabel }}</q-item-section>
        </q-item>
        <q-item v-if="showMore">
          <q-item-section class="text-center">
            <label v-if="isLoadingMore">...</label>
            <label v-else>
              <AseButton label="Load more" size="sm" :loading="isLoadingMore" :disabled="isLoadingMore" @click="$emit('loadMoreItems')" />
            </label>
          </q-item-section>
        </q-item>
      </template>

      <template v-if="showMore" v-slot:after-options>
        <q-item>
          <q-item-section class="text-center" style="cursor: pointer" @click="$emit('loadMoreItems')">
            <label v-if="isLoadingMore">...</label>
            <label v-else>
              <AseButton label="Load more" size="sm" :loading="isLoadingMore" :disabled="isLoadingMore" />
            </label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
,

<style lang="scss">
.ase-q-select-wrapper {
  .ase-q-select-label {
    font-size: 14px !important;
  }
  .ase-q-select {
    padding-right: 0 !important;

    ::placeholder {
      color: $text-light-1 !important;
    }

    .q-field__control {
      border-radius: 4px;

      .q-field__append {
        color: $text-light-1 !important;
      }
      .q-field__marginal {
        height: auto;
        color: $text-light-1;
      }
      .q-field__control-container {
        .q-field_native {
          color: $text-light-1;
        }
      }
    }

    &.q-field--auto-height {
      .q-field__inner {
        .q-field__control {
          min-height: 46px !important;
          .q-field__control-container {
            .q-field__native {
              min-height: 46px !important;
            }
          }
        }
      }
    }

    &.filled {
      .q-field__control {
        background: $bg-input;
        &::before {
          border: 0.5px solid $border-1;
        }
      }
    }

    &.outlined {
      .q-field__control {
        background: transparent;
        &::before {
          border: 0.5px solid $border-1;
        }
      }
    }
  }
}
</style>
