<template>
    <div class="flex items-center space-x-3">
        <span class="text-white/60 text-sm font-mono w-6">#{{ rank }}</span>
        <i :class="[flag, 'w-6 h-4 rounded shadow-sm flex-shrink-0']"></i>
        <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
                <span class="text-white font-medium">{{ language }}</span>
                <span class="text-white/60 text-sm">{{ count }}</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
                <div class="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: percentage + '%' }"></div>
            </div>
        </div>
        <span class="text-violet-400 text-sm font-medium w-12 text-right">{{ percentage }}%</span>
    </div>
</template>

<script setup>
// Props
defineProps({
    rank: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    count: {
        type: String,
        required: true
    }
})
</script>