<template>
    <div class="relative">
        <!-- Trigger -->
        <button ref="triggerEl" type="button" @click="toggleDropdown"
            class="w-full flex items-center justify-between px-3 py-2 bg-card/60 border border-border/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-left">
            <span class="truncate text-white">{{ selectedMemberDisplay }}</span>
            <ChevronDown class="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
        </button>

        <!-- Teleported dropdown + click-catcher -->
        <Teleport :to="resolvedTeleportTarget">
            <div v-if="showDropdown">
                <!-- backdrop for outside click capture (kept inside modal portal so it doesn't escape the z-index stack) -->
                <div class="fixed inset-0 z-[79]" @click="closeDropdown"></div>

                <!-- the panel itself (positioned to the trigger rect) -->
                <div class="fixed z-[80] max-w-[32rem] bg-slate-800/95 text-slate-200 border border-slate-600 rounded-lg shadow-xl overflow-hidden"
                    :style="dropdownStyles" ref="dropdownEl">
                    <!-- Search -->
                    <div class="p-3 border-b border-slate-600 bg-slate-800 sticky top-0 z-10">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input ref="searchInput" v-model="searchQuery" type="text"
                                placeholder="Search by name, power, rank, or role..."
                                class="w-full pl-10 pr-3 py-2 bg-slate-900/60 border border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50" />
                        </div>
                    </div>

                    <!-- Quick filters -->
                    <div class="px-3 py-2 bg-slate-900/60 border-b border-slate-700">
                        <div class="flex flex-wrap gap-2">
                            <button v-for="opt in quickFilters" :key="opt.value" @click="setStatusFilter(opt.value)"
                                class="px-2.5 py-1 rounded-md text-xs border transition" :class="statusFilter === opt.value
                                    ? 'bg-velaris-purple/20 border-velaris-purple/50 text-white'
                                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-700/40'">
                                <span class="inline-flex items-center gap-1">
                                    <span
                                        :class="['w-2 h-2 rounded-full inline-block', getStatusDot(opt.value)]"></span>
                                    {{ opt.label }}
                                </span>
                            </button>

                            <button v-if="statusFilter" @click="clearStatusFilter"
                                class="px-2.5 py-1 rounded-md text-xs border border-slate-700 text-slate-300 hover:bg-slate-700/40">
                                Clear
                            </button>
                        </div>
                    </div>

                    <!-- List -->
                    <div class="max-h-[24rem] overflow-y-auto divide-y divide-slate-700/50">
                        <template v-for="group in filteredGroupedMembers" :key="group.status">
                            <div class="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/95 backdrop-blur-sm">
                                <div class="flex items-center gap-2">
                                    <span :class="['w-2 h-2 rounded-full', getStatusDot(group.status)]"></span>
                                    {{ group.status }} ({{ group.members.length }})
                                </div>
                            </div>

                            <button v-for="member in group.members" :key="member.id" @click="selectMember(member.id)"
                                class="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-semibold">
                                    {{ (member.name || '').slice(0, 2).toUpperCase() }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="truncate">{{ member.name }}</span>
                                        <span v-if="member.role"
                                            class="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 border border-slate-600 text-slate-300">
                                            {{ member.role }}
                                        </span>
                                        <span v-if="member.power"
                                            class="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 border border-slate-600 text-slate-300">
                                            {{ formatPower(member.power) }}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-400 truncate">
                                        {{ member.status || 'Unknown' }}
                                    </div>
                                </div>
                                <CheckCircle v-if="modelValue === member.id"
                                    class="h-4 w-4 text-velaris-purple flex-shrink-0" />
                            </button>
                        </template>

                        <div v-if="filteredResultCount === 0" class="p-6 text-center text-slate-400">
                            No members found.
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ChevronDown, Search, CheckCircle } from 'lucide-vue-next'

const props = defineProps({
    members: { type: Array, default: () => [] },
    modelValue: { type: String, default: null },
    placeholder: { type: String, default: 'Select a member...' },
    /** Optional CSS selector or Element to teleport into. Default is the bulk import modal portal. */
    teleportTarget: { type: [String, Object], default: '#bulk-member-review-portal' }
})

const emit = defineEmits(['update:modelValue'])

const showDropdown = ref(false)
const searchQuery = ref('')
const statusFilter = ref(null) // e.g., 'ACTIVE', 'INACTIVE', etc.

const triggerEl = ref(null)
const dropdownEl = ref(null)
const searchInput = ref(null)

// --- Teleport target resolution ---
const resolvedTeleportTarget = computed(() => {
    if (typeof props.teleportTarget === 'string') {
        const el = typeof window !== 'undefined' ? document.querySelector(props.teleportTarget) : null
        return el || 'body'
    }
    return props.teleportTarget || 'body'
})

// --- Positioning ---
const rect = ref({ top: 0, left: 0, width: 0, height: 0 })
const dropdownStyles = computed(() => ({
    top: `${rect.value.top + rect.value.height + 4}px`,
    left: `${rect.value.left}px`,
    width: `${rect.value.width}px`
}))

function measure() {
    if (!triggerEl.value) return
    const r = triggerEl.value.getBoundingClientRect()
    rect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
}

function openDropdown() {
    showDropdown.value = true
    measure()
    nextTick(() => searchInput.value?.focus())
    window.addEventListener('scroll', handleScrollResize, true)
    window.addEventListener('resize', handleScrollResize, true)
}

function closeDropdown() {
    showDropdown.value = false
    window.removeEventListener('scroll', handleScrollResize, true)
    window.removeEventListener('resize', handleScrollResize, true)
}

function toggleDropdown() {
    showDropdown.value ? closeDropdown() : openDropdown()
}

function handleScrollResize() {
    if (showDropdown.value) measure()
}

// --- Data / filtering ---
const selectedMember = computed(() => props.members.find(m => m.id === props.modelValue) || null)
const selectedMemberDisplay = computed(() => selectedMember.value ? selectedMember.value.name : props.placeholder)

const quickFilters = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Left', value: 'LEFT' }
]

function setStatusFilter(v) { statusFilter.value = v }
function clearStatusFilter() { statusFilter.value = null }

const filteredMembers = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const list = statusFilter.value
        ? props.members.filter(m => (m.status || '').toUpperCase() === statusFilter.value)
        : props.members

    if (!q) return list

    return list.filter(m => {
        const name = (m.name || '').toLowerCase()
        const role = (m.role || '').toLowerCase()
        const power = `${m.power || ''}`
        return (
            name.includes(q) ||
            role.includes(q) ||
            power.includes(q)
        )
    })
})

const filteredGroupedMembers = computed(() => {
    const groups = {}
    for (const m of filteredMembers.value) {
        const key = (m.status || 'Unknown').toUpperCase()
            ; (groups[key] ||= []).push(m)
    }
    return Object.entries(groups).map(([status, members]) => ({
        status,
        members
    }))
})

const filteredResultCount = computed(() => filteredMembers.value.length)

function selectMember(id) {
    emit('update:modelValue', id)
    closeDropdown()
    searchQuery.value = ''
}

function getStatusDot(status) {
    const s = (status || '').toUpperCase()
    if (s.includes('ACTIVE')) return 'bg-emerald-400'
    if (s.includes('INACTIVE')) return 'bg-yellow-400'
    if (s.includes('LEFT')) return 'bg-red-400'
    return 'bg-slate-400'
}

function formatPower(p) {
    if (p == null) return ''
    const n = Number(p)
    if (Number.isNaN(n)) return String(p)
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
    return String(n)
}

// Close on Escape
function onKeydown(e) {
    if (e.key === 'Escape' && showDropdown.value) closeDropdown()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    window.removeEventListener('scroll', handleScrollResize, true)
    window.removeEventListener('resize', handleScrollResize, true)
})
</script>

<style scoped>
/* nicer thin scrollbar only for the list inside the dropdown */
.max-h-\[24rem\].overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.max-h-\[24rem\].overflow-y-auto::-webkit-scrollbar-track {
    background: rgb(30 41 59);
    border-radius: 4px;
}

.max-h-\[24rem\].overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgb(71 85 105);
    border-radius: 4px;
}

.max-h-\[24rem\].overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgb(100 116 139);
}
</style>