<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card flat class="q-pa-sm" style="width: 800px; max-width: 90vw" transition-show="flip-up" transition-hide="flip-down">
      <q-card-section class="row justify-between">
        <div>
          <div class="text-h6 text-bold">Attach Custom Challenge</div>
        </div>
        <div>
          <BaseBtn color="primary" icon="close" round size="sm" @click="onCancel({ show: true })" />
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <div class="column justify-center q-pt-md q-pb-sm" greedy>
        <div class="full-width column items-start bordered q-py-sm q-px-md" style="border-radius: 6px">
          <p class="avenir-bold q-mt-sm q-mb-sm q-pr-md" style="font-size: 1rem !important">Filter Challenges</p>
          <div class="full-width row items-center">
            <div class="col-6">
              <BaseSelect
                v-model="selectedLanguage"
                label="Language"
                :options="languages"
                class="col-auto q-mr-sm radius-8"
                @clear="clearFilters"
              />
            </div>
            <div class="col-6">
              <BaseInput
                v-model="selectedFramework"
                label="Framework"
                class="col-auto radius-8"
                @update:model-value="!$event && clearFilters()"
              />
            </div>
            <div class="row col-12 justify-end">
              <q-btn
                class="col-auto q-mr-sm radius-8"
                color="indigo-8"
                no-caps
                :disabled="!selectedLanguage?.length && !selectedFramework?.length"
                @click="filterChallenges"
              >
                Apply
              </q-btn>
              <q-btn
                class="col-auto radius-8"
                color="indigo-8"
                no-caps
                :disabled="!selectedLanguage?.length && !selectedFramework"
                @click="clearFilters"
              >
                Clear
              </q-btn>
            </div>
          </div>
        </div>

        <div class="full-width column items-start bordered q-py-sm q-px-md q-my-md" style="border-radius: 6px">
          <p class="avenir-bold q-mt-sm q-mb-sm q-pr-md" style="font-size: 1rem !important">Select and Attach Challenges</p>
          <q-list bordered separator style="max-height: 50vh; width: 100%; overflow-y: scroll; border-radius: 6px">
            <template v-if="aiChallenges.isLoading || !challengesOptions?.length">
              <BaseComponentLoader :loading="aiChallenges.isLoading" class="q-py-lg">
                <q-toolbar
                  class="text-center"
                  :class="{
                    'bg-white': !$q.dark.isActive
                  }"
                >
                  <q-toolbar-title>No challenges</q-toolbar-title>
                </q-toolbar>
              </BaseComponentLoader>
            </template>
            <template v-else>
              <q-expansion-item
                v-for="data in challengesOptions ?? []"
                icon="explore"
                :key="data.value"
                :label="data.label"
                class="expansion-item"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-checkbox v-if="isChallengeAttached(data)" size="md" :model-value="true" disable />
                    <q-checkbox v-else size="md" v-model="selectedChallenges" :val="data.value" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ data.label }}
                    </q-item-label>
                    <q-item-label>
                      <q-badge v-if="data.vulnerability" class="q-pa-xs">
                        <span class="avenir-bold">Vulnerability:</span>
                        &nbsp;{{ data.vulnerability }}
                      </q-badge>
                      <q-badge v-if="data.language" class="q-pa-xs q-ml-sm">
                        <span class="avenir-bold">Language:</span>
                        &nbsp;{{ data.language }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                </template>
                <q-card>
                  <q-card-section class="q-pb-none">
                    <p class="avenir-bold q-mb-none" style="font-size: 1rem !important">Challenge Code Viewer</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <div class="col-12 q-pa-xs">
                      <highlightjs :language="data.language" :code="urlSafeBase64Decode(data.code)" />
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </template>
          </q-list>
          <div class="row full-width col-12 q-mt-md q-mb-sm justify-end">
            <q-btn
              color="secondary"
              label="Attach"
              :disabled="!selectedChallenges.length || testsStore.isLoading"
              :loading="testsStore.isLoading"
              @click="attachChallenges"
            />
          </div>
        </div>
      </div>

      <div v-if="selectedVulnerability.length" class="row full-width">
        <div class="col-12">
          <q-list bordered class="rounded-borders q-my-sm" v-for="(vulnerability, index) in selectedVulnerability" :key="index">
            <q-expansion-item
              caption="Solution"
              expand-separator
              icon="tips_and_updates"
              :key="vulnerability._key"
              :label="vulnerability.vulnerability"
            >
              <q-card>
                <q-card-section>
                  <div class="col-12 q-pa-xs">
                    <highlightjs :language="vulnerability.language" :code="urlSafeBase64Decode(vulnerability.code)" />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseComponentLoader from 'components/wrappers/BaseComponentLoader/index.vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useTestsStore } from 'src/store/pinia/tests'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const highlightjs = hljsVuePlugin.component

const aiChallenges = useAiChallengesStore()
const testsStore = useTestsStore()
const assignmentStore = useAssignmentStore()
const route = useRoute()

const emit = defineEmits(['onCancel'])
const props = defineProps(['show', 'name'])

const showDialog = props.show

aiChallenges.fetchVulnerabilityMap()

const languages = computed(() => {
  return aiChallenges.programmingLanguagesWithVulnerabilities.map((item) => item.support)
})

const selectedChallenges = ref([])
const selectedLanguage = ref([])
const selectedFramework = ref(null)

const test = computed(() => assignmentStore.attachChallenge)
const challengesOptions = computed(() => {
  return aiChallenges.listedChallenges.map(({ name, _key, code, vulnerability, language }) => {
    return {
      label: name,
      value: _key,
      vulnerability,
      code,
      language
    }
  })
})

onMounted(() => {
  aiChallenges.listChallenges()
})

const selectedVulnerability = computed(() => {
  const selectedMapValue = selectedChallenges.value.map((item) => item.value)

  return aiChallenges.listedChallenges.filter((item) => {
    return selectedMapValue.includes(item._key)
  })
})

function filterChallenges() {
  const payload = {
    language: selectedLanguage.value ? selectedLanguage.value.toLowerCase() : null,
    framework: selectedFramework.value ? selectedFramework.value.toLowerCase() : null
  }

  aiChallenges.filterChallenges(payload)
}

function clearFilters() {
  selectedLanguage.value = null
  selectedFramework.value = null
  selectedChallenges.value = []
  aiChallenges.listChallenges()
}

async function attachChallenges() {
  const payload = {
    test_id: props.name === 'testIndex' ? urlSafeBase64Decode(route.params.testId) : test.value.sk,
    challenges: selectedChallenges.value
  }

  await testsStore.attachChallenge(payload)

  const updateList = {
    test: props.name === 'testIndex' ? urlSafeBase64Decode(route.params.testId) : test.value.sk
  }

  await testsStore.fetchTests(updateList)

  onCancel()
  clearFilters()
}

async function onCancel() {
  emit('onCancel', { show: true })
}

function isChallengeAttached(challenge) {
  const testIds = testsStore.customTests?.map((item) => item._key) ?? []
  return testIds.includes(challenge?.value)
}
</script>
