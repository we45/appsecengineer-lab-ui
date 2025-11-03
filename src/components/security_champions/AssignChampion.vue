<script setup>
import { ref, computed } from 'vue'
import UsersList from './UsersList.vue'
import { useSecurityChampions } from 'src/composables/useSecurityChampions'

const INFORMATIONS = [
  'Complete security training journeys',
  'Serve as the security point of contact for their team',
  'Participate in security initiatives and reviews',
  'Help promote security awareness within their team'
]

const props = defineProps({
  team: {
    type: Object,
    required: true
  },
  members: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['onClose'])

const { addChampion } = useSecurityChampions()

const selectedChampion = ref(null)
const showConfirmDialog = ref(false)
const isLoading = ref(false)

const membersOption = computed(() => {
  return props.members.map((member) => {
    return {
      full_name: member?.full_name ?? '',
      email: member?.sk?.split('#')?.[1] ?? '',
      is_champion: member?.is_champion ?? false
    }
  })
})

function handleAssignClick() {
  showConfirmDialog.value = true
}

async function confirmAssign() {
  showConfirmDialog.value = false

  isLoading.value = true
  await addChampion({
    team_id: props.team.sk,
    email: selectedChampion.value?.email
  })

  emit('onClose')

  isLoading.value = false
}

function cancelAssign() {
  showConfirmDialog.value = false
}
</script>

<template>
  <p>Select a team member to designate as the Security Champion for this team.</p>
  <p class="avenir-bold">Team members</p>
  <UsersList v-model="selectedChampion" :users="membersOption" />

  <div class="information_container q-py-md q-px-lg q-mt-sm">
    <div class="avenir-bold text-primary row items-center">
      <div class="action_btn bg-primary row items-center justify-center q-mr-sm">
        <q-icon name="info" color="white" size="xs" />
      </div>
      <span>The designated Security Champion will:</span>
    </div>
    <ul class="text-primary">
      <li v-for="(info, index) in INFORMATIONS" :key="index">{{ info }}</li>
    </ul>
  </div>

  <div class="flex items-center justify-end q-mt-md" style="gap: 5px">
    <AseButton label="cancel" outline class="col-grow" @click="$emit('onClose')" />
    <AseButton
      label="Assign Champion"
      variant="secondary"
      class="col-grow"
      :disabled="!selectedChampion"
      @click="handleAssignClick"
      :loading="isLoading"
    />
  </div>

  <AseDialog v-model="showConfirmDialog" title="Confirm Security Champion">
    <p>
      Are you sure you want to assign
      <span class="avenir-bold">{{ selectedChampion?.full_name }}</span>
      as a Security Champion for
      <span class="avenir-bold">{{ team?.team_name }}</span>
      ?
    </p>

    <div class="row items-center full-width justify-end q-mt-lg">
      <AseButton outline label="Cancel" class="q-mr-sm" @click="cancelAssign" />
      <AseButton label="Assign" @click="confirmAssign" />
    </div>
  </AseDialog>
</template>

<style lang="scss">
.information_container {
  background: $error-light;
  border-radius: 6px;
}

.action_btn {
  height: 26px;
  width: 26px;
  clip-path: circle();
}
</style>
