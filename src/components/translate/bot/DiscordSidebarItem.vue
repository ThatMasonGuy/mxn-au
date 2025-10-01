<!-- DiscordSidebarItem.vue -->
<template>
    <button :class="[
        'group flex items-center rounded-md text-sm transition whitespace-nowrap text-left',
        collapsed
            ? 'justify-center px-2 py-2 w-8 h-8'
            : 'gap-3 px-3 py-2 w-full',
        active
            ? 'bg-gradient-to-r from-violet-600/15 to-fuchsia-600/15 text-violet-400 ring-1 ring-violet-400/40'
            : 'text-foreground/80 hover:bg-gradient-to-r hover:from-violet-600/10 hover:to-fuchsia-600/10 hover:text-violet-400'
    ]" @click="$emit('click')">
        <component :is="icon" class="h-5 w-5 opacity-90 group-hover:opacity-100 shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ label }}</span>
    </button>
</template>

<script setup>
defineProps({
    icon: { type: [Object, Function], required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>