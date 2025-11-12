<script setup>
import LabTab from 'src/components/course/lab/LabTab.vue'
import LabPageContent from 'src/components/course/lab/LabPageContent.vue'
import BaseDataFallBack from 'src/components/wrappers/BaseDataFallBack/index.vue'

import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'

const labProvisionStore = useLabProvisionStore()
const route = useRoute()
const isTokenBasedFlow = ref(false)

const partnerId = route.query.partner_id
const labId = route.query.lab
const tokenData = route.query.data

onMounted(() => {
  if (partnerId && labId && tokenData) {
    isTokenBasedFlow.value = true
    fetchLabInfoFromToken()
  }
})

async function fetchLabInfoFromToken() {
  const payload = {
    partner_id: partnerId,
    lab_id: labId,
    token: tokenData
  }

  labProvisionStore.fetchLabInfo(payload)
  labProvisionStore.fetchLabInstructions(payload)
}
</script>

<template>
  <AseCard
    :loading="labProvisionStore.loaders.fetchLabInfo"
    :style="{
      minHeight: labProvisionStore.loaders.fetchLabInfo ? '50vh' : 'auto'
    }"
  >
    <template v-if="labProvisionStore.labData.data">
      <LabPageContent :token-data="tokenData" :partner-id="partnerId" :is-token-based-flow="isTokenBasedFlow" />
      <LabTab />
    </template>

    <BaseDataFallBack v-else-if="!labProvisionStore.loaders.fetchLabInfo" role="alert" aria-live="polite" />
  </AseCard>
</template>
