<script setup></script>

<template>
  <div class="full-width">
    <div class="full-width row items-center justify-between no-wrap">
      <q-skeleton class="col-7 q-ml-md" square height="28px" style="border-radius: 5px" />
      <div class="col-4 row items-center justify-end" style="gap: 10px">
        <q-skeleton class="col-6" square height="28px" style="border-radius: 5px" />
        <q-skeleton type="circle" size="45px" />
      </div>
    </div>

    <div class="full-width row q-mt-sm items-start justify-between">
      <div class="col-9 q-pa-md">
        <q-skeleton width="100%" height="500px" square style="border-radius: 8px" />
        <div class="q-mt-md q-mb-xs row items-center justify-between">
          <q-skeleton width="49.6%" height="45px" square style="border-radius: 5px" />
          <q-skeleton width="49.6%" height="45px" square style="border-radius: 5px" />
        </div>
        <q-skeleton width="100%" height="200px" square style="border-radius: 5px" />
      </div>
      <div class="col-3 column items-center justify-start q-pl-sm q-pt-md">
        <template v-for="item in Array(15)" :key="item">
          <q-skeleton class="q-mt-sm" width="100%" height="45px" square style="border-radius: 5px" />
        </template>
      </div>
    </div>
  </div>
</template>
