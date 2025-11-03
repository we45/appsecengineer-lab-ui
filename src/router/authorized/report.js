export default [
  {
    name: 'company.report',
    path: 'report',
    component: () => import('pages/reports/ReportIndex.vue'),
    redirect: {
      name: 'company.reports_main'
    },
    meta: {
      title: 'Company Report',
      icon: 'fas fa-building',
      breadCrumbs: [
        {
          name: 'company.report',
          label: 'Reports',
          icon: 'fas fa-building'
        }
      ]
    },
    children: [
      {
        name: 'company.reports_main',
        path: '',
        component: () => import('pages/reports/index.vue')
      }
    ]
  }
]
