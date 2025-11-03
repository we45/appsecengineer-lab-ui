<template>
  <div>
    <q-toggle
      label-color="white"
      :label="title"
      outlined
      dark
      dense
      :value="name"
      :autofocus="autofocus"
      checked-icon="check"
      color="green"
      keep-color
      :style="{ color: '#57D9A6' }"
      unchecked-icon="clear"
      @update:modelValue="updateData"
      val="150px"
    />
  </div>
</template>
<script>
export default {
  name: 'ToggleRadio',
  props: {
    name: {
      required: false,
      type: Boolean,
      default: false
    },
    title: {
      required: false,
      type: String,
      default: 'Name'
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateData(event) {
      this.$emit('updateToggleStatus', { earlier: this.name })
    }
  }
}
</script>
