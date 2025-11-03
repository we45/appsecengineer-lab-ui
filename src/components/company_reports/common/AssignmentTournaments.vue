<script setup>
import { computed, ref } from 'vue'

import { getTimeSpent } from 'src/utils/dateHelper'

import { useQuasar } from 'quasar'

const componentProps = defineProps({
  hasCourses: {
    type: Boolean,
    default: true
  },
  hasAssignments: {
    type: Boolean,
    default: true
  },
  hasChallenges: {
    type: Boolean,
    default: true
  },
  titleField: {
    type: String,
    default: 'event_name'
  },
  rows: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  emptyLabel: {
    type: String,
    default: 'No data'
  },
  expandable: {
    type: Boolean,
    default: false
  },
  noTimeSpent: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()

const columns = computed(() => {
  let titleColumn = ''
  let titleProgress = 'Progress'
  const { hasAssignments, hasCourses, hasChallenges } = componentProps

  if (hasAssignments && hasCourses && !hasChallenges) {
    titleColumn = 'Course/Assignment/Tournament'
  } else if (!hasAssignments && !hasChallenges && hasCourses) {
    titleColumn = 'Course'
  } else if (hasAssignments && !hasCourses && !hasChallenges) {
    titleColumn = 'Assignment'
  } else if (!hasAssignments && !hasCourses && hasChallenges) {
    titleColumn = 'Challenge'
    titleProgress = 'Status'
  }

  return [
    {
      name: 'title',
      label: titleColumn,
      align: 'left',
      field: componentProps.titleField
    },
    ...(!(hasAssignments && !hasCourses && !hasChallenges)
      ? [
          {
            name: 'progress',
            label: titleProgress,
            align: 'left',
            field: 'progress'
          }
        ]
      : []),
    ...(!componentProps.noTimeSpent
      ? [
          {
            name: 'time_spent',
            label: 'time spent',
            align: 'right',
            field: 'timeSpent'
          }
        ]
      : []),
    ...(componentProps.expandable
      ? [
          {
            name: 'users',
            align: 'right',
            field: 'users',
            width: 'auto'
          }
        ]
      : [])
  ]
})
</script>

<template>
  <AseTable
    v-bind="$attrs"
    :rows="rows"
    :columns="columns"
    :isLoading="isLoading"
    :emptyLabel="emptyLabel"
    :isInnerTable="true"
    :hide-bottom="false"
    :pagination="{
      rowsPerPage: 5
    }"
    :row-key="componentProps.titleField"
    aria-labelledby="assignment-table-title"
  >
    <template #header-cell-title="props">
      <q-th id="assignment-table-title" class="q-px-sm avenir-bold text-left">{{ props.col.label }}</q-th>
    </template>

    <template #header-cell-course_assignment="props">
      <q-th class="text-bold text-left" :style="{ fontSize: '12px' }">
        <div class="q-px-xl">
          {{ props.col.label }}
        </div>
      </q-th>
    </template>

    <template v-slot:body="props">
      <q-tr
        :props="props"
        :class="{
          'bg-light-grey': props.expand && !$q.dark.isActive,
          'bg-dark-2': $q.dark.isActive && props.expand
        }"
      >
        <template v-for="col in props.cols" :key="col.name">
          <q-td v-if="col.name === 'title'" auto-width class="q-px-sm avenir-bold">
            {{ col.value }}
          </q-td>

          <q-td v-if="col.name === 'progress'">
            <div
              v-if="props.row?.hasOwnProperty?.('progress')"
              class="row no-wrap items-center full-width justify-center q-my-sm"
              :class="{ 'q-pr-xl': !noTimeSpent }"
            >
              <AseLinearProgress
                :value="props.row.progress / 100"
                style="height: 8px"
                :aria-label="`Progress in course ${props.row.title}: ${Math.floor(props.row.progress)}%`"
                aria-live="polite"
              />
              <span class="text-caption q-ml-md progress-value">{{ Math.floor(props.row.progress) }}%</span>
            </div>
            <div v-else class="row no-wrap items-center full-width justify-start q-my-sm q-px-xl">
              <div
                v-if="props.row?.hasOwnProperty?.('status')"
                class="time-spent-chip avenir-bold row items-center justify-evenly no-wrap q-px-xs"
                :class="{ negative: props.row.negative, 'text-primary': props.row.negative }"
              >
                Solved
              </div>
              <template v-else>
                <q-badge
                  v-for="assignment_count in props.row?.total_assignments"
                  :key="assignment_count"
                  rounded
                  class="q-mr-sm"
                  :style="{ background: assignment_count <= props.row?.completed ? '#00da9f' : '#E1E1E9' }"
                  :aria-label="`Completed ${props.row?.completed} out of ${props.row?.total_assignments} assignments`"
                />

                <span class="text-caption progress-value">
                  <span v-if="props.row?.hasOwnProperty('completed') && props.row?.hasOwnProperty('total_assignments')">
                    {{ props.row?.completed }}/{{ props.row?.total_assignments }}
                  </span>
                  <span v-else>0</span>
                </span>
              </template>
            </div>
          </q-td>

          <q-td v-if="col.name === 'time_spent'" auto-width>
            <div class="row no-wrap items-center justify-end full-width">
              <span class="avenir-bold">{{ getTimeSpent(props.row.timeSpent * 60) }}</span>
            </div>
          </q-td>

          <q-td v-if="col.name === 'users'" :style="{ width: 'auto' }">
            <div class="row items-center justify-end">
              <q-icon
                class="cursor-pointer"
                :name="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                :class="{ 'text-electric-indigo': !$q.dark.isActive }"
                size="sm"
                @click="props?.onToggleExpand?.()"
                :aria-expanded="props.expand"
                :aria-label="props.expand ? 'Collapse user details' : 'Expand user details'"
              />
            </div>
          </q-td>
        </template>
      </q-tr>

      <q-tr v-if="props.expand" :props="props">
        <slot name="expanded_area" :data="props.row" />
      </q-tr>
    </template>
  </AseTable>
</template>

<style scoped lang="scss">
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
</style>
