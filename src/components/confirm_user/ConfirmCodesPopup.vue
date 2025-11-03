<template>
  <div>
    <q-dialog v-model="showDialog" persistent @escape-key="confirmCancel()">
      <q-form @submit="confirmSubmit">
        <q-card style="width: 600px; max-width: 80vw">
          <q-card-section class="padding_12">
            <q-bar class="bg-white none-spacing">
              <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">Email</p>
              <q-space />
              <q-btn color="secondary" round size="sm" icon="close" @click="confirmCancel()" />
            </q-bar>
            <hr />
          </q-card-section>
          <q-card-section>
            <BaseInput type="text" v-model="emailValue" label="Email" required :rules="email"></BaseInput>
            <p v-if="errorStatus" class="text-caption text-negative">{{ errorStatusMsg }}</p>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right" class="text-primary">
            <q-btn
              label="Submit"
              push
              type="submit"
              size="14px"
              color="primary"
              class="float-left"
              :loading="loadingStatus"
              @click="confirmSubmit()"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Loading...
              </template>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </q-dialog>
  </div>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import { email } from 'src/utils/rules'

export default {
  name: 'ConfirmCodesPopup',
  components: {
    BaseInput
  },
  props: ['show', 'name', 'errorStatus', 'errorStatusMsg', 'loadingStatus', 'modelValue'],
  data() {
    return {
      showDialog: this.show,
      email
    }
  },
  computed: {
    emailValue: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    confirmSubmit() {
      this.$emit('confirmSubmit', { show: true })
    },
    confirmCancel() {
      this.$emit('confirmCancel', { show: true })
    }
  }
}
</script>
