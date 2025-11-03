<template>
  <div>
    <AseCard flat-card class="q-py-lg q-px-sm q-mb-md" :loading="loading">
      <div>
        <div ref="heatMapChart" autoresize :id="idOfHeatMap" style="width: 100%; min-height: 220px"></div>
        <q-resize-observer @resize="onResize" />
      </div>
    </AseCard>
  </div>
</template>

<style>
.chart_size {
  top: 0;
  width: 100%;
  min-height: 250px;
}
</style>

<script>
import * as echarts from 'echarts'
import { dateFormatReadable } from 'src/utils/reuseFunctions'

export default {
  props: {
    idOfHeatMap: { required: false, default: 'heatMapChart' },
    heatmap_data_values_list: { type: Array, required: false },
    heatmap_colors: {
      required: false,
      default: ['#6600FF1A', '#6600FF40', '#6600FF66', '#6600FF8C', '#6600FFB3', '#6600FFD9', '#6600FFFF']
    },
    heatmap_name: { type: String, required: false },
    heatmap_max: {
      type: Number,
      default: 11
    },
    heatmap_min: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean,
      default: false
    },
    dark_mode_colors: {
      required: false,
      default: ['#9cc7a6', '#8eb998', '#2B9943', '#288D3E', '#248139', '#217534', '#1E692E']
    },
    datesRange: { required: false, default: null }
  },
  data() {
    return {
      paramInfo: {},
      row_info: '',
      model: false,
      heatData: [],
      tempHeatData: [],
      max: 0,
      min: 10,
      heatmap_chart: '',
      yearLabel: new Date().getFullYear(),
      HeatMapChart: {
        grid: { show: false },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let output = ''
            const formattedDate = this.updateDateFormatter(params.value[0])
            output = `${formattedDate} <hr/> Activity: ${params.value[1]}`
            return output
          },
          showDelay: 40,
          transitionDuration: 1.2,
          textStyle: { fontSize: 12, lineHeight: 18 }
        },
        calendar: {
          top: 30,
          left: 40,
          right: 20,
          cellSize: [20, 'auto'],
          range: this.datesRange !== null ? this.datesRange : this.yearLabel,
          itemStyle: {
            borderCap: 'square',
            padding: 10,
            color: '#E1E4E8',
            borderWidth: 7,
            borderColor: '#fff',
            // shadowBlur: 0.1,
            opacity: 1,
            backgroundColor: '#ffffff',
            borderJoin: 'miter'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#808B96',
              width: 0.6,
              shadowOffsetY: '#fff',
              borderColor: '#ffffff',
              padding: 12
            }
          },
          yearLabel: { show: false },
          monthLabel: { show: true, align: 'left', fontSize: 11 },
          dayLabel: {
            show: true,
            firstDay: 0,
            fontSize: 10,
            align: 'top',
            verticalAlign: 'top',
            fontWeight: 'normal',
            nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          }
        },
        visualMap: {
          show: false,
          min: this.heatmap_min,
          max: this.heatmap_max,
          type: 'piecewise',
          orient: 'horizontal',
          inRange: { color: this.$q.dark?.mode ? this.dark_mode_colors : this.heatmap_colors },
          top: 'bottom',
          left: 'center'
        },
        series: {
          name: this.heatmap_name,
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.heatmap_data_values_list,
          emphasis: {
            itemStyle: {
              shadowBlur: 5,
              shadowColor: '#228B22'
            }
          }
        }
      }
    }
  },

  watch: {
    heatmap_data_values_list: {
      handler() {
        this.updateHeatMap()
        this.init()
      }
    },
    itemStyle: {
      deep: true,
      handler() {
        this.updateHeatMap()
        this.init()
      }
    },
    datesRange: {
      handler() {
        this.updateHeatMap()
        this.init()
      }
    }
  },
  methods: {
    init() {
      const heatMapChart = document.getElementById(this.idOfHeatMap)
      echarts.dispose(heatMapChart)
      const theme = this.model ? 'dark' : 'light'
      this.heatmap_chart = echarts.init(heatMapChart, theme)
      this.heatmap_chart.setOption(this.HeatMapChart)
    },
    updateHeatMap() {
      this.HeatMapChart = {
        grid: { show: false },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let output = ''
            const formattedDate = this.updateDateFormatter(params.value[0])
            output = `${formattedDate} <hr/> Activity: ${params.value[1]}`
            return output
          },
          showDelay: 40,
          transitionDuration: 1.2,
          textStyle: { fontSize: 12, lineHeight: 18 }
        },
        calendar: {
          top: 30,
          left: 40,
          right: 20,
          cellSize: [20, 'auto'],
          range: this.datesRange ? this.datesRange : this.yearLabel,
          itemStyle: {
            borderCap: 'square',
            padding: 10,
            color: this.itemStyle.itemColor,
            borderWidth: 7,
            borderColor: this.itemStyle.borderColor,
            opacity: 1,
            borderJoin: 'miter'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#808B96',
              width: 0.6,
              shadowOffsetY: '#fff',
              borderColor: 'red',
              padding: 12
            }
          },
          yearLabel: { show: false },
          monthLabel: { show: true, align: 'left', fontSize: 14, color: this.itemStyle.label },
          dayLabel: {
            show: true,
            firstDay: 0,
            align: 'top',
            verticalAlign: 'top',
            nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            color: this.itemStyle.label,
            fontSize: 14
          }
        },
        visualMap: {
          show: false,
          min: this.heatmap_min,
          max: this.heatmap_max,
          type: 'piecewise',
          orient: 'horizontal',
          inRange: { color: this.$q.dark?.mode ? this.dark_mode_colors : this.heatmap_colors },
          top: 'bottom',
          left: 'center'
        },
        series: {
          name: this.heatmap_name,
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.heatmap_data_values_list,
          emphasis: {
            itemStyle: {
              shadowBlur: 5,
              shadowColor: '#228B22'
            }
          }
        }
      }
    },
    onResize() {
      if (this.heatmap_chart) {
        this.heatmap_chart.resize()
        this.heatmap_chart.setOption(this.HeatMapChart)
      }
    },

    updateDateFormatter(date) {
      return dateFormatReadable(date)
    }
  },
  computed: {
    itemStyle() {
      return this.$q.dark?.mode
        ? {
            label: 'white',
            itemColor: '#352C88',
            borderColor: '#2D2573'
          }
        : {
            label: 'black',
            itemColor: '#E1E4E8',
            borderColor: '#fff'
          }
    },
    getItemColor() {
      return this.$q.dark?.mode ? '#352C88' : 'black'
    }
  }
}
</script>
