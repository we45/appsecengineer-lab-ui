<template>
  <div>
    <transition appear name="custom-login-transition" enter-active-class="animated slideInRight">
      <div>
        <q-form class="q-gutter-md card_setting" @submit.prevent="onSubmit()">
          <div class="col text-h6 ellipsis">CONFIRM USER</div>
          <hr />
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput v-model="email" type="email" required label="'Email *'" :rules="emailValidation"></BaseInput>
                <p v-if="confirmUserStore.errorConfirmCode.email" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmCode.email_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput v-model="code" required :title="'Code *'" :rules="[...required, ...maxLength(5000)]" />
                <p v-if="confirmUserStore.errorConfirmCode.code" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmCode.code_msg }}
                </p>

                <p class="text-link text-right" @click="confirmCodesPopupAction()">Resend Code</p>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="row">
            <div class="col-4">
              <p class="text-link" @click="loginBack()">Already have an account?</p>
            </div>
            <div class="col">
              <q-btn
                push
                type="submit"
                size="18px"
                :loading="confirmUserStore.isFetch"
                color="primary"
                style="width: 150px"
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
        <template v-if="showPopup">
          <div>
            <ConfirmCodesPopup
              :show="showPopup"
              :loadingStatus="confirmUserStore.resendCodeStatus"
              v-model="emailCode"
              @confirmCancel="confirmCancel"
              @confirmSubmit="confirmSubmit"
              :errorStatus="confirmUserStore.errorResendCode.email"
              :errorStatusMsg="confirmUserStore.errorResendCode.email_msg"
            ></ConfirmCodesPopup>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>
<script>
import ConfirmCodesPopup from 'components/confirm_user/ConfirmCodesPopup.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import { email, maxLength, required } from 'src/utils/rules'
import { useConfirmUser } from 'src/store/pinia/confirmUser'

export default {
  name: 'ConfirmUserWithCodeInfo',
  setup() {
    const confirmUserStore = useConfirmUser()
    return {
      confirmUserStore
    }
  },
  data() {
    return {
      code: '',
      email: this.userId ? this.userId : '',
      emailCode: '',
      showPopup: false,
      maxLength,
      required,
      emailValidation: email
    }
  },
  props: {
    userId: {
      type: String,
      required: false
    }
  },
  components: {
    BaseInput,
    ConfirmCodesPopup
  },
  methods: {
    onSubmit() {
      const data = {
        code: this.code,
        email: this.email
      }
      this.confirmUserStore.isConfirmUserStatus(true)
      this.confirmUserStore.confirmCode(data)
    },
    loginBack() {
      this.$router.push('/')
    },
    confirmCodesPopupAction() {
      this.emailCode = ''
      this.showPopup = true
    },
    confirmCancel() {
      this.showPopup = false
    },
    async confirmSubmit(event) {
      const data = {
        email: this.emailCode
      }
      this.confirmUserStore.isResendCodeStatus(true)
      await this.confirmUserStore.resendCode(data)
      if (this.confirmUserStore.errorResendCode.status) {
        this.showPopup = false
      }
    }
  }
}
</script>
<style scoped>
.card_setting {
  width: 90%;
  background: #f3f3fd;
  padding: 3% 5% 3% 3%;
  margin-left: 10%;
  margin-top: 3%;
  box-shadow: 10px 10px 30px #5451e124;
  border-radius: 18px;
  opacity: 1;
}
</style>
