<template>
  <slot name="header">
    <div class="text-subtitle1 q-my-md">{{ title }}</div>
  </slot>
  <div id="chart" style="max-height: 500px; height: 100%; overflow-y: auto; overflow-x: hidden">
    <apexchart type="bar" :options="chartOptions" :series="series" :height="customHeight" v-bind="$attrs"></apexchart>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default defineComponent({
  name: 'BarGraph',
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
    title: {
      type: String,
      default: ''
    },
    horizontal: {
      type: Boolean,
      default: true
    },
    xAxisTitle: {
      type: String,
      default: ''
    },
    yAxisTitle: {
      type: String,
      default: ''
    },
    yTooltipTitle: {
      type: String,
      default: ''
    },
    defaultSeries: {
      type: Boolean,
      default: false
    },
    customColors: {
      type: [Array, Boolean, Object],
      default: undefined
    },
    fixedHeight: {
      type: Boolean,
      default: true
    },
    graphType: {
      type: String,
      default: 'bar'
    },
    defaultYTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          foreColor: this.$q.dark.isActive ? 'white' : undefined,
          toolbar: {
            show: true,
            tools: {
              download: true
            }
          },
          footer: {
            show: false
          },
          events: {
            click: (event, chartContext, config) => {
              this.$emit('clickEvt', { event, chartContext, config })
            }
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          bar: {
            borderRadius: 0,
            horizontal: this.horizontal,
            distributed: true,
            columnWidth: '40%',
            selection: {
              enabled: true
            }
          }
        },
        xaxis: {
          categories: this.categories.map((ele) => {
            if (!ele) {
              return 'null'
            }
            return ele
          }),
          title: {
            text: this.xAxisTitle ?? undefined
          }
        },
        yaxis: {
          title: {
            text: this.yAxisTitle ?? undefined
          }
        },
        title: {
          text: '',
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: undefined,
            color: '#263238'
          }
        },
        // colors: this.customColors,
        colors: ['#ff5e62', '#6600ff', '#00a4e8', '#ec008c', '#ff5e62', '#6600ff'],
        fill: {
          type: 'gradient',
          gradient: {
            type: this.horizontal ? 'horizontal' : 'vertical',
            gradientToColors: ['#ff9963', '#5451e1', '#00ffff', '#662d91', '#ff9963', '#5451e1'],
            stops: [0, 100]
          }
        },
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
              formatter: (val) => {
                if (this.defaultYTitle) {
                  return val ?? ''
                }
                return this.yTooltipTitle ?? ''
              }
            }
          },
          theme: this.$q.dark.isActive ? 'dark' : 'light'
        }
      }
    },
    series() {
      return this.data
    },
    customHeight() {
      if (this.fixedHeight) return '400px'

      return `${this.series[0]?.data?.length * 50 + 100}px` ?? '400px'
    }
  }
})
</script>
