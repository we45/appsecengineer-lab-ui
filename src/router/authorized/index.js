import MainLayout from 'layouts/MainLayout.vue'

export default [
  {
    path: '/portal',
    name: 'portal',
    component: MainLayout,

    children: [
      {
        name: 'courseInfo.lab',
        path: 'course-info/lab/:courseId/:subjectId/:id',
        component: () => import('pages/course_info/LabPageIndex.vue'),
        meta: {
          title: 'Course Lab',
          icon: 'science'
        }
      }
    ]
  },
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
