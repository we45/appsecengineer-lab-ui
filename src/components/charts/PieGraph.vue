<template>
  <div id="chart">
    <apexchart type="pie" :options="chartOptions" :series="series" height="400" v-if="chartOptions"></apexchart>
    <div style="visibility: hidden">{{ chartOptions }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'PieChart', // Changed the component name to "PieChart" to better reflect its purpose
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    customTooltip: {
      // New prop to accept the customTooltip callback function
      type: Function,
      default: undefined
    },
    chartWidth: {
      type: Number,
      default: undefined
    }
    // Other props...
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          width: this.chartWidth ?? 400,
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          height: 400,
          type: 'pie'
        },
        labels: this.categories,
        tooltip: {
          style: {
            fontSize: '12px',
            fontFamily: undefined
          },
          onDatasetHover: {
            highlightDataSeries: false
          },
          x: {
            show: true,
            format: 'dd MMM',
            formatter: undefined
          },
          y: {
            formatter: undefined,
            title: {
              formatter: (_) => {
                return this.yTooltipTitle ?? ''
              }
            }
          },
          custom: this.customTooltip // Use the customTooltip prop as the callback function
        }
      }
    },
    series() {
      return this.data
    }
  }
})
</script>
