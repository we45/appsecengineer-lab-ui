<script setup>
import { computed, ref } from 'vue'
import { useCoursesStore } from 'src/store/pinia/courses'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const coursesStore = useCoursesStore()

const searchQuery = ref('')
const isLoading = ref(false)

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const filterSelected = computed(() => {
  return props.modelValue.length > 0
})

async function handleSearch() {
  coursesStore.tagOptions = []
  const val = searchQuery.value.trim() ?? ''
  if (val && val !== '' && val.length >= 2) {
    isLoading.value = true
    await coursesStore.searchTags(
      {
        query: val,
        limit: 50
      },
      false
    )
    isLoading.value = false
  }
}
</script>

<template>
  <BaseBtnDropdown
    class="radius-8 ase-roboto full-width"
    no-caps
    :disabled="disabled"
    :class="{ active: filterSelected && !$q.dark.isActive, 'bg-blue-8': filterSelected && $q.dark.isActive }"
  >
    <template #label>
      <div class="row items-center justify-between" style="gap: 8px">
        <span>Technology</span>
        <q-chip v-if="modelValue.length" dense color="secondary" class="text-bold" size="sm" text-color="white">
          {{ modelValue.length }}
        </q-chip>
      </div>
    </template>

    <div class="q-pa-sm dropdown-content">
      <AseInput
        v-model="searchQuery"
        placeholder="Search Technology..."
        height-variant="short"
        fill-variant="outlined"
        wrapperClass="q-mb-sm"
        :debounce="500"
        :loading="coursesStore.isLoading"
        :disable="coursesStore.isLoading"
        dense
        @update:modelValue="handleSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="16px" />
        </template>
      </AseInput>

      <div class="tags-options-container">
        <!-- Loading state -->
        <div v-if="isLoading && searchQuery" class="q-pa-md text-center">
          <q-spinner size="20px" />
        </div>

        <div v-else-if="coursesStore.popularTags.length && !searchQuery" class="column items-start justify-start no-wrap">
          <div class="text-bold q-mb-sm underline">Popular tags</div>
          <AseCheckbox v-for="tag in coursesStore.popularTags" :key="tag" v-model="model" :val="tag" :label="tag" />
        </div>

        <div v-else-if="coursesStore.tagOptions.length" class="column items-start justify-start no-wrap">
          <AseCheckbox v-for="tag in coursesStore.tagOptions" :key="tag" v-model="model" :val="tag" :label="tag" />
        </div>

        <!-- No results -->
        <div v-else class="q-pa-md text-center">No tags found</div>
      </div>
    </div>
  </BaseBtnDropdown>
</template>

<style scoped>
.tags-options-container {
  overflow-y: auto;
}

.dropdown-content {
  min-width: 250px;
}
</style>
