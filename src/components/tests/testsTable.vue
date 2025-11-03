<template>
  <div>
    <AseTable
      empty-label="No challenges attached."
      :rows="rowData"
      :columns="columns"
      :rows-per-page-options="[0]"
      row-key="index"
      style="max-height: 70vh"
      :hide-bottom="rowData?.length > 0"
      :loading="testsStore.isLoading"
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props">
          <div class="cursor_pointer avenir-bold">
            {{ props.row.name }}
            <q-tooltip>{{ props.row.name }}</q-tooltip>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-score="props">
        <q-td :props="props">
          <div class="cursor_pointer">
            {{ props.row.score ?? 'N/A' }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-difficulty="props">
        <q-td :props="props">
          <div class="cursor_pointer">
            {{ props.row?.difficulty ?? 'N/A' }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-Action="props" v-if="showDelete">
        <q-td :props="props">
          <AseButton
            round
            icon="delete"
            size="sm"
            :disable="new Date().toISOString() > currentTest?.start_date"
            @click="deletePage(props.row)"
          >
            <q-tooltip>Delete</q-tooltip>
          </AseButton>
        </q-td>
      </template>
    </AseTable>
    <div align="left">
      <AseButton v-if="testsStore.testsKey" :loading="testsStore.isLoading" size="14px" @click="loadMoreUsers()">
        Load more
        <template v-slot:loading>
          <q-spinner-hourglass class="on-left" />
          Loading...
        </template>
      </AseButton>
    </div>
  </div>
</template>

<script setup>
import { dateFormatReadable, urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useTestsStore } from 'src/store/pinia/tests'
import { defineComponent, onBeforeMount, ref, shallowRef, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAssignmentStore } from 'src/store/pinia/assignment'

defineComponent({
  name: 'TestsTable'
})

const props = defineProps(['search'])
const emit = defineEmits(['clearTableData', 'deletePage'])

const testsStore = useTestsStore()
const assignmentStore = useAssignmentStore()

const route = useRoute()

const currentTest = shallowRef(undefined)
const currentTaskId = ref(undefined)

onBeforeMount(() => {
  emit('clearTableData')
  currentTest.value = urlSafeBase64Decode(route.params.startDate)
  currentTaskId.value = urlSafeBase64Decode(route.params.testId)
})
const customTests = computed(() => {
  return testsStore.customTests.map(({ created_at, name, ...rest }) => {
    const date = new Date(created_at)
    return {
      ...rest,
      name,
      isCustom: true,
      created_at: date.toISOString()
    }
  })
})

const rowData = computed(() => {
  return [...testsStore.tests, ...customTests.value]
})
const showDelete = computed(() => {
  if (!currentTest.value?.start_date && !currentTaskData.value?.active) return true
  return new Date().toISOString() > currentTaskData.value?.start_date
})
const columns = computed(() => {
  const arr = [
    { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
    { name: 'score', label: 'Score', field: 'score', sortable: true, align: 'left' },
    { name: 'difficulty', label: 'Difficulty', field: 'difficulty', sortable: true, align: 'left' }
  ]
  if (
    (!currentTest.value?.start_date || new Date().toISOString() > currentTest.value?.start_date) &&
    rowData.value.length > 0 &&
    !currentTaskData.value?.active
  ) {
    arr.push({ name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' })
  }
  return arr
})
const currentTaskData = computed(() => assignmentStore.challengeAssignmentList.find((data) => data.id === currentTaskId.value))

function updateDateFormatter(date) {
  return dateFormatReadable(date)
}

async function loadMoreUsers() {
  if (!props.search) {
    testsStore.fetchTestsPaginated({
      test: urlSafeBase64Decode(route.params.testId)
    })
  } else {
    const data = {
      search_term: props.search,
      test: urlSafeBase64Decode(route.params.testId)
    }
    await testsStore.fetchTestsPaginated(data)
  }
}

function deletePage(data) {
  emit('deletePage', { show: true, data: data })
}
</script>

<style scoped lang="sass">
thead tr th
  font-size: 14px
  font-weight: 600
thead tr th
  font-size: 14px
  font-weight: 600
</style>
