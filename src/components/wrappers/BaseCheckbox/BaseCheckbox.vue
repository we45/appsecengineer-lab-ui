<template>
  <q-checkbox v-bind="$attrs">
    <template #default>
      <slot />
    </template>
  </q-checkbox>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  inheritAttrs: false
}
</script>

<style></style>
