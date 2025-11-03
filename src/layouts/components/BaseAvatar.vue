<template>
  <q-avatar v-bind="$attars">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :name="slot.name" />
    </template>
  </q-avatar>
</template>
<script>
export default {
  name: 'BaseAvatar',
  setup() {}
}
</script>
