<script setup>
defineProps({
  title: {
    type: String,
    default: 'Page title'
  }
})
</script>

<template>
  <h5 v-bind="$attrs" class="ase_page_title font-paytone q-my-md" role="heading">{{ title }}</h5>
</template>

<style lang="scss" scoped>
.ase-page-title {
  font-size: 26px;
  color: $text-primary;
}
</style>
