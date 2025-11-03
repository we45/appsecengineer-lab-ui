<template>
  <q-toggle
    checked-icon="check"
    color="primary"
    dark
    dense
    :disable="disable"
    keep-color
    :label="label"
    unchecked-icon="clear"
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script>
export default {
  props: {
    disable: { required: false, type: Boolean, default: false },
    label: { required: false, type: String, default: 'Name' },
    modelValue: { required: false, type: Boolean }
  }
}
</script>
