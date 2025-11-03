<template>
  <q-form v-bind="$attrs">
    <template #default>
      <slot />
    </template>
  </q-form>
</template>
<script>
export default {
  name: 'BaseForm',
  inheritAttrs: false
}
</script>
<script></script>
