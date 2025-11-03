<template>
  <div v-if="values.length" class="row q-col-gutter-lg">
    <div v-for="(item, index) in values" :key="index" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 full-height">
      <AseCard class="full-height" sectionClass="q-pa-none" flatCard>
        <q-img v-if="item.logo" :src="item.logo" class="top-radius" contain :ratio="16 / 9" position="top" />
        <div class="avenir-bold q-pa-md">{{ item?.name }}</div>
        <CourseTooltip v-if="item" :data="item" />
      </AseCard>
    </div>
  </div>
  <NoDataCard title="No Data found" v-else />
</template>
<script>
import NoDataCard from '../NoDataCard.vue'
import CourseTooltip from 'src/components/course/common/CourseTooltip.vue'

export default {
  components: {
    NoDataCard,
    CourseTooltip
  },
  props: {
    values: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
<style scoped lang="scss">
.bordered_info {
  border-radius: 12px 12px 12px 12px;
  border: 2.5px solid $border-1;
}
.top-radius {
  border-radius: 9.5px 9.5px 0px 0px;
}
</style>
