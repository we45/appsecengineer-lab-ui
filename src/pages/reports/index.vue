<template>
  <div class="row justify-between">
    <div class="row items-center q-gutter-lg">
      <div class="text-subtitle1">Report Type</div>
      <q-select
        style="min-width: 200px"
        emit-value
        dense
        outlined
        v-model="selectedActionItem"
        :options="optionsScope"
        @update:modelValue="actionItem(selectedActionItem)"
      />
      <q-select
        style="min-width: 200px"
        emit-value
        dense
        outlined
        v-model="selectedOptionsUserReport"
        :options="optionsUserReport"
        @popup-hide="resetSelect(selectedOptionsUserReport)"
        @update:modelValue="toggletoMonthlyUserReport(selectedOptionsUserReport)"
        v-if="selectedActionItem === 'Users' || selectedActionItem === 'Outliers'"
      />
      <div
        v-if="
          (selectedTeams === 'singleUserTeam' || selectedTeams === 'singleTeam' || selectedActionItem === 'Teams') &&
          selectedActionItem !== 'Outliers Users'
        "
        class="row q-gutter-x-lg items-center"
      >
        <q-select
          v-if="selectedTeams === 'singleUserTeam' || selectedTeams === 'singleTeam'"
          emit-value
          dense
          outlined
          v-model="selectedOptionsTeamReport"
          :options="optionsUserReport"
          @popup-hide="resetSelectTeam(selectedOptionsTeamReport)"
          @update:modelValue="toggletoMonthlyTeamUserReport(selectedOptionsTeamReport)"
          style="min-width: 200px"
        />
        <q-select
          style="width: 200px"
          dense
          outlined
          v-model="teamSelect"
          :options="getCompanyTeamsOptions"
          @update:modelValue="singleTeamInfo(teamSelect)"
        />
      </div>
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12" v-if="selectedActionItemGetter == 'Dashboard'">
        <div class="row col-12 q-col-gutter-lg">
          <div class="col-9">
            <chart-section
              :monthlyStats="analyticsStore.monthlyStats"
              :weeklyStats="analyticsStore.weeklyStats"
              :loadingIconData="isLoading"
              :topCourses="analyticsStore.topCourses"
            />
            <div class="column q-gutter-y-lg">
              <LeaderboardTable />
              <div class="row">
                <LearningPathGroup class="col-12" />
              </div>
              <!-- <div class="row">
                <SkillReports class="col-6" />
              </div> -->
            </div>
          </div>
          <div class="col-3">
            <div class="text-subtitle1">Company Stats</div>
            <StatisticCard :stats="statistics"></StatisticCard>
          </div>
        </div>
      </div>
    </div>
    <div
      class="q-pa-xs col-xs-12 col-sm-3 col-md-3 col-lg-3"
      v-if="
        selectedActionItem === 'Users' ||
        selectedActionItem === 'Outliers Users' ||
        selectedTeams === 'singleTeam' ||
        selectedTeams === 'singleUserTeam'
      "
    >
      <div class="text-right">
        <q-fab
          class="radius-4border-radius-inherit text-subtitle1"
          color="primary"
          direction="left"
          icon="download"
          label="Download"
          padding="sm"
          push
          square
        >
          <q-fab-action color="primary" icon="fas fa-file-csv" push @click="downloadCSVReport()">
            <q-tooltip anchor="top middle" self="bottom middle">Download CSV</q-tooltip>
          </q-fab-action>
          <q-fab-action color="primary" icon="fas fa-file-pdf" push @click="downloadPDFReport()">
            <q-tooltip anchor="top middle" self="bottom middle">Download PDF</q-tooltip>
          </q-fab-action>
        </q-fab>
      </div>
    </div>
  </div>
  <div
    class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12"
    v-if="selectedActionItemGetter == 'Users' || selectedActionItem === 'Outliers Users'"
  >
    <template v-if="selectedActionItemGetter == 'Users'">
      <template v-if="selectedUsers === 'allUsers'">
        <div class="row col-12 q-col-gutter-lg">
          <div class="col-9">
            <BarGraph
              :categories="fetchCompanyUserStats.dataLabels"
              :data="userSeriesData"
              :title="
                selectedUserActionItemGetter === 'Overall'
                  ? 'Top Five Users'
                  : `Top Five Users Of ${monthIndexToStringFun(fetchCompanyUserStats.month)} Report`
              "
              :horizontal="false"
              xAxisTitle="Users"
              yTooltipTitle="Course Minutes"
              yAxisTitle="Course Minutes"
            />
          </div>
          <div class="col-3">
            <div class="text-subtitle1">User Stats</div>

            <StatisticCard :stats="userStatistics"></StatisticCard>
          </div>
        </div>
        <br />
        <users-list @singleUserInfo="singleUserInfo" />
      </template>
      <template v-else>
        <profile-user :email="userDetails.email" :usernameData="userDetails.username" />
      </template>
    </template>
  </div>
  <div
    class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12"
    v-if="selectedActionItemGetter == 'Teams' || selectedActionItem === 'singleTeam'"
  >
    <br />
    <template v-if="selectedTeams === 'allTeams'">
      <BarGraph
        :categories="analyticsStore.topTeams.labels"
        :data="[{ data: analyticsStore.topTeams.data?.map((item) => item.value) }]"
        title="Top Five Teams"
      />
      <teams-list @showTeamInfoData="singleTeamInfoFromList" />
    </template>
    <template v-else-if="selectedTeams === 'singleTeam'">
      <div class="row col-12 q-col-gutter-lg">
        <div class="col-9">
          <BarGraph
            :categories="fetchCompanyTeamUserStats.dataLabels"
            :data="companyTeamUserData"
            :title="
              selectedUserActionItemGetter === 'Overall'
                ? 'Top Five Users'
                : `Top Five Users Of ${monthIndexToStringFun(fetchCompanyUserStats.month)} Report`
            "
            :horizontal="false"
            xAxisTitle="Users"
            yTooltipTitle="Course Minutes"
            yAxisTitle="Course Minutes"
          />
        </div>
        <div class="col-3">
          <StatisticCard :stats="teamStatistics"></StatisticCard>
        </div>
      </div>

      <p class="radius-4q-mb-none text-subtitle1">Team Users</p>
      <individual-team :id="teamDetails.id" :username="teamDetails.name" @singleUserTeam="singleUserTeam" />
    </template>
    <template v-else-if="selectedTeams === 'singleUserTeam'">
      <profile-user :email="userTeamDetails.email" :usernameData="userTeamDetails.username" />
    </template>
  </div>
  <div class="row">
    <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <template v-if="selectedActionItemGetter == 'Teams'" />
      <template v-if="selectedActionItemGetter == 'Outliers Users'">
        <OutlinersList :listData="fetchCompanyUserStats.outliners" />
      </template>
      <template v-if="selectedActionItemGetter == 'administrators'">
        <admins-list />
      </template>
    </div>
    <MonthPicker
      header="Select Month"
      v-model="dateRangeInputUser"
      v-model:showDialog="showDateRangeUser"
      @confirmSelect="selectedDateRangeUser"
      @confirmCancel="selectedCloseUser"
    />
    <MonthPicker
      :header="`Select Month`"
      v-model="dateRangeInputTeamUser"
      v-model:showDialog="showDateRangeTeamUser"
      @confirmSelect="selectedDateRangeTeamUser"
      @confirmCancel="selectedCloseTeamUser"
    />
  </div>

  <div class="hidden">
    <section class="q-px-lg" ref="thepdf">
      <div v-if="selectedActionItem === 'Users'">
        <div class="q-my-xl q-py-xl html2pdf__page-break">
          <hr />
          <h3 class="radius-4text-center">User's Reports</h3>
          <hr />
          <h6 class="text-center" style="margin-top: 500px">
            Report generated by {{ fetchUserInfo.firstName }} on
            <br />
            <span>{{ readableDateNow }}</span>
          </h6>
        </div>
        <BaseTable
          bordered
          :columns="[
            { name: 'name', label: 'Description', field: 'name', align: 'left' },
            { name: 'count', label: 'Count', field: 'count', align: 'left' }
          ]"
          :rows="[
            { name: 'Total Users', count: fetchUserStatsCount.totalUsersCount || 0 },
            { name: 'Certificates Earned', count: fetchUserStatsCount.totalBadgesCount || 0 },
            { name: 'Total Outliers', count: fetchCompanyUserStats.outliners ? fetchCompanyUserStats.outliners.length : 0 || 0 }
          ]"
          hide-bottom
          row-key="name"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          title="User Stats"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props" style="background-color: lightgray">
              {{ props.value }}
            </q-td>
          </template>
        </BaseTable>
        <br />
        <br />
        <BaseTable
          bordered
          :columns="columns"
          :rows="fetchCompanyUserStats.list"
          dense
          hide-bottom
          row-key="name"
          :rows-per-page-options="[0]"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          title="Users List"
        >
          <template v-slot:body-cell-email="props">
            <q-td :props="props" style="background-color: lightgray">
              {{ props.value }}
            </q-td>
          </template>
        </BaseTable>
      </div>
      <div v-else-if="selectedActionItem === 'Teams'">
        <div class="q-my-xl q-py-xl html2pdf__page-break">
          <hr />
          <h3 class="radius-4text-center">Team Reports</h3>
          <hr />
          <h4 class="text-center" style="margin-top: 200px">{{ teamDetails.name }}</h4>
          <h6 class="text-center" style="margin-top: 300px">
            Report generated by {{ fetchUserInfo.firstName }} on
            <br />
            <span>{{ readableDateNow }}</span>
          </h6>
        </div>
        <BaseTable
          bordered
          :columns="[
            { name: 'name', label: 'Description', field: 'name', align: 'left' },
            { name: 'count', label: 'Count', field: 'count', align: 'left' }
          ]"
          :rows="[
            { name: 'Total Users', count: fetchTeamStatsCount.totalUsersCount || 0 },
            { name: 'Certificates Earned', count: fetchTeamStatsCount.totalBadgesCount || 0 },
            { name: 'Total Outliers', count: fetchCompanyTeamUserStats.outliners ? fetchCompanyTeamUserStats.outliners.length : 0 }
          ]"
          hide-bottom
          row-key="name"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          title="User Stats"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props" style="background-color: lightgray">
              {{ props.value }}
            </q-td>
          </template>
        </BaseTable>
        <br />
        <br />
        <BaseTable
          bordered
          :columns="columns"
          :rows="fetchCompanyTeamUserStats.list"
          dense
          hide-bottom
          row-key="name"
          :rows-per-page-options="[0]"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          title="Users List"
        >
          <template v-slot:body-cell-email="props">
            <q-td :props="props" style="background-color: lightgray">
              {{ props.value }}
            </q-td>
          </template>
        </BaseTable>
      </div>
      <div v-else-if="selectedActionItem === 'Outliers Users'">
        <div class="q-my-xl q-py-xl html2pdf__page-break">
          <hr />
          <h3 class="radius-4text-center">Outliers Users Reports</h3>
          <hr />
          <h6 class="text-center" style="margin-top: 500px">
            Report generated by {{ fetchUserInfo.firstName }} on
            <br />
            <span>{{ readableDateNow }}</span>
          </h6>
        </div>
        <BaseTable
          bordered
          :columns="columns"
          :rows="fetchCompanyUserStats.outliners"
          dense
          hide-bottom
          row-key="name"
          :rows-per-page-options="[0]"
          :table-header-style="{ backgroundColor: 'gray', color: 'white', fontWeight: 'bold' }"
          title="Users List"
        >
          <template v-slot:body-cell-email="props">
            <q-td :props="props" style="background-color: lightgray">
              {{ props.value }}
            </q-td>
          </template>
        </BaseTable>
      </div>
    </section>
  </div>
</template>

<script>
import AdminsList from 'components/reports/administratorsList.vue'
import ChartSection from 'components/reports/chartSection.vue'
import OutlinersList from 'components/reports/outlinersList.vue'
import TeamsList from 'components/reports/teamsList.vue'
import UsersList from 'components/reports/usersList.vue'
import LeaderboardTable from 'components/reports/LeaderboardTable.vue'
import MonthPicker from 'components/shared/MonthPicker.vue'
import html2pdf from 'html2pdf.js'
import SkillReports from 'components/reports/SkillReports.vue'
import { QSpinnerFacebook, useQuasar } from 'quasar'
import { downloadCSV, monthIndexToString, readableDateNow } from 'src/utils/reuseFunctions'
import IndividualTeam from './IndividualTeam.vue'
import ProfileUser from './ProfileUser.vue'
import { useLoginStore } from 'src/store/pinia/login'
import BarGraph from 'src/components/charts/BarGraph.vue'
import LearningPathGroup from 'src/components/reports/LearningPathGroup.vue'
import StatisticCard from 'src/components/common/StatisticCard.vue'

//setup

import { computed, ref, onMounted, watch } from 'vue'
import { useAnalyticsStatsStore } from 'src/store/pinia/analyticsStats'
import { useReportStore } from 'src/store/pinia/report'
import { useCompanyUserTeamsStore } from 'src/store/pinia/companyUserTeams'
import { useCompanyConsumerStore } from 'src/store/pinia/companyUsers'
export default {
  name: 'reportIndexInformation',
  components: {
    AdminsList,
    TeamsList,
    UsersList,
    ChartSection,
    ProfileUser,
    IndividualTeam,
    MonthPicker,
    OutlinersList,
    BarGraph,
    LeaderboardTable,
    // SkillReports,
    // LearningPathReport,
    // LearningPathComplete,
    LearningPathGroup,
    BarGraph,
    StatisticCard
  },

  setup() {
    const loginStore = useLoginStore()
    const analyticsStore = useAnalyticsStatsStore()
    const reportStore = useReportStore()
    const companyUserTeamsStore = useCompanyUserTeamsStore()
    const fetchUserInfo = computed(() => loginStore.fetchUserInfo)
    const $q = useQuasar()
    const companyUsersStore = useCompanyConsumerStore()

    const optionsScope = ['Dashboard', 'Users', 'Teams', 'Outliers Users']
    const optionsUserReport = ref([
      { label: 'Consolidated', value: 'Overall' },
      { label: 'Monthly', value: 'Monthly' }
    ])
    const options = ref([
      { label: 'Dashboard', value: 'dashboard' },
      { label: 'Users', value: 'Users' },
      { label: 'Teams', value: 'teams' },
      { label: 'Outliers Users', value: 'Outliers Users' }
    ])
    const selectedOptionsUserReport = ref('Consolidated')
    const selectedOptionsTeamReport = ref('Consolidated')
    const actionType = ref('consolidated')
    const color = ref('')
    const selectedUsers = ref('allUsers')
    const userDetails = ref({ email: '', username: '' })
    const userTeamDetails = ref({ email: '', username: '' })
    const teamDetails = ref({ id: '', username: '' })
    const selectedTeams = ref('allTeams')
    const dateRangeInput = ref(null)
    const showDateRange = ref(false)
    const showDateRangeUser = ref(false)
    const showDateRangeTeamUser = ref(false)
    const dateRangeInputUser = ref(null)
    const dateRangeInputTeamUser = ref(null)
    const monthlyCheck = ref(false)
    const consolatedCheck = ref('Overall')
    const monthlyCheckTeam = ref(false)
    const consolatedCheckTeam = ref('Overall')
    const teamSelect = ref(null)
    const columns = ref([
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'First name', label: 'First name', field: 'First name', align: 'left' },
      { name: 'Last name', label: 'Last name', field: 'Last name', align: 'left' },
      { name: 'Course Minutes', label: 'Course min', field: 'Course Minutes', align: 'left' },
      { name: 'Lab minutes', label: 'Lab min', field: 'Lab minutes', align: 'left' }
    ])

    const isLoading = computed(() => companyUserTeamsStore.isLoading)
    const downloadReportTeamUsersGetter = computed(() => companyUserTeamsStore.downloadXLSReport)
    const fetchTeamDataInfoReportMontlyGetter = computed(() => companyUserTeamsStore.fetchTeamInfoMonthly)
    const fetchTeamDataInfoReportWeeklyGetter = computed(() => companyUserTeamsStore.fetchTeamInfoWeekly)
    const fetchErrorMsgsReportTeamMonthlyWeekly = computed(() => companyUserTeamsStore.errorMsgsReportTeam)
    const getCompanyTeamsOptions = computed(() => companyUserTeamsStore.getCompanyTeamsList)
    const teamPagination = computed(() => companyUserTeamsStore.paginatedTeam)
    const getCompanyInfo = computed(() => companyUsersStore.companyInfo)
    const isLoadingReport = computed(() => reportStore.isLoading)
    const selectedActionItemGetter = computed(() => reportStore.selectedActionItem)
    const selectedTeamUserActionItemGetter = computed(() => reportStore.selectedTeamUserActionItem)
    const selectedUserActionItemGetter = computed(() => reportStore.selectedUserActionItem)
    const fetchCompanyUserStats = computed(() => reportStore.companyUserStats)
    const fetchCompanyTeamUserStats = computed(() => reportStore.teamUserStats)
    const fetchTeamStatsCount = computed(() => reportStore.statsTeamCountData)
    const fetchUserStatsCount = computed(() => reportStore.statsUserCountData)

    //methods

    watch(isLoading, (value) => {
      if (value) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Hang on...',
          messageColor: 'white'
        })
      } else {
        $q.loading.hide()
      }
    })

    watch(isLoadingReport, (value) => {
      if (value) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: 'white',
          spinnerSize: 140,
          message: 'Hang on...',
          messageColor: 'white'
        })
      } else {
        $q.loading.hide()
      }
    })

    const userSeriesData = computed(() => {
      return [
        {
          data: fetchCompanyUserStats.value.data.map((ele) => ele.value),
          colors: fetchCompanyUserStats.value.data.map((ele) => ele?.itemStyle?.color ?? 'black')
        }
      ]
    })

    const companyTeamUserData = computed(() => {
      return [
        {
          data: fetchCompanyTeamUserStats.value.data.map((ele) => ele.value),
          colors: fetchCompanyTeamUserStats.value.data.map((ele) => ele?.itemStyle?.color ?? 'black')
        }
      ]
    })

    const filename = computed(() => {
      const selectedActionItem = reportStore.selectedActionItem
      if (selectedActionItem === 'Teams') {
        return `Team Users Report - ${readableDateNow()}`
      }
      if (selectedActionItem === 'Users') {
        return `User's Reports - ${readableDateNow()}`
      }
      if (selectedActionItem === 'Outliers Users') {
        return `Outliers Users Report - ${readableDateNow()}`
      }
      return `Report - ${readableDateNow()}`
    })

    const selectedActionItem = computed({
      get() {
        return reportStore.selectedActionItem
      },
      set(value) {
        reportStore.setSelectedItem(value)
      }
    })

    onMounted(() => {
      selectedActionItem.value = 'Dashboard'
      companyUsersStore.fetchCompanyInfo()
      analyticsStore.fetchCompanyStatsAction(true)
    })

    function monthIndexToStringFun(value) {
      if (value) {
        const splitValue = value.split('-')
        if (splitValue.length > 0) {
          const result = `${monthIndexToString(splitValue[1])}`
          return `${result}  ${splitValue[0]}`
        }
      }
      return ''
    }

    const download = (url, name) => {
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.click()
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
    }

    const selectedClose = () => {
      showDateRange.value = false
      // Assuming 'actionType' is a ref or reactive property
      actionType.value = 'consolidated'
    }

    const selectedCloseUser = () => {
      showDateRangeUser.value = false
    }

    const selectedCloseTeamUser = () => {
      showDateRangeTeamUser.value = false
    }

    const singleUserInfo = (event) => {
      userDetails.value = event
      selectedUsers.value = 'singleUser'
    }

    const thepdf = ref(null)

    const downloadCSVReport = () => {
      let rows
      if (selectedActionItem.value === 'Users') {
        rows = fetchCompanyUserStats.value.list
      } else if (selectedActionItem.value === 'Teams') {
        rows = fetchCompanyTeamUserStats.value.list
      } else if (selectedActionItem.value === 'Outliers Users') {
        rows = fetchCompanyUserStats.value.outliners
      }

      const rowKeys = Object.keys(rows[0])
      const cols = []
      for (const rowKey of rowKeys) {
        if (!rowKey.includes('_')) {
          cols.push({ name: rowKey, label: rowKey, field: rowKey, align: 'left' })
        }
      }

      const status = downloadCSV(cols, rows, filename.value)

      if (!status) {
        $q.notify({
          message: 'Error while exporting',
          color: 'negative',
          position: 'top',
          timeout: 2000
        })
      }
    }

    function downloadPDFReport() {
      html2pdf(thepdf.value, { filename: filename.value })
    }

    function actionItem(value) {
      monthlyCheck.value = false
      consolatedCheck.value = 'Overall'
      monthlyCheckTeam.value = false
      consolatedCheckTeam.value = 'Overall'
      teamSelect.value = null
      if (value === 'Dashboard') {
        analyticsStore.fetchCompanyStatsAction(true)
        selectedTeams.value = ''
      } else if (value === 'Users') {
        reportStore.fetchCompanyStatsReport({ select: 'overall' })
        selectedTeams.value = ''
        if (!(selectedUserActionItemGetter.value === 'Overall' && fetchCompanyUserStats.value.data.length > 0)) {
          reportStore.setUserActionSelectedItem('Overall')
          reportStore.fetchCompanyStatsReport({ select: 'overall' })
        }
        actionType.value = 'consolidated'
      } else if (value === 'Teams') {
        selectedTeams.value = 'allTeams'
        reportStore.setTeamUserActionSelectedItem('Overall')
      } else if (value === 'administrators') {
        selectedTeams.value = ''
      } else if (value === 'Outliers Users') {
        if (!(selectedUserActionItemGetter.value === 'Overall' && fetchCompanyUserStats.value.data.length > 0)) {
          reportStore.setUserActionSelectedItem('Overall')
          reportStore.fetchCompanyStatsReport({ select: 'overall' })
        }
        actionType.value = 'consolidated'
      }
    }

    function selectedDateRangeUser() {
      if (dateRangeInputUser.value) {
        showDateRangeUser.value = false
        reportStore.fetchCompanyStatsReport({ select: 'monthly', query: dateRangeInputUser.value })
        reportStore.setUserActionSelectedItem('Monthly')
      }
    }
    function selectedDateRangeTeamUser() {
      if (dateRangeInputTeamUser.value) {
        showDateRangeTeamUser.value = false
        reportStore.fetchTeamsUsersStats({ select: 'monthly', query: dateRangeInputTeamUser.value, team_id: teamDetails.value.id })
        reportStore.setTeamUserActionSelectedItem('Monthly')
      }
    }

    function singleTeamInfo(event) {
      teamDetails.value = { id: event.value, name: event.label }
      reportStore.fetchTeamsUsersStats({ team_id: event.value, select: 'overall' })
      selectedTeams.value = 'singleTeam'
      reportStore.fetchTeamStatsCountFun({ select: 'team', team_id: event.value })
    }

    function changeBreadcrumb(name) {
      selectedUsers.value = name
    }
    function singleUserTeam(event) {
      selectedTeams.value = 'singleUserTeam'
      userTeamDetails.value = event
    }

    function resetSelectTeam(event) {
      if (event) {
        if (event === 'Monthly' || event.label === 'Monthly') {
          showDateRangeTeamUser.value = true
          consolatedCheckTeam.value = false
          monthlyCheckTeam.value = 'Monthly'
        }
      }
    }

    function resetSelect(event) {
      if (event) {
        if (event === 'Monthly' || event.label === 'Monthly') {
          showDateRangeUser.value = true
          consolatedCheck.value = false
          monthlyCheck.value = 'Monthly'
        }
      }
    }

    function toggletoMonthlyUserReport(event) {
      if (event) {
        if (event === 'Monthly' || event.label === 'Monthly') {
          showDateRangeUser.value = true
          consolatedCheck.value = false
          monthlyCheck.value = 'Monthly'
          selectedOptionsUserReport.value = { label: 'Monthly', value: event }
        } else {
          reportStore.fetchCompanyStatsReport({ select: 'overall' })
          reportStore.setUserActionSelectedItem('Overall')
          consolatedCheck.value = 'Overall'
          selectedOptionsUserReport.value = { label: 'Consolidated', value: event }
          monthlyCheck.value = false
        }
      }
    }

    function toggletoMonthlyTeamUserReport(event) {
      if (event === 'Monthly' || event.label === 'Monthly') {
        if (selectedActionItemGetter.value === 'Users') {
          showDateRangeTeamUser.value = true
          consolatedCheckTeam.value = false
          monthlyCheckTeam.value = 'Monthly'
          selectedOptionsTeamReport.value = { label: 'Monthly', value: event }
        } else if (selectedActionItemGetter.value === 'Teams') {
          showDateRangeTeamUser.value = true
          consolatedCheckTeam.value = false
          monthlyCheckTeam.value = 'Monthly'
        }
      } else if (event === 'Overall' || event.label === 'Overall') {
        consolatedCheckTeam.value = 'Overall'
        monthlyCheckTeam.value = false
        reportStore.fetchTeamsUsersStats({
          select: 'overall',
          team_id: teamDetails.value.id
        })
        reportStore.setTeamUserActionSelectedItem('Overall')
        selectedOptionsTeamReport.value = { label: 'Consolidated', value: event }
      }
    }

    function singleTeamInfoFromList(event) {
      teamDetails.value = event
      reportStore.fetchTeamsUsersStats({ team_id: event.id, select: 'overall' })
      selectedTeams.value = 'singleTeam'
      reportStore.fetchTeamStatsCountFun({ select: 'team', team_id: event.id })
    }

    const statistics = computed(() => {
      return [
        {
          title: 'Total Users',
          count: getCompanyInfo.value.totalUsers || 0
        },
        {
          title: 'Users Registered',
          count: getCompanyInfo.value.activeUsers || 0
        },
        {
          title: 'Remaining Users',
          count: getCompanyInfo.value.remainingUsers || 0
        },
        {
          title: 'Subscription End Date',
          count: getCompanyInfo.value.endDate || 0
        }
      ]
    })

    const userStatistics = computed(() => {
      return [
        {
          title: 'Current Users',
          count: fetchCompanyUserStats.value?.currentUsers || 0
        },
        {
          title: 'Certificates Earned',
          count: fetchUserStatsCount.value.totalBadgesCount || 0
        },
        {
          title: 'Total Outliers',
          count: fetchCompanyUserStats.value?.outliners?.length || 0
        }
      ]
    })

    const teamStatistics = computed(() => {
      return [
        {
          title: 'Active Users',
          count: fetchCompanyTeamUserStats.value?.currentUsers || 0
        },
        {
          title: 'Certificates Earned',
          count: fetchCompanyTeamUserStats.value?.totalBadgesCount || 0
        },
        {
          title: 'Outliers',
          count: fetchCompanyTeamUserStats.value?.outliners?.length || 0
        }
      ]
    })
    return {
      thepdf,
      optionsScope,
      optionsUserReport,
      options,
      selectedOptionsUserReport,
      selectedOptionsTeamReport,
      actionType,
      color,
      selectedUsers,
      userDetails,
      userTeamDetails,
      teamDetails,
      selectedTeams,
      dateRangeInput,
      showDateRange,
      showDateRangeUser,
      showDateRangeTeamUser,
      dateRangeInputUser,
      dateRangeInputTeamUser,
      monthlyCheck,
      consolatedCheck,
      monthlyCheckTeam,
      consolatedCheckTeam,
      teamSelect,
      columns,
      loginStore,
      fetchUserInfo,
      getCompanyInfo,
      isLoading,
      downloadReportTeamUsersGetter,
      fetchTeamDataInfoReportMontlyGetter,
      fetchTeamDataInfoReportWeeklyGetter,
      fetchErrorMsgsReportTeamMonthlyWeekly,
      getCompanyTeamsOptions,
      teamPagination,
      isLoadingReport,
      selectedActionItemGetter,
      selectedTeamUserActionItemGetter,
      selectedUserActionItemGetter,
      fetchCompanyUserStats,
      fetchCompanyTeamUserStats,
      fetchTeamStatsCount,
      fetchUserStatsCount,
      //fetchErrorMsgsReportCompanyUserOverall,
      userSeriesData,
      companyTeamUserData,
      selectedActionItem,
      filename,
      readableDateNow: readableDateNow(),
      downloadCSVReport,
      downloadPDFReport,
      actionItem,
      selectedDateRangeUser,
      selectedDateRangeTeamUser,
      download,
      selectedClose,
      selectedCloseUser,
      selectedCloseTeamUser,
      singleUserInfo,
      singleTeamInfo,
      changeBreadcrumb,
      singleUserTeam,
      resetSelectTeam,
      resetSelect,
      toggletoMonthlyUserReport,
      toggletoMonthlyTeamUserReport,
      singleTeamInfoFromList,
      monthIndexToStringFun,
      statistics,
      userStatistics,
      teamStatistics,
      analyticsStore,
      reportStore,
      companyUserTeamsStore,
      companyUsersStore
    }
  }
}
</script>

<style scoped>
.overflow_scroll {
  height: 300px;
  overflow-y: scroll;
}
</style>
