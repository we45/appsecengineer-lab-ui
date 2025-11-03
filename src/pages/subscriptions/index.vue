<template>
  <q-layout view="lHh lpr lFf" container style="min-height: 100vh">
    <div>
      <breadcrumbindex />
    </div>
    <q-page-container
      v-bind:class="{
        blur_data_disable: !profileStore.accessableSubs['Free-Account-USD-Yearly'],
        blur_data_disable: profileStore.accessableSubs['All-Access-Pass-Yearly-USD-Yearly']
      }"
    >
      <q-page class="q-pa-md">
        <div class="row flex flex-center">
          <div class="col-md-3">
            <div class="monthly" v-bind:class="{ blur_data_disable: profileStore.accessableSubs['All-Access-Pass-Monthly-USD-Monthly'] }">
              <Monthly @monthlyClick="callSubscriptionAPI('All-Access-Pass-Monthly-USD-Monthly', '')" />
            </div>
          </div>
          <div class="col-md-3">
            <div class="yearly">
              <Yearly @yearlyClick="callSubscriptionAPI('All-Access-Pass-Yearly-USD-Yearly', '')" />
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <p class="text-caption text-center none-spacing text-weight-bold ase-roboto red none-spacing">
            Note: Once you upgraded any plan, please make sure that you logout and login into the portal to see the updated courses.
          </p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import BreadCrumbIndex from 'components/breadcrumb/BreadCrumbIndex.vue'
import Monthly from 'components/subscriptions/monthly.vue'
import Yearly from 'components/subscriptions/yearly.vue'
import { QSpinnerFacebook } from 'quasar'

import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useProfileStore } from 'src/store/pinia/profile'
import { useMacroMetaStore } from 'src/store/pinia/macroMeta'
import { useLearningPathStore } from 'src/store/pinia/learningPath'

export default {
  name: 'subscriptionPageInfo',
  components: {
    Monthly,
    Yearly,
    breadcrumbindex: BreadCrumbIndex
  },
  setup() {
    const profileStore = useProfileStore()
    const macroMetaStore = useMacroMetaStore()
    const learningPath = useLearningPathStore()
    return {
      profileStore,
      macroMetaStore,
      learningPath
    }
  },
  data() {
    return {
      paymentInfoWindow: false
    }
  },
  async created() {
    await this.profileStore.fetchAccessableSubs()
    const data = { query: '_count' }
    await this.learningPath.fetchLearningPath(data)
  },
  watch: {
    'profileStore.isLoading': {
      handler() {
        if (this.profileStore.isLoading) {
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
    },
    'learningPath.isLoading': {
      handler() {
        if (this.learningPath.isLoading) {
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
    showLearningPathInfo(id) {
      this.$router.push(`/portal/learning-path/${urlSafeBase64Encode(id)}`)
    },
    redirectLink(link) {
      const url = `https://staging.checkout.appsecengineer.com/${link}`
      window.open(url, '_blank')
    },
    async callSubscriptionAPI(planID, lpId = '') {
      if (lpId) {
        this.macroMetaStore.publishUpgradeStats({
          learning_path: [lpId]
        })
      } else {
        this.macroMetaStore.publishUpgradeStats({})
      }
      if (
        !this.profileStore.profileDetailedInfo.first_name &&
        !this.profileStore.profileDetailedInfo.last_name &&
        !this.profileStore.profileDetailedInfo.email
      ) {
        await this.profileStore.fetchProfileDetailedInformation()
      }
      if (
        this.profileStore.profileDetailedInfo.first_name &&
        this.profileStore.profileDetailedInfo.last_name &&
        this.profileStore.profileDetailedInfo.email
      ) {
        await this.profileStore.getSubscriptionInfo({
          first_name: this.profileStore.profileDetailedInfo.first_name,
          last_name: this.profileStore.profileDetailedInfo.last_name,
          email: this.profileStore.profileDetailedInfo.email,
          plan_price_id: planID
        })
      }
      if (this.profileStore.paymentInfo) {
        const url = this.profileStore.paymentInfo.url
        window.open(url, '_blank')
      }
    },
    confirmCancel() {
      this.paymentInfoWindow = false
    }
  }
}
</script>
<style scoped>
.bgColorDark {
  align-items: center;
  border-bottom: 1px solid #23233b;
  background-color: #1c1c33;
  color: #f6f6f8;
  min-height: 12vh;
  width: 100%;
  margin: 0 auto;
}
.title_info {
  color: #1c1c33;
  font-size: 34px;
  font-weight: 900;
}
.sub_title_info {
  color: #4e4e65;
  font-size: 18px;
}
.bold_sub_title_info {
  color: #1c1c33;
  font-size: 18px;
  font-weight: 900;
}
.spacing_12 {
  margin-top: 12px;
}
.title_img_info {
  width: 80%;
  color: #fff;
}
.title_img_info:hover {
  width: 80%;
  color: #fff;
}
.spacing_custom {
  padding: 2%;
}
.bg_color {
  background-color: #000033;
  color: #ffffff;
}
.blur_data_disable {
  filter: saturate(25%);
  color: rgb(158, 157, 157) !important;
  pointer-events: none;
}
.small_cards {
  background-color: #5451e1;
  border-radius: 5px;
  padding: 7px;
  width: 95%;
}
.scale_btn {
  font-weight: 600;
  font-size: 12px;
}
.scale_btn:hover {
  position: relative;
  transition: transform 0.3s ease;
  transform: translateY(2px);
  background-color: #fff;
}
.scale_btn:focus {
  position: relative;
  transition: transform 0.3s ease;
  transform: translateY(2px);
  background-color: #fff;
}
</style>
