<!-- OverviewCards.vue -->
<template>
    <div class="grid mb-6 grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div v-for="card in cards" :key="card.label"
            class="group rounded-lg text-center transition-all duration-300 border border-border/60 hover:shadow-lg card-background p-3 sm:p-4 md:p-5"
            :style="{
                '--card-color': card.colour,
                color: card.colour
            }">
            <!-- Label: keep to one line on small screens -->
            <div class="font-medium text-xs sm:text-sm md:text-base leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                :title="card.label">
                {{ card.label }}
            </div>

            <!-- Byline: lighter + smaller on mobile -->
            <div v-if="card.byline" class="opacity-70 text-[11px] sm:text-xs md:text-sm leading-tight mt-0.5">
                {{ card.byline }}
            </div>

            <!-- Value / “power number”: responsive scale + tight leading -->
            <div class="font-bold leading-none mt-2 text-2xl sm:text-3xl lg:text-4xl">
                {{ card.value }}
            </div>
        </div>
    </div>
</template>

<script setup>
// Props
const props = defineProps({
    cards: {
        type: Array,
        required: true,
        default: () => []
    }
});
</script>

<style scoped>
.card-background {
    background-color: color-mix(in srgb, var(--card-color) 20%, transparent);
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-background:hover {
    background-color: color-mix(in srgb, var(--card-color) 25%, transparent);
    box-shadow: 0 4px 15px color-mix(in srgb, var(--card-color) 30%, transparent);
    transform: translateY(-2px);
}

/* Fallback for browsers that don't support color-mix */
@supports not (background-color: color-mix(in srgb, red 20%, transparent)) {
    .card-background {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .card-background:hover {
        background-color: rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
}
</style>