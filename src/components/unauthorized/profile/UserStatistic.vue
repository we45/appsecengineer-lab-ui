<template>
  <div class="bg-night-blue row q-mt-lg q-mx-md" style="border-radius: 10px">
    <div v-for="statistic in userStatistic" class="col-12 col-sm-6 col-md-4 col-lg-3" :key="statistic.id">
      <div class="q-ma-sm q-pa-md statistic" style="border-radius: 10px">
        <p
          class="q-mb-none font-paytone basic-drop-shadow text-secondary"
          :class="{ '': !$q.dark.isActive }"
          :style="{
            fontSize: '28px'
          }"
        >
          {{ overview[statistic.name] ?? statistic.value }}
        </p>
        <p
          class="q-mb-none q-mt-xs text-white"
          :style="{
            fontSize: '14px'
          }"
        >
          {{ statistic.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  overview: { type: Object, required: true, default: () => {} }
})

const userStatistic = ref([
  { id: 1, name: 'percentile', label: 'Leaderboard Position' },
  { id: 2, name: 'num_of_labs_done', label: 'Labs Completed', value: '0' },
  { id: 3, name: 'num_of_challenges_solved', label: 'Challenges Solved', value: '' },
  { id: 4, name: 'num_of_badges', label: 'Badges Earned', value: '0' }
])
</script>

<style scoped lang="scss">
.statistic {
  background: $bg-dark;
  transition: all 0.3s ease-in-out;
}
</style>
