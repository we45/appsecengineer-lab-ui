<template>
  <AseTable
    :rows="companyTeams.companyTeams"
    :columns="columns"
    row-key="sk"
    :isLoading="companyTeams.loading"
    emptyLabel="No teams"
    :pagination="{
      rowsPerPage: 0
    }"
    :hide-bottom="false"
    :load-more="true"
    @onLoadMore="loadMore"
    :style="{
      maxHeight: 'calc(100vh - 300px)'
    }"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <template v-if="col.name === 'details'">
            <div
              class="cursor-pointer"
              style="user-select: none"
              :class="[$q.dark.isActive ? 'text-secondary' : 'text-electric-indigo']"
              @click="
                () => {
                  enableTeamInfo(props)
                  props?.onToggleExpand?.()
                }
              "
            >
              <span class="avenir-bold">Detailed view</span>
              <q-icon
                :name="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                size="sm"
                :class="[$q.dark.isActive ? 'text-secondary' : 'text-electric-indigo']"
              />
            </div>
          </template>

          <template v-else-if="col.name === 'teams'">
            <span class="avenir-bold">{{ props.row.team_name }}</span>
          </template>

          <template v-else-if="col.name === 'time_spent'">
            <span class="avenir-bold" style="font-size: 14px">{{ props.row?.timeSpent }}</span>
          </template>

          <template v-else-if="col.name === 'action'">
            <div v-if="isCompanyAdmin" class="row q-gutter-y-md q-gutter-x-xs no-wrap">
              <AseButton round @click="showUpdateTeam(props.row.sk)" size="xs">
                <q-avatar icon="edit" size="xs" />
                <q-tooltip>Edit</q-tooltip>
              </AseButton>
              <AseButton class="q-ml-sm" round @click="showDeleteTeam(props.row.sk, props.row.team_name)" size="xs">
                <q-avatar icon="delete" size="xs" />
                <q-tooltip>Delete</q-tooltip>
              </AseButton>
            </div>
          </template>

          <template v-else>
            {{ col.value ?? '--' }}
          </template>
        </q-td>
      </q-tr>

      <q-tr v-if="props.expand" :props="props">
        <q-td
          colspan="100%"
          class="q-pa-none"
          :style="{
            backgroundColor: 'var(--color-bg-surface)'
          }"
        >
          <CompanyIndividualTeamContent :id="teamId" />
        </q-td>
      </q-tr>
    </template>
  </AseTable>
</template>
<script>
import { computed, ref } from 'vue'

import CompanyIndividualTeamContent from 'components/company/CompanyIndividualTeamContent.vue'
import AseButton from 'components/ase/AseButton.vue'
import AseTable from 'components/ase/AseTable.vue'
import { useCompanyTeam } from 'src/store/pinia/company/team.js'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useLoginStore } from 'src/store/pinia/login'
import { useQuasar } from 'quasar'

export default {
  name: 'CompanyTeamOpsTable',
  components: { CompanyIndividualTeamContent, AseButton, AseTable },
  setup(_, { emit }) {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const companyTeams = useCompanyTeam()
    const teamId = ref('')
    const openDropdown = ref(null)
    const $q = useQuasar()

    const isDark = computed(() => $q.dark.isActive)

    async function fetchCompanyTeam() {
      companyTeams.clearSearch()
    }
    const pageIndex = ref(undefined)

    const userTable = ref(false)
    const loginStore = useLoginStore()

    const isCompanyAdmin = computed(() => loginStore.isCompanyAdmin)
    const isCompanyManager = computed(() => loginStore.isCompanyManager)
    const columns = ref([])

    function convertToMinutes(timeString = '') {
      const regex = /(\d+)h\s*(\d+)m/
      const match = timeString.match(regex)

      if (match) {
        const hours = parseInt(match[1], 10)
        const minutes = parseInt(match[2], 10)
        return hours * 60 + minutes
      }
      return 0
    }

    async function loadMore(details) {
      if (details.index === companyTeams.companyTeams.length - 1 && companyTeams.companyData?.LastEvaluatedKey && !companyTeams.loading) {
        if (companyTeams.payload.name) {
          companyTeams?.searchUsers?.()
        } else {
          companyTeams.fetchCompanyTeam({ LastEvaluatedKey: companyTeams.companyData?.LastEvaluatedKey })
        }
      }
    }

    columns.value = [
      {
        name: 'teams',
        align: 'left',
        label: 'TEAMS',
        field: 'team_name'
      },
      {
        name: 'time_spent',
        label: 'TIME SPENT',
        field: 'timeSpent',
        sortable: true,
        align: 'left',
        sort: (a, b) => convertToMinutes(a) - convertToMinutes(b)
      },
      ...(isCompanyAdmin.value
        ? [
            {
              name: 'action',
              label: 'MANAGE',
              field: 'Action',
              sortable: false,
              align: 'left'
            }
          ]
        : []),
      {
        name: 'details',
        label: 'DETAILS',
        field: '',
        align: 'right'
      }
    ]

    const enableTeamInfo = (event) => {
      const isOpening = !event.expand
      if (openDropdown.value && openDropdown.value !== event.row.sk) openDropdown.value.expand = false
      event.expand = isOpening
      openDropdown.value = isOpening ? event : null
      if (!isOpening) return
      teamId.value = event.row.sk
      companyUserTeamsStore.fetchUsersByTeam({ team_id: event.row.sk })
      if (isCompanyAdmin.value) companyUserTeamsStore.fetchCompanyTeam({ team_id: event.row.sk })
    }

    const showUpdateTeam = (id) => {
      emit('showUpdateTeam', { show: true, id: id })
    }

    const showDeleteTeam = (id, name) => {
      emit('showDeleteTeam', { show: true, id: id, name: name })
    }

    return {
      companyTeams,
      loadMore,
      pageIndex,
      columns,
      showUpdateTeam,
      showDeleteTeam,
      userTable,
      enableTeamInfo,
      teamId,
      openDropdown,
      isDark,
      isCompanyAdmin
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 500px) {
  .width {
    width: calc(100vw - 138px) !important;
  }
}

@media (max-width: 1300px) {
  .width {
    width: calc(100vw - 400px);
  }
}
</style>
