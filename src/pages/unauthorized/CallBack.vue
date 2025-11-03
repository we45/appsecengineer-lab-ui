<template>
  <q-layout class="flex items-center justify-center">
    <q-footer class="flex items-center justify-between q-px-md" reveal>
      <h6 class="q-my-sm text-body2">Copyright &copy; AppSecEngineer {{ new Date().getFullYear() }}</h6>
      <div class="q-gutter-x-xl">
        <a href="https://assets.appsecengineer.com/Terms%20of%20Use.pdf" target="_blank">Terms of Use</a>
        <a href="https://appsecengineer.com/privacy-policy" target="_blank">Privacy Policy</a>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'src/store/pinia/auth/index'

const $q = useQuasar()
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

validatingToken()

function handleErrorDescription(error_description) {
  if (error_description?.includes('Sign up via SSO is not allowed')) {
    $q.notify({
      message: 'Sign up via SSO is not allowed',
      type: 'negative',
      position: 'top'
    })
  } else if (error_description?.includes('attributes required: [family_name]')) {
    $q.notify({
      message: 'Last name is required to proceed the sign in',
      type: 'negative',
      position: 'top'
    })
  } else {
    $q.notify({
      message: 'Please provide the required information to proceed the sign in',
      type: 'negative',
      position: 'top'
    })
  }
  return router.push({ name: 'login' })
}

async function validatingToken() {
  if (route.query?.error_description) {
    handleErrorDescription(route.query?.error_description)
  }

  if (!route.query?.code) return router.push({ name: 'login' })

  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: 'white',
    spinnerSize: 140,
    message: 'Hang on...',
    messageColor: 'white'
  })
  await authStore.validateToken({
    code: route.query?.code
  })
  $q.loading.hide()
}
</script>

<style lang="scss" scoped></style>
