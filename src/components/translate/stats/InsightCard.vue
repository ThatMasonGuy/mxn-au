<template>
    <div class="relative group">
        <div
            class="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl blur-lg opacity-60">
        </div>
        <div class="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div class="flex items-center space-x-3 mb-4">
                <div class="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                    <Lightbulb class="w-6 h-6 text-amber-400" />
                </div>
                <h3 class="text-lg font-bold text-white">Personal Insights</h3>
            </div>
            <div class="space-y-3">
                <div v-for="insight in insights" :key="insight.title" class="bg-white/5 rounded-xl p-4">
                    <h4 class="font-semibold text-amber-300 mb-2">{{ insight.title }}</h4>
                    <p class="text-white/70 text-sm">{{ insight.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Lightbulb } from 'lucide-vue-next'

// Props
defineProps({
    insights: {
        type: Array,
        required: true,
        validator: (insights) => {
            return insights.every(insight =>
                insight.title &&
                insight.description
            )
        }
    }
})
</script>