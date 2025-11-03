<template>
  <q-layout>
    <q-page-container class="bg-grey-4">
      <q-page class="flex items-center justify-center">
        <q-card class="bg-black q-pa-md text-white">
          <q-card-section class="text-body1 text-center">
            <p class="text-left">Welcome to</p>
            <q-img src="/logo.svg" width="180px" class="welcome-appsec" />
          </q-card-section>
          <q-card-section>
            <div class="cf-turnstile" data-sitekey="0x4AAAAAAAEFim3SUG4gtlCf"></div>
            <AseButton label="Proceed to Learning Portal" @click="onSubmitLink" :loading="loading" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerFacebook } from 'quasar'

import { useLoginStore } from 'src/store/pinia/login'

export default {
  data() {
    return {
      params: {
        email: '',
        code: ''
      },
      loading: false
    }
  },
  created() {
    let urlSearchParams = new URLSearchParams(window.location.search)
    urlSearchParams = urlSearchParams.toString()
    urlSearchParams = decodeURIComponent(urlSearchParams)
    const url = encodeURI(urlSearchParams)
    const splitItems = url.split('&')
    const email = splitItems[0]?.match(/email=(.*)/)
    const code = splitItems[1]?.match(/code=(.*)/)
    if (email.length > 1 && code.length > 1) {
      const params = {
        email: email[1],
        code: code[1]
      }
      if (params.email && params.code) {
        this.params = params
        // this.onSubmitLink()
      }
    }
  },
  watch: {
    verifyStatus: {
      handler() {
        if (this.loginStore.verifyStatus) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 180,
            message: 'Verifying...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  methods: {
    async onSubmitLink() {
      if (!this.params.code) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Invalid link'
        })
      } else if (!this.params.email) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Please enter a valid email'
        })
      }
      if (this.params.email && this.params.code) {
        this.loading = true
        this.loginStore.isVerifyStatus(true)
        await this.loginStore.loginUserVerify(
          {
            username: this.params.email,
            answer: this.params.code
          },
          this.$router
        )
        this.loading = false
      }
    }
  },
  setup() {
    const loginStore = useLoginStore()

    return {
      loginStore
    }
  }
}
</script>

<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Russo+One);

.welcome-appsec :deep(div:first-child) {
  padding-bottom: 31.6667% !important;
}
svg {
  font-family: 'Russo One', sans-serif;
  margin-top: 0.4rem;
  position: absolute;
  width: 100%;
  height: 100%;
}
svg text {
  animation: stroke 5s infinite alternate;
  font-size: 160px;
  stroke-width: 2;
  stroke: $primary;
}
@keyframes stroke {
  0% {
    fill: rgba(72, 138, 20, 0);
    stroke: $primary;
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 2;
  }
  70% {
    fill: rgba(72, 138, 20, 0);
    stroke: $primary;
  }
  80% {
    fill: rgba(72, 138, 20, 0);
    stroke: $primary;
    stroke-width: 3;
  }
  100% {
    fill: rgba(72, 138, 204, 1);
    stroke: rgba(54, 95, 160, 0);
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}
</style>
