<template>
  <slot :name="`template-sidebar-mini-${item.name}`">
    <q-item
      class="cursor_pointer mini-item sidebar-link-item"
      :to="{ name: item.route }"
      role="menuitem"
      :aria-label="`Navigate to ${item.label}`"
    >
      <q-item-section side>
        <q-avatar size="50px" style="border-radius: 6px !important">
          <q-img :src="`/newIcons/${item.img}.png`" height="40px" width="40px" fit="fill" aria-hidden="true" />
          <q-tooltip class="text-subtitle2 text-weight-bold ase-roboto" anchor="center right" self="center left" :aria-hidden="true">
            {{ item.label }}
          </q-tooltip>
        </q-avatar>
      </q-item-section>
    </q-item>
  </slot>
</template>

<script setup>
import { useQuasar } from 'quasar'

defineProps({
  item: { type: Object, required: true, default: () => {} }
})

const $q = useQuasar()
</script>

<style lang="scss">
.mini-item {
  .q-focus-helper {
    display: none !important;
  }
}
</style>
