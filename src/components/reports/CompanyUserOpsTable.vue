<template>
  <page
    v-model="search"
    @searchData="searchData"
    :downloadReport="false"
    :showSearch="false"
    :showCreate="false"
    @clearSearchData="clearSearchData"
    :title="''"
    :isTable="true"
  >
    <template v-slot:report>
      <q-btn-dropdown color="primary" :label="'Download Report'" icon="file_download">
        <q-list>
          <q-item clickable v-close-popup @click="showDateRangeAction">
            <q-item-section>
              <q-item-label>Monthly/Weekly</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="overallReportUsers">
            <q-item-section>
              <q-item-label>Consolidated</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <template v-if="showDateRange">
        <MonthPicker
          v-model="dateRangeInput"
          v-model:showDialog="showDialog"
          :header="`Select Month`"
          @confirmSelect="selectedDates"
          @confirmCancel="selectedClose"
        />
      </template>
    </template>
    <slot>
      <BaseTable
        borderless
        :rows="reportStore.companyUserStats.list"
        :columns="columns"
        row-key="index"
        :rows-per-page-options="[0]"
        virtual-scroll
        style="max-height: calc(100vh - 300px)"
        hide-pagination
        customClasses="sticky-head"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props" @click="getUserInfo(props.row)">
            {{ props.value }}
          </q-td>
        </template>
      </BaseTable>
    </slot>
  </page>
</template>

<script>
import MonthPicker from 'components/shared/MonthPicker.vue'
import Page from 'components/shared/Page.vue'
import { monthIndexToString } from 'src/utils/reuseFunctions'

import XLSX from 'xlsx'
import { useReportStore } from 'src/store/pinia/report'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'ReportCompanyUserOpsTable',
  components: { Page, MonthPicker },
  setup() {
    const reportStore = useReportStore()
    const companyUsersStore = useCompanyConsumerStore()
    return {
      reportStore,
      companyUsersStore
    }
  },
  data() {
    return {
      showDateRange: false,
      dateRangeInput: null,
      search: '',
      nameOfReport: `${
        new Date().getDate().toString() +
        '-' +
        new Date().getMonth().toString() +
        '-' +
        new Date().getFullYear().toString() +
        '-' +
        new Date().getHours().toString() +
        ':' +
        new Date().getMinutes().toString() +
        ':' +
        new Date().getMilliseconds().toString()
      }`,
      pagination: { sortBy: 'desc', descending: false, page: 1, rowsPerPage: 8 },
      columns: [
        { name: 'email', label: 'Email', field: 'email', sortable: false, align: 'left' },
        { name: 'First name', label: 'First name', field: 'First name', sortable: false, align: 'left' },
        { name: 'Last name', label: 'Last name', field: 'Last name', sortable: false, align: 'left' },
        { name: 'Course Minutes', label: 'Course Minutes', field: 'Course Minutes', sortable: false, align: 'left' },
        { name: 'Lab minutes', label: 'Lab minutes', field: 'Lab minutes', sortable: false, align: 'left' }
      ]
    }
  },
  methods: {
    selectedClose() {
      this.showDateRange = false
    },
    async overallReportUsers() {
      await this.companyUsersStore.downloadXLSReportAction({ users: {} })
      if (this.companyUsersStore.errorMsgsReportCompanyUserOverall.status) {
        const filteredData = this.companyUsersStore.fetchAllUsersInfo
        const reportCSV = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new() // make Workbook of Excel
        const colsSizes = [
          { width: 30 },
          { width: 25 },
          { width: 25 },
          { width: 50 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 }
        ]
        const rowsSizes = [
          { hpt: 25 } // row 1 sets to the height of 12 in points
        ]

        reportCSV['!cols'] = colsSizes
        reportCSV['!rows'] = rowsSizes
        wb['!margins'] = { left: 2.0, right: 2.0, top: 1.0, bottom: 2.0, header: 0.5, footer: 0.5 }

        // // // add Worksheet to Workbook
        // // Workbook contains one or more worksheets
        XLSX.utils.book_append_sheet(wb, reportCSV, 'Consolidated Report') // sheetAName is name of Worksheet
        // // // export Excel file
        const dateName = this.nameOfReport
        const xlsName = `Consolidated Report-${dateName}.xlsx`
        // XLSX.writeFile(wb, xlsName, { bookType: 'xlsx' }) // name of the file is 'book.xlsx'

        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
        const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }))
        this.download(url, xlsName)
      }
    },
    s2ab(s) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff
      }
      return buf
    },
    download(url, name) {
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    },
    async selectedDates() {
      if (this.dateRangeInput) {
        this.showDateRange = false
        await this.companyUsersStore.downloadXLSReportActionWeeklyMonthly({
          users: { select: this.dateRangeInput }
        })
        if (this.companyUsersStore.errorMsgsReportCompanyUser.status) {
          const filteredDataMonthly = this.companyUsersStore.fetchAllUsersInfoMonthly
          const filteredDataWeekly = this.companyUsersStore.fetchAllUsersInfoWeekly

          const reportCSVMonthly = XLSX.utils.json_to_sheet(filteredDataMonthly)
          const reportCSVWeekly = XLSX.utils.json_to_sheet(filteredDataWeekly)

          const wb = XLSX.utils.book_new() // make Workbook of Excel
          const colsSizes = [{ width: 30 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 40 }, { width: 25 }, { width: 25 }]
          const rowsSizes = [
            { hpt: 25 } // row 1 sets to the height of 12 in points
          ]

          reportCSVMonthly['!cols'] = colsSizes
          reportCSVMonthly['!rows'] = rowsSizes
          reportCSVWeekly['!cols'] = [
            { width: 30 },
            { width: 25 },
            { width: 25 },
            { width: 15 },
            { width: 25 },
            { width: 25 },
            { width: 25 }
          ]
          reportCSVWeekly['!rows'] = rowsSizes
          wb['!margins'] = { left: 2.0, right: 2.0, top: 1.0, bottom: 2.0, header: 0.5, footer: 0.5 }

          // // // add Worksheet to Workbook
          // // Workbook contains one or more worksheets
          XLSX.utils.book_append_sheet(wb, reportCSVMonthly, 'Monthly') // sheetAName is name of Worksheet
          XLSX.utils.book_append_sheet(wb, reportCSVWeekly, 'Weekly') // sheetAName is name of Worksheet

          // // // export Excel file
          const dateName = this.nameOfReport
          const xlsName = `Monthly-Weekly-Report-${monthIndexToString(this.dateRangeInput.monthIndex)}-${
            this.dateRangeInput.year
          }-${dateName}.xlsx`
          // XLSX.writeFile(wb, xlsName) // name of the file is 'book.xlsx'
          // XLSX.writeFile(wb, xlsName, { bookType: 'xlsx' })
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
          const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }))
          this.download(url, xlsName)
        }
      }
    },
    showDateRangeAction() {
      this.showDateRange = true
    },
    getUserInfo(row) {
      this.$emit('singleUserInfo', { show: true, email: row.email, username: `${row['First name']} ${row['Last name']}` })
    },
    async clearSearchData() {
      const data = { all: false }
      await this.companyUsersStore.fetchCompanyNormalUsers(data)
      this.search = ''
    },
    async searchData() {
      if (!this.search) {
        const data = { all: false }
        await this.companyUsersStore.fetchCompanyNormalUsers(data)
      } else {
        const data = {
          name: this.search
        }
        await this.companyUsersStore.searchCompanyNormalUser(data)
      }
    }
  }
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
