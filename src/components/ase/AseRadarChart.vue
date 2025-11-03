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
  }
})

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: props.data.map((item) => {
      let chartOptions = {
        fill: true,
        backgroundColor: item.bgColor,
        borderColor: item.borderColor,
        pointBackgroundColor: item.borderColor
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
    // scale option
    scales: {
      r: {
        ticks: { display: false },
        pointLabels: {
          color: '#030347',
          font: {
            family: 'avenirregular'
          }
        },
        grid: {
          color: '#CDCDDA'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }
})

const exportCsv = () => convertAndDownloadChartJSDataToCSV(props.labels, props.data, props.csvLabelTitle, props.title)
</script>

<template>
  <AseCard :style="{ minHeight: `${height}px`, background: '#ffffff !important' }" :loading="loading">
    <div class="row item-center justify-between">
      <p v-if="title" class="avenir-bold q-mt-sm q-mb-sm section_title" style="color: #030347 !important" :class="[titleClasses]">
        {{ title }}
      </p>

      <q-btn v-if="csvExport" class="q-py-xs q-px-sm" flat color="primary" @click="exportCsv">
        <q-icon name="fas fa-file-csv" size="xs" />
      </q-btn>
    </div>
    <AseChartVisualizer v-if="!loading" :chartId="id" chartType="radar" :chartData="chartData" :config="chartConfig" :height="height" />
  </AseCard>
</template>
