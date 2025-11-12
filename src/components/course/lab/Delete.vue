<template>
  <AseDialog v-model="showDialog" :title="title" @hide="confirmDeleteCancel()">
    <div class="q-my-md text-center text-h6">Are you sure {{ header }}?</div>
    <template #footer>
      <div class="row justify-end q-pr-md">
        <AseButton variant="primary" :loading="loading" :disabled="loading" @click="confirmDelete()">Yes</AseButton>
      </div>
    </template>
  </AseDialog>
</template>

<script>
export default {
  name: 'Delete',
  props: {
    show: {
      type: Boolean
    },
    header: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Quit'
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
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
  }
}
</script>
