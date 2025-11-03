<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useSecurityChampions } from 'src/composables/useSecurityChampions'
import TeamChampionsTable from './TeamChampionsTable.vue'
import { useScreenSize } from 'src/composables/useScreenSize'

const $q = useQuasar()

const { championStats, isLoading } = useSecurityChampions()
const { isMobile } = useScreenSize()

const searchQuery = ref('')
const teamId = ref('')

const isMainTableLoading = computed(() => {
  return isLoading.value && !teamId.value
})

const columns = [
  {
    name: 'teamName',
    label: 'Name',
    field: 'team_name',
    align: 'left',
    classes: 'avenir-bold'
  },
  {
    name: 'members',
    label: 'Total members',
    field: 'members_count',
    align: 'center',
    format: (v) => `${v ?? 0}`,
    classes: 'avenir-bold'
  },
  {
    name: 'champions',
    label: 'Total champions',
    field: 'champions',
    align: 'center',
    format: (v) => `${v?.length ?? 0}`,
    classes: 'avenir-bold'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'champions',
    align: 'center',
    format: (v) => `${v?.length ? 'Active' : 'Needed'}`
  },
  {
    name: 'details',
    label: 'DETAILS',
    field: '',
    align: 'center'
  }
]

const teams = computed(() => {
  return (
    championStats.value?.teams?.filter?.((team) => {
      if (!searchQuery.value?.length) return true
      return team.team_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    }) ?? []
  )
})

function enableTeamInfo(event) {
  teamId.value = event.row.sk
}
</script>

<template>
  <AseCard class="q-mt-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="column">
        <div class="avenir-bold">Team Champions Assignment</div>
      </div>
      <div :style="{ width: isMobile ? '100%' : '280px' }" :class="[{ 'q-mt-md': isMobile }]">
        <AseInput
          v-model="searchQuery"
          clearable
          fillVariant="outlined"
          heightVariant="short"
          placeholder="Search teams"
          :debounce="500"
          :disable="isLoading"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </AseInput>
      </div>
    </div>
    <AseTable
      :isLoading="isMainTableLoading"
      :rows="teams"
      :columns="columns"
      :hide-bottom="Boolean(teams.length)"
      emptyLabel="No teams"
      row-key="sk"
      :style="{
        maxHeight: '60vh'
      }"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr
          :props="props"
          :class="{
            'bg-light-grey': props.expand && !$q.dark.isActive,
            'bg-dark-2': $q.dark.isActive && props.expand
          }"
        >
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'details'">
              <div
                class="cursor-pointer"
                :class="[$q.dark.isActive ? 'text-secondary' : 'text-electric-indigo']"
                style="user-select: none"
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
                  :class="{
                    'text-electric-indigo': !$q.dark.isActive
                  }"
                  size="sm"
                />
              </div>
            </template>

            <template v-else-if="col.name === 'status'">
              <div class="cursor_pointer">
                <q-chip class="status-chip avenir-bold text-center" :class="[col.value === 'Active' ? 'active' : 'inactive']">
                  {{ col.value }}
                </q-chip>
              </div>
            </template>

            <template v-else>
              {{ col.value ?? '--' }}
            </template>
          </q-td>
        </q-tr>

        <q-tr v-if="props.expand" :props="props">
          <q-td colspan="100%" class="q-pa-none" style="background-color: var(--color-bg-page)">
            <TeamChampionsTable :team="props.row" />
          </q-td>
        </q-tr>
      </template>
    </AseTable>
  </AseCard>
</template>

<style lang="scss" scoped>
.action_btn {
  height: 26px;
  width: 26px;
  clip-path: circle();
}
</style>

<style lang="scss">
.status-chip {
  background: none !important;

  &.active {
    color: $secondary !important;
  }
  &.inactive {
    color: $error !important;
  }
}
</style>
