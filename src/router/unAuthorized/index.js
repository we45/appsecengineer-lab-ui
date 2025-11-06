import MainLayout from 'layouts/MainLayout.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: MainLayout,

    children: [
      {
        name: 'runningLabs',
        path: 'token',
        component: () => import('pages/course_info/LabPageIndexBeta.vue'),
        meta: {
          title: 'Lab Info',
          icon: 'science'
        }
      }
    ]
  }
]
