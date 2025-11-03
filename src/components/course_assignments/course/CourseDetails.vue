<template>
  <AseCard class="row items-center justify-between q-mt-md">
    <div class="col-12 row items-center justify-between" style="gap: 10px">
      <div class="row col-12 col-md-auto items-center" style="gap: 10px">
        <AseInput
          v-model="searchData"
          placeholder="Search"
          height-variant="short"
          fill-variant="outlined"
          wrapperClass="q-mb-none col-12 col-md-auto "
          debounce="500"
          @update:model-value="handleSearch"
          clearable
          @clear="clearSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </AseInput>
        <BaseOptionGroup
          :options="assignmentCourse.optionsStatusData"
          size="sm"
          type="radio"
          v-model="assignmentCourse.statusData"
          @update:modelValue="updateStatusAndURL"
          inline
          dense
          class="q-pa-sm col-12 col-md-auto q-ml-none"
        />
      </div>
      <AseButton class="q-px-md" label="Create" variant="secondary" to="/portal/company/assignments/create/course" />
    </div>
  </AseCard>

  <AseCard class="q-mt-md">
    <AseTable
      row-key="sk"
      emptyLabel="No Assessments added."
      :rows="assignmentCourses"
      :columns="columns"
      :rows-per-page-options="[0]"
      style="max-height: calc(100vh - 300px)"
      :isLoading="isLoading"
      :hide-bottom="assignmentCourses.length > 0 && !isLoadingMore"
      :loadMore="hasMoreData && !isLoadingMore"
      @onLoadMore="loadMoreData"
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props">
          <div class="cursor-pointer" @click="actionItemAssignment(props.row)">
            {{ props.row.name }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <AseButton v-if="canEditAssignment(props.row)" dense @click="editAssignment(props.row)" class="q-px-md" label="Edit" />
        </q-td>
      </template>

      <template v-slot:loading>
        <div v-if="isLoadingMore" class="row justify-center q-my-md">
          <q-spinner color="primary" size="md" />
          <span class="q-ml-sm">Loading more data...</span>
        </div>
      </template>
    </AseTable>

    <!-- Bottom Loading Indicator -->
    <div v-if="isLoadingMore && assignmentCourses.length > 0" class="row justify-center q-py-md">
      <q-spinner color="primary" size="md" />
      <span class="q-ml-sm">Loading more Assignments...</span>
    </div>
  </AseCard>
</template>

<script setup>
import { useAssignmentCourse } from 'src/store/pinia/assignments/course.js'
import { dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'quasar'

defineProps({
  isJourney: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const assignmentCourse = useAssignmentCourse()

// Local state
const isLoading = ref(false)
const isLoadingMore = ref(false)
const searchData = ref('')

// Computed refs to access store data
const assignmentCourses = computed(() => assignmentCourse.localAssignmentCourses)
const hasMoreData = computed(() => assignmentCourse.hasMoreData)

const columns = computed(() => {
  const baseColumns = [
    {
      name: 'Name',
      label: 'Name',
      field: (row) => {
        // If report is empty, show event name from events array
        if (!row.report || Object.keys(row.report).length === 0) {
          return row.events?.[0]?.event_name || row.name
        }
        return row.name
      },
      sortable: true,
      align: 'left',
      classes: 'cursor-pointer'
    },
    {
      name: 'assignment_type',
      label: 'Assignment Type',
      field: (row) => {
        // If is_frozen doesn't exist or is true, it's Frozen, otherwise Dynamic
        return row.is_frozen === undefined || row.is_frozen ? 'Frozen' : 'Dynamic'
      },
      sortable: true,
      align: 'center'
    },
    {
      name: 'start_date',
      label: 'Start date',
      field: (item) => dateFormatReadable(item.start_date),
      sortable: true,
      align: 'center',
      sort: (a, b) => new Date(a) - new Date(b)
    },
    {
      name: 'end_date',
      label: 'End date',
      field: (item) => dateFormatReadable(item.end_date),
      sortable: true,
      align: 'center',
      sort: (a, b) => new Date(a) - new Date(b)
    },
    {
      name: 'status',
      label: 'Status',
      field: (item) => assignmentCourse.statusData,
      sortable: true,
      align: 'center'
    }
  ]

  // Only show actions column when status is active or draft
  if (assignmentCourse.statusData === 'active' || assignmentCourse.statusData === 'draft') {
    baseColumns.push({
      name: 'actions',
      label: 'Actions',
      field: 'actions',
      align: 'center',
      sortable: false
    })
  }

  return baseColumns
})

// Create debounced search function
const debouncedSearch = debounce(() => {
  resetStateAndFetch()
}, 500)

// Function to handle search
function handleSearch() {
  debouncedSearch()
}

// Function to clear search
function clearSearch() {
  searchData.value = ''
  resetStateAndFetch()
}

// Function to handle status change and update URL
function updateStatusAndURL(newStatus) {
  // Update URL without triggering route change
  const url = new URL(window.location.href)
  url.searchParams.set('type', newStatus)
  window.history.replaceState({}, '', url)

  // Update status and fetch data
  assignmentCourse.statusData = newStatus
  resetStateAndFetch()
}

// Initialize status from URL query
onMounted(async () => {
  // Set initial status from URL query
  const queryType = route.query.type || assignmentCourse.statusData
  assignmentCourse.statusData = queryType

  // Get search from URL query if available
  if (route.query.search) {
    searchData.value = route.query.search
  }

  // Fetch initial data
  await fetchInitialData()
})

// Watch for search changes to update URL
watch(searchData, (newValue) => {
  const url = new URL(window.location.href)
  if (newValue) {
    url.searchParams.set('search', newValue)
  } else {
    url.searchParams.delete('search')
  }
  window.history.replaceState({}, '', url)
})

// Function to reset state and fetch data
async function resetStateAndFetch() {
  isLoading.value = true
  try {
    const params = {
      status: assignmentCourse.statusData
    }

    // Only add search_term if it's not empty
    if (searchData.value) {
      params.search_term = searchData.value
    }

    await assignmentCourse.fetchLocalAssignmentCourses(params, true)
  } finally {
    isLoading.value = false
  }
}

// Initial data fetch
async function fetchInitialData() {
  isLoading.value = true
  try {
    const params = {
      status: assignmentCourse.statusData
    }

    // Only add search_term if it's not empty
    if (searchData.value) {
      params.search_term = searchData.value
    }

    await assignmentCourse.fetchLocalAssignmentCourses(params, true)
  } finally {
    isLoading.value = false
  }
}

// Function to load more data
async function loadMoreData() {
  if (isLoading.value || isLoadingMore.value || !hasMoreData.value) return

  isLoadingMore.value = true
  try {
    const params = {
      status: assignmentCourse.statusData
    }

    // Only add search_term if it's not empty
    if (searchData.value) {
      params.search_term = searchData.value
    }

    await assignmentCourse.fetchLocalAssignmentCourses(params, false)
  } finally {
    isLoadingMore.value = false
  }
}

async function actionItemAssignment(item) {
  let id = item.sk
  // if (item.journey) {
  //   id = id.replace('journey_', 'assign_')
  // }
  router.push(`/portal/company/assignments/report/${urlSafeBase64Encode(id)}`)
}

const canEditAssignment = (row) => {
  const isDraft = assignmentCourse.statusData === 'draft'
  const isActive = assignmentCourse.statusData === 'active'
  return isDraft || isActive
}

const editAssignment = (row) => {
  const id = row.sk
  const encodedId = urlSafeBase64Encode(id)
  router.push(`/portal/company/assignments/edit/course/${encodedId}`)
}
</script>

<style lang="scss" scoped></style>
