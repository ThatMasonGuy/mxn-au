<!-- GuideHeader.vue -->
<template>
    <header class="text-center animate-fade-in space-y-2">
        <h1
            class="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            <template v-if="!isLoading">{{ title }}</template>
            <template v-else>
                <Skeleton class="h-12 w-64 mx-auto" />
            </template>
        </h1>
        <p class="text-lg text-white/90">
            <template v-if="!isLoading">{{ byline }}</template>
            <template v-else>
                <Skeleton class="h-6 w-96 mx-auto" />
            </template>
        </p>
        <p class="text-white/70 text-sm">
            <template v-if="!isLoading">
                Reset Time: <strong class="text-indigo-300">{{ resetTime }}</strong> (<span>{{ userLocalTime }}</span>
                until reset)
            </template>
            <template v-else>
                <Skeleton class="h-4 w-48 mx-auto" />
            </template>
        </p>
    </header>
</template>

<script setup>
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
    title: {
        type: String,
        default: ''
    },
    byline: {
        type: String,
        default: ''
    },
    resetTime: {
        type: String,
        default: ''
    },
    userLocalTime: {
        type: String,
        default: ''
    },
    isLoading: {
        type: Boolean,
        default: true
    }
})
</script>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.6s ease both;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>