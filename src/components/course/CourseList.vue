<template>
  <AseCard bordered class="relative-position q-py-sm" @click="moveToCourseInfo(data)">
    <div
      v-if="data.live_at"
      class="absolute-top-right bg-primary flex items-center q-pr-sm text-white z-fab"
      style="border-top-right-radius: inherit"
    >
      <q-spinner-rings v-if="isLiveIn12Hours" color="white" size="1.4rem" />
      &nbsp;
      <span>
        {{ isItFutureDate ? `Starts in ${timeUntilTheEvent(data.live_at)}` : `Event Streamed on ${fullDateTimeUTC(data.live_at)}` }}
      </span>
      <q-tooltip v-if="!isLiveIn12Hours" anchor="top middle" self="center middle">
        Live Event starts in {{ timeUntilTheEvent(data.live_at) }}
      </q-tooltip>
    </div>
    <q-item clickable v-ripple>
      <q-item-section avatar class="col-3">
        <q-img :src="data.logo" height="100px" fit="cover" class="cover-img" />
      </q-item-section>

      <q-item-section class="column justify-center">
        <div class="text-subtitle1">{{ data.name }}</div>
        <div class="text-subtitle">
          <span v-if="data?.instructors?.length">By {{ data.instructors[0].name }}</span>
        </div>
        <div v-if="data.proficiency" class="text-subtitle1 text-weight-medium text-capitalize">
          <span>{{ data.proficiency === 'Basic' ? 'Beginner' : data.proficiency }}</span>
        </div>
      </q-item-section>

      <slot name="progress">
        <q-item-section v-if="data.is_enrolled" class="q-pt-md" side>
          <q-circular-progress
            show-value
            font-size="12px"
            :value="data.progress"
            size="40px"
            :thickness="0.3"
            color="black"
            track-color="green-12"
          >
            {{ data.progress + '%' }}
          </q-circular-progress>
        </q-item-section>
        <q-item-section v-else-if="!data.is_enrolled" side>
          <AseButton class="q-mt-sm text-bold" size="12px" @click.stop="moveToCourseInfo(data)">
            {{ data.live_at ? 'ENROLL' : 'START' }}
          </AseButton>
        </q-item-section>
      </slot>
    </q-item>
  </AseCard>
  <slot name="tooltip">
    <CourseTooltip :data="data" />
  </slot>
</template>

<script setup>
import { date } from 'quasar'
import { fullDateTimeUTC, timeUntilTheEvent } from 'src/utils/reuseFunctions'
import { computed, defineComponent, defineProps, defineEmits, onBeforeMount, shallowRef } from 'vue'

import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'

defineComponent({
  name: 'DashboardSlideView'
})

const props = defineProps({
  data: { required: true, type: Object },
  fixedCarousel: { type: Boolean, default: false }
})

const emit = defineEmits(['moveToCourseInfo'])

const isLiveIn12Hours = shallowRef(false)
const live_at = shallowRef(undefined)

onBeforeMount(() => {
  if (props.data.live_at) {
    const added12 = date.addToDate(new Date(), { hours: 12 })
    live_at.value = date.formatDate(props.data.live_at, 'YYYY-MM-DDTHH:mm:ss+00:00')
    const formattedString = date.formatDate(added12, 'YYYY-MM-DDTHH:mm:ss+00:00')
    isLiveIn12Hours.value = live_at.value < formattedString
  }
})

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}

const isItFutureDate = computed(() => {
  if (!props.data.live_at) return false
  const liveAtDate = new Date(props.data.live_at)
  const currentDate = new Date()
  return liveAtDate > currentDate
})
</script>
