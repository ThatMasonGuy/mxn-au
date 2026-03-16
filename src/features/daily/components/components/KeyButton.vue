<script setup>
import { computed } from 'vue';

const props = defineProps({
    k: { type: String, required: true },
    state: { type: String, default: 'unknown' }, // unknown | miss | partial | hit
    disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['press']);

const classes = computed(() => {
    const base = 'flex-1 h-12 rounded-md text-sm font-semibold select-none transition-colors';
    const map = {
        hit: ' border-emerald-600/60 bg-emerald-600/40 hover:bg-emerald-500/30 text-white',
        partial: ' border-amber-600/60 bg-amber-600/40 hover:bg-amber-500/30 text-white',
        // much darker than unknown:
        miss: ' border-zinc-900 bg-zinc-900/70 hover:bg-zinc-800/60 text-zinc-500',
        unknown: ' border-zinc-800 bg-zinc-800/70 hover:bg-zinc-700/60 text-white',
    };
    const disabled = props.disabled ? ' opacity-50 pointer-events-none' : '';
    return base + (map[props.state] || map.unknown) + disabled;
});

function click() { if (!props.disabled) emit('press', props.k); }
</script>

<template>
    <button :class="classes" @click="click" :aria-label="k" :title="k">
        <span class="grid h-full w-full place-items-center">{{ k }}</span>
    </button>
</template>
