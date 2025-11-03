<template>
  <q-btn :loading="loading" :disable="loading" v-bind="$attrs" :color="colorBtn" class="base-btn">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-btn>
</template>
<script>
import { useQuasar } from 'quasar'
import { useSlots } from 'src/composables/useSlots'
import { computed } from 'vue'
export default {
  name: 'BaseBtn',
  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { slots }) {
    const $q = useQuasar()

    const colorBtn = computed(() => {
      if (props.color) return props.color
      return $q.dark.isActive ? 'dark' : 'primary'
    })
    return {
      slots: useSlots(slots),
      colorBtn
    }
  }
}
</script>
<style lang="scss">
.base-btn {
  &.bg-dark {
    border: 1px solid $green-10;
  }
}
</style>
