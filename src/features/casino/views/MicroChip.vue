<!-- MicroChip.vue -->
<template>
    <div class="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white shadow-lg flex items-center justify-center">
      <span class="text-[8px] font-black text-white">${{ amount }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    amount: {
      type: Number,
      required: true
    }
  })
  </script>