<template>
    <header class="bg-gradient-to-r pt-16 from-indigo-700 to-purple-700 text-white shadow-lg">
        <div
            class="container mx-auto py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold mb-1">
                    {{ guildName }} – {{ eventName }} Event Dashboard
                </h1>
                <p class="text-indigo-100/80 text-sm">{{ byline }}</p>
            </div>

            <div class="flex gap-3 mt-2 md:mt-0">
                <button @click="toggleSummaryView"
                    class="px-4 py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                    {{ summaryView ? 'Player Data' : 'Summary View' }}
                </button>
                <!-- 
                <button @click="changeDataset"
                    class="px-4 disable py-2 bg-white text-indigo-700 rounded-md shadow-sm hover:shadow-md transition-all font-medium">
                    Change Dataset
                </button>
                -->
            </div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    guildName: String,
    eventName: String,
    byline: String,
    summaryView: Boolean,
    toggleSummaryView: Function,
    changeDataset: Function,
});
</script>