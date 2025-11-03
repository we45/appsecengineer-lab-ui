<template>
  <div>
    <AseDialog v-model="showOverviewMuttable" title="Feedback" @update:model-value="handleDialogClose">
      <q-form @submit.prevent="confirmSubmit" v-if="!feedbackInfoOverview.data">
        <p class="portal_xlg padding_top_7">How would you rate this course ?</p>
        <q-field stack-label :model-value="rating" :rules="[...between(1, 5)]" dense borderless>
          <template v-slot:control>
            <q-rating
              name="quality"
              max="5"
              size="5em"
              color="yellow-9"
              icon="star_border"
              icon-selected="star"
              align="center"
              no-dimming
              v-model="rating"
            />
          </template>
        </q-field>
        <p class="portal_xlg">Is there anything else you'd like to share about this course ?</p>
        <AseInput fill-variant="filled" :autofocus="false" placeholder="Description" type="textarea" v-model="name" :rules="required" />
        <div class="full-width row items-center justify-end q-mt-md">
          <AseButton variant="primary" type="submit" :loading="feedBackStore.isLoading">Submit</AseButton>
        </div>
      </q-form>
      <q-card-section v-else>
        <p class="text-center text-subtitle1">Feedback submitted. Thank you!</p>
        <div align="right">
          <AseButton variant="secondary" @click="confirmClose()">Cancel</AseButton>
        </div>
      </q-card-section>
    </AseDialog>
  </div>
</template>

<script setup>
import { useFeedbackStore } from 'src/store/pinia/feedback'
import { required, between } from 'src/utils/rules'
import { computed, defineComponent } from 'vue'

defineComponent({
  name: 'FeedBackFormOverall'
})

const props = defineProps([
  'showOverview',
  'modelValue',
  'ratingOverview',
  'feedbackInfoOverview',
  'confirmSubmitOverview',
  'confirmCloseOverview'
])

const emit = defineEmits(['update:modelValue', 'update:ratingOverview', 'confirmSubmitOverview', 'confirmCloseOverview'])

const feedBackStore = useFeedbackStore()

function confirmSubmit() {
  emit('confirmSubmitOverview', { show: true })
}
function confirmClose() {
  emit('confirmCloseOverview', { show: false })
}

function handleDialogClose(value) {
  if (!value) {
    confirmClose()
  }
}

const showOverviewMuttable = computed({
  get: function () {
    return props.showOverview
  },
  set: function (value) {
    emit('update:showOverviewMuttable', value)
  }
})

const name = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const rating = computed({
  get() {
    return props.ratingOverview
  },
  set(value) {
    emit('update:ratingOverview', value)
  }
})
</script>
