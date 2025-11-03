<template>
  <div
    v-bind="$attrs"
    class="chipTab full-width row items-center justify-evenly q-px-sm no-wrap"
    :class="[
      {
        smaller: smallerText,
        sameSize
      }
    ]"
  >
    <template v-for="(item, index) in items" :key="index">
      <div class="avenir-bold row no-wrap items-center" :style="{ padding: '2px 0' }">
        <q-img :src="`/newIcons/${item.img}.png`" fit="fill" height="1.5rem" width="1.5rem" />
        <slot name="label" :label="item.label">
          <p
            class="q-ma-none q-ml-sm chip-label"
            :class="[
              {
                'text-electric-indigo': !$q.dark.isActive
              }
            ]"
          >
            {{ item.label }}
          </p>
        </slot>
      </div>
      <AseSeparator v-if="index + 1 !== items.length" class="q-mx-sm" vertical />
    </template>
  </div>
</template>
<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  smallerText: {
    type: Boolean,
    default: false
  },
  sameSize: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.chipTab {
  height: max-content !important;
  border-radius: 1rem;
  min-width: min-content !important;
  border: 1px solid $border-1;
  .chip-label {
    text-wrap: nowrap;
    font-size: 0.7rem;
  }
  &.smaller {
    .chip-label {
      font-size: 11px;
    }
  }
  &.sameSize {
    max-width: max-content;
    div {
      width: 6.5rem;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss">
.q-dark {
  .chipTab {
    .chip-label {
      color: $secondary;
    }
  }
}
</style>
