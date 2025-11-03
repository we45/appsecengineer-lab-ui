<script setup>
defineProps({
  title: {
    type: String,
    default: 'title'
  },
  data: {
    type: Array,
    default: () => []
  },
  fallbackText: {
    type: String,
    default: () => 'No data'
  },
  loading: {
    type: Boolean,
    default: false
  },
  dynamicLength: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <AseCard
    v-bind="$attrs"
    dark
    class="relative-position"
    :sectionStyle="{
      height: 'max-content !important'
    }"
    style="height: max-content"
  >
    <q-img src="/curveline.png" class="absolute-full" />
    <p
      class="avenir-bold text-center q-mt-sm"
      :style="{
        color: 'var(--color-text-light-2)',
        fontSize: '16px !important'
      }"
    >
      {{ title }}
    </p>
    <div
      class="column items-center no-wrap overflow-auto q-py-md hide-scroll"
      :class="{
        'justify-end': (data.length || loading) && !dynamicLength,
        'justify-center': !data.length && !loading,
        'justify-start': dynamicLength && !loading
      }"
      :style="{
        height: dynamicLength && !loading ? '16.5rem' : '85%',
        overflowY: dynamicLength && !loading ? 'scroll !important' : 'hidden'
      }"
    >
      <template v-if="loading">
        <div
          v-for="index in dynamicLength ? 4 : 3"
          :key="index"
          class="col-12 full-width skill-item row items-center justify-end q-pa-xs no-wrap q-mt-sm"
          :style="{ zIndex: 1, backdropFilter: 'blur(2px)' }"
        >
          <q-skeleton type="circle" height="100%" width="2.6rem" />
          <q-skeleton style="border-radius: 8px; margin-left: 1rem" width="100%" height="100%" />
        </div>
      </template>
      <template v-else-if="data.length">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="col-12 full-width skill-item row items-center justify-center q-px-sm q-py-sm q-mt-sm no-wrap"
          :class="{ 'bg-secondary': $q.dark.isActive }"
          :style="{ zIndex: 1, backdropFilter: 'blur(2px)' }"
        >
          <slot name="item" :item="item">
            <div class="row items-center justify-between no-wrap full-width q-pa-xs">
              <p
                class="q-mb-none font-paytone"
                :class="{ 'text-electric-indigo': !$q.dark.isActive }"
                :style="{
                  fontSize: '20px'
                }"
              >
                {{ item.value ?? 0 }}
              </p>
              <p
                class="q-mb-none q-mt-xs text-right"
                :style="{
                  fontSize: '12px'
                }"
              >
                {{ item.title }}
              </p>
            </div>
          </slot>
        </div>
      </template>
      <div
        v-else
        class="col-12 full-width skill-item row items-center justify-center q-px-sm q-py-sm no-wrap"
        :style="{ zIndex: 1, backdropFilter: 'blur(2px)' }"
      >
        <p class="text-electric-indigo q-mb-none font-paytone">{{ fallbackText }}</p>
      </div>
    </div>
  </AseCard>
</template>

<style scoped lang="scss">
.skill-item {
  background: $separator;
  border-radius: 8px;
  height: 46px !important;
  min-height: max-content !important;
  p {
    font-size: 16px;
  }
}
</style>
