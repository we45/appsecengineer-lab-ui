import VueVirtualScroller from 'vue-virtual-scroller'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(VueVirtualScroller)
})
