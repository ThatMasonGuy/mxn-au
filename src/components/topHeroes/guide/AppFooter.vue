<!-- AppFooter.vue -->
<template>
    <footer class="text-center text-white/40 text-sm">
        Built with ☕️ by {{ author }}
    </footer>
</template>

<script setup>
defineProps({
    author: {
        type: String,
        default: 'Anonymous'
    }
})
</script>