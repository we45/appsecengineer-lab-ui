<template>
  <div>
    <div class="text-h6 ase-lg portal_bold" v-if="title">
      {{ title }}
    </div>
    <q-separator v-if="title" />
    <div class="row">
      <div
        :class="`q-pa-xs col-xs-${!downloadReport ? 12 : 9} col-sm-${!downloadReport ? 12 : 9} col-md-${!downloadReport ? 12 : 9} col-lg-${
          !downloadReport ? 12 : 9
        }`"
      >
        <template v-if="newFormat">
          <template v-if="showCreate">
            <q-btn round color="primary" icon="add" @click="createPage()" />
            <label class="portal_bold padding_7">
              <sub>({{ newFormatLabel }})</sub>
            </label>
          </template>
          <template v-if="multipleCreate">
            <q-btn-dropdown color="primary" size="sm" label="Create">
              <q-list>
                <q-item clickable v-close-popup @click="createPage()">
                  <q-item-section>
                    <q-item-label>Create user</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="showPopWindow()">
                  <q-item-section>
                    <q-item-label>Import</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </template>
        <template v-else>
          <q-btn round color="primary" icon="add" @click="createPage()" v-if="showCreate" />
        </template>
        <q-input
          dense
          v-if="showSearch"
          outlined
          v-on:keyup.enter="searchData"
          input-class="text-right"
          class="q-ml-md float-right"
          v-model="searchModal"
        >
          <template v-slot:append>
            <q-icon v-if="search.length > 0" name="clear" class="cursor-pointer" @click="clearSearchData" />
            <q-icon style="cursor: pointer" :disabled="search.length === 0" name="search" color="primary" @click="searchData" />
          </template>
        </q-input>
      </div>
      <div v-if="downloadReport" class="q-pa-xs col-xs-3 col-sm-3 col-md-3 col-lg-3" align="right">
        <div v-if="downloadReport">
          <template v-if="!downloadReport">
            <q-btn round color="primary" icon="file_download" @click="downloadReportXLS()" />
          </template>
          <template v-else>
            <slot name="report"></slot>
          </template>
        </div>
      </div>
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
  emits: ['update:modelValue'],
  props: {
    title: {
      type: String,
      required: false,
      default: 'Header'
    },
    search: {
      type: String
    },
    isTable: {
      type: Boolean,
      default: false
    },
    showCreate: {
      type: Boolean,
      default: true,
      required: false
    },
    showSearch: {
      type: Boolean,
      default: true,
      required: false
    },
    multipleCreate: {
      type: Boolean,
      default: false,
      required: false
    },
    newFormat: {
      type: Boolean,
      default: false,
      required: false
    },
    downloadReport: {
      type: Boolean,
      default: false,
      required: false
    },
    newFormatLabel: {
      type: String,
      required: false,
      default: 'Add'
    },
    modelValue: {
      type: String,
      required: true,
      default: ''
    }
  },
  methods: {
    createPage() {
      this.$emit('createPage', { show: true })
    },
    downloadReportXLS() {
      this.$emit('downloadReportXLS', { show: true })
    },
    searchData() {
      this.$emit('searchData')
    },
    clearSearchData() {
      this.$emit('clearSearchData')
    },
    showPopWindow() {
      this.$emit('showPopWindow', { show: true })
    }
  },
  computed: {
    searchModal: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
