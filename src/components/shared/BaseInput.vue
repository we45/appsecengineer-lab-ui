<template>
  <q-input
    :autofocus="autofocus"
    :autogrow="autogrow"
    :bg-color="bgColor"
    bottom-slots
    :clearable="clearable"
    dense
    :disable="disable"
    :hint="hint"
    :input-class="inputClass"
    :label="label"
    lazy-rules
    :min="min"
    :max="max"
    :maxlength="maxlength"
    outlined
    :placeholder="placeholder"
    :prefix="prefix"
    :readonly="readonly"
    ref="input"
    :required="required"
    :rules="rules"
    :type="type === 'date' ? 'text' : type"
    :model-value="modelValue"
    :aria-label="label || placeholder"
    :aria-invalid="rules && rules.length > 0 ? 'true' : 'false'"
    @blur="!modelValue ? $refs.input.resetValidation() : $refs.input.validate()"
    @update:model-value="$emit('update:model-value', $event)"
    :class="{ 'show_err-in-dark': $q.dark.isActive }"
  >
    <template v-if="type === 'date'" v-slot:append>
      <q-icon name="event" class="cursor-pointer" tabindex="0" role="button" aria-label="Open date picker">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date :mask="mask" :options="options" :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-if="sendButton" v-slot:after>
      <q-btn round dense flat icon="send" @click="$emit('send', { show: true, name: modelValue })" aria-label="Send input" />
    </template>
  </q-input>
</template>

<script>
export default {
  props: {
    autofocus: { required: false, type: Boolean, default: false },
    autogrow: { required: false, type: Boolean, default: false },
    bgColor: { required: false, type: String },
    clearable: { required: false, type: Boolean, default: false },
    disable: { required: false, type: Boolean, default: false },
    hint: { required: false, type: String, default: '' },
    inputClass: { required: false, type: String },
    label: { required: false, type: String },
    mask: { required: false, type: String, default: 'YYYY/MM/DD' },
    min: { required: false, type: Number },
    max: { required: false, type: Number },
    maxlength: { required: false, type: Number, default: 5000 },
    options: { required: false, type: Function },
    placeholder: { required: false, type: String },
    prefix: { required: false, type: String },
    readonly: { required: false, type: Boolean, default: false },
    required: { required: false, type: Boolean, default: false },
    rules: { required: false, type: Array },
    sendButton: { required: false, type: Boolean, default: false },
    type: { required: false, type: String, default: 'text' },
    modelValue: { required: false }
  }
}
</script>
<style lang="scss">
.show_err-in-dark {
  .q-field__inner .q-field__bottom {
    color: #808080 !important;
  }
}
</style>
