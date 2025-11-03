<script setup>
import { useSlots as useContextSlots } from 'vue'
import { useSlots } from 'src/composables/useSlots'

const slots = useSlots(useContextSlots())
</script>

<template>
  <q-option-group v-bind="$attrs" inline class="ase-option-group">
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot :key="slot.name" :name="slot.name" v-bind="props" />
    </template>
  </q-option-group>
</template>

<style lang="scss">
.ase-option-group {
  .q-checkbox {
    .q-checkbox__label {
      font-size: 16px !important;
    }
    .q-checkbox__inner--indet,
    .q-checkbox__inner--truthy {
      .q-checkbox__bg {
        background: $indigo-1 !important;
        border: 2px solid $indigo-1 !important;
      }
    }
    .q-checkbox__inner--falsy,
    .q-checkbox__inner--indet,
    .q-checkbox__inner--truthy {
      .q-checkbox__bg {
        border-radius: 4px;
      }
    }
  }
}
</style>
