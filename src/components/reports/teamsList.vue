<template>
  <div>
    <template v-if="!isCreate && !isDelete && !showIndividualTeam">
      <company-team-ops-table
        @showCreateTeam="enableCreateTeam($event)"
        @showIncludeUsers="enableIncludeUser($event)"
        @showUpdateTeam="enableUpdateTeam($event)"
        @showDeleteTeam="enableDeleteTeam($event)"
        @showTeamInfoData="showTeamInfoData"
        @showTeamInfo="enableTeamInfo($event)"
      ></company-team-ops-table>
    </template>
    <template v-if="showIndividualTeam && !isCreate && !isDelete">
      <div>
        <label class="text-link" style="float: right" @click="backButton()">Back</label>
      </div>
      <company-individual-teamInfo></company-individual-teamInfo>
    </template>
    <q-dialog v-model="errorIncludeUsers" persistent @escape-key="confirmCloseDisclimar()">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="padding_12">
          <q-bar class="bg-white none-spacing">
            <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">Disclaimer</p>
            <q-space />
            <q-btn color="secondary" round size="sm" icon="close" @click="confirmCloseDisclimar()" />
          </q-bar>
          <hr />
        </q-card-section>

        <q-card-section style="margin: 0% 1% 0% 1%">
          <div v-for="(value, name) in companyUserTeamsStore.user_attach_error_msg" v-bind:key="name">
            <p>
              <span class="ase-lg portal_bold">{{ name }}</span>
              :
              <span class="error_msg_color ase-lg">{{ value.message }}</span>
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import CompanyIndividualTeamInfo from 'components/reports/CompanyIndividualTeamInfo.vue'
import CompanyTeamOpsTable from 'components/reports/CompanyTeamOpsTable.vue'
import { QSpinnerFacebook } from 'quasar'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'ReportTeamsSection',
  components: {
    'company-team-ops-table': CompanyTeamOpsTable,
    'company-individual-teamInfo': CompanyIndividualTeamInfo
  },
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyUsersStore = useCompanyConsumerStore()

    return {
      companyUserTeamsStore,
      companyUsersStore
    }
  },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      showIndividualTeam: false,
      isIncludeGroup: false,
      errorIncludeUsers: false,
      updateId: '',
      title: 'Create Team',
      teamId: '',
      typeDelete: '',
      teamName: ''
    }
  },
  created() {
    const data = {}
    this.companyUserTeamsStore.fetchCompanyTeams(data)
  },
  watch: {
    'companyUserTeamsStore.isLoading': {
      handler() {
        if (this.companyUserTeamsStore.isLoading) {
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
    enableCreateTeam(event) {
      this.companyUserTeamsStore.errorMsgReset({ team_name: false, team_name_msg: '' })
      this.updateId = ''
      this.title = 'Create Team'
      if (event.show) {
        this.isCreate = true
      }
    },
    cancelCreateTeam(event) {
      if (event.show) {
        this.isCreate = false
      }
    },
    enableIncludeUser(event) {
      if (event.show) {
        this.companyUsersStore.fetchCompanyAllUsers({})
        this.teamId = ''
        this.teamId = event.id
        this.isIncludeGroup = true
      }
    },
    cancleIncludeUser(event) {
      if (event.show) {
        this.teamId = ''
        this.isIncludeGroup = false
      }
    },
    showPopup(event) {
      if (event.show) {
        this.errorIncludeUsers = true
      } else {
        this.errorIncludeUsers = false
      }
    },
    backButton() {
      this.showIndividualTeam = false
    },
    confirmOpenDisclimar() {
      this.errorIncludeUsers = true
    },
    confirmCloseDisclimar() {
      this.errorIncludeUsers = false
    },
    enableUpdateTeam(event) {
      this.companyUserTeamsStore.errorMsgReset({ team_name: false, team_name_msg: '' })
      if (event.show) {
        const data = {
          team_id: event.id
        }
        this.title = ''
        this.updateId = ''
        this.updateId = event.id
        this.title = 'Update Team'

        this.companyUserTeamsStore.fetchCompanyTeam(data)
        this.isCreate = true
      }
    },
    enableDeleteTeam(event) {
      this.teamName = event.name
      if (event.show) {
        this.isDelete = true
        this.teamId = ''
        this.teamId = event.id
      }
    },
    teamConfirmDeletion(event) {
      if (event.show) {
        const data = {
          team_id: this.teamId
        }

        this.companyUserTeamsStore.deleteCompanyTeam(data)
        this.teamId = ''
        this.isDelete = false
      }
    },
    teamConfirmDeleteCancel(event) {
      if (event.show) {
        this.isDelete = false
        this.teamId = ''
      }
    },
    showTeamInfoData(event) {
      this.$emit('showTeamInfoData', event)
    },
    enableTeamInfo(event) {
      if (event.show) {
        const data = {
          team_id: event.id
        }
        this.showIndividualTeam = true

        this.companyUserTeamsStore.fetchUsersByTeam(data)
      }
    }
  }
}
</script>
