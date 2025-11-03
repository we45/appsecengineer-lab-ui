<template>
  <AseCard flatCard class="q-mt-lg wrapper_challenge_badge" sectionClass="row">
    <div :class="`q-pa-xs col-xs-3 col-sm-3 col-md-3 col-lg-3 none-spacing`">
      <div style="width: 100%">
        <a target="blank" :href="shareId">
          <q-img class="cursor_pointer" src="~assets/challenge-badge.png" @click="redirectFunction(shareId)"></q-img>
        </a>
      </div>
    </div>
    <div :class="`q-pa-xs col-xs-7 col-sm-7 col-md-7 col-lg-7 none-spacing flex flex-center`">
      <div>
        <p>
          Congrats! You’ve successfully completed the challenge.
          <br />
          View and share your accomplishment.
        </p>
        <div>
          <a size="sm" class="text-link" target="_blank" :href="shareId">Take me there</a>
        </div>
      </div>
    </div>
  </AseCard>
</template>
<script setup>
import { redirectFunction } from 'src/utils/helpers'
import { useQuasar } from 'quasar'

const $q = useQuasar()
defineProps(['shareId'])
</script>

<style lang="scss" scoped>
.wrapper_challenge_badge {
  background-color: $bg-surface;
}
</style>
