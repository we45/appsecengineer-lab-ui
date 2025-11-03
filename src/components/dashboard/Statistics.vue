<template>
  <BaseCard class="q-py-xs" flat role="region" aria-labelledby="dashboard-stats-title">
    <h2 id="dashboard-stats-title" class="sr-only">Dashboard Statistics</h2>
    <div role="group" aria-label="Dashboard statistics overview">
      <q-card-section
        v-for="(stat, index) in dashboardStore.dashboardStats"
        :key="index"
        class="stats q-ma-md q-py-sm q-px-lg"
        :class="{ active: index === 0 }"
        role="article"
        :aria-label="`${stat.title}: ${stat.count}`"
      >
        <div class="text-left">
          <div class="text-subtitle1">{{ stat.count }}</div>
          <div class="text-subtitle1">{{ stat.title }}</div>
        </div>
      </q-card-section>
    </div>
  </BaseCard>
</template>

<script setup>
import { useDashboardStore } from 'src/store/pinia/dashboard'

const dashboardStore = useDashboardStore()

bootStatistics()

async function bootStatistics() {
  if (dashboardStore.dashboardStatistics.length) return
  await dashboardStore.fetchDashboardStatistics({})
}
</script>
