<template>
  <div>
    <transition name="component-fade" appear mode="out-in" :duration="{ enter: 1000, leave: 800 }">
      <div class="centerAlignment">
        <q-card class="card_center" style="width: 45%; height: 45%">
          <div class="row">
            <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <q-img src="~assets/appsec-logo.png" style="height: auto; width: 40%"></q-img>
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12 portal_xxlg">
              <br />
              <p style="color: red">Unable to contact Microsoft.</p>
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
      textActivated: 'oauth'
    }
  },
  created() {},
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
