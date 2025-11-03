<template>
  <q-btn-dropdown no-caps class="no-shadow q-mr-sm my-account-dropdown" flat dropdown-icon="keyboard_arrow_down" aria-label="User menu">
    <template #label>
      <div v-if="loginStore.fetchUserInfo" class="row items-center no-wrap">
        <q-avatar size="md" class="bg-primary">
          <img v-if="loginStore.fetchUserInfo.picture" :src="loginStore.fetchUserInfo.picture" />
          <span v-else>
            {{ loginStore.fetchUserInfo.firstName?.charAt(0) }}
          </span>
        </q-avatar>
        <div v-if="isDesktop" class="q-ml-sm label">My Account</div>
      </div>
    </template>

    <AseCard sectionClass="q-pa-none">
      <div v-if="loginStore.fetchUserInfo" class="flex q-pa-sm">
        <q-avatar size="4rem">
          <img v-if="loginStore.fetchUserInfo.picture" :src="profilePictureUrl" style="object-fit: cover" alt="User profile picture" />
          <div v-else aria-hidden="true">
            {{ loginStore.fetchUserInfo.firstName?.charAt(0) }}
          </div>
        </q-avatar>

        <div class="q-pa-sm">
          <div class="avenir-bold">{{ loginStore.fetchUserInfo.firstName }}</div>
          <div class>{{ loginStore.fetchUserInfo.email }}</div>
        </div>
      </div>

      <q-separator />

      <q-list style="min-width: 100px" class="user-dropdown" size="sm">
        <q-item
          v-for="item in dropdownItems"
          :key="item.id"
          clickable
          :to="item.to"
          @click="item.action"
          role="menuitem"
          :aria-label="item.ariaLabel"
          v-show="item.show"
        >
          <q-item-section side>
            <q-icon size="xs" :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </AseCard>
  </q-btn-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useLoginStore } from 'src/store/pinia/login'
import { useScreenSize } from 'src/composables/useScreenSize'
import { useNavigationItems } from 'src/composables/useNavigationItems'

const props = defineProps({
  onWriteReview: {
    type: Function,
    default: null
  }
})

const loginStore = useLoginStore()
const { isDesktop } = useScreenSize()
const { getDropdownItems } = useNavigationItems()
const { isMobile } = useScreenSize()

const dropdownItems = computed(() => getDropdownItems(isMobile.value, props.onWriteReview))

const profilePictureUrl = computed(() => loginStore?.user?.picture ?? loginStore.fetchUserInfo?.picture)
</script>

<style lang="scss">
.user-dropdown {
  :deep(.q-item) {
    min-height: 0;
  }
}
.my-account-dropdown {
  min-height: auto;
  .q-btn__content {
    .q-btn-dropdown__arrow,
    div {
      color: $text-primary !important;
    }
  }
}
</style>
