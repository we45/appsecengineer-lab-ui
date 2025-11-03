<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
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
</script>

<template>
  <q-tab-panels v-model="model" class="dynamic-tab-panels">
    <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
      <slot :name="`ase_tab_${tab.name}`" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss">
.dynamic-tab-panels {
  background-color: transparent !important;
  .q-panel {
    .q-tab-panel {
      border: none !important;
      padding: 0px !important;
    }
  }
}
</style>
