<template>
  <div v-if="show" class="col-12 column items-center justify-center q-pa-xs q-pb-md" role="status">
    <q-spinner color="primary" size="6em" v-if="loading" aria-label="Loading..." />
    <slot name="image">
      <q-img contain :src="noDataImage" width="30vw" v-if="!loading" alt="" />
    </slot>

    <div class="text-center" :class="{ 'text-light-2': dark }" role="alert">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import noDataImage from 'assets/nData.png'

const props = defineProps({
  title: {
    type: String,
    default: 'Sorry, No Data Found'
  },
  loading: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: true
  },
  dark: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.text-light-2 {
  color: $text-light-2 !important;
}
</style>
