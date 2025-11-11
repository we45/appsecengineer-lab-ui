<template>
  <div>
    <AseTabs v-model="tab" :tabs="tabs" aria-label="Lab content tabs" />

    <AseTabPanels v-model="tab" :tabs="tabs" class="q-mt-sm">
      <template #ase_tab_Overview>
        <div class="q-px-none">
          <ContentUI :description="labProvisionStore.labData.data?.description" />
        </div>
      </template>

      <template #ase_tab_Instructions>
        <div class="q-pa-none">
          <div class="row">
            <div class="col" style="min-height: 10rem">
              <q-inner-loading :showing="labProvisionStore.loaders.fetchLabInstructions">
                <q-spinner-hourglass size="50px" color="primary" />
              </q-inner-loading>

              <template v-if="labProvisionStore.labData.instructions">
                <BaseMarkdown :content="urlSafeBase64Decode(labProvisionStore.labData.instructions)" class="text-subtitle1 q-pa-md" />
              </template>
            </div>
          </div>
        </div>
      </template>
    </AseTabPanels>
  </div>
</template>

<script setup>
import { defineComponent, shallowRef, computed } from 'vue'

import ContentUI from 'components/TabsInfo/ContentUI.vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'

import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'

const INSTRUCTIONS = 'Instructions'
const OVERVIEW = 'Overview'

defineComponent({
  name: 'LabTab'
})

const labProvisionStore = useLabProvisionStore()

const tab = shallowRef(INSTRUCTIONS)

const tabs = computed(() => [
  {
    name: OVERVIEW,
    label: 'Overview'
  },
  {
    name: INSTRUCTIONS,
    label: 'Instructions'
  }
])
</script>
