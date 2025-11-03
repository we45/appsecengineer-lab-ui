<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { getTimeSpent, formatDate } from 'src/utils/dateHelper'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import InfoListItem from 'components/common/InfoListItem.vue'
import ExcludeUsersDialog from './ExcludeUsersDialog.vue'

// Constants for sorting
const TOTAL_DURATION = 'total_duration'
const PROGRESS = 'progress'
const ASC_SORT = 'ASC'
const DESC_SORT = 'DESC'

const columns = [
  {
    name: 'full_name',
    label: 'User',
    align: 'center',
    field: 'full_name',
    sortable: true
  },
  {
    name: 'email',
    label: 'Email',
    align: 'left',
    field: 'email',
    sortable: true
  },
  {
    name: 'courses_completed',
    label: 'Courses Completed',
    align: 'left',
    field: 'completed_courses',
    sortable: true
  },
  {
    name: 'time_spent',
    label: 'Time Spent',
    align: 'left',
    field: 'timeSpent',
    sortable: true
  }
]

const props = defineProps({
  userDetails: {
    type: [Object, Array],
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  paginated: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      limit: 15,
      total: 0
    })
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  courses: {
    type: Array,
    required: true,
    default: () => []
  },
  assignId: {
    type: String,
    required: true
  },
  excludedUsers: {
    type: Array,
    required: true,
    default: () => []
  },
  assignmentDetails: {
    type: Object,
    required: true,
    default: () => {}
  }
})

const emit = defineEmits(['update:pagination', 'filter-changed', 'sort-changed'])

const assignmentStore = useAssignmentStore()

const tableRef = ref(null)
const currentPage = ref(props.pagination.page)
const currentLimit = ref(props.pagination.limit)
const isPaginationLoading = ref(false)
const showExcludeDialog = ref(false)
const showExcludeConfirmation = ref(false)
const selectedUsersForExclusion = ref([])

const excludeIds = ref([])

const filters = ref({
  search: '',
  outliers: 'all'
})

const userFilterOptions = [
  { label: 'All Users', value: 'all' },
  { label: 'Active Users', value: 'active' },
  { label: 'Inactive Users', value: 'true' }
]

const rowsPerPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]

const $q = useQuasar()

// Tracking current sort state
const currentSortBy = ref('')
const currentSortDirection = ref('')

// Watch for pagination changes from parent
watch(
  () => props.pagination.page,
  (newPage) => {
    currentPage.value = newPage
  }
)

watch(
  () => props.pagination.limit,
  (newLimit) => {
    currentLimit.value = newLimit
  }
)

// Watch for filter changes
watch(
  () => filters.value,
  (newFilters) => {
    // Reset only pagination when filters change
    currentPage.value = 1

    // Convert 'all' string value to undefined for the API
    const apiFilters = { ...newFilters }

    if (apiFilters.outliers === 'all') {
      apiFilters.outliers = undefined
    } else {
      apiFilters.outliers = !Boolean(apiFilters.outliers === 'active')
    }

    // Emit filter changes with reset pagination but maintain sorting
    emit('filter-changed', {
      ...apiFilters,
      page: 1,
      sort_by: currentSortBy.value,
      sort_order: currentSortDirection.value
    })
  },
  { deep: true }
)

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination

  // Map column names to API field names if needed
  let field = sortBy
  if (sortBy) {
    if (sortBy === 'timeSpent' || sortBy === 'time_spent') field = TOTAL_DURATION
    if (sortBy === 'completed_courses' || sortBy === 'courses_completed') field = PROGRESS

    // Toggle direction logic
    let direction
    if (field === currentSortBy.value) {
      // If same field, toggle direction
      direction = currentSortDirection.value === ASC_SORT ? DESC_SORT : ASC_SORT
    } else {
      // If new field, default to DESC
      direction = DESC_SORT
    }

    // Update current sort state
    currentSortBy.value = field
    currentSortDirection.value = direction

    // Reset pagination when sorting changes
    currentPage.value = 1

    // Prepare filters object
    const apiFilters = { ...filters.value }

    if (apiFilters.outliers === 'all') {
      apiFilters.outliers = undefined
    } else {
      apiFilters.outliers = !Boolean(apiFilters.outliers === 'active')
    }

    // Emit pagination with sort and filters
    emit('update:pagination', {
      page: 1,
      limit: rowsPerPage,
      total: props.totalUsers,
      sort_by: field,
      sort_order: direction,
      ...apiFilters
    })
  } else {
    // Handle regular pagination without sorting
    emit('update:pagination', {
      page,
      limit: rowsPerPage,
      total: props.totalUsers,
      sort_by: currentSortBy.value,
      sort_order: currentSortDirection.value
    })
  }
}

function onRowsPerPageChange(limit) {
  isPaginationLoading.value = true
  currentLimit.value = limit
  currentPage.value = 1

  // Prepare filters object
  const apiFilters = { ...filters.value }

  if (apiFilters.outliers === 'all') {
    apiFilters.outliers = undefined
  } else {
    apiFilters.outliers = !Boolean(apiFilters.outliers === 'active')
  }

  emit('update:pagination', {
    page: 1,
    limit,
    sort_by: currentSortBy.value,
    sort_order: currentSortDirection.value,
    ...apiFilters,
    callback: () => {
      isPaginationLoading.value = false
    }
  })
}

function onPageChange(page) {
  isPaginationLoading.value = true
  currentPage.value = page

  // Prepare filters object
  const apiFilters = { ...filters.value }

  if (apiFilters.outliers === 'all') {
    apiFilters.outliers = undefined
  } else {
    apiFilters.outliers = !Boolean(apiFilters.outliers === 'active')
  }

  emit('update:pagination', {
    page,
    limit: currentLimit.value,
    sort_by: currentSortBy.value,
    sort_order: currentSortDirection.value,
    ...apiFilters,
    callback: () => {
      isPaginationLoading.value = false
    }
  })
}

const formattedUserDetails = computed(() => {
  if (!props.userDetails || !Array.isArray(props.userDetails)) {
    return []
  }

  return props.userDetails
    .filter((user) => {
      return !props.excludedUsers.includes(user.email)
    })
    .map((user) => {
      return {
        ...user,
        full_name: user.name,
        avatar_url: null,
        progress: user.progress || 0,
        total_duration: user.total_duration || 0,
        user_initial: user.email ? user.email.charAt(0).toUpperCase() : 'U',
        last_updated: user.last_updated ? formatDate(user.last_updated) : 'N/A'
      }
    })
})

const emptyTableMessage = computed(() => {
  if (filters.value.search) {
    return 'No users found matching your search criteria'
  }
  return 'No users assigned yet. They will appear here once added'
})

const totalPages = computed(() => {
  if (!props.totalUsers || !props.pagination.limit) return 1
  return Math.ceil(props.totalUsers / props.pagination.limit)
})

function getSortIcon(col) {
  // Map column field to API field name
  let apiField = col.field
  if (col.field === 'timeSpent' || col.field === 'time_spent') apiField = TOTAL_DURATION
  if (col.field === 'completed_courses' || col.field === 'courses_completed') apiField = PROGRESS

  // Return the appropriate icon based on current sort state
  if (apiField === currentSortBy.value) {
    return currentSortDirection.value === ASC_SORT ? 'arrow_upward' : 'arrow_downward'
  }

  // Default icon for sortable columns
  return 'unfold_more'
}

function openExcludeDialog() {
  showExcludeDialog.value = true
}

function handleExcludeProceed(selectedUsers) {
  selectedUsersForExclusion.value = selectedUsers
  showExcludeDialog.value = false
  showExcludeConfirmation.value = true
}

function handleExcludeCancel() {
  showExcludeDialog.value = false
  selectedUsersForExclusion.value = []
}

async function handleExclude() {
  showExcludeConfirmation.value = false

  await assignmentStore.updateCompanyAssignment({
    excluded_users: selectedUsersForExclusion.value,
    assign_id: props.assignId
  })

  selectedUsersForExclusion.value = []
}

function handleCancelExclude() {
  showExcludeConfirmation.value = false
  selectedUsersForExclusion.value = []
}
</script>

<template>
  <AseCard aria-live="polite">
    <!-- Header with title, filters, and actions -->
    <div class="row items-center justify-between q-mb-md" style="gap: 10px">
      <!-- Title on the left -->
      <div class="avenir-bold q-mt-sm section_title">Assignment Users</div>
      <!-- Filters and actions on the right -->
      <div class="row items-center col-12 col-sm-auto" style="gap: 10px">
        <AseInput
          v-model="filters.search"
          placeholder="Search by email"
          fill-variant="outlined"
          wrapperClass="q-mb-none col-12 col-sm-auto"
          debounce="500"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </AseInput>
        <AseQSelect
          v-model="filters.outliers"
          placeholder="Filter by user status"
          fillVariant="outline"
          wrapperClass="col-12 col-sm-auto"
          :options="userFilterOptions"
          emit-value
          map-options
          :clearable="false"
        />
        <AseButton
          label="Exclude Users"
          variant="primary"
          :loading="assignmentStore.isLoading"
          @click="openExcludeDialog"
          class="col-12 col-sm-auto"
        />
      </div>
    </div>

    <div v-if="filters.outliers === true" class="q-my-sm">
      <InfoListItem text="These are users who have not had any activity completing the assignment after it has started" />
    </div>

    <!-- Existing AseTable -->
    <AseTable
      ref="tableRef"
      :emptyLabel="emptyTableMessage"
      row-key="email"
      binary-state-sort
      :style="{
        maxHeight: '25rem'
      }"
      :isLoading="isLoading"
      :rows="formattedUserDetails"
      :columns="columns"
      :hide-bottom="formattedUserDetails.length !== 0"
      :pagination="{
        ...pagination,
        rowsPerPage: pagination.limit,
        rowsNumber: totalUsers
      }"
      :loading="isLoading || isPaginationLoading"
      @request="onRequest"
    >
      <template #header-cell-courses_completed="props">
        <q-th :props="props">
          <div class="cursor-pointer row items-center justify-start">
            <span class="column-header-text">{{ props.col.label }}</span>
            <q-icon v-if="props.col.sortable" :name="getSortIcon(props.col)" size="sm" class="q-ml-xs custom-sort-icon" />
          </div>
        </q-th>
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
        <q-td :props="props">
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
              :aria-label="`Course ${course_count} ${course_count <= props.row.completed_courses ? 'completed' : 'not completed'}`"
              :style="{
                background:
                  course_count <= Object.values(props.row.course_metrics).filter((course) => course.progress === 100).length
                    ? 'var(--color-secondary)'
                    : 'var(--color-separator)'
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
                background: 'var(--color-separator)'
              }"
            />
            <span class="text-weight-medium cell-text">{{ 0 }}/{{ courses.length }}</span>
          </div>
        </q-td>
      </template>
    </AseTable>

    <div class="row items-center justify-between q-mt-md">
      <div class="row items-center q-gutter-md">
        <div class="text-caption">
          Showing {{ (pagination.page - 1) * currentLimit + 1 }}-{{
            Math.min(pagination.page * currentLimit, formattedUserDetails.length)
          }}
          of {{ formattedUserDetails.length }} users
        </div>

        <AseQSelect
          v-model="currentLimit"
          :options="rowsPerPageOptions"
          emit-value
          fillVariant="outlined"
          map-options
          :disable="isPaginationLoading"
          :clearable="false"
          @update:model-value="onRowsPerPageChange"
        />
      </div>

      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="5"
        boundary-numbers
        direction-links
        @update:model-value="onPageChange"
        :disable="isPaginationLoading"
      />
    </div>

    <!-- Exclude Users Dialog Component -->
    <ExcludeUsersDialog
      v-model:showDialog="showExcludeDialog"
      :users="formattedUserDetails"
      :courses="courses"
      :isLoading="isLoading"
      @proceed="handleExcludeProceed"
      @cancel="handleExcludeCancel"
    />

    <!-- Confirmation Dialog -->
    <AseDialog v-model="showExcludeConfirmation" title="Confirm Exclusion">
      <div class="q-pa-md">
        <h6 class="q-my-md">Are you sure you want to exclude the selected users?</h6>
        <div v-if="selectedUsersForExclusion.length > 0" class="q-mb-md">
          <p class="text-weight-medium">Users to be excluded:</p>
          <ul>
            <li v-for="email in selectedUsersForExclusion" :key="email">
              {{ formattedUserDetails.find((u) => u.email === email)?.full_name || email }}
            </li>
          </ul>
        </div>
        <div class="row justify-end q-gutter-sm">
          <AseButton label="Cancel" outline @click="handleCancelExclude" />
          <AseButton label="Exclude Users" color="negative" @click="handleExclude" />
        </div>
      </div>
    </AseDialog>
  </AseCard>
</template>

<style lang="scss" scoped>
.cell-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.custom-sort-icon {
  transition: transform 0.3s;
  opacity: 0.7;
  font-size: 1.1rem;
  margin-left: 4px;
  vertical-align: text-bottom;
}

.cursor-pointer {
  outline: none;
  user-select: none;
  display: inline-flex;
  align-items: center;
}
</style>
