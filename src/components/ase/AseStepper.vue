<script setup>
import { useSlots as useContextSlots } from 'vue'
import { useSlots } from 'src/composables/useSlots'

const slots = useSlots(useContextSlots())
</script>

<template>
  <q-stepper v-bind="$attrs" flat vertical class="ase-stepper bg-transparent" animated>
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot :key="slot.name" :name="slot.name" v-bind="props" />
    </template>
  </q-stepper>
</template>

<style lang="scss">
.ase-stepper {
  .q-stepper__content {
    .q-stepper__step {
      .q-stepper__tab {
        .q-stepper__dot {
          height: 33px !important;
          width: 33px !important;
          background: $indigo-gradient;
          border-radius: 4px !important;
          &::after,
          &::before {
            width: 2px !important;
            left: 48% !important;
            background-color: $indigo-1 !important;
            margin: 0 !important;
          }
        }
        .q-stepper__label {
          .q-stepper__title {
            font-weight: 600;
            color: $text-primary;
          }
        }
        padding-bottom: 0px !important;
      }
      .q-stepper__step-content {
        .q-stepper__step-inner {
          margin-top: 12px !important;
        }
      }
    }
  }

  &.q-stepper--dark {
    .q-stepper__content {
      .q-stepper__step {
        .q-stepper__tab {
          .q-stepper__label {
            .q-stepper__title {
              color: $text-light-1 !important;
            }
          }
        }
      }
    }
  }
}
</style>
