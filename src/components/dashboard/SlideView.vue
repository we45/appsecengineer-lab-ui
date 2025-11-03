<template>
  <div class="full-height" @click="moveToCourseInfo(data)">
    <CourseCardCompact
      :data="data"
      :loading="loading"
      :disable="false"
      :hideTooltip="!data || !data.instructors"
      wishlistCourseCard
      @moveToCourseInfo="moveToCourseInfo"
    />
  </div>
</template>

<script setup>
import { fullDateTimeUTC } from 'src/utils/reuseFunctions'
import CourseCardCompact from 'src/components/course/common/CourseCardCompact.vue'
import { defineComponent } from 'vue'

defineComponent({
  name: 'DashboardSlideView'
})

defineProps({
  data: { required: true, type: Object },
  loading: {
    type: [Boolean, String],
    default: false
  },
  showWishlist: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['moveToCourseInfo'])

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', data)
}
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
}
</style>
