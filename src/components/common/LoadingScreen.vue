<template>
  <Transition name="loading-screen">
    <div v-if="visible" class="loading-screen" @click.stop>
      <!-- Background glow -->
      <div class="loading-screen__glow" />

      <!-- Logo -->
      <div class="loading-screen__logo-wrap">
        <img src="/og.png" alt="MXN" class="loading-screen__logo" />
      </div>

      <!-- Progress bar -->
      <div class="loading-screen__progress">
        <div class="loading-screen__progress-bar" />
      </div>

      <!-- Message -->
      <Transition name="loading-msg" mode="out-in">
        <p class="loading-screen__message" :key="displayMessage">
          {{ displayMessage }}
        </p>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, default: '' },
})

const fallbackMessages = [
  'Warming up the engines…',
  'Brewing something fresh…',
  'Polishing the pixels…',
  'Almost there…',
  'Loading the good stuff…',
  'Hang tight, magic in progress…',
  'Crunching the numbers…',
  'Fetching awesomeness…',
  'Spinning up the hamster wheel…',
  'Reticulating splines…',
  'Assembling the bits…',
  'Aligning the stars…',
  'Charging the flux capacitor…',
  'Summoning the data wizards…',
  'Tuning the algorithms…',
  'Unfurling the scroll…',
  'Waking up the servers…',
  'Shuffling the deck…',
  'Painting the canvas…',
  'Lighting things up…',
]

// Pick a random message once on mount — stays stable while visible
const randomIndex = Math.floor(Math.random() * fallbackMessages.length)
const randomMessage = fallbackMessages[randomIndex]

const displayMessage = computed(() => props.message || randomMessage)
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  gap: 1.5rem;
}

/* Purple radial glow behind the logo */
.loading-screen__glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(124, 58, 237, 0.25) 0%,
    rgba(124, 58, 237, 0.08) 40%,
    transparent 70%
  );
  animation: glow-pulse 3s ease-in-out infinite;
  pointer-events: none;
}

/* Logo image */
.loading-screen__logo-wrap {
  position: relative;
  z-index: 1;
}

.loading-screen__logo {
  width: 200px;
  height: auto;
  object-fit: contain;
  animation: logo-breathe 2.4s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.35));
}

/* Thin progress bar along the bottom portion */
.loading-screen__progress {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: min(280px, 60vw);
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.loading-screen__progress-bar {
  width: 40%;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #7c3aed, #d946ef, #f97316);
  animation: progress-slide 1.8s ease-in-out infinite;
}

/* Message text */
.loading-screen__message {
  position: absolute;
  bottom: 48px;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  max-width: 260px;
}

/* ---- Animations ---- */

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@keyframes logo-breathe {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.35));
  }
  50% {
    transform: scale(1.04);
    filter: drop-shadow(0 0 50px rgba(124, 58, 237, 0.55));
  }
}

@keyframes progress-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

/* ---- Page-level transition (enter / leave) ---- */

.loading-screen-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.loading-screen-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.loading-screen-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.loading-screen-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

/* ---- Message text swap ---- */

.loading-msg-enter-active,
.loading-msg-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.loading-msg-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.loading-msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
