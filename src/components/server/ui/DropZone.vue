<!-- @/components/server/ui/DropZone.vue -->
<!-- Drop zone placeholder -->
<template>
    <div 
      class="col-span-4 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center p-4 component-item"
      :class="{ 'will-move': isAdjacent, 'border-blue-400': isDragging }"
      @dragover.prevent
      @drop="$emit('drop', $event)"
    >
      <div class="text-center" :class="isDragging ? 'text-blue-400' : 'text-gray-500'">
        <ArrowDownIcon class="h-8 w-8 mx-auto mb-2" />
        <p>Drop component here</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { ArrowDownIcon } from '@heroicons/vue/24/solid';
  
  const props = defineProps({
    isDragging: {
      type: Boolean,
      default: false
    },
    isAdjacent: {
      type: Boolean,
      default: false
    }
  });
  </script>