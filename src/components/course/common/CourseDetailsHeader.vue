<template>
  <div
    class="full-width justify-between no-wrap q-mb-md"
    role="region"
    :class="[isMobile ? 'column flex-column' : 'row items-center']"
    :aria-label="`Course details for ${course?.name ?? course?.event_name}`"
  >
    <div class="row items-center" style="width: auto; gap: 10px">
      <h6 class="q-mr-md avenir-bold q-my-none" :aria-label="`Course name: ${course?.name ?? course?.event_name}`">
        {{ course?.name ?? course?.event_name }}
      </h6>
    </div>
  </div>

  <FeedbackPage
    :show="coursesStore.feedBackStatus"
    v-model="messageText"
    v-model:rating="rating"
    @confirmClose="confirmClose"
    @confirmSubmit="confirmSubmit"
    aria-hidden="true"
  />

  <OverallFeedbackPage
    :showOverview="overViewFeedbackShow"
    v-model="overViewFeedbackMessage"
    v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
    v-model:ratingOverview="overViewFeedbackRating"
    @confirmCloseOverview="cancelOverviewFeedback"
    @confirmSubmitOverview="submitFeedbackOverview"
    aria-hidden="true"
  />
</template>

<script setup>
import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { defineComponent, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import FeedbackPage from 'components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'components/feedback/feedbackOverallCourse.vue'
import { computed } from 'vue'
import useCourseNavigation from 'src/composables/useCourseNavigation'
import { Notify } from 'quasar'
import WishlistAction from 'src/components/course/WishlistAction.vue'
import { useScreenSize } from 'src/composables/useScreenSize'

defineComponent({
  name: 'CourseTitleHeaderPage'
})

const emit = defineEmits(['closeSideBar'])

const router = useRouter()

const feedbackStore = useFeedbackStore()
const coursesStore = useCoursesStore()
const newProvisionStore = useNewProvisionStore()
const { goToNextCourse } = useCourseNavigation()
const { isDesktop, isMobile } = useScreenSize()

const messageText = shallowRef('')
const rating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)
const course = computed(() => coursesStore.selectedCourseInfo.rawInfo)

// Computed properties for ChipTab
const courseStats = computed(() => {
  const stats = []

  if (course.value?.total_ttl !== 0) {
    stats.push({
      img: 'Alarm',
      label: course.value?.formattedTime
    })
  }

  if (course.value?.labs_count !== 0) {
    stats.push({
      img: 'RunningLabs',
      label: `${course.value?.labs_count} Labs`
    })
  }

  stats.push({
    img: 'Books',
    label: `${course.value?.total_lessons} Subjects`
  })

  return stats
})

async function copyAddressUrl() {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    Notify.create({
      type: 'positive',
      position: 'top',
      progress: true,
      message: 'Course URL copied successfully! Share it with others.'
    })
  } catch (err) {
    Notify.create({
      type: 'negative',
      position: 'top',
      progress: true,
      message: 'Failed to copy course URL. Please try again.'
    })
  }
}

async function feedbackOverviewIconSelect() {
  await feedbackStore.fetchProgressStatus({ event_id: course.value?._key })

  setTimeout(() => {
    overViewFeedbackShow.value = true
  }, 500)
}

function cancelOverviewFeedback() {
  overViewFeedbackShow.value = !overViewFeedbackShow.value
  overViewFeedbackRating.value = 0
}

async function submitFeedbackOverview() {
  const payload = {
    description: overViewFeedbackMessage.value,
    rating: overViewFeedbackRating.value
  }
  if (course.value._key) {
    payload.event_id = course.value._key
  }
  await feedbackStore.submitProgress(payload)
  overViewFeedbackShow.value = false
}

async function confirmClose() {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (
    (coursesStore.feedBackItemDetails.item_id || newProvisionStore.feedBackItemDetails.item_id) &&
    (!coursesStore.feedBackItemDetails.manual ||
      coursesStore.feedBackItemDetails.item_id?.includes('lab_') ||
      newProvisionStore.feedBackItemDetails.item_id?.includes('lab_'))
  ) {
    goToNextCourse()
  }
}
async function confirmSubmit() {
  const payload = {
    description: messageText.value,
    rating: rating.value
  }

  payload.event_id = coursesStore.feedBackItemDetails.event_id
    ? coursesStore.feedBackItemDetails.event_id
    : newProvisionStore.feedBackItemDetails.event_id

  await feedbackStore.submitProgress(payload)
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)

  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Decode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Decode(
        newProvisionStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (
    (coursesStore.feedBackItemDetails.item_id || newProvisionStore.feedBackItemDetails.item_id) &&
    (!coursesStore.feedBackItemDetails.manual ||
      coursesStore.feedBackItemDetails.item_id?.includes('lab_') ||
      newProvisionStore.feedBackItemDetails.item_id?.includes('lab_'))
  ) {
    goToNextCourse()
  }
}

function handleResyncProgress() {
  if (coursesStore.isMarking) return
  coursesStore.getCompletionProgress(course.value?._key)
}
</script>

<style lang="scss" scoped>
:deep(.q-circular-progress__svg) {
  background: transparent !important;
  background-color: transparent !important;
}

.wishlist-action-large :deep(.q-img) {
  width: 25px !important;
}

.proficiency-chip {
  background: $warning-light !important;
  color: $warning !important;
}
</style>
