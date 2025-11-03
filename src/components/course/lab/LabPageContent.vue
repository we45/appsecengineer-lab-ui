<template>
  <div class="row full-width">
    <div class="col q-pa-md">
      <div v-for="lab in labStore.listLabData" :key="lab.id">
        <div class="row" style="margin-right: 1.5rem">
          <div class="col-sm-8" style="margin-top: 1%; padding-left: 1%; padding-right: 15%; word-break: break-word">
            <div class="avenir-bold text-subtitle1">
              {{ lab.name }}
              <q-badge class="q-pl-xs" v-if="lab.challenge_id" size="xs">Challenge</q-badge>
            </div>
          </div>
          <div class="col-sm-4" style="margin-top: 1%; padding-right: 1%">
            <AseButton variant="secondary" class="float-right" @click="accessLabRules()">Prohibited activities</AseButton>
            <div v-if="lab.is_alive && !delayLoadLabTime" class="float-right" style="display: inline-block; padding: 7px" align="right">
              <OnlyTimer
                align="right"
                :starttime="lab.created_on"
                :endtime="lab.running_ttl"
                :running_instance_id="lab.running_instance_id"
                :instance_id="lab.instance_id"
                :labInfo="lab"
              />
            </div>
          </div>
        </div>
        <div class="row items-center q-gutter-x-lg q-mt-md">
          <div v-if="!lab.is_alive || delayLoadLabTime">
            <AseButton
              v-if="!lab.is_alive || delayLoadLabTime"
              :disabled="disableProvision || newProvisionStore.isServerProvisioned || addLongDelay"
              @click="provisionLab(lab.id)"
              :loading="disableProvision || newProvisionStore.isServerProvisioned || addLongDelay"
            >
              {{ disableProvision || newProvisionStore.isServerProvisioned || addLongDelay ? 'Starting Lab...' : 'Start Lab' }}
            </AseButton>
          </div>
        </div>

        <div class="col-sm-12 col-md-12 q-my-md q-gutter-sm" v-if="lab.challenge_id">
          <AseButton variant="secondary" @click="$emit('hintData', { challenge_id: lab.challenge_id })">See Hint</AseButton>
          <AseButton variant="primary" outline @click="$emit('verifyLab', { challenge_id: lab.challenge_id })">
            Enter Challenge Completion Code
          </AseButton>
          <AseButton variant="secondary" @click="fetchSolution(lab.challenge_id)" v-if="lab.is_alive">See Solution</AseButton>
        </div>

        <div class="row q-mt-md" v-if="lab.is_alive && !delayLoadLabTime">
          <div class="col-12 q-gutter-sm">
            <AseButton
              variant="secondary"
              :disabled="newProvisionStore.isServerDeleted"
              :loading="newProvisionStore.isServerProvisioned"
              @click="stopLab(lab.running_instance_id, lab.instance_id, lab)"
            >
              {{ newProvisionStore.isServerProvisioned ? 'Closing Lab...' : 'End Lab' }}
            </AseButton>

            <AseButton v-if="lab.password" @click="accessAuthenticatedLab(lab.dns_pass_entry, lab.password)">Access Lab</AseButton>
            <AseButton v-if="!lab.password" @click="accessLab(lab.dns_entry)">Access Lab</AseButton>
          </div>

          <div class="row col-12 q-mt-md q-col-gutter-md" v-if="lab.password">
            <div class="col-6">
              <AseInput v-model="labUsername" label="Username" :disable="true" wrapper-class="q-mb-sm">
                <template v-slot:after>
                  <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyUsername(labUsername)" />
                </template>
              </AseInput>
            </div>
            <div class="col-6">
              <AseInput v-model="labPassword" label="Password" :disable="true" wrapper-class="q-mb-sm">
                <template v-slot:after>
                  <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyPassword(lab.password)" />
                </template>
              </AseInput>
            </div>
          </div>
        </div>
        <div class="row col-12" v-if="lab.is_alive">
          <AseCard v-if="awsProvisionStore.accountInfo.url" flatCard>
            <div class="section_title avenir-bold">Cloud Credentials</div>
            <q-separator />
            <div class="row" v-if="awsProvisionStore.accountInfo.url">
              <div class="col">
                <AseInput v-model="labPassword" label="URL" fill-variant="filled" :disable="true" wrapper-class="q-mb-sm">
                  <template v-slot:after>
                    <q-icon
                      name="fas fa-external-link-alt"
                      class="text-green"
                      style="cursor: pointer"
                      @click="openCloudUrl(awsProvisionStore.accountInfo.url)"
                    />
                  </template>
                </AseInput>
              </div>
            </div>
            <div class="row q-col-gutter-md" v-if="awsProvisionStore.accountInfo.username">
              <div class="col-6">
                <AseInput v-model="labUsername" label="Username" fill-variant="filled" :disable="true" wrapper-class="q-mb-sm">
                  <template v-slot:after>
                    <q-icon name="fas fa-copy" class="text-green" style="cursor: pointer" @click="copyUsername(labUsername)" />
                  </template>
                </AseInput>
              </div>
              <div class="col-6">
                <AseInput v-model="labPassword" label="Password" fill-variant="filled" :disable="true" wrapper-class="q-mb-sm">
                  <template v-slot:after>
                    <q-icon
                      name="fas fa-copy"
                      class="text-green"
                      style="cursor: pointer"
                      @click="copyPassword(awsProvisionStore.accountInfo.password)"
                    />
                  </template>
                </AseInput>
              </div>
            </div>
            <div class="row q-col-gutter-md" v-if="awsProvisionStore.accountInfo.access_key">
              <div class="col-6">
                <AseInput v-model="labPassword" label="AccessKey" fill-variant="filled" :disable="true" wrapper-class="q-mb-sm">
                  <template v-slot:after>
                    <q-icon
                      name="fas fa-copy"
                      class="text-green"
                      style="cursor: pointer"
                      @click="copyAccessKey(awsProvisionStore.accountInfo.access_key)"
                    />
                  </template>
                </AseInput>
              </div>
              <div class="col-6">
                <AseInput v-model="labPassword" label="SecretKey" fill-variant="filled" :disable="true" wrapper-class="q-mb-sm">
                  <template v-slot:after>
                    <q-icon
                      name="fas fa-copy"
                      class="text-green"
                      style="cursor: pointer"
                      @click="copySecretKey(awsProvisionStore.accountInfo.secret_key)"
                    />
                  </template>
                </AseInput>
              </div>
            </div>
          </AseCard>
        </div>

        <div class="row" v-if="getServerProgressLocal.length > 0">
          <div class="col" v-for="progress in getServerProgressLocal" v-bind:key="progress.id">
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

        <ChallengeBadge
          v-if="(lab.challenge_id && lab.url_badge) || newProvisionStore.markResponse"
          :shareId="lab.url_badge || newProvisionStore.markResponse"
        />
      </div>
    </div>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'you want to End this lab'"
      :loading="isDeleting"
      @confirmDelete="labConfirmDeletion($event)"
      @confirmDeleteCancel="labConfirmDeleteCancel($event)"
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
    <AseDialog v-model="showInsufficientTimeForLab" title="Lab Time Insufficient" @update:model-value="handleInsufficientTimeDialogClose">
      <template v-if="loginStore.isTrial">
        <div class="text-h6 text-center">Upgrade to premium</div>
        <div class="q-pt-md text-center text-link" @click="redirectPricingPage">Click here to subscribe</div>
      </template>
      <template v-else>
        <div class="text-h6 text-center ase-lg">You don't have enough lab minutes to provision the lab. Please contact Administrator.</div>
      </template>
      <template #footer>
        <div class="text-right">
          <AseButton variant="secondary" @click="showInsufficientTimeForLab = false">Cancel</AseButton>
        </div>
      </template>
    </AseDialog>
  </div>
</template>

<script setup>
import { copyToClipboard, QSpinnerFacebook, LocalStorage, useQuasar } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { defineComponent, ref, shallowRef, watch } from 'vue'
import { useProfileStore } from 'src/store/pinia/profile'
import { useNewProvisionStore } from 'src/store/pinia/newProvision'
import { useAwsProvisionStore } from 'src/store/pinia/awsProvision'
import { useLabStore } from 'src/store/pinia/lab'
import { useLabProvisionStore } from 'src/store/pinia/labProvision'
import { useCoursesStore } from 'src/store/pinia/courses'
import { useUserActivity } from 'src/store/pinia/userActivity'

import OnlyTimer from 'src/components/countdown/OnlyTimer.vue'
import ChallengeBadge from 'src/components/course/ChallengeBadge.vue'
import Delete from 'src/components/shared/Delete.vue'
import { getTimePassedInPercentage } from 'src/utils/dateHelper'
import useCourseNavigation from 'src/composables/useCourseNavigation'

defineComponent({ name: 'LabPageContent' })

const props = defineProps({
  id: { required: false },
  provisionerToken: { type: String, required: false, default: undefined }
})

const addLongDelay = shallowRef(false)
const enableAuth = shallowRef(false)
const delayLoadLabTime = shallowRef(false)
const isDelete = shallowRef(false)
const labPassword = shallowRef('******')
const labUsername = shallowRef('appsecengineer')
const labRulesPopup = shallowRef(false)
const provisionLabStatus = shallowRef(true)
const disableProvision = shallowRef(false)
const showInsufficientTimeForLab = shallowRef(false)
const runningInstanceId = shallowRef('')
const instanceId = shallowRef('')
const isDeleting = shallowRef(false)

const getServerProgressLocal = ref([])
const markingStatusInfo = ref({})
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

const awsProvisionStore = useAwsProvisionStore()
const profileStore = useProfileStore()
const loginStore = useLoginStore()
const labStore = useLabStore()
const newProvisionStore = useNewProvisionStore()
const labProvisionStore = useLabProvisionStore()
const coursesStore = useCoursesStore()
const userActivity = useUserActivity()
const { goToNextCourse } = useCourseNavigation()

watch(
  () => newProvisionStore.isServerDeleted,
  () => {
    if (newProvisionStore.isServerDeleted) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 140,
        message: 'Hang on...',
        messageColor: 'white'
      })
    } else {
      $q.loading.hide()
    }
  }
)

function showNotify(message, error = false, options = {}) {
  $q.notify({
    message,
    color: error ? 'negative' : 'positive',
    position: 'top',
    ...options
  })
}

async function copyUsername(name) {
  try {
    await copyToClipboard(name)
    showNotify('Username has been successfully copied')
  } catch (error) {
    showNotify('Not able to copy', true)
  }
}
async function copyPassword(password) {
  try {
    await copyToClipboard(password)
    showNotify('Password has been successfully copied')
  } catch (error) {
    showNotify('Not able to copy', true)
  }
}
async function copyAccessKey(password) {
  try {
    await copyToClipboard(password)
    showNotify('AccessKey has been successfully copied')
  } catch (error) {
    showNotify('Not able to copy', true)
  }
}
async function copySecretKey(password) {
  try {
    await copyToClipboard(password)
    showNotify('SecretKey has been successfully copied')
  } catch (error) {
    showNotify('Not able to copy', true)
  }
}

async function provisionLab(id) {
  userActivity.disableActivity()
  addLongDelay.value = true
  await fetchUsedMinutes()
  const data = {
    lab_id: id,
    event_id: coursesStore.selectedCourseInfo.rawInfo?._key,
    auth: enableAuth.value,
    cloud_type: labStore.listLabData[0]?.cloud_type
  }

  try {
    const status = await labProvisionStore.startProvisioner(data)
    getServerProgressLocal.value = [
      {
        progress: 10,
        message: status.message
      }
    ]

    if (status.success) {
      let progressStatus = await labProvisionStore.progressProvisioner({
        lab_id: id,
        event_id: data.event_id
      })

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
          }
        }

        await delay(8000)

        progressStatus = await labProvisionStore.progressProvisioner({
          lab_id: id,
          event_id: data.event_id
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
          await labStore.fetchLabInfo({
            lab_id: id,
            event_id: data.event_id
          })
          userActivity.enableActivity()
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
    userActivity.isActivityDisabled && userActivity.enableActivity()
    addLongDelay.value = false
  }
}

async function delay(ms) {
  addLongDelay.value = true
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
async function resetData(time = 4000) {
  disableProvision.value = false
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

async function fetchSolution(challenge_id) {
  await labStore.fetchChallengeSolution({
    lab_id: coursesStore.selectedCourseInfo.activeContentDetails?.content?._key,
    event_id: coursesStore.selectedCourseInfo.rawInfo?._key,
    challenge_id
  })
}

function accessLab(url) {
  window.open(url, '_blank')
}
function openCloudUrl(url) {
  window.open(url, '_blank')
}
function accessAuthenticatedLab(dns, password) {
  const url = 'https://appsecengineer:' + password + '@' + dns
  window.open(url, '_blank')
}
function redirectPricingPage() {
  const url = `${window.location.origin}/`

  if (LocalStorage.getItem('type') === 'Teams') {
    url += 'subscription-expired'
  } else if (LocalStorage.getItem('type') === 'IND') {
    url += 'individual-subscription-expired'
  } else {
    url += 'individual-subscription-expired'
  }

  window.open(url, '_blank')
}
function stopLab(running_instance_id, instance_id, labInfo) {
  isDelete.value = true
  runningInstanceId.value = ''
  runningInstanceId.value = running_instance_id
  instanceId.value = ''
  instanceId.value = instance_id
  markingStatusInfo.value = {
    event_id: labInfo.event_id,
    item_id: labInfo.id
  }
}

async function labConfirmDeletion(event) {
  isDeleting.value = true
  if (event.show) {
    const data = {
      server_id: runningInstanceId.value,
      server_instance_id: instanceId.value
    }
    if (labStore.listLabData[0].is_cloud) {
      data.cloud_type = labStore.listLabData[0].cloud_type
    }

    const passedPercentage = getTimePassedInPercentage(labStore.listLabData[0]?.created_on ?? 0, labStore.listLabData[0]?.running_ttl ?? 0)
    const isHalfCompleted = passedPercentage >= 50

    if (!labStore.listLabData[0].challenge_id && isHalfCompleted) {
      await newProvisionStore.markTopicCompletedLab(markingStatusInfo.value)
    }

    await newProvisionStore.deleteLabServer(data)
    isDelete.value = false

    if (!newProvisionStore.feedBackStatus) {
      goToNextCourse()
    }
    const labData = labStore.listLabData?.[0] ?? null
    if (labData) {
      await labStore.fetchLabInfo({
        lab_id: labData?.id,
        event_id: labData?.event_id
      })
    }
    await resetData()
  }
  isDeleting.value = false
}

function labConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = false
  }
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

function handleInsufficientTimeDialogClose(value) {
  if (!value) {
    showInsufficientTimeForLab.value = false
  }
}

async function fetchUsedMinutes() {
  await profileStore.fetchProfileDetailedInformation(false)
  if (Number(profileStore.profileDetailedInfo.monthly_minutes) - Number(profileStore.profileDetailedInfo.used_minutes) <= 6) {
    provisionLabStatus.value = false
    showInsufficientTimeForLab.value = true
  } else {
    provisionLabStatus.value = true
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
