<template>
  <BaseCard class="q-py-xs q-pa-md statistic-card" :style="border && $q.dark.isActive ? 'border: 1px solid #cdcdda33;' : ''" flat>
    <q-card-section v-for="(stat, index) in stats" :key="index" class="stats q-my-md q-py-sm q-px-lg item" :class="{ active: index === 0 }">
      <div class="text-left" style="max-height: max-content">
        <div class="text-subtitle1">{{ stat.count }}</div>
        <div class="text-subtitle1">{{ stat.title }}</div>
      </div>
    </q-card-section>
  </BaseCard>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
const $q = useQuasar()

export default defineComponent({
  props: {
    stats: {
      type: Array,
      required: true,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss">
.statistic-card {
  background-color: $grey-12;
  .item {
    background-color: white !important;
    &.active {
      background-color: $statistics-active-card !important;
    }
  }

  &.q-dark {
    background: $dark-page-color;

    .q-card__section {
      &.stats {
        background: $dark-body-color !important;
      }
    }
  }
}
</style>
