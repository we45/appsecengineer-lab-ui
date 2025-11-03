<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: () => ''
  },
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const filterSelected = computed(() => {
  const optionValues = props.options.map((option) => option.value)
  return props.modelValue.find((filter) => {
    return optionValues.includes(filter)
  })
})
</script>

<template>
  <BaseBtnDropdown class="radius-8 full-width" :active="filterSelected" no-caps :disabled="disabled">
    <template #label>
      <div class="row items-center justify-between" style="gap: 8px">
        <span>
          {{ label }}
        </span>
        <q-chip v-if="modelValue.length" dense color="secondary" class="text-bold" size="sm" text-color="white">
          {{ modelValue.length }}
        </q-chip>
      </div>
    </template>
    <q-option-group
      :modelValue="modelValue"
      :options="options"
      size="sm"
      type="checkbox"
      keep-color
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <template v-slot:label="opt">
        <div class="row items-center q-pr-sm">
          <q-avatar v-if="opt.logo" size="1.5em" :class="{}">
            <q-img
              :src="`${opt.logo}`"
              v-if="opt.logo.includes('https')"
              :class="{
                'blur-logo': options.includes(opt.value)
              }"
              width="21px"
            />
            <q-img
              v-else
              :src="`/filters/${opt.logo}`"
              :class="{
                'blur-logo': options.includes(opt.value)
              }"
            />
          </q-avatar>
          <span
            class="q-pl-xs"
            :class="{
              'text-active': options.includes(opt.value)
            }"
          >
            {{ opt.label }}
          </span>
        </div>
      </template>
    </q-option-group>
  </BaseBtnDropdown>
</template>
