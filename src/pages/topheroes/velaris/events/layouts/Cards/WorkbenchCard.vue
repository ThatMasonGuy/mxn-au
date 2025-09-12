<template>
    <div class="bg-card border border-border rounded-xl p-2 pt-4 shadow-md w-full">
        <div v-if="title" class="mb-4">
            <h2 class="text-2xl font-bold text-foreground">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm mt-1 text-muted-foreground">{{ subtitle }}</p>
        </div>
        <div>
            <slot />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
    // Removed theme prop - now handled by CSS custom properties
})
</script>