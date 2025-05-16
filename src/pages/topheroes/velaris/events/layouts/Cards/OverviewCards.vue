<!-- OverviewGrid.vue -->
<template>
    <div class="grid gap-4 mb-6 md:grid-cols-4 grid-cols-2">
        <div v-for="card in cards" :key="card.label"
            class="group p-4 rounded-lg text-center transition-all duration-300" :style="{
                ...getCardStyle(card.colour),
                ...getCardHoverVar(card.colour)
            }">
            <div class="font-medium text-center" :style="{ color: card.colour }">
                {{ card.label }}
            </div>

            <div v-if="card.byline" class="text-sm opacity-70 text-center" :style="{ color: card.colour }">
                {{ card.byline }}
            </div>

            <div class="text-3xl font-bold text-center" :style="{ color: card.colour }">
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

// Faded background color
function alphaHex(hex, alpha = 0x1a) {
    const cleaned = hex.replace('#', '');
    let full = cleaned;

    if (full.length === 3) {
        full = full.split('').map(c => c + c).join('');
    }

    return `#${full}${alpha.toString(16).padStart(2, '0')}`;
}

// Background color setup
function getCardStyle(colour) {
    return {
        backgroundColor: alphaHex(colour, 0x14)
    };
}

// Only inject hover variable (not box-shadow)
function getCardHoverVar(colour) {
    const cleaned = colour.replace('#', '');
    const bigint = parseInt(cleaned, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const rgba = `rgba(${r}, ${g}, ${b}, 0.4)`;

    return {
        '--card-shadow-hover': `0 4px 15px ${rgba}`
    };
}
</script>

<style scoped>
/* ✅ Now real hover happens here */
.group {
    transition: all 0.3s ease;
    box-shadow: 0 0 0 0 transparent;
}

.group:hover {
    box-shadow: var(--card-shadow-hover);
}
</style>