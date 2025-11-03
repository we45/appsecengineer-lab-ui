<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card flat class="q-pa-sm" style="width: 800px; max-width: 90vw" transition-show="flip-up" transition-hide="flip-down">
      <div>
        <q-card-section class="row justify-between">
          <div>
            <div class="text-h6 text-bold">{{ title }}</div>
          </div>
          <div>
            <BaseBtn color="primary" icon="close" round size="sm" @click="onCancel({ show: true })" />
          </div>
        </q-card-section>
      </div>
      <q-separator></q-separator>

      <div class="column justify-center q-pt-md q-pb-sm" greedy>
        <div class="full-width column items-start bordered q-py-sm q-px-md" style="border-radius: 6px">
          <p class="avenir-bold q-mt-sm q-mb-md q-pr-md" style="font-size: 1rem !important">Challenges Filter</p>
          <div class="full-width row items-center">
            <div class="col-6">
              <q-btn-dropdown
                class="full-width radius-8"
                label="Learning Paths *"
                no-caps
                :text-color="learningPathsOptions.some((item) => tests.learningPaths?.includes(item.value)) ? 'primary' : 'portalColor'"
                :loading="learningPath.isLoading"
              >
                <q-option-group class="q-mr-sm" :options="learningPathsOptions" size="sm" type="checkbox" v-model="tests.learningPaths" />
              </q-btn-dropdown>
            </div>
            <div class="col-6 q-pl-sm">
              <q-btn-dropdown
                class="full-width text-left q-mr-sm radius-8"
                label="Tags"
                no-caps
                :text-color="testsStore.optionsPersona.some((item) => tests.persona?.includes(item.value)) ? 'primary' : 'portalColor'"
              >
                <q-option-group class="q-mr-sm" :options="testsStore.optionsPersona" size="sm" type="checkbox" v-model="tests.persona" />
              </q-btn-dropdown>
            </div>
            <div class="row col-12 justify-end q-mt-md q-mb-sm">
              <q-btn
                class="col-auto q-mr-sm radius-8"
                color="indigo-8"
                no-caps
                :disabled="!tests.learningPaths?.length > 0"
                :loading="isApplying"
                @click="callChallenges()"
              >
                Apply
              </q-btn>
              <q-btn class="col-auto radius-8" color="indigo-8" no-caps @click="clearData()">Clear</q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="column justify-center q-pt-md q-pb-sm" greedy>
        <div class="full-width column items-start bordered q-py-sm q-px-md" style="border-radius: 6px">
          <p class="avenir-bold q-mt-sm q-mb-md q-pr-md" style="font-size: 1rem !important">Attach Challenge</p>
          <div class="full-width row items-center">
            <div class="col-12">
              <BaseSelect
                label="List of challenges *"
                v-model="tests.challenge"
                :options="testsStore.challenges"
                :showMore="Object.keys(testsStore.listChallengesKey).length > 0"
                :option-disable="(opt) => getDisable(opt)"
                :loading="isApplying"
                :disable="!tests.learningPaths?.length && !tests.persona?.length"
                @update:model-value="handleSelectChallenge"
                @loadMoreItems="loadMoreTests"
              />
            </div>

            <div class="col-12">
              <BaseInput label="Score" v-model="score" :disable="!tests.challenge" type="number" />
            </div>

            <div class="col-12">
              <div v-if="testsStore.errorTests.persona" class="text-body2 text-negative full-width">
                Persona: {{ testsStore.errorTests.persona_msg }}
              </div>
              <div v-if="testsStore.errorTests.challenge" class="text-body2 text-negative full-width">
                {{ testsStore.errorTests.challenge_msg }}
              </div>
            </div>

            <div class="row col-12 justify-end q-mt-md q-mb-sm">
              <q-btn
                color="secondary"
                :disabled="!tests.learningPaths?.length || !tests.challenge || testsStore.isLoading || isCreating"
                :loading="isCreating"
                label="Attach"
                @click="onSubmit"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="column justify-center q-pt-md q-pb-sm" greedy>
        <div class="full-width column items-start bordered q-py-sm q-px-md" style="border-radius: 6px">
          <p class="avenir-bold q-mt-sm q-mb-sm q-pr-md" style="font-size: 1rem !important">Solution Viewer</p>
          <div class="row full-width">
            <div class="col-12">
              <q-list v-if="tests.challenge && openMarkDown" bordered class="rounded-borders">
                <q-expansion-item
                  caption="Solution"
                  expand-separator
                  icon="tips_and_updates"
                  :key="tests.challenge.value"
                  :label="tests.challenge.label"
                  @show="openWindow(tests.challenge.solutions)"
                >
                  <q-card>
                    <q-card-section v-if="tests.challenge.solutions">
                      <div class="col-12 q-pa-xs">
                        <div v-for="(data, index) of solutions" :key="index">
                          <BaseMarkdown v-if="data" :content="data" class="md-body" />
                        </div>
                        <p
                          v-if="solutions.length === 0 && !labStore.isLoading && showData"
                          class="text-subtitle1 ase-black-regular flex flex-center ase-roboto padding_7"
                          style="line-height: 0.9"
                        >
                          Solution not found. Please contact support help@appsecengineer.com
                        </p>
                        <q-spinner v-if="labStore.isLoading" color="primary" size="3em" />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>

              <div v-else class="bg-transparent text-center row items-center justify-center q-pa-lg">
                <p v-if="tests.challenge?.solutions && !tests.challenge?.solutions?.length" class="q-mb-none">No solution found</p>
                <p v-else-if="!tests.challenge?.solutions" class="q-mb-none">No challenge Selected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import BaseInput from 'components/shared/BaseInput.vue'

import { computed, defineComponent, onBeforeMount, ref, shallowRef } from 'vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

import { useRoute } from 'vue-router'

import { useLabStore } from 'src/store/pinia/lab'
import { useTestsStore } from 'src/store/pinia/tests'
import { useLearningPathStore } from 'src/store/pinia/learningPath'
import { useAssignmentStore } from 'src/store/pinia/assignment'

defineComponent({
  name: 'CreateTests'
})

const props = defineProps(['id', 'show', 'title', 'stateDisabled', 'disabledListData', 'name'])
const emit = defineEmits(['onCancel'])

const route = useRoute()

const labStore = useLabStore()
const testsStore = useTestsStore()
const learningPath = useLearningPathStore()
const assignmentStore = useAssignmentStore()

const showDialog = shallowRef(props.show)
const openMarkDown = shallowRef(true)
const learningPathsOptions = shallowRef([])
const solutions = ref([])
const showData = shallowRef(false)
const tests = ref({
  challenge: null,
  score: null,
  lab_duration: null,
  learningPaths: [],
  skills: [],
  persona: []
})
const isCreating = shallowRef(false)
const isApplying = shallowRef(false)
const score = ref()

onBeforeMount(async () => {
  // if (!testsStore.optionsSkills.length) {
  //   testsStore.fetchSkills({})
  // }
  clearData()

  if (!testsStore.optionsPersona.length) {
    testsStore.fetchPersona({})
  }

  if (!learningPath.learningPathList.length) {
    await learningPath.fetchLearningPath({})
  }
  learningPathsOptions.value = learningPath.learningPathList.map((item) => ({ label: item.name, value: item.id }))

  testsStore.errorMsgResetTests({
    status: false,
    challenge: false,
    challenge_msg: '',
    persona: false,
    persona_msg: '',
    skills: false,
    skills_msg: '',
    score: false,
    score_msg: '',
    lab_duration: false,
    lab_duration_msg: ''
  })
  if (props.id) {
    getDataInfo()
  }
})

async function openWindow(solu) {
  if (solu.length > 0) {
    solutions.value = []
    for (const data of solu) {
      const finalResult = await labStore.getMarkdownData(data)
      solutions.value.push(finalResult.data)
    }
  } else {
    showData.value = true
  }
}
function clearData() {
  tests.value = {
    challenge: null,
    score: null,
    lab_duration: null,
    learningPaths: [],
    persona: []
  }
  testsStore.resetChallenges()
}
function getDataInfo() {
  tests.value.challenge =
    { label: testsStore.testsInfo.challenge_name, value: testsStore.testsInfo.sk } =
    tests.value.lab_duration =
      testsStore.testsInfo.lab_duration

  tests.value.persona = testsStore.testsInfo.persona.map((data) => ({ label: data, value: data }))
  tests.value.skills = testsStore.testsInfo.skills.map((data) => ({ label: data, value: data }))
}
async function onSubmit() {
  isCreating.value = true
  const data = {
    challenge: tests.value.challenge.value,
    learning_path_ids: tests.value.learningPaths,
    test: props.name === 'testIndex' ? urlSafeBase64Decode(route.params.testId) : assignmentStore.attachChallenge.sk,
    skills: tests.value.skills,
    persona: tests.value.persona,
    score: score.value ? Number(score.value) : undefined
  }

  if (props.id) {
    await testsStore.updateTests(data)
  } else {
    await testsStore.createTests(data)
  }
  if (testsStore.statusOfAPI) {
    tests.value = {
      challenge: null,
      score: null,
      lab_duration: null
    }
    onCancel()
  }

  isCreating.value = false
}

function onCancel() {
  emit('onCancel', { show: true })
}

async function callChallenges() {
  testsStore.resetChallenges()
  isApplying.value = true

  const data = {
    pagination: {
      learning_path_ids: tests.value.learningPaths,
      skills: tests.value.skills,
      persona: tests.value.persona,
      test: assignmentStore.attachChallenge.sk
    }
  }
  await testsStore.fetchChallenges(data)

  tests.value.challenge = null
  score.value = undefined
  isApplying.value = false
}

function loadMoreTests(pagination) {
  let data = {}
  if (Object.keys(testsStore.listChallengesKey).length === 0) {
    data = {
      pagination: {
        skills: tests.value.skills?.map((data) => data.value),
        persona: tests.value.persona?.map((data) => data.value),
        learning_path_ids: tests.value.learningPaths
      },
      reset: false
    }
  } else {
    data = {
      pagination: {
        skills: tests.value.skills?.map((data) => data.value),
        learning_path_ids: tests.value.learningPaths,
        test: urlSafeBase64Decode(route.params.testId),
        persona: tests.value.persona?.map((data) => data.value),

        ...{ last_value: testsStore.listChallengesKey }
      },
      reset: false
    }
  }
  testsStore.fetchChallenges(data)
}

function getDisable(item) {
  return fetchTestsId.value.includes(item.value)
}

function handleSelectChallenge(event) {
  score.value = event?.score
}

const fetchTestsId = computed(() => testsStore.tests?.map((item) => item.sk) ?? [])
</script>
