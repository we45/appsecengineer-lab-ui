<script setup>
import CourseDetailsHeader from 'components/course/common/CourseDetailsHeader.vue'
import CourseDetailsSidebar from 'components/course/common/CourseDetailsSidebar.vue'
import BaseDataFallBack from 'app/src/components/wrappers/BaseDataFallBack/index.vue'
import AseTabs from 'src/components/ase/AseTabs.vue'
import AseTabPanels from 'src/components/ase/AseTabPanels.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { shallowRef } from 'vue'
import { onBeforeMount } from 'vue'
import { googleAnalyticsFunction, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useRoute } from 'vue-router'
import useBreadcrumbs from 'src/composables/useBreadcrumb'
import { watch } from 'vue'
import CourseDetailsWrapperSkeleton from 'src/components/skeleton/CourseDetailsWrapperSkeleton.vue'
import { useScreenSize } from 'src/composables/useScreenSize'

const props = defineProps({
  isLoadingContent: {
    type: Boolean,
    default: false
  },
  breadCrumbTypeName: {
    type: String,
    default: 'Courses'
  },
  breadCrumbRouteName: {
    type: String,
    default: 'courses'
  }
})

const coursesStore = useCoursesStore()
const route = useRoute()
const breadCrumbStore = useBreadcrumbs()
const { isDesktop } = useScreenSize()

const showMainSidebar = shallowRef(false)
const activeTab = shallowRef('content') // For mobile/tablet tabs
const contentId = shallowRef()
const subjectId = shallowRef('')
const eventId = shallowRef('')
const isLoadingCourseInfo = shallowRef(false)

// Tab configuration for mobile/tablet
const mobileTabs = [
  { name: 'content', label: 'Content' },
  { name: 'details', label: 'Details' }
]

onBeforeMount(async () => {
  // decodeAndSetIds()
  // if (!coursesStore.selectedCourseInfo.rawInfo) {
  //   await loadCourseInfo()
  // }
  // fetchSelectedContent()
})

function decodeAndSetIds() {
  contentId.value = urlSafeBase64Decode(route.params.id)
  subjectId.value = urlSafeBase64Decode(route.params.subjectId)
  eventId.value = urlSafeBase64Decode(route.params.courseId)
}

function toggleSideBar() {
  showMainSidebar.value = !showMainSidebar.value
}

function fetchSelectedContent() {
  coursesStore.findAndSetActiveSubjectAndContent(subjectId.value, contentId.value)
}

async function loadCourseInfo() {
  isLoadingCourseInfo.value = true
  await coursesStore.fetchAndSetCourseInfo(eventId.value)
  isLoadingCourseInfo.value = false
}

function runGooglePlayAnalytics() {
  const courseName = coursesStore.selectedCourseInfo.rawInfo?.event_name
  const contentName = coursesStore.selectedCourseInfo.activeContentDetails?.content.name

  document.title = `${courseName}: ${contentName}`
  googleAnalyticsFunction({
    path: window.location.pathname,
    name: `${courseName}: ${contentName}`
  })
}

function setNestedBreadCrumbs() {
  setTimeout(function () {
    breadCrumbStore.setBreadcrumb([
      {
        name: props.breadCrumbRouteName,
        label: props.breadCrumbTypeName
      },
      {
        name: undefined,
        label: coursesStore.selectedCourseInfo.rawInfo?.event_name
      }
    ])
  })
}

watch(
  () => coursesStore.selectedCourseInfo.activeContentDetails?.content?._key,
  (newValue) => {
    if (!newValue) return
    runGooglePlayAnalytics()
    setNestedBreadCrumbs()
  }
)
</script>

<template>
  <AseCard
    :style="{
      minHeight: coursesStore.isLoading ? '80vh' : 'auto'
    }"
    role="region"
    aria-labelledby="course-details-title"
  >
    <h1 id="course-details-title" class="sr-only">Course Details</h1>

    <CourseDetailsWrapperSkeleton v-if="coursesStore.isLoading || isLoadingCourseInfo" />
    <template v-else>
      <!-- <template v-if="coursesStore.selectedCourseInfo.rawInfo && !isLoadingCourseInfo"></template> -->
      <template v-if="!isLoadingCourseInfo">
        <CourseDetailsHeader />

        <div class="row no-wrap" style="gap: 10px">
          <div
            :style="{
              width: `${showMainSidebar ? '70%' : '100%'}`
            }"
            role="main"
          >
            <AseCard flat-card class="col-12 no-border q-mb-sm" :loading="isLoadingContent">
              <slot name="content" />
            </AseCard>
            <div class="q-ml-md q-mr-md">
              <slot name="tabs" />
            </div>
          </div>
        </div>
      </template>
      <!-- <BaseDataFallBack v-else-if="!isLoadingContent && !isLoadingCourseInfo" role="alert" aria-live="polite" /> -->
    </template>
  </AseCard>
</template>
