<template>
    <div :class="styling.wrapper || 'bg-white rounded-lg shadow-md p-4'">
        <div class="chart-container">
            <v-chart :option="option" autoresize id="scoreByDayPie" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  option: { type: Object, required: true },
  styling: { type: Object, default: () => ({}) }
})
</script>