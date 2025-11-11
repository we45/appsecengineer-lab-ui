<script setup></script>

<template>
  <div class="full-width q-pa-md">
    <div class="full-width row items-center justify-between no-wrap q-mb-md">
      <q-skeleton class="col-7" square height="32px" style="border-radius: 5px" />
    </div>

    <div class="full-width">
      <div class="row items-center justify-between q-mb-md">
        <div class="col-sm-8">
          <q-skeleton width="60%" height="24px" square style="border-radius: 5px" />
        </div>
        <div class="col-sm-4 row justify-end">
          <q-skeleton width="150px" height="36px" square style="border-radius: 5px" />
        </div>
      </div>

      <div class="row items-center q-mb-md">
        <q-skeleton width="120px" height="40px" square style="border-radius: 5px" />
      </div>

      <div class="q-mt-md">
        <q-skeleton width="100%" height="300px" square style="border-radius: 8px" />
      </div>

      <div class="q-mt-md">
        <q-skeleton width="100%" height="16px" square style="border-radius: 8px" />
      </div>
    </div>

    <div class="q-mt-md q-ml-md q-mr-md">
      <div class="row q-gutter-sm q-mb-md">
        <q-skeleton width="120px" height="36px" square style="border-radius: 5px" />
        <q-skeleton width="120px" height="36px" square style="border-radius: 5px" />
        <q-skeleton width="120px" height="36px" square style="border-radius: 5px" />
      </div>

      <div class="q-mt-sm">
        <q-skeleton width="100%" height="200px" square style="border-radius: 8px" />
      </div>
    </div>
  </div>
</template>
