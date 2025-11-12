<template>
  <q-toolbar
    class="ase_toolbar q-pa-md q-pl-lg"
    style="border-left: none !important"
    :style="{
      paddingRight: isMobile ? '0px !important' : '',
      paddingLeft: isMobile ? '14px !important' : ''
    }"
    role="navigation"
    aria-label="Main navigation"
  >
    <q-img
      :src="$q.dark.isActive ? '/appsec_logo_dark.svg' : '/appsec_logo_light.svg'"
      :width="isTablet ? '138px' : '120px'"
      fit="fill"
      class="logo"
    />

    <q-space />

    <template v-for="item in navbarItems" :key="item.id">
      <AseButton
        dense
        class="q-px-xs"
        variant="plain"
        :color="item.color"
        :clickable="item.clickable"
        :href="item.href"
        :target="item.target"
        :to="item.to"
        :class="item.class"
        :aria-label="item.ariaLabel"
        @click="item.action"
      >
        <q-tooltip>{{ item.tooltip }}</q-tooltip>
        <q-img v-if="item.iconSrc" :src="item.iconSrc" width="26px" />
      </AseButton>
    </template>

    <!-- <UserDropdown :onWriteReview="openReviewModel" /> -->
  </q-toolbar>
</template>

<script setup>
import { LocalStorage, useQuasar } from 'quasar'

import { computed } from 'vue'

import { useScreenSize } from 'src/composables/useScreenSize'
import { useNavigationItems } from 'src/composables/useNavigationItems'

const emit = defineEmits(['toggleSidebar'])

const $q = useQuasar()

const { isMobile, isTablet } = useScreenSize()
const { getNavbarItems } = useNavigationItems()

const navbarItems = computed(() => getNavbarItems(isMobile.value))

if (LocalStorage.getItem('darkMode')) {
  $q.dark.set(true)
}
</script>

<style lang="scss">
.ase_toolbar {
  height: 80px;
  max-height: 80px;
  border-bottom: 1px solid $border-1;
  background-color: $bg-primary;
}
</style>
