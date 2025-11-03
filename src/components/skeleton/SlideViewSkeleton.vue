<template>
  <div class="full-height card-wrapper q-mx-sm">
    <div
      class="course-card full-height basic-shadow flex full-width q-pa-md"
      :class="[$q.dark.isActive ? 'bg-dark-1 dark-border' : 'bg-white']"
    >
      <div class="full-width content-wrapper">
        <div class="row justify-end q-mb-sm full-width">
          <q-skeleton type="circle" size="30px" />
        </div>

        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton type="text" style="border-radius: 8px" />
          <q-skeleton type="text" width="50%" style="border-radius: 8px" />
        </q-card-section>

        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton square width="100%" height="30px" style="border-radius: 8rem" />
        </q-card-section>

        <q-card-section class="q-pa-none q-my-md col-2">
          <q-skeleton width="100%" height="150px" square style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px" />
        </q-card-section>

        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton square width="100%" height="30px" style="border-radius: 8rem" />
        </q-card-section>

        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton type="text" width="95%" class="q-mx-auto" style="border-radius: 8px" />
        </q-card-section>

        <q-card-section class="full-width q-pa-none ma-auto q-mt-sm">
          <q-skeleton square width="100%" height="40px" style="border-radius: 8rem" />
        </q-card-section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>

<style lang="scss">
.card-wrapper {
  min-height: min-content !important;
  height: 100%;
  .course-card {
    border-radius: 1rem;
    .banner-img {
      border-bottom-left-radius: 1.1rem !important;
      border-bottom-right-radius: 1.1rem;
    }
  }
}
</style>
