import { computed, shallowRef, shallowReactive, watchEffect } from 'vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useFuse } from '@vueuse/integrations/useFuse'

export default function useLoadAllCourses() {
  const coursesStore = useCoursesStore()

  const isLoading = shallowRef(false)
  const isLoadingMore = shallowRef(false)
  const currentType = shallowRef('course')

  // Performance optimizations
  const searchCache = shallowReactive(new Map())
  const lastSearchTerm = shallowRef('')
  const lastCourseCount = shallowRef(0)
  const fuseInstance = shallowRef(null)

  async function loadAllCourses() {
    let API_CALL_LEFT = 15
    isLoading.value = true
    do {
      try {
        const { allLoaded } = coursesStore.paginationState[currentType.value]
        const data = {
          types: [currentType.value === 'live-course' ? 'live_course' : currentType.value],
          search: undefined
        }
        await coursesStore.filterCourses(data, true, isLoading.value)
        if (allLoaded) {
          isLoading.value = false
          isLoadingMore.value = false
          break
        }
      } catch (error) {
        break
      } finally {
        API_CALL_LEFT--
        if (API_CALL_LEFT < 15) {
          isLoading.value = false
          isLoadingMore.value = true
        }
      }
    } while (API_CALL_LEFT > 0)
    isLoadingMore.value = false
  }

  const course = computed(() => {
    return coursesStore.coursesData.filter((course) => {
      const { learningPath, proficiency, carrer, progress, tags } = coursesStore.courseFilters

      let isLearningPathIncluded = true
      let isProficiencyIncluded = true
      let isCarrerIncluded = true
      let progressIncluded = true
      let tagsIncluded = true

      if (learningPath.length) {
        isLearningPathIncluded = learningPath.some((path) => course?.learning_path_id?.includes(path))
      }

      if (proficiency.length) {
        isProficiencyIncluded = proficiency.includes(course?.proficiency)
      }

      if (carrer.length) {
        isCarrerIncluded = carrer.some((role) => course?.career?.includes(role))
      }

      if (tags.length) {
        tagsIncluded = tags.some((tag) => course?.tags?.includes(tag))
      }

      if (progress.length) {
        progressIncluded = false
        progress.forEach((status) => {
          switch (status) {
            case 'is_enrolled':
              progressIncluded = progressIncluded || !course[status]
              break

            case 'progress':
              progressIncluded = progressIncluded || (course[status] < 100 && course?.is_enrolled)
              break

            default:
              progressIncluded = progressIncluded || course[status]
              break
          }
        })
      }

      const checkExternalFilters = isLearningPathIncluded && isProficiencyIncluded && isCarrerIncluded && progressIncluded && tagsIncluded

      return checkExternalFilters
    })
  })

  const fuseOptions = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'event_name', weight: 0.3 },
      { name: 'description', weight: 0.8 },
      { name: 'event.event_name', weight: 0.3 },
      { name: 'course.event_name', weight: 0.3 }
    ],
    threshold: 0.7,
    includeScore: true,
    includeMatches: false,
    ignoreLocation: true,
    findAllMatches: false,
    minMatchCharLength: 2,
    shouldSort: true,
    sortFn: (a, b) => a.score - b.score
  }

  watchEffect(() => {
    const courses = course.value
    const courseCount = courses.length

    // Clear cache if course data changed
    if (lastCourseCount.value !== courseCount) {
      searchCache.clear()
      lastCourseCount.value = courseCount
      fuseInstance.value = null // Reset Fuse instance
    }
  })

  const filteredCourses = computed(() => {
    const { search } = coursesStore.courseFilters
    const searchTerm = search?.trim() || ''

    if (!searchTerm) {
      return course.value
    }

    const cacheKey = `${searchTerm}_${lastCourseCount.value}`
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey)
    }

    const courses = course.value

    if (!courses || courses.length === 0) {
      return []
    }

    let searchResults
    try {
      const { results } = useFuse(searchTerm, courses, { fuseOptions })
      searchResults = results.value || results
    } catch (error) {
      console.warn('Fuse search error:', error)

      searchResults = courses
        .filter(
          (course) =>
            course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course?.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course?.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item) => ({ item }))
    }

    // Process results
    let filteredResults = []
    if (searchResults && Array.isArray(searchResults)) {
      filteredResults = searchResults
        .map((result) => result.item)
        .filter(Boolean)
        .slice(0, 100)
    }

    searchCache.set(cacheKey, filteredResults)

    if (searchCache.size > 10) {
      const keys = Array.from(searchCache.keys())
      const oldestKey = keys[0]
      searchCache.delete(oldestKey)
    }

    lastSearchTerm.value = searchTerm
    return filteredResults
  })

  const clearSearchCache = () => {
    searchCache.clear()
    fuseInstance.value = null
    lastSearchTerm.value = ''
  }

  return {
    filteredCourses,
    isLoading,
    isLoadingMore,
    loadAllCourses,
    currentType,
    clearSearchCache
  }
}
