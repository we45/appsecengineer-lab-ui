<script setup>
import { computed } from 'vue'
import { useScreenSize } from 'src/composables/useScreenSize'

const props = defineProps({
  title: {
    type: String,
    default: 'APPSEC'
  },
  noHeader: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: true
  },
  height: {
    type: String,
    default: 'auto'
  },
  width: {
    type: String,
    default: '60vw'
  }
})
const emit = defineEmits(['update:model-value'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  }
})

const { isDesktop } = useScreenSize()
</script>

<template>
  <q-dialog v-bind="$attrs" v-model="model" class="ase-dialog" persistent>
    <AseCard
      v-if="model"
      section-class="ase-dialog-wrapper q-pa-none"
      :style="{
        width: `${isDesktop ? width : '90vw'} !important`,
        height: `${height} !important`,
        maxHeight: '90vh !important',
        maxWidth: '90vw !important'
      }"
    >
      <div v-if="!noHeader" class="ase-dialog-header q-px-lg row justify-between items-center">
        <h5 class="ase-dialog-title font-paytone q-mb-md q-mt-md" style="font-size: 26px">{{ title }}</h5>
        <div class="ase-dialog-close cursor-pointer" @click="model = false">
          <q-icon name="close" size="xs"></q-icon>
        </div>
      </div>
      <q-separator />
      <div class="q-px-lg q-py-md">
        <slot />
      </div>
      <div class="q-mb-sm">
        <slot name="footer" />
      </div>
    </AseCard>
  </q-dialog>
</template>

<style lang="scss">
.ase-dialog {
  .q-dialog__backdrop {
    backdrop-filter: blur(4px);
  }
  .q-card {
    .ase-dialog-wrapper {
      .ase-dialog-header {
        min-height: 84px;

        max-height: auto;
        .ase-dialog-title {
          font-size: 22px !important;
          color: $text-primary !important;
          max-width: 85%;
        }
        .ase-dialog-close {
          background-color: $text-primary;
          color: $bg-page;
          clip-path: circle();
          padding: 2px;
        }
      }
    }
  }
}
</style>
