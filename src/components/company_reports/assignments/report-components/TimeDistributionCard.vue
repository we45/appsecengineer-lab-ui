<script setup>
import { defineProps, ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import { useQuasar } from 'quasar'

const props = defineProps({
  reportMetrics: {
    type: Object,
    required: true
  }
})

const $q = useQuasar()

const chartRef = ref(null)
let myChart = null

// Get actual activity data from props
const activityData = computed(() => {
  if (props.reportMetrics?.activity && Array.isArray(props.reportMetrics.activity)) {
    // Filter out invalid entries (missing date or activity)
    return props.reportMetrics.activity.filter(
      (item) => item && item.date && (typeof item.activity === 'number' || !isNaN(Number(item.activity)))
    )
  }
  return []
})

// Format date for display
function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'Invalid Date'
  }
}

// Initialize the chart
function initChart() {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')

  // Sort data by date
  const sortedData = [...activityData.value].sort((a, b) => new Date(a.date) - new Date(b.date))

  // Check if there's any activity
  const hasActivity = sortedData.some((data) => data.activity > 0)

  // Fill in missing days with zero values
  const filledData = []
  if (sortedData.length > 0) {
    const startDate = new Date(sortedData[0].date)
    const endDate = new Date(sortedData[sortedData.length - 1].date)

    // Handle case where there's only one day of data
    const maxDaysToShow = 30 // Maximum number of days to show if only one day exists
    if (startDate.getTime() === endDate.getTime()) {
      // If only one day, create a range around it (1 week before, 3 weeks after)
      const adjustedStartDate = new Date(startDate)
      adjustedStartDate.setDate(adjustedStartDate.getDate() - 7)

      const adjustedEndDate = new Date(startDate)
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 21)

      // Reset variables for the expanded range
      const dataMap = new Map()
      dataMap.set(new Date(startDate).toISOString().split('T')[0], sortedData[0].activity)

      const currentDate = new Date(adjustedStartDate)
      while (currentDate <= adjustedEndDate) {
        const dateKey = currentDate.toISOString().split('T')[0]
        filledData.push({
          date: new Date(currentDate),
          activity: dataMap.has(dateKey) ? dataMap.get(dateKey) : 0
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    } else {
      // Create a map of existing data
      const dataMap = new Map()
      sortedData.forEach((item) => {
        dataMap.set(new Date(item.date).toISOString().split('T')[0], item.activity)
      })

      // Loop through all days in range and fill missing days with zero
      const currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0]
        filledData.push({
          date: new Date(currentDate),
          activity: dataMap.has(dateKey) ? dataMap.get(dateKey) : 0
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
  } else {
    // If no data, show last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 29)

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      filledData.push({
        date: new Date(currentDate),
        activity: 0
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
  }

  const labels = filledData.map((data) => formatDate(data.date))
  const values = filledData.map((data) => data.activity)

  // Destroy existing chart if it exists
  if (myChart) {
    myChart.destroy()
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Daily Activity',
          data: values,
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          borderColor: 'rgba(25, 118, 210, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(25, 118, 210, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: function () {
              return $q.dark.isActive ? '#fff' : '#000'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: {
            weight: 'bold'
          },
          callbacks: {
            label: function (context) {
              return `Activity: ${context.parsed.y}`
            }
          }
        },
        title: {
          display: !hasActivity,
          text: hasActivity ? '' : 'No activity recorded for this period',
          position: 'center',
          font: {
            size: 16
          },
          color: function () {
            return $q.dark.isActive ? '#fff' : '#000'
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            },
            maxRotation: 45,
            minRotation: 45,
            color: function () {
              return $q.dark.isActive ? '#fff' : '#000'
            }
          }
        },
        y: {
          beginAtZero: true,
          border: {
            display: true,
            color: function () {
              return $q.dark.isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          ticks: {
            precision: 0,
            font: {
              size: 10
            },
            color: function () {
              return $q.dark.isActive ? '#fff' : '#000'
            }
          },
          grid: {
            display: true,
            color: function () {
              return $q.dark.isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          title: {
            display: true,
            text: 'Activity Count',
            font: {
              size: 12
            },
            color: function () {
              return $q.dark.isActive ? '#fff' : '#000'
            }
          }
        }
      }
    }
  })
}

// Watch for changes in activity data
watch(
  activityData,
  () => {
    initChart()
  },
  { deep: true }
)

// Initialize chart on component mount
onMounted(() => {
  initChart()
})
</script>

<template>
  <AseCard>
    <div class="avenir-bold q-mt-sm section_title">
      Activity Trend
      <q-icon name="trending_up" size="sm" color="primary" class="q-mr-xs" />
    </div>

    <div class="chart-container">
      <div v-if="!activityData.length" class="no-data-message">
        <q-icon name="info" size="md" />
        <div class="q-mt-sm">No activity data available yet</div>
        <div class="text-caption q-mt-xs">Activity will appear here as users engage with content</div>
      </div>
      <canvas v-else ref="chartRef" height="250"></canvas>
    </div>
  </AseCard>
</template>

<style lang="scss" scoped>
.enterprise-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  &.analytics-card {
    height: 350px;
    overflow: hidden;
  }
}

.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

.no-data-message {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
