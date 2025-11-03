<script setup>
import { ref, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

Chart.register(SankeyController, Flow)

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true
  },
  chartData: {
    type: Object,
    default: () => {}
  },
  config: {
    type: Object,
    default: () => {}
  },
  height: {
    type: Number,
    default: 300
  }
})

const chart = ref(null)
const _chart = ref(null)
const isRendered = ref(false)
const loadError = ref(false)

const chartJsPayload = computed(() => {
  return {
    type: props.chartType,
    data: props.chartData,
    options: props.config
  }
})

watch(
  () => [props.chartData, props.config],
  (newVal, oldVal) => {
    try {
      if (chart.value) {
        loadError.value = false
        if (isRendered.value && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          createNewChart()
          // _chart.value.data = newVal
          if (props.chartType === 'sankey') {
            _chart.value.update()
          }
        }
        return
      }
    } catch (error) {
      loadError.value = error
    }
  },
  {
    deep: true
  }
)

watch(
  chart,
  () => {
    try {
      if (chart.value) {
        loadError.value = false
        if (!isRendered.value) {
          createNewChart()
          isRendered.value = true
        }
      }
    } catch (error) {
      loadError.value = error
    }
  },
  {
    deep: true
  }
)

function createNewChart() {
  const ctx = chart.value?.getContext('2d')
  // destroy existing instance
  if (_chart.value) {
    _chart.value.destroy()
  }
  // create new
  _chart.value = new Chart(ctx, {
    ...chartJsPayload.value
  })
}
</script>

<template>
  <div :style="{ height: `${height}px` }" class="full-width">
    <canvas :id="chartId" ref="chart" :style="{ height: `${height}px` }" class="full-width"></canvas>
  </div>
</template>
