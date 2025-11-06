import { useCoursesStore } from 'src/store/pinia/courses'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'

export default function useCourseNavigation() {
  const router = useRouter()
  const coursesStore = useCoursesStore()

  const courseLoading = shallowRef(false)

  async function loadAndMoveToCourseInfo(eventId) {
    const course = await coursesStore.fetchAndSetCourseInfo(eventId, false)
    moveToCourseInfo({ info: course })
  }

  async function moveToCourseInfo(event) {
    const data = event.info
    if (data.disabled) return
    if (data.upgrade) {
      router.push(`/portal/course-info/info/${urlSafeBase64Encode(data.id)}`)
    } else {
      redirectionToCoursePage(data)
    }
  }

  async function redirectionToCoursePage(data) {
    let rawInfo = {
      ...data,
      ...(data?.course ?? {})
    }

    if (!rawInfo?.is_enrolled) {
      setTimeout(() => (courseLoading.value = rawInfo._key))
      const { data: enrolledData, cancelled } = await coursesStore.enrollCourse(rawInfo._key, false)
      !cancelled && (courseLoading.value = false)
      if (cancelled || !enrolledData?.is_enrolled) return
      rawInfo = {
        ...enrolledData,
        ...(enrolledData?.course ?? {})
      }
      await coursesStore.syncUpdatedCourseInCache(rawInfo)
    }

    delete rawInfo?.course
    coursesStore.setCourseInfo(rawInfo)

    // MacroMeta store removed - course stats not published
    // macroMetaStore.publishCourseStats({
    //   course: rawInfo._key,
    //   learning_path: rawInfo.learning_path_id
    // })

    const resumeUrl = coursesStore.selectedCourseInfo.rawInfo?.resumeURL
    resumeUrl && router.push(resumeUrl)
  }

  async function goToNextCourse() {
    const { subject, content } = coursesStore.selectedCourseInfo.activeContentDetails

    const contentIndex = subject?.items?.findIndex((cont) => cont?._key === content?._key)
    const subjectIndex = coursesStore.selectedCourseInfo.rawInfo?.items?.findIndex((subj) => {
      return subj?._key === subject?._key
    })

    const isLastSubject = subjectIndex === coursesStore.selectedCourseInfo.rawInfo?.items.length - 1
    const isLastContent = contentIndex === subject?.items.length - 1

    if (isLastSubject && isLastContent) return

    if (!isLastContent) {
      const nextContent = subject?.items?.[contentIndex + 1]
      router.push({
        path: nextContent?.url
      })
      coursesStore.findAndSetActiveSubjectAndContent(subject?._key, nextContent?._key)
    } else {
      const nextSubject = coursesStore.selectedCourseInfo.rawInfo?.items[subjectIndex + 1]
      const nextContent = nextSubject?.items?.[0]
      router.push({
        path: nextContent?.url
      })
      coursesStore.findAndSetActiveSubjectAndContent(nextSubject?._key, nextContent?._key)
    }
  }

  return {
    courseLoading,
    moveToCourseInfo,
    goToNextCourse,
    loadAndMoveToCourseInfo
  }
}
