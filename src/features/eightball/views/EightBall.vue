<template>
  <main class="eight-ball-page">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>
    <div class="stars" aria-hidden="true"></div>

    <header class="page-header">
      <RouterLink class="brand" to="/" aria-label="Go to MXN.au">
        <span class="brand-mark">M</span>
        <span>MXN.AU</span>
      </RouterLink>
      <FunNav />
    </header>

    <section class="experience" aria-labelledby="eight-ball-title">
      <div class="oracle-showcase">
        <div class="intro">
          <h1 id="eight-ball-title">
            Ask the
            <span>8 Ball.</span>
          </h1>
          <p class="lede">
            Bring your biggest dilemma, your smallest suspicion, or the question
            you already know the answer to.
          </p>
          <CounterStatement
            class="question-count"
            :count="questionsAsked"
            singular="question"
            plural="questions"
            suffix="asked by curious people"
          />
        </div>

        <div class="ball-stage">
          <div
            class="magic-ball"
            :class="{ shaking: isThinking, answered: answer && !isThinking }"
            aria-hidden="true"
          >
            <div class="ball-highlight"></div>
            <div class="ball-rim">
              <div class="answer-window">
                <div class="answer-triangle">
                  <span v-if="isThinking" class="thinking-dots">
                    <i></i><i></i><i></i>
                  </span>
                  <p v-else-if="answer" :key="answer" class="answer-text">
                    <span v-for="line in answerLines" :key="line">{{ line }}</span>
                  </p>
                  <span v-else class="eight">8</span>
                </div>
              </div>
            </div>
          </div>

          <p class="answer-announcement" aria-live="polite" aria-atomic="true">
            {{ liveMessage }}
          </p>
        </div>
      </div>

      <div class="question-panel">
        <div class="panel-number" aria-hidden="true">08</div>
        <p class="panel-kicker">CONSULT THE ORACLE</p>
        <h2>What do you need to know?</h2>

        <form @submit.prevent="askTheBall">
          <label for="eight-ball-question">Your question</label>
          <div class="question-field" :class="{ focused: isFocused }">
            <textarea
              id="eight-ball-question"
              ref="questionInput"
              v-model="question"
              rows="3"
              maxlength="240"
              autocomplete="off"
              placeholder="Will today be my lucky day?"
              :disabled="isThinking"
              @focus="isFocused = true"
              @blur="isFocused = false"
              @keydown.enter.exact.prevent="askTheBall"
            ></textarea>
            <span class="character-count">{{ question.length }}/240</span>
          </div>

          <p v-if="validationMessage" class="validation-message" role="alert">
            {{ validationMessage }}
          </p>

          <button
            class="ask-button"
            type="submit"
            :disabled="isThinking || !question.trim()"
          >
            <span>{{ isThinking ? 'CONSULTING FATE' : buttonLabel }}</span>
            <Sparkles v-if="!isThinking" :size="18" :stroke-width="1.8" />
            <span v-else class="button-loader" aria-hidden="true"></span>
          </button>
        </form>

        <button
          v-if="answer && !isThinking"
          class="ask-another"
          type="button"
          @click="resetOracle"
        >
          Ask another question
          <RotateCcw :size="15" :stroke-width="1.8" />
        </button>

        <p class="keyboard-hint">
          Press <kbd>Enter</kbd> to ask
          <span aria-hidden="true">·</span>
          <kbd>Shift</kbd> + <kbd>Enter</kbd> for a new line
        </p>
      </div>
    </section>

    <footer class="page-footer">
      <span>TRUST THE PROCESS</span>
      <span class="footer-line" aria-hidden="true"></span>
      <span>QUESTION EVERYTHING</span>
    </footer>
  </main>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { RotateCcw, Sparkles } from 'lucide-vue-next'
import { collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { firestore } from '@/firebase'
import CounterStatement from '@/features/fun/components/CounterStatement.vue'
import FunNav from '@/features/fun/components/FunNav.vue'
import {
  stageCounterIncrement,
  useFunCounters,
} from '@/features/fun/composables/useFunCounters'

const ANSWERS = [
  { text: 'It is certain', lines: ['It is', 'certain'], type: 'positive' },
  { text: 'It is decidedly so', lines: ['It is', 'decidedly', 'so'], type: 'positive' },
  { text: 'Without a doubt', lines: ['Without', 'a doubt'], type: 'positive' },
  { text: 'Yes, definitely', lines: ['Yes,', 'definitely'], type: 'positive' },
  { text: 'You may rely on it', lines: ['You may', 'rely on', 'it'], type: 'positive' },
  { text: 'As I see it, yes', lines: ['As I see it', 'yes'], type: 'positive' },
  { text: 'Most likely', lines: ['Most', 'likely'], type: 'positive' },
  { text: 'Outlook good', lines: ['Outlook', 'good'], type: 'positive' },
  { text: 'Yes', lines: ['Yes'], type: 'positive' },
  { text: 'Signs point to yes', lines: ['Signs point', 'to yes'], type: 'positive' },
  { text: 'Reply hazy, try again', lines: ['Reply hazy', 'try', 'again'], type: 'neutral' },
  { text: 'Ask again later', lines: ['Ask again', 'later'], type: 'neutral' },
  { text: 'Better not tell you now', lines: ['Better not', 'tell you', 'now'], type: 'neutral' },
  { text: 'Cannot predict now', lines: ['Cannot', 'predict', 'now'], type: 'neutral' },
  { text: 'Concentrate and ask again', lines: ['Concentrate', 'and ask', 'again'], type: 'neutral' },
  { text: "Don't count on it", lines: ["Don't count", 'on it'], type: 'negative' },
  { text: 'My reply is no', lines: ['My reply', 'is no'], type: 'negative' },
  { text: 'My sources say no', lines: ['My sources', 'say no'], type: 'negative' },
  { text: 'Outlook not so good', lines: ['Outlook', 'not so', 'good'], type: 'negative' },
  { text: 'Very doubtful', lines: ['Very', 'doubtful'], type: 'negative' },
]

const question = ref('')
const answer = ref('')
const lastAnswerIndex = ref(-1)
const isThinking = ref(false)
const isFocused = ref(false)
const validationMessage = ref('')
const questionInput = ref(null)
const { questionsAsked } = useFunCounters(['questions'])

const buttonLabel = computed(() => (answer.value ? 'ASK AGAIN' : 'REVEAL MY ANSWER'))
const answerLines = computed(() => ANSWERS.find((option) => option.text === answer.value)?.lines || [])
const liveMessage = computed(() => {
  if (isThinking.value) return 'The Magic 8 Ball is considering your question.'
  if (answer.value) return `The Magic 8 Ball says: ${answer.value}.`
  return ''
})

function chooseAnswer() {
  let index = Math.floor(Math.random() * ANSWERS.length)

  if (ANSWERS.length > 1 && index === lastAnswerIndex.value) {
    index = (index + 1 + Math.floor(Math.random() * (ANSWERS.length - 1))) % ANSWERS.length
  }

  lastAnswerIndex.value = index
  return ANSWERS[index]
}

async function saveQuestion(submittedQuestion, result) {
  try {
    const batch = writeBatch(firestore)
    const questionRef = doc(collection(firestore, 'eightBallQuestions'))

    batch.set(questionRef, {
      question: submittedQuestion,
      answer: result.text,
      answerType: result.type,
      createdAt: serverTimestamp(),
      source: 'mxn.au/8ball',
    })
    stageCounterIncrement(batch, 'questions')
    await batch.commit()
  } catch (error) {
    console.warn('[EightBall] Could not save question:', error)
  }
}

function askTheBall() {
  if (isThinking.value) return

  const submittedQuestion = question.value.trim()
  validationMessage.value = ''

  if (submittedQuestion.length < 3) {
    validationMessage.value = 'Give the universe a little more to work with.'
    questionInput.value?.focus()
    return
  }

  const result = chooseAnswer()
  answer.value = ''
  isThinking.value = true

  window.setTimeout(() => {
    answer.value = result.text
    isThinking.value = false
  }, 1050)

  void saveQuestion(submittedQuestion, result)
}

function resetOracle() {
  question.value = ''
  answer.value = ''
  validationMessage.value = ''

  nextTick(() => questionInput.value?.focus())
}
</script>

<style scoped>
.eight-ball-page {
  --ink: #f7f4ff;
  --muted: #aaa3bd;
  position: relative;
  display: flex;
  height: 100dvh;
  min-height: 38rem;
  flex-direction: column;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(1rem, 2.5vh, 1.5rem) clamp(1.1rem, 4vw, 4.5rem) clamp(0.8rem, 2vh, 1.25rem);
  color: var(--ink);
  background:
    radial-gradient(circle at 28% 42%, rgba(89, 41, 160, 0.22), transparent 32rem),
    radial-gradient(circle at 88% 8%, rgba(84, 36, 138, 0.16), transparent 27rem),
    linear-gradient(145deg, #08070c 0%, #0c0912 45%, #050507 100%);
  font-family: "Noto Sans Display", ui-sans-serif, system-ui, sans-serif;
}

.ambient {
  position: absolute;
  z-index: -2;
  border-radius: 999px;
  filter: blur(90px);
  pointer-events: none;
}

.ambient-one {
  width: 22rem;
  height: 22rem;
  top: 20%;
  left: -10rem;
  background: rgba(107, 62, 194, 0.18);
}

.ambient-two {
  width: 17rem;
  height: 17rem;
  right: -6rem;
  bottom: 8%;
  background: rgba(70, 44, 112, 0.14);
}

.stars {
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: 0.42;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 12% 17%, rgba(255, 255, 255, 0.65) 0 1px, transparent 1.5px),
    radial-gradient(circle at 76% 22%, rgba(255, 255, 255, 0.4) 0 1px, transparent 1.5px),
    radial-gradient(circle at 42% 79%, rgba(255, 255, 255, 0.35) 0 1px, transparent 1.5px),
    radial-gradient(circle at 92% 68%, rgba(255, 255, 255, 0.5) 0 1px, transparent 1.5px);
  background-size: 19rem 17rem, 23rem 21rem, 29rem 24rem, 17rem 20rem;
}

.page-header,
.page-footer {
  width: min(100%, 84rem);
  margin-inline: auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: #e9e5f1;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.55rem;
  color: #fff;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  font-size: 0.9rem;
  letter-spacing: 0;
}

.experience {
  display: grid;
  width: min(100%, 78rem);
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.78fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: center;
  margin: clamp(0.75rem, 2vh, 1.5rem) auto 0;
}

.oracle-showcase {
  display: flex;
  width: min(100%, 78rem);
  min-height: 0;
  align-self: stretch;
  flex-direction: column;
  justify-content: center;
}

.intro {
  width: min(100%, 46rem);
}

.panel-kicker {
  color: #8e849f;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
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
  color: var(--muted);
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  line-height: 1.5;
}

.question-count {
  margin-top: clamp(0.85rem, 2vh, 1.35rem);
}

.ball-stage {
  display: grid;
  min-height: 0;
  flex: 1;
  place-items: center;
  padding: clamp(0.25rem, 1vh, 0.65rem) 0;
  perspective: 1000px;
}

.magic-ball {
  position: relative;
  display: grid;
  width: min(34vw, 41vh, 22rem);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.13), transparent 14%),
    radial-gradient(circle at 50% 48%, #1b1920 0%, #0c0b0f 48%, #020203 77%);
  box-shadow:
    inset -2.2rem -2.5rem 4.4rem rgba(0, 0, 0, 0.92),
    inset 1.5rem 1.25rem 3rem rgba(255, 255, 255, 0.035),
    0 3.3rem 4.5rem -2.2rem rgba(0, 0, 0, 0.95),
    0 0 5rem rgba(92, 53, 155, 0.08);
  transform: translateZ(0);
  transition: filter 0.5s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.magic-ball::after {
  position: absolute;
  z-index: -1;
  width: 78%;
  height: 16%;
  bottom: -5%;
  left: 11%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.88);
  content: "";
  filter: blur(1.35rem);
}

.magic-ball.answered {
  filter: drop-shadow(0 0 1.6rem rgba(105, 66, 180, 0.12));
  transform: translateY(-0.3rem);
}

.ball-highlight {
  position: absolute;
  width: 31%;
  height: 15%;
  top: 8%;
  left: 19%;
  border-radius: 50%;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.1), transparent 70%);
  filter: blur(0.45rem);
  transform: rotate(-22deg);
}

.ball-rim {
  display: grid;
  width: 57%;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 50%;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.06), transparent 40%),
    #07070a;
  box-shadow:
    inset 0 0 2rem rgba(0, 0, 0, 0.92),
    0 0.85rem 2.2rem rgba(0, 0, 0, 0.75);
}

.answer-window {
  display: grid;
  width: 79%;
  aspect-ratio: 1;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(116, 91, 178, 0.22);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 44%, rgba(75, 48, 126, 0.5), transparent 43%),
    linear-gradient(150deg, #151020, #080710);
  box-shadow:
    inset 0 0 2.4rem #020204,
    inset 0 0 1rem rgba(124, 87, 191, 0.22),
    0 0 1.5rem rgba(96, 61, 160, 0.12);
}

.answer-triangle {
  position: relative;
  display: grid;
  width: 82%;
  aspect-ratio: 1.08;
  place-items: center;
  color: #ebe4ff;
}

.answer-triangle::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 66%, rgba(175, 144, 235, 0.2), transparent 50%),
    linear-gradient(180deg, #7f61ba, #3e2b71 62%, #281d4c);
  clip-path: polygon(50% 100%, 2% 8%, 98% 8%);
  content: "";
  filter: drop-shadow(0 0 0.75rem rgba(138, 103, 201, 0.6));
}

.eight {
  position: relative;
  z-index: 1;
  margin-top: -8%;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3rem, 6vw, 5.4rem);
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 0 1.2rem rgba(255, 255, 255, 0.18);
}

.answer-text {
  position: relative;
  z-index: 1;
  top: -7%;
  display: flex;
  width: 84%;
  max-width: 8.5rem;
  flex-direction: column;
  align-items: center;
  gap: 0.02em;
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(0.62rem, 1vw, 0.83rem);
  font-weight: 700;
  letter-spacing: 0.055em;
  line-height: 1.08;
  text-align: center;
  text-shadow: 0 0 0.8rem rgba(224, 210, 255, 0.42);
  text-transform: uppercase;
  animation: answer-arrive 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.answer-text span {
  display: block;
  white-space: nowrap;
}

.thinking-dots {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.28rem;
}

.thinking-dots i {
  width: 0.34rem;
  height: 0.34rem;
  border-radius: 50%;
  background: #e4d8ff;
  box-shadow: 0 0 0.7rem rgba(228, 216, 255, 0.65);
  animation: oracle-dot 0.8s ease-in-out infinite alternate;
}

.thinking-dots i:nth-child(2) {
  animation-delay: 0.16s;
}

.thinking-dots i:nth-child(3) {
  animation-delay: 0.32s;
}

.magic-ball.shaking {
  animation: shake-ball 0.78s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.answer-announcement {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.question-panel {
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
  font-size: 8.5rem;
  font-weight: 700;
  letter-spacing: -0.1em;
  line-height: 1;
  pointer-events: none;
}

.question-panel h2 {
  position: relative;
  max-width: 20rem;
  margin: 0.4rem 0 clamp(1rem, 2vh, 1.5rem);
  font-family: "Rubik", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.65rem, 4.4vh, 2.3rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

form label {
  display: block;
  margin-bottom: 0.6rem;
  color: #9890a8;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.question-field {
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.85rem;
  background: rgba(4, 4, 7, 0.56);
  box-shadow: inset 0 1px 1rem rgba(0, 0, 0, 0.18);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.question-field.focused {
  border-color: rgba(151, 116, 218, 0.72);
  box-shadow:
    0 0 0 3px rgba(139, 92, 246, 0.1),
    inset 0 1px 1rem rgba(0, 0, 0, 0.18);
}

textarea {
  display: block;
  width: 100%;
  min-height: clamp(6rem, 15vh, 7.5rem);
  resize: none;
  border: 0;
  outline: 0;
  padding: 1rem 1rem 2rem;
  color: #f4effc;
  background: transparent;
  font: inherit;
  font-size: 1rem;
  line-height: 1.55;
}

textarea::placeholder {
  color: #625d6c;
}

textarea:disabled {
  cursor: wait;
  opacity: 0.72;
}

.character-count {
  position: absolute;
  right: 0.85rem;
  bottom: 0.65rem;
  color: #5f5969;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
}

.validation-message {
  margin: 0.6rem 0 0;
  color: #d3b8ff;
  font-size: 0.78rem;
}

.ask-button {
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

.ask-button:not(:disabled):hover {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.ask-button:not(:disabled):active {
  transform: translateY(0);
}

.ask-button:focus-visible,
.ask-another:focus-visible,
.brand:focus-visible {
  outline: 2px solid #c8aaff;
  outline-offset: 3px;
}

.ask-button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.button-loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.ask-another {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 1rem auto 0;
  border: 0;
  color: #a79daf;
  background: transparent;
  font-size: 0.76rem;
  transition: color 0.2s ease;
}

.ask-another:hover {
  color: #e8ddff;
}

.keyboard-hint {
  margin: clamp(0.75rem, 1.7vh, 1rem) 0 0;
  color: #5f5968;
  font-size: 0.64rem;
  text-align: center;
}

kbd {
  padding: 0.12rem 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 0.25rem;
  color: #82798d;
  background: rgba(255, 255, 255, 0.035);
  font: inherit;
}

.page-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: none;
  margin-top: clamp(0.35rem, 1vh, 0.65rem);
  color: #4d4854;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.17em;
}

.footer-line {
  width: 2.5rem;
  height: 1px;
  background: #37333d;
}

@keyframes shake-ball {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  15% { transform: translate3d(-0.9rem, 0.2rem, 0) rotate(-4deg); }
  30% { transform: translate3d(0.8rem, -0.35rem, 0) rotate(3deg); }
  45% { transform: translate3d(-0.65rem, 0.25rem, 0) rotate(-2deg); }
  60% { transform: translate3d(0.55rem, -0.18rem, 0) rotate(2deg); }
  75% { transform: translate3d(-0.3rem, 0.1rem, 0) rotate(-1deg); }
}

@keyframes answer-arrive {
  from { opacity: 0; transform: translateY(0.65rem) scale(0.9); filter: blur(0.2rem); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes oracle-dot {
  from { opacity: 0.35; transform: translateY(0.15rem); }
  to { opacity: 1; transform: translateY(-0.15rem); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 850px) {
  .eight-ball-page {
    height: auto;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .experience {
    min-height: auto;
    flex: none;
    grid-template-columns: 1fr;
    gap: 0.85rem;
    margin-top: 1.5rem;
  }

  .oracle-showcase {
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
    margin-top: 0.7rem;
    margin-inline: auto;
    font-size: 0.88rem;
    line-height: 1.45;
  }

  .question-count {
    margin: 0.8rem auto 0;
  }

  .ball-stage {
    flex: none;
    padding: 0.55rem 0 0.8rem;
  }

  .magic-ball {
    width: min(64vw, 16rem);
  }

  .question-panel {
    width: min(100%, 34rem);
    justify-self: center;
    margin-inline: auto;
    padding: 1.2rem;
  }

  .question-panel h2 {
    margin-bottom: 1rem;
    font-size: 1.7rem;
  }

  textarea {
    min-height: 5.4rem;
  }

  .ask-button {
    min-height: 3rem;
  }

  .ask-another {
    margin-top: 0.7rem;
  }

  .page-footer {
    display: none;
  }
}

@media (max-width: 520px) {
  .eight-ball-page {
    padding-inline: 1rem;
  }

  .experience {
    margin-top: 1.2rem;
  }

  .intro h1 {
    font-size: clamp(3rem, 16vw, 4.2rem);
  }

  .lede {
    display: none;
  }

  .question-count {
    margin-top: 0.65rem;
  }

  .magic-ball {
    width: min(62vw, 15.25rem);
  }

  .ball-stage {
    padding: 0.35rem 0 0.6rem;
  }

  .question-panel {
    padding: 1.1rem;
  }

  .question-panel h2 {
    margin-bottom: 0.9rem;
  }

  .keyboard-hint {
    display: none;
  }

}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
