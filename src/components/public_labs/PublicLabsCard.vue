<template>
  <div class="full-height card-wrapper q-mx-xs">
    <div class="course-card full-height basic-shadow column items-start justify-start full-width q-pa-md relative-position">
      <div class="row items-start justify-start q-mb-auto">
        <h6 class="avenir-bold q-ma-none" style="max-width: 15rem">{{ data.lab_name || data.title }}</h6>
      </div>
      <ChipTab v-if="showChips" :items="chips(data)" />
      <q-img class="banner-img q-my-md" src="/logo.jpg" height="auto" fit="fill" />
      <q-btn @click="openDialog(data._key)" flat class="btn-bittersweet text-capitalize full-width">
        {{ showChips ? 'Select Lab' : 'Select Course' }}
      </q-btn>
    </div>
  </div>

  <BaseDialog v-model="dialog" :title="showChips ? 'Select Lab' : 'Select Course'" @close="dialog = false">
    <q-card>
      <q-card-section>
        <div class="text-h6">Are you sure you want to select this {{ showChips ? 'lab' : 'course' }}?</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Select" color="primary" noCaps @click="selectLab" :loading="publicLabsStore.isLoading || scormStore.isLoading" />
      </q-card-actions>
    </q-card>
  </BaseDialog>

  <div v-html="dynamicForm"></div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { usePublicLabsStore } from 'src/store/pinia/publicLabs'
import { useScormStore } from 'src/store/pinia/scorm/scorm'
import { formatTime, getRoundedHour } from 'src/utils/module/course'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const publicLabsStore = usePublicLabsStore()
const scormStore = useScormStore()
const $q = useQuasar()
const route = useRoute()
const dialog = ref(false)
const labId = ref('')
const isFormSubmitted = ref(false)
const dynamicForm = ref('')

const props = defineProps({
  data: { required: true, type: Object },
  showChips: { default: true, type: Boolean },
  scormDestinationId: { type: String }
})

const emit = defineEmits(['stepFoward'])

const chips = (item) => {
  let alarmTime = ` ${getRoundedHour(item.approx_time)} Hours`
  if (item.approx_time < 3600) {
    alarmTime = formatTime(item.approx_time)
  }
  return [
    {
      img: 'Alarm',
      label: alarmTime
    }
  ]
}

async function openDialog(lab_id) {
  dialog.value = true
  labId.value = lab_id
}

async function selectLab() {
  const coursePayload = {
    dispatches: [{ destinationId: props.scormDestinationId, courseId: props.data.id }]
  }

  if (props.showChips) {
    await publicLabsStore
      .selectLabs(labId.value, route.query.ltik)
      .then((response) => {
        dialog.value = false
        dynamicForm.value = response.data.data
        isFormSubmitted.value = true
      })
      .catch(() => {
        $q.notify({
          type: 'negative',
          message: 'Failed to select lab'
        })
      })
  } else {
    await scormStore.createDispatch(coursePayload).then(() => {
      dialog.value = false
      emit('stepFoward')
    })
  }
}
</script>

<style lang="scss" scoped>
.card-wrapper {
  min-height: min-content !important;

  .course-card {
    border-radius: 1rem;
    background-color: white;
    .banner-img {
      border-bottom-left-radius: 1.1rem !important;
      border-bottom-right-radius: 1.1rem;
    }
    .new-icon {
      width: 51px;
      height: 30px;
      left: -3px;
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
      top: 46%;
      z-index: 1;
      color: #ffffff;
    }
    &.smaller {
      h6 {
        font-size: 1rem;
      }
      .ideal-chip {
        p {
          font-size: 11px !important;
          span {
            font-size: 9px;
          }
        }
      }
    }
  }
}

.ideal-chip {
  background-color: $light-gray;
  border-radius: 1rem;
  height: 2rem;
}

.disabled {
  filter: grayscale(1);
}
</style>
