<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { useLabStore } from 'src/store/pinia/lab'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { maxLength, required } from 'src/utils/rules'
import { shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FeedbackPage from 'src/components/feedback/feedBackCommentForm.vue'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import useCourseNavigation from 'src/composables/useCourseNavigation'

const emit = defineEmits(['onCancel', 'openFeedback', 'onShowConfetti'])

const labStore = useLabStore()
const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const newProvisionStore = useNewProvisionStore()
const feedbackStore = useFeedbackStore()
const { goToNextCourse } = useCourseNavigation()

const verifyLabName = shallowRef('')
const showFeedback = shallowRef(false)
const messageText = shallowRef('')
const rating = shallowRef(0)
const isVerifying = shallowRef(false)

watch(verifyLabName, () => {
  labStore.errorMsgResetLab({
    token: false,
    token_msg: ''
  })
})

async function confirmSubmitVerifyLab() {
  isVerifying.value = true
  await labStore.verifyLabAction({
    token: verifyLabName.value,
    event_id: urlSafeBase64Decode(route.params.courseId),
    lab_id: coursesStore.selectedCourseInfo.activeContentDetails?.content?._key
  })
  if (labStore.statusOfApi) {
    emit('onCancel')
    validatorFunctionToCheck()

    emit('onShowConfetti')

    const challengeId = labStore.listLabData[0]?.challenge_id
    if (challengeId) {
      setTimeout(() => {
        router.push(`/portal/solution/info/${urlSafeBase64Encode(challengeId)}/${route.params.courseId}/${route.params.id}/`)
      }, 6000)
    }
  }
  isVerifying.value = false
}

async function validatorFunctionToCheck() {
  const courseId = coursesStore.selectedCourseInfo.rawInfo?._key
  const contentId = coursesStore.selectedCourseInfo.activeContentDetails?.content?._key

  if (!coursesStore.selectedCourseInfo.activeContentDetails?.content?.completed) {
    await newProvisionStore.markTopicCompletedLab({
      event_id: courseId,
      item_id: contentId
    })

    if (newProvisionStore.feedBackStatus) {
      showFeedback.value = true
    }
  }

  if (!newProvisionStore.markResponse) {
    await labStore.fetchLabInfo({ lab_id: contentId, event_id: courseId })
  }
}

function getTotalChallenges() {
  const subjects = coursesStore.selectedCourseInfo.rawInfo?.items ?? []

  return subjects.reduce((count, subject) => {
    const challenges = subject.items?.reduce((itemCount, content) => {
      if (content?.is_challenge_object) return itemCount + 1
    }, 0)
    return count + challenges
  }, 0)
}

async function confirmClose() {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)

  const totalItemsCount = coursesStore.selectedCourseInfo.rawInfo?.total_items
  const totalChallenges = getTotalChallenges()

  if (newProvisionStore.feedback_completed) {
    if (totalChallenges.length !== 1 && totalItemsCount !== 1) {
      router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackStatus.event_id)}/`)
    }
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge) {
    if (countChallenge.length !== 1 && totalItemsCount !== 1) {
      router.push(
        `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
          newProvisionStore.feedBackItemDetails.redirect_badge_id
        )}`
      )
    }
  } else if (
    newProvisionStore.feedBackItemDetails.item_id &&
    (!newProvisionStore.feedBackItemDetails.manual || newProvisionStore.feedBackItemDetails.item_id?.includes('lab_'))
  ) {
    if (newProvisionStore.feedBackItemDetails.item_id) {
    }
  }
}

async function confirmSubmit() {
  await feedbackStore.submitProgress({
    description: messageText.value,
    rating: rating.value,
    event_id: coursesStore.selectedCourseInfo.rawInfo?._key
  })
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)

  if (newProvisionStore.feedBackItemDetails.feedback_completed) {
    return router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  }

  if (newProvisionStore.feedBackItemDetails.feedback_badge) {
    return router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  }

  if (
    newProvisionStore.feedBackItemDetails.item_id &&
    (!newProvisionStore.feedBackItemDetails.manual || newProvisionStore.feedBackItemDetails.item_id?.includes('lab_'))
  ) {
    goToNextCourse()
  }
}
</script>

<template>
  <!-- Challenge Completion Code Dialog -->
  <AseDialog
    v-bind="$attrs"
    persistent
    title="Enter Challenge Completion Code"
    role="dialog"
    aria-labelledby="challenge-title"
    @escape-key="$emit('onCancel')"
    @close="$emit('onCancel')"
  >
    <q-form @submit="confirmSubmitVerifyLab">
      <AseInput
        v-model="verifyLabName"
        label="Code"
        :titleFalse="true"
        :maskType="''"
        :rules="[...required, ...maxLength(150)]"
        placeholder="Please enter"
        aria-describedby="error-message"
      />
      <p v-if="labStore.errorVerifyLab.token" id="error-message" class="text-caption text-negative" aria-live="polite">
        {{ labStore.errorVerifyLab.token_msg }}
      </p>

      <AseButton
        type="submit"
        class="q-my-md float-right"
        aria-label="Verify Challenge Completion Code"
        :loading="isVerifying"
        :disable="isVerifying"
      >
        Verify
      </AseButton>
    </q-form>
  </AseDialog>

  <FeedbackPage
    :show="newProvisionStore.feedBackStatus && showFeedback"
    v-model="messageText"
    v-model:rating="rating"
    @confirmClose="confirmClose"
    @confirmSubmit="confirmSubmit"
  />
</template>
