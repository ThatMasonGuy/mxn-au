<template>
    <ColourBlobBackground v-if="background">
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
    <div v-else class="min-h-screen flex flex-col text-white">
        <EverhomesHeader v-if="header" />

        <main class="flex-grow">
            <slot />
        </main>

        <EverhomesFooter v-if="footer" />
    </div>
</template>

<script setup>
import EverhomesHeader from '@/features/everhomes/components/layouts/EverhomesHeader.vue'
import EverhomesFooter from '@/features/everhomes/components/layouts/EverhomesFooter.vue'
import ColourBlobBackground from '@/shared/components/common/backgrounds/ColourBlobBackground.vue'
import GradientBackground from '@/shared/components/common/backgrounds/GradientBackground.vue'

const props = defineProps({
    header: { type: Boolean, default: true },
    footer: { type: Boolean, default: true },
    background: { type: Boolean, default: true }
})
</script>