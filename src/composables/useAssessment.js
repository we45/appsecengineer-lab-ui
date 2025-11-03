import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'
export const useAssessment = () => {
  const router = useRouter()
  function redirectToAssessments() {
    const rtoken = LocalStorage.getItem('rtoken')
    const token = LocalStorage.getItem('token')
    let subdomain = window.location.hostname.split('.')[0]
    const isLocal = subdomain === 'localhost'
    const url = !isLocal ? 'assessments.appsecengineer.com' : ''
    subdomain += isLocal ? ':3045' : '.'
    subdomain === 'learning.' && (subdomain = '')
    window.open(`http${!isLocal ? 's' : ''}://${subdomain}${url}/tasks?rtoken=${rtoken}&token=${token}`, '_blank')
  }

  function testing() {
    console.log('Testing')
  }

  return {
    redirectToAssessments,
    testing
  }
}
