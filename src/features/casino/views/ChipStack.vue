<!-- ChipStack.vue -->
<template>
    <div class="absolute top-2 right-2 pointer-events-none z-30">
      <div class="relative">
        <div 
          v-for="i in Math.min(chipCount, 5)" 
          :key="i" 
          class="w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center absolute"
          :style="{ 
            bottom: (i - 1) * 4 + 'px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
          }"
        >
        </div>
        <div 
          class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-lg flex items-center justify-center relative" 
          style="bottom: 0;"
        >
          <span class="text-xs font-black text-white drop-shadow">${{ amount }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    amount: {
      type: Number,
      required: true
    }
  })
  
  const chipCount = computed(() => Math.floor(props.amount / 5) + 1)
  </script>