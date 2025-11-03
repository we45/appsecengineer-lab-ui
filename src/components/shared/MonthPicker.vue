<template>
  <q-dialog :modelValue="showDialog" persistent @hide="confirmCancel">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ header }}</div>
        <q-space />
        <q-btn icon="close" dense flat round color="primary" v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-py-none text-center">
        <q-date
          default-view="Months"
          emit-immediately
          flat
          input-class="no-pointer-events"
          :key="dataKey"
          mask="YYYY-MM"
          minimal
          :modelValue="selectedDate"
          :navigation-max-year-month="getCurrentMonth"
          navigation-min-year-month="2000/01"
          years-in-month-view
          @update:modelValue="onUpdateMonth"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn class="full-width" color="primary" label="Submit" @click="confirmSelect()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
import { computed, ref } from 'vue'

const mapMonthIndex = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

export default {
  name: 'DateRangeSelectorMonth',
  props: ['header', 'modelValue', 'showDialog'],
  emits: ['confirmSelect', 'confirmCancel', 'update:modelValue', 'update:showDialog'],
  setup(props, { emit }) {
    const qDate = ref(null)
    const dataKey = ref(Date.now())

    const selectedDate = computed({
      get() {
        if (!props.modelValue) return getCurrentMonth.value.replace('/', '-')
        return extractYYMM(props.modelValue)
      },
      set(value) {
        emit('update:modelValue', formatDate(value))
      }
    })

    function confirmCancel() {
      emit('confirmCancel', false)
    }

    function confirmSelect() {
      emit('update:modelValue', selectedDate.value)
      emit('confirmSelect')
    }

    function onUpdateMonth(event) {
      dataKey.value = Date.now()
      emit('update:modelValue', event)
    }

    function formatDate(value) {
      const [year, month] = value.split('-')
      const generatedDate = date.formatDate(new Date(year, month - 1, 1), 'YYYY-MM-DD')
      const lastDay = date.endOfDate(generatedDate, 'month')
      const toDate = date.formatDate(lastDay, 'YYYY-MM-DD')
      const fromDate = date.formatDate(date.subtractFromDate(toDate, { months: 1 }), 'YYYY-MM-DD')

      return {
        from: `${fromDate}T18:30:00.000Z`,
        to: `${toDate}T18:30:00.000Z`,
        month: mapMonthIndex[month],
        monthIndex: month,
        year: year,
        selectedYear: year,
        rangeFrom: null,
        rangeTo: null,
        rangeFromMonth: null,
        rangeToMonth: null
      }
    }

    function extractYYMM(value) {
      const [year, month] = value.split('-')
      return `${year}-${month}`
    }

    const getCurrentMonth = computed(() => {
      return date.formatDate(new Date(), 'YYYY/MM')
    })

    return {
      confirmCancel,
      confirmSelect,
      onUpdateMonth,
      selectedDate,
      qDate,
      dataKey,
      getCurrentMonth
    }
  }
}
</script>

<style scoped lang="scss">
.q-btn-override {
  background-color: #ffffff !important;
  color: #ffffff !important;
  &:hover {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
  &:focus,
  &:active {
    background-color: #ffffff !important;
    color: #ffffff !important;
  }
}
</style>
