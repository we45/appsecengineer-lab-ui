<template>
  <AseCard class="column">
    <template v-if="!isDelete && !isCustom">
      <div>
        <div class="q-pa-xs q-gutter-y-lg" v-if="!isDelete">
          <div class="row items-center justify-between" style="gap: 1rem">
            <div class="avenir-bold section_title">User Management</div>
            <div class="row items-center no-wrap">
              <!-- Desktop buttons -->
              <div v-if="!isMobile" class="row q-gutter-sm">
                <AseButton
                  label="Create User"
                  :loading="isCreatingUser"
                  :disable="isCreatingUser"
                  @click="enableCreateUser({ show: true })"
                />
                <AseButton variant="primary" label="Import Users" @click="showPopWindow(true)" />
                <AseButton variant="primary" icon="settings" label="Custom Fields" :to="{ name: 'company.user_settings' }" />
              </div>

              <!-- Mobile menu -->
              <div v-if="isMobile">
                <q-btn flat round :color="$q.dark.isActive ? 'white' : 'night-blue'" aria-label="User management menu" ref="menuTrigger">
                  <q-icon name="more_vert" />
                  <q-menu anchor="bottom right" self="top right">
                    <q-list style="min-width: 150px" class="user-management-dropdown" size="sm">
                      <q-item
                        clickable
                        @click="enableCreateUser({ show: true })"
                        role="menuitem"
                        aria-label="Create User"
                        :disable="isCreatingUser"
                      >
                        <q-item-section side>
                          <q-icon size="xs" name="person_add" />
                        </q-item-section>
                        <q-item-section>
                          <div class="row items-center">
                            <span>Create User</span>
                            <q-spinner v-if="isCreatingUser" size="xs" class="q-ml-sm" />
                          </div>
                        </q-item-section>
                      </q-item>

                      <q-item clickable @click="showPopWindow(true)" role="menuitem" aria-label="Import Users">
                        <q-item-section side>
                          <q-icon size="xs" name="upload" />
                        </q-item-section>
                        <q-item-section>Import Users</q-item-section>
                      </q-item>

                      <q-item clickable :to="{ name: 'company.user_settings' }" role="menuitem" aria-label="Custom Fields">
                        <q-item-section side>
                          <q-icon size="xs" name="settings" />
                        </q-item-section>
                        <q-item-section>Custom Fields</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </div>

          <div
            class="row q-mt-md"
            style="flex-wrap: wrap-reverse"
            :style="{
              gap: !isDesktop ? '10px' : ''
            }"
          >
            <div
              class="col-md-8 col-12"
              :class="{
                'q-pr-md': isDesktop
              }"
            >
              <div class="column full-height justify-between">
                <AseCard flatCard class="q-mb-md">
                  <p id="assignments-title" class="avenir-bold" style="font-size: 1rem !important">Certification</p>
                  <AseQSelect
                    v-model="selectedCertificate"
                    placeholder="Select a certificate"
                    emit-value
                    map-options
                    clearable
                    :options="certificateOptions"
                  />
                  <AseButton
                    label="save"
                    variant="secondary"
                    class="q-mt-md"
                    :loading="isLoading"
                    :disable="disableIssueCertificate || isLoading"
                    @click="handleIssueCertificate"
                  />
                </AseCard>
                <div class="row items-center justify-between">
                  <AseTabs
                    v-model="userStatus"
                    :class="{
                      'col-grow': isMobile
                    }"
                    :tabs="userStatusTabs"
                    aria-label="User status tabs"
                  />

                  <div
                    :class="{
                      'q-mt-md col-grow': isMobile
                    }"
                  >
                    <AseInput
                      v-model="search"
                      placeholder="Search users"
                      height-variant="short"
                      fill-variant="outlined"
                      wrapperClass="q-mb-none"
                      debounce="500"
                      @keyup.enter="handleSearch"
                      @clear="handleSearch"
                      @update:modelValue="handleSearch"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </AseInput>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-12" style="max-height: 300px">
              <Statistics title="Statistics" :data="statistics" />
            </div>
          </div>
          <UsersList
            :userStatus="userStatus"
            :selectedCertificate="selectedCertificate"
            :selectedUsers="selectedUsers"
            @updateCustomFields="updateCustomFields($event)"
            @showCreateUser="enableCreateUser($event)"
            @updateSelectedUsers="updateSelectedUsers"
          />
        </div>
      </div>
    </template>
    <template v-if="show">
      <ImportUser v-model="show" />
    </template>
  </AseCard>

  <!-- Create User Dialog outside the main card structure -->
  <AseDialog v-model="isCreate" title="Create User">
    <CreateCompanyUser :dynamicFields="dataCustom" :id="updateId" @onCancel="cancelCreateUser($event)" />
  </AseDialog>

  <!-- Custom Fields Dialog outside the main card structure -->
  <AseDialog v-model="isCustom" title="Update User" width="60vw">
    <div class="q-pa-md">
      <q-form @submit="onSubmitCustomFields()" class="q-gutter-md">
        <q-list class="row">
          <div v-for="companyField in dataCustomIndividualUser" class="q-pa-xs col-6" :key="companyField.key">
            <AseQSelect
              v-if="companyField.keydropdown === 'Dropdown'"
              :label="companyField.key + ' *'"
              :options="companyField.values_list"
              v-model="companyField.value"
            />
            <AseInput
              v-if="companyField.keydropdown === 'Text'"
              :disabled="companyField.key === 'email'"
              :label="companyField.key + ' *'"
              :maxLength="50"
              v-model="companyField.value"
            />
            <p
              v-if="companyUsersStore.errorCompanyUserCustomFields[companyField.key] && !companyField.value"
              class="text-caption text-negative"
            >
              {{ companyUsersStore.errorCompanyUserCustomFields[companyField.key + '_msg'] }}
            </p>
          </div>
        </q-list>
      </q-form>
    </div>
    <template #footer>
      <q-separator />
      <div class="q-mt-md row items-center full-width justify-end q-px-md q-mb-md">
        <AseButton outline variant="plain" label="Cancel" :flat="false" class="q-px-xl text-dark" @click="cancelCustomFields" />
        <AseButton label="Save" variant="primary" class="q-px-xl q-ml-sm" @click="onSubmitCustomFields()" />
      </div>
    </template>
  </AseDialog>
</template>

<script setup>
import CreateCompanyUser from 'components/company/CreateCompanyUser.vue'
import UsersList from 'components/company/companyInfo/usersList.vue'
import Statistics from 'src/components/company_reports/common/Statistics.vue'
import ImportUser from './ImportUser.vue'

import { computed, ref, watchEffect, defineOptions, onMounted } from 'vue'
import { useCompanyUsers } from 'src/store/pinia/company/user.js'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
import { useReportStore } from 'src/store/pinia/report/'
import { useLoginStore } from 'src/store/pinia/login'
import { useScreenSize } from 'src/composables/useScreenSize'

defineOptions({ name: 'CompanyUserOps' })

const ACTIVE = 'active'
const INACTIVE = 'inactive'

const isCreate = ref(false)
const isCustom = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const title = ref('CREATE USER')
const show = ref(false)
const dataCustom = ref([])
const dataCustomIndividualUser = ref([])
const userStatus = ref(ACTIVE)
const search = ref('')
const isCreatingUser = ref(false)
const isLoading = ref(false)

const selectedUsers = ref([])
const selectedCertificate = ref()

const companyUsers = useCompanyUsers()
const reportStore = useReportStore()
const companyUsersStore = useCompanyConsumerStore()
const loginStore = useLoginStore()
const { isDesktop, isMobile } = useScreenSize()

const userStatusTabs = computed(() => [
  {
    label: 'Active users',
    name: ACTIVE,
    disable: companyUsers.isLoading,
    disableMessage: 'Loading active users'
  },
  {
    label: 'Inactive users',
    name: INACTIVE,
    disable: companyUsers.isLoading,
    disableMessage: 'Loading inactive users'
  }
])

const statistics = computed(() => [
  {
    title: 'Total users',
    value: reportStore.statsUserCountData?.totalUsersCount || 0
  },
  {
    title: 'Total Badges Earned',
    value: reportStore.statsUserCountData?.totalBadgesCount || 0
  },
  {
    title: 'Total Outliers',
    value: reportStore.companyUserStats.outliners?.length || 0
  }
])

const certificateOptions = computed(() =>
  companyUsersStore.corporateAdminCerts.map((cert) => ({
    label: cert?.name,
    value: cert?.sk
  }))
)

const disableIssueCertificate = computed(() => !selectedCertificate.value || !selectedUsers.value.length)

const updateSelectedUsers = (users) => {
  selectedUsers.value = users
}

async function handleIssueCertificate() {
  isLoading.value = true
  await companyUsersStore.issueCorporateCertificates({
    users: selectedUsers.value,
    certification: selectedCertificate.value
  })
  selectedCertificate.value = null
  selectedUsers.value = []
  isLoading.value = false
}

const enableCreateUser = async (event) => {
  if (event.show) {
    isCreatingUser.value = true
    if (!companyUsersStore.companyInfo.id) {
      await companyUsersStore.fetchCompanyInfo()
    }
    await dynamicAttributesInfo()
    isCreatingUser.value = false
  }
}

const dynamicAttributesInfo = async () => {
  if (companyUsersStore.companyUserCustomFields.c_attrs.length === 0) {
    try {
      await companyUsersStore.fetchCompanyUserCustomFieldsData({
        company_id: companyUsersStore.companyInfo.id
      })
    } catch (error) {
      console.log(error)
    }
  }
  let newFields = companyUsersStore.companyUserCustomFields.c_attrs.map((data) => ({
    keydropdown: typeof companyUsersStore.companyUserCustomFields.defaults[data] === 'object' ? 'Dropdown' : 'Text',
    key: data,
    value: '',
    values_list: companyUsersStore.companyUserCustomFields.defaults[data] ? companyUsersStore.companyUserCustomFields.defaults[data] : []
  }))
  dataCustom.value = newFields
  isCreate.value = true
}

const showPopWindow = (info) => {
  show.value = true
}

const updateCustomFields = async (event) => {
  if (!companyUsersStore.companyInfo.id) {
    await companyUsersStore.fetchCompanyInfo()
  }
  if (companyUsersStore.companyUserCustomFields.c_attrs.length === 0) {
    await companyUsersStore.fetchCompanyUserCustomFieldsData({
      company_id: companyUsersStore.companyInfo.id
    })
  }
  if (event.show) {
    companyUsersStore.errorMsgResetCustomFields({ status: false })
    isCustom.value = true
    const customFields = []
    Object.entries(event.payload).forEach(([key, value]) => {
      if (key !== 'firstName' && key !== 'lastName' && key !== 'isActive' && key !== 'option' && key !== 'resend' && key !== 'fullName') {
        customFields.push({
          keydropdown: typeof companyUsersStore.companyUserCustomFields.defaults[key] === 'object' ? 'Dropdown' : 'Text',
          key: key,
          value: value,
          values_list: companyUsersStore.companyUserCustomFields.defaults[key]
            ? companyUsersStore.companyUserCustomFields.defaults[key]
            : []
        })
      }
    })
    dataCustomIndividualUser.value = customFields
  }
}

const cancelCreateUser = (event) => {
  if (event.show) {
    isCreate.value = false
  }
}

const cancelCustomFields = () => {
  isCustom.value = false
}

const onSubmitCustomFields = async () => {
  const trueStatus = true
  const err_msgs = {}
  await companyUsersStore.errorMsgResetCustomFields(err_msgs)
  if (trueStatus) {
    const data = {}
    dataCustomIndividualUser.value.map((dataField) => (data[dataField.key] = dataField.value))
    await companyUsersStore.updateIndividualCompanyUserCustomFields(data)
    if (!companyUsersStore.errorCompanyUserCustomFields.status) {
      isCustom.value = true
    } else {
      isCustom.value = false
    }
  }
}

async function handleSearch() {
  let LEFT_CALLS = 50
  companyUsers.companyUsers.LastEvaluatedKey = undefined
  do {
    LEFT_CALLS--
    if (!search.value?.length) {
      await companyUsers.fetchCompanyUser({
        LastEvaluatedKey: companyUsers.companyUsers?.LastEvaluatedKey ?? undefined
      })
    } else {
      await companyUsers.searchCompanyUser({
        name: search.value,
        LastEvaluatedKey: companyUsers.companyUsers?.LastEvaluatedKey ?? undefined
      })
    }
  } while (companyUsers.companyUsers?.LastEvaluatedKey && companyUsers.companyUsers?.data?.length < 60 && LEFT_CALLS > 0)
}

// Initialize on component creation
document.title = 'Company Users'
reportStore.fetchCompanyStatsReport({ select: 'overall' })
reportStore.setUserActionSelectedItem('Overall')

onMounted(() => {
  companyUsersStore.fetchCorporateAdminCertificates()
})
</script>

<style lang="scss">
.user-management-dropdown {
  :deep(.q-item) {
    min-height: 0;
  }
}
</style>
