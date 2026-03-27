<template>
    <section id="process" class="relative py-24 lg:py-32">
        <!-- Subtle divider -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-stone-300/60 to-transparent" />

        <div class="max-w-5xl mx-auto px-6 lg:px-8">

            <!-- Section Header -->
            <div class="text-center mb-16 lg:mb-20">
                <span class="text-[10px] tracking-[0.5em] uppercase text-amber-700/50 font-light block mb-4">Quality Assured</span>
                <h2 class="font-serif text-3xl lg:text-5xl text-stone-800 mb-4">The Process</h2>
                <p class="text-sm text-stone-500 font-light max-w-lg mx-auto leading-relaxed">
                    From capture to your wall — every step is handled with care.
                </p>
            </div>

            <!-- Steps -->
            <div class="grid sm:grid-cols-3 gap-8 lg:gap-12">
                <div v-for="step in steps" :key="step.title" class="text-center group">
                    <div class="w-16 h-16 mx-auto mb-6 border border-stone-300 group-hover:border-amber-600/40 flex items-center justify-center transition-all duration-500">
                        <component :is="step.icon" class="w-6 h-6 text-stone-400 group-hover:text-amber-700 transition-colors duration-500" />
                    </div>
                    <h3 class="font-serif text-lg text-stone-700 mb-2">{{ step.title }}</h3>
                    <p class="text-xs text-stone-400 font-light leading-relaxed max-w-xs mx-auto">
                        {{ step.description }}
                    </p>
                </div>
            </div>

            <!-- Trust badges -->
            <div class="mt-20 flex flex-wrap justify-center gap-8 lg:gap-12">
                <div v-for="badge in badges" :key="badge" class="flex items-center gap-2 text-stone-400">
                    <Check class="w-3.5 h-3.5 text-amber-600/60" />
                    <span class="text-[11px] tracking-wider uppercase">{{ badge }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Camera, Printer, Package, Check } from 'lucide-vue-next'

const steps = [
    {
        icon: Camera,
        title: 'Captured',
        description: 'Each photograph is carefully composed in the field, often after hours of waiting for the perfect light and conditions.',
    },
    {
        icon: Printer,
        title: 'Printed',
        description: 'Produced on demand by Printful using museum-quality giclée printers with archival inks that last 100+ years without fading.',
    },
    {
        icon: Package,
        title: 'Delivered',
        description: 'Carefully packaged and shipped worldwide. Each print arrives ready to frame, with a certificate of authenticity.',
    },
]

const badges = [
    'Archival Inks',
    'Premium Papers',
    'Worldwide Shipping',
    'Secure Checkout',
    'Satisfaction Guaranteed',
]
</script>
