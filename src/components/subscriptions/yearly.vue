<template>
  <div class="annual_bordered">
    <q-img
      :ratio="16 / 16"
      style="border-top-left-radius: 7px; border-top-right-radius: 7px"
      src="src/assets/subscription-courses-imgs/621f14c8b7c4665a2dc3422e_Annual All access – 2.png"
    />
    <div style="min-height: 25vh; padding: 5%">
      <div align="middle">
        <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade" style="display: block">Annual</p>
      </div>
      <div align="middle">
        <p class="text-h6 text-weight-bold ase-roboto" style="display: inline-block; color: #f1592a">$33.25 USD</p>
        <span style="display: inline-block">
          <p class="text-subtitle2 text-weight-bold ase-roboto" style="display: inline-block; color: #f1592a">/month</p>
        </span>
      </div>
      <div align="middle">
        <p class="text-subtitle2 text-weight-regular ase-roboto" style="display: inline-block; color: #6b6b6b">Paid Annually At $399</p>
      </div>
      <div align="middle">
        <p class="text-subtitle2 text-weight-regular ase-roboto" style="display: inline-block; color: #6b6b6b">
          Upgrade to our basic plan and avail all features
        </p>
      </div>
    </div>
    <div class="padding_12">
      <q-btn
        push
        color="secondary"
        size="sm"
        @click="$emit('yearlyClick', { url: 'https://staging.checkout.appsecengineer.com/yearly' })"
        class="text-subtitle1 text-weight-bold ase-roboto full-width"
        text-color="white"
        style="font-weight: 600; font-size: 12px"
      >
        UPGRADE
      </q-btn>
    </div>
  </div>
</template>
<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
export default {
  name: 'SubacriptionMonthlyIndividualView',
  props: {
    data: {},
    title: {},
    subsKey: {},
    logo: {}
  },
  methods: {
    showLearningPathInfo(id) {
      this.$router.push(`/portal/learning-path-individual/${urlSafeBase64Encode(id)}`)
    },
    moveToIndividualLp(data) {}
  }
}
</script>
<style scoped>
.annual_bordered {
  margin: 30px 10px;
  padding-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #eaeaea;
}
.scale_btn {
  font-weight: 600;
  font-size: 16px;
}
.scale_btn:hover {
  position: relative;
  transition: transform 0.3s ease;
  transform: translateY(5px);
  background-color: #fff;
}
.scale_btn:focus {
  position: relative;
  transition: transform 0.3s ease;
  transform: translateY(5px);
  background-color: #fff;
}
.padding_rightside {
  padding-right: 7px;
}
</style>
