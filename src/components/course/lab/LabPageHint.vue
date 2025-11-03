<script setup>
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import { useLabStore } from 'src/store/pinia/lab'
import { computed } from 'vue'

defineEmits(['onCancel'])

const labStore = useLabStore()

function getRandomArbitrary(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const markDownContent = computed(() => {
  return labStore.challengeInfo.hints.at(getRandomArbitrary(0, labStore.challengeInfo.hints.length - 1))
})
</script>

<template>
  <AseDialog
    v-bind="$attrs"
    title="Hint"
    role="dialog"
    aria-labelledby="hint-title"
    aria-describedby="hint-content"
    @escape-key="$emit('onCancel')"
    @close="$emit('onCancel')"
  >
    <q-card-section id="hint-content">
      <template v-if="labStore.challengeInfo.hints">
        <div v-if="labStore.challengeInfo.hints.length > 0">
          <BaseMarkdown v-if="markDownContent" :content="markDownContent" />
        </div>
        <q-banner class="q-pa-md" v-else role="alert">
          <div class="text-h6">No Hints provided</div>
        </q-banner>
      </template>
    </q-card-section>
  </AseDialog>
</template>
