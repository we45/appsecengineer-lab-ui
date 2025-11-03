import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { useProfileStore } from 'src/store/pinia/profile'
import { useNotificationStore } from 'src/store/pinia/notifications'
import { useQuasar } from 'quasar'
import { clearClearFeed } from 'src/utils/clearfeed.js'

export function useNavigationItems() {
  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()

  const loginStore = useLoginStore()
  const profileStore = useProfileStore()
  const notificationStore = useNotificationStore()

  // Computed properties
  const unreadNotification = computed(() => notificationStore.unreadCountNotifications)
  const isDark = computed(() => $q.dark.isActive)
  const showLearningJourney = computed(() => {
    return loginStore.isSecurityChampion
  })

  // Sidebar items
  const sidebarItems = computed(() => {
    const baseItems = [
      {
        name: 'dashboard',
        label: 'Dashboard',
        icon: 'app:dashboard',
        route: 'dashboard',
        img: 'Dashboard'
      },
      {
        name: 'courses',
        label: 'Courses',
        icon: 'app:course',
        route: 'courses',
        img: 'Courses'
      },
      {
        name: 'journeys',
        label: 'Journeys',
        icon: 'book',
        route: 'journeys',
        img: 'Journeys'
      },
      {
        name: 'challenges',
        label: 'Challenges',
        icon: 'app:challenge',
        route: 'challenges',
        img: 'Challenges'
      },
      {
        name: 'assessments',
        label: 'My Assignments',
        icon: 'book',
        route: 'assignments',
        img: 'MyAssignments'
      },

      {
        name: 'running_labs',
        label: 'Running Labs',
        icon: 'app:running-lab',
        route: 'runninglabs',
        img: 'RunningLabs'
      }
    ]

    // Add learning journey only for security champions
    if (showLearningJourney.value) {
      baseItems.push({
        name: 'security-champions',
        label: 'Security Champions',
        route: 'security-champions',
        icon: 'app:assignments',
        img: 'SecurityChampions'
      })
    }

    return baseItems
  })

  const adminItems = computed(() => {
    let items = [
      {
        name: 'company_usersops',
        label: 'Users',
        route: 'company.users_ops',
        icon: 'app:users',
        img: 'Users'
      },
      {
        name: 'company_teams',
        label: 'Teams',
        route: 'company.teamsops',
        icon: 'app:teams',
        img: 'Teams'
      },
      {
        name: 'custom-challenge',
        label: 'Build your challenge',
        icon: 'img:/icons/sidebar_aiquiz.svg',
        route: 'custom-challenge',
        img: 'OwnChallenge'
      },
      {
        name: 'creator-studio',
        label: 'Creator Studio',
        route: 'company.creator_studio',
        img: 'Reports',
        beta: true,
        betaMessage: 'This is a beta feature.'
      },
      {
        name: 'company_reports',
        label: 'Reports',
        route: 'company.reports',
        icon: 'app:reports',
        img: 'Reports'
      },
      {
        name: 'company.tournaments',
        label: 'Tournaments',
        route: 'company.tournaments',
        icon: 'app:tests',
        img: 'Interviews'
      },
      {
        name: 'company.interviews',
        label: 'Interviews',
        route: 'company.interviews',
        icon: 'app:tests',
        img: 'Interview'
      },
      {
        name: 'company.course_assignments.course',
        label: 'Course Assignments',
        route: 'company.course_assignments.course',
        icon: 'app:assignments',
        img: 'CourseAssignments'
      },
      {
        name: 'company.security-champions',
        label: 'Security Champions',
        route: 'company.security-champions',
        icon: 'app:assignments',
        img: 'SecurityChampions'
      },
      {
        name: 'administrator',
        label: 'Administrators',
        route: 'company.admins',
        icon: 'app:administrators',
        img: 'Administrators'
      },
      {
        name: 'company-settings',
        label: 'Organization',
        route: 'company.settings',
        icon: 'app:about',
        img: 'About'
      },
      {
        name: 'lti-integration',
        label: 'Integrations',
        route: 'lti-integration',
        img: 'Integrations'
      }
    ]

    if (loginStore.isCompanyManager && !loginStore.isCompanyAdmin) {
      items = [
        {
          name: 'company_teams',
          label: 'Team Management',
          route: 'company.teamsops',
          icon: 'app:teams',
          img: 'Teams'
        }
      ]
    }

    return items
  })

  const fullViewSidebarItems = computed(() => {
    const items = sidebarItems.value
    if (loginStore.isCompanyAdmin) {
      return [...items, { name: 'admin' }]
    } else if (loginStore.isCompanyManager) {
      return [...items, { name: 'manager' }]
    } else {
      return items
    }
  })

  const miniSidebarItems = computed(() => {
    return !loginStore.isCompanyAdmin ? sidebarItems.value : [...sidebarItems.value, ...adminItems.value]
  })

  // Functions
  function logout() {
    clearClearFeed()

    localStorage.clear()
    LocalStorage.remove('startTime')
    LocalStorage.remove('expTime')
    LocalStorage.remove('isOwasp')
    LocalStorage.remove('token')
    LocalStorage.remove('rtoken')
    LocalStorage.remove('user')
    LocalStorage.remove('provisionInfo')
    LocalStorage.remove('is_admin')
    LocalStorage.remove('trial')
    LocalStorage.remove('EXPIRED_TIME')
    LocalStorage.remove('userId')
    LocalStorage.remove('sub_')
    router.push({
      path: '/',
      query: {
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }

  async function subscriptionPage() {
    await profileStore.fetchUserBillingInfo()
    if (profileStore?.paymentSubscriptionInfo?.user_info?.profile_url) {
      const url = profileStore.paymentSubscriptionInfo.user_info.profile_url
      window.open(url, '_blank')
    }
  }

  function toggleDarkMode() {
    $q.dark.toggle()
    LocalStorage.set('darkMode', $q.dark.mode)
  }

  function handleRedirectToKB() {
    window.open('https://support.appsecengineer.com/portal/en/kb/appsecengineer', '_blank')
  }

  function handleWriteReview() {
    // This will be handled by the parent component that has access to the review modal
    // We'll emit an event or use a callback
  }

  // Function to get dropdown items
  function getDropdownItems(isMobile, onWriteReview = null) {
    // Add navbar items to dropdown when on mobile (excluding dark mode)

    const logoutItem = {
      id: 'logout',
      label: 'Logout',
      icon: 'logout',
      to: null,
      action: logout,
      ariaLabel: 'Logout',
      show: true
    }

    return [logoutItem]
  }

  // Function to get navbar items (including dark mode toggle)
  function getNavbarItems() {
    return [
      {
        id: 'dark-mode',
        color: isDark.value ? 'white' : 'secondary',
        clickable: false,
        action: toggleDarkMode,
        tooltip: 'Change mode',
        iconSrc: `/newIcons/${isDark.value ? 'Light' : 'Dark'}Mode.png`,
        ariaLabel: 'Change Theme'
      }
    ]
  }

  return {
    // Computed properties
    unreadNotification,
    isDark,

    // Sidebar items
    sidebarItems,
    adminItems,
    fullViewSidebarItems,
    miniSidebarItems,

    // Functions
    logout,
    subscriptionPage,
    toggleDarkMode,
    handleRedirectToKB,
    handleWriteReview,

    // Navigation functions
    getDropdownItems,
    getNavbarItems
  }
}
