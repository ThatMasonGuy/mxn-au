<!-- components/SimpleSpinner.vue -->
<template>
    <div class="w-full flex items-center justify-center py-6" role="status" aria-busy="true">
        <RotateCw :class="['animate-spin', sizeClass, palette.icon]" />
        <span class="ml-2" :class="[textSizeClass, palette.text]">
            {{ message || 'Loading…' }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { RotateCw } from 'lucide-vue-next'

const props = defineProps({
    message: { type: String, default: 'Loading…' },
    // Use your game theme names here:
    variant: { type: String, default: 'violet' }, // 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose' | 'sky' | 'slate'
    size: { type: String, default: 'md' }      // 'sm' | 'md' | 'lg'
})

const variants = {
    emerald: { icon: 'text-emerald-300', text: 'text-emerald-200' },
    cyan: { icon: 'text-cyan-300', text: 'text-cyan-200' },
    amber: { icon: 'text-amber-300', text: 'text-amber-200' },
    violet: { icon: 'text-violet-300', text: 'text-violet-200' },
    rose: { icon: 'text-rose-300', text: 'text-rose-200' },
    sky: { icon: 'text-sky-300', text: 'text-sky-200' },
    slate: { icon: 'text-slate-300', text: 'text-slate-200' },
}

const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-xs' },
    md: { icon: 'w-5 h-5', text: 'text-sm' },
    lg: { icon: 'w-6 h-6', text: 'text-base' }
}

const palette = computed(() => variants[props.variant] ?? variants.violet)
const sizeClass = computed(() => sizes[props.size]?.icon ?? sizes.md.icon)
const textSizeClass = computed(() => sizes[props.size]?.text ?? sizes.md.text)
</script>