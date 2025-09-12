<!-- assets/icons/FroggyIcon.vue -->
<template>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="froggy-icon">
        <!-- Frog body -->
        <ellipse cx="12" cy="15" rx="8" ry="6" fill="currentColor" opacity="0.9" />

        <!-- Eyes -->
        <circle cx="8" cy="11" r="3" fill="currentColor" />
        <circle cx="16" cy="11" r="3" fill="currentColor" />

        <!-- Eye pupils -->
        <circle cx="8" cy="11" r="1.5" fill="white" />
        <circle cx="16" cy="11" r="1.5" fill="white" />

        <!-- Smile -->
        <path d="M8 17 Q12 19 16 17" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none" />
    </svg>
</template>

<script setup>
// Simple froggy icon component
</script>

<style scoped>
.froggy-icon {
    transition: transform 0.2s;
}

.froggy-icon:hover {
    transform: scale(1.1);
}
</style>