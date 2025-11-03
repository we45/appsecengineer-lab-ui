<template>
  <!-- Loading Indicator -->
  <span class="q-loading-spin" v-if="profileStore.isLoading" role="status" aria-live="polite">
    <q-spinner-hourglass class="on-left" />
    Loading...
  </span>

  <!-- Badges List -->
  <section class="row" v-else role="region" aria-labelledby="badges-section-title">
    <h2 id="badges-section-title" class="sr-only">User Badges</h2>

    <div v-for="(badge, index) in badges" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" :key="index">
      <AseCard
        class="cursor-pointer"
        sectionClass="q-pa-none"
        flatCard
        :aria-label="`Badge issued on ${dateFormatReadable(badge.issueDate)}`"
        tabindex="0"
        role="button"
        @click="showAchievementInfo(badge.certificateNO)"
      >
        <div>
          <q-img
            v-if="badge.badgeImageLink"
            contain
            :src="badge.badgeImageLink"
            :alt="`Badge image for ${dateFormatReadable(badge.issueDate)}`"
          />
          <q-img v-else contain src="~assets/badge-logo.png" alt="Default badge image" />
        </div>

        <div class="bg-secondary text-white avenir-bold q-pa-md text-center" style="border-radius: 0 0 10px 10px">
          Issued on: {{ dateFormatReadable(badge.issueDate) }}
        </div>
      </AseCard>
    </div>

    <!-- No Badges Message -->
    <div v-if="badges.length === 0 && !profileStore.isLoading" class="column flex full-width items-center" role="status" aria-live="polite">
      <q-icon style="font-size: 102px; color: #9b9b9b" name="card_membership" aria-hidden="true" />
      <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing">No Badges</p>
    </div>
  </section>

  <!-- Load More Button -->
  <div class="q-mt-md text-center">
    <q-btn
      v-if="profileStore.achievementsList?.length < profileStore.totalBadges"
      color="secondary"
      :label="profileStore.isLoading ? 'Loading...' : 'Load more'"
      @click="loadMoreUsers()"
      :aria-label="profileStore.isLoading ? 'Loading more badges' : 'Load more badges'"
      :disabled="profileStore.isLoading"
    >
      <template v-if="profileStore.isLoading">
        <q-spinner-hourglass class="on-left" />
      </template>
    </q-btn>
  </div>
</template>

<script setup>
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useProfileStore } from 'src/store/pinia/profile'

const profileStore = useProfileStore()

const route = useRoute()

const badges = computed(() => {
  return profileStore.achievementsList.filter((item) => item.badgeImageLink)
})

onMounted(async () => {
  if (!profileStore.achievementsList.length) {
    if (route.params.id) {
      await profileStore.fetchPublicBadges({ user: route.params.id, page: 1, page_size: 80 })
      return
    }
    await profileStore.fetchAchievements()
  }
})

async function loadMoreUsers() {
  const payload = {
    startIndex: profileStore.achievementsList.length,
    length: 80
  }
  await profileStore.fetchAchievements(payload)
}

function showAchievementInfo(id) {
  const url = `https://appsecengineer.verified.cv/en/verify/${id}`
  window.open(url, '_blank')
}
</script>
