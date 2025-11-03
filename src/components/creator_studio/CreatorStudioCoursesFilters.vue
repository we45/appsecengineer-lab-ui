<script setup>
import { useCourseGeneration } from '../../composables/useCourseGeneration'

const { STATUS, loadCourses, filters } = useCourseGeneration()

const statusOptions = [
  {
    label: 'All',
    value: STATUS.ALL.value
  },
  {
    label: 'Submitted',
    value: STATUS.SUBMITTED.value
  },
  {
    label: 'In Progress',
    value: STATUS.IN_PROGRESS.value
  },
  {
    label: 'Completed',
    value: STATUS.COMPLETED.value
  },
  {
    label: 'Failed',
    value: STATUS.FAILED.value
  }
]

function handleTriggerFilter() {
  loadCourses()
}
</script>

<template>
  <AseCard class="q-mb-md" sectionClass="row justify-end items-center">
    <div class="row items-center justify-end q-gutter-sm col-12">
      <AseInput
        v-model="filters.search_term"
        placeholder="Search courses..."
        wrapperClass="col-12 col-sm-auto"
        debounce="500"
        clearable
        @update:modelValue="handleTriggerFilter"
      />
      <AseQSelect
        v-model="filters.filter_by"
        :options="statusOptions"
        placeholder="Filter by status"
        class="col-12 col-sm-auto"
        :clearable="false"
        map-options
        emit-value
        @update:modelValue="handleTriggerFilter"
      />
    </div>
  </AseCard>
</template>
