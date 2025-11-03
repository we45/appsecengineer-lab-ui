<template>
  <AseTable
    :columns="columns"
    row-key="email"
    :rows="companyUserTeamsStore._managersList"
    :rows-per-page-options="[0]"
    style="max-height: calc(100vh - 300px); border-radius: 10px"
    :hide-bottom="Boolean(companyUserTeamsStore._managersList.length)"
    emptyLabel="No managers available"
  >
    <template v-slot:body-cell-name="props">
      <q-td>
        <span class="avenir-bold" :class="$q.dark.isActive ? 'text-white' : ''">{{ props.value }}</span>
      </q-td>
    </template>

    <template v-slot:body-cell-manage="props">
      <q-td>
        <AseButton icon="delete" @click="deleteUserFromTeam(props.row)" round size="xs" />
      </q-td>
    </template>
  </AseTable>

  <Delete
    v-if="isDelete"
    :header="`to remove ${fullNameUser} from the team`"
    :show="isDelete"
    :loading="isDeletingManager"
    @confirmDelete="teamUserConfirmDeletion()"
    @confirmDeleteCancel="teamUserConfirmDeleteCancel()"
  />
</template>

<script setup>
import Delete from 'components/shared/Delete.vue'
import { useQuasar } from 'quasar'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { ref } from 'vue'

const props = defineProps({
  id: { required: true, default: '' }
})
const companyUserTeamsStore = useCompanyUserTeamsStore()
const columns = [
  { name: 'name', label: 'NAME', align: 'left', field: (field) => field.name || field.fullName },
  { name: 'email', label: 'EMAIL', align: 'left', field: 'email' },
  { name: 'manage', label: 'MANAGE', align: 'left' }
]

const isDelete = ref(false)
const isDeletingManager = ref(false)
const fullNameUser = ref('')
const teamManagerData = ref({})
const userObject = ref({})
const $q = useQuasar()

function deleteUserFromTeam(managerInfo) {
  userObject.value = managerInfo
  fullNameUser.value = managerInfo.name ?? managerInfo.fullName
  isDelete.value = true
  teamManagerData.value = {
    team_id: props.id,
    users: [managerInfo.email],
    type: 'REMOVE'
  }
}

async function teamUserConfirmDeletion() {
  isDeletingManager.value = true
  await companyUserTeamsStore.manageTeamManager(teamManagerData.value)
  await companyUserTeamsStore.removeTeamManager(userObject.value)
  isDelete.value = false
  isDeletingManager.value = false
}

function teamUserConfirmDeleteCancel() {
  isDelete.value = false
}
</script>

<style lang="scss" scoped></style>
