import { useBreadcrumbsStore } from 'src/store/pinia/breadCrumb'

export default function useBreadcrumbs() {
  const breadCrumbStore = useBreadcrumbsStore()
  function setBreadcrumb(breadCrumb = []) {
    breadCrumbStore.breadCrumb = breadCrumb
  }
  return {
    breadCrumbStore,
    setBreadcrumb
  }
}
