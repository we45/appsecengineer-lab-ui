<script setup>
import { useQuasar } from 'quasar'

import { ref, shallowRef, computed } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['onConfirm'])

const $q = useQuasar()

const includeCertification = shallowRef(false)
const selectedCertifications = ref([])

const modifiedOptions = computed(() => {
  return props.options?.map((option) => {
    return { label: `${option?.name} ${option?.price}`, value: option.id }
  })
})

function handleConfirm(keepCertification) {
  let certifications = []

  if (!includeCertification.value || !keepCertification) {
    emit('onConfirm', certifications)
    return
  }

  certifications = props.options?.length === 1 && includeCertification.value ? props.options : selectedCertifications.value

  emit('onConfirm', certifications)
}
</script>

<template>
  <div class="proceed-container full-width column items-center q-px-lg q-pt-lg q-pb-sm" @click.stop>
    <h4 class="font-paytone q-my-md">Checkout</h4>
    <p class="q-mx-lg question text-center">Before checking out, do you want to add a certificate ?</p>
    <AseSeparator class="full-width q-mt-sm q-mb-lg" />

    <div v-if="options?.length === 1" class="row items-center">
      <AseCheckbox v-model="includeCertification" color="indigo" class="certification-check" />
      <p class="q-ma-none cursor-pointer" @click="includeCertification = !includeCertification">
        {{ options[0]?.name }} +
        <span class="avenirbold">${{ options[0]?.price ?? 0 }}</span>
      </p>
    </div>

    <div v-else class="q-my-md full-width">
      <AseMultiSelect v-model="selectedCertifications" placeholder="Select the certifications you want to add" :options="modifiedOptions" />
    </div>

    <div class="full-width q-mt-lg q-mb-sm row items-center justify-between no-wrap" :style="{ gap: '10px' }">
      <AseButton variant="primary" outline class="text-capitalize" :style="{ width: '50%' }" @click="handleConfirm(false)">
        Proceed without certification
      </AseButton>
      <AseButton variant="primary" class="text-capitalize" :style="{ width: '50%' }" @click="handleConfirm(true)">Confirm</AseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.proceed-container {
  border-radius: 20px !important;
  background-color: $bg-surface;
  border: 1px solid $border-1;
  color: $text-primary;

  .question {
    padding: 0 5rem;
    color: $text-primary;
  }

  .certification-check {
    .q-checkbox__inner {
      div {
        border-radius: $generic-border-radius;
      }
    }
  }
}
</style>
