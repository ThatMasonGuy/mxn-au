<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/ComparisonPlayerCard.vue -->
<template>
    <div class="border rounded-xl p-4 shadow bg-white transition-transform transform hover:-translate-y-1 hover:shadow-lg"
        :style="{
            borderColor: color,
            backgroundColor: washedColor
        }" @mouseenter="$emit('hover', player.Player)" @mouseleave="$emit('leave')">
        <h3 class="font-bold text-lg mb-3" :class="player.Player === 'Average Player' ? 'text-purple-600' : ''"
            :style="{ color }">
            {{ player.Player }}
        </h3>
        <dl class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="field in fields" :key="field.key" class="space-y-1">
                <dt class="font-medium text-gray-500">{{ field.label }}</dt>
                <dd class="text-gray-900 font-semibold">{{ field.fmt(player[field.key] ?? 0) }}</dd>
            </div>
        </dl>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
    player: Object,
    fields: Array,
    color: String
})

const emit = defineEmits(['hover', 'leave'])

const washedColor = computed(() => {
    // simple wash effect, you can replace this logic
    return props.color + '22'
})
</script>