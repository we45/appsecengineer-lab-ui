<script setup>
import WishlistAction from 'src/components/course/WishlistAction.vue'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { formatTime, getRoundedHour } from 'src/utils/module/course'
import { onMounted } from 'vue'

const emit = defineEmits(['moveToCourseInfo'])

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  challengeMode: {
    type: Boolean,
    default: () => false
  },
  smallerText: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  hideTooltip: {
    type: Boolean,
    default: false
  },
  wishlistCourseCard: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()

const chips = ref([])
const idealFor = ref('')
const tooltipPosition = ref({ x: 0, y: 0 })
const showTooltip = ref(false)
const tooltipVisible = ref(false)

onMounted(() => {
  setChips()
  setIdealFor()
})

function setChips() {
  if (props.challengeMode) {
    chips.value = [
      {
        img: 'Questions',
        label: '1 Questions'
      }
    ]
    return
  }

  let alarmTime = `${getRoundedHour(props.data?.total_ttl)} Hours`
  if (props.data?.total_ttl < 3600) {
    alarmTime = formatTime(props.data?.total_ttl)?.replaceAll('m', ' Minutes')
  }
  chips.value = [
    {
      img: 'Alarm',
      label: alarmTime
    },
    {
      img: 'Books',
      label: `${props.data?.total_lessons ?? 0} Subjects`
    },
    {
      img: 'RunningLabs',
      label: `${props.data?.labs_count ?? 0} Labs`
    }
  ]
}

function setIdealFor() {
  try {
    if (!Array.isArray(props.data?.course?.career)) return props.data?.course?.career
    const value = props.data?.course?.career?.slice(0, 2)?.join(' / ')
    idealFor.value = value?.length ? value : '--'
  } catch (err) {
    idealFor.value = '--'
  }
}

async function moveToCourseInfo(data) {
  if (props.disable) return
  emit('moveToCourseInfo', { info: data })
}

async function handleCardClick() {
  if (!props.data?.is_completed) return
  moveToCourseInfo(props.data)
}

function calculateTooltipPosition(event) {
  const offset = 15
  const tooltipWidth = 320

  // Calculate position relative to viewport
  let x = event.clientX + offset
  let y = event.clientY + offset

  // Check right edge
  if (x + tooltipWidth > window.innerWidth) {
    x = event.clientX - tooltipWidth - offset
  }

  // Ensure minimum positions
  x = Math.max(offset, x)
  y = Math.max(offset, y)

  return { x, y }
}

function handleMouseMove(event) {
  if (showTooltip.value && !props.hideTooltip) {
    tooltipPosition.value = calculateTooltipPosition(event)
  }
}

function handleMouseEnter(event) {
  if (props.hideTooltip) return

  tooltipPosition.value = calculateTooltipPosition(event)
  showTooltip.value = true
  tooltipVisible.value = true
}

function handleMouseLeave() {
  showTooltip.value = false
  tooltipVisible.value = false
}
</script>

<template>
  <AseCard
    class="course_card_compact full-height"
    sectionClass="column justify-between relative-position"
    :class="{
      challengeMode,
      disabled: disable,
      'hide-details': wishlistCourseCard
    }"
    :style="{
      cursor: data.is_completed ? 'pointer !important' : 'default'
    }"
    @click.stop="handleCardClick"
    role="article"
    :aria-label="`Course: ${data.event_name}`"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="data?.is_new" class="new-icon absolute avenir-bold row items-center justify-start q-pl-sm" role="status" aria-live="polite">
      NEW
    </div>

    <!-- Course thumbnail and title -->
    <div class="full-width row items-start no-wrap q-mb-sm">
      <q-img v-if="data.logo" v-once class="col-5 course_card_thumbnail" :src="`${data.logo}`" :alt="`${data.event_name} thumbnail`" />
      <h6 class="col-7 course_card_title avenir-bold q-ma-none q-ml-sm" role="heading" aria-describedby="course-title" aria-level="4">
        {{ data.event_name }}
      </h6>
    </div>

    <div>
      <!-- Course content information -->
      <ChipTab v-if="!wishlistCourseCard" :items="chips" smallerText aria-label="Course details" />

      <!-- Course ideal for -->
      <IdealForChip v-if="!challengeMode" class="q-mt-sm" :idealFor="idealFor" />

      <!-- Course Progress -->
      <div class="row no-wrap items-center full-width justify-center q-my-sm">
        <template v-if="!challengeMode && !wishlistCourseCard">
          <q-icon name="schedule" size="xs" color="grey" aria-hidden="true" />
          <span class="text-caption q-ml-sm" :style="{ whiteSpace: 'nowrap' }" aria-live="polite">
            {{ formatTime((data.progress / 100) * data.total_ttl, true) }} / {{ formatTime(data.total_ttl, true) }}
          </span>
        </template>

        <AseLinearProgress aria-label="Course progress" class="q-mx-sm" :value="data.progress / 100" />
        <span class="text-caption">{{ data.progress ?? 0 }}%</span>
      </div>

      <!-- Course card action -->
      <div class="row items-center no-wrap justify-between">
        <AseButton
          v-if="!data.is_completed"
          class="full-width"
          :outline="data.is_enrolled"
          :label="data.is_enrolled ? 'Continue' : 'Start'"
          :loading="loading"
          @click="moveToCourseInfo(data)"
          :aria-label="data.is_enrolled ? 'Continue course' : 'Start course'"
        />
        <div v-else class="full-width">
          <AseSeparator size="2px" />
          <p class="avenir-bold text-center q-mb-none q-mt-xs completion-text" role="status" aria-live="polite">Completed</p>
        </div>

        <WishlistAction style="width: unset" :event="data" aria-label="Add to wishlist" />
      </div>
    </div>

    <Teleport v-if="showTooltip && !hideTooltip" to="body">
      <AseCard
        class="floating-tooltip q-pa-lg"
        role="tooltip"
        sectionClass="q-pa-none"
        dark
        :class="{ visible: tooltipVisible }"
        :style="{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          position: 'fixed'
        }"
        :aria-label="`${data.event_name}. ${data.description?.substring(0, 250)}${data.description?.length > 250 ? '...' : ''}`"
      >
        <h6 class="course_tooltip_title avenir-bold q-ma-none q-mb-md" role="heading" aria-describedby="course-title" aria-level="4">
          {{ data.event_name }}
        </h6>

        <p class="q-mb-none text-caption course_tooltip_desc wrap">
          <span>{{ data.description?.substring(0, 250) }}</span>
          <span v-if="data.description?.length > 250">...</span>
        </p>
      </AseCard>
    </Teleport>
  </AseCard>
</template>

<style lang="scss">
.course_card_compact {
  border-radius: 1rem;
  z-index: 3;
  min-height: 270px;
  max-height: 390px;

  &.challengeMode {
    min-height: 230px;
    max-height: 350px;
  }
  &.hide-details {
    min-height: 175px;
    max-height: 280px;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.6 !important;
  }
  .course_card_thumbnail {
    border-radius: 4px;
    max-height: 5rem;
    max-width: 8rem;
  }
  .course_card_title {
    font-size: 1rem;
    line-height: normal;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* Limit to 4 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5em;
    color: $text-primary;
  }
  .course_card_ideal {
    background-color: $light-gray;
    border-radius: 1rem;
    height: 2rem;
  }
  .new-icon {
    width: 51px;
    height: 30px;
    left: -3px;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    top: 15%;
    z-index: 1;
    color: $text-light-2;
    background-color: $bg-dark;
  }
  .completion-text {
    color: $text-light-1;
  }

  &.q-dark {
    .new-icon {
      background-color: $secondary;
    }
  }
}

.floating-tooltip {
  padding: 24px;
  border-radius: 12px;
  font-size: 14px;
  pointer-events: none;
  z-index: 9999;
  max-width: 20rem;
  opacity: 0;
  transition: opacity 0.1s ease-in-out;

  &.visible {
    opacity: 1;
  }
}

.course_tooltip_title {
  font-size: 1rem;
  line-height: normal;
  color: $text-light-2 !important;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
}

.course_tooltip_desc {
  word-break: break-word;
  color: $text-light-2 !important;
}
</style>
