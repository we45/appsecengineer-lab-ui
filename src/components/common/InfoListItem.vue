<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div v-bind="$attrs" flat class="q-pa-xs q-my-sm row items-start no-wrap info_wrapper" style="padding-left: 5px; border-radius: 5px">
    <div class="list-info-icon row items-center justify-center">
      <q-icon name="info" size="19px" color="white" />
    </div>
    <span class="q-ml-sm q-mt-xs">{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
.info_wrapper {
  border: 1px solid $border-2;
  .list-info-icon {
    background-color: $primary;
    min-height: 25px;
    min-width: 25px;
    border-radius: 5px !important;
  }
}
</style>
