<script setup>
import { onBeforeMount, computed, ref } from 'vue'
import { useSecurityChampions } from 'src/composables/useSecurityChampions'
import AssignChampion from './AssignChampion.vue'

const props = defineProps({
  team: {
    type: String,
    required: true
  }
})

const { teamMembers, loadAllTeamMembers, removeChampion } = useSecurityChampions()

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'full_name',
    align: 'left'
  },
  {
    name: 'email',
    label: 'Email',
    field: 'sk',
    align: 'left',
    format: (v) => v?.split('#')?.[1] ?? ''
  },
  {
    name: 'actions',
    label: '',
    align: 'right'
  }
]
const isLoading = ref(false)
const isUnassignLoading = ref(false)
const isAssignDialogOpen = ref(false)
const isUnassignDialogOpen = ref({
  open: false,
  data: null
})

const teamMembersData = computed(() => {
  return teamMembers.value.get(props.team?.sk)
})

const champions = computed(() => {
  const teamMembersData = teamMembers.value.get(props.team?.sk)
  return teamMembersData?.data?.filter?.((champion) => champion?.is_champion) ?? []
})

onBeforeMount(async () => {
  isLoading.value = true
  await loadAllTeamMembers({
    team_id: props.team?.sk
  })
  isLoading.value = false
})

function handleOpenUnassignDialog(data) {
  isUnassignDialogOpen.value = {
    open: true,
    data
  }
}

function handleCloseUnassignDialog() {
  isUnassignDialogOpen.value = {
    open: false,
    data: null
  }
}

async function handleUnassign() {
  if (!isUnassignDialogOpen.value.data) return
  isUnassignLoading.value = true
  await removeChampion({
    team_id: props.team?.sk,
    email: isUnassignDialogOpen.value.data.sk?.split('#')?.[1] ?? ''
  })
  handleCloseUnassignDialog()
  isUnassignLoading.value = false
}
</script>

<template>
  <div class="row items-center justify-between q-my-md">
    <div class="column">
      <p class="avenir-bold q-mt-sm q-mb-sm section_title">Security Champions</p>
    </div>
    <AseButton label="Add Champion" @click="isAssignDialogOpen = true" />
  </div>

  <AseTable
    :columns="columns"
    :rows="champions"
    :rows-per-page-options="[0]"
    style="max-height: calc(100vh - 420px); border-radius: 10px"
    :isLoading="isLoading"
    :hide-bottom="Boolean(champions.length)"
    emptyLabel="No Security Champions Assigned"
  >
    <template #body-cell-actions="props">
      <q-td :props="props">
        <AseButton round size="sm" icon="group_remove" tooltip="Unassign Champion" @click="handleOpenUnassignDialog(props.row)" />
      </q-td>
    </template>
  </AseTable>

  <AseDialog
    v-model="isAssignDialogOpen"
    class="row no-wrap"
    title="Assign Champion"
    @update:model-value="(ev) => !ev && (isAssignDialogOpen = false)"
  >
    <AssignChampion
      v-if="isAssignDialogOpen"
      :team="props.team"
      :members="teamMembersData?.data ?? []"
      @onClose="isAssignDialogOpen = false"
    />
  </AseDialog>

  <AseDialog v-model="isUnassignDialogOpen.open" title="Unassign Champion" @update:model-value="(ev) => !ev && handleCloseUnassignDialog">
    <p>Are you sure you want to unassign this champion?</p>
    <div class="row items-center full-width justify-end q-mt-lg">
      <AseButton outline label="Cancel" class="q-mr-sm" @click="handleCloseUnassignDialog" :disable="isUnassignLoading" />
      <AseButton label="Unassign" @click="handleUnassign" :loading="isUnassignLoading" />
    </div>
  </AseDialog>
</template>
