<template>
  <div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">{{ header }} ?</div>
        </q-card-section>
        <q-separator />
        <br />
        <q-card-section class="q-pt-none">
          <q-input label-color="white" outlined dense autofocus placeholder="Type  YES" @keyup.enter="prompt = false" v-model="name" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            push
            color="secondary"
            size="xs"
            style="padding-right: 2%; font-weight: 600; font-size: 12px"
            @click="confirmSendCancel()"
            class="text-subtitle2 text-weight-regular ase-roboto"
            text-color="white"
          >
            Cancel
          </q-btn>
          <q-btn
            v-if="name === 'YES'"
            push
            color="secondary"
            size="xs"
            style="padding-right: 2%; font-weight: 600; font-size: 12px"
            @click="confirmSend()"
            class="text-subtitle1 text-weight-regular ase-roboto"
            text-color="white"
          >
            SEND
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'SEND',
  props: ['show', 'header', 'modelValue'],
  emits: ['update:modelValue'],
  components: {},
  data() {
    return {
      showDialog: this.show
    }
  },
  methods: {
    confirmSend() {
      this.$emit('confirmSend', { show: true })
    },
    confirmSendCancel() {
      this.$emit('confirmSendCancel', { show: true })
    }
  },
  computed: {
    name: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
