<template>
  <q-layout view="lHh Lpr lff" class="relative-position">
    <q-header>
      <q-toolbar class="bg-white q-pa-md q-pl-lg navbar" />
    </q-header>
    <q-drawer show-if-above :width="290" :miniWidth="90" :breakpoint="500">
      <q-scroll-area
        class="fit sidebar_wrapper"
        :style="{
          opacity: userActivity.isActivityDisabled ? '.6' : '1'
        }"
      >
        <div class="q-pt-sm q-pl-lg logo_wrapper flex align-center justify-start">
          <q-img src="/appsec_logo_light.svg" width="138px" fit="fill" class="logo" />
        </div>
        <q-list class="s-list q-py-md q-my-md" role="menu" aria-label="Sidebar menu">
          <q-item
            v-for="(item, index) in sidebarItems"
            :key="index"
            class="q-py-sm sidebar-link-item"
            :class="{ selected: activePage === item.name }"
            clickable
            v-ripple
            role="menuitem"
            @click="setActivePage(item.name)"
          >
            <q-item-section side>
              <q-img :src="`/newIcons/${item.img}.png`" height="40px" width="40px" fit="fill" style="scale: 1.2" />
            </q-item-section>
            <q-item-section>
              <div class="sidebar-item-label text-subtitle1">{{ item.label }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <PublicLabsPage v-if="activePage === 'labs'" :navbar="false" />
        <PublicCoursesPage v-else-if="activePage === 'courses'" :navbar="false" />
        <PublicVideos v-else :navbar="false" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useUserActivity } from 'src/store/pinia/userActivity'
import PublicLabsPage from 'src/pages/public_labs/PublicLabsPage.vue'
import PublicCoursesPage from 'src/pages/public_courses/PublicCoursesPage.vue'
import PublicVideos from 'src/pages/public_videos/PublicVideos.vue'

const userActivity = useUserActivity()
const activePage = ref('courses')

const setActivePage = (page) => {
  activePage.value = page
  console.log(page)
}

const sidebarItems = [
  {
    name: 'courses',
    label: 'Courses',
    icon: 'app:course',
    img: 'Courses'
  }
  // {
  //   name: 'labs',
  //   label: 'Labs',
  //   icon: 'app:running-lab',
  //   img: 'RunningLabs'
  // },
  // {
  //   name: 'videos',
  //   label: 'Videos',
  //   icon: 'app:live-event',
  //   img: 'LiveEvents'
  // }
]
</script>

<style lang="sass">
.sidebar-link-item
  background-color: $light-gray

.selected
  background: linear-gradient(90deg, #6600ff 34.33%, #5451e1 87.19%)
  color: white

.item-border
  border-radius: 6px

.sidebar_wrapper
  border-right: 1px solid $iron
  .logo_wrapper
    height: 80px
    border-bottom: 1px solid $iron
  &.dark-mode
    border-right: 1px solid #cdcdda33
    .logo_wrapper
      border-bottom: 1px solid #cdcdda33
</style>
