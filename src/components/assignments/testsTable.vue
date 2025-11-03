<template>
  <BaseTable
    class="ase-sm ase-sm-bold q-table th.sortable sticky-header-table"
    :columns="columns"
    no-data-label="No assignments to display."
    row-key="index"
    :rows="assignmentStore.challengeAssignmentList.filter((data) => data.status_assignment === filterData)"
    :rows-per-page-options="[0]"
    style="max-height: 70vh"
    table-header-class="ase-sm ase-sm-bold portal_bold"
    :table-header-style="{ backgroundColor: '#FFF', color: '#11142D', 'font-weight': 'bold', 'font-size': '18px' }"
    virtual-scroll
  >
    <template v-slot:body-cell-Name="props">
      <q-td :props="props">
        <q-item clickable style="max-width: 420px" @click="actionItemAssignment(props.row)">
          <q-item-section>
            <q-item-label>
              <p class="text-caption text-weight-bold ase-roboto ase-black-light cursor_pointer line-height-normal">
                {{ props.row.name }}
                <q-badge color="primary" style="font-size: 10px">{{ props.row.type }}</q-badge>
              </p>
              <q-tooltip>{{ props.row.name }}</q-tooltip>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-td>
    </template>
    <template v-slot:body-cell-start_date="props">
      <q-td :props="props">
        <q-icon name="event" class="ase-black-light" style="display: inline-block; font-size: 14px" />
        <p style="display: inline-block" class="text-caption text-weight-bold ase-roboto ase-black-light">
          {{ statusDateFormatter(props.row.start_date) }}
        </p>
      </q-td>
    </template>
    <template v-slot:body-cell-end_date="props">
      <q-td :props="props">
        <q-icon name="event" class="ase-black-light" style="display: inline-block; font-size: 14px" />
        <p style="display: inline-block" class="text-caption text-weight-bold ase-roboto ase-black-light">
          {{ statusDateFormatter(props.row.end_date) }}
        </p>
      </q-td>
    </template>
    <template v-slot:body-cell-status_assignment="props">
      <q-td :props="props">
        <q-chip
          class="text-weight-bold ase-roboto ase-white"
          :color="props.row.status_assignment !== 'Expired' ? 'green' : 'red'"
          :label="props.row.status_assignment === 'Expired' ? `EXPIRED` : `ACTIVE`"
          size="sm"
          text-color="white"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-Action="props">
      <q-td :props="props">
        <q-btn
          color="primary"
          icon="edit"
          round
          size="sm"
          style="margin-right: 2%"
          @click="updatePage(props.row.id, props.row, props.row.type)"
        >
          <q-tooltip>Update</q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="delete" size="sm" @click="deletePage(props.row.id, props.row.name, props.row.type)">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
      </q-td>
    </template>
    <template v-slot:no-data>
      <div class="noDataView">
        <div class="absolute-full flex flex-center">
          <div>
            <q-icon style="font-size: 102px; color: #9b9b9b" name="receipt_long" />
            <p class="text-h4 ase-roboto ase-black-light">No Assignments</p>
          </div>
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script>
import { dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

import { useAssignmentStore } from 'src/store/pinia/assignment'

export default {
  name: 'CTFTableTests',
  components: {},
  props: ['filterData'],
  setup() {
    const assignmentStore = useAssignmentStore()
    return {
      assignmentStore
    }
  },
  data() {
    return {
      optionsFilter: [
        { id: 'Expired', label: 'EXPIRED' },
        { id: 'Valid', label: 'ACTIVE' }
      ],
      search: '',
      currentPage: 1,
      pagination: { sortBy: 'desc', descending: false, page: 1, rowsPerPage: 8 },
      columns: [
        { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
        { name: 'start_date', label: 'Start date', field: 'start_date', sortable: true, align: 'center' },
        { name: 'end_date', label: 'End date', field: 'end_date', sortable: true, align: 'center' },
        { name: 'status_assignment', label: 'Status', field: 'status_assignment', sortable: true, align: 'center' },
        { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
      ]
    }
  },
  methods: {
    createPage(event) {
      if (event.show) {
        this.$emit('createPage', { show: true })
      }
    },
    updatePage(id, row, type) {
      this.assignmentStore.updateTestsAssignmentInfo(row)
      this.$emit('updatePage', { show: true, id: id, type: type })
    },
    updateDateFormatter(date) {
      return dateFormatReadable(date)
    },
    statusDateFormatter(date) {
      return dateFormatReadable(date)
    },
    sendCertificate(id) {
      this.$emit('sendCertificate', { show: true, id: id })
    },
    async actionItemAssignment(value) {
      await this.$router.push(`/portal/company/test/${urlSafeBase64Encode(value.id)}}`)
    },
    deletePage(id, name, type) {
      this.$emit('deletePage', { show: true, id: id, name: name, type: type })
    },
    loadMoreAssignments(pagination) {}
  }
}
</script>
<style lang="sass">
.noDataView
  width: 100%
  height: 50vh
  display: table-cell
  vertical-align: middle
  text-align: center
.capitalize-info
  text-transform: uppercase
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
