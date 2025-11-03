<template>
  <q-layout view="lHh Lpr lff" class="relative-position" :class="{ blur_data: confirm }">
    <q-linear-progress
      v-if="loader.isLoading"
      :indeterminate="loader.isLoading"
      trackColor="white"
      color="primary"
      class="absolute full-width"
      style="z-index: 9999"
    />
    <q-header
      elevated
      class="bg-transparent"
      :class="{
        'no-pointer-events': userActivity.isActivityDisabled
      }"
    >
      <div class="row justify-between flex-center relative-position">
        <MainNavbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
      </div>
    </q-header>
    <q-page-container>
      <q-page
        style="height: max-content"
        :style="{
          paddingLeft: !isDesktop ? (isSidebarOpen ? '20px !important' : '0px !important') : '',
          paddingRight: !isDesktop ? '0px !important' : ''
        }"
      >
        <!-- <StreakNotification
          v-if="showDevopsNotify"
          title="Webinar: The SBOMs Don’t Lie: Analyzing Dependencies in Vulnerable Apps | 21 Aug - 11 AM EST | "
          @on-click="handleNotificationClick"
          @close="clearNotify"
        /> -->
        <!-- <BreadCrumbIndex class="q-mb-lg" /> -->
        <router-view />
      </q-page>
    </q-page-container>

    <!-- <RecomendationForm v-model="showRecommendationDialog" @onDone="handleRecommendationDone" @onCancel="handleRecommendationCancel" /> -->
    <q-footer
      class="row justify-between bg-transparent items-center no-wrap q-pr-xl q-pl-md ase_footer q-my-md q-mr-xs q-ml-md"
      style="gap: 10px"
      :class="[
        {
          'column q-pa-none': isMobile
        }
      ]"
      :style="{
        flexDirection: isMobile ? 'column-reverse' : ''
      }"
    >
      <div class="copyright">
        AppSecEngineer
        <span>&#169;</span>
        {{ getCurentYear() }}
      </div>
      <div
        class="row items-center"
        :class="{
          'full-width justify-between': isMobile
        }"
        style="gap: 15px"
      >
        <a href="https://www.appsecengineer.com/privacy-policy" style="text-decoration: none" target="_blank">Privacy Policy</a>

        <a
          href="https://www.g2.com/products/appsecengineer/take_survey?utm_source=review-widget"
          title="Write a review of AppSecEngineer on G2"
          target="_blank"
        >
          <img
            v-if="isLearningOrigin()"
            class="full-width"
            style="max-width: 100px"
            alt="Review AppSecEngineer on G2"
            src="https://www.g2.com/products/appsecengineer/widgets/stars?color=white&amp;type=reviews"
          />
        </a>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import BreadCrumbIndex from 'components/breadcrumb/BreadCrumbIndex.vue'
import { LocalStorage, useQuasar } from 'quasar'
import { getCurentYear } from 'src/utils/helpers'
import { ref, onBeforeMount, provide, shallowRef, watch, nextTick } from 'vue'
import LayoutSidebar from './LayoutSidebar.vue'
import MainNavbar from './MainNavbar.vue'
import { useAssessmentStore } from 'src/store/pinia/assessments/assessments'
import { useGlobalLoaderStore } from 'src/store/pinia/loader'
import { useProfileStore } from 'src/store/pinia/profile'
import StreakNotification from 'src/components/common/StreakNotification.vue'
import { useRouter } from 'vue-router'
import { provideScreenSize } from 'src/composables/useScreenSize'
import RecomendationForm from 'src/components/profile/RecomendationForm.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useDashboardStore } from 'src/store/pinia/dashboard'
import { useUserActivity } from 'src/store/pinia/userActivity'
import { useLearningPathStore } from 'src/store/pinia/learningPath'

const { isMobile, isDesktop } = provideScreenSize()
const assessmentStore = useAssessmentStore()
const loader = useGlobalLoaderStore()
const profileStore = useProfileStore()
const coursesStore = useCoursesStore()
const router = useRouter()
const dashboardStore = useDashboardStore()
const userActivity = useUserActivity()
const learningPath = useLearningPathStore()

const $q = useQuasar()
const showMainSidebar = ref(true)
const confirm = ref(LocalStorage.getItem('verify') === 'FORCE')
const isMiniSidebar = shallowRef(false)
const isSidebarOpen = shallowRef(false)
const showDevopsNotify = ref(false)
const showRecommendationDialog = ref(false)

onBeforeMount(async () => {
  // coursesStore.fetchTags()
  nextTick(() => {
    isSidebarOpen.value = isDesktop.value
  })
  const isSeen = LocalStorage.has('seen_devsecops_offer') && LocalStorage.getItem('seen_devsecops_offer')
  showDevopsNotify.value = !isSeen

  assessmentStore.fetchAssessments()
  await profileStore.fetchProfileDetailedInformation()
  if (learningPath.learningPathOptions.length === 0) {
    learningPath.fetchLearningPath({})
  }
  checkAndShowRecommendationDialog()
})

watch(isDesktop, (newValue) => {
  isSidebarOpen.value = newValue
})

function clearNotify() {
  LocalStorage.set('seen_devsecops_offer', true)
  showDevopsNotify.value = false
}

function handleNotificationClick() {
  window.open('https://www.linkedin.com/events/7361765185537146880/', '_blank')
}

function isLearningOrigin() {
  return window.location.origin === 'https://learning.appsecengineer.com'
}

function handleToggleMiniSidebar() {
  isMiniSidebar.value = !isMiniSidebar.value
}

function handleRecommendationDone() {
  showRecommendationDialog.value = false
}

function handleRecommendationCancel() {
  showRecommendationDialog.value = false
}

function checkAndShowRecommendationDialog() {
  const ignoredData = LocalStorage.getItem('feedbackFormIgnore')
  if (profileStore.preferencesSubmitted) {
    dashboardStore.fetchRecommendedCourses()
  } else if (ignoredData) {
    const parsedData = JSON.parse(ignoredData)
    const userEmail = profileStore.profileDetailedInfo.email
    const hasIgnored = parsedData.some((item) => item.email === userEmail && item.formIgnore)
    if (hasIgnored) {
      return
    }
  } else {
    showRecommendationDialog.value = true
  }
}
</script>

<style lang="scss">
.blur_data {
  filter: saturate(10%);
  color: $blur !important;
}

.bg-primary-custom {
  background-color: var(--color-bg-primary);
}

.ase_footer {
  .copyright,
  a {
    color: $text-primary;
  }
}
</style>
