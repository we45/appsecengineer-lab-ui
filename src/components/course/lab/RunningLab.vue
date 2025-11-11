<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
const Delete = defineAsyncComponent(() => import('components/shared/Delete.vue'))

defineProps({
  data: {
    type: Object,
    required: true
  }
})
const newProvisionStore = useNewProvisionStore()
const router = useRouter()

const newLabInfo = ref({})
const running_instance_id = ref('')
const instance_id = ref('')
const markingStatusInfo = ref({})
const runningLabName = ref('')
const isDelete = ref(false)

function stopLab(running_instance, instance, labName, labInfo) {
  newLabInfo.value = labInfo
  runningLabName.value = 'quit ' + '"' + labName + '" '
  isDelete.value = true
  running_instance_id.value = running_instance
  instance_id.value = instance
  markingStatusInfo.value = {
    event_id: labInfo.event_id,
    item_id: labInfo.id
  }
}
const deleteLabServer = async (data) => {
  await newProvisionStore.deleteLabServer(data)
}
const markTopicCompletedLab = async (info) => {
  await newProvisionStore.markTopicCompletedLab(info)
}
async function labConfirmDeletion(event) {
  if (event.show) {
    const data = {
      server_id: running_instance_id.value,
      server_instance_id: instance_id.value
    }
    await deleteLabServer(data)
    isDelete.value = false
    if (newProvisionStore.markLab && (newLabInfo.value ? !newLabInfo.value.challenge_id : true)) {
      await markTopicCompletedLab(markingStatusInfo.value)
    }
    router.go()
  }
}
function labConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = false
  }
}
</script>

<template>
  <AseCard v-bind="$attrs" class="full-height" section-class="column items-start justify-start">
    <q-img
      v-if="data.logo"
      v-once
      class=""
      :src="`${data.logo}`"
      :alt="`${data.event_name} thumbnail`"
      style="max-height: 11rem; border-radius: 4px"
    />
    <h6 class="avenir-bold lab-card-title q-ma-none q-my-sm" role="heading" aria-describedby="course-title" aria-level="4">
      {{ data?.name }}
    </h6>
    <div class="q-mt-sm full-width row justify-end q-mt-auto" style="gap: 4px">
      <AseButton
        v-if="!data.is_completed"
        class="col-5"
        outline
        label="End lab"
        aria-label="End Lab"
        @click.stop="stopLab(data.running_instance_id, data.instance_id, data.name, data)"
      />
    </div>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="`you want to ${runningLabName}`"
      @confirmDelete="labConfirmDeletion($event)"
      @confirmDeleteCancel="labConfirmDeleteCancel($event)"
      title="End Lab"
    />
  </AseCard>
</template>

<style lang="scss" scoped>
.lab-card-title {
  font-size: 1rem;
  line-height: 1.5em;
}
</style>
