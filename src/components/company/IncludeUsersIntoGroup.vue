<template>
  <AseDialog
    v-model="isCreateMode"
    :title="title"
    @update:model-value="
      (val) => {
        if (!val) onCancel()
      }
    "
  >
    <q-form greedy @submit="onSubmit()">
      <AseQSelect
        autofocus
        label="Include users *"
        :loading="companyUsersStore.isLoading || companyUserTeamsStore.isLoading"
        :disable="companyUsersStore.isLoading || companyUserTeamsStore.isLoading"
        multiple
        :options="usersOptions"
        v-model="users"
        use-input
        :rules="[...optionArrayRequired('Please select at least one user')]"
      />
      <p v-if="companyUserTeamsStore.errorCompanyIncludeUsers.users" class="text-caption text-negative">
        {{ companyUserTeamsStore.errorCompanyIncludeUsers.users_msg }}
      </p>
      <div class="row justify-end q-mt-md">
        <AseButton label="Submit" type="submit" variant="primary" :loading="isSubmitting" :disabled="isSubmitting || !users?.length" />
      </div>
    </q-form>
  </AseDialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { optionArrayRequired } from 'src/utils/rules'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

defineOptions({ name: 'IncludeUsersIntoGroupInfo' })

const props = defineProps({
  id: { required: false },
  title: { type: String, default: 'Add Users' },
  isTeamManager: { type: Boolean, default: false },
  isCreate: { type: Boolean, default: false }
})

const emit = defineEmits(['onCacel', 'showPopup'])

const $q = useQuasar()

const companyUserTeamsStore = useCompanyUserTeamsStore()
const companyUsersStore = useCompanyConsumerStore()

const isCreateMode = ref(props.isCreate)
watch(
  () => props.isCreate,
  (val) => {
    isCreateMode.value = val
  }
)

const users = ref(null)
const usersOptions = ref([])
const isSubmitting = ref(false)

onMounted(async () => {
  if (usersOptions.value.length > 0) return
  await companyUserTeamsStore.includeUsersFinalList({ users: { all: true }, team: { team_id: props.id } })
  usersOptions.value = companyUserTeamsStore.totalFilteredUsersList.map((user) => ({ label: user.email, value: user.email }))
})

async function onSubmit() {
  isSubmitting.value = true

  try {
    const usersList = (users.value || []).map((email) => ({ email: email.value }))
    const data = {
      users: usersList,
      team_id: props.id
    }

    const teamManagerData = {
      team_id: props.id,
      users: (users.value || []).map((email) => email.value),
      type: 'ADD'
    }

    if (props.isTeamManager) {
      await companyUserTeamsStore.manageTeamManager(teamManagerData)
    } else {
      await companyUserTeamsStore.includeUserIntoTeam(data)
    }

    const userPayload = companyUserTeamsStore.totalFilteredUsersList.filter((ele) => {
      return (users.value || [])?.some((user) => user.value === ele.email)
    })

    if (userPayload.length) {
      if (props.isTeamManager) {
        await companyUserTeamsStore.updateTeamManagerList(userPayload)
      } else {
        await companyUserTeamsStore.resetListWithAddingOrRemoval(userPayload)
      }
    }

    users.value = null
    if (companyUserTeamsStore.errorCompanyIncludeUsers.users) {
      emit('onCacel', { show: false })
    } else {
      emit('onCacel', { show: true })
    }
    if (Object.keys(companyUserTeamsStore.user_attach_error_msg).length > 0) {
      emit('showPopup', { show: true })
    } else {
      emit('showPopup', { show: false })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      position: 'top',
      progress: true,
      icon: 'warning',
      message: error.message || 'An error occurred while processing your request'
    })
  } finally {
    isSubmitting.value = false
  }
}

function onCancel() {
  companyUserTeamsStore.errorMsgResetIncludeUsers({ users: false, users_msg: '' })
  users.value = null
  emit('onCacel', { show: true })
}

async function paginatedDataInfo() {
  if (companyUsersStore.allUserPagination) {
    await companyUsersStore.fetchPaginatedCompanyAllUsers({ LastEvaluatedKey: companyUsersStore.allUserPagination })
  }
}
</script>

<style scoped></style>
