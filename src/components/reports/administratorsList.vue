<template>
  <div>
    <template v-if="!isCreate && !isDelete && !disable && !enable">
      <company-admin-ops-table
        @showCreateUser="enableCreateUser($event)"
        @showDisableUser="enableDisableUserOption($event)"
        @showEnableUser="enableActiveUserOption($event)"
      ></company-admin-ops-table>
    </template>
  </div>
</template>
<script>
import CompanyAdminOpsTable from 'components/reports/CompanyAdminOpsTable.vue'
import { QSpinnerFacebook } from 'quasar'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'ReportAdminsSection',
  components: {
    'company-admin-ops-table': CompanyAdminOpsTable
  },
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return {
      companyUsersStore
    }
  },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      disable: false,
      enable: false,
      updateId: '',
      title: 'Create Administrator',
      typeConfirm: '',
      email: ''
    }
  },
  created() {
    if (this.companyUsersStore.adminUsers.length === 0) {
      const data = {}
      this.companyUsersStore.fetchCompanyAdminUsers(data)
    }
  },
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
    enableDisableUserOption(event) {
      if (event.show) {
        this.disable = true
        this.email = ''
        this.email = event.email
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
        this.enable = true
        this.email = ''
        this.email = event.email
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
