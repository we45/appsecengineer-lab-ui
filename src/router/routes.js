import MainLayout from 'src/layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    name: '',
    component: MainLayout,
    redirect: {
      name: 'running-lab'
    },
    children: [
      {
        name: 'running-lab',
        path: 'token',
        component: () => import('src/pages/RunningLab/RunningLabIndex.vue'),
        meta: {
          title: 'Lab Info',
          icon: 'science'
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404Index.vue'),
    name: 'Error404',
    meta: { title: 'Not found' }
  }
]
export default routes
