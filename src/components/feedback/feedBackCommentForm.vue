<template>
  <AseDialog v-model="showDialog" title="Help make your training awesome!" width="600px">
    <q-form @submit.prevent="confirmSubmit">
      <div class="q-mb-md">
        <p class="text-subtitle2 q-mb-sm">Rate us. Takes less than 30 seconds</p>
      </div>

      <div class="q-mb-lg">
        <p class="portal_xlg q-mb-md">How would you rate this course ?</p>
        <q-field stack-label :model-value="feedBackRating" :rules="[...between(1, 5)]" dense borderless>
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
              v-model="feedBackRating"
            />
          </template>
        </q-field>
      </div>

      <div class="q-mb-md">
        <AseInput
          :autofocus="false"
          placeholder="Description"
          type="textarea"
          v-model="name"
          :rules="required"
          label="Is there anything else you'd like to share about this course?"
          fill-variant="filled"
          height-variant="tall"
        />
      </div>

      <div class="row justify-end q-mt-lg">
        <AseButton label="Submit" type="submit" variant="primary" />
      </div>
    </q-form>
  </AseDialog>
</template>

<script>
import { required, between } from 'src/utils/rules'

export default {
  name: 'feedBackCommentForm',
  props: ['show', 'modelValue', 'rating', 'header'],
  emits: ['update:modelValue', 'update:rating', 'confirmSubmit', 'confirmClose'],

  data() {
    return {
      required,
      between
    }
  },
  methods: {
    confirmSubmit() {
      this.$emit('confirmSubmit')
    },
    confirmClose() {
      this.$emit('confirmClose')
    }
  },
  computed: {
    name: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    feedBackRating: {
      get() {
        return this.rating
      },
      set(value) {
        this.$emit('update:rating', value)
      }
    },
    showDialog: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    }
  }
}
</script>
<style lang="scss"></style>
