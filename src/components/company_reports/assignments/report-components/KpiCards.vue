<script setup>
import { computed } from 'vue'

const props = defineProps({
  reportMetrics: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hideVideoMetrics: {
    type: Boolean,
    default: false
  }
})

function getProgressColor(value) {
  if (value < 30) return 'error'
  if (value < 70) return 'warning'
  return 'success'
}

function getProgressColorClass(value) {
  if (value < 30) return 'text-error'
  if (value < 70) return 'text-warning'
  return 'text-success'
}

// New computed property to calculate completed users
const completedUsers = computed(() => {
  if (!props.reportMetrics?.totalUsers) return 0
  return Math.round(props.reportMetrics.totalUsers * (props.reportMetrics.completionRate / 100))
})

// New computed property to determine font size based on total users
const completionRateFontSize = computed(() => {
  if (props.reportMetrics?.totalUsers >= 100) return 'text-h5'
  if (props.reportMetrics?.totalUsers >= 50) return 'text-h4'
  return 'text-h4'
})

function getTimeSpent(minutes) {
  // Input is already in minutes, don't divide by 60
  const totalMinutes = Math.round(minutes)
  return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`
}
</script>

<template>
  <div class="row q-col-gutter-md q-mb-md">
    <!-- Users KPI -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <AseCard flatCard dark>
        <div class="column no-wrap">
          <div class="row items-center justify-between">
            <div class="avenir-bold text_dark" style="font-size: 28px">{{ reportMetrics.totalUsers }}</div>
            <div v-if="reportMetrics.totalUsers > 0" class="trend-indicator q-mt-xs">
              <q-icon name="arrow_upward" size="xs" color="secondary" />
              <span class="text-secondary q-mt-xs q-ml-xs">Active</span>
            </div>
          </div>
          <div class="text_dark avenir-bold">Users</div>
        </div>
      </AseCard>
    </div>

    <!-- Completion Rate KPI -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <AseCard flatCard dark>
        <div class="column no-wrap">
          <div class="row items-center justify-between">
            <div class="avenir-bold text_dark" style="font-size: 28px">{{ completedUsers }} of {{ reportMetrics.totalUsers }}</div>
            <q-circular-progress
              size="2rem"
              show-value
              color="secondary"
              rounded
              :value="reportMetrics.completionRate"
              animation-speed
              aria-live="polite"
            >
              <div class="text_dark q-ml-xs">{{ reportMetrics.completionRate }}%</div>
            </q-circular-progress>
          </div>
          <div class="text_dark avenir-bold">Completion Rate</div>
        </div>
      </AseCard>
    </div>

    <!-- Progress KPI -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <AseCard flatCard dark>
        <div class="column no-wrap">
          <div class="row items-center justify-between">
            <div class="avenir-bold text_dark" style="font-size: 28px">{{ reportMetrics.overallProgress }}%</div>
          </div>
          <div class="text_dark avenir-bold">Average progress</div>
        </div>
      </AseCard>
    </div>

    <!-- Time Engagement KPI -->
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <AseCard flatCard dark>
        <div class="column no-wrap">
          <div class="row items-center justify-between">
            <div class="avenir-bold text_dark" style="font-size: 28px">
              {{ getTimeSpent(reportMetrics.totalVideoTime) }}
            </div>
          </div>
          <div class="text_dark avenir-bold">Video Time Engagement</div>
        </div>
      </AseCard>
    </div>

    <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <AseCard flatCard dark>
        <div class="column no-wrap">
          <div class="row items-center justify-between">
            <div class="avenir-bold text_dark" style="font-size: 28px">
              {{ getTimeSpent(reportMetrics.totalLabTime) }}
            </div>
          </div>
          <div class="text_dark avenir-bold">Lab Time Engagement</div>
        </div>
      </AseCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text_dark {
  color: $text-light-2 !important;
}
</style>
