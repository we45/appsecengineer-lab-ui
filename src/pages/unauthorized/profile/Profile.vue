<template>
  <section class="bg-image q-px-md">
    <div v-if="user" class="full-height row items-center q-mx-auto" style="max-width: 1080px">
      <q-avatar class="bg-white" size="8rem">
        <q-img v-if="user.overview.profile_image" :ratio="1" :src="`https://${user.overview.profile_image}`" />
        <div v-else class="text-h1">{{ user.overview?.first_name?.[0] }}</div>
      </q-avatar>
      <h4 class="q-ml-md text-bold text-white">{{ user.overview?.first_name }} {{ user.overview?.last_name }}</h4>
    </div>
  </section>
  <div class="column">
    <div v-if="user" class="public-profile-page self-center">
      <UserStatistic :overview="user.overview" />
      <ProfileDetails :user="user" />
    </div>
  </div>
</template>

<script setup>
import ProfileDetails from 'components/unauthorized/profile/ProfileDetails.vue'
import UserStatistic from 'components/unauthorized/profile/UserStatistic.vue'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useProfileStore } from 'src/store/pinia/profile'
import { usePublicProfileStore } from 'src/store/pinia/unAuthorized/profile'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const profileStore = useProfileStore()
const publicProfileStore = usePublicProfileStore()

const user = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  $q.loading.show({ message: 'Loading profile page...' })
  const payload = { sub: route.params.id }
  const response = await publicProfileStore.fetchUser({ payload })
  loading.value = false

  if (!response.success) {
    router.push({ name: 'dashboard' })
  }
  $q.loading.hide()

  user.value = response.data.data

  await profileStore.fetchCoursesAndChallenges(payload)
  Object.assign(user.value, profileStore.coursesAndChallenges)
})
</script>

<style scoped>
.bg-image {
  background-image: url('src/assets/planet.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 15rem;
}
</style>
