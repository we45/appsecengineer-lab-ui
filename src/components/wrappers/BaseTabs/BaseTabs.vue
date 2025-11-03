<template>
  <q-tabs
    v-bind="$attrs"
    align="left"
    no-caps
    class="base-tabs"
    switch-indicator
    indicator-color="blue-12"
    :active-bg-color="$q.dark.isActive ? 'blue-9' : 'grey-12'"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :key="slot.name" :name="slot.name" />
    </template>
  </q-tabs>
</template>
<script>
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseTabs',
  inheritAttrs: true,
  setup(props, { slots }) {
    return {
      slots: useSlots(slots)
    }
  }
}
</script>
<style lang="scss">
.base-tabs {
  &.q-tabs {
    border: 1px solid $separator-color;
    .q-tab {
      padding: 0 40px;
    }
  }
}

.q-dark {
  .q-tabs {
  }
}
</style>
