<template>
  <div
    class="full-width"
    :class="{ 'no-pointer-events': userActivity.isActivityDisabled }"
    :style="{
      opacity: userActivity.isActivityDisabled ? '.6' : '1'
    }"
    role="region"
    aria-label="Course Content"
    :aria-disabled="userActivity.isActivityDisabled ? 'true' : 'false'"
  >
    <div class="q-pa-sm row items-center">
      <div class="avenir-bold d-flex items-center">Course Content</div>
      <q-space />
      <div>
        <AseButton
          icon="sync"
          tooltip="Sync course"
          :loading="isSyncing"
          role="button"
          aria-label="Sync course content"
          rounded
          padding="2px 2px"
          @click="handleSyncCourse"
        />
      </div>
    </div>

    <q-list>
      <template v-for="(item, index) in coursesStore.selectedCourseInfo.rawInfo?.items ?? []" :key="index">
        <AseExpansionItem
          hasBorder
          bodyWrapperClasses="q-pa-none"
          class="q-mb-sm"
          :model-value="item?._key === coursesStore.selectedCourseInfo.activeContentDetails?.subject?._key"
          :title="item.name"
          :subtitle="item.formattedTime"
          :titleClasses="getActiveSubjectClass(item?._key)"
        >
          <template #body>
            <template v-for="content in item.items" :key="content?._key">
              <CourseDetailsSidebarItem
                v-if="content"
                :content="content"
                :aria-label="`Course content: ${content.name}`"
                @switch-to-another-content="switchToAnotherContent(item, $event)"
              />
            </template>
          </template>
        </AseExpansionItem>
      </template>
    </q-list>

    <FeedbackPage
      v-model="messageText"
      v-model:rating="rating"
      v-model:show="coursesStore.feedBackStatus"
      @confirmClose="confirmClose"
      @confirmSubmit="confirmSubmit"
      aria-hidden="true"
    />
    <OverallFeedbackPage
      v-model:feedbackInfoOverview="feedbackStore.submitProgressMessage"
      v-model="overViewFeedbackMessage"
      v-model:ratingOverview="overViewFeedbackRating"
      v-model:showOverview="overViewFeedbackShow"
      @confirmCloseOverview="cancelOverviewFeedback"
      @confirmSubmitOverview="submitFeedbackOverview"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useUserActivity } from 'src/store/pinia/userActivity'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import FeedbackPage from 'src/components/feedback/feedBackCommentForm.vue'
import OverallFeedbackPage from 'src/components/feedback/feedbackOverallCourse.vue'
import useCourseNavigation from 'src/composables/useCourseNavigation'
import CourseDetailsSidebarItem from './CourseDetailsSidebarItem.vue'

const router = useRouter()
const $q = useQuasar()

const newProvisionStore = useNewProvisionStore()
const coursesStore = useCoursesStore()
const feedbackStore = useFeedbackStore()
const userActivity = useUserActivity()
const { goToNextCourse } = useCourseNavigation()

const messageText = shallowRef('')
const rating = shallowRef(0)
const overViewFeedbackShow = shallowRef(false)
const overViewFeedbackMessage = shallowRef('')
const overViewFeedbackRating = shallowRef(0)
const isSyncing = shallowRef(false)

function closeSideBar() {
  emit('closeSideBar')
}

async function switchToAnotherContent(subject, content) {
  if (content?._key) {
    coursesStore.setActiveContentDetails(subject, content)
    router.push(content?.url)
  }
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
  if (coursesStore.selectedCourseInfo.rawInfo._key) {
    payload.event_id = coursesStore.selectedCourseInfo.rawInfo._key
  }
  await feedbackStore.submitProgress(payload)
  overViewFeedbackShow.value = false
}

async function confirmClose() {
  rating.value = 0
  coursesStore.clearStoragePopup(false)
  newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
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

function getActiveSubjectClass(subId) {
  if (subId !== coursesStore.selectedCourseInfo.activeContentDetails?.subject?._key) return undefined
  return $q.dark.isActive ? 'text-secondary avenir-bold' : 'text-primary avenir-bold'
}

async function confirmSubmit(event) {
  const payload = {
    description: messageText.value,
    rating: rating.value
  }
  if (coursesStore.feedBackItemDetails.event_id) {
    payload.event_id = coursesStore.feedBackItemDetails.event_id
  } else {
    payload.event_id = newProvisionStore.feedBackItemDetails.event_id
  }
  await feedbackStore.submitProgress(payload)
  coursesStore.clearStoragePopup(false)
  await newProvisionStore.clearStoragePopupLab(false)
  if (coursesStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/`)
  } else if (coursesStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(coursesStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
        coursesStore.feedBackItemDetails.redirect_badge_id
      )}`
    )
  } else if (newProvisionStore.feedBackItemDetails.feedback_completed || false) {
    router.push(`/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/`)
  } else if (newProvisionStore.feedBackItemDetails.feedback_badge || false) {
    router.push(
      `/portal/course-info/completed/${urlSafeBase64Encode(newProvisionStore.feedBackItemDetails.event_id)}/${urlSafeBase64Encode(
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

async function handleSyncCourse() {
  const eventId = coursesStore.selectedCourseInfo.rawInfo?._key
  if (!eventId) return
  const { subject, content } = coursesStore.selectedCourseInfo.activeContentDetails
  isSyncing.value = true
  await coursesStore.fetchAndSetCourseInfo(eventId, true, true)
  await coursesStore.syncUpdatedCourseInCache(coursesStore.selectedCourseInfo.rawInfo)
  coursesStore.setActiveContentDetails(subject, content)
  isSyncing.value = false
}
</script>

<style lang="scss">
.customClass {
  border: 1px solid $border-4;
}
</style>
