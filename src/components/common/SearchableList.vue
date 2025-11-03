<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  popularTags: {
    type: Array,
    default: () => []
  },
  tagOptions: {
    type: Array,
    default: () => []
  },
  searchPlaceholder: {
    type: String,
    default: 'Search Technology...'
  },
  searchDebounce: {
    type: Number,
    default: 500
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hidePopularTags: {
    type: Boolean,
    default: false
  },
  notFoundMessage: {
    type: String,
    default: 'No results found'
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'remove:tag'])

const searchQuery = ref('')

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

function handleSearch() {
  emit('search', searchQuery.value)
}

function removeTag(tag) {
  emit('remove:tag', tag)
}
</script>

<template>
  <div class="q-pa-sm dropdown-content">
    <AseInput
      v-model="searchQuery"
      :placeholder="searchPlaceholder"
      height-variant="short"
      fill-variant="outlined"
      wrapperClass="q-mb-sm"
      :debounce="searchDebounce"
      :loading="isLoading"
      :disable="disabled"
      dense
      @update:modelValue="handleSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" size="16px" />
      </template>
    </AseInput>

    <div class="row items-center wrap q-gutter-xs q-mb-sm q-mt-sm">
      <q-chip v-for="tag in model" :key="tag" removable color="primary" text-color="white" size="md" @remove="removeTag(tag)">
        {{ tag }}
      </q-chip>
    </div>

    <AseCard flatCard>
      <div class="tags-options-container">
        <div v-if="isLoading && searchQuery" class="q-pa-md text-center">
          <q-spinner size="20px" />
        </div>

        <div v-else-if="popularTags.length && !searchQuery && !hidePopularTags" class="column items-start justify-start no-wrap">
          <div class="text-bold q-mb-sm underline">Popular tags</div>
          <AseCheckbox v-for="tag in popularTags" :key="tag" v-model="model" :val="tag" :label="tag" />
        </div>

        <div v-else-if="tagOptions.length" class="column items-start justify-start no-wrap">
          <AseCheckbox v-for="tag in tagOptions" :key="tag" v-model="model" :val="tag" :label="tag" />
        </div>

        <div v-else class="q-pa-md text-center">{{ notFoundMessage }}</div>
      </div>
    </AseCard>
  </div>
</template>

<style scoped>
.tags-options-container {
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-content {
  min-width: 250px;
}
</style>
