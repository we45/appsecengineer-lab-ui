import { computed } from 'vue'
import { LocalStorage } from 'quasar'
import { useQuasar } from 'quasar'

export function useNavigationItems() {
  const $q = useQuasar()

  // Computed properties
  const isDark = computed(() => $q.dark.isActive)

  // Functions

  function toggleDarkMode() {
    $q.dark.toggle()
    LocalStorage.set('darkMode', $q.dark.mode)
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
    isDark,

    // Functions
    toggleDarkMode,

    // Navigation functions
    getNavbarItems
  }
}
