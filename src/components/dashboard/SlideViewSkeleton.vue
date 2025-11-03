<template>
  <div class="full-height" role="status" aria-live="polite" aria-busy="true">
    <BaseCard class="full-height flex text-subtitle1 cursor-pointer q-pt-md q-px-sm q-pb-sm" aria-hidden="true">
      <div class="full-width content-wrapper">
        <!-- Wishlist Skeleton -->
        <div class="row justify-end q-mb-sm full-width">
          <q-skeleton type="circle" size="30px" aria-hidden="true" />
        </div>

        <!-- Course Image Skeleton -->
        <q-card-section class="q-pa-none col-2">
          <q-skeleton width="100%" height="150px" square style="border-radius: 8px" aria-hidden="true" />
        </q-card-section>

        <!-- Course Title Skeleton -->
        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton type="text" style="border-radius: 8px" aria-hidden="true" />
          <q-skeleton type="text" width="50%" style="border-radius: 8px" aria-hidden="true" />
        </q-card-section>

        <!-- Course Details Skeleton -->
        <q-card-section class="full-width q-pa-none ma-auto q-mt-md">
          <q-skeleton type="text" height="12px" style="border-radius: 8px" aria-hidden="true" />
          <div class="row justify-between items-center">
            <q-skeleton type="text" width="30%" style="border-radius: 8px" aria-hidden="true" />
            <q-skeleton type="text" width="30%" style="border-radius: 8px" aria-hidden="true" />
          </div>
        </q-card-section>
      </div>
    </BaseCard>
  </div>
</template>
