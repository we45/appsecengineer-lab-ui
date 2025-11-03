import { boot } from 'quasar/wrappers'
import VueRecaptcha from 'vue3-recaptcha-v2'

export default boot(({ app }) => {
  app.use(VueRecaptcha, {
    siteKey: '6Lfco0YaAAAAAGTfwGSk2HS3WYw_UFxfZ7tKCLZM'
  })
})
