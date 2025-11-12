import AseCard from 'components/ase/AseCard.vue'
import AseTabs from 'src/components/ase/AseTabs.vue'
import AseTabPanels from 'src/components/ase/AseTabPanels.vue'
import AseButton from 'src/components/ase/AseButton.vue'
import AseDialog from 'src/components/ase/AseDialog.vue'
import AseMarkdownPreviewer from 'src/components/ase/AseMarkdownPreviewer.vue'
import AseLinearProgress from 'src/components/ase/AseLinearProgress.vue'
import AseSeparator from 'src/components/ase/AseSeparator.vue'

export default async function ({ app }) {
  app.component('AseButton', AseButton)
  app.component('AseCard', AseCard)
  app.component('AseDialog', AseDialog)
  app.component('AseLinearProgress', AseLinearProgress)
  app.component('AseMarkdownPreviewer', AseMarkdownPreviewer)
  app.component('AseSeparator', AseSeparator)
  app.component('AseTabPanels', AseTabPanels)
  app.component('AseTabs', AseTabs)
}
