<template>
  <AseDialog v-model="showDialog" title="Recommendations" width="70vw">
    <div>
      <div v-if="companyUsersStore.isLoading && !dynamicFields.length" class="q-mb-md">
        <div v-for="i in 6" :key="i" class="q-mb-md">
          <div class="q-mb-sm">
            <q-skeleton type="text" width="200px" height="20px" />
          </div>
          <div class="row q-gutter-sm">
            <q-skeleton v-for="j in 4" :key="j" type="QChip" width="80px" height="36px" />
          </div>
        </div>
      </div>

      <q-form v-else class="row full-width" @submit.prevent="submitRecommendation">
        <div class="col-12">
          <div v-for="(field, index) in dynamicFields" :key="field.id" class="q-mb-md">
            <div v-if="!field.type || field.type === 'choice'">
              <div class="text-subtitle2 text-weight-medium q-mb-sm">
                {{ index + 1 }}. {{ field.label }}
                <span v-if="field.required" class="text-red">*</span>
              </div>
              <div class="row q-gutter-sm">
                <q-chip
                  v-for="option in field.options"
                  :key="option"
                  clickable
                  @click="selectOption(field.id, option)"
                  :color="isSelected(field.id, option) ? 'primary' : $q.dark.isActive ? 'white' : 'black'"
                  :text-color="isSelected(field.id, option) ? 'white' : 'primary'"
                  :outline="!isSelected(field.id, option)"
                  class="cursor-pointer"
                >
                  {{ option }}
                </q-chip>
              </div>
            </div>
            <div v-else-if="'dropdown'">
              <div class="text-subtitle2 text-weight-medium q-mb-sm">
                {{ index + 1 }}. {{ field.label }}
                <span v-if="field.required" class="text-red">*</span>
              </div>
              <template v-if="field.id === skillsTagsFieldId">
                <!-- <SearchableList
                  v-model="field.value"
                  not-found-message="No tags found"
                  :is-loading="isSkillsTagsLoading"
                  :popular-tags="coursesStore.popularTags"
                  :tag-options="coursesStore.tagOptions"
                  :disabled="coursesStore.isLoading"
                  @search="handleSkillsTagsSearch"
                  @remove:tag="removeTag(field.id, $event)"
                /> -->
                <AseQSelect
                  v-model="field.value"
                  :multiple="field.multiSelect"
                  :options="learningPath.learningPathOptions || []"
                  wrapperClass="full-width"
                />
              </template>
              <template v-else-if="field.id === languagePreferenceFieldId">
                <AseQSelect
                  v-model="field.value"
                  :multiple="field.multiSelect"
                  :options="languagePreferenceOptions"
                  wrapperClass="full-width"
                />
              </template>
            </div>
          </div>
        </div>
      </q-form>
    </div>

    <template #footer>
      <div v-if="companyUsersStore.isLoading && !dynamicFields.length" class="q-mt-lg row full-width justify-end" style="gap: 4px">
        <q-skeleton type="QBtn" width="120px" height="40px" />
        <q-skeleton type="QBtn" width="180px" height="40px" />
      </div>
      <div v-else class="row full-width justify-end q-px-md q-mb-md" style="gap: 4px">
        <AseButton label="Ignore" variant="primary" outline @click="handleIgnore" />
        <AseButton label="Submit" variant="secondary" :loading="isSubmitting" @click="submitRecommendation" />
      </div>
    </template>
  </AseDialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCompanyUsers } from 'src/store/pinia/company/user.js'
import { useProfileStore } from 'src/store/pinia/profile'
import { useQuasar, LocalStorage } from 'quasar'
import SearchableList from 'src/components/common/SearchableList.vue'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useAiChallengesStore } from 'src/store/pinia/aiChallenges/aiChallenges'
import { useLearningPathStore } from 'src/store/pinia/learningPath'

const skillsTagsFieldId = 'skills_tags'
const languagePreferenceFieldId = 'language_preference'

const emit = defineEmits(['onDone', 'onCancel', 'update:modelValue'])
const companyUsersStore = useCompanyUsers()
const profileStore = useProfileStore()
const coursesStore = useCoursesStore()
const aiChallengesStore = useAiChallengesStore()
const learningPath = useLearningPathStore()

const $q = useQuasar()
const isSubmitting = ref(false)
const isSkillsTagsLoading = ref(false)
const languagePreferenceOptions = ref([])
const dynamicFields = ref([])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function isSelected(fieldId, value) {
  const field = dynamicFields.value.find((f) => f.id === fieldId)
  if (field?.multiSelect) {
    return field.value?.includes(value) || false
  }
  return field.value === value
}

function selectOption(fieldId, value) {
  const field = dynamicFields.value.find((f) => f.id === fieldId)

  if (field?.multiSelect) {
    if (!field.value) field.value = []
    const index = field.value.indexOf(value)
    if (index > -1) {
      field.value.splice(index, 1)
    } else {
      field.value.push(value)
    }
  } else {
    field.value = field.value === value ? null : value
  }
}

function getValidFormData(data = []) {
  const newData = {}
  data.forEach((item) => {
    const hasValidValue = item.multiSelect ? item.value?.length > 0 : item.value != null && item.value !== ''
    if (item.id === languagePreferenceFieldId) {
      if (hasValidValue) {
        newData[item.id] = [item.value]
      }
    } else if (item.id === skillsTagsFieldId) {
      if (hasValidValue) {
        newData[item.id] = item.value.map((option) => option.value)
      }
    } else if (hasValidValue) {
      newData[item.id] = item.value
    }
  })

  return newData
}

async function submitRecommendation() {
  isSubmitting.value = true
  const payload = getValidFormData(dynamicFields.value)
  const result = await companyUsersStore.submitUserRecommendations(payload)

  if (result?.success) {
    showDialog.value = false
    await profileStore.fetchProfileDetailedInformation()
    emit('onDone')
  }
  isSubmitting.value = false
}

async function handleSkillsTagsSearch(searchQuery = '') {
  coursesStore.tagOptions = []
  const val = searchQuery.trim() ?? ''
  if (val && val !== '' && val.length >= 2) {
    isSkillsTagsLoading.value = true
    await coursesStore.searchTags(
      {
        query: val,
        limit: 50
      },
      false
    )
    isSkillsTagsLoading.value = false
  }
}

function removeTag(fieldId, tag) {
  const field = dynamicFields.value.find((f) => f.id === fieldId)
  if (field?.multiSelect) {
    const index = field.value.findIndex((t) => t === tag)
    if (index > -1) {
      field.value.splice(index, 1)
    }
  }
}

function handleIgnore() {
  const userEmail = profileStore.profileDetailedInfo.email
  const ignoreDate = JSON.stringify([
    {
      email: userEmail,
      formIgnore: true
    }
  ])
  LocalStorage.set('feedbackFormIgnore', ignoreDate)
  showDialog.value = false
  emit('onCancel')
}

onMounted(async () => {
  if (!aiChallengesStore.programmingLanguagesWithVulnerabilities?.length) {
    await aiChallengesStore.fetchVulnerabilityMap()
  }
  languagePreferenceOptions.value = aiChallengesStore.programmingLanguagesWithVulnerabilities.map((item) => item?.support || '')
  if (!companyUsersStore.userRecommendations.data?.length) {
    await companyUsersStore.fetchUserRecommendations()
  }
  const data = companyUsersStore.userRecommendations?.data || []
  dynamicFields.value = data.map((item) => ({ ...item, value: item.multiSelect ? [] : null }))
})
</script>
