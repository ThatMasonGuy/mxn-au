<!-- @/components/SearchBar.vue -->
<template>
    <div class="relative w-full">
        <input :value="searchTerm" @input="$emit('update:searchTerm', $event.target.value)" type="text"
            placeholder="Search…" aria-label="Search" class="w-full px-4 py-2 rounded-md shadow-sm pr-10
               bg-card border border-border text-foreground
               placeholder:text-muted-foreground
               focus:outline-none focus:ring-2
               focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]" />

        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
            aria-hidden="true">
            <!-- simple search icon -->
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M12.9 14.32a8 8 0 1 1 1.414-1.414l3.89 3.89a1 1 0 0 1-1.414 1.414l-3.89-3.89ZM14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                    clip-rule="evenodd" />
            </svg>
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    searchTerm: {
        type: String,
        default: ''
    }
})
defineEmits(['update:searchTerm'])
</script>