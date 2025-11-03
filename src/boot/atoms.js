import PageTitle from 'src/components/atoms/PageTitle.vue'
import IdealForChip from 'src/components/atoms/IdealForChip.vue'
import ChipTab from 'src/components/atoms/ChipTab.vue'

export default async function ({ app }) {
  app.component('PageTitle', PageTitle)
  app.component('IdealForChip', IdealForChip)
  app.component('ChipTab', ChipTab)
}
