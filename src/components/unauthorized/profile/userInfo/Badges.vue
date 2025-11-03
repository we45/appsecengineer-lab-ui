<template>
  <div>
    <div class="row items-center q-col-gutter-lg q-pa-md" v-if="values.length">
      <q-card class="my-card col-sm-4 col-xs-12 col-md-4" flat bordered v-for="(badge, index) in values" :key="index">
        <div class="row no-wrap justify-center q-px-lg">
          <q-img :src="badge.badge_image_link" height="300px" fit="contain" />
        </div>
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">{{ badge.title }}</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div align="middle" class="text-center" style="width: 100%">
            <div class="bannerView">
              <p class="text-caption text-weight-bold ase-roboto none-spacing">Issued on: {{ dateFormatter(badge.issue_date) }}</p>
            </div>
            <div class="bannerView">
              <p class="text-caption text-weight-bold ase-roboto none-spacing">Certificate Date: {{ dateFormatter(badge.created_date) }}</p>
            </div>
            <div class="bannerView">
              <p class="text-caption text-weight-bold ase-roboto none-spacing">Certificate Number: {{ badge.certificate_no }}</p>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn
            flat
            color="primary"
            icon="link"
            :href="`https://appsecengineer.verified.cv/en/verify/${badge.certificate_no}`"
            target="_blank"
          >
            Verification Link
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <NoDataCard title="No Badges found" v-else />
  </div>
</template>
<script>
import NoDataCard from '../NoDataCard.vue'
import { dateFormatReadable } from 'src/utils/reuseFunctions'

export default {
  components: {
    NoDataCard
  },
  props: {
    values: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup() {},
  methods: {
    dateFormatter(date) {
      return dateFormatReadable(date)
    }
  }
}
</script>
<style></style>
