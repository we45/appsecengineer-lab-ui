import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'
import { api } from 'src/boot/axios'
export const useCourseWishlist = defineStore('courseWishlist', () => {
  const prefixUrl = `user/wishlist`
  const wishlists = ref([])
  const filteredWishLists = ref([])
  const selectedCategory = ref({ sk: '/', name: 'All' })
  const isLoading = ref(false)
  const searchTerm = ref('')

  const categoryList = computed(() => {
    return [
      { sk: '/', name: 'All' },
      ...filteredWishLists.value
        .map((data) => {
          const splitArr = data.sk?.split('/')
          return { sk: data.sk, name: splitArr[splitArr?.length - 1] }
        })
        .filter((item) => item.name !== 'All')
    ]
  })

  const categorizedWishlists = computed(() => {
    let courses = []
    if (selectedCategory.value.sk === '/') {
      courses = wishlists.value
    } else {
      courses =
        filteredWishLists.value.filter((data) => {
          return data?.sk === selectedCategory.value.sk
        })[0]?.events || []
    }

    if (searchTerm.value && searchTerm.value.trim()) {
      const searchLower = searchTerm.value.toLowerCase()
      return courses.filter((course) => {
        return (
          course?.event_name?.toLowerCase().includes(searchLower) ||
          course?.description?.toLowerCase().includes(searchLower) ||
          course?.proficiency?.toLowerCase().includes(searchLower)
        )
      })
    }

    return courses
  })

  async function fetchWishlist() {
    try {
      isLoading.value = true
      const { data } = await api.get(`${prefixUrl}`)
      wishlists.value = data?.data ?? []
      filteredWishLists.value = data?.custom_data ?? []
    } catch (err) {
      console.warn(err)
    } finally {
      isLoading.value = false
    }
  }
  async function addWishlist({ event_id, events }, categorySk) {
    try {
      const payload = { event_id, dir_path: categorySk }
      await api.post(`${prefixUrl}`, payload)

      addNewWishlist(events, categorySk)
      Notify.create({
        type: 'positive',
        position: 'top',
        progress: true,
        message: 'Marked as favorite!',
        icon: 'done'
      })
    } catch (err) {
      console.warn(err)
    }
  }
  function addNewWishlist(events, categorySk) {
    const newWishlist = {
      sk: events?.id ?? events?._key,
      event_name: events?.course?.event_name,
      logo: events?.course?.logo || events?.logo,
      proficiency: events?.course?.proficiency || events?.proficiency,
      description: events?.course?.description,
      progress: events?.progress ?? 0,
      avg_minutes: events?.avg_minutes,
      is_enrolled: events?.is_enrolled
    }
    wishlists.value.push(newWishlist)
    if (categorySk === '/') return
    const categoryIndex = filteredWishLists.value.findIndex((value) => value.sk === categorySk)
    filteredWishLists.value[categoryIndex].events.push(newWishlist)
  }
  function updateEnrollStatus(event_id, value = true) {
    wishlists.value = wishlists.value.map((e) => {
      if (e.sk === event_id) return { ...e, is_enrolled: true, progress: 0 }
      return e
    })
  }
  async function removeWishlist({ event_id }, makeApiCall = true) {
    try {
      let dir_path = '/'
      let dir_index
      const isNotRootItem = filteredWishLists.value.some((value, index) => {
        return value?.events.some((item) => {
          if (item.sk === event_id) {
            dir_path = value.sk
            dir_index = index
            return true
          }
          return false
        })
      })

      const payload = { event_id, dir_path }

      if (makeApiCall) {
        await api.delete(`${prefixUrl}`, {
          data: payload, // This is the key to include the request body
          headers: {
            'Content-Type': 'application/json' // Specify the content type if necessary
          }
        })
        Notify.create({
          type: 'positive',
          position: 'top',
          progress: true,
          message: 'Removed from favorites',
          icon: 'done'
        })
      }
      wishlists.value = wishlists.value.filter((ele) => ele.sk !== event_id)
      if (isNotRootItem) {
        filteredWishLists.value[dir_index].events = filteredWishLists.value[dir_index]?.events.filter((item) => item.sk !== event_id)
      }
    } catch (err) {
      console.warn(err)
    }
  }
  function isItemInWishlist(event) {
    if (isEventInWishlist({ event_id: event?._key ?? event.sk })) return true
    return false
  }

  function isEventInWishlist({ event_id }) {
    const wishlistId = wishlists.value.map((ele) => ele.sk)
    if (wishlistId.includes(event_id)) return true
    return false
  }

  function updateSelectedCategory(category) {
    selectedCategory.value = category
  }

  const wishlistCount = computed(() => wishlists.value.length)

  async function addNewCategory(categoryName) {
    const isListExist = categoryList.value.findIndex((item) => item.sk === `/${categoryName}`) >= 0
    !isListExist && filteredWishLists.value.push({ sk: `/${categoryName}`, events: [] })
    Notify.create({
      type: isListExist ? 'negative' : 'positive',
      position: 'top',
      progress: true,
      message: isListExist ? 'List already exists' : 'List will be removed if there is no item',
      icon: isListExist ? 'warning' : 'done'
    })
  }

  return {
    wishlists,
    fetchWishlist,
    addWishlist,
    removeWishlist,
    isLoading,
    isItemInWishlist,
    wishlistCount,
    updateEnrollStatus,
    addNewCategory,
    selectedCategory,
    updateSelectedCategory,
    categorizedWishlists,
    categoryList,
    searchTerm
  }
})
