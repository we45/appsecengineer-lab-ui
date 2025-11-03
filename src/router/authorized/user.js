export default [
  {
    name: 'company.users_ops',
    path: 'company-users',
    component: () => import('pages/company/users/UserIndex.vue'),
    redirect: {
      name: 'company.users_main'
    },
    children: [
      {
        name: 'company.users_main',
        path: '',
        component: () => import('pages/company/users/UserMain.vue'),
        meta: {
          title: 'Users',
          icon: 'people',
          breadCrumbs: [
            {
              name: 'company.users_ops',
              label: 'Users',
              icon: 'people'
            }
          ]
        }
      }
    ]
  }
]
