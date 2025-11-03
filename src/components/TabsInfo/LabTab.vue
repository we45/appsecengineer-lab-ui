<template>
  <div>
    <AseTabs v-model="tab" :tabs="tabs" aria-label="Lab content tabs" />

    <AseTabPanels v-model="tab" :tabs="tabs" class="q-mt-sm">
      <template #ase_tab_Overview>
        <div class="q-px-none">
          <ContentUI :description="coursesStore.selectedCourseInfo.rawInfo?.description" />
        </div>
      </template>

      <template #ase_tab_Instructions>
        <div class="q-pa-none">
          <div class="row">
            <div class="col" style="min-height: 10rem">
              <template v-if="labStore.fetchLabInstructionInfo">
                <BaseMarkdown
                  v-if="labStore.fetchLabInstructionInfo"
                  :content="labStore.fetchLabInstructionInfo"
                  class="text-subtitle1 q-pa-md"
                />
              </template>
              <q-inner-loading :showing="labStore.isLabInstruction">
                <q-spinner-hourglass size="50px" color="primary" />
              </q-inner-loading>

              <template v-if="publicLabsStore.fetchPublicLabInstructionInfo">
                <BaseMarkdown
                  v-if="publicLabsStore.fetchPublicLabInstructionInfo"
                  :content="urlSafeBase64Decode(publicLabsStore.fetchPublicLabInstructionInfo)"
                  class="text-subtitle1 q-pa-md"
                />
              </template>
            </div>
          </div>
        </div>
      </template>

      <template #ase_tab_Solution>
        <div class="q-px-none">
          <AseCard v-for="(data, index) of solutions" :key="data + index + 'Info'" flatCard>
            <BaseMarkdown :content="data" class="md-body q-pa-md" />
            <br />
          </AseCard>
          <p
            v-if="solutions.length === 0 && !labStore.isLoading && showData"
            class="q-mt-md flex flex-center padding_7"
            style="line-height: 0.9"
          >
            {{ labStore.isLoading ? 'Loading' : 'Solution not found. Please contact support Help@appsecengineer.com' }}
          </p>
        </div>
      </template>
    </AseTabPanels>
  </div>
</template>

<script setup>
import { defineComponent, shallowRef, watch, ref, computed } from 'vue'

import ContentUI from 'components/TabsInfo/ContentUI.vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import AseTabs from 'components/ase/AseTabs.vue'
import AseTabPanels from 'components/ase/AseTabPanels.vue'
import BaseCard from 'components/wrappers/BaseCard/BaseCard.vue'

import { useLabStore } from 'src/store/pinia/lab'
import { usePublicLabsStore } from 'src/store/pinia/publicLabs'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useCoursesStore } from 'src/store/pinia/courses'

const INSTRUCTIONS = 'Instructions'
const OVERVIEW = 'Overview'
const SOLUTION = 'Solution'

defineComponent({
  name: 'LabTab'
})

const labStore = useLabStore()
const coursesStore = useCoursesStore()
const publicLabsStore = usePublicLabsStore()

const tab = shallowRef(INSTRUCTIONS)
const showData = ref(false)
const solutions = ref([])

const tabs = computed(() => [
  {
    name: OVERVIEW,
    label: 'Overview'
  },
  {
    name: INSTRUCTIONS,
    label: 'Instructions'
  },
  ...(Object.keys(labStore.challengeSolution ?? {}).length
    ? [
        {
          name: SOLUTION,
          label: 'Solution'
        }
      ]
    : [])
])

watch(
  () => labStore.challengeSolution,
  async () => {
    if (labStore.challengeSolution.instructions) {
      if (labStore.challengeSolution.instructions.length > 0) {
        solutions.value = []
        for (const data of labStore.challengeSolution.instructions) {
          const finalResult = await labStore.getMarkdownData(data)
          solutions.value.push(finalResult?.data ?? '')
        }
        tab.value = SOLUTION
      } else {
        showData.value = true
      }
    } else {
      solutions.value = []
      showData.value = true
    }
    if (solutions.value.length === 0) {
      showData.value = true
    }
  }
)
</script>

