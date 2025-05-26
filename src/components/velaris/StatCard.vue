<template>
    <div class="bg-slate-800 rounded-xl p-4 text-center shadow-md border border-slate-700">
        <div class="text-slate-400 text-sm">{{ label }}</div>
        <div class="text-2xl font-bold text-white mt-1">{{ value }}</div>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    value: [String, Number]
})
</script>
