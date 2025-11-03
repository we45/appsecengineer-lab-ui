<template>
  <div>
    <q-card class="my-card" style="margin-left: 1%; margin-right: 1%">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Users</div>
      </q-card-section>
      <q-separator />
      <page
        v-model="search"
        @searchData="searchData"
        :downloadReport="false"
        :newFormat="true"
        :showCreate="false"
        :multipleCreate="true"
        @clearSearchData="clearSearchData"
        :title="''"
        @showPopWindow="showPopWindow"
        @createPage="showCreateUser($event)"
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
          <q-list bordered>
            <q-item clickable v-ripple style="color: #2b2d7d">
              <q-item-section avatar>
                <div class="appsec-h1-bold">#</div>
              </q-item-section>
              <q-item-section>
                <div class="appsec-h1-bold">Full Name</div>
              </q-item-section>
              <q-item-section>
                <div class="appsec-h1-bold">Email</div>
              </q-item-section>
              <q-item-section avatar>
                <div class="appsec-h1-bold">Active</div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-scroll-area
            :thumb-style="thumbStyle"
            :content-style="contentStyle"
            :content-active-style="contentActiveStyle"
            style="height: 400px"
          >
            <q-list bordered separator v-for="(user, index) in companyUsersStore.normalUsers" :key="user.email">
              <q-item clickable v-ripple>
                <q-item-section avatar>{{ index + 1 }}</q-item-section>
                <q-item-section @click="getUserInfo(user.email, user.fullName)">{{ user.fullName }}</q-item-section>
                <q-item-section @click="getUserInfo(user.email, user.fullName)">{{ user.email }}</q-item-section>
                <q-item-section avatar>
                  <radio @updateToggleStatus="showDisableUser(user.email, user.isActive)" :name="user.isActive" :title="''"></radio>
                </q-item-section>
              </q-item>
            </q-list>
            <template v-if="!companyUsersStore.isLoading && companyUsersStore.normalUsers.length === 0">
              <p class="text-center text-h4 text-weight-bold ase-roboto ase-black-light line-height-normal padding_12">No data</p>
            </template>
          </q-scroll-area>
          <div align="left">
            <br />
            <br />
            <q-btn
              v-if="companyUsersStore.normalUserPagination"
              class="ase-roboto ase-md"
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
      <q-dialog v-model="show" persistent>
        <q-card style="min-width: 450px; minh-height: 350px">
          <q-card-section class="padding_12">
            <q-bar class="bg-white none-spacing">
              <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">Import users</p>
              <q-space />
              <q-btn class="ase-roboto ase-md" color="secondary" round size="sm" icon="close" @click="confirmUploadCancel()" />
            </q-bar>
            <hr />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <input
              type="file"
              size="xs"
              required
              @change="onFileSelected"
              label="choose file"
              :model="usersImport.name"
              accept="csv/xlsx/json"
            />
          </q-card-section>
          <q-card-section class="error_msg_color">
            Note: Supported formats -
            <a @click="sampleFiles('xlsx')" class="text-link portal_bold ase-md text_dec">xlsx</a>
            ,
            <a @click="sampleFiles('csv')" class="text-link portal_bold ase-md text_dec">csv</a>
            , and
            <a @click="sampleFiles('json')" id="downloadAnchorElem" class="text-link portal_bold ase-md text_dec">json</a>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              class="ase-roboto ase-md"
              color="primary"
              :disabled="fileName === ''"
              size="sm"
              label="Submit"
              @click="confirmUpload()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showDialogInformation" persistent>
        <q-card style="min-width: 450px; minh-height: 350px">
          <q-card-section class="padding_12">
            <q-bar class="bg-white none-spacing">
              <p class="text-subtitle1 text-weight-bold ase-roboto ase-black-shade none-spacing">Import users status</p>
              <q-space />
              <q-btn class="ase-roboto ase-md" color="secondary" round size="sm" icon="close" @click="confirmUploadStatusCancel()" />
            </q-bar>
            <hr />
          </q-card-section>

          <q-separator />
          <br />
          <q-card-section class="q-pt-none">
            {{ companyUsersStore.statusOfUserAPIFileData }}
          </q-card-section>
          <q-card-section class="error_msg_color"></q-card-section>
        </q-card>
      </q-dialog>
    </q-card>
    <br />
    <br />
  </div>
</template>

<script>
import MonthPicker from 'components/shared/MonthPicker.vue'
import Page from 'components/shared/Page.vue'
import Radio from 'components/shared/ToggleRadio.vue'
import { QSpinnerFacebook } from 'quasar'
import { monthIndexToString, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import XLSX from 'xlsx'
import { useSignUpStore } from 'src/store/pinia/signUp'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'

export default {
  name: 'CompanyUserOpsTableT',
  components: { Page, Radio, MonthPicker },
  setup() {
    const signUpStore = useSignUpStore()
    const companyUsersStore = useCompanyConsumerStore()
    return { companyUsersStore, signUpStore }
  },
  data() {
    return {
      showDialogInformation: false,
      showDateRange: false,
      dateRangeInput: null,
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
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 8
      },
      show: false,
      fileName: '',
      usersImport: {
        name: ''
      },
      b64File: '',
      fileType: '',
      columns: [
        {
          name: 'name',
          label: 'Name',
          field: 'fullName',
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
    'signUpStore.isRegistered': {
      handler() {
        if (this.signUpStore.isRegistered) {
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
    },
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
  created() {},
  methods: {
    fetchData() {
      this.isActive = ''
      this.isActive = this.companyUsersStore.inActiveUsers
    },
    selectedClose() {
      this.showDateRange = false
    },
    confirmUploadCancel() {
      this.show = false
    },
    confirmUploadStatusCancel() {
      this.showDialogInformation = false
    },
    showPopWindow(info) {
      this.fileName = ''
      if (info.show) {
        this.show = true
      } else {
        this.show = false
      }
    },
    onFileSelected(event) {
      const input = event.target
      this.fileType = ''
      if (input.files[0].name.split('.').length > 0) {
        this.fileType = input.files[0].name.split('.')[input.files[0].name.split('.').length - 1]
      }

      this.fileName = input.files[0].name
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
          const imageSplit = e.target.result.split(';')
          const getOnlyB64Val = imageSplit[1].split(',')
          this.b64File = getOnlyB64Val[1]
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    async confirmUpload() {
      const data = {
        content: this.b64File,
        filetype: this.fileType
      }
      await this.companyUsersStore.createUsersByFile(data)
      if (this.companyUsersStore.statusOfUserAPIFile) {
        this.show = false
        this.showDialogInformation = true
      } else {
        this.show = true
      }
    },
    async overallReportUsers(event) {
      await this.companyUsersStore.downloadXLSReportAction({ users: {} })
      if (this.companyUsersStore.errorMsgsReportCompanyUserOverall.status) {
        const filteredData = this.companyUsersStore.fetchAllUsersInfo
        const reportCSV = XLSX.utils.json_to_sheet(filteredData)
        const wb = XLSX.utils.book_new()
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
        const rowsSizes = [{ hpt: 25 }]

        reportCSV['!cols'] = colsSizes
        reportCSV['!rows'] = rowsSizes
        wb['!margins'] = { left: 2.0, right: 2.0, top: 1.0, bottom: 2.0, header: 0.5, footer: 0.5 }

        XLSX.utils.book_append_sheet(wb, reportCSV, 'Consolidated Report')

        const dateName = this.nameOfReport
        const xlsName = `Consolidated Report-${dateName}.xlsx`

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
    async sampleFiles(type) {
      if (!this.companyUsersStore.companyInfo.id) {
        await this.companyUsersStore.fetchCompanyInfo()
      }
      if (this.companyUsersStore.companyUserCustomFields.c_attrs.length === 0) {
        await this.companyUsersStore.fetchCompanyUserCustomFieldsData({
          company_id: this.companyUsersStore.companyInfo.id
        })
      }
      const newFields = {}
      this.companyUsersStore.companyUserCustomFields.c_attrs.map((info) => (newFields[info] = ''))
      const requiredFields = { email: '', first_name: '', last_name: '', ...newFields }
      if (type === 'json') {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify([requiredFields]))
        const dlAnchorElem = document.getElementById('downloadAnchorElem')
        dlAnchorElem.setAttribute('href', dataStr)
        dlAnchorElem.setAttribute('download', 'sample-json-data.json')
      } else if (type === 'csv') {
        const headers = {}
        Object.entries(requiredFields).forEach(([key, value]) => {
          headers[key] = `${key}`.replace(/,/g, '')
        })
        const itemsNotFormatted = []
        const itemsFormatted = []

        itemsNotFormatted.forEach((item) => {
          itemsFormatted.push({
            model: item.model.replace(/,/g, ''),
            chargers: item.chargers,
            cases: item.cases,
            earphones: item.earphones
          })
        })

        const fileTitle = 'sample-csv-data'

        this.exportCSVFile(headers, itemsFormatted, fileTitle)
      } else if (type === 'xlsx') {
        const sampleData = [requiredFields]

        const coloumnsSize = XLSX.utils.json_to_sheet(sampleData)
        const wb = XLSX.utils.book_new()
        const colsSizes = [
          { width: 30 },
          { width: 25 },
          { width: 25 },
          { width: 15 },
          { width: 40 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 },
          { width: 25 }
        ]
        const rowsSizes = [{ hpt: 25 }]

        coloumnsSize['!cols'] = colsSizes
        coloumnsSize['!rows'] = rowsSizes

        wb['!margins'] = { left: 2.0, right: 2.0, top: 1.0, bottom: 2.0, header: 0.5, footer: 0.5 }
        XLSX.utils.book_append_sheet(wb, coloumnsSize, 'Multiple-Users-Data')

        const xlsName = 'sample-xlxs-data.xlsx'
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
        const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }))
        this.download(url, xlsName)
      }
    },
    exportCSVFile(headers, items, fileTitle) {
      if (headers) {
        items.unshift(headers)
      }

      var jsonObject = JSON.stringify(items)

      const csv = this.convertToCSV(jsonObject)

      const exportedFilenmae = fileTitle + '.csv' || 'export.csv'

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
    convertToCSV(objArray) {
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
      let str = ''

      for (let i = 0; i < array.length; i++) {
        let line = ''
        for (const index in array[i]) {
          if (line !== '') line += ','
          line += array[i][index]
        }
        str += line + '\r\n'
      }

      return str
    },
    async selectedDates(event) {
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

          const wb = XLSX.utils.book_new()
          const colsSizes = [{ width: 30 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 40 }, { width: 25 }, { width: 25 }]
          const rowsSizes = [{ hpt: 25 }]

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

          XLSX.utils.book_append_sheet(wb, reportCSVMonthly, 'Monthly')
          XLSX.utils.book_append_sheet(wb, reportCSVWeekly, 'Weekly')

          const dateName = this.nameOfReport
          const xlsName = `Monthly-Weekly-Report-${monthIndexToString(this.dateRangeInput.monthIndex)}-${
            this.dateRangeInput.year
          }-${dateName}.xlsx`

          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' })
          const url = window.URL.createObjectURL(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }))
          this.download(url, xlsName)
        }
      }
    },
    showDateRangeAction() {
      this.showDateRange = true
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
    showDisableUser(email, status) {
      this.$emit('showDisableUser', { show: true, email: email, status: status })
    },
    updateCustomFields(payload) {
      this.$emit('updateCustomFields', { show: true, payload: payload })
    },
    sendEmailForUser(email) {
      this.$emit('sendEmailForUser', { show: true, email: email })
    },
    showEnableUser(email) {
      this.$emit('showEnableUser', { show: true, email: email })
    },
    async getUserInfo(email, username) {
      await this.$router.push(`/portal/company/profile-info/${urlSafeBase64Encode(email)}/${urlSafeBase64Encode(username)}`)
    },
    loadMoreUsers() {
      const data = {
        LastEvaluatedKey: this.companyUsersStore.normalUserPagination,
        all: false
      }
      //this.isStatus(true)
      this.companyUsersStore.fetchPaginatedCompanyNormalUsers(data)
    },
    async clearSearchData() {
      //this.isStatus(true)
      const data = { all: false }
      await this.companyUsersStore.fetchCompanyNormalUsers(data)
      this.search = ''
    },
    async searchData() {
      //this.isStatus(true)
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
