<template>
  <div>
    <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade q-my-md">User Leaderboard</div>

    <!-- <div class="text-subtitle1 text-weight-medium ase-roboto ase-black-shade">Proficiency</div> -->
    <!-- <div class="row q-col-gutter-md">
      <div class="col-12">
        <BaseTable
          :columns="columns"
          :rows="Leaderboards"
          row-key="name"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          bordered
          :rows-per-page-options="[0]"
          :pagination="{
            rowsPerPage: 0
          }"
          hide-bottom=""
          virtual-scroll
          class="leaderboard-table"
        >
          <template #body-cell-activity_count="props">
            <q-td>
              <div class="text-h6 text-weight-bold text-indigo-9 cursor-pointer">
                {{ +props.row.lab_count + +props.row.video_count + +props.row.media_count + +props.row.quiz_count }}
                <q-icon name="pie_chart" color="green" />
              </div>
              <q-tooltip
                anchor="center end"
                class="bg-white q-pa-lg shadow-1 text-primary z-fab"
                max-width="30rem"
                self="center start"
                v-if="props.row.lab_count"
              >
                <PieGraph
                  :categories="getCategories(props.row).label"
                  :data="getCategories(props.row).data"
                  :test="getCategories(props.row)"
                  v-if="props.row.lab_count"
                  :customColors="['#4FA0E1', '#58D8A5', '#EC8937', '#6900FF']"
                />
              </q-tooltip>
            </q-td>
          </template>
        </BaseTable>
      </div>
    </div> -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <BaseTable
          :columns="columns"
          :rows="Leaderboards"
          row-key="name"
          :rows-per-page-options="[0]"
          :pagination="{
            rowsPerPage: 0
          }"
          hide-bottom=""
          virtual-scroll
          style="max-height: 400px"
        >
          <template #body-cell-activity_count="props">
            <q-td>
              <div class="text-h6 text-weight-bold cursor-pointer" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">
                {{ +props.row.lab_count + +props.row.video_count + +props.row.media_count + +props.row.quiz_count }}
                <q-icon name="pie_chart" color="green" />
              </div>
              <q-tooltip
                anchor="center end"
                class="bg-white q-pa-lg shadow-1 text-primary z-fab"
                max-width="30rem"
                self="center start"
                v-if="props.row.lab_count"
              >
                <PieGraph
                  :categories="getCategories(props.row).label"
                  :data="getCategories(props.row).data"
                  :test="getCategories(props.row)"
                  v-if="props.row.lab_count"
                  :customColors="['#4FA0E1', '#58D8A5', '#EC8937', '#6900FF']"
                />
              </q-tooltip>
            </q-td>
          </template>
        </BaseTable>
      </div>
    </div>

    <q-inner-loading :showing="loading" label="Loading Leaderboard Stats ..." label-class="text-teal" label-style="font-size: 1.1em" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useReportsStore } from 'src/store/pinia/reports/reports'
import PieGraph from '../charts/PieGraph.vue'

// "first_name": "Chandra", "last_name": "Shekar", "activity_count": 356, "email": "chandrashekar@we45.com"

const columns = [
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'left'
  },
  {
    name: 'first_name',
    field: 'first_name',
    label: 'First Name',
    align: 'left'
  },
  {
    name: 'last_name',
    field: 'last_name',
    label: 'Last Name',
    align: 'left'
  },
  {
    name: 'activity_count',
    field: 'activity_count',
    label: 'Activity count',
    align: 'left'
  }
]

const reportsStore = useReportsStore()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await reportsStore.leaderboardStats()
  loading.value = false
})

const Leaderboards = computed(() => {
  return reportsStore.leaderboards
})

function getCategories(item) {
  return {
    label: [`Video (${item.video_count})`, `Media (${item.media_count})`, `Lab (${item.lab_count})`, `Quiz (${item.quiz_count})`],
    data: [item.video_count, item.media_count, item.lab_count, item.quiz_count]
  }
}
</script>

<style lang="sass">
.leaderboard-table
  /* height or max-height is important */
  height: 400px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    // background-color: $primary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
    background: white

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
