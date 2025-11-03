<template>
  <div>
    <transition appear name="custom-login-transition" enter-active-class="animated slideInRight">
      <div style="padding-left: 5%">
        <q-form class="q-gutter-md login_form_style" @submit.prevent="onSubmit()">
          <div class="col portal_xlg portal_bold ellipsis">CONFIRM USER</div>
          <hr />
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput v-model="email" type="email" required label="'Email *'" :rules="[...required, ...email]"></BaseInput>
                <p v-if="confirmUserStore.errorConfirmUser.email" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmUser.email_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput
                  v-model="password"
                  type="password"
                  required
                  label="'Password *'"
                  :rules="[...required, ...maxLength(50)]"
                ></BaseInput>
                <p v-if="confirmUserStore.errorConfirmUser.old_password" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmUser.old_password_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput
                  v-model="newPassword"
                  type="password"
                  required
                  label="'Password *'"
                  :rules="[...required, ...maxLength(50)]"
                ></BaseInput>

                <p v-if="confirmUserStore.errorConfirmUser.new_password" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmUser.new_password_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <BaseInput
                  v-model="newPassword"
                  type="password"
                  required
                  label="'Password *'"
                  :rules="[...required, ...maxLength(50), ...sameAs(newPassword)]"
                ></BaseInput>
                <p v-if="confirmUserStore.errorConfirmUser.confirm_password" class="text-caption text-negative">
                  {{ confirmUserStore.errorConfirmUser.confirm_password_msg }}
                </p>
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
      </div>
    </transition>
  </div>
</template>
<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { email, maxLength, required, sameAs } from 'src/utils/rules'
import { useConfirmUser } from 'src/store/pinia/confirmUser'

export default {
  name: 'ConfirmUserInfo',
  setup() {
    const confirmUserStore = useConfirmUser()
    return { confirmUserStore }
  },
  data() {
    return {
      email: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      required,
      maxLength,
      emailValidation: email,
      sameAs
    }
  },
  components: {
    BaseInput
  },
  methods: {
    onSubmit() {
      const data = {
        email: this.email,
        old_password: this.password,
        new_password: this.confirmPassword
      }
      this.confirmUserStore.isConfirmUserStatus(true)
      this.confirmUserStore.confirmUser(data)
    },
    loginBack() {
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.login_form_style {
  width: 100%;
  background: #f3f3fd;
  padding: 5% 7% 5% 5%;
  box-shadow: 10px 10px 30px #5451e124;
  border-radius: 18px;
  opacity: 1;
}
</style>
