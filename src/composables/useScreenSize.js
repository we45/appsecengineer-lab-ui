import { computed, ref, onMounted, onUnmounted, inject, provide } from 'vue'

const symbol = Symbol('screenSize')

function useScreenSizeState() {
  const width = ref(0)
  const height = ref(0)

  const updateSize = () => {
    if (typeof window !== 'undefined') {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateSize)
    }
  })

  const breakpoints = {
    mobile: 0,
    tablet: 600,
    desktop: 1024
  }

  const isMobile = computed(() => width.value < breakpoints.tablet)
  const isTablet = computed(() => width.value >= breakpoints.tablet && width.value < breakpoints.desktop)
  const isDesktop = computed(() => width.value >= breakpoints.desktop)

  const currentBreakpoint = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isDesktop.value) return 'desktop'
    return 'unknown'
  })

  const screenDimensions = computed(() => ({
    width: width.value,
    height: height.value
  }))

  return {
    isMobile,
    isTablet,
    isDesktop,

    currentBreakpoint,
    screenDimensions,

    width,
    height,
    breakpoints
  }
}

export function provideScreenSize() {
  const state = useScreenSizeState()
  provide(symbol, state)
  return state
}

export function useScreenSize() {
  return inject(symbol)
}
