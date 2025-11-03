<script setup>
import { useSlots as useContextSlot } from 'vue'
import { useSlots } from 'src/composables/useSlots'
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'

const slots = useSlots(useContextSlot())

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  emptyLabel: {
    type: String,
    default: 'No data available'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  isInnerTable: {
    type: Boolean,
    default: false
  },
  serverPaginated: {
    type: Boolean,
    default: false
  },
  loadMore: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onLoadMore'])

const $q = useQuasar()

const table_ref = ref()

onMounted(() => {
  if (props.serverPaginated) {
    table_ref.value?.requestServerInteraction()
  }
})

function handleLoadMore(details) {
  if (props.loadMore && !props.isLoading && details.index === props.rows?.length - 1) {
    emit('onLoadMore', details)
  }
}

defineExpose({
  tableRef: table_ref
})
</script>

<template>
  <q-table
    v-bind="$attrs"
    ref="table_ref"
    flat
    bordered
    class="ase-table my-sticky-header-table"
    :table-header-class="[
      'avenir-bold text-uppercase dark-border-lighter relative-position',
      $q.dark.isActive ? 'bg-night-blue ase-table--dark' : 'bg-white'
    ]"
    hide-bottom
    virtual-scroll
    :table-header-style="{
      fontSize: '10px'
    }"
    :table-style="{
      fontSize: '14px'
    }"
    :loading="isLoading"
    :class="{ 'my-inner-table': isInnerTable, 'ase-table--dark': $q.dark.isActive }"
    :rows="rows"
    @virtual-scroll="handleLoadMore"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot
        :key="slot.name"
        :name="slot.name"
        v-bind="props"
        @toggleExpand="
          () => {
            props.expand = !props.expand
          }
        "
      />
    </template>

    <template v-if="!isLoading" #no-data>
      <q-tr class="row items-center justify-center full-width">
        <p class="q-mb-none">{{ emptyLabel }}</p>
      </q-tr>
    </template>
  </q-table>
</template>

<style lang="scss">
.ase-table {
  border-radius: 10px !important;
  background-color: $bg-primary !important;
  th {
    font-size: 10px !important;
  }
  tr {
    height: 56px !important;

    &.q-table__progress {
      height: auto !important;
    }
  }
  .q-table__bottom {
    border-top: none !important;
  }
}
</style>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead
    tr
      th
        z-index: 2 !important
        position: sticky
        color: $text-light-1
        background-color: $bg-primary !important
  thead tr:first-child th
    top: 0
  &.q-table--loading thead tr:last-child th
    top: 48px
  tbody
    scroll-margin-top: 48px
    tr
      z-index: 1 !important
  .q-table__progress
    position: relative
    z-index: 5

.my-inner-table
  thead
    tr
      z-index: 1 !important
</style>
