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
        <label v-if="labelName && !isDownloadIcon" class="portal_bold portal_xxlg">{{ labelName }}</label>
        <div align="right" v-if="isDownloadIcon && listData.length > 0" style="align: right; margin-bottom: 12px">
          <q-btn size="sm" @click="downloadOutliners" class="btn text-white text-right align_right" push>Download</q-btn>
          <br />
        </div>
        <q-space />
        <BaseTable
          :rows="listData"
          :table-header-style="{ backgroundColor: '#ffffff' }"
          :columns="columns"
          class="q-table th.sortable sticky-header-table"
          row-key="index"
          :rows-per-page-options="[0]"
          virtual-scroll
          style="max-height: 70vh"
        ></BaseTable>
      </slot>
    </page>
  </div>
</template>

<script>
import Page from 'components/shared/Page.vue'

export default {
  name: 'ReportCompanyUserOpsTable',
  components: {
    page: Page
  },
  props: {
    listData: {
      required: true,
      type: Array
    },
    labelName: {
      required: false
    },
    isDownloadIcon: {
      required: false,
      type: Boolean,
      default: false
    },
    isLoading: {
      required: false,
      type: Boolean,
      default: false
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
          name: 'email',
          label: 'Email',
          field: 'email',
          sortable: false,
          align: 'left'
        },
        {
          name: 'First name',
          label: 'First name',
          field: 'First name',
          sortable: false,
          align: 'left'
        },
        {
          name: 'Last name',
          label: 'Last name',
          field: 'Last name',
          sortable: false,
          align: 'left'
        },
        {
          name: 'Course Minutes',
          label: 'Course Minutes',
          field: 'Course Minutes',
          sortable: false,
          align: 'left'
        },
        {
          name: 'Lab minutes',
          label: 'Lab minutes',
          field: 'Lab minutes',
          sortable: false,
          align: 'left'
        }
      ]
    }
  },
  methods: {
    downloadOutliners(event) {
      this.$emit('downloadOutliners', event)
    },
    searchData(event) {
      this.$emit('searchData', event)
    },
    clearSearchData(event) {
      this.$emit('clearSearchData', event)
    }
  },
  computed: {}
}
</script>
<style lang="sass">
.sticky-header-table

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
