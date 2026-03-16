<!-- KpiCard.vue (Updated with velaris colors) -->
<template>
    <div class="kpi-card">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <component v-if="icon" :is="icon" class="h-4 w-4 text-velaris-purple" />
                <h4 class="text-sm font-medium text-foreground/80">{{ title }}</h4>
            </div>
            <span :class="['h-2 w-2 rounded-full', dotColor]"></span>
        </div>
        <div class="mt-2 text-2xl font-semibold text-velaris-purple">{{ value }}</div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    value: { type: [String, Number], required: true },
    dotColor: { type: String, default: 'bg-velaris-teal' },
    icon: { type: [Object, Function], default: null },
})
</script>