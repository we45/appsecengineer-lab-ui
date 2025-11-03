<script setup>
import { useQuasar } from 'quasar'
import { useCoursesStore } from 'src/store/pinia/courses'
import { computed, shallowRef } from 'vue'

const listIcons = [
  {
    type: 'lab',
    icon: 'fas fa-flask',
    colorClass: 'text-primary'
  },
  {
    type: 'vid',
    icon: 'fas fa-video',
    colorClass: 'text-info'
  },
  {
    type: 'quiz',
    icon: 'fas fa-question',
    colorClass: 'text-primary'
  },
  {
    type: 'download',
    icon: 'fas fa-download',
    colorClass: 'text-error'
  },
  {
    type: 'media',
    icon: 'fas fa-photo-video',
    colorClass: 'text-warning'
  },
  {
    type: 'aiquiz',
    icon: 'fas fa-code',
    colorClass: 'text-secondary'
  }
]

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['switchToAnotherContent'])

const coursesStore = useCoursesStore()
const $q = useQuasar()

const isCompleted = shallowRef(props.content?.completed ?? false)

async function switchToAnotherContent(content) {
  emit('switchToAnotherContent', content)
}

async function markCompleted(id) {
  const subjectId = coursesStore.selectedCourseInfo.activeContentDetails?.subject?._key
  const contentId = coursesStore.selectedCourseInfo.activeContentDetails?.content?._key

  await coursesStore.markTopicCompleted(
    {
      event_id: coursesStore.selectedCourseInfo.rawInfo?._key,
      item_id: id,
      manual: true
    },
    subjectId,
    contentId
  )

  if (coursesStore.statusOfMarkingApi) {
    isCompleted.value = true
  }
}

function getActiveItemClass(itemId) {
  if (itemId !== coursesStore.selectedCourseInfo.activeContentDetails?.content?._key) return undefined
  return $q.dark.isActive ? 'text-secondary avenir-bold' : 'text-primary avenir-bold'
}
function isActiveContent(itemId) {
  if (itemId !== coursesStore.selectedCourseInfo.activeContentDetails?.content?._key) return false
  return $q.dark.isActive
}
</script>

<template>
  <q-list role="list">
    <q-item
      class="q-pa-sm"
      clickable
      @click="switchToAnotherContent(content)"
      role="listitem"
      :aria-label="`Course item: ${content.name}, Duration: ${content.formattedTime}`"
    >
      <!-- <pre>{{ coursesStore.selectedCourseInfo }}</pre> -->
      <q-item-section>
        <q-item-label class="flex items-center justify-between no-wrap">
          <div>
            <AseCheckbox
              v-if="!isCompleted && !content?.completed"
              size="xs"
              :modelValue="false"
              :disable="content.is_challenge_object || coursesStore.isMarking"
              @update:model-value="markCompleted(content?._key)"
              aria-label="Mark as completed"
            />
            <AseCheckbox v-else :modelValue="true" size="xs" disable aria-label="Completed" />

            <template v-for="item in listIcons" :key="item.type">
              <q-icon
                v-if="content.object_type === item.type"
                class="q-pr-sm"
                :class="item.colorClass"
                :name="item.icon"
                :aria-label="`${item.type} content`"
              />
            </template>

            <span class="cursor-pointer text-justify" :class="getActiveItemClass(content?._key)" :aria-current="coursesStore.isActive">
              {{ content.name }}
            </span>
          </div>
          <div class="column text-right">
            <span
              v-if="content.formattedTime !== '0:00'"
              class="float-right"
              :class="getActiveItemClass(content._key)"
              style="white-space: nowrap"
            >
              {{ content.formattedTime }}
            </span>
            <q-badge
              v-if="content.is_challenge_object"
              class="q-pa-sm q-my-sm bg-accent avenir-bold"
              rounded
              role="status"
              aria-label="Challenge item"
            >
              Challenge
            </q-badge>
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped>
:deep(.q-checkbox__svg) {
  background-color: transparent !important;
}
</style>
