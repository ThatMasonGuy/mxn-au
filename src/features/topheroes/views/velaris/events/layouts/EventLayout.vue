<template>
    <section v-cloak :class="['bg-background text-foreground font-sans min-h-screen -mt-28', bgClass]">
        <slot></slot>
    </section>
</template>

<script setup>
const props = defineProps({
    bgClass: String,
});
</script>