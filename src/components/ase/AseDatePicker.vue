<script setup>
import { computed, shallowRef } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  wrapperClass: {
    type: String || Array || Object,
    required: false,
    default: ''
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  heightVariant: {
    type: String,
    default: 'tall',
    validator: (value) => {
      return ['short', 'tall'].includes(value)
    }
  },
  fillVariant: {
    type: String,
    default: 'filled',
    validator: (value) => {
      return ['filled', 'outlined'].includes(value)
    }
  }
})

const emit = defineEmits(['update:model-value'])

const proxyModel = shallowRef(false)

const model = computed({
  get() {
    return props.modelValue?.replaceAll('-', '/')
  },
  set(value) {
    emit('update:model-value', value)
  }
})
</script>

<template>
  <AseInput
    v-model="model"
    :wrapper-class="wrapperClass"
    :label="label"
    :height-variant="heightVariant"
    :filter-variant="fillVariant"
    mask="date"
    readonly
    class="ase-date-picker cursor-pointer"
    :placeholder="placeholder"
    @click="proxyModel = true"
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy v-model="proxyModel" cover transition-show="scale" transition-hide="scale">
          <q-date v-bind="$attrs" v-model="model" mask="YYYY/MM/DD" @update:model-value="proxyModel = false">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </AseInput>
</template>

<style lang="scss">
.ase-date-picker {
  .q-field__inner {
    .q-field__control {
      .q-field__control-container {
        input {
          cursor: pointer !important;
        }
      }
    }
  }
}
</style>
