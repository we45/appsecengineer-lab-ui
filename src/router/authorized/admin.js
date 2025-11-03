export default [
  {
    name: 'company.admins',
    path: 'admins',
    component: () => import('pages/company/AdminIndex.vue'),
    meta: {
      title: 'Administrators',
      icon: 'admin_panel_settings',
      breadCrumbs: [
        {
          name: 'company.admins',
          label: 'Administrators',
          icon: 'admin_panel_settings'
        }
      ]
    }
  }
]
