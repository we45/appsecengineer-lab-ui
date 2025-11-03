<script setup>
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { onMounted } from 'vue'
import { shallowRef, ref, computed } from 'vue'
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import BaseComponentLoader from 'components/wrappers/BaseComponentLoader/index.vue'
import { useTestsStore } from 'src/store/pinia/tests'
import { useQuasar } from 'quasar'

const HightLightJs = hljsVuePlugin.component

const props = defineProps({
  testId: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['onDone'])

const aiChallengesStore = useAiChallengesStore()
const testStore = useTestsStore()
const { dark } = useQuasar()

const isAttaching = ref(false)
const language = shallowRef()
const framework = shallowRef()
const selectedChallenges = ref([])

onMounted(async () => {
  await aiChallengesStore.listChallenges()
})
aiChallengesStore.fetchVulnerabilityMap()

const languages = computed(() => {
  return aiChallengesStore.programmingLanguagesWithVulnerabilities.map((item) => item.support)
})

async function handleAttachChallenge() {
  isAttaching.value = true

  const payload = {
    challenges: selectedChallenges.value,
    test_id: props.testId
  }
  await testStore.attachChallenge(payload)
  testStore.fetchTests({ test: props.testId })
  isAttaching.value = false

  emit('onDone')
}

function filterChallenges() {
  const selectedLanguage = language.value?.toLowerCase() ?? undefined
  const selectedFramework = framework.value?.toLowerCase() ?? undefined

  if (!selectedLanguage && !selectedFramework) {
    aiChallengesStore.listChallenges()
    return
  }

  const payload = {
    ...(selectedLanguage ? { language: selectedLanguage } : {}),
    ...(selectedFramework ? { framework: selectedFramework } : {})
  }

  aiChallengesStore.filterChallenges(payload)
}

function isChallengeAttached(challenge) {
  const testIds = testStore.customTests?.map((item) => item._key) ?? []
  return testIds.includes(challenge?._key)
}

function clearFilter() {
  language.value = undefined
  framework.value = undefined
  filterChallenges()
}

function getExpansionClass(challenge) {
  const isAttached = selectedChallenges.value.includes(challenge._key) || isChallengeAttached(challenge)
  if (isAttached && dark.isActive) return 'bg-transparent'
  return isAttached ? 'bg-light-grey' : undefined
}
</script>

<template>
  <div class="column full-width justify-between">
    <div
      class="challenges_filter q-pa-md full-width"
      :class="{
        'bg-transparent dark-border': $q.dark.isActive
      }"
    >
      <div class="row items-center wrap">
        <AseQSelect
          v-model="language"
          label="Language"
          placeholder="List of Languages"
          wrapper-class="col-md-5 col-sm-6 col-12"
          :options="languages"
          :disable="aiChallengesStore.isLoading"
          @update:model-value="filterChallenges"
        />
        <AseInput
          v-model="framework"
          label="Framework"
          wrapper-class="col-md-5 col-sm-6 col-12 q-pl-sm"
          :debounce="500"
          :disable="aiChallengesStore.isLoading"
          @update:model-value="filterChallenges"
        />
        <div class="col-md-2 col-12 row items-center justify-center q-pt-md">
          <span class="q-mt-md q-ml-sm avenir-bold text-no-wrap cursor-pointer" style="text-decoration: underline" @click="clearFilter">
            Clear Filters
          </span>
        </div>
      </div>
    </div>

    <div class="row full-width q-my-md items-center justify-center">
      <q-list bordered style="max-height: 50vh; width: 100%; overflow-y: scroll; border-radius: 4px">
        <template v-if="aiChallengesStore.isLoading || !aiChallengesStore.listedChallenges?.length">
          <BaseComponentLoader :loading="aiChallengesStore.isLoading" class="q-py-lg">
            <div class="row items-center justify-center q-pa-lg">
              <span>No challenges found</span>
            </div>
          </BaseComponentLoader>
        </template>
        <template v-else v-for="challenge in aiChallengesStore.listedChallenges" :key="challenge._key">
          <AseExpansionItem :title="challenge.name" class="full-width" :class="getExpansionClass(challenge)">
            <template #header_prepend>
              <AseCheckbox v-if="isChallengeAttached(challenge)" :model-value="true" disabled />
              <AseCheckbox v-else v-model="selectedChallenges" :val="challenge._key" />
            </template>

            <template #header_subtitle>
              <div class="row items-center wrap" style="gap: 4px">
                <q-badge v-if="challenge.vulnerability" class="q-pa-xs q-px-md" style="border-radius: 10px; text-wrap: auto">
                  <span class="avenir-bold">Vulnerability:</span>
                  &nbsp;{{ challenge.vulnerability }}
                </q-badge>
                <q-badge v-if="challenge.language" class="q-pa-xs q-px-md" style="border-radius: 10px; text-wrap: auto">
                  <span class="avenir-bold">Language:</span>
                  &nbsp;{{ challenge.language }}
                </q-badge>
              </div>
            </template>

            <template #body>
              <p class="avenir-bold q-mb-none" style="font-size: 1rem !important">Challenge Code Viewer</p>
              <HightLightJs :language="challenge.language" :code="urlSafeBase64Decode(challenge.code)" />

              <template v-if="challenge.hints?.length > 0">
                <p class="avenir-bold q-mb-sm">Hint</p>
                <AseCard flatCard class="q-mb-md" section-class="q-pr-sm q-pl-none">
                  <ol class="q-my-none">
                    <template v-for="(hint, index) in challenge.hints" :key="index">
                      <li>{{ hint }}</li>
                    </template>
                  </ol>
                </AseCard>
              </template>

              <p class="avenir-bold q-mb-sm">Approach</p>
              <AseCard flatCard class="q-mb-md">
                <p class="q-mb-none">{{ challenge.approach }}</p>
              </AseCard>

              <p class="avenir-bold q-mb-sm">Backstory</p>
              <AseCard flatCard class="q-mb-md">
                <p class="q-mb-none">{{ challenge.context }}</p>
              </AseCard>
            </template>
          </AseExpansionItem>
        </template>
      </q-list>
    </div>

    <AseButton
      label="Attach"
      variant="secondary"
      class="full-width"
      :loading="isAttaching"
      :disable="!selectedChallenges.length"
      @click="handleAttachChallenge"
    />
  </div>
</template>

<style lang="scss">
.challenges_filter {
  border-radius: 4px;
  background-color: $bg-page;
}
</style>
