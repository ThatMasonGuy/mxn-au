<template>
    <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <MagnifyingGlassIcon class="w-5 h-5 text-slate-400" />
        </span>

        <input type="text" v-model="search" :placeholder="placeholder"
            class="bg-gray-700/50 border border-gray-600 text-white py-3 pl-12 pr-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-indigo-500/10 shadow-md hover:shadow-md hover:shadow-indigo-500/40 focus:shadow-indigo-500/40 focus:shadow-md" />

        <span v-if="search.length > 0" @click="search = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400">
            <XMarkIcon class="w-5 h-5 text-red-400/50 hover:text-red-400 transition-all duration-200" />
        </span>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    data: {
        type: Array,
        required: true
    },
    queries: {
        type: Array,
        default: () => ['name']
    },
    preserveCase: {
        type: Boolean,
        default: false
    },
    sortedBy: {
        type: String,
        default: ''
    },
    sortDirection: {
        type: String,
        default: 'desc' // 'asc' or 'desc'
    },
    secondarySort: {
        type: String,
        default: ''
    },
    secondarySortDirection: {
        type: String,
        default: 'desc' // 'asc' or 'desc'
    },
    placeholder: {
        type: String,
        default: 'Search...'
    },
    filterKey: {
        type: String,
        default: ''
    },
    filterValue: {
        type: [String, Array],
        default: () => ['all']
    }
})

const emit = defineEmits(['update:results'])
const search = ref('')

function sortByField(a, b, key, direction = 'desc') {
    const valA = a[key]
    const valB = b[key]
    // Handle dates, numbers, and strings
    if (valA instanceof Date || !isNaN(Date.parse(valA))) {
        const dateA = new Date(valA).getTime()
        const dateB = new Date(valB).getTime()
        return direction === 'asc' ? dateA - dateB : dateB - dateA
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    // fallback
    return 0
}

const filteredResults = computed(() => {
    const term = props.preserveCase ? search.value : search.value.toLowerCase()
    let result = [...props.data]

    // Filtering
    if (term.trim()) {
        result = result.filter(item => {
            return props.queries.some(key => {
                const value = item[key]
                if (typeof value !== 'string') return false
                const target = props.preserveCase ? value : value.toLowerCase()
                return target.includes(term)
            })
        })
    }

    if (props.filterKey && props.filterValue !== 'all') {
        const filters = Array.isArray(props.filterValue) ? props.filterValue : [props.filterValue]
        result = result.filter(item => filters.includes(item[props.filterKey]))
    }

    // Sorting
    if (props.sortedBy) {
        result.sort((a, b) => {
            // Primary sort
            const primary = sortByField(a, b, props.sortedBy, props.sortDirection)
            if (primary !== 0 || !props.secondarySort) return primary
            // Secondary sort if tie
            return sortByField(a, b, props.secondarySort, props.secondarySortDirection)
        })
    }
    return result
})

watch(filteredResults, val => emit('update:results', val), { immediate: true })
</script>
