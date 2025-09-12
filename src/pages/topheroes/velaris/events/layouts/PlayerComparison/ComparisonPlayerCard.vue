<!-- @/pages/topheroes/velaris/events/layouts/PlayerComparison/ComparisonPlayerCard.vue -->
<template>
    <div class="border rounded-xl p-4 shadow bg-card transition-transform transform hover:-translate-y-1 hover:shadow-lg"
        :style="cardStyle" @mouseenter="$emit('hover', player.Player)" @mouseleave="$emit('leave')">
        <h3 class="font-bold text-lg mb-3" :style="{
            color: player.Player === 'Average Player'
                ? 'hsl(var(--velaris-purple))'
                : color
        }">
            {{ player.Player }}
        </h3>

        <dl class="grid grid-cols-2 gap-4 text-sm">
            <div v-for="field in fields" :key="field.key" class="space-y-1">
                <dt class="font-medium text-muted-foreground">{{ field.label }}</dt>
                <dd class="text-foreground font-semibold">
                    {{ field.fmt(player[field.key] ?? 0) }}
                </dd>
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
defineEmits(['hover', 'leave'])

const cardStyle = computed(() => {
    const c = props.color || 'hsl(var(--accent))'
    return {
        // accent border that works in all themes
        borderColor: c,
        // readable tinted background against --card in light/dark
        background:
            `color-mix(in srgb, hsl(var(--card)) 88%, ${c} 12%)`
    }
})
</script>