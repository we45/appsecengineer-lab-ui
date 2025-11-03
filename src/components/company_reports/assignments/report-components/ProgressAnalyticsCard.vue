<script setup>
import { defineProps, computed } from 'vue'
import InfoListItem from 'components/common/InfoListItem.vue'

const props = defineProps({
  reportMetrics: {
    type: Object,
    required: true
  },
  hideVideoMetrics: {
    type: Boolean,
    default: false
  },
  passPercentage: {
    type: Number,
    required: true
  }
})

// Calculate users in each progress bracket using actual user data
const progressDistribution = computed(() => {
  const totalUsers = props.reportMetrics?.totalUsers || 0
  if (totalUsers === 0) return { bracket1: 0, bracket2: 0, bracket3: 0, bracket4: 0 }

  // Use real user data if available
  const userReports = props.reportMetrics?.userReports || []

  let bracket1 = 0 // 0-25%
  let bracket2 = 0 // 26-50%
  let bracket3 = 0 // 51-75%
  let bracket4 = 0 // 76-100%

  // Count users in each progress bracket based on their actual progress
  if (userReports.length > 0) {
    userReports.forEach((user) => {
      const progress = user.progress || 0

      if (progress <= 25) {
        bracket1++
      } else if (progress <= 50) {
        bracket2++
      } else if (progress <= 75) {
        bracket3++
      } else {
        bracket4++
      }
    })
  } else {
    // If we have top performers data but no full user reports
    const topPerformers = props.reportMetrics?.topPerformers || []

    topPerformers.forEach((performer) => {
      const progress = performer.progress || 0

      if (progress <= 25) {
        bracket1++
      } else if (progress <= 50) {
        bracket2++
      } else if (progress <= 75) {
        bracket3++
      } else {
        bracket4++
      }
    })

    // If we don't have any user progress data but have totalUsers,
    // fallback to default distribution to avoid showing zeros
    if (topPerformers.length === 0 && totalUsers > 0) {
      // Just to show some distribution - we'll count all users with no data as bracket1
      bracket1 = totalUsers
    }
  }

  return { bracket1, bracket2, bracket3, bracket4 }
})
</script>

<template>
  <AseCard>
    <div class="avenir-bold q-mt-sm section_title">
      Progress Analytics
      <q-icon name="trending_up" size="sm" color="primary" class="q-mr-xs" />
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <!-- Progress Buckets -->
      <div class="col-12">
        <!-- Text explanation of distribution -->
        <div class="text-explanation q-mb-md">
          <ul class="distribution-list q-mb-md">
            <li class="q-mb-xs">
              <span class="text-weight-medium">
                {{ progressDistribution.bracket4 }} users ({{
                  Math.round((progressDistribution.bracket4 / reportMetrics.totalUsers) * 100) || 0
                }}%)
              </span>
              are making excellent progress (76-100%)
            </li>
            <li class="q-mb-xs">
              <span class="text-weight-medium">
                {{ progressDistribution.bracket3 }} users ({{
                  Math.round((progressDistribution.bracket3 / reportMetrics.totalUsers) * 100) || 0
                }}%)
              </span>
              have good progress (51-75%)
            </li>
            <li class="q-mb-xs">
              <span class="text-weight-medium">
                {{ progressDistribution.bracket2 }} users ({{
                  Math.round((progressDistribution.bracket2 / reportMetrics.totalUsers) * 100) || 0
                }}%)
              </span>
              have moderate progress (26-50%)
            </li>
            <li class="q-mb-xs">
              <span class="text-weight-medium">
                {{ progressDistribution.bracket1 }} users ({{
                  Math.round((progressDistribution.bracket1 / reportMetrics.totalUsers) * 100) || 0
                }}%)
              </span>
              need assistance with progress (0-25%)
            </li>
          </ul>
        </div>
        <div class="progress-buckets">
          <div class="bucket-bar">
            <div class="bucket low" :style="{ width: `${(progressDistribution.bracket1 / reportMetrics.totalUsers) * 100 || 0}%` }">
              <q-tooltip>Low Progress: 0-25%</q-tooltip>
            </div>
            <div class="bucket medium-low" :style="{ width: `${(progressDistribution.bracket2 / reportMetrics.totalUsers) * 100 || 0}%` }">
              <q-tooltip>Medium-Low Progress: 26-50%</q-tooltip>
            </div>
            <div class="bucket medium-high" :style="{ width: `${(progressDistribution.bracket3 / reportMetrics.totalUsers) * 100 || 0}%` }">
              <q-tooltip>Medium-High Progress: 51-75%</q-tooltip>
            </div>
            <div class="bucket high" :style="{ width: `${(progressDistribution.bracket4 / reportMetrics.totalUsers) * 100 || 0}%` }">
              <q-tooltip>High Progress: 76-100%</q-tooltip>
            </div>
          </div>

          <!-- Progress Bucket Legend -->
          <div class="row q-mt-sm">
            <div class="col-3">
              <div class="text-center">
                <div class="legend-dot low-dot q-mx-auto"></div>
                <div class="text-caption">0-25%</div>
              </div>
            </div>
            <div class="col-3">
              <div class="text-center">
                <div class="legend-dot medium-low-dot q-mx-auto"></div>
                <div class="text-caption">26-50%</div>
              </div>
            </div>
            <div class="col-3">
              <div class="text-center">
                <div class="legend-dot medium-high-dot q-mx-auto"></div>
                <div class="text-caption">51-75%</div>
              </div>
            </div>
            <div class="col-3">
              <div class="text-center">
                <div class="legend-dot high-dot q-mx-auto"></div>
                <div class="text-caption">76-100%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <InfoListItem :text="`Pass completion percentage for the assignment is set to ${reportMetrics.passPercentage}%`" />
  </AseCard>
</template>

<style lang="scss" scoped>
.bucket-bar {
  display: flex;
  height: 24px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;

  .bucket {
    height: 100%;

    &.low {
      background-color: $primary;
    }

    &.medium-low {
      background-color: $warning;
    }

    &.medium-high {
      background-color: $info;
    }

    &.high {
      background-color: $secondary;
    }
  }
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 4px;

  &.low-dot {
    background-color: $primary;
  }

  &.medium-low-dot {
    background-color: $warning;
  }

  &.medium-high-dot {
    background-color: $info;
  }

  &.high-dot {
    background-color: $secondary;
  }
}
</style>
