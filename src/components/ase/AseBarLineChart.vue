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
  chartType: {
    type: String,
    default: 'bar'
  },
  labels: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  yStepSize: {
    type: [Number, String],
    default: 'default'
  },
  xAxesTitle: {
    type: String,
    default: ''
  },
  yAxesTitle: {
    type: String,
    default: ''
  },
  horizontal: {
    type: Boolean,
    default: false
  },
  showLegend: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 300
  },
  cleaner: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: false
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

const barChartOptions = {
  borderRadius: 5,
  maxBarThickness: 10,
  borderSkipped: false
}
const lineChartOptions = {
  borderWidth: 4,
  tension: 0.5
  // pointRadius: 0
}

const hasData = computed(() => {
  const hasAnyData = props.data?.findIndex((el) => el?.data?.length)
  return hasAnyData >= 0
})

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: props.data.map((item) => {
      const isBarChart = props.chartType === 'bar'
      let chartOptions = {
        ...(isBarChart ? barChartOptions : lineChartOptions)
      }
      chartOptions[isBarChart ? 'backgroundColor' : 'borderColor'] = item.bgColor
      chartOptions[isBarChart ? 'hoverBackgroundColor' : 'hoverBorderColor'] = item.hoverColor
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
    ...(props.horizontal ? { indexAxis: 'y' } : {}),
    animation: {
      duration: 0
    },
    // scale option
    scales: {
      x: {
        // border: { display: false },
        grid: { display: false, color: '#CDCDDA' },
        ticks: {
          color: '#030347',
          font: {
            family: 'avenirregular'
          }
        },
        title: {
          display: Boolean(props.xAxesTitle),
          text: props.xAxesTitle,
          color: '#030347',
          font: {
            family: 'avenirbold'
          },
          padding: {
            top: 15
          }
        }
      },
      y: {
        display: !props.cleaner,
        grid: {
          color: '#CDCDDA'
        },
        border: { display: false },
        ticks: {
          ...(props.yStepSize !== 'default' ? { stepSize: props.yStepSize } : {}),
          beginAtZero: true,
          color: '#030347',
          font: {
            family: 'avenirregular'
          }
        },
        title: {
          display: Boolean(props.yAxesTitle),
          text: props.yAxesTitle,
          color: '#030347',
          font: {
            family: 'avenirbold'
          }
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
      <p v-if="title" class="avenir-bold q-mt-sm q-mb-sm q-px-md section_title" style="color: #030347 !important" :class="[titleClasses]">
        {{ title }}
      </p>
      <div class="q-mr-xl">
        <slot name="tools" />
      </div>
      <q-btn v-if="csvExport" class="q-py-xs q-px-sm q-mr-sm q-mt-sm absolute-top-right" flat color="primary" @click="exportCsv">
        <q-icon name="fas fa-file-csv" size="xs" />
      </q-btn>
    </div>

    <AseChartVisualizer
      :chartId="id"
      :height="showLegend ? height - 100 : height"
      :chartType="chartType"
      :chartData="chartData"
      :config="chartConfig"
    />

    <div v-if="showLegend" class="row items-center justify-center q-mt-lg q-mb-sm">
      <template v-for="(row, index) in data" :key="index">
        <div class="row items-center justify-center q-mx-md">
          <div style="height: 6px; width: 2.6rem; border-radius: 4px" :style="{ background: row?.bgColor }" />
          <p class="q-mb-none q-ml-xs text-dark" style="font-size: 11px">{{ row.label }}</p>
        </div>
      </template>
    </div>

    <p v-if="!loading && !hasData" class="absolute-center">No data</p>
  </AseCard>
</template>
