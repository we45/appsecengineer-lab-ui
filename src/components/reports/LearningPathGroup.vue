<template>
  <div>
    <AseBarLineChart
      id="learning-path-report"
      title="Learning path Reports"
      yAxesTitle="Minutes"
      flat
      :label="learningPaths.labels ?? []"
      :data="learningPaths?.data ?? []"
      :yStepSize="700"
      :height="335"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'

const reportsStore = useReportsStore()
const loading = ref(false)

const combinedReports = ref([])

onMounted(async () => {
  loading.value = true
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
  loading.value = false
})

const learningPaths = computed(() => {
  return {
    labels: combinedReports.value.map((ele) => ele.learning_path_name),
    data: [
      {
        label: 'Lab duration',
        data: combinedReports.value.map((ele) => ele.lab_duration ?? 0),
        backgroundColor: '#FF5E62'
      },
      {
        label: 'Video duration',
        data: combinedReports.value.map((ele) => ele.vid_duration ?? 0),
        backgroundColor: '#FF5E62'
      }
    ]
  }
})
</script>
