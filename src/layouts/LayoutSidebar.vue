<template>
  <q-drawer
    v-model="isSidebarOpen"
    :mini="miniMode && !isMobile"
    :overlay="!isDesktop && (!miniMode || isMobile)"
    show-if-above
    :width="isMobile ? screenDimensions.width : 290"
    :miniWidth="90"
    :breakpoint="0"
    class="relative-position"
  >
    <template v-slot:mini>
      <div
        class="mini-slot sidebar_wrapper column full-height"
        :class="{
          'no-pointer-events': userActivity.isActivityDisabled
        }"
        :style="{
          opacity: userActivity.isActivityDisabled ? '.6' : '1'
        }"
      >
        <div class="full-width logo_wrapper flex items-center justify-center q-mb-lg">
          <q-avatar size="46px">
            <q-img :src="$q.dark.isActive ? '/favicon_dark.svg' : '/favicon.svg'" />
          </q-avatar>
        </div>

        <q-scroll-area class="flex-1">
          <div class="column items-center justify-start s-list" role="menu" aria-label="Sidebar mini menu">
            <SidebarMiniItem v-for="(item, index) in miniSidebarItems" :key="index" :item="item" @item-click="handleSidebarItemClick">
              <template #template-sidebar-mini-user_name>
                <q-avatar size="40px" class="text-weight-bold ase-roboto" color="white" text-color="black">
                  {{ loginStore.fetchUserInfo.firstName[0] }}
                </q-avatar>
              </template>
            </SidebarMiniItem>
          </div>
        </q-scroll-area>
      </div>
    </template>
    <div
      class="sidebar_wrapper column full-height"
      :class="{ 'no-pointer-events': userActivity.isActivityDisabled }"
      :style="{
        opacity: userActivity.isActivityDisabled ? '.6' : '1'
      }"
    >
      <div class="q-pt-sm q-pl-lg logo_wrapper row items-center justify-start">
        <q-img :src="$q.dark.isActive ? '/appsec_logo_dark.svg' : '/appsec_logo_light.svg'" width="138px" fit="fill" class="logo" />
        <AseButton
          v-if="!isDesktop"
          class="absolute"
          icon="close"
          dense
          rounded
          size="md"
          style="right: 23px; top: 23px"
          @click="isSidebarOpen = false"
        />
      </div>

      <q-scroll-area class="flex-1">
        <q-list class="s-list q-py-md q-my-md" role="menu" aria-label="Sidebar menu">
          <SidebarItem v-for="(item, index) in fullViewSidebarItems" :key="index" :item="item" @item-click="handleSidebarItemClick">
            <template #template-sidebar-admin>
              <q-separator style="margin: 1rem 0rem" />
              <AdminItem :adminItems="adminItems" @item-click="handleSidebarItemClick" />
            </template>

            <template #template-sidebar-manager>
              <q-separator style="margin: 1rem 0rem" />
              <AdminItem :adminItems="adminItems" :isManager="true" @item-click="handleSidebarItemClick" />
            </template>
          </SidebarItem>
        </q-list>
        <div v-if="!loginStore.isCompanyAdmin && loginStore.isUserType === 'FT'" class="cursor-pointer q-pa-md">
          <q-img src="/newIcons/Upgrade.png" :height="100" @click="handleUpgradeClick" />
        </div>
      </q-scroll-area>
    </div>
  </q-drawer>
</template>

<script setup>
import AdminItem from './AdminItem.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarMiniItem from './SidebarMiniItem.vue'

import { useConfirmUser } from 'src/store/pinia/confirmUser'
import { useUserActivity } from 'src/store/pinia/userActivity'
import { useLoginStore } from 'src/store/pinia/login'
import { useScreenSize } from 'src/composables/useScreenSize'
import { useNavigationItems } from 'src/composables/useNavigationItems'

import { computed, onBeforeMount, shallowRef, ref, watch, onMounted, nextTick } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'

const loginStore = useLoginStore()
const confirmUser = useConfirmUser()
const userActivity = useUserActivity()

// Get sidebar items from useNavigationItems composable
const { adminItems, fullViewSidebarItems, miniSidebarItems } = useNavigationItems()

const props = defineProps({
  mini: {
    type: Boolean,
    required: true
  },
  sidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:mini', 'update:sidebarOpen'])

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const { screenDimensions, isMobile, isDesktop } = useScreenSize()

const miniMode = computed({
  get() {
    return props.mini
  },
  set(value) {
    emit('update:mini', value)
  }
})
const isSidebarOpen = computed({
  get() {
    return props.sidebarOpen
  },
  set(value) {
    console.log(value)

    emit('update:sidebarOpen', value)
  }
})

function handleSidebarItemClick() {
  isSidebarOpen.value = isDesktop.value
}

const handleUpgradeClick = () => {
  handleSidebarItemClick()
  router.push('/portal/upgrade')
}

onBeforeMount(async () => {
  // Profile store removed - profile information not fetched
  // if (!LocalStorage.getItem('EXPIRED_TIME')) {
  //   profileStore.fetchProfileDetailedInformation()
  // }
})
</script>

<style lang="scss">
.sidebar_wrapper {
  border-right: 1px solid $border-1;
  background: $bg-primary;
  .logo_wrapper {
    height: 80px;
    border-bottom: 1px solid $border-1;
    flex-shrink: 0;
  }
  .flex-1 {
    flex: 1;
  }
}
</style>
