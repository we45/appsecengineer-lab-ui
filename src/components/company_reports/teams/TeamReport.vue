<script setup>
import { ref, onMounted, computed } from 'vue'

import AssignmentTournaments from 'src/components/company_reports/common/AssignmentTournaments.vue'
import Statistics from 'src/components/company_reports/common/Statistics.vue'
import RecentActivities from 'src/components/company_reports/common/RecentActivities.vue'
import SimpleHeatMap from 'components/echarts-latest/SimpleHeatMap.vue'

import { useCompanyTeamsReports } from 'src/store/pinia/companyReports/teams'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'

import { useRouter } from 'vue-router'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useScreenSize } from 'src/composables/useScreenSize'

const ACTIVE = 'active'
const COMPLETED = 'completed'

const props = defineProps({
  team_id: {
    type: String,
    required: true
  }
})

const router = useRouter()

const companyTeams = useCompanyTeamsReports()
const analyticsStore = useAnalyticsStatsStore()
const { isDesktop } = useScreenSize()
const courseStatus = ref(ACTIVE)
const assignmentStatus = ref(ACTIVE)
const isFetchingActivity = ref(false)
const stats = ref([
  {
    title: 'Completed challenges',
    value: 0
  },
  {
    title: 'Completed labs',
    value: 0
  },
  {
    title: 'Completed assignments',
    value: 0
  }
])

const activityData = ref({
  labels: [],
  activity: {
    label: 'Activity',
    data: [],
    bgColor: '#6600FF',
    dateRange: [],
    max: 0,
    min: 0
  }
})

const courses = ref({
  active: [],
  completed: []
})

const assignments = ref({
  active: [],
  completed: []
})

const recentActivities = ref([])

const courseStatusTabs = computed(() => [
  {
    label: 'Active courses',
    name: ACTIVE,
    disable: courses.value.active?.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} active courses`
  },
  {
    label: 'Completed courses',
    name: COMPLETED,
    disable: courses.value.completed?.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} completed courses`
  }
])

const assignmentStatusTabs = computed(() => [
  {
    label: 'Active assignments',
    name: ACTIVE,
    disable: assignments.value.active?.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} active assignments`
  },
  {
    label: 'Completed assignments',
    name: COMPLETED,
    disable: assignments.value.completed?.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} completed assignments`
  }
])

onMounted(() => {
  fetchTeamsReport()
})

async function fetchTeamsReport() {
  isFetchingActivity.value = true
  const data = await companyTeams.fetchTeamsActivity(props.team_id)

  activityData.value.activity.dateRange = data?.activity?.dateRange
  activityData.value.activity.data = data?.activity?.data
  activityData.value.activity.max = data?.activity?.max
  activityData.value.activity.min = data?.activity?.min

  stats.value[0].value = data?.challenges_completed
  stats.value[1].value = data?.labs_completed
  stats.value[2].value = data?.assignments_completed

  data.courses?.forEach((course) => {
    if (course.progress === 100) {
      courses.value.completed.push(course)
    } else {
      courses.value.active.push(course)
    }
  })

  recentActivities.value = data.activities

  assignments.value.active = data.assignments
  assignments.value.completed = data.completedAssignments

  isFetchingActivity.value = false
}

function handleAssignmentRowClick(_, row) {
  router.push(`/portal/company/assignments/report/${urlSafeBase64Encode(row.sk)}}`)
}
</script>

<template>
  <div class="row q-py-sm">
    <div class="col-12">
      <p class="avenir-bold q-mt-sm q-mb-sm section_title">Daily Activity</p>

      <SimpleHeatMap
        :idOfHeatMap="team_id"
        :heatmap_data_values_list="activityData.activity.data"
        :loading="isFetchingActivity"
        :dark_mode_colors="analyticsStore.dateUserProgressStats.gitColorsUpdated"
        :dates-range="activityData.activity.dateRange ?? null"
        :heatmap_max="activityData.activity.max"
        :heatmap_min="activityData.activity.min"
      />
    </div>
    <div class="col-12 row">
      <div class="col-12 col-md-grow q-mt-md" :class="{ 'q-pr-md': isDesktop }">
        <div class="full-width row items-center justify-between">
          <p class="avenir-bold q-mt-sm q-mb-sm section_title">Courses</p>
          <AseTabs :modelValue="courseStatus" style="height: 36px" :tabs="courseStatusTabs" @update:modelValue="courseStatus = $event" />
        </div>
        <AseTabPanels :modelValue="courseStatus" :tabs="courseStatusTabs">
          <template #ase_tab_active>
            <AssignmentTournaments
              title-field="course"
              emptyLabel="No active courses"
              :isLoading="isFetchingActivity"
              :rows="courses.active"
              :hasAssignments="false"
              :hasChallenges="false"
              :hide-bottom="false"
            />
          </template>
          <template #ase_tab_completed>
            <AssignmentTournaments
              title-field="course"
              emptyLabel="No completed courses"
              :isLoading="isFetchingActivity"
              :rows="courses.completed"
              :hasAssignments="false"
              :hasChallenges="false"
              :hide-bottom="false"
            />
          </template>
        </AseTabPanels>
      </div>
      <div class="q-mt-xs">
        <div class="col-12 col-md-4 q-mt-md" :style="{ maxWidth: isDesktop ? '270px' : '100%', minWidth: '270px' }">
          <Statistics title="Team stats" :loading="isFetchingActivity" :data="stats" />
        </div>
      </div>
    </div>
    <div class="col-12 row">
      <div class="col-12 col-md-grow q-mt-md" :class="{ 'q-pr-md': isDesktop }">
        <div class="full-width row items-center justify-between">
          <p class="avenir-bold q-mt-sm q-mb-sm section_title">Assignments</p>
          <AseTabs
            :modelValue="assignmentStatus"
            style="height: 36px"
            :tabs="assignmentStatusTabs"
            @update:modelValue="assignmentStatus = $event"
          />
        </div>
        <AseTabPanels :modelValue="assignmentStatus" :tabs="assignmentStatusTabs">
          <template #ase_tab_active>
            <AssignmentTournaments
              title-field="name"
              emptyLabel="No active assignments"
              :isLoading="isFetchingActivity"
              :rows="assignments.active"
              :hasCourses="false"
              :hasChallenges="false"
              :hide-bottom="false"
              @row-click="handleAssignmentRowClick"
              noTimeSpent
            >
              <template #expanded_area="{ data }">
                <q-td
                  v-for="user in data.users"
                  :key="user"
                  colspan="100%"
                  class="q-pa-none"
                  style="background-color: var(--color-bg-page)"
                >
                  {{ user }}
                </q-td>
              </template>
            </AssignmentTournaments>
          </template>

          <template #ase_tab_completed>
            <AssignmentTournaments
              title-field="name"
              emptyLabel="No completed assignments"
              expandable
              :isLoading="isFetchingActivity"
              :rows="assignments.completed"
              :hasCourses="false"
              :hasChallenges="false"
              :hide-bottom="false"
              @row-click="handleAssignmentRowClick"
              noTimeSpent
            >
              <template #expanded_area="{ data }">
                <q-td
                  v-for="user in data.users"
                  :key="user"
                  colspan="100%"
                  class="q-pa-none"
                  style="background-color: var(--color-bg-page)"
                >
                  {{ user }}
                </q-td>
              </template>
            </AssignmentTournaments>
          </template>
        </AseTabPanels>
      </div>
      <div class="q-mt-xs">
        <div
          class="col-12 col-md-4 q-mt-md"
          :style="{
            maxWidth: isDesktop ? '270px' : '100%',
            minWidth: '270px'
          }"
        >
          <RecentActivities :activities="recentActivities" />
        </div>
      </div>
    </div>
  </div>
</template>
