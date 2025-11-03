<template>
  <!-- Loading Indicator -->
  <span class="q-loading-spin" v-if="profileStore.isLoading" role="status" aria-live="polite">
    <q-spinner-hourglass class="on-left" />
    Loading...
  </span>

  <!-- Certificates List -->
  <div class="row" v-else role="region" aria-labelledby="certificates-section-title">
    <h2 id="certificates-section-title" class="sr-only">User Certificates</h2>

    <div v-for="(certificate, index) in certificates" class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" :key="index">
      <AseCard
        class="cursor-pointer overflow-hidden"
        sectionClass="q-pa-none"
        flatCard
        :aria-label="`Certificate issued on ${dateFormatReadable(certificate.issueDate)}`"
        tabindex="0"
        role="button"
        @click="showAchievementInfo(certificate.certificateNO)"
      >
        <div class="q-pa-md">
          <q-img
            v-if="certificate.certificateImageLink"
            contain
            :src="certificate.certificateImageLink"
            :alt="`Certificate image issued on ${dateFormatReadable(certificate.issueDate)}`"
          />
          <q-img v-else contain src="~assets/certificate_logo.png" alt="Default certificate image" />
        </div>
        <div class="bg-secondary avenir-bold text-white q-pa-sm text-center" style="border-radius: 0 0 10px 10px">
          Issued on: {{ dateFormatReadable(certificate.issueDate) }}
        </div>
      </AseCard>
    </div>

    <!-- No Certificates Message -->
    <div
      v-if="certificates.length === 0 && !profileStore.isLoading"
      class="column flex full-width items-center"
      role="status"
      aria-live="polite"
    >
      <q-icon style="font-size: 102px; color: #9b9b9b" name="card_membership" aria-hidden="true" />
      <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing">No Certificates</p>
    </div>
  </div>

  <!-- Load More Button -->
  <div class="q-mt-md text-center">
    <AseButton
      v-if="profileStore.achievementsList?.length < profileStore.totalBadges"
      variant="secondary"
      :label="profileStore.isLoading ? 'Loading...' : 'Load more'"
      @click="loadMoreUsers()"
      :aria-label="profileStore.isLoading ? 'Loading more certificates' : 'Load more certificates'"
      :disabled="profileStore.isLoading"
    >
      <template v-if="profileStore.isLoading">
        <q-spinner-hourglass class="on-left" />
      </template>
    </AseButton>
  </div>
</template>

<script setup>
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useProfileStore } from 'src/store/pinia/profile'

const route = useRoute()

const profileStore = useProfileStore()

const certificates = computed(() => {
  return profileStore.achievementsList.filter((item) => item.certificateImageLink)
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
