<template>
  <q-layout view="lHh Lpr lff" class="relative-position" :class="{ blur_data: confirm }">
    <q-linear-progress
      v-if="loader.isLoading"
      :indeterminate="loader.isLoading"
      trackColor="white"
      color="primary"
      class="absolute full-width"
      style="z-index: 9999"
    />
    <q-header elevated class="bg-transparent">
      <div class="row justify-between flex-center relative-position">
        <MainNavbar />
      </div>
    </q-header>
    <q-page-container>
      <q-page
        style="height: max-content"
        :style="{
          paddingLeft: !isDesktop ? (isSidebarOpen ? '20px !important' : '0px !important') : '',
          paddingRight: !isDesktop ? '0px !important' : ''
        }"
      >
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer
      class="row justify-between bg-transparent items-center no-wrap q-pr-xl q-pl-md ase_footer q-my-md q-mr-xs q-ml-md"
      style="gap: 10px"
      :class="[
        {
          'column q-pa-none': isMobile
        }
      ]"
      :style="{
        flexDirection: isMobile ? 'column-reverse' : ''
      }"
    >
      <div class="copyright">
        AppSecEngineer
        <span>&#169;</span>
        {{ getCurentYear() }}
      </div>
      <div
        class="row items-center"
        :class="{
          'full-width justify-between': isMobile
        }"
        style="gap: 15px"
      >
        <a href="https://www.appsecengineer.com/privacy-policy" style="text-decoration: none" target="_blank">Privacy Policy</a>

        <a
          href="https://www.g2.com/products/appsecengineer/take_survey?utm_source=review-widget"
          title="Write a review of AppSecEngineer on G2"
          target="_blank"
        >
          <img
            v-if="isLearningOrigin()"
            class="full-width"
            style="max-width: 100px"
            alt="Review AppSecEngineer on G2"
            src="https://www.g2.com/products/appsecengineer/widgets/stars?color=white&amp;type=reviews"
          />
        </a>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { LocalStorage } from 'quasar'
import { getCurentYear } from 'src/utils/helpers'
import { ref } from 'vue'
import MainNavbar from './MainNavbar.vue'
import { useGlobalLoaderStore } from 'src/store/pinia/loader'
import { provideScreenSize } from 'src/composables/useScreenSize'

const { isMobile, isDesktop } = provideScreenSize()
const loader = useGlobalLoaderStore()

const confirm = ref(LocalStorage.getItem('verify') === 'FORCE')

function isLearningOrigin() {
  return window.location.origin === 'https://learning.appsecengineer.com'
}
</script>

<style lang="scss">
.blur_data {
  filter: saturate(10%);
  color: $blur !important;
}

.bg-primary-custom {
  background-color: var(--color-bg-primary);
}

.ase_footer {
  .copyright,
  a {
    color: $text-primary;
  }
}
</style>
