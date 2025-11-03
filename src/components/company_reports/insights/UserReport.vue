<script setup>
import { ref, computed, watch, nextTick } from 'vue'

import AssignmentTournaments from 'src/components/company_reports/common/AssignmentTournaments.vue'
import Statistics from 'src/components/company_reports/common/Statistics.vue'
import RecentActivities from 'src/components/company_reports/common/RecentActivities.vue'
import SimpleHeatMap from 'components/echarts-latest/SimpleHeatMap.vue'
import { getDateRangeOneYearAgo } from 'src/utils/dateHelper'

const props = defineProps({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  userData: {
    type: Object,
    default: () => ({})
  }
})

const ACTIVE = 'active'
const COMPLETED = 'completed'

const userDailyActivityData = computed(() => {
  const defaultDateRange = getDateRangeOneYearAgo()
  return {
    data: activityData.value.activity.data || [],
    dateRange: activityData.value.activity.dateRange || defaultDateRange,
    max: Math.max(activityData.value.activity.max || 1, 1),
    min: activityData.value.activity.min || 0
  }
})

const courseStatus = ref(ACTIVE)
const assignmentStatus = ref(ACTIVE)
const isLoadingCourses = ref(false)
const isFetchingActivity = ref(false)

const activityData = ref({
  activity: {
    data: [],
    dateRange: getDateRangeOneYearAgo(),
    max: 1,
    min: 0
  }
})

const courses = computed(() => {
  if (!props.userData?.course_progress) {
    return { active: [], completed: [] }
  }

  const active = []
  const completed = []

  props.userData.course_progress.forEach((course) => {
    const courseItem = {
      event_name: course.course_name || 'Unknown Course',
      progress: course.progress || 0,
      status: course.is_completed ? 'completed' : 'active',
      timeSpent: (course.time_spent_minutes ?? 0) * 60,

      time_spent_hours: course.time_spent_hours || 0
    }

    if (course.is_completed) {
      completed.push(courseItem)
    } else {
      active.push(courseItem)
    }
  })

  return { active, completed }
})

const assignments = computed(() => {
  if (!props.userData?.assignment_progress) {
    return { active: [], completed: [] }
  }

  const active = []
  const completed = []

  props.userData.assignment_progress.forEach((assignment) => {
    const assignmentItem = {
      assignment_id: assignment.assignment_id,
      name: assignment.assignment_name || '',
      progress: assignment.progress || 0,
      status: assignment.is_completed ? 'completed' : 'active',
      timeSpent: (assignment.time_spent_minutes ?? 0) * 60,
      challenges_completed: assignment.challenges_completed || 0,
      total_challenges: assignment.total_challenges || 0,
      challenges_ratio: assignment.challenges_ratio || '0/0'
    }

    if (assignment.is_completed) {
      completed.push(assignmentItem)
    } else {
      active.push(assignmentItem)
    }
  })

  return { active, completed }
})

const stats = computed(() => {
  const userData = props.userData || {}

  return [
    {
      title: 'Total Score',
      value: userData.completion_rate ? `${userData.completion_rate}%` : '0%'
    },
    {
      title: 'Courses Completed',
      value: userData.completed_courses ? userData.completed_courses.toString() : '0'
    },
    {
      title: 'Assignments Done',
      value: userData.assignment_progress?.filter((a) => a.is_completed).length?.toString() || '0'
    }
  ]
})

const recentActivities = computed(() => {
  if (!props.userData?.recent_activities) {
    return []
  }

  return props.userData.recent_activities
    .map((activity) => {
      const timestamp = activity.timestamp ? new Date(activity.timestamp) : new Date()
      const now = new Date()
      const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInHours / 24)
      const diffInWeeks = Math.floor(diffInDays / 7)

      let timeAgo = ''
      if (diffInHours < 24) {
        timeAgo = `${diffInHours}h ago`
      } else if (diffInDays < 7) {
        timeAgo = `${diffInDays}d ago`
      } else {
        timeAgo = `${diffInWeeks}w ago`
      }

      // Map activity_type to the expected types for icons
      let mappedType = 'event'
      let actionText = 'Activity'

      if (activity.activity_type === 'enrolled') {
        mappedType = 'event'
        actionText = 'Enrolled'
      } else if (activity.activity_type === 'completed_video') {
        mappedType = 'vid'
        actionText = 'Completed'
      } else if (activity.activity_type === 'completed_lab') {
        mappedType = 'lab'
        actionText = 'Completed'
      } else if (activity.activity_type === 'assignment') {
        mappedType = 'assignment'
        actionText = 'Assignment'
      }

      return {
        type: mappedType,
        action: actionText,
        name: activity.course_name || '',
        date: timeAgo,
        timestamp: activity.timestamp
      }
    })
    .slice(0, 5)
})

const processDailyActivity = () => {
  if (!props.userData?.daily_activity || !Array.isArray(props.userData.daily_activity)) {
    return
  }

  const activityMap = new Map()
  props.userData.daily_activity.forEach((day) => {
    if (day.date && typeof day.activity_count === 'number') {
      activityMap.set(day.date, day.activity_count)
    }
  })

  const dateRange = getDateRangeOneYearAgo()
  const startDate = new Date(dateRange[0])
  const endDate = new Date(dateRange[1])

  const activityDataArray = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const activityCount = activityMap.get(dateStr) || 0
    activityDataArray.push([dateStr, activityCount])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const activityValues = activityDataArray.map((item) => item[1])
  const maxActivity = Math.max(...activityValues, 1)
  const minActivity = Math.min(...activityValues)

  activityData.value.activity = {
    data: activityDataArray,
    dateRange: dateRange,
    max: maxActivity,
    min: minActivity
  }
}

watch(
  () => props.userData,
  async () => {
    await nextTick()
    processDailyActivity()
  },
  { immediate: true, deep: true }
)

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

function handleAssignmentRowClick(_, row) {
  // Handle assignment row click
}
</script>

<template>
  <div class="row q-py-sm">
    <div class="col-12">
      <p class="avenir-bold q-mt-sm q-mb-sm" style="font-size: 1rem !important">{{ firstName ? firstName + `'s` : '' }} Daily Activity</p>
      <SimpleHeatMap
        :idOfHeatMap="email"
        :heatmap_data_values_list="userDailyActivityData.data"
        :loading="isFetchingActivity"
        :dates-range="userDailyActivityData.dateRange"
        :heatmap_max="userDailyActivityData.max"
        :heatmap_min="userDailyActivityData.min"
      />
    </div>

    <div class="col-12 q-mt-md col-grow">
      <div class="full-width row items-center justify-between">
        <p class="avenir-bold q-mt-sm q-mb-sm" style="font-size: 1rem !important">{{ firstName ? firstName + `'s` : '' }} Courses</p>
        <AseTabs :modelValue="courseStatus" style="height: 36px" :tabs="courseStatusTabs" @update:modelValue="courseStatus = $event" />
      </div>
      <div class="q-mt-xs">
        <AseTabPanels v-model="courseStatus" :tabs="courseStatusTabs">
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
    </div>

    <div
      class="col-7 q-mt-md q-pr-md"
      :style="{
        maxWidth: isDesktop ? '270px' : '100%',
        minWidth: '270px'
      }"
    >
      <Statistics :loading="isFetchingActivity" :title="firstName ? `${firstName}'s stats` : 'stats'" :data="stats" />
    </div>

    <div class="col-5 q-mt-md">
      <RecentActivities :activities="recentActivities" />
    </div>

    <div class="col-12 q-mt-md col-grow">
      <div class="full-width row items-center justify-between">
        <p class="avenir-bold q-mt-sm q-mb-sm" style="font-size: 1rem !important">{{ firstName }}'s Assignments</p>
        <AseTabs
          :modelValue="assignmentStatus"
          style="height: 36px"
          :tabs="assignmentStatusTabs"
          @update:modelValue="assignmentStatus = $event"
        />
      </div>
      <div class="q-mt-xs">
        <AssignmentTournaments
          v-show="assignmentStatus === ACTIVE"
          title-field="name"
          emptyLabel="No active assignments"
          :isLoading="isLoadingCourses"
          :rows="assignments.active"
          :hasCourses="false"
          :hasChallenges="false"
          :hide-bottom="false"
          @row-click="handleAssignmentRowClick"
        />
        <AssignmentTournaments
          v-show="assignmentStatus === COMPLETED"
          title-field="name"
          emptyLabel="No completed assignments"
          :isLoading="isLoadingCourses"
          :rows="assignments.completed"
          :hasCourses="false"
          :hasChallenges="false"
          :hide-bottom="false"
          @row-click="handleAssignmentRowClick"
        />
      </div>
    </div>
  </div>
</template>
