<script setup>
import { useSlots as useContextSlots } from 'vue'
import { useSlots } from 'src/composables/useSlots'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'AseInput',
  inheritAttrs: false
})

defineProps({
  heightVariant: {
    type: String,
    default: 'tall',
    validator: (value) => {
      return ['short', 'tall'].includes(value)
    }
  },
  fillVariant: {
    type: String,
    default: 'filled',
    validator: (value) => {
      return ['filled', 'outlined'].includes(value)
    }
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  wrapperClass: {
    type: String || Array || Object,
    required: false,
    default: ''
  }
})

const slots = useSlots(useContextSlots())
const $q = useQuasar()
</script>

<template>
  <div class="ase-input-wrapper" :class="wrapperClass">
    <p v-if="label" class="ase-input-label q-mt-sm q-mb-sm q-ml-xs">{{ label }}</p>
    <q-input
      v-bind="$attrs"
      outlined
      flat
      class="ase-input q-pb-none"
      lazy-rules
      :class="[heightVariant, fillVariant, { dark: $q.dark.isActive }]"
    >
      <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
        <slot :key="slot.name" :name="slot.name" v-bind="props" />
      </template>
    </q-input>
  </div>
</template>
,

<style lang="scss">
.ase-input-wrapper {
  .ase-input-label {
    font-size: 14px !important;
  }
  .ase-input {
    ::placeholder {
      color: $text-light-1 !important;
    }

    .q-field__control {
      border-radius: 4px;
      .q-field__marginal {
        height: auto;
        color: $text-light-1 !important;
      }
      .q-field__control-container {
        .q-field__suffix {
          margin-right: 4px;
        }
        .q-field_native {
          color: $text-light-1 !important;
        }
      }
    }

    &.filled {
      .q-field__control {
        background: $bg-input;
        &::before {
          border: 0.5px solid $border-1 !important;
        }
      }
    }

    &.outlined {
      .q-field__control {
        background: $white !important;
        &::before {
          border: 0.5px solid $bg-disabled !important;
        }
      }
    }

    &.short {
      .q-field__control {
        height: 34px !important;
      }
    }

    &.tall {
      .q-field__control {
        height: 46px !important;
        font-size: 14px !important;
      }
    }

    &.q-textarea {
      .q-field__control {
        height: auto !important;
      }
    }

    &.dark {
      .q-field__control {
        background-color: $bg-dark !important;
        .q-field__append {
          color: $text-primary !important;
        }
      }

      &.outlined,
      &.filled {
        .q-field__control {
          &::before {
            border: 0.5px solid $border-1 !important;
          }
        }
      }
    }
  }
}
</style>
