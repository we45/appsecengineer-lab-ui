<template>
  <div class="base-label text-body-1">
    <slot>{{ label }}</slot>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseLabel',
  props: {
    label: String
  }
})
</script>
<style>
.base-label {
  margin-bottom: 5px;
}
</style>
