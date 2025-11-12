<script setup>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import BaseInnerLoading from '../wrappers/BaseInnerLoading/BaseInnerLoading.vue'

defineComponent({
  name: 'AseCard'
})

defineProps({
  dark: {
    type: Boolean,
    default: false
  },
  sectionClass: {
    type: String,
    default: ''
  },
  flatCard: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  sectionStyle: {
    type: Object,
    default: () => {}
  }
})

const $q = useQuasar()
</script>

<template>
  <q-card
    v-bind="$attrs"
    class="ase-card full-width"
    flat
    :class="{
      'shadow-light': !flatCard,
      flat: flatCard,
      dark: dark
    }"
  >
    <q-card-section class="full-width full-height relative-position" :class="[sectionClass]" :style="sectionStyle">
      <slot />
    </q-card-section>

    <BaseInnerLoading :showing="loading" />
  </q-card>
</template>

<style lang="scss">
.ase-card {
  background-color: $bg-primary !important;

  &.flat {
    border: 0.5px solid $border-1;
  }

  &.dark {
    background-color: $bg-dark !important;
  }

  &.q-dark {
    border: 1px solid $border-3;
  }
}
</style>
