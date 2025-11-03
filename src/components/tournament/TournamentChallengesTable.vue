<script setup>
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { useAssignmentStore } from 'src/store/pinia/assignment'
import { useTestsStore } from 'src/store/pinia/tests'
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { onMounted } from 'vue'
import { ref, onUnmounted } from 'vue'
import { computed } from 'vue'

const columns = [
  {
    name: 'name',
    label: 'Challenge Name',
    align: 'left',
    field: 'name'
  },
  {
    name: 'type',
    label: 'Type',
    align: 'left',
    field: 'isCustom',
    format: (val) => (val ? 'Custom' : 'Default')
  },
  {
    name: 'score',
    label: 'Score',
    align: 'left',
    field: 'score',
    format: (val) => val ?? 'N/A'
  },
  {
    name: 'difficulty',
    label: 'Difficulty',
    align: 'left',
    field: 'difficulty',
    format: (val) => val ?? 'N/A'
  },
  {
    name: 'created_at',
    label: 'Created ON',
    align: 'left',
    field: 'created_at',
    format: (val) => dateFormatReadable(val)
  },
  {
    name: 'action',
    label: 'Action',
    align: 'right',
    field: ''
  }
]

const testStore = useTestsStore()
const aiQuizStore = useAiChallengesStore()
const assignmentStore = useAssignmentStore()

const deleteDetails = ref({
  open: false,
  data: null
})

const customTests = computed(() => {
  return testStore.customTests.map(({ created_at, name, ...rest }) => {
    const date = new Date(created_at)
    return {
      ...rest,
      name,
      isCustom: true,
      created_at: date.toISOString()
    }
  })
})
const data = computed(() => {
  return [...testStore.tests, ...customTests.value]
})

function handleOpenDelete(data = null, reset = false) {
  deleteDetails.value = {
    open: !reset,
    data
  }
}

function handleDelete() {
  deleteDetails.value.data?.isCustom ? handleDeleteCustomChallenge() : handleDeleteDefaultChallenge()
}

async function handleDeleteDefaultChallenge() {
  await testStore.deleteAddedChallenge(
    {
      challenge: deleteDetails.value.data?.sk,
      test: assignmentStore.attachChallenge.sk
    },
    true
  )
  handleOpenDelete(null, true)
}

async function handleDeleteCustomChallenge() {
  await aiQuizStore.detachChallenge(
    {
      challenges: [deleteDetails.value.data?._key],
      test_id: assignmentStore.attachChallenge.sk
    },
    false
  )
  const index = testStore.customTests.findIndex((test) => (test?._key ?? test?.sk) === deleteDetails.value.data?._key)

  testStore.customTests.splice(index, 1)
  handleOpenDelete(null, true)
}

onMounted(() => {
  testStore.clearTests()
})

onUnmounted(() => {
  testStore.clearTests()
})
</script>

<template>
  <AseTable
    empty-label="No challenges attached"
    :columns="columns"
    :rows="data"
    :hide-bottom="data.length > 1"
    :isLoading="testStore.isLoading"
    :pagination="{
      rowsPerPage: 0
    }"
  >
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        {{ props.row.name }}
        <q-tooltip>{{ props.row.name }}</q-tooltip>
      </q-td>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <div class="row justify-end items-center">
          <div class="action-btn bg-primary row items-center justify-center cursor-pointer">
            <q-icon name="delete" color="white" size="xs" @click="handleOpenDelete(props.row)" />
          </div>
        </div>
      </q-td>
    </template>
  </AseTable>

  <AseDialog v-model="deleteDetails.open" title="Detach Challenge" width="40vw">
    <div class="full-width row items-center justify-center q-py-md">
      <span class="text-center" style="font-size: 16px">Are you sure you want to detach the challenge?</span>
    </div>
    <template #footer>
      <q-separator />
      <div class="q-mt-md row items-center full-width justify-end q-px-md q-mb-md">
        <AseButton outline variant="plain" label="Cancel" :flat="false" class="q-px-xl text-black" @click="handleOpenDelete(null, true)" />
        <AseButton
          label="Detach"
          variant="primary"
          class="q-px-xl q-ml-sm"
          :loading="testStore.isLoading || aiQuizStore.isLoading"
          @click="handleDelete"
        />
      </div>
    </template>
  </AseDialog>
</template>

<style lang="scss">
.action-btn {
  height: 26px;
  width: 26px;
  clip-path: circle();
}
</style>
