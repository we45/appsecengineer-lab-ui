<template>
  <div>
    <q-select
      outlined
      :dense="densed"
      :value="name"
      bottom-slots
      @update:modelValue="$emit('update:name', $event)"
      :label="title"
      use-input
      use-chips
      :maxlength="maxLength"
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
    >
      <template v-slot:hint>
        <div class="error_msg_color">{{ hint }}</div>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'Tags',
  props: {
    name: {
      required: false
    },
    title: {
      required: false,
      type: String,
      default: 'Name'
    },
    maxLength: {
      required: false
    },
    hint: {
      required: false,
      type: String,
      default: ''
    },
    densed: {
      required: false
    }
  }
}
</script>
