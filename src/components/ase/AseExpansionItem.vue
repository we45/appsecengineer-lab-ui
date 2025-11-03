<script setup>
import { useSlots as useContextSlots } from 'vue'
import { useSlots } from 'src/composables/useSlots'
import { useQuasar } from 'quasar'

const slots = useSlots(useContextSlots())

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  headerIconPath: {
    type: String,
    default: ''
  },
  customHeader: {
    type: Boolean,
    default: true
  },
  titleClasses: {
    type: String,
    default: ''
  },
  hasBorder: {
    type: Boolean,
    default: false
  },
  bodyWrapperClasses: {
    type: String,
    default: 'q-pa-md'
  }
})

const $q = useQuasar()
</script>

<template>
  <q-expansion-item
    v-bind="$attrs"
    class="ase-expansion-item"
    :class="{
      dark: $q.dark.isActive,
      border: hasBorder
    }"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]="props">
      <slot :key="slot.name" :name="slot.name" v-bind="props" />
    </template>

    <template v-if="customHeader" #header>
      <div class="full-width expansion-header row items-center no-wrap">
        <slot name="header_prepend">
          <q-img v-if="headerIconPath" :src="headerIconPath" height="40px" width="40px" fit="fill" />
        </slot>
        <div
          class="column"
          :class="{
            'q-ml-md': headerIconPath
          }"
        >
          <slot name="header_title" :title="title">
            <span v-if="title" class="expansion-title" :class="[titleClasses]">
              {{ title }}
            </span>
          </slot>
          <slot name="header_subtitle">
            <span v-if="subtitle" class="expansion-subtitle">
              {{ subtitle }}
            </span>
          </slot>
        </div>
      </div>
    </template>

    <div :class="[bodyWrapperClasses]">
      <slot name="body" />
    </div>
  </q-expansion-item>
</template>

<style lang="scss">
.ase-expansion-item {
  background: $bg-primary !important;
  border-radius: 4px !important;
  .q-item {
    border-radius: 4px !important;
    .q-item__section {
      padding: 0px !important;
    }

    .expansion-header {
      div {
        .expansion-title {
          font-size: 16px;
          color: $text-primary;
        }
        .expansion-subtitle {
          font-size: 14px;
          color: $text-light-1;
        }
      }
    }
  }

  &.border {
    .q-item {
      border: 1px solid $border-3 !important;
    }
  }
}
</style>
