<template>
  <div>
    <HeatMap
      @individualDateStats="individualDateStats"
      :heatmap_data_values_list="userStatsActivity.values_list"
      :heatmap_data="userStatsActivity.data"
      :heatmap_max="userStatsActivity.max"
      :heatmap_min="userStatsActivity.min"
      :heatmap_colors="userStatsActivity.gitColorsUpdated"
      :heatmap_name="userStatsActivity.name"
      :title="userStatsActivity.title"
      idVal="DashboardUserActivity"
      :datesRange="datesRange"
      :individualInformation="{ data: {} }"
      :individualDetailedInformation="{ data: {} }"
      :showSelectedDate="false"
    >
      <template v-slot:heatMapSlot>
        <slot name="dashboardSlot"></slot>
      </template>
    </HeatMap>
  </div>
</template>

<script>
import HeatMap from 'components/echarts-latest/heat-map.vue'
import { date } from 'quasar'

export default {
  components: { HeatMap },
  props: {
    values: {
      type: Array
    }
  },
  data() {
    return {
      loaded: false,
      datesRange: []
    }
  },
  mounted() {
    const currentDate = date.formatDate(
      date.addToDate(new Date(), {
        months: 1
      }),
      'YYYY-MM'
    )
    const previousYearDate = date.formatDate(date.subtractFromDate(currentDate, { years: 1 }), 'YYYY-MM')
    this.datesRange = [previousYearDate, currentDate]
  },
  computed: {
    userStatsActivity() {
      return {
        data: [],
        labels: [],
        colors: ['#AED6F1', '#85C1E9', '#5DADE2', '#2874A6', '#21618C'],
        gitColors: ['#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#144620'],
        gitColorsUpdated: ['#9cc7a6', '#8eb998', '#2B9943', '#288D3E', '#248139', '#217534', '#1E692E'],
        title: 'User Activity',
        name: 'User Activity',
        values_list: this.values.map((list) => [list.date, list.activity]),
        max: this.maxActivity,
        min: 1
      }
    },
    maxActivity() {
      const maxNumber = Math.max(...this.values.map((item) => item.activity))
      return maxNumber >= 10 ? maxNumber : 10
    }
  },
  methods: {
    individualDateStats(event) {}
  }
}
</script>
