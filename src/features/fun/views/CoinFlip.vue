<template>
  <FunShell>
    <section class="coin-experience" aria-labelledby="coin-title">
      <div class="intro">
        <p class="eyebrow">LEAVE IT TO CHANCE</p>
        <h1 id="coin-title">Flip a <span>coin.</span></h1>
        <p>
          For the decisions too important for logic, and the ones that absolutely
          are not.
        </p>

        <div class="global-count">
          <Coins :size="18" :stroke-width="1.8" />
          <strong>{{ formatCount(coinsFlipped) }}</strong>
          <span>coins flipped by indecisive people</span>
        </div>
      </div>

      <div class="coin-card">
        <div class="coin-stage" aria-hidden="true">
          <div
            class="coin"
            :class="{ flipping: isFlipping }"
            :style="{ transform: `rotateY(${rotation}deg)` }"
          >
            <div class="coin-face coin-heads">
              <span class="coin-rim"></span>
              <span class="coin-letter">M</span>
              <small>HEADS</small>
            </div>
            <div class="coin-face coin-tails">
              <span class="coin-rim"></span>
              <Sparkles :size="54" :stroke-width="1.2" />
              <small>TAILS</small>
            </div>
          </div>
          <div class="coin-shadow"></div>
        </div>

        <div class="result">
          <p>{{ isFlipping ? 'CALL IT…' : result ? 'THE COIN HAS SPOKEN' : 'FEELING LUCKY?' }}</p>
          <h2>{{ isFlipping ? 'In the air' : result || 'Heads or tails' }}</h2>
        </div>

        <button type="button" :disabled="isFlipping" @click="flipCoin">
          <RefreshCw :size="18" :stroke-width="1.8" />
          {{ isFlipping ? 'FLIPPING' : result ? 'FLIP AGAIN' : 'FLIP THE COIN' }}
        </button>

        <p class="live-result" aria-live="polite" aria-atomic="true">
          {{ liveMessage }}
        </p>
      </div>
    </section>
  </FunShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Coins, RefreshCw, Sparkles } from 'lucide-vue-next'
import FunShell from '@/features/fun/components/FunShell.vue'
import {
  incrementCounter,
  useFunCounters,
} from '@/features/fun/composables/useFunCounters'

const { coinsFlipped } = useFunCounters()
const isFlipping = ref(false)
const result = ref('')
const currentSide = ref('Heads')
const rotation = ref(0)
const numberFormatter = new Intl.NumberFormat('en-AU')

const liveMessage = computed(() => {
  if (isFlipping.value) return 'The coin is flipping.'
  if (result.value) return `The coin landed on ${result.value}.`
  return ''
})

function formatCount(value) {
  return numberFormatter.format(value || 0)
}

function flipCoin() {
  if (isFlipping.value) return

  const nextSide = Math.random() < 0.5 ? 'Heads' : 'Tails'
  const changesFace = nextSide !== currentSide.value

  result.value = ''
  isFlipping.value = true
  rotation.value += changesFace ? 1980 : 1800
  currentSide.value = nextSide

  void incrementCounter('coin-flips').catch((error) => {
    console.warn('[CoinFlip] Could not increment counter:', error)
  })

  window.setTimeout(() => {
    result.value = nextSide
    isFlipping.value = false
  }, 920)
}
</script>

<style scoped>
.coin-experience {
  display: grid;
  width: min(100%, 72rem);
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1fr) minmax(22rem, 0.78fr);
  align-items: center;
  gap: clamp(3rem, 8vw, 8rem);
  margin: clamp(1rem, 3vh, 2rem) auto 0;
}

.eyebrow {
  margin: 0 0 0.8rem;
  color: #8e849f;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.24em;
}

.intro h1 {
  margin: 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(4.2rem, 10vw, 8rem);
  font-weight: 700;
  letter-spacing: -0.085em;
  line-height: 0.82;
}

.intro h1 span {
  display: block;
  color: transparent;
  background: linear-gradient(110deg, #bd8337 4%, #f1d28b 50%, #a96c2a 96%);
  background-clip: text;
  -webkit-background-clip: text;
}

.intro > p:not(.eyebrow) {
  max-width: 31rem;
  margin: 1.4rem 0 0;
  color: #aaa3bd;
  font-size: clamp(0.9rem, 1.3vw, 1.05rem);
  line-height: 1.6;
}

.global-count {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.7rem;
  margin-top: clamp(1.5rem, 4vh, 2.8rem);
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 0.75rem;
  color: #9f8d70;
  background: rgba(255, 255, 255, 0.025);
}

.global-count strong {
  color: #f0d49b;
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
}

.global-count span {
  color: #777080;
  font-size: 0.68rem;
}

.coin-card {
  display: flex;
  width: min(100%, 29rem);
  min-height: min(70vh, 34rem);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(1.4rem, 4vh, 2.2rem);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 1.5rem;
  background: linear-gradient(150deg, rgba(28, 24, 36, 0.76), rgba(13, 12, 17, 0.86));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 2rem 5rem rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(1.2rem);
}

.coin-stage {
  position: relative;
  display: grid;
  width: min(50vw, 13.5rem);
  aspect-ratio: 1;
  place-items: center;
  perspective: 1000px;
}

.coin {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.92s cubic-bezier(0.17, 0.67, 0.3, 1);
}

.coin.flipping {
  animation: coin-lift 0.92s ease-in-out;
}

.coin-face {
  position: absolute;
  display: grid;
  inset: 0;
  place-items: center;
  overflow: hidden;
  border: 0.45rem solid #9d682d;
  border-radius: 50%;
  color: #6c4016;
  background:
    radial-gradient(circle at 35% 27%, rgba(255, 255, 255, 0.7), transparent 11%),
    radial-gradient(circle at 50% 48%, #f9dc8f 0%, #d99a43 67%, #9b6022 100%);
  box-shadow:
    inset 0 0 0 0.25rem rgba(255, 236, 170, 0.52),
    inset -1rem -1.2rem 2rem rgba(115, 57, 8, 0.25),
    0 1.4rem 2.5rem rgba(0, 0, 0, 0.42);
  backface-visibility: hidden;
}

.coin-tails {
  transform: rotateY(180deg);
}

.coin-rim {
  position: absolute;
  inset: 0.65rem;
  border: 1px dashed rgba(105, 56, 14, 0.45);
  border-radius: 50%;
}

.coin-letter {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 5.8rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 0 rgba(255, 239, 174, 0.54);
}

.coin-face small {
  position: absolute;
  bottom: 2rem;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.23em;
}

.coin-shadow {
  position: absolute;
  width: 78%;
  height: 14%;
  bottom: -10%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  filter: blur(0.9rem);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.result {
  margin-top: clamp(1.8rem, 4vh, 2.8rem);
  text-align: center;
}

.result p {
  margin: 0;
  color: #81778c;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.21em;
}

.result h2 {
  margin: 0.35rem 0 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.8rem, 4vh, 2.5rem);
  letter-spacing: -0.045em;
}

button {
  display: flex;
  width: 100%;
  min-height: 3.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.4rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.85rem;
  color: #fff;
  background: linear-gradient(110deg, #88551e, #b47a31 50%, #86521d);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 0.8rem 2rem rgba(85, 47, 12, 0.3);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.16em;
  transition: filter 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

button:not(:disabled):hover {
  filter: brightness(1.13);
  transform: translateY(-2px);
}

button:disabled {
  cursor: wait;
  opacity: 0.62;
}

button:focus-visible {
  outline: 2px solid #f3d594;
  outline-offset: 3px;
}

.live-result {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes coin-lift {
  0%, 100% { translate: 0 0; }
  45% { translate: 0 -2.2rem; }
}

@media (max-width: 850px) {
  .coin-experience {
    grid-template-columns: 1fr;
    gap: 1.3rem;
    margin-top: 1.5rem;
    padding-bottom: 1rem;
  }

  .intro {
    text-align: center;
  }

  .intro h1 {
    font-size: clamp(3.8rem, 15vw, 5.8rem);
  }

  .intro > p:not(.eyebrow) {
    display: none;
  }

  .global-count {
    margin: 1rem auto 0;
  }

  .coin-card {
    min-height: 0;
    justify-self: center;
  }

  .coin-stage {
    width: min(48vw, 11.5rem);
  }
}

@media (max-width: 520px) {
  .coin-experience {
    margin-top: 1rem;
  }

  .eyebrow {
    display: none;
  }

  .intro h1 {
    font-size: clamp(3.5rem, 17vw, 4.8rem);
  }

  .global-count span {
    max-width: 11rem;
    text-align: left;
  }

  .coin-card {
    padding: 1.2rem;
  }

  .coin-stage {
    width: min(47vw, 10.5rem);
  }

  .coin-letter {
    font-size: 4.4rem;
  }

  .coin-face small {
    bottom: 1.45rem;
  }

  .result {
    margin-top: 1.4rem;
  }
}
</style>
