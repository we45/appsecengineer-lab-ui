import Login from 'pages/login/Index.vue'

export default [
  {
    name: 'login',
    path: '',
    alias: '/login',
    meta: { title: 'Login' },
    component: Login
  },

  {
    name: 'maintenance',
    path: '/maintenance',
    meta: { title: 'maintenance' },
    component: () => import('pages/maintenance/index.vue')
  },
  {
    name: 'upgrade',
    path: '/upgrade',
    meta: { title: 'Upgrade', icon: 'upgrade' },
    component: () => import('pages/subscriptions/index.vue')
  },
  {
    name: 'auth',
    path: '/auth',
    meta: { title: 'Verify' },
    component: () => import('pages/login/verificationLink.vue')
  },
  {
    name: 'oauth',
    path: '/oauth',
    meta: { title: 'Oauth' },
    component: () => import('pages/oAuth/msOauth.vue')
  },
  {
    name: 'microsoft_not_configured',
    path: '/microsoft/notconfigured',
    meta: { title: 'Not Configured' },
    component: () => import('pages/oAuth/notConfigured.vue')
  },
  {
    nane: 'confirmUser',
    path: '/confirm-user',
    meta: { title: 'Confirm User' },
    component: () => import('pages/confirm_user/ConfirmUserIndex.vue')
  },
  {
    nane: 'confirmCodes',
    path: '/confirm-codes',
    meta: { title: 'Confirm Code' },
    component: () => import('pages/confirm_user/ConfirmCodes.vue')
  },
  {
    name: 'confirmLink',
    path: '/confirm-link',
    meta: { title: 'Confirm User' },
    component: () => import('pages/confirm_user/ConfirmUserCodesLink.vue')
  },
  {
    name: 'confirmLinkPartner',
    path: '/confirm-link-partner',
    meta: { title: 'Confirm User' },
    component: () => import('pages/confirm_user/ConfirmOWASPLink.vue')
  },
  {
    name: 'confirmLinkCode',
    path: '/confirm-link-code',
    meta: { title: 'Confirm User Code' },
    component: () => import('pages/confirm_user/ConfirmSameUsers.vue')
  },
  {
    name: 'singup.company',
    path: '/signup/:id',
    meta: { title: 'Signup' },
    component: () => import('pages/signup/CompanySignUpIndex.vue')
  },
  {
    name: 'singup.partner',
    path: '/signup/partner/:id/:name',
    meta: { title: 'Signup Partner' },
    component: () => import('pages/signup/OWASPSignUpIndex.vue')
  },
  {
    name: 'signup.training',
    path: '/signup/training/:id/:name',
    meta: { title: 'Signup Training', icon: 'cast_for_education' },
    component: () => import('pages/signup/TrainingSignUpIndex.vue')
  },
  {
    name: 'subscriptionExpired',
    path: '/subscription-expired',
    meta: { title: 'subscription expired', icon: 'card_membership' },
    component: () => import('pages/subscription/SubscriptionEndMessage.vue')
  },
  {
    path: '/profile/:id',
    name: 'public.profile',
    component: () => import('pages/unauthorized/profile/Profile.vue')
  },
  {
    path: '/hall-of-fame',
    name: 'public.hallOfFame',
    meta: { title: 'Hall Of Fame' },
    component: () => import('pages/unauthorized/hall_of_fame/HallOfFame.vue')
  },
  {
    path: '/callback',
    name: 'google.callback',
    component: () => import('pages/unauthorized/CallBack.vue')
  },
  {
    name: 'Labs',
    path: '/labs/:ltik?',
    component: () => import('pages/public_labs/PublicLabsPage.vue')
  },
  {
    name: 'labDetail',
    path: '/labs/details/:lab_id/:ltik?',
    component: () => import('pages/public_labs/PublicLabDetails.vue')
  },
  {
    name: 'integration',
    path: '/integration/:ltik?',
    component: () => import('pages/unauthorized/lti_integration/index.vue')
  },
  {
    name: 'integration-courses-details',
    path: '/integration/courses-details/:ltik?',
    component: () => import('pages/unauthorized/CourseDetails.vue')
  },
  {
    name: 'integration-video-play',
    path: '/integration/video-play',
    component: () => import('pages/public_videos/VideoPlay.vue')
  }
]
