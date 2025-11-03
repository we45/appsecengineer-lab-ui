export default [
  {
    name: 'assignments',
    path: 'assignments',
    component: () => import('pages/assessments/AssessmentIndex.vue'),
    redirect: {
      name: 'assignments.index'
    },
    children: [
      {
        name: 'assignments.index',
        path: '',
        component: () => import('pages/assessments/AsssessmentList.vue'),
        meta: {
          title: 'My Assignments',
          breadCrumbs: [
            {
              name: 'assignments.index',
              label: 'My Assignments',
              icon: 'library_books'
            }
          ]
        }
      }
    ]
  }
]
