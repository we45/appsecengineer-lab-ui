<template>
  <q-layout>
    <q-header class="bg_color" :elevated="false" style="border-bottom: 3px solid #f5f5fc">
      <q-img src="~assets/appsec-logo.png" class="text-white" style="width: 150px; height: 100%"></q-img>
    </q-header>
    <q-page-container class="bg_color">
      <q-page>
        <div class="row items-center centerAlignmentDiv">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <confirm-user :userId="userIdEmail"></confirm-user>
          </div>
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-6 col-lg-6" align="left">
            <q-img src="~assets/LoginPageSide.png" style="margin-top: 10%; width: 80%; height: 80%"></q-img>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import ConfirmUser from 'components/confirm_user/ConfirmUserWithCodes.vue'
import { LocalStorage } from 'quasar'

export default {
  name: 'ConfirmUserIndex',
  components: {
    'confirm-user': ConfirmUser
  },
  data() {
    return {
      userIdEmail: ''
    }
  },
  created() {
    this.userIdEmail = LocalStorage.getItem('userId', '')
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;600&display=swap');
.login_title {
  color: #05008c;
  text-align: left;
  font: normal normal bold 40px/52px Poppins;
}
.centerAlignmentDiv {
  position: relative;
  top: 20%;
  height: 80vh;
  background-image: radial-gradient(circle, #f5f5fc 20%, #ffffff 100%);
}
.bg_color {
  background-image: radial-gradient(circle, #f5f5fc 20%, #ffffff 100%);
}
.login_form_style {
  width: 80%;
  background: #f3f3fd;
  padding: 5%;
  box-shadow: 10px 10px 30px #5451e124;
  border-radius: 18px;
  opacity: 1;
}
.login_btn {
  background: #00ffba 0% 0% no-repeat padding-box;
  border-radius: 4px;
  font-size: 14px;
  padding: 7px;
  color: #05008c;
  border: #00ffba;
  font-weight: 900;
}
</style>
