<template>
    <div class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
                <div
                    class="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User class="w-4 h-4 text-white" />
                </div>
                <div>
                    <h4 class="font-semibold text-white text-sm">Discord User</h4>
                    <p class="text-white/60 text-xs">{{ user.translations.toLocaleString() }} translations</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-green-400 font-bold text-lg">{{ rank }}</div>
                <div class="text-white/50 text-xs">rank</div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Words</div>
                <div class="text-white font-semibold">{{ user.words.toLocaleString() }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Saved</div>
                <div class="text-white font-semibold">${{ user.costSaved.toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { User } from 'lucide-vue-next'

// Props
defineProps({
    user: {
        type: Object,
        required: true,
        validator: (user) => {
            return typeof user.translations === 'number' &&
                typeof user.words === 'number' &&
                typeof user.costSaved === 'number'
        }
    },
    rank: {
        type: Number,
        required: true
    }
})
</script>