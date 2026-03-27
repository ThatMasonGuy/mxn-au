<template>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0 bg-stone-200">
            <div class="absolute inset-0 bg-gradient-to-b from-stone-100/50 via-stone-200/70 to-stone-100" />
            <!-- Subtle warm glow -->
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-200/20 rounded-full blur-[120px]" />
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <!-- Decorative line -->
            <div class="flex items-center justify-center gap-4 mb-8">
                <div class="h-px w-12 bg-gradient-to-r from-transparent to-amber-700/40" />
                <span class="text-[10px] tracking-[0.5em] uppercase text-amber-700/60 font-light">Fine Art Prints</span>
                <div class="h-px w-12 bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>

            <!-- Title -->
            <h1 class="font-serif text-5xl sm:text-6xl lg:text-8xl text-stone-800 leading-[0.9] mb-6 tracking-tight">
                Captured
                <span class="block mt-2 italic font-light text-stone-500">Landscapes</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg text-stone-500 font-light max-w-xl mx-auto leading-relaxed mb-10 tracking-wide">
                Museum-quality prints of Australia's most breathtaking landscapes.
                Each piece is printed on archival paper, ready to transform your space.
            </p>

            <!-- CTA -->
            <button @click="scrollToCollection"
                class="group inline-flex items-center gap-3 px-8 py-3.5 border border-stone-400/50 hover:border-stone-500 rounded-none text-sm tracking-[0.2em] uppercase text-stone-600 hover:text-stone-800 transition-all duration-500 hover:bg-stone-300/20">
                <span>View Collection</span>
                <ArrowDown class="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
            <div class="w-px h-12 bg-gradient-to-b from-transparent to-stone-400/30" />
        </div>
    </section>
</template>

<script setup>
import { ArrowDown } from 'lucide-vue-next'

const scrollToCollection = () => {
    const el = document.getElementById('collection')
    if (el) {
        const offset = 80
        const pos = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: pos, behavior: 'smooth' })
    }
}
</script>
