import { computed, onMounted, onUnmounted, reactive } from 'vue'
import {
  doc,
  increment,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { firestore } from '@/firebase'

export const DIE_TYPES = [4, 6, 8, 10, 12, 20, 100]
export const PRIMARY_COUNTER_IDS = ['questions', 'coin-flips', 'dice-total']
export const DIE_COUNTER_IDS = DIE_TYPES.map((sides) => `dice-d${sides}`)
export const ALL_COUNTER_IDS = [...PRIMARY_COUNTER_IDS, ...DIE_COUNTER_IDS]

const counts = reactive(
  Object.fromEntries(ALL_COUNTER_IDS.map((counterId) => [counterId, 0])),
)
const subscriptions = new Map()

export function funCounterRef(counterId) {
  return doc(firestore, 'funCounters', counterId)
}

export function stageCounterIncrement(batch, counterId) {
  batch.set(funCounterRef(counterId), { count: increment(1) }, { merge: true })
}

export async function incrementCounter(counterId) {
  await setDoc(
    funCounterRef(counterId),
    { count: increment(1) },
    { merge: true },
  )
}

export async function incrementDiceCounter(sides) {
  const batch = writeBatch(firestore)
  stageCounterIncrement(batch, 'dice-total')
  stageCounterIncrement(batch, `dice-d${sides}`)
  await batch.commit()
}

function retainCounter(counterId) {
  const existing = subscriptions.get(counterId)

  if (existing) {
    existing.consumers += 1
    return
  }

  const subscription = {
    consumers: 1,
    unsubscribe: onSnapshot(
      funCounterRef(counterId),
      (snapshot) => {
        counts[counterId] = snapshot.exists() ? snapshot.data().count || 0 : 0
      },
      (error) => {
        console.warn(`[FunCounters] Could not read ${counterId}:`, error)
      },
    ),
  }

  subscriptions.set(counterId, subscription)
}

function releaseCounter(counterId) {
  const subscription = subscriptions.get(counterId)
  if (!subscription) return

  subscription.consumers -= 1
  if (subscription.consumers > 0) return

  subscription.unsubscribe()
  subscriptions.delete(counterId)
}

export function useFunCounters(counterIds = PRIMARY_COUNTER_IDS) {
  const uniqueIds = [...new Set(counterIds)]

  onMounted(() => uniqueIds.forEach(retainCounter))
  onUnmounted(() => uniqueIds.forEach(releaseCounter))

  return {
    questionsAsked: computed(() => counts.questions),
    coinsFlipped: computed(() => counts['coin-flips']),
    diceRolled: computed(() => counts['dice-total']),
    diceByType: computed(() =>
      Object.fromEntries(
        DIE_TYPES.map((sides) => [sides, counts[`dice-d${sides}`]]),
      ),
    ),
  }
}
