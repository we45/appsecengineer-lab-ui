<template>
  <q-select
    :autofocus="autofocus"
    :bottom-slots="bottomSlots"
    :clearable="clearable"
    dense
    :disable="disable"
    fill-input
    :hide-dropdown-icon="Boolean(newValueMode)"
    :hide-selected="!multiple"
    :hide-hint="hideHint"
    :hint="hint"
    input-debounce="0"
    :label="label"
    lazy-rules
    :loading="loading"
    :multiple="multiple"
    :new-value-mode="newValueMode"
    outlined
    :option-disable="optionDisable"
    :options="selectOption"
    options-selected-class="color-custom-orange"
    ref="select"
    :rules="rules"
    use-input
    :model-value="modelValue"
    @filter="filterFn"
    @filter-abort="abortFilterFn"
    @popup-show="$emit('popup-show', $event)"
    @remove="remove"
    @update:model-value="$emit('update:model-value', $event)"
    @virtual-scroll="$emit('virtual-scroll', $event)"
  >
    <template v-if="!Boolean(newValueMode)" v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">No data</q-item-section>
      </q-item>
    </template>
    <template v-if="multiple || Boolean(newValueMode)" v-slot:selected-item="scope">
      <q-chip dense removable :tabindex="scope.tabindex" @remove="scope.removeAtIndex(scope.index)">
        <q-avatar v-if="avatar" color="secondary" text-color="white">
          <img :src="scope.opt.img" alt="avatar image" />
        </q-avatar>
        {{ scope.opt?.label || scope.opt }}
      </q-chip>
    </template>
    <template v-if="sendButton" v-slot:after>
      <q-btn dense flat icon="send" round @click="$emit('send', { show: true, value: modelValue.value })" />
    </template>
    <template v-if="showMore" v-slot:after-options>
      <q-item>
        <q-item-section class="text-center" style="cursor: pointer" @click="$emit('loadMoreItems')">
          <label v-if="loadingData">...</label>
          <label v-else>
            <q-btn color="primary" label="Load more" size="sm" :loading="loading" :disabled="loading" />
          </label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  props: {
    autofocus: { required: false, type: Boolean, default: false },
    avatar: { required: false, type: Boolean, default: false },
    bottomSlots: { required: false, type: Boolean, default: true },
    clearable: { required: false, type: Boolean, default: true },
    disable: { required: false, type: Boolean, default: false },
    hideHint: { required: false, type: Boolean, default: false },
    hint: { required: false, type: String },
    label: { required: false, type: String, default: 'Name' },
    loading: { required: false, type: Boolean, default: false },
    multiple: { required: false, type: Boolean, default: false },
    newValueMode: { required: false, type: String },
    optionDisable: { required: false, type: Function },
    options: { required: false, type: Array, default: () => [] },
    rules: { required: false, type: Array },
    sendButton: { required: false, type: Boolean, default: false },
    showMore: { required: false, type: Boolean, default: false },
    modelValue: { required: false }
  },
  data() {
    return {
      selectOption: this.options
    }
  },
  methods: {
    filterFn(val, update) {
      update(() => {
        if (!val) {
          this.$emit('filter')
          this.selectOption = this.options
        } else {
          const needle = val.toLowerCase()
          this.selectOption = this.options.filter((v) => {
            const optionText = typeof v === 'object' ? v.label : v
            return optionText?.toLowerCase().indexOf(needle) > -1
          })
        }
      })

      if (this.selectOption.length > 0) {
        update()
        return
      }

      if (this.options.length === 0) {
        this.$emit('filter')
        this.selectOption = this.options
      }

      if (!val) {
        setTimeout(() => update(() => (this.selectOption = this.options)), 1500)
        setTimeout(() => update(() => (this.selectOption = this.options)), 3000)
        setTimeout(() => update(() => (this.selectOption = this.options)), 4500)
        setTimeout(() => update(() => (this.selectOption = this.options)), 6000)
      }
    },

    abortFilterFn() {},

    remove(value) {
      if (value.value) {
        this.$emit('remove', { details: value.value })
      }
    }
  }
}
</script>
