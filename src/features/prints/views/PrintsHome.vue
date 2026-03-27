<template>
    <div class="prints-page bg-stone-100 text-stone-900 min-h-screen">
        <PrintsHeader />
        <PrintsHero />

        <!-- Divider -->
        <div class="w-full flex justify-center py-2">
            <div class="h-px w-2/3 bg-gradient-to-r from-transparent via-stone-400/30 to-transparent" />
        </div>

        <PrintsGallery @select="selectedPrint = $event" />

        <PrintsAbout />

        <PrintsProcess />

        <PrintsFooter />

        <!-- Detail Modal -->
        <PrintDetail :print="selectedPrint" @close="selectedPrint = null" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import PrintsHeader from '@/features/prints/components/PrintsHeader.vue'
import PrintsHero from '@/features/prints/components/PrintsHero.vue'
import PrintsGallery from '@/features/prints/components/PrintsGallery.vue'
import PrintsAbout from '@/features/prints/components/PrintsAbout.vue'
import PrintsProcess from '@/features/prints/components/PrintsProcess.vue'
import PrintsFooter from '@/features/prints/components/PrintsFooter.vue'
import PrintDetail from '@/features/prints/components/PrintDetail.vue'

const selectedPrint = ref(null)
</script>

<style scoped>
.prints-page {
    font-family: 'Noto Sans Display', system-ui, sans-serif;
}

/* Override serif for headings within prints */
.prints-page :deep(.font-serif) {
    font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
}
</style>
