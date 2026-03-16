<template>
    <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-slate-300">
            <thead class="bg-slate-700 text-slate-200 text-xs uppercase">
                <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-2 py-2">Power</th>
                    <th class="px-2 py-2">Castle</th>
                    <th class="px-2 py-2">Role</th>
                    <th class="px-2 py-2">Rank</th>
                    <th class="px-2 py-2">Score</th>
                    <th class="px-2 py-2">Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in participants" :key="entry.id" class="border-b border-slate-700 hover:bg-slate-800">
                    <td class="px-4 py-2 font-medium text-white">{{ entry.player }}</td>
                    <td class="px-2 py-2">
                        <input v-model="entry.power" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="entry.castle" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="entry.role" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="entry.overallRank" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="entry.score" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                    <td class="px-2 py-2">
                        <input v-model="entry.notes" class="bg-slate-700 px-2 py-1 rounded w-full text-white" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    participants: Array
})
</script>

<style scoped></style>