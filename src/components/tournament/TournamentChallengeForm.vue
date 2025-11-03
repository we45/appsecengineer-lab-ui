<script setup>
import { useLearningPathStore } from 'src/store/pinia/learningPath'
import { useTestsStore } from 'src/store/pinia/tests'
import { max, min, objectRequired } from 'src/utils/rules'
import { onMounted, ref } from 'vue'
import BaseMarkdown from 'components/shared/BaseMarkdown.vue'
import { useLabStore } from 'src/store/pinia/lab'

const props = defineProps({
  testId: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['onDone'])

const learningPathStore = useLearningPathStore()
const testStore = useTestsStore()
const labStore = useLabStore()

const learningPathOptions = ref([])
const selectedLearningPaths = ref([])
const solutions = ref([])
const isAttaching = ref(false)
const challengeFormData = ref({
  challenge: null,
  score: undefined
})

onMounted(() => {
  loadLeaningPaths()
  loadChallenges()
})

async function loadLeaningPaths() {
  if (!learningPathStore.learningPathChallengeCounts.length) {
    await learningPathStore.loadLPWithChallengeCount({})
  }
  learningPathOptions.value = learningPathStore.learningPathChallengeCounts.map((item) => ({
    label: item.learning_path_name ?? '',
    value: item.learning_path_id ?? '',
    challenges_count: item.challenges_count
  }))
}

async function loadChallenges() {
  testStore.resetChallenges()

  const learning_path_ids = selectedLearningPaths.value?.map((learningPath) => learningPath.value)

  const data = {
    pagination: {
      learning_path_ids: learning_path_ids?.length ? learning_path_ids : undefined
    }
  }

  await testStore.fetchChallenges(data)
}

function handleUpdateLearningPath() {
  if (!selectedLearningPaths.value?.length) {
    challengeFormData.value = {
      challenge: null,
      score: undefined
    }
  }
  loadChallenges()
}

function handleSelectChallenge(event) {
  solutions.value = []
  challengeFormData.value.score = event?.score
}

async function handleAttachChallenge() {
  isAttaching.value = true
  const learning_path_ids = selectedLearningPaths.value?.map((learningPath) => learningPath.value) ?? []
  const { score, challenge } = challengeFormData.value

  const payload = {
    challenge: challenge?.value,
    learning_path_ids,
    test: props.testId,
    score: score ? Number(score) : undefined
  }

  await testStore.createTests(payload, false)
  isAttaching.value = false

  emit('onDone')
}

async function openSolutionWindow() {
  if (challengeFormData.value.challenge?.solutions?.length > 0) {
    solutions.value = []
    for (const data of challengeFormData.value.challenge?.solutions) {
      const finalResult = await labStore.getMarkdownData(data)
      solutions.value.push(finalResult.data)
    }
  }
}

function isChallengeAttached(challenge) {
  const testIds = testStore.tests?.map((item) => item.sk) ?? []
  return testIds.includes(challenge?.value)
}

function clearFilters() {
  selectedLearningPaths.value = []
  challengeFormData.value = {
    challenge: null,
    score: undefined
  }
  testStore.resetChallenges()
  loadChallenges()
}
</script>

<template>
  <div class="row full-width">
    <div class="challenges_filter q-pa-md full-width">
      <div class="row items-center justify-center">
        <AseQSelect
          v-model="selectedLearningPaths"
          wrapper-class="col-10"
          label="Learning Paths"
          placeholder="Select learning paths"
          multiple
          :loading="learningPathStore.isLoading"
          :options="learningPathOptions"
          @update:model-value="handleUpdateLearningPath"
        >
          <template v-slot:option="{ itemProps, opt }">
            <q-item v-bind="itemProps">
              <q-item-section>
                <q-item-label>{{ opt.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge class="q-pa-sm q-px-md" style="border-radius: 20px">
                  <span class="avenir-bold">Challenges:</span>
                  &nbsp; {{ opt.challenges_count }}
                </q-badge>
              </q-item-section>
            </q-item>
          </template>
        </AseQSelect>
        <div class="col-2 row items-center justify-center q-pt-md">
          <span class="q-mt-md q-ml-sm avenir-bold text-no-wrap cursor-pointer" style="text-decoration: underline" @click="clearFilters">
            Clear Filters
          </span>
        </div>
      </div>
    </div>

    <q-form class="full-width q-mt-md" @submit.prevent="handleAttachChallenge">
      <AseQSelect
        v-model="challengeFormData.challenge"
        label="Challenges"
        placeholder="Select a challenge"
        wrapper-class="col-12 q-mt-sm q-mb-md"
        :loading="testStore.isLoading"
        :options="testStore.challenges"
        :option-disable="(opt) => isChallengeAttached(opt)"
        :rules="[...objectRequired('Select a challenge')]"
        @update:model-value="handleSelectChallenge"
      />
      <AseInput
        v-model="challengeFormData.score"
        :disable="!challengeFormData.challenge"
        label="Score"
        type="number"
        placeholder="Default score"
        :rules="[...min(0), ...max(100)]"
        wrapper-class="col-12"
      />
      <AseButton
        label="Attach"
        variant="secondary"
        class="col-12 q-mb-md q-mt-lg full-width"
        type="submit"
        :disable="!selectedLearningPaths?.length"
        :loading="isAttaching"
      />
    </q-form>
    <q-separator class="full-width q-my-md" />
    <div class="full-width">
      <div class="avenir-bold q-mb-sm" style="font-size: 1rem !important">Challenge Solution Viewer</div>
      <template v-if="challengeFormData.challenge">
        <div class="row full-width items-center justify-center">
          <AseExpansionItem
            v-if="challengeFormData.challenge?.solutions?.length"
            class="full-width"
            header-icon-path="/newIcons/Challenges.png"
            :title="challengeFormData.challenge?.label"
            subtitle="solution"
            @show="openSolutionWindow"
          >
            <template #body>
              <template v-if="solutions?.length">
                <div v-for="(data, index) of solutions" :key="index">
                  <BaseMarkdown v-if="data" :content="data" />
                </div>
              </template>
              <div v-else-if="!labStore.isLoading" class="q-mb-none text-center q-mt-lg">No solution details found</div>
              <q-spinner v-if="labStore.isLoading" color="primary" size="3em" />
            </template>
          </AseExpansionItem>
          <div v-else class="q-mb-none text-center q-mt-lg">No solutions found</div>
        </div>
      </template>
      <template v-else>
        <div class="q-mb-none text-center q-mt-lg">No challenge selected</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.challenges_filter {
  border-radius: 4px;
  background-color: $bg-page;
}
</style>
