<!-- SidebarItem.vue (Updated for component navigation) -->
<template>
    <button :class="[
        'group flex items-center rounded-md text-sm transition whitespace-nowrap text-left',
        collapsed
            ? 'justify-center px-2 py-2 w-8 h-8'
            : 'gap-3 px-3 py-2 w-full',
        active
            ? 'bg-velaris-purple/15 text-velaris-purple ring-1 ring-velaris-purple/40'
            : 'text-foreground/80 hover:bg-velaris-purple/10 hover:text-velaris-purple'
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