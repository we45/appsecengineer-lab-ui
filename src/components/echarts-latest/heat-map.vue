<template>
  <component :is="wrapperComponent" flat-card>
    <template v-if="!plain">
      <div class="row" style="padding-bottom: 1%; padding-top: 1%">
        <div class="q-px-xs col-xs-12 col-sm-9 col-md-9 col-lg-9">
          <div class="section_title q-mb-none avenir-bold">{{ title }}</div>
        </div>
        <div class="q-px-xs col-xs-12 col-sm-3 col-md-3 col-lg-3" align="right">
          <slot name="heatMapSlot"></slot>
        </div>
      </div>
      <q-separator v-if="!withCard" class="q-my-lg" />
    </template>
    <component :is="childComponent" flat-card class="q-py-lg q-px-sm q-mb-md" :loading="loading">
      <div class="overflow-auto">
        <div ref="heatMapChart" autoresize :id="idOfHeatMap" style="width: 100%; min-height: 220px; min-width: 600px"></div>
        <q-resize-observer @resize="onResize" />
      </div>
      <q-card-section v-if="show_selected_date">
        <div class="row q-col-gutter-sm">
          <div class="col-md-12 col-sm-12 col-xs-12">
            <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade" style="padding-left: 0px">
              {{ updateDateFormatter(paramInfo.date) }}
            </p>
          </div>
        </div>
      </q-card-section>
    </component>
    <div class="row none-spacing q-col-gutter-md">
      <div v-for="(course, index) in individualInformation.list_values" class="col-md-6 col-sm-12" :key="index">
        <CourseList :data="course" @moveToCourseInfo="redirectionToCoursePage(course, true)">
          <template #progress><q-space /></template>
          <template #tooltip><q-space /></template>
        </CourseList>
      </div>
    </div>
  </component>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.chart_size {
  top: 0;
  width: 100%;
  min-height: 250px;
}
</style>

<script>
import * as echarts from 'echarts'
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import CourseList from '../course/CourseList.vue'
import useCourseNavigation from 'src/composables/useCourseNavigation'

export default {
  name: 'E-HeatMapChart',
  components: {
    CourseList
  },
  props: {
    heatmap_data: { required: false },
    idOfHeatMap: { required: false, default: 'heatMapChart' },
    heatmap_data_values_list: { type: Array, required: false },
    heatmap_labels: { type: Array, required: false },
    heatmap_colors: { required: false },
    heatmap_name: { type: String, required: false },
    heatmap_max: { required: false },
    heatmap_min: { required: false },
    title: { type: String, required: false },
    individualInformation: { required: false },
    individualDetailedInformation: { required: false },
    datesRange: {},
    plain: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSelectedDate: {
      type: Boolean,
      default: true
    },
    withCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paramInfo: {},
      row_info: '',
      model: false,
      show_selected_date: false,
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
          left: 45,
          right: 25,
          cellSize: [20, 'auto'],
          range: this.datesRange ? this.datesRange : this.yearLabel,
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
          inRange: { color: this.heatmap_colors },
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
    },
    'individualInformation.list_values': {
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
      this.heatmap_chart.on('click', (params) => this.getIndividualEvent(params))
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
          left: 45,
          right: 25,
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
          inRange: { color: this.heatmap_colors },
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

    getIndividualEvent(params) {
      this.row_info = ''
      this.show_selected_date = this.showSelectedDate
      this.paramInfo = {
        date: params.value[0],
        value: params.value[1]
      }
      this.$emit('individualDateStats', { date: params.value[0] })
    },
    updateDateFormatter(date) {
      return dateFormatReadable(date)
    },
    cellInformation(name, event_id) {
      if (name === this.row_info) {
        this.row_info = ''
      } else {
        this.$emit('deepInformationOfCourse', { name: name, event_id: event_id, date: this.paramInfo.date })
        this.row_info = name
      }
    },
    async redirectionToCoursePage(data) {
      this.loadAndMoveToCourseInfo(data.event_id)
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
    },
    wrapperComponent() {
      return this.withCard ? 'AseCard' : 'div'
    },
    childComponent() {
      return this.withCard ? 'div' : 'AseCard'
    }
  },
  setup() {
    const { loadAndMoveToCourseInfo } = useCourseNavigation()
    return { loadAndMoveToCourseInfo }
  }
}
</script>
