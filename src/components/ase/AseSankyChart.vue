<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
const $q = useQuasar()
// import { convertAndDownloadChartJSDataToCSV } from 'src/utils/reuseFunctions'

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
    type: Object,
    default: () => {}
  },
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 450
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
    datasets: [
      {
        data: props.data,
        labels: props.labels,
        size: 'max',
        colorFrom: (data) => {
          return data.dataset.data?.[data.dataIndex]?.color ?? '#ffaeb0'
        },
        colorTo: '#030347',
        colorMode: 'from'
      }
    ]
  }
})

const chartConfig = computed(() => {
  return {
    plugins: {
      tooltip: {
        backgroundColor: '#2c2c2c',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2c2c2c',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function () {
            return '' // Remove default title
          },
          label: function (context) {
            const dataPoint = context.raw
            const arrow = '→'
            return `${dataPoint.from} ${arrow} ${dataPoint.to}: ${dataPoint.flow}`
          },
          labelColor: function (context) {
            const dataPoint = context.raw
            return {
              borderColor: dataPoint?.color || '#ffaeb0',
              backgroundColor: dataPoint?.color || '#ffaeb0'
            }
          }
        }
      }
    }
  }
})

const exportCsv = () => {}

function exportSankeyDataToCSV(data) {
  try {
    // Step 1: Prepare the header for the CSV
    const headers = ['From', 'To', 'Flow', 'Color']

    // Step 2: Flatten the data
    const rows = data.datasets[0].data.map((item) => [
      item.from, // "From" field
      item.to, // "To" field
      item.flow, // "Flow" field
      item.color // "Color" field
    ])

    // Step 3: Convert the data into CSV format
    let csvContent = headers.join(',') + '\n' // Add headers as the first row
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n' // Join each data row with commas
    })

    // Step 4: Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

    // Step 5: Create an anchor element to trigger the download
    const link = document.createElement('a')

    // Step 6: Set the download attributes
    link.href = URL.createObjectURL(blob)
    link.download = `sankey_learning_path${new Date().getTime()}.csv` // Set default file name

    // Step 7: Append the link to the document and trigger the click
    document.body.appendChild(link)
    link.click()

    // Step 8: Clean up by removing the link
    document.body.removeChild(link)
  } catch (e) {
    $q.notify({
      message: 'Failed to Export',
      color: 'negative',
      position: 'top',
      timeout: 2000
    })
  }
}
</script>

<template>
  <AseCard class="chart_section" :style="{ minHeight: `${height}px` }" :loading="loading">
    <q-btn
      v-if="csvExport"
      class="q-py-xs q-px-sm q-mr-sm q-mt-sm absolute-top-right"
      flat
      color="primary"
      @click="exportSankeyDataToCSV(chartData)"
    >
      <q-icon name="fas fa-file-csv" size="xs" />
    </q-btn>
    <div class="row item-center justify-between">
      <p v-if="title" class="avenir-bold q-mt-sm q-mb-sm q-pr-md text-subtitle1 text-text-primary" :class="[titleClasses]">
        {{ title }}
      </p>
    </div>
    <AseChartVisualizer
      v-if="!loading && data && data.length > 0"
      :chartId="id"
      chartType="sankey"
      :chartData="chartData"
      :config="chartConfig"
      :height="height"
    />

    <div v-else-if="!loading" class="column items-center justify-center" :style="{ height: `${height}px` }">
      <q-icon name="fas fa-chart-line" size="xl" color="primary" class="q-mb-md" />

      <p class="text-center q-pa-md text-black">No data available to display the chart</p>
    </div>
  </AseCard>
</template>
