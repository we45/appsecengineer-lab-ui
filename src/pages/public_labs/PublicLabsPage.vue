<template>
  <q-toolbar v-if="navbar" class="bg-white q-pa-md q-pl-lg navbar">
    <q-img src="/appsec_logo_light.svg" width="138px" fit="fill" />
  </q-toolbar>

  <div class="q-pa-lg none-spacing q-py-lg">
    <BaseInput
      class="q-mb-md q-mx-xs"
      placeholder="Search Labs"
      v-model="search"
      clearable
      @clear="publicLabsStore.fetchCourseLabs(route.query.courseId, route.query.ltik)"
      style="width: 100%; max-width: 26rem"
    >
      <template v-slot:append>
        <q-btn :disable="!search" dense flat rounded icon="search" />
      </template>
    </BaseInput>
    <div class="row">
      <template v-if="publicLabsStore.isLoading">
        <template v-for="item in Array(12)" :key="item">
          <div class="col-lg-4 col-md-6 col-6 q-mb-md course-card-wrapper">
            <SlideViewSkeleton />
          </div>
        </template>
      </template>

      <BaseDataFallBack v-if="filteredLabs.length === 0 && !publicLabsStore.isLoading" :title="'Sorry, No Data Found'" />
      <template v-for="(course, index) in filteredLabs" :key="index">
        <div class="col-lg-4 col-md-6 col-6 q-mb-md course-card-wrapper">
          <PublicLabsCard :data="course" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import SlideViewSkeleton from 'components/skeleton/SlideViewSkeleton.vue'
import PublicLabsCard from 'src/components/public_labs/PublicLabsCard.vue'
import BaseDataFallBack from 'src/components/wrappers/BaseDataFallBack/index.vue'
import { usePublicLabsStore } from 'src/store/pinia/publicLabs'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  navbar: { type: Boolean, default: true }
})

const route = useRoute()
const publicLabsStore = usePublicLabsStore()
const search = ref('')

onMounted(async () => {
  await publicLabsStore.fetchCourseLabs(route.query.courseId, route.query.ltik)
})

const filteredLabs = computed(() => {
  if (!search.value) {
    return publicLabsStore.labs
  }
  return publicLabsStore.labs?.filter((lab) => {
    return lab?.lab_name?.toLowerCase()?.includes(search.value.toLowerCase())
  })
})
</script>
