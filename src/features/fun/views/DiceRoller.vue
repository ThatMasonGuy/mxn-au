<template>
  <FunShell>
    <section class="dice-experience" aria-labelledby="dice-title">
      <div class="roller-card">
        <div class="roller-heading">
          <div>
            <p class="eyebrow">TEMPT PROBABILITY</p>
            <h1 id="dice-title">Roll the <span>dice.</span></h1>
          </div>
          <div class="total-rolls">
            <strong>{{ formatCount(diceRolled) }}</strong>
            <span>TOTAL ROLLS</span>
          </div>
        </div>

        <div class="die-stage" aria-hidden="true">
          <div
            class="die-shape"
            :class="[`die-d${selectedSides}`, { rolling: isRolling }]"
          >
            <span>{{ displayValue }}</span>
          </div>
          <div class="die-shadow"></div>
        </div>

        <div class="result-copy">
          <p>{{ isRolling ? `ROLLING A D${selectedSides}` : result ? 'FATE LANDED ON' : 'CHOOSE YOUR WEAPON' }}</p>
          <h2>{{ isRolling ? 'Here we go…' : result ? `${result} on a d${selectedSides}` : `Ready for a d${selectedSides}` }}</h2>
        </div>

        <button class="roll-button" type="button" :disabled="isRolling" @click="rollDice">
          <Dices :size="18" :stroke-width="1.8" />
          {{ isRolling ? 'ROLLING' : `ROLL D${selectedSides}` }}
        </button>

        <p class="live-result" aria-live="polite" aria-atomic="true">
          {{ liveMessage }}
        </p>
      </div>

      <aside class="dice-controls" aria-label="Choose a die and view roll counts">
        <div class="selector-heading">
          <div>
            <p class="eyebrow">PICK A DIE</p>
            <h2>How chaotic?</h2>
          </div>
          <span>{{ selectedSides }} sides</span>
        </div>

        <div class="die-options">
          <button
            v-for="sides in DIE_TYPES"
            :key="sides"
            type="button"
            :class="{ selected: selectedSides === sides }"
            :aria-pressed="selectedSides === sides"
            @click="selectDie(sides)"
          >
            <span>d{{ sides }}</span>
            <small>{{ formatCount(diceByType[sides]) }} rolls</small>
          </button>
        </div>

        <div class="odds-note">
          <Gauge :size="18" :stroke-width="1.7" />
          <p>
            A d{{ selectedSides }} gives you a
            <strong>{{ chance }}%</strong> chance of rolling any one number.
          </p>
        </div>
      </aside>
    </section>
  </FunShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Dices, Gauge } from 'lucide-vue-next'
import FunShell from '@/features/fun/components/FunShell.vue'
import {
  ALL_COUNTER_IDS,
  DIE_TYPES,
  incrementDiceCounter,
  useFunCounters,
} from '@/features/fun/composables/useFunCounters'

const selectedSides = ref(20)
const result = ref(null)
const displayValue = ref(20)
const isRolling = ref(false)
const numberFormatter = new Intl.NumberFormat('en-AU')
const { diceRolled, diceByType } = useFunCounters(ALL_COUNTER_IDS)

const chance = computed(() => {
  const value = 100 / selectedSides.value
  return value >= 10 ? value.toFixed(1).replace('.0', '') : value.toFixed(2).replace(/0+$/, '')
})

const liveMessage = computed(() => {
  if (isRolling.value) return `Rolling a d${selectedSides.value}.`
  if (result.value) return `You rolled ${result.value} on a d${selectedSides.value}.`
  return ''
})

function formatCount(value) {
  return numberFormatter.format(value || 0)
}

function selectDie(sides) {
  if (isRolling.value) return
  selectedSides.value = sides
  result.value = null
  displayValue.value = sides
}

function rollDice() {
  if (isRolling.value) return

  const sides = selectedSides.value
  const finalResult = Math.floor(Math.random() * sides) + 1
  let ticks = 0

  result.value = null
  isRolling.value = true

  const ticker = window.setInterval(() => {
    displayValue.value = Math.floor(Math.random() * sides) + 1
    ticks += 1

    if (ticks < 9) return

    window.clearInterval(ticker)
    displayValue.value = finalResult
    result.value = finalResult
    isRolling.value = false
  }, 72)

  void incrementDiceCounter(sides).catch((error) => {
    console.warn('[DiceRoller] Could not increment counters:', error)
  })
}
</script>

<style scoped>
.dice-experience {
  display: grid;
  width: min(100%, 72rem);
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(25rem, 1.1fr) minmax(18rem, 0.72fr);
  align-items: center;
  gap: clamp(1.2rem, 3vw, 2.2rem);
  margin: clamp(0.8rem, 2vh, 1.4rem) auto 0;
}

.roller-card,
.dice-controls {
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: linear-gradient(150deg, rgba(28, 24, 36, 0.76), rgba(13, 12, 17, 0.86));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 2rem 5rem rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(1.2rem);
}

.roller-card {
  display: grid;
  min-height: min(76vh, 37rem);
  grid-template-rows: auto 1fr auto auto;
  align-items: center;
  padding: clamp(1.3rem, 3vh, 2rem);
  border-radius: 1.5rem;
}

.roller-heading,
.selector-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.eyebrow {
  margin: 0 0 0.45rem;
  color: #8e849f;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.23em;
}

.roller-heading h1 {
  margin: 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(2.7rem, 6vh, 4.3rem);
  font-weight: 700;
  letter-spacing: -0.07em;
  line-height: 0.9;
}

.roller-heading h1 span {
  color: transparent;
  background: linear-gradient(110deg, #7050b3, #a47ce7 55%, #c6adf5);
  background-clip: text;
  -webkit-background-clip: text;
}

.total-rolls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 0.2rem;
}

.total-rolls strong {
  color: #d4c3ef;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.4rem, 3.5vh, 2rem);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.total-rolls span {
  color: #625b6c;
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.die-stage {
  position: relative;
  display: grid;
  min-height: 0;
  place-items: center;
  perspective: 900px;
}

.die-shape {
  position: relative;
  z-index: 1;
  display: grid;
  width: min(25vw, 26vh, 12rem);
  aspect-ratio: 1;
  place-items: center;
  color: #f7efff;
  background:
    radial-gradient(circle at 34% 26%, rgba(255, 255, 255, 0.22), transparent 17%),
    linear-gradient(145deg, #946bd5, #5b358f 58%, #301b51);
  filter: drop-shadow(0 1.7rem 1.5rem rgba(0, 0, 0, 0.52));
  transition: clip-path 0.35s ease, border-radius 0.35s ease;
}

.die-shape::before {
  position: absolute;
  inset: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  content: "";
  clip-path: inherit;
}

.die-shape span {
  position: relative;
  z-index: 1;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(3.2rem, 9vh, 5.7rem);
  font-weight: 700;
  letter-spacing: -0.07em;
  text-shadow: 0 0.4rem 1.5rem rgba(26, 11, 49, 0.48);
}

.die-d4 {
  clip-path: polygon(50% 2%, 98% 92%, 2% 92%);
}

.die-d6 {
  border-radius: 1.7rem;
}

.die-d8 {
  clip-path: polygon(50% 0, 96% 50%, 50% 100%, 4% 50%);
}

.die-d10 {
  clip-path: polygon(50% 0, 93% 28%, 82% 82%, 50% 100%, 18% 82%, 7% 28%);
}

.die-d12,
.die-d20,
.die-d100 {
  clip-path: polygon(50% 0, 86% 14%, 100% 50%, 86% 86%, 50% 100%, 14% 86%, 0 50%, 14% 14%);
}

.die-shape.rolling {
  animation: tumble 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.die-shadow {
  position: absolute;
  width: 10rem;
  height: 1.6rem;
  bottom: 11%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.68);
  filter: blur(0.9rem);
}

.result-copy {
  text-align: center;
}

.result-copy p {
  margin: 0;
  color: #81778c;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.result-copy h2 {
  margin: 0.3rem 0 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.4rem, 3.2vh, 2rem);
  letter-spacing: -0.04em;
}

.roll-button {
  display: flex;
  width: 100%;
  min-height: 3.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 0.85rem;
  color: #fff;
  background: linear-gradient(110deg, #65439f, #7d59bb 48%, #604091);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 0.8rem 2rem rgba(64, 35, 111, 0.28);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.17em;
  transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
}

.roll-button:not(:disabled):hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.roll-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.roll-button:focus-visible,
.die-options button:focus-visible {
  outline: 2px solid #c8aaff;
  outline-offset: 3px;
}

.dice-controls {
  padding: clamp(1.2rem, 3vh, 1.8rem);
  border-radius: 1.25rem;
}

.selector-heading h2 {
  margin: 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: 1.8rem;
  letter-spacing: -0.045em;
}

.selector-heading > span {
  padding: 0.35rem 0.55rem;
  border: 1px solid rgba(169, 126, 235, 0.22);
  border-radius: 0.45rem;
  color: #b69bdd;
  background: rgba(126, 81, 192, 0.09);
  font-size: 0.6rem;
  font-weight: 700;
}

.die-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 1.3rem;
}

.die-options button {
  display: flex;
  min-height: 3.65rem;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 0.7rem;
  color: #b9b1c3;
  background: rgba(3, 3, 6, 0.3);
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.die-options button:hover {
  border-color: rgba(161, 119, 227, 0.3);
  transform: translateY(-1px);
}

.die-options button.selected {
  border-color: rgba(165, 123, 230, 0.56);
  color: #f6efff;
  background: linear-gradient(135deg, rgba(123, 78, 191, 0.24), rgba(255, 255, 255, 0.025));
}

.die-options button:last-child {
  grid-column: 1 / -1;
}

.die-options span {
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

.die-options small {
  margin-top: 0.15rem;
  color: #655f6d;
  font-size: 0.57rem;
  font-variant-numeric: tabular-nums;
}

.die-options button.selected small {
  color: #9e8ab9;
}

.odds-note {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: #716a7a;
}

.odds-note svg {
  flex: none;
  color: #8d70b8;
}

.odds-note p {
  margin: 0;
  font-size: 0.65rem;
  line-height: 1.45;
}

.odds-note strong {
  color: #bda5dd;
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

@keyframes tumble {
  0% { transform: rotate(0deg) scale(1); }
  22% { transform: rotate(-15deg) translateY(-1rem) scale(0.92); }
  47% { transform: rotate(12deg) translateY(-2rem) scale(1.06); }
  72% { transform: rotate(-8deg) translateY(-0.7rem) scale(0.97); }
  100% { transform: rotate(0) scale(1); }
}

@media (max-width: 850px) {
  .dice-experience {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-bottom: 1rem;
  }

  .roller-card {
    min-height: 31rem;
  }

  .die-shape {
    width: min(38vw, 10rem);
  }

  .dice-controls {
    width: 100%;
  }

  .die-options {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .die-options button:last-child {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .dice-experience {
    margin-top: 1rem;
  }

  .roller-card {
    min-height: 27rem;
    padding: 1.1rem;
  }

  .roller-heading h1 {
    font-size: clamp(2.6rem, 12vw, 3.4rem);
  }

  .die-shape {
    width: min(42vw, 9.2rem);
  }

  .die-shape span {
    font-size: 3.6rem;
  }

  .dice-controls {
    padding: 1.1rem;
  }

  .die-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .die-options button:last-child {
    grid-column: 1 / -1;
  }
}
</style>
