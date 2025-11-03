/* eslint-disable no-void */
/* eslint-disable indent */
import { route } from 'quasar/wrappers'
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import { useBreadcrumbsStore } from 'src/store/pinia/breadCrumb'

import routes from './routes'

// Vue.filter('decode', function (value) {
//   return atob(value)
// })

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = import.meta.env?.SERVER ? createMemoryHistory : createWebHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  Router.beforeEach((to, from, next) => {
    const breadCrumbStore = useBreadcrumbsStore()
    breadCrumbStore.breadCrumb = []
    next()
  })
  return Router
})
