<template>
  <div>
    <div class="card_setting">
      <q-form class="q-gutter-md" @submit.prevent="onSubmit()">
        <div class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing padding_12">Sign Up</div>
        <hr />
        <div class="row">
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BaseInput label="First Name *" required :rules="[...maxLength(50)]" v-model="firstName" />
            <p v-if="signUpStore.errorCreateUser.first_name" class="text-caption text-negative">
              {{ signUpStore.errorCreateUser.first_name_msg }}
            </p>
          </div>
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BaseInput label="Last Name *" required :rules="[...maxLength(50)]" v-model="lastName" />
            <p v-if="signUpStore.errorCreateUser.last_name" class="text-caption text-negative">
              {{ signUpStore.errorCreateUser.last_name_msg }}
            </p>
          </div>
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <BaseInput label="Email" required :rules="[...required, emailValidation]" v-model="email" />
            <p v-if="signUpStore.errorCreateUser.email" class="text-caption text-negative">{{ signUpStore.errorCreateUser.email_msg }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <p class="text-caption text-weight-bold ase-roboto ase-black-light none-spacing">
              Note: First name and Last name given here will be reflected in certificate
            </p>
          </div>
          <div class="col-6">
            <a href="#" @click="loginBack()">Already have an account?</a>
          </div>
          <div class="col">
            <q-btn
              color="secondary"
              push
              type="button"
              size="16px"
              @click="onSubmit()"
              :loading="signUpStore.isRegistered"
              :style="{ 'font-weight': 500, 'font-size': '14px', 'margin-bottom': '0px' }"
              class="float-right"
            >
              SUBMIT
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Loading...
              </template>
            </q-btn>
          </div>
        </div>
      </q-form>
      <p class="appsec-p color_blue ase-roboto portal_sm">
        By signing up, I confirm that I have read and accepted the
        <br />
        <a href="https://appsecengineer.com/privacy-policy/" target="”_blank”">Privacy Policy</a>
        and
        <a href="https://assets.appsecengineer.com/Terms%20of%20Use.pdf" target="”_blank”">Terms of Use</a>
        of AppSecEngineer
      </p>
      <br />
      <vue-recaptcha ref="recaptcha" theme="light" size="normal" :tabindex="0" @verify="onVerify($event)" @expired="onExpired($event)" />
    </div>
  </div>
</template>
<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { email, maxLength, required } from 'src/utils/rules'
import { VueRecaptcha } from 'vue3-recaptcha-v2'

import { useSignUpStore } from 'src/store/pinia/signUp'

export default {
  name: 'CompanyUserSignUp',
  components: {
    VueRecaptcha,
    BaseInput
  },
  setup() {
    const signUpStore = useSignUpStore()
    return { signUpStore }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isVerified: false,
      confirm_password: '',
      password_test_conditions: {
        caps: false,
        num: false,
        small: false,
        eight: false,
        len: false,
        spe: false
      },
      companyFieldsArray: [],
      maxLength,
      emailValidation: email,
      required
    }
  },
  async created() {},
  props: {
    id: {
      required: true
    },
    dynmicField: {}
  },
  methods: {
    async onSubmit() {
      const data = {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        company_id: this.id
      }
      this.signUpStore.isRegisterStatus(true)
      await this.signUpStore.userCompanySignUp(data)
    },
    loginBack() {
      this.$router.push('/')
    },
    async onVerify(response) {
      this.verifyData = response
      const payload = {
        recaptch_response: response
      }
      await this.signUpStore.recaptchValidate(payload)
    },
    onExpired(response) {
      this.expData = response
    }
  }
}
</script>
<style scoped>
.card_setting {
  width: 90%;
  background: #f3f3fd;
  padding: 3% 5% 3% 3%;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  box-shadow: 10px 10px 30px #5451e124;
  border-radius: 18px;
  opacity: 1;
}
.color_blue {
  color: #000033;
}
</style>
