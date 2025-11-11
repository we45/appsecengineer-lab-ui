<script setup>
import LabTab from 'src/components/TabsInfo/LabTab.vue'
import LabPageContent from 'src/components/course/lab/LabPageContent.vue'
import LabPageHint from 'src/components/course/lab/LabPageHint.vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import LabPageChallengeCompletion from 'src/components/course/lab/LabPageChallengeCompletion.vue'

import { useLabStore } from 'src/store/pinia/lab'
import { useRoute } from 'vue-router'
import { onMounted, shallowRef, ref } from 'vue'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'

const labStore = useLabStore()
const labProvisionStore = useLabProvisionStore()
const route = useRoute()

const dialogHint = shallowRef(false)
const showVerify = shallowRef(false)
const showConfetti = shallowRef(false)
const showCongrats = shallowRef(false)
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

async function showHintDialog(data) {
  await labStore.fetchChallengeData(data)
  dialogHint.value = true
}

function showVerifyLabFunction() {
  labStore.errorMsgResetLab({
    status: false,
    status_msg: '',
    token: false,
    token_msg: ''
  })
  showVerify.value = true
}

function openConfetti() {
  showConfetti.value = true
  showCongrats.value = true

  setTimeout(() => {
    showCongrats.value = false
  }, 5000)

  setTimeout(() => {
    showConfetti.value = false
  }, 9000)
}
</script>

<template>
  <AseCard>
    <ConfettiExplosion
      v-if="showConfetti"
      :particleCount="300"
      :particleSize="20"
      :stageHeight="1000"
      :stageWidth="2000"
      :duration="8000"
    />
    <LabPageContent
      :token-data="tokenData"
      :partner-id="partnerId"
      :is-token-based-flow="isTokenBasedFlow"
      @hintData="showHintDialog"
      @verifyLab="showVerifyLabFunction"
    />
    <LabTab />
  </AseCard>

  <LabPageHint v-if="dialogHint" v-model="dialogHint" @on-cancel="dialogHint = false" />

  <LabPageChallengeCompletion v-if="showVerify" v-model="showVerify" @onShowConfetti="openConfetti" @on-cancel="showVerify = false" />

  <AseDialog v-model="showCongrats" persistent @escape-key="showCongrats = false" title="Congrats" @close="showCongrats = false">
    <div class="text-h6 q-my-lg font-paytone text-center">Congrats! You've successfully completed the challenge</div>
  </AseDialog>
</template>
