<script setup>
import { ref, computed } from 'vue'
import CreatorStudioForm from './CreatorStudioForm.vue'
import { useCourseGeneration } from 'src/composables/useCourseGeneration'
import CreatorStudioCoursesFilters from './CreatorStudioCoursesFilters.vue'
import { useRouter } from 'vue-router'

const COURSE_NAME = 'course_name'
const ASC_SORT = 'ASC'
const DESC_SORT = 'DESC'

const columns = [
  {
    name: 'thumbnail',
    label: 'Thumbnail',
    align: 'left',
    field: 'cover_image_url'
  },
  {
    name: 'courseName',
    label: 'Course Name',
    align: 'left',
    field: 'course_name',
    sortable: true
  },
  {
    name: 'learningPath',
    label: 'Learning path',
    align: 'left',
    field: 'learning_path_name'
  },
  {
    name: 'topic',
    label: 'Topic',
    align: 'left',
    field: 'topic',
    classes: 'text-wrap studio_table_text'
  },
  {
    name: 'context',
    label: 'Context',
    align: 'left',
    field: 'context',
    classes: 'text-wrap studio_table_text'
  },
  {
    name: 'status',
    label: 'Status',
    align: 'left',
    field: 'status'
  },
  {
    name: 'action',
    label: 'Action',
    align: 'left',
    field: ''
  }
]

const { isLoading, courses, STATUS, hasMoreCourses, loadCourses, currentCourse, deleteCourse, filters } = useCourseGeneration()

const deleteDetails = ref({
  open: false,
  courseId: null
})

const router = useRouter()

const tableRef = ref(null)

const currentSortBy = ref('')
const currentSortDirection = ref('')

function moveToCourseInfo(_, row) {
  currentCourse.value = null
  router.push({
    name: 'company.creator_studio.details',
    params: {
      courseId: row._key
    }
  })
}

async function handleDelete() {
  if (!deleteDetails.value.courseId) return
  await deleteCourse(deleteDetails.value.courseId)
  deleteDetails.value = {
    open: false,
    courseId: null
  }
}

function openDeleteDialog(courseId) {
  deleteDetails.value.courseId = courseId
  deleteDetails.value.open = true
}

function handleSortClick(field) {
  let apiField = field
  if (field === 'course_name') apiField = COURSE_NAME

  let direction
  if (apiField === currentSortBy.value) {
    direction = currentSortDirection.value === ASC_SORT ? DESC_SORT : ASC_SORT
  } else {
    direction = DESC_SORT
  }

  currentSortBy.value = apiField
  currentSortDirection.value = direction

  filters.value.sort_order = direction

  loadCourses()
}

function getSortIcon(col) {
  let apiField = col.field
  if (col.field === 'course_name') apiField = COURSE_NAME

  if (apiField === currentSortBy.value) {
    return currentSortDirection.value === ASC_SORT ? 'arrow_upward' : 'arrow_downward'
  }

  return 'unfold_more'
}

function getImageUrl(row) {
  if (row.status === STATUS.FAILED.value) return '/creatorStudioFailedFallback.png'
  return row.cover_image_url ?? '/creatorStudioFallback.png'
}
</script>

<template>
  <CreatorStudioCoursesFilters />
  <AseTable
    ref="tableRef"
    :emptyLabel="'No courses found'"
    row-key="_key"
    binary-state-sort
    :style="{
      maxHeight: 'calc(100vh - 25rem)',
      height: isLoading || !courses.length ? '' : 'calc(100vh - 25rem)'
    }"
    :isLoading="isLoading"
    :rows="courses"
    :columns="columns"
    :hide-bottom="courses.length"
    :pagination="0"
    :rows-per-page-options="[0]"
    :loadMore="hasMoreCourses"
    @row-click="moveToCourseInfo"
    @onLoadMore="() => loadCourses(true)"
  >
    <template #header-cell-courseName="props">
      <q-th :props="props">
        <div class="cursor-pointer row items-center justify-start" @click="handleSortClick(props.col.field)">
          <span class="column-header-text text-uppercase">{{ props.col.label }}</span>
          <q-icon :name="getSortIcon(props.col)" size="sm" class="q-ml-xs custom-sort-icon" />
        </div>
      </q-th>
    </template>

    <template #body-cell-thumbnail="props">
      <q-td :props="props">
        <q-img :src="getImageUrl(props.row)" :alt="`${props.row.course_name} thumbnail`" width="80px" style="border-radius: 4px" />
      </q-td>
    </template>

    <template #body-cell-courseName="props">
      <q-td :props="props">
        <div class="ellipsis-30-chars">
          {{ props.row.course_name }}
          <q-tooltip anchor="bottom middle" self="top middle" style="max-width: 300px">
            {{ props.row.course_name }}
          </q-tooltip>
        </div>
      </q-td>
    </template>

    <template #body-cell-learningPath="props">
      <q-td :props="props">
        <div class="learning-path-cell">
          <!-- Show learning path when available -->
          <template v-if="props.row.learning_path_name">
            <div class="row items-center no-wrap">
              <div class="ellipsis-text">
                {{ props.row.learning_path_name }}
                <q-tooltip anchor="bottom middle" self="top middle">
                  {{ props.row.learning_path_name }}
                </q-tooltip>
              </div>
            </div>
          </template>

          <!-- Show status indicators -->
          <template v-else>
            <div class="row items-center no-wrap" :class="props.row.status.toLowerCase()">
              <!-- Failed State -->
              <template v-if="props.row.status === 'FAILED'">
                <span class="text-negative">Generation failed</span>
              </template>

              <!-- Other States -->
              <template v-else>
                <div class="row items-center full-width">
                  <div class="q-my-sm ellipsis-text">Generating</div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </q-td>
    </template>

    <template #body-cell-topic="props">
      <q-td :props="props">
        <div class="ellipsis-3-lines">
          {{ props.row.topic }}
          <q-tooltip anchor="bottom middle" self="top middle" style="max-width: 200px">
            {{ props.row.topic }}
          </q-tooltip>
        </div>
      </q-td>
    </template>

    <template #body-cell-context="props">
      <q-td :props="props">
        <div class="ellipsis-3-lines">
          {{ props.row.context }}
          <q-tooltip anchor="bottom middle" self="top middle" style="max-width: 200px">
            {{ props.row.context }}
          </q-tooltip>
        </div>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <div class="cursor_pointer">
          <q-chip class="cs-status-chip text-bold" :class="[props.row.status]">
            {{ STATUS?.[props.row.status]?.label ?? props.row.status }}
          </q-chip>
        </div>
      </q-td>
    </template>

    <template #body-cell-action="props">
      <q-td :props="props">
        <div class="full-height row items-center justify-start no-wrap">
          <div class="action-btn bg-primary row items-center justify-center cursor-pointer" @click.stop="openDeleteDialog(props.row._key)">
            <q-icon name="delete" color="white" size="xs" />
          </div>
        </div>
      </q-td>
    </template>
  </AseTable>

  <AseDialog v-model="deleteDetails.open" title="Delete Course" width="40vw">
    <div class="full-width row items-center justify-center q-py-md">
      <span class="text-center" style="font-size: 16px">Are you sure you want to delete this course?</span>
    </div>
    <template #footer>
      <q-separator />
      <div class="q-mt-md row items-center full-width justify-end q-px-md q-mb-md">
        <AseButton outline label="Cancel" :flat="false" class="q-px-xl text-dark" @click="deleteDetails.open = false" />
        <AseButton label="Delete" variant="primary" class="q-px-xl q-ml-sm" :loading="isLoading" @click="handleDelete" />
      </div>
    </template>
  </AseDialog>
</template>

<style lang="scss" scoped>
.studio_table_text {
  white-space: normal !important;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal !important;
  max-height: 4.5em;
  line-height: 1.5em;
}

.action-btn {
  height: 26px;
  width: 26px;
  clip-path: circle();
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

:deep(.q-table) {
  thead tr th {
    position: sticky;
    z-index: 1;

    .column-header-text {
      font-size: 10px;
    }
  }
}

.ellipsis-30-chars {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-12-chars {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.learning-path-cell {
  max-width: 200px;
  padding: 4px 0;

  .ellipsis-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .building,
  .pending {
    color: var(--q-primary);
  }
}
</style>

<style lang="scss">
.cs-status-chip {
  &.SUBMITTED,
  &.IN_PROGRESS,
  &.GENERATING_COVER_IMAGE,
  &.RESEARCHING_TOPIC,
  &.WRITING_VOICEOVERS,
  &.FINALIZING,
  &.VALIDATING_MERMAID,
  &.GENERATING_VOICEOVERS,
  &.GENERATING_VIDEO {
    background: $warning-light !important;
    color: $warning !important;
  }
  &.COMPLETED {
    background: $success-light !important;
    color: $success !important;
  }
  &.FAILED {
    background: $error-light !important;
    color: $error !important;
  }
}
</style>
