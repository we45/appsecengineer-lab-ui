import AseCard from 'components/ase/AseCard.vue'
import AseSelect from 'components/ase/AseSelect.vue'
import AseMultiSelect from 'components/ase/AseMultiSelect.vue'
import AseChartVisualizer from 'src/components/ase/AseChartVisualizer.vue'
import AseBarLineChart from 'src/components/ase/AseBarLineChart.vue'
import AseRadarChart from 'src/components/ase/AseRadarChart.vue'
import AseTable from 'src/components/ase/AseTable.vue'
import AseTabs from 'src/components/ase/AseTabs.vue'
import AseTabPanels from 'src/components/ase/AseTabPanels.vue'
import AseSankyChart from 'src/components/ase/AseSankyChart.vue'
import AseInput from 'src/components/ase/AseInput.vue'
import AseButton from 'src/components/ase/AseButton.vue'
import AseCheckbox from 'src/components/ase/AseCheckbox.vue'
import AseOptionGroup from 'src/components/ase/AseOptionGroup.vue'
import AseDatePicker from 'src/components/ase/AseDatePicker.vue'
import AseQSelect from 'src/components/ase/AseQSelect.vue'
import AseDialog from 'src/components/ase/AseDialog.vue'
import AseExpansionItem from 'src/components/ase/AseExpansionItem.vue'
import AseStepper from 'src/components/ase/AseStepper.vue'
import AseMarkdownPreviewer from 'src/components/ase/AseMarkdownPreviewer.vue'
import AseSeparator from 'src/components/ase/AseSeparator.vue'
import AseLinearProgress from 'src/components/ase/AseLinearProgress.vue'

export default async function ({ app }) {
  app.component('AseCard', AseCard)
  app.component('AseSelect', AseSelect)
  app.component('AseMultiSelect', AseMultiSelect)
  app.component('AseChartVisualizer', AseChartVisualizer)
  app.component('AseBarLineChart', AseBarLineChart)
  app.component('AseRadarChart', AseRadarChart)
  app.component('AseTable', AseTable)
  app.component('AseTabs', AseTabs)
  app.component('AseTabPanels', AseTabPanels)
  app.component('AseSankyChart', AseSankyChart)
  app.component('AseInput', AseInput)
  app.component('AseButton', AseButton)
  app.component('AseCheckbox', AseCheckbox)
  app.component('AseOptionGroup', AseOptionGroup)
  app.component('AseDatePicker', AseDatePicker)
  app.component('AseQSelect', AseQSelect)
  app.component('AseDialog', AseDialog)
  app.component('AseExpansionItem', AseExpansionItem)
  app.component('AseStepper', AseStepper)
  app.component('AseMarkdownPreviewer', AseMarkdownPreviewer)
  app.component('AseSeparator', AseSeparator)
  app.component('AseLinearProgress', AseLinearProgress)
}
