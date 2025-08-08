<template>
    <div class="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {{ guild.name.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                    <h4 class="font-semibold text-white text-sm">{{ guild.name }}</h4>
                    <p class="text-white/60 text-xs">{{ guild.translations.toLocaleString() }} translations</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-indigo-400 font-bold text-lg">{{ rank }}</div>
                <div class="text-white/50 text-xs">rank</div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Users</div>
                <div class="text-white font-semibold">{{ guild.uniqueUsers }}</div>
            </div>
            <div class="bg-white/5 rounded-lg p-2">
                <div class="text-white/60">Channels</div>
                <div class="text-white font-semibold">{{ guild.channels }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Props
defineProps({
    guild: {
        type: Object,
        required: true,
        validator: (guild) => {
            return guild.name &&
                typeof guild.translations === 'number' &&
                typeof guild.uniqueUsers === 'number' &&
                typeof guild.channels === 'number'
        }
    },
    rank: {
        type: Number,
        required: true
    }
})
</script>