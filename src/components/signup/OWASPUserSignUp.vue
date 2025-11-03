<template>
  <div>
    <transition appear name="custom-login-transition" enter-active-class="animated slideInRight">
      <div class="card_setting">
        <q-form class="q-gutter-md" @submit="onSubmit">
          <div class="col portal_xlg portal_bold ellipsis color_blue">
            <p class="text-h6 text-weight-bold ase-roboto ase-black-shade none-spacing text-left">{{ name.toUpperCase() }}</p>
            <p class="text-subtitle1 ase-roboto ase-black-shade none-spacing">Sign Up</p>
          </div>
          <hr />
          <BaseInput label="First Name *" required :rules="[...minLength(1), ...maxLength(50)]" v-model="firstName" />
          <p v-if="signUpStore.errorOWASPCreateUser.first_name" class="text-caption text-negative">
            {{ signUpStore.errorOWASPCreateUser.first_name_msg }}
          </p>

          <BaseInput label="Last Name *" required :rules="[...minLength(1), ...maxLength(50)]" v-model="lastName" />
          <p v-if="signUpStore.errorOWASPCreateUser.last_name" class="text-caption text-negative">
            {{ signUpStore.errorOWASPCreateUser.last_name_msg }}
          </p>

          <BaseInput label="Email *" type="email" required :rules="emailValidation" v-model="email" />
          <p v-if="signUpStore.errorOWASPCreateUser.email" class="text-caption text-negative">
            {{ signUpStore.errorOWASPCreateUser.last_name_msg }}
          </p>

          <input type="hidden" id="signup-client-id" name="signup-client-id" />

          <div class="row">
            <div class="col-md-12">
              <p class="text-caption text-weight-regular ase-roboto ase-black-shade none-spacing">
                Note: First name and Last name given here will be reflected in certificate
              </p>
            </div>
            <div class="col-6">
              <p class="text-caption text-weight-regular ase-roboto none-spacing text-link cursor_pointer" @click="loginBack()">
                Already have an account?
              </p>
            </div>
            <div class="col">
              <q-btn
                class="float-right ase-roboto"
                color="secondary"
                :loading="signUpStore.isRegistered"
                push
                size="16px"
                :style="{ 'font-weight': 500, 'font-size': '14px', 'margin-bottom': '0px' }"
                style="width: 150px"
                type="submit"
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
        <p class="appsec-p color_blue portal_family_roboto">
          By signing up, I confirm that I have read and accepted the
          <br />
          <a href="https://appsecengineer.com/privacy-policy/" target="”_blank”">Privacy Policy</a>
          and
          <a href="https://assets.appsecengineer.com/Terms%20of%20Use.pdf" target="”_blank”">Terms of Use</a>
          of AppSecEngineer
        </p>
        <vue-recaptcha ref="recaptcha" theme="light" size="normal" :tabindex="0" @verify="onVerify($event)" @expired="onExpired($event)" />
      </div>
    </transition>
  </div>
</template>
<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { email, maxLength, minLength } from 'src/utils/rules'
import { VueRecaptcha } from 'vue3-recaptcha-v2'

import { LocalStorage } from 'quasar'
import { useSignUpStore } from 'src/store/pinia/signUp'

export default {
  name: 'OWASPUserSignUp',
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
      maxLength,
      minLength,
      emailValidation: email
    }
  },
  props: {
    id: {
      required: true
    },
    name: {
      required: true
    }
  },
  async created() {
    await this.idgen()
  },
  methods: {
    async idgen() {
      if (window.origin === 'https://learning.appsecengineer.com') {
        window.ga =
          window.ga ||
          function () {
            ;(ga.q = ga.q || []).push(arguments)
          }
        ga.l = +new Date()
        await ga('create', 'UA-12164530-11', 'auto')
        await ga('send', 'pageview')
        await ga(function (tracker) {
          document.getElementById('signup-client-id').value = tracker.get('clientId')
          LocalStorage.set('gCID', tracker.get('clientId'))
        })
      }
    },
    async onSubmit() {
      const data = {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        partner_id: this.id
      }
      if (window.origin === 'https://learning.appsecengineer.com' && LocalStorage.getItem('pCID')) {
        data.signup_client_id = LocalStorage.getItem('pCID')
      }
      this.signUpStore.isRegisterStatus(true)
      await this.signUpStore.OWASPUserSignUp(data)
    },
    loginBack() {
      this.$router.push('/')
    },
    onVerify(response) {
      this.verifyData = response
      const data = {
        recaptch_response: response
      }
      this.signUpStore.recaptchValidate(data)
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
