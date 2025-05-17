<template>
    <router-link :to="to" class="group block p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition">
        <h3 class="text-lg font-semibold mb-1 group-hover:text-blue-400">{{ title }}</h3>
        <p class="text-sm text-slate-400">{{ description }}</p>
    </router-link>
</template>

<script setup>
defineProps({
    title: String,
    description: String,
    to: String
})
</script>