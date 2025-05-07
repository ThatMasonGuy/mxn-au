<!-- @/pages/topheroes/velaris/events/layouts/EventTable.vue -->
<template>
    <div :class="[styling.wrapper || 'bg-gray-900/80 shadow-md overflow-hidden rounded-lg']">
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
            <svg class="animate-spin h-12 w-12 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p class="mt-4 text-gray-400 text-sm">Loading data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="items.length === 0" class="p-12 text-center text-gray-400">
            <div class="flex flex-col items-center gap-4">
                <svg class="h-16 w-16 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 class="text-lg font-medium">No Results Found</h3>
                <p class="text-sm text-gray-500">There are no records to display.</p>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded-lg">
            <table class="min-w-full text-sm overflow-hidden rounded-lg">
                <thead :class="styling.header || 'bg-gray-900 text-gray-400'">
                    <tr :class="columnLines">
                        <th v-for="col in columns" :key="col.key" :class="[
                            'px-4',
                            rowPadding,
                            'font-semibold',
                            col.headerClass || '',
                            styling.column?.[col.label]?.header,
                            eventStore.sortField === col.key ? selectedColumnHeaderClass : ''
                        ]">
                            <div v-if="col.sortable"
                                class="flex items-center gap-1 cursor-pointer hover:text-indigo-400"
                                @click="eventStore.updateSort(col.key)">
                                {{ col.label }}
                                <ChevronDownIcon
                                    v-if="eventStore.sortField === col.key && eventStore.sortDirection === 'asc'"
                                    class="h-4 w-4" />
                                <ChevronUpIcon
                                    v-if="eventStore.sortField === col.key && eventStore.sortDirection === 'desc'"
                                    class="h-4 w-4" />
                            </div>
                            <div v-else>
                                {{ col.label }}
                            </div>
                        </th>

                        <th v-if="actions.length > 0" class="px-4 py-2 text-right font-semibold">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="item in items" :key="item.id || item._id" :class="[
                        rowLines,
                        styling.row || 'hover:bg-gray-800 transition',
                        getHighlightClass(item),
                        { 'cursor-pointer hover:bg-indigo-100': rowClickable }
                    ]" @click="() => rowClickable && onRowClick?.(item)">
                        <td v-for="col in columns" :key="col.key" :class="[
                            'px-4',
                            rowPadding,
                            col.cellClass || '',
                            styling.column?.[col.label]?.cell || '',
                            eventStore.sortField === col.key ? selectedColumnCellClass : ''
                        ]">
                            {{ col.format ? col.format(item[col.key], item) : item[col.key] }}
                        </td>

                        <td v-if="actions.length > 0" :class="['px-4', rowPadding, 'text-right']">
                            <div class="flex justify-end gap-1">
                                <button v-for="action in actions" :key="action.label"
                                    @click.stop="() => action.onClick(item)" :title="action.label"
                                    class="p-1.5 rounded-full transition hover:bg-gray-300/20">
                                    <component :is="action.icon" class="h-5 w-5"
                                        :class="action.color || 'text-gray-300'" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { useEventDataStore } from '@/stores/useEventDataStore'

const eventStore = useEventDataStore()

const props = defineProps({
    items: { type: Array, required: true, default: () => [] },
    columns: { type: Array, required: true },
    actions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    styling: { type: Object, default: () => ({}) },
    highlightRules: { type: Array, default: () => [] },
    rowClickable: { type: Boolean, default: false },
    onRowClick: { type: Function, default: null },
    rowPadding: { type: String, default: 'py-2' },
    rowLines: { type: String, default: '' },
    columnLines: { type: String, default: '' },
    selectedColumnHeaderClass: { type: String, default: 'bg-indigo-100 text-indigo-600' },
    selectedColumnCellClass: { type: String, default: 'bg-indigo-50' }
})

// Highlight helper
function getHighlightClass(item) {
    for (const rule of props.highlightRules) {
        const itemValue = item[rule.column]
        if (compare(itemValue, rule.operator, rule.value)) {
            return rule.class
        }
    }
    return ''
}

function compare(a, operator, b) {
    switch (operator) {
        case '=': return a === b
        case '!=': return a !== b
        case '>': return a > b
        case '<': return a < b
        case '>=': return a >= b
        case '<=': return a <= b
        default: return false
    }
}
</script>