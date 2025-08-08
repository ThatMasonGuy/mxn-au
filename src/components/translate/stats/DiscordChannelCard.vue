<template>
    <div class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
                <Hash class="w-5 h-5 text-cyan-400" />
                <div>
                    <h4 class="font-semibold text-white text-sm"># {{ channel.name }}</h4>
                    <p class="text-white/60 text-xs">{{ channel.guildName }}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-cyan-400 font-bold text-lg">{{ rank }}</div>
                <div class="text-white/50 text-xs">rank</div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Translations</div>
                <div class="text-white font-semibold">{{ channel.translations.toLocaleString() }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Users</div>
                <div class="text-white font-semibold">{{ channel.uniqueUsers }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Hash } from 'lucide-vue-next'

// Props
defineProps({
    channel: {
        type: Object,
        required: true,
        validator: (channel) => {
            return channel.name &&
                channel.guildName &&
                typeof channel.translations === 'number' &&
                typeof channel.uniqueUsers === 'number'
        }
    },
    rank: {
        type: Number,
        required: true
    }
})
</script>