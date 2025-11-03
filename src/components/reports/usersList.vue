<template>
  <div>
    <template v-if="!isCreate && !isDelete">
      <company-user-ops-table
        @showCreateUser="enableCreateUser($event)"
        @showDisableUser="toggleStatus($event)"
        @singleUserInfo="singleUserInfo"
        @showEnableUser="enableActiveUserOption($event)"
      ></company-user-ops-table>
    </template>
    <template v-if="isCreate && !isDelete && !disable && !enable">
      <create-company-user :id="updateId" @onCacel="cancelCreateUser($event)">
        {{ title }}
      </create-company-user>
    </template>
    <template v-if="disable && !isCreate && !isDelete && !enable">
      <disable
        :show="disable"
        :header="'disable a user'"
        @confirmDelete="confirmUserDisable($event)"
        @confirmDeleteCancel="userDisableCancel($event)"
      ></disable>
    </template>
    <template v-if="enable && !disable && !isCreate && !isDelete">
      <enable
        v-model="typeConfirm"
        :show="enable"
        :header="'enable a user'"
        @confirmDelete="confirmUserEnable($event)"
        @confirmDeleteCancel="userEnableCancel($event)"
      ></enable>
    </template>
  </div>
</template>
<script>
import CreateCompanyUser from 'components/company/CreateCompanyUser.vue'
import CompanyUserOpsTable from 'components/reports/CompanyUserOpsTable.vue'
import Disable from 'components/shared/Disable.vue'
import Enable from 'components/shared/Enable.vue'
import { QSpinnerFacebook } from 'quasar'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'ReportUsersSection',
  components: {
    'company-user-ops-table': CompanyUserOpsTable,
    'create-company-user': CreateCompanyUser,
    disable: Disable,
    enable: Enable
  },
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore }
  },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      disable: false,
      enable: false,
      updateId: '',
      title: 'Create User',
      typeConfirm: '',
      email: ''
    }
  },
  created() {},
  watch: {
    'companyUsersStore.isLoading': {
      handler() {
        if (this.companyUsersStore.isLoading) {
          this.$q.loading.show({
            spinner: QSpinnerFacebook,
            spinnerColor: 'white',
            spinnerSize: 140,
            message: 'Hang on...',
            messageColor: 'white'
          })
        } else {
          this.$q.loading.hide()
        }
      }
    }
  },
  methods: {
    enableCreateUser(event) {
      if (event.show) {
        this.isCreate = true
      }
    },
    cancelCreateUser(event) {
      if (event.show) {
        this.isCreate = false
      }
    },
    singleUserInfo(event) {
      this.$emit('singleUserInfo', event)
    },
    toggleStatus(event) {
      if (event.status === false) {
        const data = {
          email: event.email
        }
        this.companyUsersStore.enableCompanyUser(data)
      } else {
        const data = {
          email: event.email
        }
        this.companyUsersStore.disableCompanyUser(data)
      }
    },
    confirmUserDisable(event) {
      if (event.show) {
        const data = {
          email: this.email
        }
        this.companyUsersStore.disableCompanyUser(data)
        this.email = ''
        this.disable = false
        this.typeConfirm = ''
      }
    },
    userDisableCancel(event) {
      if (event.show) {
        this.email = ''
        this.disable = false
        this.typeConfirm = ''
      }
    },
    enableActiveUserOption(event) {
      if (event.show) {
        const data = {
          email: event.email
        }
        this.companyUsersStore.enableCompanyUser(data)
      }
    },
    confirmUserEnable(event) {
      if (event.show) {
        const data = {
          email: this.email
        }
        this.companyUsersStore.enableCompanyUser(data)
        this.email = ''
        this.enable = false
        this.typeConfirm = ''
      }
    },
    userEnableCancel(event) {
      if (event.show) {
        this.email = ''
        this.enable = false
        this.typeConfirm = ''
      }
    }
  }
}
</script>
