<template>
    <section id="about" class="relative py-24 lg:py-32">
        <div class="max-w-5xl mx-auto px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">

                <!-- Image placeholder -->
                <div class="relative aspect-[4/5] bg-stone-900 overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                            <User class="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <span class="text-[10px] tracking-widest uppercase text-white/15">Portrait</span>
                        </div>
                    </div>
                    <!-- Decorative corner frame -->
                    <div class="absolute top-4 left-4 w-8 h-8 border-l border-t border-amber-400/30" />
                    <div class="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-amber-400/30" />
                </div>

                <!-- Text -->
                <div class="space-y-6">
                    <div>
                        <span class="text-[10px] tracking-[0.5em] uppercase text-amber-400/60 font-light block mb-4">The Photographer</span>
                        <h2 class="font-serif text-3xl lg:text-4xl text-white/90 leading-tight">
                            Mason<br />
                            <span class="italic font-light text-amber-100/70">Bartholomai</span>
                        </h2>
                    </div>

                    <div class="h-px w-16 bg-amber-400/30" />

                    <p class="text-sm text-white/50 font-light leading-relaxed">
                        Based in Australia, I spend my time chasing light across landscapes
                        that most people only see in passing. From the red dust of the outback
                        to the misty canopies of ancient rainforests, my work captures the quiet
                        moments that make the natural world extraordinary.
                    </p>

                    <p class="text-sm text-white/50 font-light leading-relaxed">
                        Every print in this collection represents hours of patience, planning,
                        and a deep respect for the places I photograph. I believe great landscape
                        photography isn't about finding new places — it's about seeing familiar
                        places with new eyes.
                    </p>

                    <div class="pt-4 flex items-center gap-6">
                        <div class="text-center">
                            <span class="block font-serif text-2xl text-white/80">50+</span>
                            <span class="text-[9px] tracking-[0.2em] uppercase text-white/30">Locations</span>
                        </div>
                        <div class="h-8 w-px bg-white/10" />
                        <div class="text-center">
                            <span class="block font-serif text-2xl text-white/80">5</span>
                            <span class="text-[9px] tracking-[0.2em] uppercase text-white/30">Years</span>
                        </div>
                        <div class="h-8 w-px bg-white/10" />
                        <div class="text-center">
                            <span class="block font-serif text-2xl text-white/80">AUS</span>
                            <span class="text-[9px] tracking-[0.2em] uppercase text-white/30">Based</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { User } from 'lucide-vue-next'
</script>
