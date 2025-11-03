<template>
  <div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Are you sure want to {{ header }} ?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input outlined autofocus placeholder="Type  YES" @keyup.enter="prompt = false" v-model="name" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" label="No" @click="confirmDeleteCancel()" />
          <q-btn color="primary" label="Yes" @click="confirmDelete()" v-if="name === 'YES'" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Enable',
  props: ['show', 'modelValue', 'header'],
  emits: ['update:modelValue'],
  data() {
    return {
      showDialog: this.show
    }
  },
  methods: {
    confirmDelete() {
      this.$emit('confirmDelete', { show: true })
    },
    confirmDeleteCancel() {
      this.$emit('confirmDeleteCancel', { show: true })
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
