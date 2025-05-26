<template>
    <ColourBlobBackground>
        <GradientBackground :hue="210">
            <div class="min-h-screen flex flex-col bg-slate-700/20 text-white">
                <EverhomesHeader v-if="header" />

                <main class="flex-grow">
                    <slot />
                </main>

                <EverhomesFooter v-if="footer" />
            </div>
        </GradientBackground>
    </ColourBlobBackground>
</template>

<script setup>
import EverhomesHeader from '@/components/everhomes/layouts/EverhomesHeader.vue'
import EverhomesFooter from '@/components/everhomes/layouts/EverhomesFooter.vue'
import ColourBlobBackground from '@/components/common/backgrounds/ColourBlobBackground.vue'
import GradientBackground from '@/components/common/backgrounds/GradientBackground.vue'

const props = defineProps({
    header: { type: Boolean, default: true },
    footer: { type: Boolean, default: true }
})
</script>