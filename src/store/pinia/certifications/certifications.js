import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { apiCertifications } from 'src/boot/axios'
import { computed, ref } from 'vue'

const useCertificationsStore = defineStore('certifications', () => {
  const certifications = ref([])
  const certifcationsConsent = ref(false)
  const hallOfFameUsers = ref([])
  const loading = ref(false)

  const _loading = computed(() => loading.value)

  async function fetchCertifications() {
    loading.value = true
    try {
      const { data: res } = await apiCertifications.get('certified')
      certifications.value = res.data
    } catch (err) {
      console.warn(err)
      loading.value = false
    }
    loading.value = false
  }

  async function includeToHallOfFame(payload) {
    loading.value = true
    try {
      await apiCertifications.post('hof/consent', payload)
      certifications.value = certifications.value.map((certification) => ({
        ...certification,
        consent: certification.certification_id === payload.cert_id ? payload.consent : certification.consent
      }))
      certifcationsConsent.value = payload.consent
    } catch (err) {
      Notify.create({
        message: err.response.data.message,
        color: 'negative',
        position: 'top'
      })
      loading.value = false
    }
    loading.value = false
  }

  async function getHallOfFameCertificates() {
    loading.value = true
    try {
      const { data: res } = await apiCertifications.get('hof')
      hallOfFameUsers.value = res.data
    } catch (err) {
      console.warn(err)
      loading.value = false
    }
    loading.value = false
  }

  return {
    fetchCertifications,
    includeToHallOfFame,
    getHallOfFameCertificates,
    certifications,
    certifcationsConsent,
    hallOfFameUsers,
    _loading
  }
})

export { useCertificationsStore }
