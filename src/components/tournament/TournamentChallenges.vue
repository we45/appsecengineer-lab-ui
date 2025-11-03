<script setup>
import { shallowRef } from 'vue'
import TournamentChallengesTable from './TournamentChallengesTable.vue'
import TournamentChallengeForm from './TournamentChallengeForm.vue'
import TournamentCustomChallengeForm from './TournamentCustomChallengeForm.vue'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { useScreenSize } from 'src/composables/useScreenSize'

const assignmentStore = useAssignmentStore()
const { isMobile } = useScreenSize()

const openAttachChallenge = shallowRef(false)
const openAttachCustomChallenge = shallowRef(false)
</script>

<template>
  <AseButton label="Attach a challenge" style="text-transform: initial !important" @click="openAttachChallenge = true" />
  <AseButton
    label="Attach custom challenges"
    :class="{ 'q-ml-sm': !isMobile, 'q-mt-sm': isMobile }"
    @click="openAttachCustomChallenge = true"
  />
  <div class="tournament_duration full-width q-px-md q-my-md row items-center">
    <span class="avenir-bold q-mr-lg">{{ assignmentStore.attachChallenge?.name }}</span>
    <span>{{ assignmentStore.attachChallenge?.start_date }} —  {{ assignmentStore.attachChallenge?.end_date }}</span>
  </div>
  <TournamentChallengesTable />

  <div class="q-mb-md q-mt-lg">
    <AseButton
      label="Submit"
      variant="secondary"
      class="q-px-xl q-ml-sm"
      @click="
        $router.push({
          name: 'company.tournaments'
        })
      "
    />
  </div>

  <AseDialog v-model="openAttachChallenge" title="Attach a Challenge" width="50vw">
    <TournamentChallengeForm :testId="assignmentStore.attachChallenge?.sk" @on-done="openAttachChallenge = false" />
  </AseDialog>

  <AseDialog v-model="openAttachCustomChallenge" title="Attach Custom Challenges" width="50vw">
    <TournamentCustomChallengeForm :testId="assignmentStore.attachChallenge?.sk" @on-done="openAttachCustomChallenge = false" />
  </AseDialog>
</template>

<style lang="scss" scoped>
.tournament_duration {
  border-radius: 4px;
  background-color: $bg-surface;
  height: 44px;
}
</style>
