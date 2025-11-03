<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  },
  fancy: {
    type: Boolean,
    default: false
  },
  larger: {
    type: Boolean,
    default: false
  },
  largerTabs: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <q-tabs
    v-bind="$attrs"
    v-model="model"
    class="dynamic-tabs"
    :class="{
      larger,
      fancy,
      dark: $q.dark.isActive
    }"
    indicator-color="red"
    :vertical="vertical"
  >
    <q-tab
      v-for="tab in tabs"
      :key="tab.name"
      :disable="tab.disable"
      :name="tab.name"
      :ripple="false"
      class="text-capitalize col-grow relative-position"
    >
      <template #default>
        <div class="row items-center no-wrap">
          <slot :name="`${tab.name}-before`" />
          {{ tab.label }}
          <slot :name="`${tab.name}-after`" />
        </div>
        <q-tooltip v-if="tab.disable && tab.disableMessage">{{ tab.disableMessage }}</q-tooltip>
      </template>
    </q-tab>
  </q-tabs>
</template>

<style lang="scss">
.dynamic-tabs {
  border-radius: 100px !important;
  width: min-content;
  padding: 2px;
  background: $bg-primary;
  border-color: $border-1 !important;
  .q-tab {
    padding: 4px 18px !important;
    min-height: 100%;
    border-radius: 100px !important;

    .q-tab__content {
      height: 100%;
      z-index: 1;
      .q-tab__label {
        font-size: 12px;
      }
    }
    &.q-tab--active {
      font-family: avenirbold;
    }
  }

  .q-tab__indicator {
    height: 100%;
    border-radius: 100px !important;
    background: $bg-surface;
  }

  &.larger {
    padding: 4px;
    .q-tab {
      font-family: avenirbold;
      .q-tab__content {
        .q-tab__label {
          font-size: 1rem;
        }
      }
    }
  }

  &.fancy {
    .q-tab {
      &.q-tab--active {
        .q-tab__content {
          .q-tab__label {
            color: $text-light-1;
          }
        }
      }
    }
    .q-tab__indicator {
      background: $indigo-gradient !important;
    }
  }

  &.dark {
    .q-tab__indicator {
      background: $indigo-gradient !important;
    }
  }
}
</style>
