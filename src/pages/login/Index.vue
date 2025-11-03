<template>
  <PageLoading v-if="tokenLocal" />
  <q-layout v-else class="q-pa-none flex items-center justify-center split-bg">
    <q-img class="z-fab main-image hide-small-screen-elements" src="login/image.png" />
    <q-page-container class="relative-position main-container" style="background-color: transparent !important">
      <AseCard
        class="q-pa-none shadow-drop"
        style="
          min-height: 600px;
          min-width: 483px;
          max-width: 483px;
          z-index: 999;
          border-radius: 23px !important;
          max-width: 90vw !important;
        "
      >
        <div class="text-center q-pt-xl q-pb-lg">
          <q-img alt="AppSecEngineer" :src="`/appsec_logo_${$q.dark.isActive ? 'dark' : 'light'}.svg`" width="139px" />
        </div>
        <div class="text-center q-mb-md">
          <p class="font-paytone text-h4 q-mb-xs" style="line-height: 50px">
            Sign in to your
            <br />
            {{ ssoMode ? 'Organization' : 'Learning Portal' }}
          </p>
        </div>
        <div class="q-px-md">
          <q-form ref="loginForm" greedy>
            <AseInput
              v-model="username"
              :rules="email"
              no-error-icon
              placeholder="Email"
              class="center-placeholder"
              fill-variant="outlined"
            />
            <AseButton
              v-if="!ssoMode"
              type="submit"
              :disabled="isTimerActive"
              class="full-width q-py-sm q-mt-lg text-subtitle1"
              @click.prevent.stop="loginWithMagicLink"
            >
              {{ buttonLabel }}
            </AseButton>
            <AseButton
              v-else
              type="submit"
              :loading="loginStore.isLoading"
              class="full-width q-py-sm q-mt-lg"
              @click.prevent.stop="signinWithSso"
            >
              {{ loginStore.isLoading ? 'Loading...' : 'Continue' }}
            </AseButton>
            <AseButton v-if="!ssoMode" outline class="q-mt-sm full-width google-login" :href="config.googleOauthUrl">
              <q-img :src="`/newIcons/Google.png`" height="20px" width="20px" />
              <div style="margin-top: 3px; color: inherit" class="q-ml-sm">Sign in with Google</div>
            </AseButton>
          </q-form>
        </div>
        <div class="q-pb-none q-pt-sm">
          <div class="row justify-center q-pb-md items-center no-wrap">
            <div class="col-grow">
              <q-separator color="dark-grey" inset :class="{ 'bg-dark-grey-active': $q.dark.isActive }" />
            </div>
            <div class="col-auto avenir-bold" style="font-size: 12px">OR</div>
            <div class="col-grow">
              <q-separator color="dark-grey" inset :class="{ 'bg-dark-grey-active': $q.dark.isActive }" />
            </div>
          </div>

          <div class="text-center q-mb-md q-mx-auto" :style="{ width: 'max-content' }">
            <p
              class="text-primary font-normal underline text-center cursor-pointer"
              :style="{
                width: 'auto'
              }"
              @click="toggleSsoMode"
            >
              {{ ssoMode ? 'Sign in with Magic Link' : 'Sign in with SSO' }}
            </p>
          </div>

          <template v-if="!ssoMode">
            <div class="text-center">
              <p class="q-mt-sm q-mb-sm font-normal text-weight-light">Not yet an AppSecEngineer?</p>
              <a class="text-primary font-normal underline" href="https://appsecengineer.com/main-menu-pages/pricing" target="_blank">
                Get your plan now
              </a>
            </div>
          </template>
        </div>
      </AseCard>
    </q-page-container>
    <q-img class="absolute-bottom hide-small-screen-elements" src="/login/side_wabe.png" width="100%" style="bottom: 8rem" />
    <q-img
      class="absolute-top-left hide-small-screen-elements"
      src="/login/side_icon.png"
      style="z-index: 99; left: 14rem; top: 10rem"
      width="126px"
    />
    <q-img
      class="absolute-bottom-left hide-small-screen-elements"
      src="/login/side_icon_2.png"
      style="z-index: 99; left: 42rem; bottom: 5rem"
      width="175px"
    />
    <q-img
      class="absolute hide-small-screen-elements"
      src="/login/side_icon_3.png"
      style="z-index: 99; right: 43rem; top: 16rem"
      width="97px"
    />
    <q-img
      class="absolute-top-right hide-small-screen-elements"
      src="/login/side_icon_4.png"
      style="z-index: 99; top: 4rem; right: 2rem"
      width="92px"
    />

    <BaseDialog v-model="showMagicLinkDialog" @close="showMagicLinkDialog = false" title="Email Sent" noheader style="width: 500px">
      <template #separator></template>
      <q-card-section class="q-my-md q-mx-md q-pa-none text-center">
        <div class="row justify-end">
          <AseButton variant="primary" icon="close" round size="sm" @click="showMagicLinkDialog = false" />
        </div>
        <div class="q-pb-xs q-px-lg">
          <p class="text-h5">Magic Link Sent to your email</p>
          <p class="text-subtitle1 text-weight-light">
            We have sent an email with sign-in link. Please sign-in using that link. The link will expire in three minutes.
          </p>
        </div>
      </q-card-section>
    </BaseDialog>
  </q-layout>
</template>

<script setup>
import PageLoading from 'pages/login/PageLoading.vue'
import { useLoginStore } from 'src/store/pinia/login'
import { email } from 'src/utils/rules'

import { computed, ref, watch, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import config from 'src/config'
import { useCoursesStore } from 'src/store/pinia/courses'
import BaseDialog from 'src/components/wrappers/BaseDialog/BaseDialog.vue'

const loginStore = useLoginStore()
const router = useRouter()
const route = useRoute()
const ssoMode = ref(route.query.hasOwnProperty('work_email'))

const coursesStore = useCoursesStore()
const showMagicLinkDialog = ref(false)
const username = ref(route.query.work_email ?? '')
const tokenLocal = ref(LocalStorage.getItem('token') || '')
const $q = useQuasar()
const loginForm = ref(null)

const fetchDashboardData = computed(() => coursesStore.dashboardCoursesData)

// Add timer related refs
const timerCount = ref(30)
const isTimerActive = ref(false)
const buttonLabel = computed(() => {
  if (loginStore.loginStatus) return 'Loading...'
  if (isTimerActive.value) return `Resend in ${timerCount.value}s`
  return 'Sign in with Magic Link'
})

onBeforeMount(() => {
  if (route.query.redirect) {
    LocalStorage.set('redirectUrl', route.query.redirect)
  }
})

// Timer function
function startTimer() {
  isTimerActive.value = true
  timerCount.value = 30
  const timer = setInterval(() => {
    timerCount.value--
    if (timerCount.value === 0) {
      clearInterval(timer)
      isTimerActive.value = false
    }
  }, 1000)
}

async function forLoggedInUser() {
  if (loginStore.hasToken) {
    await coursesStore.fetchDashboardCourses()
    if (fetchDashboardData.value.length > 0) {
      await router.push('/portal/running-labs')
    } else {
      LocalStorage.clear()
    }
  }
}

async function loginWithMagicLink() {
  const valid = await loginForm.value.validate()
  if (!valid) return
  if (!loginStore.isLoggedIn && !loginStore.isLoading && !isTimerActive.value) {
    if (window.location.search) {
      const queryParam = decodeURIComponent(window.location.search.substring(1))
      if (
        (queryParam.substring(0, 35) === 'https://learning.appsecengineer.com' &&
          queryParam.includes('https://learning.appsecengineer.com')) ||
        (queryParam.substring(0, 43) === 'https://learning.appsecengineer.com' &&
          queryParam.includes('https://learning.appsecengineer.com')) ||
        (queryParam.substring(0, 21) === 'http://127.0.0.1:8080' && queryParam.includes('http://127.0.0.1:8080'))
      ) {
        loginStore.setQueryParamUrl(decodeURIComponent(window.location.search.substring(1)))
      } else {
        loginStore.setQueryParamUrl('/')
      }
    }
    loginStore.setLoginStatus(true)
    await loginStore.loginData({ username: username.value })
    if (loginStore.apiStatus) {
      showMagicLinkDialog.value = true
      startTimer()
    }
  }
}

async function signinWithSso() {
  const valid = await loginForm.value.validate()
  if (!valid) return
  if (!loginStore.isLoggedIn && !loginStore.isLoading) {
    loginStore.loginWithSso({ email: username.value })
  }
}

function onCreated() {
  document.title = 'Login'
  if (route.query?.email) {
    username.value = route.query?.email
  }
  loginStore.setLoginStatus(false)
  forLoggedInUser()
}

function toggleSsoMode() {
  username.value = ''
  ssoMode.value = !ssoMode.value
  router.push({ query: ssoMode.value ? { work_email: username.value } : {} })
}

watch(username, () => {
  ssoMode.value && router.push({ query: { work_email: username.value } })
})

onCreated()

watch(
  () => route.query,
  (newQuery) => {
    // Log the current query for debugging purposes

    // Check if 'work_email' is present in the query parameters
    if (newQuery.hasOwnProperty('work_email')) {
      // If 'work_email' exists, set ssoMode to true
      ssoMode.value = true
    } else {
      // If 'work_email' does not exist, set ssoMode to false
      ssoMode.value = false
    }
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
a {
  color: $text-light-2 !important;
}
.google-login {
  background-color: $bg-primary !important;
  border-radius: 20px !important;
  color: $text-primary !important;
}
.text-primary {
  color: $tangerine-1 !important;
}
.font-normal {
  font-size: 16px !important;
}
.split-bg {
  width: 100%;
  height: 100px;
  background: linear-gradient(to right, $bg-dark 74%, $bg-primary 70%);
  @media (max-width: 1234px) {
    background: linear-gradient(to right, $bg-dark 100%, $bg-primary 70%);
  }
}
.main-image {
  width: 584px;
  height: 585px;
  @media (min-width: 1234px) {
    margin-right: 8rem;
  }
}

.input-section-padding {
  padding-left: 32px;
  padding-right: 32px;
}

.hide-small-screen-elements {
  @media (max-width: 1024px) {
    display: none;
  }
}

.main-container {
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.center-placeholder {
  ::placeholder {
    text-align: center;
  }
}

.custom-text-color {
  color: $text-secondary !important;
}

.login-card-bg {
  background-color: $bg-primary !important;
}
</style>
