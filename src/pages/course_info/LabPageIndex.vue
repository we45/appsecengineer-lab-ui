<script setup>
import LabTab from 'src/components/TabsInfo/LabTab.vue'
import CourseDetailsWrapper from '../../components/course/common/CourseDetailsWrapper.vue'
import LabPageContent from 'src/components/course/lab/LabPageContent.vue'
import LabPageHint from 'src/components/course/lab/LabPageHint.vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import LabPageChallengeCompletion from 'src/components/course/lab/LabPageChallengeCompletion.vue'

import { useLabStore } from 'src/store/pinia/lab'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useRoute } from 'vue-router'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { onMounted, watch, shallowRef } from 'vue'
import { computed } from 'vue'

const labStore = useLabStore()
const coursesStore = useCoursesStore()
const route = useRoute()

const dialogHint = shallowRef(false)
const showVerify = shallowRef(false)
const showConfetti = shallowRef(false)
const showCongrats = shallowRef(false)

onMounted(() => {
  if (!coursesStore.selectedCourseInfo.rawInfo) return
  fetchLabInfo()
})

watch(
  () => coursesStore.selectedCourseInfo.activeContentDetails?.content,
  (newValue) => {
    if (newValue?.object_type === 'lab') {
      fetchLabInfo()
    }
  }
)

const mappedBreadCrumb = computed(() => {
  const mapBreadcrumb = {
    challenge: {
      name: 'challenges',
      label: 'Challenges'
    },
    playground: {
      name: 'playgrounds',
      label: 'Playgrounds'
    }
  }

  return (
    mapBreadcrumb[coursesStore.selectedCourseInfo?.rawInfo?.event_status] ?? {
      name: 'courses',
      label: 'Courses'
    }
  )
})

async function fetchLabInfo() {
  const payload = {
    lab_id: coursesStore.selectedCourseInfo.activeContentDetails?.content?._key,
    event_id: urlSafeBase64Decode(route.params.courseId)
  }

  labStore.setBasicRunningLabInfo(coursesStore.selectedCourseInfo.activeContentDetails?.content)
  labStore.labInstructionStatus(true)

  const labInfoPromise = labStore.fetchLabInfo(payload)
  const labInsPromise = labStore.fetchLabInstructions(payload)

  await Promise.all([labInfoPromise, labInsPromise])
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
  <CourseDetailsWrapper
    :is-loading-content="labStore.isLoading"
    :bread-crumb-route-name="mappedBreadCrumb?.name"
    :bread-crumb-type-name="mappedBreadCrumb?.label"
  >
    <template #content>
      <ConfettiExplosion
        v-if="showConfetti"
        :particleCount="300"
        :particleSize="20"
        :stageHeight="1000"
        :stageWidth="2000"
        :duration="8000"
      />
      <LabPageContent @hintData="showHintDialog" @verifyLab="showVerifyLabFunction" />
    </template>

    <template #tabs>
      <LabTab />
    </template>
  </CourseDetailsWrapper>

  <LabPageHint v-if="dialogHint" v-model="dialogHint" @on-cancel="dialogHint = false" />

  <LabPageChallengeCompletion v-if="showVerify" v-model="showVerify" @onShowConfetti="openConfetti" @on-cancel="showVerify = false" />

  <AseDialog v-model="showCongrats" persistent @escape-key="showCongrats = false" title="Congrats" @close="showCongrats = false">
    <div class="text-h6 q-my-lg font-paytone text-center">Congrats! You've successfully completed the challenge</div>
  </AseDialog>
</template>
