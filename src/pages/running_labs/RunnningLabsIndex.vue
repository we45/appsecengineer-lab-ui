<script setup>
import { LocalStorage } from 'quasar'
import BaseDataFallBack from 'components/wrappers/BaseDataFallBack/index.vue'
import RunningLab from 'src/components/course/lab/RunningLab.vue'
import { useLabStore } from 'src/store/pinia/lab'
import { useProfileStore } from 'src/store/pinia/profile'
import { todayDate, todayDateValue } from 'src/utils/reuseFunctions'
import { onMounted } from 'vue'

const labStore = useLabStore()
const profileStore = useProfileStore()

onMounted(async () => {
  await labStore.fetchRunningLabs()
  if (!LocalStorage.getItem('EXPIRED_TIME') || LocalStorage.getItem('currentDate') !== todayDateValue().toString()) {
    todayDate()
    profileStore.fetchProfileDetailedInformation()
  }
})
</script>

<template>
  <div class="row running-lab-container">
    <template v-if="labStore.isLoading">
      <div class="col-12 row justify-center items-center" style="height: calc(100vh - 400px)">
        <q-spinner color="primary" size="5em" :thickness="3" class="self-center" />
      </div>
    </template>

    <BaseDataFallBack v-else-if="!labStore.runningLabs?.length" title="Sorry, No running labs found" role="alert" aria-live="assertive" />

    <template v-else v-for="lab in labStore.runningLabs ?? []" :key="lab">
      <div class="col-md-3 col-lg-2 col-xs-12 col-sm-6 running-lab-item col-grow">
        <RunningLab :data="lab" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.running-lab-container {
  gap: 16px;
  .running-lab-item {
    max-width: 350px;
    flex-grow: 1;
  }
}

@media (max-width: 768px) {
  .running-lab-container {
    .running-lab-item {
      max-width: 419px;
    }
  }
}
</style>
