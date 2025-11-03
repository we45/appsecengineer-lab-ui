<template>
  <div class="full-width">
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">Skill Reports</div>
    <div class="row q-col-gutter-md full-width">
      <div class="col-md-12 col-sm-12 full-width">
        <PieGraph
          :categories="skillChartData.labels"
          :data="skillChartData.data"
          :chartWidth="700"
          yTooltipTitle="Completed:"
          :customTooltip="customTooltipHandler"
        />
        <!-- <BubbleGraph :data="reportsStore.skills" :chartHeight="350" /> -->
      </div>
    </div>
    <q-inner-loading :showing="loading" label="Loading Leaderboard Stats ..." label-class="text-teal" label-style="font-size: 1.1em" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import PieGraph from 'src/components/charts/PieGraph.vue'
import BubbleGraph from 'src/components/charts/BubbleGraph.vue'
const reportsStore = useReportsStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await reportsStore.fetchSkills()
  loading.value = false
})
function customTooltipHandler({ series, seriesIndex, dataPointIndex, w }) {
  let skillsHtml = ''
  for (const skill of reportsStore?.skills[seriesIndex]?.skills ?? []) {
    skillsHtml += `<div class="skill">${skill} </div>`
  }

  // Implement your custom tooltip logic here
  // The "series" argument contains the data for the hovered data point
  // You can create a custom tooltip content and return it as a string

  // Example: Display the data series as tooltip content
  // return '<div>' + series + '</div>'
  const tooltipContent = `
    <div class="pie-tooltip">
      <div style="font-weight: 600; font-size: 18px">Skills </div>
        <div class="skills" style="font-weight: 400; font-size: 15px">${skillsHtml}</div>
    </div>
  `

  return tooltipContent
}
const skillChartData = computed(() => {
  return {
    labels: reportsStore.skills.map((ele) => ele.name + `(${ele.completed})`),
    data: reportsStore.skills?.map((ele) => ele.completed),
    skills: reportsStore?.skills?.map((ele) => ele.skills) ?? []
  }
})
</script>

<style>
.pie-tooltip {
  background-color: white;
  padding: 20px;
  color: black;
}
</style>
