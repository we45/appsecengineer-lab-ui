<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  unSelect: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function handleItemClick(option) {
  if (props.unSelect && isSelected(option)) {
    model.value = {}
    return
  }
  model.value = option
}

function isSelected(option) {
  return model.value && model.value[props.valueKey] === option[props.valueKey]
}
</script>

<template>
  <div v-bind="$attrs" class="ase-select full-width row justify-between items-center no-wrap cursor-pointer" :class="{ outlined }">
    <slot name="prepend" />
    <div class="row items-center wrap full-height full-width q-gutter-sm q-py-sm q-pl-sm">
      <div v-show="!Object.keys(model.value ?? {}).length" class="font-weight-thin">{{ placeholder }}</div>
      <div v-if="model">
        <span class="avenir-bold q-mr-xs">{{ model[labelKey] }}</span>
      </div>
    </div>
    <q-icon name="keyboard_arrow_down" size="1.7rem" class="q-mx-sm" />

    <q-menu fit class="ase_select_menu">
      <q-list style="min-width: 100px" separator v-close-popup>
        <q-item
          v-for="(option, index) in options"
          :key="index"
          clickable
          :class="{
            'bg-indigo-gradient selectedItem': isSelected(option)
          }"
          @click="handleItemClick(option)"
        >
          <q-item-section>{{ option[labelKey] }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<style lang="scss">
.ase-select {
  min-height: 3.2rem;
  height: auto;
  border: 0.5px solid $border-4 !important;
  background: $bg-input !important;
  border-radius: 6px;

  .font-weight-thin {
    color: $text-light-1 !important;
  }

  &.outlined {
    border: 0.5px solid $border-1 !important;
    background: $bg-primary !important;
  }
}

.ase_select_menu {
  border-radius: 4px;
  .q-list {
    .q-item {
      background: $bg-primary;

      &.selectedItem {
        color: $text-light-2;
      }
    }
  }
}
</style>
