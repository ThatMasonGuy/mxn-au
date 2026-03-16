<!-- BettingTable.vue - Fixed street betting column -->
<template>
    <div class="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
      <h3 class="text-white font-bold mb-6">Betting Table</h3>
      
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full">
          <div class="flex gap-2">
            <!-- Zero Section -->
            <div class="flex flex-col">
              <div class="relative group">
                <button
                  @click="emit('place-bet', { type: 'straight', numbers: [0], name: '0' })"
                  @mouseenter="emit('hover-bet', { type: 'straight', numbers: [0] })"
                  @mouseleave="emit('hover-bet', null)"
                  :disabled="spinning"
                  class="relative w-16 h-[408px] bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-black text-white text-2xl transition-colors duration-200 hover:shadow-lg hover:shadow-green-500/50 flex items-center justify-center"
                  :class="{ 'ring-4 ring-yellow-400': isHovered({ type: 'straight', numbers: [0] }) }"
                >
                  <span class="rotate-90">0</span>
                  
                  <ChipStack v-if="getBetAmount({ type: 'straight', numbers: [0] }) > 0" :amount="getBetAmount({ type: 'straight', numbers: [0] })" />
                </button>
              </div>
            </div>
  
            <!-- Main Grid Container with Street Bets -->
            <div class="flex-1">
              <div class="relative">
                <!-- Street Bets Overlay (invisible hitboxes on left edge) -->
                <div class="absolute left-0 top-0 h-full w-8 -ml-4 z-30 flex flex-col gap-0.5">
                  <button
                    v-for="col in 12"
                    :key="`street-${col}`"
                    @click="emit('place-bet', { type: 'street', numbers: [col * 3 - 2, col * 3 - 1, col * 3], name: `Street ${col * 3 - 2}-${col * 3}` })"
                    @mouseenter="emit('hover-bet', { type: 'street', numbers: [col * 3 - 2, col * 3 - 1, col * 3] })"
                    @mouseleave="emit('hover-bet', null)"
                    :disabled="spinning"
                    class="relative h-32 bg-transparent hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 flex items-center justify-center group/street"
                  >
                    <!-- Street indicator -->
                    <div 
                      class="absolute inset-y-2 left-1/2 transform -translate-x-1/2 w-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50 opacity-0 group-hover/street:opacity-100 transition-opacity duration-200 rounded-full"
                      :class="{ '!opacity-100': isHovered({ type: 'street', numbers: [col * 3 - 2, col * 3 - 1, col * 3] }) }"
                    ></div>
                    <MicroChip 
                      v-if="getBetAmount({ type: 'street', numbers: [col * 3 - 2, col * 3 - 1, col * 3] }) > 0" 
                      :amount="getBetAmount({ type: 'street', numbers: [col * 3 - 2, col * 3 - 1, col * 3] })"
                    />
                  </button>
                </div>
  
                <!-- Main Numbers Grid -->
                <div class="grid gap-0.5" style="grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(3, 1fr);">
                  <!-- Number Buttons Grid -->
                  <template v-for="row in 3" :key="`row-${row}`">
                    <template v-for="col in 12" :key="`num-${row}-${col}`">
                      <div class="relative">
                        <button
                          @click="emit('place-bet', { type: 'straight', numbers: [getNumberFromPosition(row, col)], name: String(getNumberFromPosition(row, col)) })"
                          @mouseenter="emit('hover-bet', { type: 'straight', numbers: [getNumberFromPosition(row, col)] })"
                          @mouseleave="emit('hover-bet', null)"
                          :disabled="spinning"
                          class="relative w-full h-32 rounded font-bold text-white text-xl transition-colors duration-200 hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          :class="[
                            isRed(getNumberFromPosition(row, col)) ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/50' : 'bg-gray-800 hover:bg-gray-700',
                            { 'ring-4 ring-yellow-400 ring-inset': isHovered({ type: 'straight', numbers: [getNumberFromPosition(row, col)] }) }
                          ]"
                        >
                          {{ getNumberFromPosition(row, col) }}
                          <ChipStack v-if="getBetAmount({ type: 'straight', numbers: [getNumberFromPosition(row, col)] }) > 0" :amount="getBetAmount({ type: 'straight', numbers: [getNumberFromPosition(row, col)] })" />
                        </button>
  
                        <!-- Horizontal Split (between rows) - Bottom edge -->
                        <div 
                          v-if="row < 3"
                          @click="emit('place-bet', { type: 'split', numbers: getSplitNumbers(row, col, 'horizontal'), name: `Split ${getSplitNumbers(row, col, 'horizontal').join('/')}` })"
                          @mouseenter="hoveredZone = `h-split-${row}-${col}`; emit('hover-bet', { type: 'split', numbers: getSplitNumbers(row, col, 'horizontal') })"
                          @mouseleave="hoveredZone = null; emit('hover-bet', null)"
                          class="absolute bottom-0 left-0 right-0 h-4 -mb-2 z-20 cursor-pointer group/split"
                          :class="{ 'pointer-events-none': spinning }"
                        >
                          <!-- Split indicator - longer bar -->
                          <div 
                            class="absolute inset-x-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/split:opacity-100 transition-opacity duration-200"
                            :class="{ '!opacity-100': isHovered({ type: 'split', numbers: getSplitNumbers(row, col, 'horizontal') }) }"
                          >
                            <div class="w-full h-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50 rounded-full"></div>
                          </div>
                          <MicroChip 
                            v-if="getBetAmount({ type: 'split', numbers: getSplitNumbers(row, col, 'horizontal') }) > 0" 
                            :amount="getBetAmount({ type: 'split', numbers: getSplitNumbers(row, col, 'horizontal') })"
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
  
                        <!-- Vertical Split (between columns) - Right edge -->
                        <div 
                          v-if="col < 12"
                          @click="emit('place-bet', { type: 'split', numbers: getSplitNumbers(row, col, 'vertical'), name: `Split ${getSplitNumbers(row, col, 'vertical').join('/')}` })"
                          @mouseenter="hoveredZone = `v-split-${row}-${col}`; emit('hover-bet', { type: 'split', numbers: getSplitNumbers(row, col, 'vertical') })"
                          @mouseleave="hoveredZone = null; emit('hover-bet', null)"
                          class="absolute right-0 top-0 bottom-0 w-4 -mr-2 z-20 cursor-pointer group/split"
                          :class="{ 'pointer-events-none': spinning }"
                        >
                          <!-- Split indicator - longer bar -->
                          <div 
                            class="absolute inset-y-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/split:opacity-100 transition-opacity duration-200"
                            :class="{ '!opacity-100': isHovered({ type: 'split', numbers: getSplitNumbers(row, col, 'vertical') }) }"
                          >
                            <div class="h-full w-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50 rounded-full"></div>
                          </div>
                          <MicroChip 
                            v-if="getBetAmount({ type: 'split', numbers: getSplitNumbers(row, col, 'vertical') }) > 0" 
                            :amount="getBetAmount({ type: 'split', numbers: getSplitNumbers(row, col, 'vertical') })"
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
  
                        <!-- Corner Bet (4-way intersection) - Bottom-right corner -->
                        <div 
                          v-if="row < 3 && col < 12"
                          @click="emit('place-bet', { type: 'corner', numbers: getCornerNumbers(row, col), name: `Corner ${getCornerNumbers(row, col).join('/')}` })"
                          @mouseenter="hoveredZone = `corner-${row}-${col}`; emit('hover-bet', { type: 'corner', numbers: getCornerNumbers(row, col) })"
                          @mouseleave="hoveredZone = null; emit('hover-bet', null)"
                          class="absolute bottom-0 right-0 w-8 h-8 -mb-4 -mr-4 z-30 cursor-pointer group/corner"
                          :class="{ 'pointer-events-none': spinning }"
                        >
                          <!-- Corner indicator (cross shape) - longer bars -->
                          <div 
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/corner:opacity-100 transition-opacity duration-200"
                            :class="{ '!opacity-100': isHovered({ type: 'corner', numbers: getCornerNumbers(row, col) }) }"
                          >
                            <div class="absolute w-10 h-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50 rounded-full"></div>
                            <div class="absolute h-10 w-1.5 bg-yellow-400 shadow-lg shadow-yellow-400/50 rounded-full"></div>
                            <div class="absolute w-3 h-3 rounded-full bg-yellow-400"></div>
                          </div>
                          <MicroChip 
                            v-if="getBetAmount({ type: 'corner', numbers: getCornerNumbers(row, col) }) > 0" 
                            :amount="getBetAmount({ type: 'corner', numbers: getCornerNumbers(row, col) })"
                            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
  
                <!-- Column Bets (2:1) -->
                <div class="flex gap-0.5 mt-2">
                  <button
                    v-for="colNum in 3"
                    :key="`col-${colNum}`"
                    @click="emit('place-bet', { type: 'column', numbers: getColumnNumbers(colNum), name: `Column ${colNum}` })"
                    @mouseenter="emit('hover-bet', { type: 'column', numbers: getColumnNumbers(colNum) })"
                    @mouseleave="emit('hover-bet', null)"
                    :disabled="spinning"
                    class="relative flex-1 h-16 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white text-sm transition-colors duration-200 hover:shadow-lg flex items-center justify-center"
                    :class="{ 'ring-4 ring-yellow-400': isHovered({ type: 'column', numbers: getColumnNumbers(colNum) }) }"
                  >
                    2:1
                    <ChipStack v-if="getBetAmount({ type: 'column', numbers: getColumnNumbers(colNum) }) > 0" :amount="getBetAmount({ type: 'column', numbers: getColumnNumbers(colNum) })" />
                  </button>
                </div>
  
                <!-- Dozens -->
                <div class="flex gap-2 mt-2">
                  <button
                    v-for="dozen in 3"
                    :key="`dozen-${dozen}`"
                    @click="emit('place-bet', { type: 'dozen', numbers: getDozenNumbers(dozen), name: `${dozen}${dozen === 1 ? 'st' : dozen === 2 ? 'nd' : 'rd'} 12` })"
                    @mouseenter="emit('hover-bet', { type: 'dozen', numbers: getDozenNumbers(dozen) })"
                    @mouseleave="emit('hover-bet', null)"
                    :disabled="spinning"
                    class="relative flex-1 h-16 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors duration-200 hover:shadow-lg flex items-center justify-center"
                    :class="{ 'ring-4 ring-yellow-400': isHovered({ type: 'dozen', numbers: getDozenNumbers(dozen) }) }"
                  >
                    {{ dozen }}{{ dozen === 1 ? 'st' : dozen === 2 ? 'nd' : 'rd' }} 12
                    <ChipStack v-if="getBetAmount({ type: 'dozen', numbers: getDozenNumbers(dozen) }) > 0" :amount="getBetAmount({ type: 'dozen', numbers: getDozenNumbers(dozen) })" />
                  </button>
                </div>
  
                <!-- Outside Bets -->
                <div class="grid grid-cols-6 gap-2 mt-2">
                  <button
                    v-for="outside in outsideBets"
                    :key="outside.name"
                    @click="emit('place-bet', { type: 'outside', numbers: outside.numbers, name: outside.name })"
                    @mouseenter="emit('hover-bet', { type: 'outside', numbers: outside.numbers })"
                    @mouseleave="emit('hover-bet', null)"
                    :disabled="spinning"
                    class="relative h-16 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white text-sm transition-colors duration-200 hover:shadow-lg flex items-center justify-center"
                    :class="[
                      outside.color,
                      { 'ring-4 ring-yellow-400': isHovered({ type: 'outside', numbers: outside.numbers }) }
                    ]"
                  >
                    {{ outside.label }}
                    <ChipStack v-if="getBetAmount({ type: 'outside', numbers: outside.numbers }) > 0" :amount="getBetAmount({ type: 'outside', numbers: outside.numbers })" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import ChipStack from './ChipStack.vue'
  import MicroChip from './MicroChip.vue'
  
  const props = defineProps({
    bets: {
      type: Array,
      required: true
    },
    hoveredBet: {
      type: Object,
      default: null
    },
    spinning: {
      type: Boolean,
      required: true
    }
  })
  
  const emit = defineEmits(['place-bet', 'hover-bet'])
  
  const hoveredZone = ref(null)
  
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  
  const outsideBets = [
    {
      name: '1-18',
      label: '1-18',
      numbers: Array.from({length: 18}, (_, i) => i + 1),
      color: 'bg-gray-900 hover:bg-gray-800'
    },
    {
      name: 'EVEN',
      label: 'EVEN',
      numbers: [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
      color: 'bg-gray-900 hover:bg-gray-800'
    },
    {
      name: 'RED',
      label: 'RED',
      numbers: redNumbers,
      color: 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/50'
    },
    {
      name: 'BLACK',
      label: 'BLACK',
      numbers: [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35],
      color: 'bg-gray-800 hover:bg-gray-700'
    },
    {
      name: 'ODD',
      label: 'ODD',
      numbers: [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],
      color: 'bg-gray-900 hover:bg-gray-800'
    },
    {
      name: '19-36',
      label: '19-36',
      numbers: Array.from({length: 18}, (_, i) => i + 19),
      color: 'bg-gray-900 hover:bg-gray-800'
    }
  ]
  
  const isRed = (num) => redNumbers.includes(num)
  
  const isHovered = (bet) => {
    if (!props.hoveredBet) return false
    return JSON.stringify(bet.numbers.sort()) === JSON.stringify(props.hoveredBet.numbers.sort())
  }
  
  const getBetAmount = (bet) => {
    const betKey = JSON.stringify(bet.numbers.sort())
    const existingBet = props.bets.find(
      b => JSON.stringify(b.numbers.sort()) === betKey
    )
    return existingBet ? existingBet.amount : 0
  }
  
  const getNumberFromPosition = (row, col) => {
    if (row === 1) return col * 3
    if (row === 2) return col * 3 - 1
    if (row === 3) return col * 3 - 2
    return 0
  }
  
  const getSplitNumbers = (row, col, direction) => {
    if (direction === 'horizontal') {
      const num1 = getNumberFromPosition(row, col)
      const num2 = getNumberFromPosition(row + 1, col)
      return [num1, num2].sort((a, b) => a - b)
    } else if (direction === 'vertical') {
      const num1 = getNumberFromPosition(row, col)
      const num2 = getNumberFromPosition(row, col + 1)
      return [num1, num2].sort((a, b) => a - b)
    }
    return []
  }
  
  const getCornerNumbers = (row, col) => {
    const topLeft = getNumberFromPosition(row, col)
    const topRight = getNumberFromPosition(row, col + 1)
    const bottomLeft = getNumberFromPosition(row + 1, col)
    const bottomRight = getNumberFromPosition(row + 1, col + 1)
    return [topLeft, topRight, bottomLeft, bottomRight].sort((a, b) => a - b)
  }
  
  const getColumnNumbers = (colNum) => {
    const numbers = []
    for (let i = colNum; i <= 36; i += 3) {
      numbers.push(i)
    }
    return numbers
  }
  
  const getDozenNumbers = (dozen) => {
    return Array.from({length: 12}, (_, i) => (dozen - 1) * 12 + i + 1)
  }
  </script>