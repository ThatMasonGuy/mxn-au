<template>
    <div class="rounded-xl border border-gray-700 bg-gray-900/30 p-4 space-y-4"
        :class="table.excluded ? 'opacity-50 grayscale' : ''">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <RectangleGroupIcon class="h-5 w-5 text-teal-400" />
                <p class="text-sm font-semibold text-white">
                    {{ table.tableName || `Table ${tableIndex + 1}` }}
                </p>
            </div>

            <button @click="toggleExclude"
                class="text-xs font-medium text-gray-400 hover:text-red-400 flex items-center gap-1 transition">
                <XCircleIcon class="h-4 w-4" />
                {{ table.excluded ? 'Table excluded' : 'Exclude table' }}
            </button>
        </div>

        <!-- Editable header row -->
        <div class="overflow-x-auto">
            <div class="min-w-full flex gap-2 border-b border-gray-700 pb-2">
                <div v-for="(header, colIndex) in headers" :key="colIndex"
                    class="flex flex-col items-start min-w-[140px]">
                    <input v-model="table.headers[colIndex]"
                        class="w-full bg-gray-800/50 text-sm font-medium text-white px-3 py-1.5 rounded-md border border-gray-600 focus:outline-none focus:border-teal-500 transition"
                        placeholder="Column name" />
                    <select v-model="table.columnTypes[colIndex]"
                        class="mt-1 w-full bg-gray-800/30 text-xs text-gray-300 rounded-md border border-gray-600 px-2 py-1 focus:outline-none focus:border-teal-500">
                        <option value="string">Text</option>
                        <option value="number">Number</option>
                        <option value="currency">Currency</option>
                        <option value="date">Date</option>
                        <option value="boolean">Yes/No</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Row preview -->
        <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-gray-300 mt-2 border-collapse">
                <tbody>
                    <tr v-for="(row, rowIndex) in table.preview" :key="rowIndex" class="border-t border-gray-700">
                        <td v-for="(cell, colIndex) in row" :key="colIndex" class="px-3 py-2 whitespace-nowrap">
                            {{ cell || '—' }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import {
    XCircleIcon,
    RectangleGroupIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
    table: {
        type: Object,
        required: true
    },
    tableIndex: Number,
    sheetName: String
})

// Ensure columnTypes exists and matches headers length
if (!props.table.columnTypes || props.table.columnTypes.length !== props.table.headers.length) {
    props.table.columnTypes = props.table.headers.map(() => 'string')
}

const headers = props.table.headers

function toggleExclude() {
    props.table.excluded = !props.table.excluded
}
</script>