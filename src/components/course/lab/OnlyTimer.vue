<template>
  <div>
    <q-badge class="q-py-sm" color="secondary" v-if="showTimer && timeLeft > 0">
      <q-spinner-hourglass size="1em" />
      {{ formattedTimeLeft }}
    </q-badge>
  </div>
</template>

<script>
const FULL_DASH_ARRAY = 283
const WARNING_THRESHOLD = 10
const ALERT_THRESHOLD = 5

const COLOR_CODES = {
  info: {
    color: 'green'
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD
  }
}

export default {
  name: 'OnlyTimer',
  setup() {
    return {}
  },
  data() {
    return { timePassed: 0, timerInterval: null, TIME_LIMIT: 0, showTimer: true, markingStatusInfo: {} }
  },

  computed: {
    formattedTimeLeft() {
      const timeLeft = this.timeLeft
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      if (seconds < 10) {
        seconds = `0${seconds}`
      }

      return `${hours}:${minutes}:${seconds}`
    },

    timeLeft() {
      return this.TIME_LIMIT - this.timePassed
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue === 0 || newValue < 0) {
        this.showTimer = false
        this.timeLeft = 0
        this.onTimesUp()
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          message: 'Your lab session has expired. If you wish to run the lab again, click on the Provision button'
        })
      }
    }
  },
  props: ['starttime', 'endtime', 'running_instance_id', 'instance_id', 'labInfo'],
  mounted() {
    // Convert start and end times to UTC milliseconds
    const start = new Date(this.starttime * 1000).getTime()
    const end = new Date(this.endtime * 1000).getTime()

    const utc_now = Date.now()

    // Calculate distances
    const distance = start - utc_now
    const passTime = end - utc_now

    if (distance < 0 && passTime < 0) {
      // need to stop lab
    } else if (distance < 0 && passTime > 0) {
      this.TIME_LIMIT = passTime
    }

    if (this.TIME_LIMIT !== 0) {
      this.startTimer()
    }
  },

  methods: {
    onTimesUp() {
      // need to stop lab
      clearInterval(this.timerInterval)
    },

    async startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1000), 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-timer {
  position: relative;
  width: 150px;
  height: 150px;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 150px;
    height: 150px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }
}

:deep(.q-spinner) {
  background-color: transparent !important;
}
</style>
