<template>
  <div class="col text-center">
    <slot name="title">
      <div class="text-h5 text-grey text-weight-bold" v-if="title">{{ title }}</div>
    </slot>
    <slot name="description">
      <div class="text-body1 text-grey-5" v-if="description">{{ description }}</div>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    description: String
  }
}
</script>

<style scoped lang="scss"></style>
