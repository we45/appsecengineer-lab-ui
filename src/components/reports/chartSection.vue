<template>
  <div class="row q-gutter-y-lg">
    <div class="col-12">
      <AseBarLineChart
        id="minutes-report"
        title="Course, video and lab minutes report"
        chartType="line"
        showLegend
        yAxesTitle="Minutes"
        flat
        :labels="toggleMonthly ? monthlyStats.labels : weeklyStats.labels"
        :data="toggleMonthly ? monthlyStats.data : weeklyStats.data"
        :yStepSize="700"
        :height="335"
        :loading="loading"
      >
        <template #tools>
          <div class="row items-center no-wrap text-black">
            <q-toggle
              label="Weekly"
              :left-label="true"
              color="primary"
              class="quasar__toggle"
              keep-color
              v-model="toggleMonthly"
              val="blue"
            />
            <span>Monthly</span>
          </div>
        </template>
      </AseBarLineChart>
    </div>

    <div class="row col-12">
      <AseBarLineChart
        id="minutes-report"
        title="Learning path reports"
        chartType="bar"
        showLegend
        yAxesTitle="Minutes"
        flat
        :labels="learningPaths.labels"
        :data="learningPaths.data"
        :yStepSize="700"
        :height="335"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { shallowRef, ref, computed, onMounted } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'

const props = defineProps({
  monthlyStats: {
    required: false,
    type: Object
  },
  weeklyStats: {
    required: false,
    type: Object
  },
  loadingIconData: {
    required: false,
    type: Boolean,
    default: false
  },
  topCourses: {
    required: false,
    type: Object
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const reportsStore = useReportsStore()

const toggleMonthly = shallowRef(true)
const isLoading = shallowRef(false)
const combinedReports = ref([])

onMounted(async () => {
  isLoading.value = true
  await reportsStore.fetchLearningPath()

  const details = reportsStore.learningPathReports

  const combinedArray = []

  details?.lab_duration?.forEach((labDetail) => {
    combinedArray.push({
      ...labDetail
    })
  })

  details?.vid_duration?.forEach((videoDetail) => {
    const existItem = combinedArray.find((detail) => detail?.lpId === videoDetail?.lpId)
    if (existItem) {
      existItem.vid_duration = videoDetail?.vid_duration ?? 0
    } else {
      combinedArray.push({
        ...videoDetail,
        vid_duration: 0
      })
    }
  })

  combinedReports.value = combinedArray ?? []
  isLoading.value = false
})

const learningPaths = computed(() => {
  return {
    labels: combinedReports.value.map((ele) => ele.learning_path_name),
    data: [
      {
        label: 'Lab duration',
        data: combinedReports.value.map((ele) => ele.lab_duration ?? 0),
        bgColor: '#6600FF'
      },
      {
        label: 'Video duration',
        data: combinedReports.value.map((ele) => ele.vid_duration ?? 0),
        bgColor: '#00DA9F'
      }
    ]
  }
})
</script>
