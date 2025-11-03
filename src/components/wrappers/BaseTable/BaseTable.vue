<template>
  <q-separator />

  <q-table
    ref="tableRef"
    :flat="!noFlat"
    v-bind="$attrs"
    class="base-table"
    :rows="rows"
    :columns="columns"
    :color="color"
    :loading="loading"
    binary-state-sort
    table-class="text-subtitle1"
    bordered
    :class="customClasses"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot :key="slot.name" :name="slot.name" v-bind="props" />
    </template>
  </q-table>
</template>

<script>
import { useSlots } from 'src/composables/useSlots'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BaseTable',
  inheritAttrs: false,
  props: {
    rows: Array,
    columns: Array,
    noFlat: Boolean,
    noBorder: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    loading: Boolean,
    customClasses: String
  },
  setup(_, { slots }) {
    const tableRef = ref()

    return {
      tableRef,
      slots: useSlots(slots)
    }
  }
})
</script>

<style lang="scss" scoped>
// $
@import 'base-table';
</style>

<style lang="scss">
.q-dark {
  .sticky-head {
    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th {
      /* bg color is important for th; just specify one */
      background-color: $dark-page;
    }
  }
}
.sticky-head {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: white;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
