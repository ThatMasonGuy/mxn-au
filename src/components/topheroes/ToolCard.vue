<template>
    <component :is="link ? 'RouterLink' : 'div'" :to="link" class="group block relative">
        <div
            class="relative overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-white/5 shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out hover:shadow-fuchsia-500/40 hover:border-fuchsia-500/70 hover:scale-[1.015]">
            <!-- Optional image background -->
            <div v-if="image" class="absolute inset-0 z-0 rounded-2xl overflow-hidden">
                <img :src="image" class="w-full h-full object-cover brightness-90" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
            </div>

            <!-- Badge -->
            <div v-if="badge" :class="[badgeBaseClass, badgeGlowClass]"
                class="absolute top-4 right-4 z-20 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-md backdrop-blur border">
                {{ badge }}
            </div>

            <!-- Main content -->
            <div class="relative z-10 space-y-4 bg-black/30 p-4 rounded-xl backdrop-blur-sm">
                <div v-if="icon"
                    class="p-3 rounded-lg inline-block bg-gradient-to-br from-fuchsia-700/40 to-purple-700/40 shadow-md">
                    <component :is="icon" class="w-7 h-7 text-fuchsia-300 drop-shadow" />
                </div>
                <h3 class="text-xl font-extrabold text-amber-200 tracking-tight drop-shadow-lg">{{ title }}</h3>
                <p class="text-gray-300 text-sm leading-relaxed drop-shadow-md">{{ desc }}</p>
            </div>

            <!-- Bottom glow line -->
            <div
                class="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4/5 rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-500 to-amber-400 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
        </div>
    </component>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

const props = defineProps({
    icon: [Object, Function],
    title: String,
    desc: String,
    link: {
        type: String,
        default: null,
    },
    image: String,
    badge: {
        type: String,
        default: null,
    },
});

const badgeBaseClass = computed(() => {
    if (!props.badge) return '';
    switch (props.badge) {
        case 'New!':
            return 'bg-green-500/30 text-green-300 border-green-300/40';
        case 'Coming Soon':
            return 'bg-amber-500/30 text-amber-300 border-amber-300/40';
        case 'Removed':
            return 'bg-red-500/30 text-red-300 border-red-300/40';
        default:
            return 'bg-white/10 text-white border-white/20';
    }
});

const badgeGlowClass = computed(() => {
    return props.badge === 'New!' ? 'animate-glow' : '';
});
</script>

<style scoped>
@keyframes glow {

    0%,
    100% {
        box-shadow: 0 0 6px rgba(34, 197, 94, 0.7), 0 0 12px rgba(34, 197, 94, 0.4);
    }

    50% {
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.9), 0 0 16px rgba(34, 197, 94, 0.5);
    }
}

.animate-glow {
    animation: glow 2s ease-in-out infinite;
}
</style>