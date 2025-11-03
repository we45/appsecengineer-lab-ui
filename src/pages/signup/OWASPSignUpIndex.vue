<template>
  <q-layout class="bg_dark">
    <q-header class="bg_dark" :elevated="false">
      <q-img src="~assets/appsec.png" class="text-white cursor_pointer" style="width: 150px; height: 100%"></q-img>
    </q-header>
    <q-page-container class="bg_dark">
      <q-page>
        <div class="row flex-center items-center centerAlignmentDiv">
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12" style="width: 70%">
            <owasp-user-signup :id="companyId" :name="companyName"></owasp-user-signup>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import OWASPUserSignUp from 'components/signup/OWASPUserSignUp.vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

export default {
  name: 'OWASPSignUpIndex',
  components: {
    'owasp-user-signup': OWASPUserSignUp
  },
  created() {
    this.param = this.$route.params.id
    this.paramName = this.$route.params.name

    this.companyId = urlSafeBase64Decode(this.param)
    this.companyName = urlSafeBase64Decode(this.paramName)
  },
  methods: {
    redirectFunction(type) {
      if (type === 'ASE') {
        const url = 'https://appsecengineer.com/'
        window.open(url, '_blank')
      } else {
        const url = 'https://owasp.org/'
        window.open(url, '_blank')
      }
    }
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
  background-color: #000033;
  color: #ffffff;
}
.bg_color {
  background-color: #000033;
  color: #ffffff;
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
.image_alignment {
  /* margin-top:7%; */
  width: 75%;
}
</style>
