<template>
    <section v-cloak :class="['bg-gray-50 -mt-28 -pb-12 text-gray-800 font-sans', bgClass]">
    <slot></slot>
    </section>
</template>

<script setup>
const props = defineProps({
   bgClass: String, 
});
</script>