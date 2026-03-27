<template>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Background Image Placeholder (blurred, dark overlay) -->
        <div class="absolute inset-0 bg-stone-950">
            <div class="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-950/70 to-stone-950" />
            <!-- Subtle ambient glow -->
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />
        </div>

        <!-- Content -->
        <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <!-- Decorative line -->
            <div class="flex items-center justify-center gap-4 mb-8">
                <div class="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50" />
                <span class="text-[10px] tracking-[0.5em] uppercase text-amber-400/70 font-light">Fine Art Prints</span>
                <div class="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50" />
            </div>

            <!-- Title -->
            <h1 class="font-serif text-5xl sm:text-6xl lg:text-8xl text-white/95 leading-[0.9] mb-6 tracking-tight">
                Captured
                <span class="block mt-2 italic font-light text-amber-100/80">Landscapes</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg text-white/50 font-light max-w-xl mx-auto leading-relaxed mb-10 tracking-wide">
                Museum-quality prints of Australia's most breathtaking landscapes.
                Each piece is printed on archival paper, ready to transform your space.
            </p>

            <!-- CTA -->
            <button @click="scrollToCollection"
                class="group inline-flex items-center gap-3 px-8 py-3.5 border border-amber-400/30 hover:border-amber-400/60 rounded-none text-sm tracking-[0.2em] uppercase text-amber-100/80 hover:text-amber-100 transition-all duration-500 hover:bg-amber-400/5">
                <span>View Collection</span>
                <ArrowDown class="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
            <div class="w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
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
