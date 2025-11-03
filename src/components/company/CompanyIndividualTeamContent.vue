<template>
  <div class="q-gutter-y-md q-pa-md">
    <div class="flex justify-between">
      <AseTabs
        v-if="isCompanyAdmin"
        :tabs="[
          { label: 'Team Users', name: 'users' },
          { label: 'Team Managers', name: 'managers' }
        ]"
        v-model="btnToggle"
      />

      <AseInput
        v-if="btnToggle === 'users'"
        fillVariant="outlined"
        placeholder="Search Team Users"
        v-model="search"
        clearable
        @clear="onClearSearch"
        @keyup.enter="setSearch()"
        height-variant="short"
        style="width: 100%; max-width: 31rem"
      >
        <template v-slot:append>
          <q-icon name="search" @click="setSearch()" />
        </template>
      </AseInput>
    </div>

    <div v-if="btnToggle === 'users'">
      <slot>
        <AseTable
          :columns="columns"
          row-key="email"
          :rows="companyUserTeamsStore.usersListByTeam"
          :rows-per-page-options="[0]"
          style="max-height: calc(100vh - 300px); border-radius: 10px"
          :isLoading="companyUserTeamsStore.isLoading"
          :hide-bottom="Boolean(companyUserTeamsStore.usersListByTeam.length)"
          emptyLabel="No data available"
        >
          <template v-slot:body-cell-fullName="props">
            <q-td @click="getUserInfo(props.row.email, props.value)" class="cursor-pointer">
              <span class="avenir-bold">{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td @click="getUserInfo(props.value, props.row.fullName)" class="cursor-pointer">
              {{ props.value }}
            </q-td>
          </template>

          <template v-slot:body-cell-active="props">
            <q-td>
              <AseButton
                variant="primary"
                icon="delete"
                @click="deleteUserFromTeam(props.row.email, props.row.teamId, props.row)"
                round
                size="xs"
              />
            </q-td>
          </template>
        </AseTable>

        <div class="q-mt-md flex justify-end">
          <AseButton icon-right="add" no-caps outline @click="enableIncludeUser({ show: true })">Add members</AseButton>
        </div>
      </slot>
      <Delete
        v-if="isDelete"
        :header="`to remove ${fullNameUser} from the team`"
        :show="isDelete"
        :loading="isDeletingUser"
        @confirmDelete="teamUserConfirmDeletion($event)"
        @confirmDeleteCancel="teamUserConfirmDeleteCancel($event)"
      />
    </div>
    <div v-else>
      <ManagersTable :id="id" />
      <div class="q-mt-md flex justify-end">
        <AseButton v-if="isCompanyAdmin" icon-right="add" no-caps outline @click="enableIncludeTeamManager({ show: true })">
          Add Team Manager
        </AseButton>
      </div>
    </div>
    <template v-if="isIncludeGroup">
      <IncludeUsersIntoGroup v-model="isIncludeGroup" :id="id" @onCacel="cancleIncludeUser($event)" />
    </template>
    <template v-if="isIncludeTeamManager">
      <IncludeUsersIntoGroup
        v-model="isIncludeTeamManager"
        isTeamManager
        :id="id"
        title="Add Team Manager"
        @onCacel="cancleIncludeTeamManager($event)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import IncludeUsersIntoGroup from 'components/company/IncludeUsersIntoGroup.vue'
import Delete from 'components/shared/Delete.vue'
import ManagersTable from './companyInfo/ManagersTable.vue'

import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useLoginStore } from 'src/store/pinia/login'

defineOptions({ name: 'CompanyIndividualTeamContent' })

const props = defineProps({
  id: { type: String, default: '' }
})

const companyUserTeamsStore = useCompanyUserTeamsStore()
const loginStore = useLoginStore()
const router = useRouter()
const $q = useQuasar()

const btnToggle = ref('users')
const search = ref('')
const fullNameUser = ref('')
const isDelete = ref(false)
const isDeletingUser = ref(false)
const isIncludeGroup = ref(false)
const isIncludeTeamManager = ref(false)
const teamUserId = ref({})
const userObject = ref([])

const isDark = computed(() => $q.dark.isActive)
const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin)

const columns = [
  { name: 'fullName', align: 'left', label: 'USER', field: 'fullName' },
  { name: 'email', align: 'left', label: 'EMAIL', field: 'email' },
  { name: 'time', align: 'left', label: 'TIME SPENT', field: 'duration' },
  { name: 'active', align: 'left', label: 'MANAGE', field: 'isActive' }
]

function enableIncludeUser(event) {
  isIncludeGroup.value = false
  if (event.show) isIncludeGroup.value = true
}

function enableIncludeTeamManager(event) {
  isIncludeTeamManager.value = false
  if (event.show) isIncludeTeamManager.value = true
}

function cancleIncludeUser(event) {
  if (event.show) isIncludeGroup.value = false
}

function cancleIncludeTeamManager(event) {
  if (event.show) isIncludeTeamManager.value = false
}

async function getUserInfo(email, username) {
  await router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
}

function deleteUserFromTeam(email, id, obj) {
  fullNameUser.value = obj.fullName
  userObject.value = [obj]
  isDelete.value = true
  teamUserId.value = { user_id: email, team_id: id }
}

async function teamUserConfirmDeletion(event) {
  if (event.show) {
    isDeletingUser.value = true
    const payload = { user_id: teamUserId.value.user_id, team_id: props.id }
    await companyUserTeamsStore.deleteUserFromCompanyTeam(payload)
    await companyUserTeamsStore.resetListWithRemoval(userObject.value)
    isDelete.value = false
    isDeletingUser.value = false
  }
}

function teamUserConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = false
    teamUserId.value = {}
  }
}

async function setSearch() {
  const value = (search?.value ?? '').trim()
  if (!value.length) {
    companyUserTeamsStore.fetchUsersByTeam({ team_id: props.id })
    return
  }
  const payload = { name: value, team_id: props.id }
  companyUserTeamsStore.usersListByTeam = []
  await companyUserTeamsStore.searchUsers(payload)
}

function onClearSearch() {
  search.value = ''
  companyUserTeamsStore.clearSearchUsers(props.id)
  companyUserTeamsStore.fetchUsersByTeam({ team_id: props.id })
}
</script>

<style lang="scss" scoped></style>
