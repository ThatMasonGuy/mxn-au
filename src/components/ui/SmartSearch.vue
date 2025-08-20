<template>
    <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
            <Search class="w-5 h-5 text-slate-400" />
        </span>

        <input type="text" v-model="search" :placeholder="placeholder"
            class="bg-gray-700/50 border border-gray-600 text-white py-3 pl-12 pr-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-indigo-500/10 shadow-md hover:shadow-md hover:shadow-indigo-500/40 focus:shadow-indigo-500/40 focus:shadow-md" />

        <span v-if="search.length > 0" @click="search = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400">
            <X class="w-5 h-5 text-red-400/50 hover:text-red-400 transition-all duration-200" />
        </span>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
    data: { type: Array, required: true },
    queries: { type: Array, default: () => ['name'] },
    preserveCase: { type: Boolean, default: false },
    sortedBy: { type: String, default: '' },
    sortDirection: { type: String, default: 'desc' }, // 'asc' | 'desc'
    secondarySort: { type: String, default: '' },
    secondarySortDirection: { type: String, default: 'desc' },
    placeholder: { type: String, default: 'Search...' },
    filterKey: { type: String, default: '' },
    filterValue: { type: [String, Array], default: () => ['all'] }
})

const emit = defineEmits(['update:results'])
const search = ref('')

/* ------------------------- helpers ------------------------- */

function getByPath(obj, path) {
    if (!path) return undefined
    if (!obj) return undefined
    if (!path.includes('.')) return obj[path]
    return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
}

function toEpochMs(v) {
    if (!v) return null
    if (v instanceof Date) return v.getTime()
    if (typeof v === 'number') {
        // treat as epoch ms if it's big, or seconds if small
        return v > 3_000_000_000 ? v : v * 1000
    }
    if (typeof v === 'string') {
        const t = Date.parse(v)
        return Number.isNaN(t) ? null : t
    }
    // Firestore Timestamp
    if (typeof v.toDate === 'function') {
        const d = v.toDate()
        return d instanceof Date ? d.getTime() : null
    }
    // Plain object { seconds, nanoseconds }
    if (typeof v === 'object' && typeof v.seconds === 'number') {
        const ns = typeof v.nanoseconds === 'number' ? Math.floor(v.nanoseconds / 1e6) : 0
        return v.seconds * 1000 + ns
    }
    return null
}

function compareVals(a, b, direction = 'desc') {
    const dir = direction === 'asc' ? 1 : -1

    // Dates / timestamps first
    const aDate = toEpochMs(a)
    const bDate = toEpochMs(b)
    if (aDate !== null || bDate !== null) {
        if (aDate === null && bDate === null) return 0
        if (aDate === null) return 1  // nulls last
        if (bDate === null) return -1
        return dir * (aDate - bDate)
    }

    // Numbers
    if (typeof a === 'number' && typeof b === 'number') {
        return dir * (a - b)
    }

    // Strings
    if (typeof a === 'string' && typeof b === 'string') {
        return dir * a.localeCompare(b)
    }

    // Fallback: keep relative order
    return 0
}

function sortByField(a, b, key, direction = 'desc') {
    const va = getByPath(a, key)
    const vb = getByPath(b, key)
    return compareVals(va, vb, direction)
}

/* --------------------- computed results -------------------- */

const filteredResults = computed(() => {
    const term = props.preserveCase ? search.value : search.value.toLowerCase()
    let result = [...props.data]

    // Text filtering
    if (term.trim()) {
        result = result.filter(item =>
            props.queries.some(key => {
                const value = getByPath(item, key)
                if (typeof value !== 'string') return false
                const target = props.preserveCase ? value : value.toLowerCase()
                return target.includes(term)
            })
        )
    }

    // Status/enum filtering
    if (props.filterKey && props.filterValue !== 'all') {
        const filters = Array.isArray(props.filterValue) ? props.filterValue : [props.filterValue]
        result = result.filter(item => filters.includes(getByPath(item, props.filterKey)))
    }

    // Sorting
    if (props.sortedBy) {
        result.sort((a, b) => {
            const primary = sortByField(a, b, props.sortedBy, props.sortDirection)
            if (primary !== 0 || !props.secondarySort) return primary
            return sortByField(a, b, props.secondarySort, props.secondarySortDirection)
        })
    }

    return result
})

watch(filteredResults, val => emit('update:results', val), { immediate: true })
</script>