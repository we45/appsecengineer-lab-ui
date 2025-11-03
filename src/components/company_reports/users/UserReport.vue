<script setup>
import { ref, onMounted, computed } from 'vue'

import AssignmentTournaments from 'src/components/company_reports/common/AssignmentTournaments.vue'
import Statistics from 'src/components/company_reports/common/Statistics.vue'
import RecentActivities from 'src/components/company_reports/common/RecentActivities.vue'
import SimpleHeatMap from 'components/echarts-latest/SimpleHeatMap.vue'

import { useCompanyUserReports } from 'src/store/pinia/companyReports/user'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
import { useRouter } from 'vue-router'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useScreenSize } from 'src/composables/useScreenSize'

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  }
})

const ACTIVE = 'active'
const COMPLETED = 'completed'

const companyUserReportStore = useCompanyUserReports()
const analyticsStore = useAnalyticsStatsStore()
const { isDesktop } = useScreenSize()
const router = useRouter()

const courseStatus = ref(ACTIVE)
const assignmentStatus = ref(ACTIVE)
const isLoadingCourses = ref(false)
const isFetchingActivity = ref(false)
const recentActivities = ref([])

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

const stats = ref([])

const courseStatusTabs = computed(() => [
  {
    label: 'Active courses',
    name: ACTIVE,
    disable: courses.value.active.length === 0,
    disableMessage: `${isLoadingCourses.value ? 'Loading' : 'No'} active courses`
  },
  {
    label: 'Completed courses',
    name: COMPLETED,
    disable: courses.value.completed.length === 0,
    disableMessage: `${isLoadingCourses.value ? 'Loading' : 'No'} completed courses`
  }
])

const assignmentStatusTabs = computed(() => [
  {
    label: 'Active assignments',
    name: ACTIVE,
    disable: assignments.value.active.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} active assignments`
  },
  {
    label: 'Completed assignments',
    name: COMPLETED,
    disable: assignments.value.completed.length === 0,
    disableMessage: `${isFetchingActivity.value ? 'Loading' : 'No'} completed assignments`
  }
])

onMounted(() => {
  fetchUserReport()
  loadCourses()
  loadRecentActivities()
})

async function fetchUserReport() {
  isFetchingActivity.value = true
  const data = await companyUserReportStore.fetchUserStats(props.email)
  stats.value = data.stats
  activityData.value.activity.data = data.activity
  activityData.value.activity.dateRange = data.dateRange
  activityData.value.activity.max = data.max
  activityData.value.activity.min = data.min
  isFetchingActivity.value = false
}

async function loadCourses() {
  isLoadingCourses.value = true

  const activeRes = companyUserReportStore.fetchUserActiveCourses(props.email)
  const completedRes = companyUserReportStore.fetchUserCompletedCourses(props.email)

  const res = await Promise.all([activeRes, completedRes])

  courses.value = {
    active: res[0].courses,
    completed: res[1].courses
  }

  assignments.value = {
    active: res[0].assignments,
    completed: res[1].assignments
  }

  isLoadingCourses.value = false
}

async function loadRecentActivities() {
  recentActivities.value = await useCompanyConsumerStore().recentActivities({ user_id: props.email })
}

function handleAssignmentRowClick(_, row) {
  router.push(`/portal/company/assignments/report/${urlSafeBase64Encode(row.sk)}}`)
}
</script>

<template>
  <div class="row q-py-sm">
    <div class="col-12">
      <p class="avenir-bold q-mt-sm q-mb-sm section_title">{{ firstName ? firstName + `'s` : '' }} Daily Activity</p>

      <SimpleHeatMap
        :idOfHeatMap="email"
        :heatmap_data_values_list="activityData.activity.data"
        :loading="isFetchingActivity"
        :dark_mode_colors="analyticsStore.dateUserProgressStats.gitColorsUpdated"
        :dates-range="activityData.activity.dateRange ?? null"
        :heatmap_max="activityData.activity.max"
        :heatmap_min="activityData.activity.min"
      />
    </div>
    <div class="col-12 row">
      <div class="col-12 col-md-grow q-mt-md q-pr-md">
        <div class="full-width row items-center justify-between">
          <p class="avenir-bold q-mt-sm q-mb-sm section_title">{{ firstName ? firstName + `'s` : '' }} Courses</p>
          <AseTabs :modelValue="courseStatus" style="height: 36px" :tabs="courseStatusTabs" @update:modelValue="courseStatus = $event" />
        </div>
        <AseTabPanels class="q-mt-xs" :modelValue="courseStatus" :tabs="courseStatusTabs">
          <template #ase_tab_active>
            <AssignmentTournaments
              title-field="event_name"
              emptyLabel="No active courses"
              :isLoading="isLoadingCourses"
              :rows="courses.active"
              :hasAssignments="false"
              :hasChallenges="false"
            />
          </template>
          <template #ase_tab_completed>
            <AssignmentTournaments
              title-field="event_name"
              emptyLabel="No completed courses"
              :isLoading="isLoadingCourses"
              :rows="courses.completed"
              :hasAssignments="false"
              :hasChallenges="false"
            />
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
          <Statistics :loading="isFetchingActivity" :title="firstName ? `${firstName}'s stats` : 'stats'" :data="stats" />
        </div>
      </div>
    </div>

    <div class="col-12 row">
      <div class="col-12 col-md-grow q-mt-md q-pr-md">
        <div class="full-width row items-center justify-between">
          <p class="avenir-bold q-mt-sm q-mb-sm section_title">{{ firstName }}'s Assignments</p>
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
              :isLoading="isLoadingCourses"
              :rows="assignments.active"
              :hasCourses="false"
              :hasChallenges="false"
              :hide-bottom="false"
              @row-click="handleAssignmentRowClick"
            />
          </template>
          <template #ase_tab_completed>
            <AssignmentTournaments
              title-field="name"
              emptyLabel="No completed assignments"
              :isLoading="isLoadingCourses"
              :rows="assignments.completed"
              :hasCourses="false"
              :hasChallenges="false"
              :hide-bottom="false"
              @row-click="handleAssignmentRowClick"
            />
          </template>
        </AseTabPanels>
      </div>

      <div class="col-12 col-md-4 q-mt-md q-mt-xs" :style="{ maxWidth: isDesktop ? '270px' : '100%' }">
        <RecentActivities :activities="recentActivities" />
      </div>
    </div>
  </div>
</template>
