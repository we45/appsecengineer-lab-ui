<template>
  <div>
    <page
      v-model="search"
      @searchData="searchData"
      :showCreate="false"
      :showSearch="false"
      @clearSearchData="clearSearchData"
      :title="''"
      :isTable="true"
    >
      <slot>
        <q-list bordered>
          <q-item style="color: #2b2d7d">
            <q-item-section avatar>
              <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">#</p>
            </q-item-section>
            <q-item-section>
              <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">Name</p>
            </q-item-section>
          </q-item>
        </q-list>
        <q-scroll-area
          :thumb-style="thumbStyle"
          :content-style="contentStyle"
          :content-active-style="contentActiveStyle"
          style="height: 70vh"
        >
          <q-list bordered separator v-for="(team, index) in companyUserTeamsStore.teamList" :key="team.id">
            <q-item clickable v-ripple @click="showTeamInfo(team.id, team.name)">
              <q-item-section avatar>
                <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing">
                  {{ index + 1 }}
                </p>
              </q-item-section>
              <q-item-section>
                <p class="text-subtitle2 text-weight-bold ase-roboto ase-black-light none-spacing">
                  {{ team.name }}
                </p>
              </q-item-section>
            </q-item>
          </q-list>
          <template v-if="!companyUserTeamsStore.isLoading && companyUserTeamsStore.teamList.length === 0">
            <q-parallax :height="200" :speed="0.5">
              <p class="text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12 text-center">No data</p>
            </q-parallax>
          </template>
        </q-scroll-area>
        <div align="left">
          <br />
          <q-btn
            v-if="companyUserTeamsStore.paginatedTeam.pk"
            push
            type="submit"
            size="14px"
            :loading="companyUserTeamsStore.isLoading"
            color="btn"
            @click="loadMoreUsers()"
          >
            Load more
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Loading...
            </template>
          </q-btn>
        </div>
      </slot>
    </page>
  </div>
</template>

<script>
import Page from 'components/shared/Page.vue'

import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'

export default {
  name: 'ReportCompanyUserOpsTable',
  components: {
    page: Page
  },
  setup() {
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    return {
      companyUserTeamsStore
    }
  },
  data() {
    return {
      contentStyle: {
        color: '#555'
      },

      contentActiveStyle: {
        color: 'black'
      },

      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      search: '',
      currentPage: 1,
      isActive: [],
      isInActive: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 8
      },
      columns: [
        {
          name: 'name',
          label: 'Name',
          field: 'fullName',
          sortable: true,
          align: 'left'
        },
        {
          name: 'email',
          label: 'Email',
          field: 'email',
          sortable: true,
          align: 'left'
        },
        {
          name: 'action',
          label: 'Active',
          field: 'Action',
          sortable: false,
          align: 'center'
        }
      ]
    }
  },
  watch: {
    getInActiveUsers: {
      handler() {
        if (this.companyUserTeamsStore.paginatedTeam.pk) {
          this.isActive = ''
          this.isActive = this.getInActiveUsers
        }
      }
    }
  },
  methods: {
    fetchData() {
      this.isActive = ''
      this.isActive = this.getInActiveUsers
    },
    showCreateTeam(event) {
      if (event.show) {
        this.$emit('showCreateTeam', {
          show: true
        })
      }
    },
    setPage(page) {
      this.pagination.page = page
    },
    showUpdateTeam(id) {
      this.$emit('showUpdateTeam', { show: true, id: id })
    },
    showDeleteTeam(id, name) {
      this.$emit('showDeleteTeam', { show: true, id: id, name: name })
    },
    async showTeamInfo(id, name) {
      this.$emit('showTeamInfoData', { show: true, id: id, name: name })
    },
    showIncludeUsers(id) {
      this.$emit('showIncludeUsers', { show: true, id: id })
    },
    loadMoreUsers() {
      const data = {
        LastEvaluatedKey: this.companyUserTeamsStore.paginatedTeam
      }
      //this.isStatus(true)
      this.companyUserTeamsStore.fetchPaginatedCompanyTeams(data)
    },
    async clearSearchData() {
      const data = {}
      this.search = ''
      await this.companyUserTeamsStore.fetchCompanyTeams(data)
    },
    async searchData() {
      if (!this.search) {
        const data = {}
        await this.companyUserTeamsStore.fetchCompanyTeams(data)
      } else {
        const data = {
          name: this.search
        }
        await this.companyUserTeamsStore.searchCompanyTeam(data)
      }
    }
  }
}
</script>
