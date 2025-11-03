<template>
  <div class="q-pa-md">
    <AseTabs v-model="tab" class="full-width" :tabs="tabs" />
    <q-tab-panels animated class="q-mt-md" v-model="tab">
      <q-tab-panel name="CompleteCourse">
        <CompleteCourse :values="values" />
      </q-tab-panel>
      <q-tab-panel name="CompleteChallenge">
        <CompleteChallenge :values="values" />
      </q-tab-panel>
      <q-tab-panel name="Medals">
        <Medals />
      </q-tab-panel>
      <q-tab-panel name="Certificates">
        <Certificates />
      </q-tab-panel>
      <q-tab-panel name="Badges">
        <Badges />
      </q-tab-panel>
      <q-tab-panel name="Activity">
        <Activity :values="values" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import Badges from 'components/profile/achievements/Badges.vue'
import Certificates from 'components/profile/achievements/Certificates.vue'
import Medals from 'components/profile/achievements/Medals.vue'
import { computed, ref } from 'vue'
import Activity from './userInfo/Activity.vue'
import CompleteChallenge from './userInfo/CompleteChallenge.vue'
import CompleteCourse from './userInfo/CompleteCourse.vue'

const props = defineProps({
  user: { type: Object, required: true, default: () => null }
})

const tab = ref('CompleteCourse')
const tabs = ref([
  { name: 'CompleteCourse', label: 'Completed Courses / Playgrounds', key: 'completed_courses' },
  { name: 'CompleteChallenge', label: 'Completed Challenges', key: 'completed_challenges' },
  { name: 'Medals', label: 'Medals', key: 'medals_earned' },
  { name: 'Certificates', label: 'Certificates', key: 'certificates_earned' },
  { name: 'Badges', label: 'Badges', key: 'badges_earned' },
  { name: 'Activity', label: 'Activity', key: 'activities' }
])

const values = computed(() => {
  const findCurrentTab = tabs.value.find((ele) => ele.name === tab.value)
  return props.user[findCurrentTab.key]
})
</script>
