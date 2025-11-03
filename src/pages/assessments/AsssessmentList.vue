<template>
  <div class="column q-gutter-y-md">
    <AseCard class="q-pa-none">
      <div class="avenir-bold q-mb-sm section_title">Tournaments ({{ assessmentStore?.assessments?.assessment_count }})</div>
      <AseTable
        emptyLabel="No tournaments found"
        :columns="columns"
        :hide-bottom="false"
        :rows="[...(assessmentStore?.assessments?.assessment_data ?? [])]"
        :isLoading="assessmentStore?.assessmentLoading"
        @row-click="handleClick"
      />
    </AseCard>
    <AseCard class="q-pa-none">
      <div class="avenir-bold q-mb-sm section_title">Assignments ({{ assessmentStore?.userAssign?.length ?? 0 }})</div>
      <AseTable
        emptyLabel="No assignments found"
        :hide-bottom="false"
        :columns="assignColumns"
        :rows="[...(assessmentStore?.userAssign ?? [])]"
        :isLoading="assessmentStore?.assignAssignmentLoading"
        @row-click="handleAssignClick"
        row-key="id"
      />
    </AseCard>
  </div>
</template>

<script setup>
import { useAssessmentStore } from 'src/store/pinia/assessments/assessments'
import { useAssessment } from 'src/composables/useAssessment'
const assessmentStore = useAssessmentStore()
const assessment = useAssessment()
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import AseTable from 'src/components/ase/AseTable.vue'
import AseCard from 'src/components/ase/AseCard.vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    format: (val) => `${val}`,
    sortable: true,
    style: 'max-width: 500px'
  },
  {
    name: 'start_date',
    align: 'left',
    label: 'Start Date',
    field: (item) => date.formatDate(item.start_date, 'DD MMM YYYY')
  },
  {
    name: 'end_date',
    align: 'left',
    label: 'End Date',
    field: (item) => date.formatDate(item.end_date, 'DD MMM YYYY'),
    sortable: true,
    sort: (a, b) => new Date(b).getTime() - new Date(a).getTime()
  },
  { name: 'duration', align: 'left', label: 'Duration (mins)', field: (item) => item.duration, sortable: true }
]
const router = useRouter()

const assignColumns = [
  ...columns.filter((item) => item.name !== 'duration'),
  {
    name: 'status',
    align: 'left',
    label: 'Status',
    field: (item) => (item.status === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE'),
    format: (val) => `${val}`,
    sortable: true
  }
]

assessmentStore.fetchUserAssign()

function handleClick() {
  assessment.redirectToAssessments()
}

function handleAssignClick(row, item) {
  router.push(`/portal/individual-user-assignment-details/${urlSafeBase64Encode(item.sk)}}/`)
}

function getFormatTime(duration = 0) {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  if (hours === 0) return `${minutes}min`

  //avoid 0 min
  if (minutes === 0) return `${hours}hr`
  return `${hours}hr ${minutes}min`
}
</script>

<style lang="scss" scoped></style>
