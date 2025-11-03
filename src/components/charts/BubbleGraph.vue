<template>
  <div class="bubble-chart">
    <apexchart type="bubble" :options="chartOptions" :series="chartData" width="100%" />
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'BubbleChart',
  components: {
    apexchart: VueApexCharts
  },
  props: {
    data: Array // Pass your data to this component as a prop
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          height: 350,
          type: 'bubble',
          foreColor: this.$q.dark.isActive ? 'white' : undefined
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          opacity: 0.8
        },
        title: {
          text: 'Learning Paths Bubble Chart',
          align: 'center'
        },
        xaxis: {
          tickAmount: 12,
          type: 'category'
        },
        yaxis: {
          tickAmount: 4,
          title: {
            text: 'Completed'
          }
        }
      }
    },
    chartData() {
      // Process your data and create the series for the chart
      return this.data.map((path) => ({
        name: path.name,
        data: [
          {
            x: path.skills.length, // Number of skills
            y: path.completed,
            z: path.completed // Use completed count for the size of the bubble
          }
        ]
      }))
    }
  }
}
</script>

<style scoped>
.bubble-chart {
  max-width: 800px;
  margin: 0 auto;
}
</style>
