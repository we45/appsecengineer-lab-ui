<template>
  <q-layout class="bg_dark">
    <q-header class="bg_dark" :elevated="false">
      <div class="bg-dark">
        <img src="~assets/appsec.png" class="text-white" style="width: 150px; height: 100%" />
      </div>
    </q-header>
    <q-page-container class="bg_dark">
      <q-page>
        <div class="row flex-center items-center centerAlignmentDiv">
          <div class="flex flex-center" style="width: 60vw">
            <company-user-signup :id="companyId" :dynmicField="dataCustom"></company-user-signup>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import CompanyUserSignUp from 'components/signup/CompanyUserSignUp.vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

export default {
  name: 'CompanySignUpIndex',
  components: {
    'company-user-signup': CompanyUserSignUp
  },
  data() {
    return {
      companyId: '',
      dataCustom: []
    }
  },
  async created() {
    this.param = this.$route.params.id
    this.companyId = urlSafeBase64Decode(this.param)
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;600&display=swap');
.login_title {
  color: #000033;
  text-align: left;
  display: block;
  font: normal normal bold 30px/32px Poppins;
}
.centerAlignmentDiv {
  /* display: table-cell;
    height: 100vh;
    margin: 0 auto;
    width: 100vw;
    vertical-align: middle;
    text-align: center; */
  /* margin: 0; */
  /* position: absolute; */
  position: relative;
  top: 20%;
  height: 80vh;
}
</style>
