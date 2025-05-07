<!-- LoadingSkeleton.vue -->
<template>
    <section
        class="rounded-2xl mx-auto max-w-[1000px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg p-6 sm:p-8 space-y-6 animate-fade-in">
        <div class="flex items-center gap-3">
            <Skeleton class="w-6 h-6 rounded-full" />
            <Skeleton class="h-8 w-48" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="j in 3" :key="`card-skeleton-${j}`"
                class="bg-white/10 border border-white/10 p-4 rounded-xl shadow-sm">
                <Skeleton class="h-6 w-32 mb-2" />
                <Skeleton class="h-4 w-full mb-1" />
                <Skeleton class="h-4 w-3/4 mb-1" />
                <Skeleton class="h-4 w-5/6" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { Skeleton } from '@/components/ui/skeleton'
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