import authorized from './authorized'
const routes = [
  ...authorized,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404Index.vue'),
    name: 'Error404',
    meta: { title: 'Not found' }
  }
]
export default routes
