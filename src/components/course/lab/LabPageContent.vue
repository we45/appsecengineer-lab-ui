<template>
  <div class="row full-width">
    <div class="col q-pb-md">
      <div class="row items-center justify-between q-mt-sm">
        <div class="avenir-bold text-subtitle1">
          {{ labData?.lab_name }}
        </div>

        <div>
          <AseButton variant="secondary" class="float-right" @click="accessLabRules">Prohibited activities</AseButton>
          <div v-if="labData?.is_alive && !delayLoadLabTime" class="float-right" style="display: inline-block; padding: 7px" align="right">
            <OnlyTimer
              align="right"
              :starttime="labData?.created_on"
              :endtime="labData?.running_ttl"
              :running_instance_id="labData?.running_instance_id"
              :instance_id="labData?.instance_id"
              :labInfo="labData"
            />
          </div>
        </div>
      </div>

      <div v-if="!labData?.is_alive || delayLoadLabTime" class="row items-center">
        <AseButton
          label="Start Lab"
          :disabled="labProvisionStore.isLoading || labProvisionStore.loaders.startProvisioner || addLongDelay"
          :loading="labProvisionStore.loaders.startProvisioner || addLongDelay"
          @click="provisionLab"
        />
      </div>

      <div v-else class="row q-mt-md">
        <div class="col-12 q-gutter-sm">
          <AseButton variant="secondary" label="End Lab" :loading="labProvisionStore.loaders.stopProvisioner" @click="isDelete = true" />
          <AseButton @click="accessLab">Access Lab</AseButton>
        </div>
      </div>

      <div class="row" v-if="getServerProgressLocal.length > 0">
        {{ getServerProgressLocal }}
        <div class="col" v-for="progress in getServerProgressLocal" :key="progress.id">
          <AseLinearProgress
            v-if="progress.progress"
            stripe
            color="info"
            rounded
            size="16px"
            :value="progress.progress / 100"
            class="q-mt-sm"
          >
            <div class="absolute-full flex flex-center">
              <p class="avenir-bold none-spacing">
                {{ progress.message }}
              </p>
            </div>
          </AseLinearProgress>
        </div>
      </div>

      <div v-if="getServerProgressLocal.length > 0" style="margin-top: 2%" class="row">
        <div class="col text-center">
          <p class="text-caption text-weight-bold ase-roboto red none-spacing">
            Please do not leave the page or refresh the page while server provisioning.
          </p>
        </div>
      </div>
    </div>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'you want to End this lab'"
      :loading="labProvisionStore.isLoading"
      @confirmDelete="labConfirmDeletion"
      @confirmDeleteCancel="isDelete = false"
    />
    <AseDialog v-model="labRulesPopup" persistent title="Disclaimer" @update:model-value="handleDialogClose">
      <q-list class="q-pa-md">
        <q-item class="" v-for="item in disclaimerRules" :key="item">
          <div class="text-subtitle1">
            {{ item }}
          </div>
        </q-item>
      </q-list>
    </AseDialog>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { defineComponent, ref, shallowRef, computed } from 'vue'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'

import OnlyTimer from 'src/components/course/lab/OnlyTimer.vue'
import Delete from 'src/components/course/lab/Delete.vue'

defineComponent({ name: 'LabPageContent' })

const props = defineProps({
  id: { required: false },
  provisionerToken: { type: String, required: false, default: undefined },
  tokenData: { type: String, required: false, default: undefined },
  partnerId: { type: String, required: false, default: undefined },
  isTokenBasedFlow: {
    type: Boolean,
    required: false,
    default: false
  }
})

const addLongDelay = shallowRef(false)
const delayLoadLabTime = shallowRef(false)
const isDelete = shallowRef(false)
const labRulesPopup = shallowRef(false)
const provisionLabStatus = shallowRef(true)

const getServerProgressLocal = ref([])
const disclaimerRules = ref([
  'Using automated scanners',
  'Using brute force attacks',
  'Denial of Service attacks',
  'Attacking other student machines in challenges where you might achieve a shell on the vulnerable system',
  'Attacking the lab infrastructure',
  'Users violating the above will be either temporarily or permanently banned from the website.',
  'If you are unsure about an activity, then please contact support Help@appsecengineer.com to confirm that it is allowed on our website.'
])

const $q = useQuasar()

const labProvisionStore = useLabProvisionStore()

const labData = computed(() => labProvisionStore.labData.data)

function showNotify(message, error = false, options = {}) {
  $q.notify({
    message,
    color: error ? 'negative' : 'positive',
    position: 'top',
    ...options
  })
}

async function provisionLab(id) {
  addLongDelay.value = true
  provisionLabStatus.value = true
  const data = {
    lab_id: labData.value.lab_id,
    token_data: props.tokenData,
    partner_id: props.partnerId
  }

  try {
    const status = await labProvisionStore.startProvisioner(data)
    getServerProgressLocal.value = [
      {
        progress: 10,
        message: status.message
      }
    ]

    console.log(status)

    if (status.success) {
      let progressStatus = await labProvisionStore.progressProvisioner({
        lab_id: labData.value.lab_id,
        event_id: data.event_id,
        token_data: props.tokenData,
        partner_id: props.partnerId
      })

      console.log(progressStatus)

      for (let i = 1; i < 10; i++) {
        if (progressStatus.response) {
          if (progressStatus.response.status === 500) {
            await resetData()
            showNotify(status.response.data.message, true, {
              progress: true,
              icon: 'warning'
            })
            break
          } else if (progressStatus.response.status === 400 && i === 9) {
            await resetData()
            showNotify('Something went wrong', true, {
              progress: true,
              icon: 'warning'
            })
            break
          } else if (progressStatus.response.status === 400) {
            getServerProgressLocal.value = [
              {
                progress: 50 * (i * 0.5),
                message: progressStatus.response.data.data.status || progressStatus.response.data.message
              }
            ]
          } else {
            await labProvisionStore.fetchLabInfo({
              lab_id: labData.value.lab_id,
              token_data: props.tokenData,
              partner_id: props.partnerId
            })
          }
        }

        await delay(8000)

        progressStatus = await labProvisionStore.progressProvisioner({
          lab_id: labData.value.lab_id,
          event_id: data.event_id,
          token_data: props.tokenData,
          partner_id: props.partnerId
        })

        if (progressStatus.success) {
          getServerProgressLocal.value = [
            {
              progress: 99,
              message: progressStatus.data.status
            }
          ]
          await delay(10000)
          await resetData()

          if (props.isTokenBasedFlow && props.tokenData && props.partnerId) {
            await labProvisionStore.fetchLabInfo({
              lab_id: labData.value.lab_id,
              token_data: props.tokenData,
              partner_id: props.partnerId
            })
          }

          break
        }

        if (i === 8) {
          await delay(4000)
        }
      }
    } else {
      await resetData()
      if (status.response) {
        showNotify(status.response.data.message, true, {
          progress: true,
          icon: 'warning'
        })
      }
    }
  } catch (er) {
    await resetData()
  } finally {
    addLongDelay.value = false
  }
}

async function delay(ms) {
  addLongDelay.value = true
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

async function resetData(time = 4000) {
  delayLoadLabTime.value = false
  getServerProgressLocal.value = []
  addLongDelay.value = true
  await new Promise((resolve) => {
    setTimeout(() => {
      addLongDelay.value = false
      resolve()
    }, time)
  })
}

function accessLab() {
  const url = 'https://' + labData.value.dns_entry
  window.open(url, '_blank')
}

async function labConfirmDeletion() {
  await labProvisionStore.stopProvisioner({
    lab_id: labData.value.lab_id,
    partner_id: props.partnerId,
    token: props.tokenData
  })
  await labProvisionStore.fetchLabInfo({
    lab_id: labData.value.lab_id,
    token: props.tokenData,
    partner_id: props.partnerId
  })
  isDelete.value = false
}

function accessLabRules() {
  labRulesPopup.value = true
}

function confirmRulesCancel() {
  labRulesPopup.value = false
}

function handleDialogClose(value) {
  if (!value) {
    confirmRulesCancel()
  }
}
</script>

<style scoped>
ul.disclimarStyle {
  position: relative;
  list-style: none;
  margin-left: 0;
  padding-left: 1.2em;
}
ul.disclimarStyle li:before {
  content: '*';
  position: absolute;
  left: 0;
}

:deep(.q-spinner) {
  background-color: transparent !important;
}
</style>
