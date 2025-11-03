<template>
  <div>
    <BaseTable
      no-data-label="No challenges attached."
      :rows="fetchCustomTests"
      :columns="columns"
      :table-header-class="'radius-8 ase-roboto text-subtitle1 text-weight-bold'"
      :rows-per-page-options="[0]"
      row-key="index"
      virtual-scroll
      style="max-height: 70vh"
      :loading="testsStore.isLoading"
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props">
          <div class="text-subtitle2 ase-roboto cursor_pointer">
            {{ props.row.name }}
            <q-tooltip>{{ props.row.name }}</q-tooltip>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn
            round
            icon="delete"
            size="sm"
            :disable="new Date().toISOString() > currentTest?.start_date"
            :color="new Date().toISOString() > currentTest?.start_date ? 'grey-7' : 'red-4'"
            @click="deletePage(props.row)"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <div class="text-subtitle2 ase-roboto cursor_pointer">
            <q-icon name="event" />
            {{ updateDateFormatter(props.row.created_at) }}
          </div>
        </q-td>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useTestsStore } from 'src/store/pinia/tests'

const testsStore = useTestsStore()

const route = useRoute()
const emit = defineEmits(['deletePage'])

const columns = [
  { name: 'Name', label: 'Name', field: 'challenge_name', sortable: true, align: 'left' },
  { name: 'difficulty', label: 'Difficulty', field: 'difficulty', sortable: true, align: 'left' },
  { name: 'created_at', label: 'Created on', field: 'created_at', sortable: true, align: 'left', icon: 'event' },
  { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
]

const currentTest = ref(undefined)

const fetchCustomTests = computed(() => testsStore.customTests)

onMounted(async () => {
  currentTest.value = urlSafeBase64Decode(route.params.startDate)
})

function deletePage(data) {
  emit('deletePage', { show: true, data: data })
}

function updateDateFormatter(epoch) {
  const date = new Date(epoch)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}/${month}/${day}`
}
</script>
