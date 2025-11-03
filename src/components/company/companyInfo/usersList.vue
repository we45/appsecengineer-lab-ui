<template>
  <AseTable
    ref="tableRef"
    :columns="columns"
    row-key="email"
    :rows="usersList"
    :rows-per-page-options="[0]"
    style="max-height: calc(100vh - 300px)"
    hide-pagination
    :hide-bottom="false"
    empty-message="No users found"
    :isLoading="companyUsers.isLoading || isLoading"
    customClasses="sticky-head"
    :loadMore="Boolean(companyUsers.companyUsers.LastEvaluatedKey)"
    @onLoadMore="loadMore"
  >
    <template #body-cell-checkbox="props">
      <q-td>
        <AseCheckbox v-if="props.row.is_active" v-model="selectedUsers" :val="props.row.email" />
      </q-td>
    </template>
    <template #body-cell-fullName="props">
      <q-td @click="getUserInfo(props.row.email, props.value)" class="cursor-pointer">
        {{ props.value }}
      </q-td>
    </template>
    <template #body-cell-email="props">
      <q-td @click="getUserInfo(props.value, props.row.fullName)" class="cursor-pointer">
        {{ props.value }}
      </q-td>
    </template>
    <template #body-cell-serial_number="props">
      <q-td>
        {{ props.pageIndex + 1 }}
      </q-td>
    </template>
    <template #body-cell-certificates="props">
      <q-td>
        <div class="certificates-menu">
          <q-btn
            flat
            dense
            color="primary"
            icon="card_membership"
            :label="getLimitedCerts(props.row.certs).length ? `${getLimitedCerts(props.row.certs).length} Certificates` : 'No Certificates'"
          >
            <q-menu anchor="bottom right" self="top right" transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 300px">
                <q-item v-if="!getLimitedCerts(props.row.certs).length" class="text-grey-7">
                  <q-item-section avatar>
                    <q-icon name="info" color="grey-7" />
                  </q-item-section>
                  <q-item-section>No certificates available</q-item-section>
                </q-item>
                <q-item
                  v-for="(cert, index) in getLimitedCerts(props.row.certs)"
                  :key="cert?.sk || index"
                  clickable
                  v-close-popup
                  @click="cert?.sk && viewCertificate(cert.sk)"
                  class="certificate-item"
                >
                  <q-item-section avatar>
                    <q-avatar size="48px">
                      <q-img v-if="cert?.logo" :src="cert.logo" :ratio="1" spinner-color="primary" spinner-size="24px" />
                      <q-icon v-else name="card_membership" size="32px" color="primary" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ cert?.name || 'N/A' }}</q-item-label>
                    <q-item-label caption>Click to view certificate</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" color="grey-7" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-td>
    </template>
    <template #body-cell-active="props">
      <q-td>
        <q-toggle
          label=""
          :model-value="props.row.is_active"
          @update:modelValue="toggleStatus(props.row.email, !props.row.is_active, props.pageIndex, props)"
          :loading="true"
        />
        <q-inner-loading :showing="true" v-if="props.pageIndex === pageIndex" />
      </q-td>
    </template>
    <template #body-cell-admin="props">
      <q-td>
        <q-toggle
          label=""
          :model-value="Boolean(props.row.is_company_admin)"
          :disable="companyUsersStore.isLoading"
          @update:modelValue="() => toggleAdmin(props.row)"
        />
      </q-td>
    </template>
  </AseTable>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useCompanyUsers } from 'src/store/pinia/company/user.js'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

defineOptions({ name: 'usersList' })

const props = defineProps({
  userStatus: {
    type: String,
    default: null
  },
  selectedCertificate: {
    type: String,
    default: null
  },
  selectedUsers: {
    type: Array,
    default: () => []
  },
  search: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['updateCustomFields', 'showCreateUser', 'updateSelectedUsers'])

const router = useRouter()
const companyUsers = useCompanyUsers()
const companyUsersStore = useCompanyConsumerStore()

const pageIndex = ref(undefined)
const adminPageIndex = ref(undefined)
const isLoading = ref(false)
const tableRef = ref(null)

const users = computed(() => companyUsers.companyUsers.data ?? [])

// Computed property for selectedUsers with getter and setter to sync with parent
const selectedUsers = computed({
  get: () => props.selectedUsers,
  set: (value) => emit('updateSelectedUsers', value)
})

const columns = computed(() => [
  { name: 'checkbox', align: 'left', label: '' },
  { name: 'serial_number', align: 'left', label: '#', field: 'serial_number' },
  { name: 'fullName', align: 'left', label: 'Full Name', field: 'full_name' },
  { name: 'email', align: 'left', label: 'Email', field: 'email' },
  { name: 'certificates', align: 'center', label: 'Certificates', field: 'certs' },
  { name: 'active', align: 'left', label: 'Active', field: 'is_active' },
  { name: 'admin', align: 'left', label: 'Admin', field: 'is_company_admin' }
])

const usersList = computed(() => {
  if (!props.userStatus) {
    return users.value
  }
  return users.value.filter((user) => user.is_active === Boolean(props.userStatus === 'active'))
})

function getLimitedCerts(certs) {
  if (!certs || !Array.isArray(certs)) return []
  return certs.filter((cert) => cert !== null)
}

function viewCertificate(sk) {
  const url = `https://appsecengineer.verified.cv/en/verify/${sk}`
  window.open(url, '_blank')
}

async function toggleStatus(email, status, index, propsCtx) {
  pageIndex.value = index
  const data = { email }
  try {
    const response = status ? await companyUsersStore.enableCompanyUser(data) : await companyUsersStore.disableCompanyUser(data)

    if (response) {
      propsCtx.row.is_active = status
      users.value[index].is_active = status
    } else {
      propsCtx.row.is_active = !status
      users.value[index].is_active = !status
    }
  } catch (error) {
    propsCtx.row.is_active = !status
    users.value[index].is_active = !status
  } finally {
    pageIndex.value = undefined
  }
}

async function toggleAdmin(row) {
  row.is_company_admin = !row.is_company_admin
  const res = await companyUsersStore.toggleAdmin({ email: row.email })
  if (!res) {
    row.is_company_admin = !row.is_company_admin
  }
}

async function getUserInfo(email, username) {
  await router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
}

async function loadMore(details) {
  const payload = {
    LastEvaluatedKey: companyUsers.companyUsers.LastEvaluatedKey,
    name: props.search?.length ? props.search : undefined
  }

  if (props.search?.length) {
    companyUsers.searchCompanyUser(payload)
  } else {
    companyUsers.fetchCompanyUser(payload)
  }
}

async function loadUsers() {
  let LEFT_CALLS = 50
  do {
    await companyUsers.fetchCompanyUser({
      LastEvaluatedKey: companyUsers.companyUsers?.LastEvaluatedKey ?? undefined
    })
    LEFT_CALLS--
  } while (companyUsers.companyUsers?.LastEvaluatedKey && companyUsers.companyUsers?.data?.length < 60 && LEFT_CALLS > 0)
}

onMounted(() => {
  loadUsers()
  companyUsersStore.fetchCorporateAdminCertificates()
})
</script>

<style lang="scss" scoped></style>
