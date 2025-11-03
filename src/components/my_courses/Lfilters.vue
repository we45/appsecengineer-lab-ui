<template>
  <AseCard
    v-bind="$attrs"
    class="q-mb-md"
    section-class="row items-center justify-between wrap"
    :sectionStyle="{
      gap: '10px'
    }"
  >
    <div class="row items-center justify-between" style="gap: 10px">
      <div :class="{ 'col-12': isMobile }">
        <AseInput
          v-model="coursesStore.courseFilters.search"
          placeholder="Search"
          height-variant="short"
          fill-variant="outlined"
          wrapperClass="q-mb-none "
          debounce="500"
          :disable="disableSearch"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </AseInput>
      </div>

      <div class="row items-center" style="gap: 10px">
        <div
          v-for="(filter, index) in filters"
          :key="index"
          :class="{
            'col-12': isMobile
          }"
        >
          <FilterDropDown
            :modelValue="filter.modelValue"
            :label="filter.label"
            :options="filter.options"
            :disabled="coursesStore.isLoading"
            @update:modelValue="(items) => filter.updateValue(items)"
          />
        </div>

        <!-- Tags Filter -->
        <div :class="{ 'col-12': isMobile }">
          <TagsFilterDropdown
            :modelValue="coursesStore.courseFilters.tags"
            :disabled="coursesStore.isLoading"
            @update:modelValue="
              (items) => {
                coursesStore.courseFilters.tags = items
              }
            "
          />
        </div>
        <AseCheckbox
          v-if="showCustom || route.name === 'courses'"
          v-model="coursesStore.courseFilters.isCustom"
          :disable="coursesStore.isLoading"
          label="Custom"
          @update:model-value="handleToggleCustom"
        />
        <q-btn flat round size="sm" :loading="coursesStore.isLoading" :disable="coursesStore.isLoading" @click="handleReload">
          <q-icon name="refresh" size="20px" />
          <q-tooltip>Click to check for new courses</q-tooltip>
        </q-btn>
      </div>
    </div>

    <span class="q-mb-none avenir-bold text-no-wrap cursor-pointer" style="text-decoration: underline" @click="clearFilters">
      Clear Filters
    </span>
  </AseCard>
</template>

<script setup>
import { computed, onMounted, defineComponent } from 'vue'
import { getLabelNewCourseOptions, ROLE_OPTIONS, PROFICIENCY_OPTIONS, getTypeBasedOnRoute } from 'src/utils/module/course'

import { useRoute } from 'vue-router'
import { useLearningPathStore } from 'src/store/pinia/learningPath'
import { useCoursesStore } from 'src/store/pinia/courses'

import FilterDropDown from './FilterDropDown.vue'
import TagsFilterDropdown from './TagsFilterDropdown.vue'
import useLoadAllCourses from 'src/composables/useLoadAllCourses'
import { shallowRef } from 'vue'
import { nextTick } from 'vue'
import { useScreenSize } from 'src/composables/useScreenSize'

defineComponent({
  name: 'LFilters'
})

const props = defineProps({
  loadOnRefresh: {
    type: Boolean,
    default: true
  },
  showCustom: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const learningPath = useLearningPathStore()
const coursesStore = useCoursesStore()
const { currentType, loadAllCourses } = useLoadAllCourses()
const { isMobile } = useScreenSize()

onMounted(async () => {
  if (learningPath.learningPathOptions.length === 0) {
    learningPath.fetchLearningPath({})
  }
})

const courseOptions = computed(() => [
  {
    label: getLabelNewCourseOptions(route.name),
    value: 'is_new',
    logo: 'newCourses.png'
  },
  {
    label: 'In Progress',
    value: 'progress',
    logo: 'inProgress.png'
  },
  {
    label: 'Not Started',
    value: 'is_enrolled',
    logo: 'notStarted.png'
  },
  {
    label: 'Completed',
    value: 'is_completed',
    logo: 'completed.png'
  }
])

const filters = computed(() => [
  {
    modelValue: coursesStore.courseFilters.learningPath,
    label: 'Learning Path',
    options: learningPath.learningPathOptions,
    updateValue: (items) => {
      coursesStore.courseFilters.learningPath = items
    }
  },
  {
    modelValue: coursesStore.courseFilters.proficiency,
    label: 'Proficiency',
    options: PROFICIENCY_OPTIONS,
    updateValue: (items) => {
      coursesStore.courseFilters.proficiency = items
    }
  },
  {
    modelValue: coursesStore.courseFilters.progress,
    label: 'Progress',
    options: courseOptions.value,
    updateValue: (items) => {
      coursesStore.courseFilters.progress = items
    }
  },
  {
    modelValue: coursesStore.courseFilters.carrer,
    label: 'Role',
    options: ROLE_OPTIONS,
    updateValue: (items) => {
      coursesStore.courseFilters.carrer = items
    }
  }
])

const disableSearch = computed(() => {
  return coursesStore.isLoading && !coursesStore.paginationState[getTypeBasedOnRoute(route.name)].loaded > 0
})

function clearFilters() {
  coursesStore.resetFilters()
  handleToggleCustom()
}

function handleToggleCustom() {
  currentType.value = coursesStore.courseFilters.isCustom ? 'custom' : getTypeBasedOnRoute(route.name)
  nextTick(() => {
    loadAllCourses()
  })
}

function handleReload() {
  currentType.value = coursesStore.courseFilters.isCustom ? 'custom' : getTypeBasedOnRoute(route.name)
  loadAllCourses()
}
</script>

<style scoped>
.text-active {
  color: #a09c9c;
}
.blur-logo {
  opacity: 0.5;
}
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px grey;
  border-radius: 12px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff754c;
  border-radius: 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ff754c;
}
</style>
