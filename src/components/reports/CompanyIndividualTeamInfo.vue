<template>
  <div>
    <company-individual-team-content></company-individual-team-content>
  </div>
</template>
<script>
import CompanyIndividualTeamContent from 'components/company/CompanyIndividualTeamContent.vue'
import { QSpinnerFacebook } from 'quasar'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'

export default {
  name: 'CompanyIndividualTeamInfo',
  components: {
    'company-individual-team-content': CompanyIndividualTeamContent
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return {
      companyUserTeamsStore
    }
  },
  created() {
    const data = {
      team_id: this.id
    }

    this.companyUserTeamsStore.includeUsersFinalList({ users: { all: true }, team: data })
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
  }
}
</script>
