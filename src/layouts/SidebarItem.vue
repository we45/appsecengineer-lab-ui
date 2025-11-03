<template>
  <slot :name="`template-sidebar-${item.name}`">
    <q-item
      class="q-py-sm"
      :class="{
        'q-my-none admin-sidebar-item': adminItem,
        'sidebar-link-item': !adminItem
      }"
      clickable
      v-ripple
      :to="{ name: item.route }"
      role="menuitem"
      :aria-label="`Navigate to ${item.label}`"
      @click="handleItemClick"
    >
      <q-item-section v-if="!adminItem" side>
        <q-img :src="`/newIcons/${item.img}.png`" height="40px" width="40px" fit="fill" style="scale: 1.2" aria-hidden="true" />
      </q-item-section>
      <q-item-section>
        <div class="sidebar-item-label row items-center" :class="labelClases" :aria-hidden="true">
          {{ item.label }}
          <q-chip v-if="item.beta" dense size="sm" class="beta-chip bg-indigo-gradient">BETA</q-chip>
          <q-tooltip v-if="item.beta && item.betaMessage">{{ item.betaMessage }}</q-tooltip>
        </div>
      </q-item-section>
    </q-item>
  </slot>
</template>

<script setup>
import { useQuasar } from 'quasar'

defineProps({
  item: { type: Object, required: true, default: () => {} },
  iconSize: { default: 'sm', type: String },
  iconClasses: { type: String },
  labelClases: { type: String },
  adminItem: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['item-click'])

const $q = useQuasar()

const handleItemClick = () => {
  emit('item-click')
}
</script>

<style lang="scss">
.beta-chip {
  color: $text-light-2 !important;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 6px;
  height: 18px;
  transform: translateY(-1px);
  min-height: unset;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}
</style>
