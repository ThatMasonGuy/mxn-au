<template>
    <section id="collection" class="relative py-24 lg:py-32">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">

            <!-- Section Header -->
            <div class="text-center mb-16 lg:mb-20">
                <span class="text-[10px] tracking-[0.5em] uppercase text-amber-400/60 font-light block mb-4">The Collection</span>
                <h2 class="font-serif text-3xl lg:text-5xl text-white/90 mb-4">Selected Works</h2>
                <p class="text-sm text-white/40 font-light max-w-md mx-auto leading-relaxed">
                    Each photograph is available as a museum-quality print, produced on demand with archival inks and premium papers.
                </p>
            </div>

            <!-- Filter Tags -->
            <div class="flex justify-center gap-3 mb-12 flex-wrap">
                <button v-for="tag in tags" :key="tag"
                    @click="activeTag = tag"
                    :class="[
                        'text-[11px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-300',
                        activeTag === tag
                            ? 'border-amber-400/50 text-amber-200 bg-amber-400/5'
                            : 'border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                    ]">
                    {{ tag }}
                </button>
            </div>

            <!-- Masonry-style Grid -->
            <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                <div v-for="print in filteredPrints" :key="print.id" class="break-inside-avoid">
                    <PrintCard :print="print" @select="$emit('select', $event)" />
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="filteredPrints.length === 0" class="text-center py-20">
                <Camera class="w-10 h-10 text-white/10 mx-auto mb-4" />
                <p class="text-white/30 text-sm font-light">No prints in this category yet.</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Camera } from 'lucide-vue-next'
import PrintCard from './PrintCard.vue'

const emit = defineEmits(['select'])

const activeTag = ref('All')

const tags = ['All', 'Landscape', 'Seascape', 'Forest', 'Outback']

// Placeholder prints - replace with Printful API data
const prints = ref([
    {
        id: 1,
        title: 'Golden Hour at Twelve Apostles',
        location: 'Great Ocean Road, VIC',
        category: 'Seascape',
        orientation: 'landscape',
        startingPrice: 89,
        limited: true,
        description: 'The last light of day paints the limestone stacks in warm amber, as the Southern Ocean crashes below. Captured during a winter sunset along the Great Ocean Road.',
        sizes: [
            { label: '12" x 8"', price: 89 },
            { label: '18" x 12"', price: 149 },
            { label: '24" x 16"', price: 219 },
            { label: '36" x 24"', price: 349 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
    {
        id: 2,
        title: 'Misty Daintree Morning',
        location: 'Daintree Rainforest, QLD',
        category: 'Forest',
        orientation: 'portrait',
        startingPrice: 79,
        limited: false,
        description: 'Morning mist rises through ancient ferns and towering canopy in the world\'s oldest tropical rainforest. The filtered light creates an ethereal, primordial atmosphere.',
        sizes: [
            { label: '8" x 12"', price: 79 },
            { label: '12" x 18"', price: 139 },
            { label: '16" x 24"', price: 199 },
            { label: '24" x 36"', price: 329 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
    {
        id: 3,
        title: 'Red Centre Silence',
        location: 'Uluru-Kata Tjuta, NT',
        category: 'Outback',
        orientation: 'landscape',
        startingPrice: 89,
        limited: true,
        description: 'An infinite sky stretches over the ochre earth of Australia\'s Red Centre. The stillness of the desert is palpable, broken only by the ancient contours of Kata Tjuta on the horizon.',
        sizes: [
            { label: '12" x 8"', price: 89 },
            { label: '18" x 12"', price: 149 },
            { label: '24" x 16"', price: 219 },
            { label: '36" x 24"', price: 349 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
    {
        id: 4,
        title: 'Blue Mountains Cascade',
        location: 'Blue Mountains, NSW',
        category: 'Forest',
        orientation: 'portrait',
        startingPrice: 79,
        limited: false,
        description: 'Water threads its way through moss-covered sandstone in the Blue Mountains. Long exposure transforms the cascade into silk against the ancient rock.',
        sizes: [
            { label: '8" x 12"', price: 79 },
            { label: '12" x 18"', price: 139 },
            { label: '16" x 24"', price: 199 },
            { label: '24" x 36"', price: 329 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
    {
        id: 5,
        title: 'Turquoise Bay Drift',
        location: 'Ningaloo Reef, WA',
        category: 'Seascape',
        orientation: 'landscape',
        startingPrice: 89,
        limited: false,
        description: 'Crystal waters meet pristine white sand at one of Australia\'s most spectacular reef systems. The gradient of turquoise blues creates a natural abstract composition.',
        sizes: [
            { label: '12" x 8"', price: 89 },
            { label: '18" x 12"', price: 149 },
            { label: '24" x 16"', price: 219 },
            { label: '36" x 24"', price: 349 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
    {
        id: 6,
        title: 'Cradle Mountain Reflection',
        location: 'Cradle Mountain, TAS',
        category: 'Landscape',
        orientation: 'landscape',
        startingPrice: 99,
        limited: true,
        description: 'A mirror-still Dove Lake reflects the iconic silhouette of Cradle Mountain at dawn. The kind of perfect stillness you wait hours for — and remember forever.',
        sizes: [
            { label: '12" x 8"', price: 99 },
            { label: '18" x 12"', price: 169 },
            { label: '24" x 16"', price: 249 },
            { label: '36" x 24"', price: 389 },
        ],
        papers: ['Premium Lustre', 'Fine Art Matte', 'Canvas'],
    },
])

const filteredPrints = computed(() => {
    if (activeTag.value === 'All') return prints.value
    return prints.value.filter(p => p.category === activeTag.value)
})
</script>
