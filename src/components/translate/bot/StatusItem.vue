<template>
    <div class="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-700/30 rounded-xl">
        <span class="text-sm text-zinc-300">{{ label }}</span>
        <div class="flex items-center gap-2">
            <div :class="[
                'h-2 w-2 rounded-full',
                enabled ? 'bg-green-400' : 'bg-zinc-600'
            ]"></div>
            <span :class="[
                'text-sm font-medium',
                enabled ? 'text-green-400' : 'text-zinc-500'
            ]">
                {{ enabled ? 'Enabled' : 'Disabled' }}
            </span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    enabled: Boolean
})
</script>