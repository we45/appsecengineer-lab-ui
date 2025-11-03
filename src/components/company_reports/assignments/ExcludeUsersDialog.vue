<script setup>
import { ref, computed } from 'vue'
import { getTimeSpent } from 'src/utils/dateHelper'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    default: () => []
  },
  courses: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:showDialog', 'proceed', 'cancel'])

const selectedUsersForExclusion = ref([])

const emptyDialogMessage = computed(() => {
  return 'No users available to exclude'
})

function toggleUserSelection(email) {
  const index = selectedUsersForExclusion.value.indexOf(email)
  if (index > -1) {
    selectedUsersForExclusion.value.splice(index, 1)
  } else {
    selectedUsersForExclusion.value.push(email)
  }
}

function handleProceed() {
  emit('proceed', selectedUsersForExclusion.value)
  selectedUsersForExclusion.value = []
}

function handleCancel() {
  emit('cancel')
  selectedUsersForExclusion.value = []
}

function closeDialog() {
  emit('update:showDialog', false)
  selectedUsersForExclusion.value = []
}
</script>

<template>
  <AseDialog
    :model-value="showDialog"
    @update:model-value="closeDialog"
    title="Select users to exclude from this assignment"
    max-width="800px"
  >
    <AseTable
      :rows="users"
      :columns="[
        { name: 'select', label: '', field: 'select', align: 'center', sortable: false },
        { name: 'full_name', label: 'User', field: 'full_name', align: 'left', sortable: true },
        { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
        { name: 'courses_completed', label: 'Courses Completed', field: 'completed_courses', align: 'left', sortable: true },
        { name: 'time_spent', label: 'Time Spent', field: 'timeSpent', align: 'left', sortable: true }
      ]"
      row-key="email"
      :style="{
        maxHeight: '25rem'
      }"
      :emptyLabel="emptyDialogMessage"
      loading-color="primary"
      :isLoading="isLoading"
      :loading="isLoading"
      :hide-bottom="users.length !== 0"
      flat
      bordered
    >
      <template #body-cell-select="props">
        <q-td>
          <AseCheckbox
            :model-value="selectedUsersForExclusion.includes(props.row.email)"
            @update:model-value="toggleUserSelection(props.row.email)"
          />
        </q-td>
      </template>

      <template #body-cell-full_name="props">
        <q-td>
          <div class="row items-center no-wrap">
            <div style="min-width: 32px">
              <q-icon v-if="props.row?.certified" name="sym_o_trophy" size="sm" class="justify-end q-mr-sm" color="primary" />
            </div>
            <span class="text-weight-medium">{{ props.row.full_name }}</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-time_spent="props">
        <q-td>
          <span class="avenir-bold">{{ getTimeSpent((props.row.total_duration ?? 0) * 60) }}</span>
        </q-td>
      </template>

      <template #body-cell-courses_completed="props">
        <q-td>
          <div v-if="props.row.course_metrics && Object.keys(props.row.course_metrics)?.length">
            <q-badge
              v-for="course_count in Object.keys(props.row.course_metrics)?.length ?? 0"
              :key="course_count"
              rounded
              class="q-mr-sm"
              :style="{
                background:
                  course_count <= Object.values(props.row.course_metrics).filter((course) => course.progress === 100).length
                    ? '#00da9f'
                    : '#E1E1E9'
              }"
            />
            <span class="text-weight-medium cell-text">
              {{ Object.values(props.row.course_metrics).filter((course) => course.progress === 100).length }}/{{
                Object.keys(props.row.course_metrics).length
              }}
            </span>
          </div>

          <div v-else-if="courses?.length">
            <q-badge
              v-for="course_count in courses"
              :key="course_count"
              rounded
              class="q-mr-sm"
              :style="{
                background: '#E1E1E9'
              }"
            />
            <span class="text-weight-medium cell-text">{{ 0 }}/{{ courses.length }}</span>
          </div>
        </q-td>
      </template>
    </AseTable>

    <div class="row q-mt-md justify-end q-gutter-sm">
      <AseButton label="Cancel" outline @click="handleCancel" />
      <AseButton label="Proceed" :disable="selectedUsersForExclusion.length === 0" @click="handleProceed" />
    </div>
  </AseDialog>
</template>

<style lang="scss" scoped>
.cell-text {
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
