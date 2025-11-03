<script setup>
import TeamReport from './TeamReport.vue'

import { useCompanyTeamsReports } from 'src/store/pinia/companyReports/teams'

import { useQuasar } from 'quasar'
import { downloadCSV } from 'src/utils/reuseFunctions'

const columns = [
  {
    name: 'name',
    label: 'Teams',
    align: 'left',
    field: 'team_name'
  },
  {
    name: 'time_spent',
    label: 'time spent',
    align: 'left',
    field: 'timeSpent'
  },
  {
    name: 'details',
    label: 'Details',
    align: 'right'
  }
]

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const companyTeamsReport = useCompanyTeamsReports()
const $q = useQuasar()

const exportCsv = () => {
  const cols = [...columns]
  cols.splice(cols.length - 1, 1)

  downloadCSV(cols, companyTeamsReport.teams, 'Team achievements')
}
</script>

<template>
  <AseCard
    :style="{
      height: loading ? 'auto' : '65vh'
    }"
  >
    <div class="row item-center justify-between">
      <p class="avenir-bold q-mt-sm section_title">Teams achievements</p>

      <q-btn class="q-py-xs q-px-sm" flat color="primary" :disable="loading" @click="exportCsv">
        <q-icon name="fas fa-file-csv" size="xs" />
      </q-btn>
    </div>
    <AseTable
      :isLoading="loading"
      :rows="companyTeamsReport.teams"
      :columns="columns"
      :hide-bottom="Boolean(companyTeamsReport.teams.length)"
      emptyLabel="No teams"
      row-key="team_name"
      :style="{
        maxHeight: '90%'
      }"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'details'">
              <div
                class="cursor-pointer"
                style="user-select: none"
                :class="[$q.dark.isActive ? 'text-secondary' : 'text-electric-indigo']"
                @click="props?.onToggleExpand?.()"
              >
                <span class="avenir-bold">Detailed view</span>
                <q-icon
                  :name="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  :class="[$q.dark.isActive ? 'text-secondary' : 'text-electric-indigo']"
                  size="sm"
                />
              </div>
            </template>

            <template v-else-if="col.name === 'name'">
              <span class="avenir-bold">{{ col.value }}</span>
            </template>

            <template v-else-if="col.name === 'time_spent'">
              <div class="row items-center justify-start full-width no-wrap">
                <span class="avenir-bold">{{ props.row.timeSpent }}</span>
              </div>
            </template>

            <template v-else>
              {{ col.value ?? '--' }}
            </template>
          </q-td>
        </q-tr>

        <q-tr v-if="props.expand" :props="props">
          <q-td
            colspan="100%"
            class="q-pa-none"
            :style="{
              backgroundColor: 'var(--color-bg-surface)'
            }"
          >
            <TeamReport :team_id="props.row.sk" />
          </q-td>
        </q-tr>
      </template>
    </AseTable>
  </AseCard>
</template>

<style lang="scss">
.bordered-avatar {
  .q-avatar__content {
    border: 1px solid #03034740;
  }
}
</style>

<!-- <style scoped lang="scss">
.time-spent-chip {
  background: #00da9f21;
  width: 57px;
  height: 22px;
  padding: 1px 7px 1px 7px;
  border-radius: 100px;
  color: #02cd96;
  font-size: 12px;
  gap: 2px;
  &.negative {
    background: #ff5e6233 !important;
  }
}
</style> -->
