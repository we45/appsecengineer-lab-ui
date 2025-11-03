<template>
  <div class="row justify-center">
    <div class="col-auto q-pr-sm">
      <slot name="search"></slot>
    </div>
    <div class="col-auto q-pr-sm">
      <BaseBtnDropdown :activeDropdownColor="proficiencyOptions.some((item) => progress.includes(item.value))" no-caps label="Proficiency">
        <q-option-group
          v-model="progress"
          :options="proficiencyOptions"
          size="sm"
          type="checkbox"
          class="ase-roboto portal_lg"
          active-color="text-active"
          :color="'grey-8'"
          keep-color
        >
          <template v-slot:label="opt">
            <div class="row items-center q-pr-sm">
              <q-avatar v-if="opt.logo" size="1.5em">
                <q-img :class="{ 'blur-logo': progress.includes(opt.value) }" :src="`filters/${opt.logo}`" />
              </q-avatar>
              <span class="q-pl-xs" :class="{ 'text-active': progress.includes(opt.value) }">{{ opt.label }}</span>
            </div>
          </template>
        </q-option-group>
      </BaseBtnDropdown>
    </div>
    <div class="col-auto q-pr-sm">
      <BaseBtnDropdown no-caps :activeDropdownColor="rolesOptions.some((item) => rolesData.includes(item.value))" label="Career">
        <q-option-group
          v-model="rolesData"
          :options="rolesOptions"
          size="sm"
          type="checkbox"
          class="ase-roboto portal_lg"
          active-color="text-active"
          color="grey-8"
          keep-color
        >
          <template v-slot:label="opt">
            <div class="row items-center q-pr-sm">
              <q-avatar v-if="opt.logo" size="1.5em">
                <q-img :class="{ 'blur-logo': rolesData.includes(opt.value) }" :src="`filters/${opt.logo}`" />
              </q-avatar>
              <span class="q-pl-xs" :class="{ 'text-active': rolesData.includes(opt.value) }">{{ opt.label }}</span>
            </div>
          </template>
        </q-option-group>
      </BaseBtnDropdown>
    </div>
    <div class="col-auto q-pr-sm">
      <BaseBtnDropdown
        no-caps
        :text-color="learningPath.learningPathOptions.some((item) => filteredLP.includes(item.value)) ? 'indigo-8' : 'portalColor'"
        :activeDropdownColor="learningPath.learningPathOptions.some((item) => filteredLP.includes(item.value))"
        label="Learning Path"
      >
        <q-option-group
          :options="learningPath.learningPathOptions"
          v-model="filteredLP"
          size="sm"
          type="checkbox"
          class="ase-roboto portal_lg"
          active-color="text-active"
          color="grey-8"
          keep-color
        >
          <template v-slot:label="opt">
            <div class="row items-center q-pr-sm">
              <q-avatar v-if="opt.logo" size="1.5em">
                <q-img :class="{ 'blur-logo': filteredLP.includes(opt.value) }" :src="`${opt.logo}`" />
              </q-avatar>
              <span class="q-pl-xs" :class="{ 'text-active': filteredLP.includes(opt.value) }">{{ opt.label }}</span>
            </div>
          </template>
        </q-option-group>
      </BaseBtnDropdown>
    </div>
    <div class="col-auto q-pr-sm">
      <BaseBtnDropdown
        class="radius-8 ase-roboto"
        no-caps
        :activeDropdownColor="playGroundOptions.some((item) => progress.includes(item.value))"
        label="Category"
      >
        <q-option-group
          v-model="progress"
          :options="playGroundOptions"
          size="sm"
          type="checkbox"
          class="ase-roboto portal_lg"
          active-color="text-active"
          color="grey-8"
          keep-color
        >
          <template v-slot:label="opt">
            <div class="row items-center q-pr-sm">
              <q-avatar v-if="opt.logo" size="1.5em">
                <q-img :class="{ 'blur-logo': progress.includes(opt.value) }" :src="`filters/${opt.logo}`" />
              </q-avatar>
              <span class="q-pl-xs" :class="{ 'text-active': progress.includes(opt.value) }">{{ opt.label }}</span>
            </div>
          </template>
        </q-option-group>
      </BaseBtnDropdown>
    </div>
    <div class="col-auto q-pr-sm">
      <BaseBtn @click="learningPathFilterApply()" no-caps :disable="coursesStore.isLoading">Apply</BaseBtn>
    </div>
    <div class="col-auto">
      <BaseBtn no-caps @click="clearData()" :disable="coursesStore.isLoading">Clear</BaseBtn>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useLearningPathStore } from 'src/store/pinia/learningPath'

import { defineComponent, onBeforeMount, ref } from 'vue'

defineComponent({
  name: 'AssignmentFilters'
})

const props = defineProps({
  id: {
    required: false
  },
  stateSelected: {}
})

const emit = defineEmits(['filterItems'])

const learningPath = useLearningPathStore()
const coursesStore = useCoursesStore()

const filteredLP = ref([])
const rolesData = ref([])

const progress = ref([])

const rolesOptions = ref([
  { value: 'Cloud Engineer', label: 'Cloud Engineer', logo: 'cloudEngineer.png' },
  { value: 'Developer', label: 'Developer', logo: 'developer.png' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', logo: 'devops.png' },
  { value: 'Security Engineer', label: 'Security Engineer', logo: 'securityEngineer.png' },
  { value: 'Security Champion', label: 'Security Champion', logo: 'securityChampion.png' },
  { value: 'Security Architect', label: 'Security Architect', logo: 'securityArchitect.png' },
  { value: 'Pentester', label: 'Pentester', logo: 'pentester.png' }
])
const playGroundOptions = ref([
  { value: 'PlayGround', label: 'PlayGround', logo: 'playground.png' },
  { value: 'Course', label: 'Course', logo: 'course.png' }
])
const proficiencyOptions = ref([
  {
    label: 'Beginner',
    value: 'Beginner',
    logo: 'beginner.png'
  },
  {
    label: 'Intermediate',
    value: 'Intermediate',
    logo: 'intermediate.png'
  },
  {
    label: 'Advanced',
    value: 'Advanced',
    logo: 'advanced.png'
  }
])

onBeforeMount(async () => {
  if (learningPath.learningPathOptions.length === 0) {
    const data = {}
    coursesStore.isLoading = true
    await learningPath.fetchLearningPath(data)
  }
  learningPathFilterApply()
})

function clearData() {
  progress.value = []
  filteredLP.value = []
  rolesData.value = []

  emit('filterItems', {
    data: {
      filters: [].concat(['Course', 'PlayGround']),
      learning_paths: [],
      roles: []
    }
  })
}

const learningPathFilterApply = debounce(() => {
  const data = {
    filters:
      progress.value.includes('Course') || progress.value.includes('PlayGround')
        ? progress.value
        : progress.value.concat(['Course', 'PlayGround']),
    learning_paths: filteredLP.value,
    roles: rolesData.value
  }

  emit('filterItems', { data: data })
})
</script>

<style scoped>
.text-active {
  color: #a09c9c;
}
.blur-logo {
  opacity: 0.5;
}
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px grey;
  border-radius: 12px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff754c;
  border-radius: 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ff754c;
}
</style>
