<script setup>
import { customRequired, minLength } from 'src/utils/rules'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useCourseGeneration } from 'src/composables/useCourseGeneration'

const props = defineProps({
  edit: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['onCancel'])

const router = useRouter()
const { generateCourse, isLoading } = useCourseGeneration()

const formData = ref({
  course_name: '',
  topic: '',
  context: '',
  num_slides: 10
})

function handleClickCancel() {
  if (props.edit) {
    return emit('onCancel')
  }
  backToRoot()
}

async function handleSubmit() {
  await generateCourse(formData.value)
  backToRoot()
}

function backToRoot() {
  router.replace({
    name: 'company.creator_studio'
  })
}
</script>

<template>
  <q-form class="row full-width" @submit.prevent="handleSubmit">
    <AseInput
      v-model="formData.course_name"
      label="Course Name *"
      placeholder="Enter the name of the course"
      wrapper-class="col-12 q-mb-md"
      :rules="[...customRequired('Course name is required'), ...minLength(3, 'Course name must be at least 3 characters')]"
    />
    <AseInput
      label="Topic *"
      placeholder="Enter the topic of the course"
      wrapper-class="col-12 q-mb-md"
      :rules="[...customRequired('Topic is required'), ...minLength(3, 'Topic must be at least 3 characters')]"
      v-model="formData.topic"
    />
    <AseInput
      v-model="formData.context"
      label="Context *"
      type="textarea"
      placeholder="Add context for this course"
      wrapper-class="col-12 q-mb-md"
      :rules="[...customRequired('Context is required'), ...minLength(3, 'Context must be at least 3 characters')]"
    />
    <div class="col-12 q-pr-md q-mt-sm">
      <div class="q-mb-xs">Number of Slides</div>
      <q-slider v-model="formData.num_slides" marker-labels :min="4" :max="12" :inner-min="4" />
    </div>
    <div class="q-mt-lg">
      <AseButton outline label="Cancel" class="q-px-xl text-dark" @click="handleClickCancel" />
      <AseButton :label="edit ? 'Save' : 'Create'" type="submit" variant="secondary" class="q-px-xl q-ml-sm" :loading="isLoading" />
    </div>
  </q-form>
</template>
