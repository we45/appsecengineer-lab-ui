<script setup>
import { provideScreenSize } from 'src/composables/useScreenSize'

const { isMobile } = provideScreenSize()
</script>

<template>
  <div class="row items-center justify-center loading-container">
    <div class="absolute vector-container animated-vector">
      <q-img src="/login/wave.png" alt="Wave" width="100%" height="auto" fit="cover" />
    </div>

    <div class="absolute shapes-container">
      <div class="absolute quadrant-container quadrant-top-left">
        <div class="animated-shape">
          <q-img src="/login/triangle.png" alt="Triangle" width="150px" height="150px" fit="contain" />
        </div>
      </div>

      <div class="absolute quadrant-container quadrant-top-right">
        <div class="animated-shape">
          <q-img src="/login/star.png" alt="Star" width="150px" height="150px" fit="contain" />
        </div>
      </div>

      <div class="absolute quadrant-container quadrant-bottom-left">
        <div class="animated-shape">
          <q-img src="/login/circle.png" alt="Circle" width="150px" height="150px" fit="contain" />
        </div>
      </div>

      <div class="absolute quadrant-container quadrant-bottom-right">
        <div class="animated-shape">
          <q-img src="/login/crescent.png" alt="Crescent" width="150px" height="150px" fit="contain" />
        </div>
      </div>

      <div class="absolute layer-container">
        <q-img
          src="/login/center.png"
          alt="Center"
          :width="isMobile ? '175px' : '300px'"
          :height="isMobile ? '175px' : '300px'"
          fit="contain"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$cubic-bezier: cubic-bezier(0.4, 0, 0.2, 1);
.loading-container {
  background: linear-gradient(135deg, #02032d 0%, #1a1a3a 100%);
  min-height: 100vh;
}

.vector-container {
  bottom: 30%;
  left: 0;
  width: 100%;
  height: 10vh;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shapes-container {
  inset: 0;
  z-index: 5;
}

.quadrant-container {
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quadrant-top-left {
  top: 0;
  left: 0;
}
.quadrant-top-right {
  top: 0;
  right: 0;
}
.quadrant-bottom-left {
  bottom: 0;
  left: 0;
}
.quadrant-bottom-right {
  bottom: 0;
  right: 0;
}

.layer-container {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.animated-shape {
  animation: ballDrop 20s $cubic-bezier infinite;
}

.quadrant-top-left .animated-shape {
  animation: ballDrop 18s $cubic-bezier infinite;
}

.quadrant-top-right .animated-shape {
  animation: ballDrop 22s $cubic-bezier infinite;
}

.quadrant-bottom-left .animated-shape {
  animation: ballDrop 25s $cubic-bezier infinite;
}

.quadrant-bottom-right .animated-shape {
  animation: ballDrop 19s $cubic-bezier infinite;
}

.animated-vector {
  animation: wave 8s $cubic-bezier infinite;
}

@keyframes ballDrop {
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  10% {
    transform: translate(80px, -60px) scale(1.05) rotate(36deg);
  }
  20% {
    transform: translate(-70px, 50px) scale(0.95) rotate(72deg);
  }
  30% {
    transform: translate(60px, 70px) scale(1.03) rotate(108deg);
  }
  40% {
    transform: translate(-80px, -40px) scale(0.97) rotate(144deg);
  }
  50% {
    transform: translate(90px, 60px) scale(1.05) rotate(180deg);
  }
  60% {
    transform: translate(-60px, -80px) scale(0.95) rotate(216deg);
  }
  70% {
    transform: translate(70px, 40px) scale(1.02) rotate(252deg);
  }
  80% {
    transform: translate(-90px, 50px) scale(0.98) rotate(288deg);
  }
  90% {
    transform: translate(50px, -70px) scale(1.01) rotate(324deg);
  }
  100% {
    transform: translate(0, 0) scale(1) rotate(360deg);
  }
}

@keyframes wave {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(5px, -15px);
  }
  50% {
    transform: translate(0, -8px);
  }
  75% {
    transform: translate(-5px, -20px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
