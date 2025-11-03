<template>
  <div>
    <transition name="component-fade" appear mode="out-in" :duration="{ enter: 1000, leave: 800 }" v-if="default_show">
      <div class="centerAlignment">
        <q-card class="card_center" style="width: 45%; height: 45%">
          <div class="row">
            <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <q-img src="~assets/appsec-logo.png" style="height: auto; width: 40%"></q-img>
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 portal_xxlg" v-if="msOauthStore.isLoading" color="primary">
              <br />
              Loading...
            </div>
            <div
              class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 portal_xxlg"
              v-else-if="msOauthStore.statusOfAPI && !msOauthStore.isLoading"
              color="primary"
            >
              <br />
              Logged in successfully redirecting...
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 portal_xxlg" v-else>
              <br />
              <p style="color: red" v-if="!msOauthStore.isLoading">
                Unable to contact.
                <b v-if="msOauthStore.status_of_change.msg">{{ msOauthStore.status_of_change.msg }}</b>
              </p>
            </div>
          </div>
        </q-card>
      </div>
    </transition>
  </div>
</template>

<script>
import { QSpinnerFacebook } from 'quasar'
import { useMsOauthStore } from 'src/store/pinia/msOauth'
export default {
  name: 'MSOAUTHCONFIGURED',
  components: {},
  setup() {
    const msOauthStore = useMsOauthStore()
    return {
      msOauthStore
    }
  },
  data() {
    return {
      showProfile: true,
      showSubscription: false,
      showBadges: false,
      showChangePassword: false,
      textActivated: 'oauth',
      default_show: false
    }
  },
  async mounted() {
    await window.addEventListener('load', () => {
      this.msOauthStore.login_user({ code: this.$route.query.code })
    })
    await this.showPage()
  },
  watch: {
    'msOauthStore.isLoading': {
      handler() {
        if (this.msOauthStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  methods: {
    showPage() {
      this.default_show = true
    }
  }
}
</script>
<style scoped>
.card_center {
  margin: auto;
  width: 50%;
  border: 1px solid #acadad;
  border-radius: 0px;
  padding: 10px;
  background: -webkit-linear-gradient(right, #acadad, #e7e9eb 20%, white 100%, #2b2d7d);
}
</style>
