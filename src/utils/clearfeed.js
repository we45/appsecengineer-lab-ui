import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import config from 'src/config'
/**
 * Generate HMAC hash for ClearFeed authentication
 * @param {string} email - User email
 * @param {string} clientSecret - ClearFeed client secret
 * @returns {string} HMAC hash
 */

/**
 * Fetch HMAC hash from server for authenticated user
 * @param {string} email - User email
 * @returns {Promise<string|null>} HMAC hash or null if failed
 */
async function fetchUserHash(email) {
  try {
    const response = await api.get('chat/user-hash', {
      params: { email }
    })

    console.log('response', response)

    if (response.data.success && response.data.data.hash) {
      return response.data.data.hash
    }

    console.warn('Failed to get user hash from server')
    return null
  } catch (error) {
    console.error('Error fetching user hash:', error)
    return null
  }
}

/**
 * Clear ClearFeed user data (proper method according to docs)
 */
export function clearClearFeed() {
  console.log('Clearing ClearFeed user data...')

  try {
    if (window.ClearFeed && typeof window.ClearFeed === 'function') {
      // Use the proper ClearFeed method to clear user data
      window.ClearFeed('clearUser')
      console.log('ClearFeed user data cleared')
    } else {
      console.log('ClearFeed not available for clearing')
    }
  } catch (error) {
    console.error('Error clearing ClearFeed user data:', error)
  }
}

/**
 * Initialize ClearFeed chat widget
 */
export async function initializeClearFeed() {
  console.log('initializeClearFeed')

  // Check if ClearFeed is available
  if (typeof window.ClearFeed === 'undefined') {
    console.warn('ClearFeed script not loaded')
    return
  }

  console.log('ClearFeed script is loaded')

  // Get user data from localStorage
  const user = LocalStorage.getItem('user')

  // ClearFeed client configuration
  const clearFeedConfig = {
    client_id: config.clearFeedClientId,
    // Prevent automatic authentication
    autoLogin: false,
    disableAutoAuth: true,
    // Disable automatic user detection
    skipAutoAuth: true
  }
  console.log('user from localStorage:', user)
  console.log('user.email:', user?.email)
  console.log('user.firstName:', user?.firstName)
  console.log('user.lastName:', user?.lastName)

  // Initialize the widget
  try {
    // Check if ClearFeed is already initialized and destroy it first
    if (window.ClearFeed && typeof window.ClearFeed === 'function') {
      try {
        window.ClearFeed('destroy')
      } catch (e) {
        // Ignore errors if not initialized
      }
    }

    // If user is authenticated, fetch hash FIRST before initializing ClearFeed
    if (user && user.email) {
      console.log('User is authenticated, fetching hash before initializing ClearFeed...')

      // Fetch HMAC hash from server FIRST
      const hash = await fetchUserHash(user.email)
      console.log('hash from server:', hash)

      // Construct user data with hash
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      const userData = {
        name: userName,
        email: user.email,
        hash: hash ?? undefined
      }

      console.log('User data with hash:', userData)

      // Add user data to config
      clearFeedConfig.user = userData
    }

    console.log('config:', clearFeedConfig)

    // Initialize ClearFeed with complete user data (including hash)
    setTimeout(() => {
      window.ClearFeed('init', clearFeedConfig)
      console.log('ClearFeed chat widget initialized', user ? 'with user data and hash' : 'as anonymous')
    }, 100)
  } catch (error) {
    console.error('Failed to initialize ClearFeed:', error)
  }
}
