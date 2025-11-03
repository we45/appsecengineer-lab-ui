<script setup>
import { useSlots } from 'src/composables/useSlots'
import { useSlots as useContextSlots } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => {
      return ['primary', 'secondary', 'plain'].includes(value)
    }
  },
  tooltip: {
    type: String,
    default: ''
  },
  outline: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots(useContextSlots())
</script>

<template>
  <q-btn
    v-bind="$attrs"
    :loading="loading"
    :disable="loading || disabled"
    flat
    class="ase-btn text-capitalize"
    :class="[variant, { 'btn-disabled': disabled, outline }]"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot :key="slot.name" :name="slot.name" v-bind="props" />
    </template>
    <q-tooltip v-if="tooltip">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<style lang="scss" scoped>
.ase-btn {
  border-radius: 20px !important;
  font-weight: 500;
  font-family: avenirbold;
  border: none !important;
  width: max-content;
  &:before {
    box-shadow: none;
  }

  &.secondary {
    background: $secondary !important;
    color: $text-primary !important;
  }

  &.primary {
    background: $primary !important;
    color: $bg-white !important;
  }

  &.plain {
    background: transparent !important;
    color: $text-primary !important;
  }

  &.outline {
    box-shadow: none;
    &.secondary {
      background: transparent !important;
      border: 1px solid $secondary !important;
      color: $secondary !important;
    }

    &.primary {
      background: transparent !important;
      border: 1px solid $primary !important;
      color: $primary !important;
    }

    &.plain {
      background: transparent !important;
      border: 1px solid $border-1 !important;
      color: $text-primary !important;
    }
  }
}
</style>

<style lang="scss">
.q-dark {
  .ase-btn {
    &.secondary {
      background: $secondary !important;
      color: $bg-page !important;
    }

    &.plain {
      background: transparent !important;
      border: 1px solid rgba(3, 3, 71, 0.1) !important;
      color: $night-blue !important;
    }
  }
}
</style>
