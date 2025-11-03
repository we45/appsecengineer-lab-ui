<script setup>
import { defineProps } from 'vue'
import { getTimeSpent } from 'src/utils/dateHelper'

const props = defineProps({
  topPerformers: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  onlyLabs: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <AseCard class="enterprise-card" flatCard>
    <div class="avenir-bold q-mt-sm q-mb-md section_title">
      Top Performers
      <q-icon name="emoji_events" size="sm" color="color-warning" class="q-mr-xs" />
    </div>

    <AseTable
      :rows="topPerformers"
      :columns="[
        {
          name: 'email',
          label: 'User',
          field: 'email',
          align: 'left'
        },
        {
          name: 'progress',
          label: 'Progress',
          field: 'progress',
          format: (val) => `${val}%`,
          align: 'left'
        },
        {
          name: 'total_duration',
          label: 'Time Spent',
          field: 'total_duration',
          align: 'center'
        }
      ]"
      :isLoading="isLoading"
      row-key="email"
      hide-pagination
      :hide-bottom="topPerformers.length > 0"
      emptyLabel="No top performers available"
    >
      <template v-slot:body-cell-email="props">
        <q-td :props="props" class="user-cell">
          <q-avatar size="24px" font-size="12px" text-color="white" color="secondary" class="q-mr-sm">
            {{ props.value.split('@')[0].charAt(0).toUpperCase() }}
          </q-avatar>
          <span class="avenir-bold">
            {{ props.value }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-progress="props">
        <q-td :props="props">
          <div v-if="onlyLabs" class="row items-center no-wrap">
            <AseLinearProgress :value="parseInt(props.row.lab_progress) / 100" />
            <span class="q-ml-md">
              {{ props.row.lab_progress }}
            </span>
          </div>
          <div class="row items-center no-wrap" v-else>
            <AseLinearProgress :value="parseInt(props.value) / 100" />
            <span class="q-ml-md">
              {{ props.value }}
            </span>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-total_duration="props">
        <q-td :props="props" class="avenir-bold">
          {{ getTimeSpent(props.row.total_duration * 60) }}
        </q-td>
      </template>
    </AseTable>
  </AseCard>
</template>
