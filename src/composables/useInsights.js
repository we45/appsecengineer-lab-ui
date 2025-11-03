import { inject, provide } from 'vue'
import { apiMacroMeta } from 'src/boot/axios'
import { ref } from 'vue'
import { positiveNotify } from 'src/utils/notify'

const symbol = Symbol('insights')

function useInsightsState() {
  const isLoading = ref(false)
  const isLoadingInsights = ref(false)
  const isLoadingReport = ref(false)
  const isLoadingMoreReport = ref(false)
  const insights = ref([])
  const complianceFrameworks = ref([])
  const currentReport = ref({})
  const userMetrics = ref([])

  async function manageAsyncOperation(callback, errCallback = null, loadingRef = null) {
    const targetLoadingRef = loadingRef || isLoading
    try {
      targetLoadingRef.value = true
      return await callback?.()
    } catch (error) {
      console.log(error)
      return await errCallback?.()
    } finally {
      targetLoadingRef.value = false
    }
  }

  async function fetchInsights(payload = {}) {
    return manageAsyncOperation(
      async () => {
        const res = await apiMacroMeta.post('compliance/reports', payload)
        if (res.data?.success) {
          insights.value = res.data.data ?? []
        }
        return res.data
      },
      null,
      isLoadingInsights
    )
  }

  async function getReportById(reportKey) {
    return manageAsyncOperation(
      async () => {
        const payload = {
          report_key: reportKey
        }

        const res = await apiMacroMeta.post('compliance/reports', payload)

        if (res.data?.success) {
          currentReport.value = res.data.data ?? {}
          userMetrics.value = res.data.data?.user_metrics ?? []
          return res.data.data ?? {}
        }
        return null
      },
      () => {
        currentReport.value = {}
        userMetrics.value = []
        return null
      },
      isLoadingReport
    )
  }

  async function generateInsight(payload) {
    return manageAsyncOperation(async () => {
      const res = await apiMacroMeta.post('team/compliance-stats', payload)
      if (res.data?.success) {
        positiveNotify('Insight generation has been queued. You will be notified when the report is ready.')
      }
      return res.data
    })
  }

  async function fetchComplianceFrameworks() {
    return manageAsyncOperation(async () => {
      const res = await apiMacroMeta.get('compliance/frameworks')
      if (res.data.success) {
        complianceFrameworks.value = res.data?.data || []
      }
      return res.data
    })
  }

  async function fetchMoreUserMetrics(payload) {
    return manageAsyncOperation(
      async () => {
        const res = await apiMacroMeta.post('compliance/reports', payload)
        if (res.data?.success && res.data.data?.user_metrics) {
          userMetrics.value = [...userMetrics.value, ...res.data.data.user_metrics]

          if (res.data.data.user_pagination) {
            currentReport.value.user_pagination = res.data.data.user_pagination
          }
        }
        return res.data
      },
      () => {},
      isLoadingMoreReport
    )
  }

  function resetCurrentReport() {
    currentReport.value = {}
    userMetrics.value = []
  }

  return {
    isLoading,
    isLoadingInsights,
    isLoadingReport,
    isLoadingMoreReport,
    insights,
    complianceFrameworks,
    currentReport,
    userMetrics,
    fetchInsights,
    getReportById,
    generateInsight,
    fetchComplianceFrameworks,
    fetchMoreUserMetrics,
    resetCurrentReport
  }
}

export function provideInsights() {
  const state = useInsightsState()
  provide(symbol, state)
  return state
}

export function useInsights() {
  return inject(symbol)
}
