<template>
  <FunShell>
    <section class="dice-experience" aria-labelledby="dice-title">
      <div class="dice-showcase">
        <div class="intro">
          <h1 id="dice-title">
            Roll the
            <span>dice.</span>
          </h1>
          <p class="lede">
            Choose a die, roll it, and leave the outcome to chance.
          </p>
          <CounterStatement
            class="roll-count"
            :count="diceRolled"
            singular="die"
            plural="dice"
            suffix="rolled so far"
          />
        </div>

        <div class="die-stage" aria-hidden="true">
          <Dice3D
            class="three-d-die"
            :sides="selectedSides"
            :value="displayValue"
            :rolling="isRolling"
          />
        </div>
      </div>

      <div class="roll-panel">
        <div class="panel-number" aria-hidden="true">D{{ selectedSides }}</div>
        <p class="panel-kicker">DICE ROLLER</p>
        <h2>Choose a die.</h2>

        <label for="die-sides">Your die</label>
        <div class="select-field">
          <Dices :size="18" :stroke-width="1.7" aria-hidden="true" />
          <select
            id="die-sides"
            v-model.number="selectedSides"
            :disabled="isRolling"
            @change="resetDie"
          >
            <option v-for="die in diceOptions" :key="die.sides" :value="die.sides">
              d{{ die.sides }} — {{ die.label }}
            </option>
          </select>
          <ChevronDown :size="17" :stroke-width="1.8" aria-hidden="true" />
        </div>

        <div class="selection-detail">
          <span class="mini-die">d{{ selectedSides }}</span>
          <div>
            <strong>{{ selectedDie.label }}</strong>
            <small>{{ selectedSides }} possible outcomes</small>
          </div>
        </div>

        <div class="result-copy" aria-hidden="true">
          <p>{{ isRolling ? 'ROLL IN PROGRESS' : result ? 'YOU ROLLED' : 'READY TO ROLL' }}</p>
          <h3>{{ isRolling ? '…' : result || '—' }}</h3>
        </div>

        <button
          class="roll-button"
          type="button"
          :disabled="isRolling"
          @click="rollDice"
        >
          <span>{{ isRolling ? 'ROLLING' : `ROLL D${selectedSides}` }}</span>
          <Dices v-if="!isRolling" :size="18" :stroke-width="1.8" />
          <span v-else class="button-loader" aria-hidden="true"></span>
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
import { ChevronDown, Dices } from 'lucide-vue-next'
import CounterStatement from '@/features/fun/components/CounterStatement.vue'
import Dice3D from '@/features/fun/components/Dice3D.vue'
import FunShell from '@/features/fun/components/FunShell.vue'
import {
  incrementDiceCounter,
  useFunCounters,
} from '@/features/fun/composables/useFunCounters'

const diceOptions = [
  { sides: 4, label: 'Four-sided die' },
  { sides: 6, label: 'Six-sided die' },
  { sides: 8, label: 'Eight-sided die' },
  { sides: 10, label: 'Ten-sided die' },
  { sides: 12, label: 'Twelve-sided die' },
  { sides: 20, label: 'Twenty-sided die' },
  { sides: 100, label: 'Percentile dice' },
]

const selectedSides = ref(20)
const result = ref(null)
const displayValue = ref(20)
const isRolling = ref(false)
const { diceRolled } = useFunCounters(['dice-total'])

const selectedDie = computed(
  () => diceOptions.find((die) => die.sides === selectedSides.value) || diceOptions[5],
)

const liveMessage = computed(() => {
  if (isRolling.value) return `Rolling a d${selectedSides.value}.`
  if (result.value) return `You rolled ${result.value} on a d${selectedSides.value}.`
  return ''
})

function resetDie() {
  result.value = null
  displayValue.value = selectedSides.value
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
  width: min(100%, 78rem);
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.78fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 6rem);
  margin: clamp(0.75rem, 2vh, 1.5rem) auto 0;
}

.dice-showcase {
  display: flex;
  min-height: 0;
  align-self: stretch;
  flex-direction: column;
  justify-content: center;
}

.intro {
  width: min(100%, 46rem);
}

.intro h1 {
  margin: 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(3.25rem, 8.2vh, 5.6rem);
  font-weight: 700;
  letter-spacing: -0.075em;
  line-height: 0.86;
}

.intro h1 span {
  display: block;
  color: transparent;
  background: linear-gradient(110deg, #7351b7 5%, #9f7aea 48%, #d0bdf5 92%);
  background-clip: text;
  -webkit-background-clip: text;
}

.lede {
  max-width: 34rem;
  margin: clamp(0.65rem, 1.7vh, 1rem) 0 0;
  color: #aaa3bd;
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  line-height: 1.5;
}

.roll-count {
  margin-top: clamp(0.85rem, 2vh, 1.35rem);
}

.die-stage {
  position: relative;
  display: grid;
  min-height: 0;
  flex: 1;
  place-items: center;
  padding: clamp(0.25rem, 1vh, 0.65rem) 0;
  perspective: 900px;
}

.three-d-die {
  width: min(36vw, 43vh, 21rem);
}

.roll-panel {
  position: relative;
  width: min(100%, 28rem);
  justify-self: end;
  padding: clamp(1.3rem, 3vh, 2.1rem);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 1.25rem;
  background: linear-gradient(150deg, rgba(28, 24, 36, 0.74), rgba(13, 12, 17, 0.82));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.035),
    0 2rem 5rem rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(1.2rem);
}

.panel-number {
  position: absolute;
  top: -1.7rem;
  right: 0.5rem;
  color: rgba(255, 255, 255, 0.025);
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: 7.5rem;
  font-weight: 700;
  letter-spacing: -0.1em;
  line-height: 1;
  pointer-events: none;
}

.panel-kicker {
  position: relative;
  margin: 0;
  color: #8e849f;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.24em;
}

.roll-panel h2 {
  position: relative;
  margin: 0.4rem 0 clamp(1rem, 2vh, 1.5rem);
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.65rem, 4.4vh, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

label {
  display: block;
  margin-bottom: 0.6rem;
  color: #9890a8;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.select-field {
  position: relative;
  display: flex;
  min-height: 3.65rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.85rem;
  color: #8f75b6;
  background: rgba(4, 4, 7, 0.56);
  box-shadow: inset 0 1px 1rem rgba(0, 0, 0, 0.18);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.select-field:focus-within {
  border-color: rgba(151, 116, 218, 0.72);
  box-shadow:
    0 0 0 3px rgba(139, 92, 246, 0.1),
    inset 0 1px 1rem rgba(0, 0, 0, 0.18);
}

.select-field select {
  width: 100%;
  border: 0;
  outline: 0;
  appearance: none;
  color: #f2ecf9;
  background: transparent;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 650;
}

.select-field option {
  color: #18131f;
}

.select-field > svg:last-child {
  flex: none;
  color: #6d6477;
  pointer-events: none;
}

.selection-detail {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
}

.mini-die {
  display: grid;
  width: 2.7rem;
  height: 2.7rem;
  flex: none;
  place-items: center;
  clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  color: #fff;
  background: linear-gradient(145deg, #8460c3, #513179);
  font-size: 0.7rem;
  font-weight: 800;
}

.selection-detail div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.selection-detail strong {
  color: #c8bfce;
  font-size: 0.76rem;
}

.selection-detail small {
  margin-top: 0.15rem;
  color: #68616f;
  font-size: 0.6rem;
}

.result-copy {
  display: flex;
  min-height: 5.2rem;
  flex-direction: column;
  justify-content: center;
  margin-top: 1rem;
  border-block: 1px solid rgba(255, 255, 255, 0.055);
  text-align: center;
}

.result-copy p {
  margin: 0;
  color: #81778c;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.result-copy h3 {
  margin: 0.25rem 0 0;
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.65rem, 4vh, 2.3rem);
  letter-spacing: -0.04em;
}

.roll-button {
  display: flex;
  width: 100%;
  min-height: 3.35rem;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 0.85rem;
  color: #fff;
  background: linear-gradient(110deg, #65439f, #7d59bb 48%, #604091);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 0.8rem 2rem rgba(64, 35, 111, 0.28);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.17em;
  transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
}

.roll-button:not(:disabled):hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.roll-button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.roll-button:focus-visible {
  outline: 2px solid #c8aaff;
  outline-offset: 3px;
}

.button-loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 850px) {
  .dice-experience {
    min-height: auto;
    flex: none;
    grid-template-columns: 1fr;
    gap: 0.85rem;
    margin-top: 1.5rem;
    padding-bottom: 1rem;
  }

  .dice-showcase {
    width: 100%;
    align-items: center;
  }

  .intro {
    width: min(100%, 34rem);
    text-align: center;
  }

  .intro h1 {
    font-size: clamp(3rem, 14vw, 4.5rem);
  }

  .lede {
    max-width: 27rem;
    margin: 0.7rem auto 0;
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .roll-count {
    margin: 0.8rem auto 0;
  }

  .die-stage {
    flex: none;
    padding: 0.55rem 0 0.8rem;
  }

  .three-d-die {
    width: min(60vw, 16rem);
  }

  .roll-panel {
    width: min(100%, 34rem);
    justify-self: center;
    margin-inline: auto;
    padding: 1.2rem;
  }
}

@media (max-width: 520px) {
  .dice-experience {
    margin-top: 1.2rem;
  }

  .intro h1 {
    font-size: clamp(3rem, 16vw, 4.2rem);
  }

  .lede {
    display: none;
  }

  .roll-count {
    margin-top: 0.65rem;
  }

  .three-d-die {
    width: min(57vw, 14rem);
  }

  .die-stage {
    padding: 0.35rem 0 0.6rem;
  }

  .roll-panel {
    padding: 1.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
