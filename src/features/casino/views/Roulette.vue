<!-- Roulette.vue - Updated layout section -->
<template>
    <div class="min-h-screen bg-black relative overflow-hidden">
      <CasinoHeader @login="handleLogin" @signup="handleSignup" />
      
      <!-- Animated Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-green-900/20"></div>
        <BackgroundParticles />
      </div>
  
      <div class="relative z-10 container mx-auto px-4 py-8">
        <!-- Game Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-4xl font-black text-white mb-2">Roulette</h1>
              <p class="text-gray-400">Place your bets and spin the wheel</p>
            </div>
            <button
              @click="$router.push('/casino')"
              class="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200"
            >
              <ArrowLeft :size="20" />
              <span>Back to Casino</span>
            </button>
          </div>
  
          <!-- Stats Bar -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Balance</p>
              <p class="text-2xl font-black text-yellow-400 tabular-nums">${{ balance.toLocaleString() }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Bet</p>
              <p class="text-2xl font-black text-purple-400 tabular-nums">${{ totalBet.toLocaleString() }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Win</p>
              <p class="text-2xl font-black text-green-400 tabular-nums">${{ lastWin.toLocaleString() }}</p>
            </div>
            <div class="bg-gradient-to-br from-gray-900 to-black p-4 rounded-xl border border-gray-800">
              <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Round</p>
              <p class="text-2xl font-black text-blue-400 tabular-nums">{{ roundNumber }}</p>
            </div>
          </div>
        </div>
  
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <!-- Left Column - Wheel and Controls -->
          <div class="xl:col-span-1 space-y-6">
            <!-- Roulette Wheel -->
            <div class="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
              <h3 class="text-white font-bold mb-4">Wheel</h3>
              
              <div class="relative w-full aspect-square max-w-sm mx-auto">
                <!-- Wheel Container -->
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900 to-amber-950 shadow-2xl shadow-amber-500/20 p-4">
                  <!-- Spinning Wheel -->
                  <div 
                    ref="wheelRef"
                    class="relative w-full h-full rounded-full overflow-hidden wheel-spinner"
                    :style="{ transform: `rotate(${wheelRotation}deg)` }"
                  >
                    <!-- Wheel Segments -->
                    <svg class="w-full h-full" viewBox="0 0 200 200">
                      <g v-for="(num, index) in wheelNumbers" :key="index">
                        <path
                          :d="getSegmentPath(index)"
                          :fill="getNumberColor(num)"
                          stroke="#FFD700"
                          stroke-width="0.5"
                        />
                        <text
                          :x="getTextX(index)"
                          :y="getTextY(index)"
                          :transform="`rotate(${index * (360 / wheelNumbers.length) + (360 / wheelNumbers.length / 2)}, ${getTextX(index)}, ${getTextY(index)})`"
                          text-anchor="middle"
                          dominant-baseline="middle"
                          fill="white"
                          font-size="6"
                          font-weight="bold"
                        >
                          {{ num }}
                        </text>
                      </g>
                    </svg>
                    
                    <!-- Center Circle -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg flex items-center justify-center">
                        <Sparkles :size="24" class="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Ball Indicator Arrow -->
                <div class="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div class="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500 drop-shadow-lg"></div>
                </div>
                
                <!-- Winning Number Display -->
                <div v-if="winningNumber !== null && showResult" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="bg-black/90 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-yellow-400 shadow-2xl shadow-yellow-500/50 animate-bounce-in">
                    <p class="text-sm text-gray-400 text-center mb-1">Winning Number</p>
                    <div class="flex items-center justify-center gap-3">
                      <div 
                        class="w-12 h-12 rounded-lg flex items-center justify-center font-black text-2xl"
                        :class="getNumberColor(winningNumber) === '#dc2626' ? 'bg-red-600' : getNumberColor(winningNumber) === '#000000' ? 'bg-gray-800' : 'bg-green-600'"
                      >
                        {{ winningNumber }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="space-y-3">
              <button
                @click="spin"
                :disabled="spinning || totalBet === 0"
                class="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <Play :size="20" v-if="!spinning" />
                <Loader2 :size="20" class="animate-spin" v-else />
                <span>{{ spinning ? 'SPINNING...' : 'SPIN' }}</span>
              </button>
              
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="clearBets"
                  :disabled="spinning"
                  class="py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RotateCcw :size="18" />
                  <span>Clear</span>
                </button>
                <button
                  @click="repeatBets"
                  :disabled="spinning || lastBets.length === 0"
                  class="py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-900/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Repeat :size="18" />
                  <span>Repeat</span>
                </button>
              </div>
            </div>
  
            <!-- Recent Numbers -->
            <div class="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
              <h3 class="text-white font-bold mb-4">Recent Numbers</h3>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(num, index) in recentNumbers"
                  :key="index"
                  class="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg"
                  :class="getNumberColor(num) === '#dc2626' ? 'bg-red-600' : getNumberColor(num) === '#000000' ? 'bg-gray-800' : 'bg-green-600'"
                >
                  {{ num }}
                </div>
                <div v-if="recentNumbers.length === 0" class="text-gray-500 text-sm">
                  No spins yet
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right Column - Betting Table and Chip Selector -->
          <div class="xl:col-span-2 space-y-6">
            <!-- Betting Table -->
            <BettingTable 
              :bets="bets"
              :hoveredBet="hoveredBet"
              :spinning="spinning"
              @place-bet="placeBet"
              @hover-bet="hoveredBet = $event"
            />
  
<!-- In Roulette.vue template, update the Chip Selection section -->
<!-- Chip Selection - Now below table with smaller chips -->
<div class="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
  <h3 class="text-white font-bold mb-4">Select Chip Value</h3>
  <div class="grid grid-cols-6 gap-3">
    <button
      v-for="chip in chipValues"
      :key="chip"
      @click="selectedChip = chip"
      class="relative group transition-transform duration-200"
      :class="selectedChip === chip ? 'scale-110' : ''"
    >
      <div 
        class="w-16 h-16 rounded-full flex items-center justify-center font-black text-white shadow-lg transition-all duration-200 hover:scale-110 border-4 border-white/20"
        :class="[
          getChipColor(chip),
          selectedChip === chip ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-black' : ''
        ]"
      >
        <span class="text-xs">${{ chip }}</span>
      </div>
    </button>
  </div>
</div>
</div>
        </div>
      </div>
  
      <CasinoFooter />
    </div>
  </template>
  
<!-- Roulette.vue - Update the spin function and chip styling -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CasinoHeader from './CasinoHeader.vue'
import CasinoFooter from './CasinoFooter.vue'
import BettingTable from './BettingTable.vue'
import BackgroundParticles from './BackgroundParticles.vue'
import { ArrowLeft, Play, RotateCcw, Repeat, Sparkles, Loader2 } from 'lucide-vue-next'

const router = useRouter()

// Game State
const balance = ref(10000)
const selectedChip = ref(5)
const bets = ref([])
const lastBets = ref([])
const spinning = ref(false)
const wheelRotation = ref(0)
const winningNumber = ref(null)
const showResult = ref(false)
const lastWin = ref(0)
const roundNumber = ref(0)
const recentNumbers = ref([])
const hoveredBet = ref(null)

const chipValues = [5, 10, 25, 50, 100, 500]

// Roulette wheel number order (European)
const wheelNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

const totalBet = computed(() => {
  return bets.value.reduce((sum, bet) => sum + bet.amount, 0)
})

const getNumberColor = (num) => {
  if (num === 0) return '#22c55e'
  return redNumbers.includes(num) ? '#dc2626' : '#000000'
}

const getChipColor = (value) => {
  const colors = {
    5: 'bg-red-500',
    10: 'bg-blue-500',
    25: 'bg-green-500',
    50: 'bg-purple-500',
    100: 'bg-yellow-500',
    500: 'bg-pink-500'
  }
  return colors[value] || 'bg-gray-400'
}

const placeBet = (bet) => {
  if (spinning.value) return
  
  const minBet = getMinBet(bet.type)
  
  if (balance.value < selectedChip.value) {
    alert('Insufficient balance!')
    return
  }

  const betKey = JSON.stringify(bet.numbers.sort())
  const existingBetIndex = bets.value.findIndex(
    b => JSON.stringify(b.numbers.sort()) === betKey
  )

  if (existingBetIndex >= 0) {
    bets.value[existingBetIndex].amount += selectedChip.value
  } else {
    if (selectedChip.value < minBet) {
      alert(`Minimum bet for this type is $${minBet}`)
      return
    }
    bets.value.push({
      ...bet,
      amount: selectedChip.value
    })
  }

  balance.value -= selectedChip.value
}

const getMinBet = (betType) => {
  if (betType === 'straight' || betType === 'split' || betType === 'street' || betType === 'corner') {
    return 5
  } else if (betType === 'dozen' || betType === 'column') {
    return 15
  } else if (betType === 'outside') {
    return 25
  }
  return 5
}

const clearBets = () => {
  if (spinning.value) return
  const totalBetAmount = totalBet.value
  balance.value += totalBetAmount
  bets.value = []
}

const repeatBets = () => {
  if (spinning.value || lastBets.value.length === 0) return
  
  const totalLastBet = lastBets.value.reduce((sum, bet) => sum + bet.amount, 0)
  if (balance.value < totalLastBet) {
    alert('Insufficient balance!')
    return
  }

  bets.value = JSON.parse(JSON.stringify(lastBets.value))
  balance.value -= totalLastBet
}

const spin = () => {
  if (spinning.value || totalBet.value === 0) return

  spinning.value = true
  showResult.value = false
  lastBets.value = JSON.parse(JSON.stringify(bets.value))
  roundNumber.value++

  // Generate winning number
  const randomIndex = Math.floor(Math.random() * wheelNumbers.length)
  winningNumber.value = wheelNumbers[randomIndex]

  // Calculate wheel rotation
  // We want the segment at randomIndex to end up at the top (where the arrow is)
  const degreesPerSegment = 360 / wheelNumbers.length
  const extraSpins = 10 * 360 // 10 full rotations
  
  // To get segment at randomIndex to the top, we need to rotate BACK by that many segments
  // Since the wheel rotates clockwise (positive), we add (totalSegments - randomIndex) segments
  const segmentsToRotate = wheelNumbers.length - randomIndex
  const targetRotation = segmentsToRotate * degreesPerSegment
  
  const newRotation = wheelRotation.value + extraSpins + targetRotation
  
  // Trigger animation
  requestAnimationFrame(() => {
    wheelRotation.value = newRotation
  })

  // Show result after spin
  setTimeout(() => {
    spinning.value = false
    showResult.value = true
    recentNumbers.value.unshift(winningNumber.value)
    if (recentNumbers.value.length > 10) recentNumbers.value.pop()

    calculateWinnings()

    setTimeout(() => {
      showResult.value = false
    }, 3000)
  }, 8000)
}

const calculateWinnings = () => {
  let totalWinnings = 0

  bets.value.forEach(bet => {
    if (bet.numbers.includes(winningNumber.value)) {
      let payout = 0
      
      if (bet.type === 'straight') {
        payout = bet.amount * 36
      } else if (bet.type === 'split') {
        payout = bet.amount * 18
      } else if (bet.type === 'street') {
        payout = bet.amount * 12
      } else if (bet.type === 'corner') {
        payout = bet.amount * 9
      } else if (bet.type === 'dozen' || bet.type === 'column') {
        payout = bet.amount * 3
      } else if (bet.type === 'outside') {
        payout = bet.amount * 2
      }

      totalWinnings += payout
    }
  })

  balance.value += totalWinnings
  lastWin.value = totalWinnings
  bets.value = []
}

const getSegmentPath = (index) => {
  const totalSegments = wheelNumbers.length
  const degreesPerSegment = 360 / totalSegments
  const startAngle = index * degreesPerSegment - 90
  const endAngle = startAngle + degreesPerSegment

  const startRad = (startAngle * Math.PI) / 180
  const endRad = (endAngle * Math.PI) / 180

  const innerRadius = 30
  const outerRadius = 100

  const x1 = 100 + outerRadius * Math.cos(startRad)
  const y1 = 100 + outerRadius * Math.sin(startRad)
  const x2 = 100 + outerRadius * Math.cos(endRad)
  const y2 = 100 + outerRadius * Math.sin(endRad)
  const x3 = 100 + innerRadius * Math.cos(endRad)
  const y3 = 100 + innerRadius * Math.sin(endRad)
  const x4 = 100 + innerRadius * Math.cos(startRad)
  const y4 = 100 + innerRadius * Math.sin(startRad)

  return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
}

const getTextX = (index) => {
  const degreesPerSegment = 360 / wheelNumbers.length
  const angle = index * degreesPerSegment + degreesPerSegment / 2 - 90
  const radius = 65
  return 100 + radius * Math.cos((angle * Math.PI) / 180)
}

const getTextY = (index) => {
  const degreesPerSegment = 360 / wheelNumbers.length
  const angle = index * degreesPerSegment + degreesPerSegment / 2 - 90
  const radius = 65
  return 100 + radius * Math.sin((angle * Math.PI) / 180)
}

const handleLogin = () => {
  console.log('Login clicked')
}

const handleSignup = () => {
  console.log('Signup clicked')
}
</script>
  
  <style scoped>
  @keyframes bounce-in {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out;
  }
  
  .wheel-spinner {
    transition: transform 8000ms cubic-bezier(0.17, 0.67, 0.12, 0.99);
    will-change: transform;
  }
  </style>