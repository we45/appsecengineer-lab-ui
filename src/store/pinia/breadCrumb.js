import { defineStore } from 'pinia'
import { ref } from 'vue'

const useBreadcrumbsStore = defineStore('breadcrumbsStore', () => {
  const breadCrumb = ref([])
  return {
    breadCrumb
  }
})

export { useBreadcrumbsStore }
