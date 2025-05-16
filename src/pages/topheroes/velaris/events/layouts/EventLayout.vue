<template>
    <section v-cloak :class="['bg-gray-300 -mt-28 text-gray-800 font-sans', bgClass]">
    <slot></slot>
    </section>
</template>

<script setup>
const props = defineProps({
   bgClass: String, 
});
</script>