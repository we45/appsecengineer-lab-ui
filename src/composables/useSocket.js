import jwt_decode from 'jwt-decode'
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { useLoginStore } from 'src/store/pinia/login'
import { useNotificationStore } from 'src/store/pinia/notifications'
import config from 'src/config'

export function useSocket() {
  const notificationStore = useNotificationStore()

  const loginStore = useLoginStore()
  //socket connection

  const connected = ref(false)

  let socket

  const onMessage = (event) => {
    console.log('WebSocket message received:', event.data)
    renderMessage(event.data)
  }

  function renderMessage(data) {
    try {
      const parseData = JSON.parse(data)
      console.log('Parsed WebSocket message:', parseData)
      Notify.create({ type: 'positive', position: 'top-right', progress: true, message: parseData?.notificationContent?.content })
      notificationStore.unreadCountNotifications++
    } catch (e) {
      console.warn('Error parsing WebSocket message:', e)
    }
  }

  const onOpen = (event) => {
    connected.value = true
    console.log('WebSocket connection established successfully')
  }

  const onError = (event) => {
    console.error('WebSocket error occurred:', event)
  }

  const onClose = (event) => {
    console.log('WebSocket connection closed:', event.code, event.reason)
    connected.value = false
  }

  onMounted(() => {
    bootSocket()
  })

  function bootSocket() {
    if (!loginStore?.fetchUserInfo?.email) {
      console.warn('Cannot initialize WebSocket - user email not found')
      return
    }

    // Fetch the email address
    const email = loginStore?.fetchUserInfo?.email

    // Encode the email address
    const encodedEmail = encodeURIComponent(email)
    const socketUrl = `${config.socketUrl}?user_id=${encodedEmail}`
    console.log('Initializing WebSocket connection to:', socketUrl)

    // Initialize WebSocket connection with custom headers
    socket = new WebSocket(socketUrl)

    socket.addEventListener('open', onOpen)
    socket.addEventListener('message', onMessage)
    socket.addEventListener('error', onError)
    socket.addEventListener('close', onClose)
  }

  let reconnectInterval = null

  const reconnect = () => {
    if (!socket || socket.readyState === WebSocket.OPEN) {
      return
    }
    console.log('Attempting to reconnect WebSocket...')
    bootSocket()
  }

  reconnectInterval = setInterval(reconnect, 50000)

  const unreadNotification = computed(() => {
    return notificationStore.unreadCountNotifications
  })

  return {
    unreadNotification
  }
}
