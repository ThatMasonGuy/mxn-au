<template>
    <button @click="$emit('select', print)"
        class="group text-left w-full focus:outline-none">
        <!-- Image Container -->
        <div class="relative overflow-hidden bg-stone-900 mb-4"
            :class="print.orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'">

            <!-- Placeholder shimmer (shown before real images are added) -->
            <div class="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                        <Camera class="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <span class="text-[10px] tracking-widest uppercase text-white/15">{{ print.title }}</span>
                    </div>
                </div>
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span class="text-xs tracking-[0.3em] uppercase text-white/90 border border-white/30 px-4 py-2">
                        View Details
                    </span>
                </div>
            </div>

            <!-- Edition badge -->
            <div v-if="print.limited" class="absolute top-3 right-3 bg-amber-400/90 text-stone-950 text-[9px] tracking-[0.2em] uppercase px-2 py-1 font-medium">
                Limited Edition
            </div>
        </div>

        <!-- Info -->
        <div class="space-y-1">
            <h3 class="font-serif text-base lg:text-lg text-white/90 group-hover:text-amber-100 transition-colors duration-300">
                {{ print.title }}
            </h3>
            <p class="text-xs tracking-wider text-white/40 uppercase">
                {{ print.location }}
            </p>
            <p class="text-sm text-amber-400/70 font-light pt-1">
                From ${{ print.startingPrice }}
            </p>
        </div>
    </button>
</template>

<script setup>
import { Camera } from 'lucide-vue-next'

defineProps({
    print: {
        type: Object,
        required: true,
    }
})

defineEmits(['select'])
</script>
