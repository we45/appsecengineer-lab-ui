<script setup>
import { computed } from 'vue'
import { convertAndDownloadChartJSDataToCSV } from 'src/utils/reuseFunctions'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    String,
    default: ''
  },
  titleClasses: {
    type: String,
    default: ''
  },
  labels: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 300
  },
  loading: {
    type: Boolean,
    default: false
  },
  csvExport: {
    type: Boolean,
    default: true
  },
  csvLabelTitle: {
    type: String,
    default: 'Name'
  },
  flat: {
    type: Boolean,
    default: false
  }
})

const hasData = computed(() => {
  const hasAnyData = props.data?.findIndex((el) => el?.data?.length)
  return hasAnyData >= 0
})

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: props.data.map((item) => {
      let chartOptions = {
        backgroundColor: item.bgColor,
        borderColor: item.borderColor || item.bgColor,
        borderWidth: 2,
        hoverBackgroundColor: item.hoverColor || item.bgColor,
        hoverBorderColor: item.hoverBorderColor || item.borderColor || item.bgColor
      }
      return {
        label: item.label,
        data: item.data,
        ...chartOptions
      }
    })
  }
})

const chartConfig = computed(() => {
  return {
    // common options
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 15 } },
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }
})

const exportCsv = () => convertAndDownloadChartJSDataToCSV(props.labels, props.data, props.csvLabelTitle, props.title)
</script>

<template>
  <AseCard
    class="overflow-hidden"
    sectionClass="q-pl-none q-pr-sm"
    :style="{
      minHeight: height,
      background: '#ffffff !important'
    }"
    :flatCard="flat"
    :loading="loading"
  >
    <div class="full-width row items-center justify-between">
      <p
        v-if="title"
        class="avenir-bold q-mt-sm q-mb-sm q-px-md"
        style="font-size: 1rem !important; color: #030347 !important"
        :class="[titleClasses]"
      >
        {{ title }}
      </p>
      <div class="q-mr-xl">
        <slot name="tools" />
      </div>
      <q-btn v-if="csvExport" class="q-py-xs q-px-sm q-mr-sm q-mt-sm absolute-top-right" flat color="primary" @click="exportCsv">
        <q-icon name="fas fa-file-csv" size="xs" />
      </q-btn>
    </div>

    <AseChartVisualizer :chartId="id" :height="height" chartType="doughnut" :chartData="chartData" :config="chartConfig" />

    <p v-if="!loading && !hasData" class="absolute-center">No data</p>
  </AseCard>
</template>
