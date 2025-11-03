<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const columns = [
  {
    name: 'full_name',
    label: 'User',
    align: 'left'
  },
  {
    label: 'Email',
    align: 'left',
    field: 'email'
  },
  {
    name: 'progress',
    label: 'Progress',
    align: 'left',
    field: 'timeSpent'
  },
  {
    name: 'courses_completed',
    label: 'Courses Completed',
    align: 'left',
    field: 'completed_courses'
  }
]

const emit = defineEmits(['onLoadMore'])

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  },
  totalCourses: {
    type: Number,
    default: 0
  },
  totalUsers: {
    type: Number,
    default: 0
  }
})

const $q = useQuasar()

const pagination = ref({
  page: 1,
  rowsNumber: props.totalUsers,
  rowsPerPage: 20
})

function onRequest(event) {
  emit('onLoadMore', event, () => {
    pagination.value.page = event?.pagination?.page ?? 1
    pagination.value.rowsPerPage = event?.pagination?.rowsPerPage
  })
}
</script>

<template>
  <div class="q-mt-xs">
    <AseTable
      v-bind="$attrs"
      v-model:pagination="pagination"
      emptyLabel="No users"
      serverPaginated
      :isLoading="isLoading"
      :rows="data"
      :columns="columns"
      :isInnerTable="true"
      :hide-bottom="false"
      :rows-per-page="[10]"
      @request="onRequest"
    >
      <template #body-cell-full_name="props">
        <q-td>
          <q-avatar size="md" class="q-mr-md">
            <img v-if="$q.dark.isActive" :src="props.row.avatar_url ?? '/noUsersDark.svg'" />
            <img v-else :src="props.row.avatar_url ?? '/noUsers.svg'" />
          </q-avatar>
          <span class="avenir-bold text-capitalize">
            {{ `${props.row.first_name ?? ''} ${props.row.last_name ?? ''}` }}
          </span>
        </q-td>
      </template>

      <template #body-cell-progress="props">
        <q-td>
          <div class="row no-wrap items-center full-width justify-center q-my-sm">
            <AseLinearProgress :value="props.row.avg_progress / 100" />
            <span class="text-caption q-ml-md progress-value">{{ Math.floor(props.row.avg_progress) }}%</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-courses_completed="props">
        <q-td>
          <q-badge
            v-for="course_count in totalCourses"
            :key="course_count"
            rounded
            class="q-mr-sm"
            :style="{
              background: course_count <= props.row.completed_courses ? 'var(--color-secondary)' : 'var(--color-separator)'
            }"
          />

          <span class="text-caption progress-value">{{ props.row.completed_courses }}/{{ totalCourses }}</span>
        </q-td>
      </template>
    </AseTable>
  </div>
</template>
