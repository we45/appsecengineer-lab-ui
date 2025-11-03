<template>
  <div>
    <q-card class="my-card" style="padding: 12px">
      <page v-model="search" :title="''" @createPage="showCreateUser($event)" :showCreate="false" :isTable="true" :showSearch="false">
        <slot>
          <q-list bordered>
            <q-item style="color: #2b2d7d">
              <q-item-section class="appsec-h1-bold" avatar>#</q-item-section>
              <q-item-section>
                <div class="appsec-h1-bold">Full Name</div>
              </q-item-section>
              <q-item-section>
                <div class="appsec-h1-bold">Email</div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-scroll-area
            :thumb-style="thumbStyle"
            :content-style="contentStyle"
            :content-active-style="contentActiveStyle"
            style="height: 70vh"
          >
            <q-list bordered separator v-for="(user, index) in companyUsersStore.adminUsers" :key="user.email">
              <q-item>
                <q-item-section avatar>{{ index + 1 }}</q-item-section>
                <q-item-section>{{ user.fullName }}</q-item-section>
                <q-item-section>{{ user.email }}</q-item-section>
              </q-item>
            </q-list>
            <template v-if="!companyUsersStore.isLoading && companyUsersStore.adminUsers.length === 0">
              <q-parallax :height="200" :speed="0.5">
                <p class="text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
              </q-parallax>
            </template>
          </q-scroll-area>
          <div align="left">
            <br />
            <q-btn
              v-if="companyUsersStore.adminUsersPagination.pk"
              push
              type="submit"
              size="14px"
              :loading="companyUsersStore.isLoading"
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
    </q-card>
  </div>
</template>

<script>
import Page from 'components/shared/Page.vue'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyUserOpsTable',
  components: {
    page: Page
  },
  setup() {
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore }
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
        if (this.companyUsersStore.adminUsersPagination.pk) {
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
    showCreateUser(event) {
      if (event.show) {
        this.$emit('showCreateUser', {
          show: true
        })
      }
    },
    setPage(page) {
      this.pagination.page = page
    },
    showUpdateVideo(id) {
      this.$emit('showUpdateVideo', { show: true, id: id })
    },
    showDisableUser(email) {
      this.$emit('showDisableUser', { show: true, email: email })
    },
    showEnableUser(email) {
      this.$emit('showEnableUser', { show: true, email: email })
    },
    async getUserInfo(email, username) {
      await this.$router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
    },
    loadMoreUsers() {
      const data = {
        LastEvaluatedKey: this.companyUsersStore.adminUsersPagination
      }
      this.companyUsersStore.fetchPaginatedCompanyAdminUsers(data)
    },
    onScroll({ to, ref }) {
      const data = {
        LastEvaluatedKey: this.companyUsersStore.adminUsersPagination
      }
      this.fetchCompanyNormalUsers(data)
    }
  }
}
</script>
