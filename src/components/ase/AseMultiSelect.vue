<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
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
  }
})

const emit = defineEmits(['update:modelValue'])

const optionsToShowUp = ref(props.options)

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

watch(
  () => props.options,
  (value) => {
    optionsToShowUp.value = value
  }
)

async function handlePushAndRemoveItem(option, adding) {
  if (adding) {
    model.value.push(option)
    optionsToShowUp.value = optionsToShowUp.value.filter((el) => el[props.valueKey] !== option[props.valueKey])
  } else {
    model.value = model.value.filter((el) => el[props.valueKey] !== option[props.valueKey])
    optionsToShowUp.value.push(option)
  }
}
</script>

<template>
  <div v-bind="$attrs" class="ase-multi-select bg-white full-width row justify-between q-pl-sm items-center no-wrap q-py-sm">
    <div class="row items-center wrap full-height full-width q-gutter-sm">
      <div v-show="!model.length" class="font-weight-thin">{{ placeholder }}</div>
      <div v-for="(option, index) in model" :key="index" class="custom-chip q-py-sm bg-light-pink row items-center no-wrap q-px-sm">
        <span class="avenir-bold text-electric-eminence q-mr-xs">{{ option[labelKey] }}</span>
        <q-icon name="close" size="17px" class="text-electric-eminence cursor-pointer" @click="handlePushAndRemoveItem(option, false)" />
      </div>
    </div>
    <q-icon name="keyboard_arrow_down" size="1.7rem" class="cursor-pointer q-mx-sm" />

    <q-menu fit style="border-radius: 4px">
      <q-list style="min-width: 100px" separator>
        <q-item v-for="(option, index) in optionsToShowUp" :key="index" clickable @click="handlePushAndRemoveItem(option, true)">
          <q-item-section>
            {{ option[labelKey] }}
          </q-item-section>
        </q-item>
        <q-item v-if="!optionsToShowUp.length">
          <q-item-section>No more items</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<style lang="scss">
.ase-multi-select {
  min-height: 3.2rem;
  height: auto;
  border: 1px solid $border-2;
  border-radius: 4px;
  .custom-chip {
    border-radius: 20px;
    span {
      font-size: 13px;
    }
  }
  .font-weight-thin {
    color: $light-gray-2;
  }
}
</style>
