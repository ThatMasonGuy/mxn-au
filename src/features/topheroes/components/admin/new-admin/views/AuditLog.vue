<!-- AuditLog.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-velaris-purple">Audit Log</h1>
            <p class="text-sm text-foreground/70 mt-1">Track all administrative actions and system events</p>
        </div>

        <!-- Summary Stats -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Today's Actions</div>
                        <div class="text-2xl font-bold text-velaris-purple">47</div>
                        <div class="text-xs text-velaris-green">+12% from yesterday</div>
                    </div>
                    <Activity class="h-8 w-8 text-velaris-purple" />
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Critical Events</div>
                        <div class="text-2xl font-bold text-velaris-amber">3</div>
                        <div class="text-xs text-foreground/60">This week</div>
                    </div>
                    <AlertTriangle class="h-8 w-8 text-velaris-amber" />
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Active Admins</div>
                        <div class="text-2xl font-bold text-velaris-teal">5</div>
                        <div class="text-xs text-foreground/60">In last hour</div>
                    </div>
                    <Users class="h-8 w-8 text-velaris-teal" />
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Data Changes</div>
                        <div class="text-2xl font-bold text-velaris-green">128</div>
                        <div class="text-xs text-foreground/60">This month</div>
                    </div>
                    <Database class="h-8 w-8 text-velaris-green" />
                </div>
            </div>
        </div>

        <!-- Filters & Search -->
        <div class="mb-6 space-y-4">
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div class="flex items-center gap-3 flex-1">
                    <div class="relative flex-1 max-w-md">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input v-model="searchQuery" type="search" placeholder="Search actions, users, or IPs..."
                            class="pl-10 pr-4 py-2 w-full bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition" />
                    </div>
                    <button class="btn-soft-violet" @click="showFilters = !showFilters">
                        <Filter class="h-4 w-4" />
                        Filters
                        <ChevronDown class="h-3 w-3 transition" :class="{ 'rotate-180': showFilters }" />
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn-soft-violet">
                        <Calendar class="h-4 w-4" />
                        Last 7 days
                    </button>
                    <button class="btn-soft-violet">
                        <Download class="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            <!-- Advanced Filters -->
            <transition name="slide-down">
                <div v-show="showFilters" class="filter-panel">
                    <div class="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label class="block text-sm font-medium mb-2">Action Type</label>
                            <select v-model="filters.actionType" class="filter-select">
                                <option value="">All Actions</option>
                                <option value="member">Member Management</option>
                                <option value="guild">Guild Settings</option>
                                <option value="security">Security</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Severity</label>
                            <select v-model="filters.severity" class="filter-select">
                                <option value="">All Levels</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Admin</label>
                            <select v-model="filters.admin" class="filter-select">
                                <option value="">All Admins</option>
                                <option value="froggy">Froggy</option>
                                <option value="velvet">Velvet</option>
                                <option value="dragonheart">DragonHeart</option>
                                <option value="system">System</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <button class="text-sm text-foreground/60 hover:text-foreground" @click="clearFilters">
                            Clear all filters
                        </button>
                        <div class="flex items-center gap-2">
                            <button class="btn-soft-violet" @click="showFilters = false">Close</button>
                            <button class="btn-solid-purple">Apply Filters</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Audit Log Table -->
        <div class="elev-card">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-border/60">
                        <tr class="text-left">
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">
                                Timestamp</th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">Admin
                            </th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">Action
                            </th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">Target
                            </th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">
                                Severity</th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">IP
                                Address</th>
                            <th class="px-4 py-3 text-xs font-medium text-foreground/70 uppercase tracking-wide">Details
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-foreground/2 transition">
                            <td class="px-4 py-3">
                                <div class="text-sm">{{ formatDate(log.timestamp) }}</div>
                                <div class="text-xs text-foreground/60">{{ formatTime(log.timestamp) }}</div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="h-6 w-6 rounded-full bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-xs font-medium">
                                        {{ log.admin.slice(0, 1).toUpperCase() }}
                                    </div>
                                    <span class="text-sm">{{ log.admin }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <component :is="getActionIcon(log.actionType)"
                                        :class="['h-4 w-4', getActionColor(log.actionType)]" />
                                    <span class="text-sm">{{ log.action }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="text-sm text-foreground/80">{{ log.target }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 rounded-full text-xs font-medium"
                                    :class="getSeverityClass(log.severity)">
                                    {{ log.severity }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <span class="text-sm text-foreground/60 font-mono">{{ log.ipAddress }}</span>
                            </td>
                            <td class="px-4 py-3">
                                <button class="text-velaris-purple hover:underline text-sm"
                                    @click="selectedLog = log">
                                    View Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                <div class="text-sm text-foreground/60">
                    Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage,
                    totalItems) }} of {{ totalItems }} entries
                </div>
                <div class="flex items-center gap-1">
                    <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <button v-for="page in visiblePages" :key="page"
                        :class="['pagination-btn', { 'active': page === currentPage }]" @click="currentPage = page">
                        {{ page }}
                    </button>
                    <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Log Detail Modal -->
        <transition name="modal">
            <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                @click="selectedLog = null">
                <div class="bg-card rounded-xl ring-1 ring-border/70 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    @click.stop>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-velaris-purple">Audit Log Details</h3>
                        <button @click="selectedLog = null" class="p-2 hover:bg-foreground/5 rounded-lg">
                            <X class="h-4 w-4" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <div class="text-sm text-foreground/60">Timestamp</div>
                                <div class="font-medium">{{ formatFullDate(selectedLog.timestamp) }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-foreground/60">Admin</div>
                                <div class="font-medium">{{ selectedLog.admin }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-foreground/60">Action</div>
                                <div class="font-medium">{{ selectedLog.action }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-foreground/60">Target</div>
                                <div class="font-medium">{{ selectedLog.target }}</div>
                            </div>
                        </div>

                        <div>
                            <div class="text-sm text-foreground/60 mb-2">Details</div>
                            <div class="p-3 bg-foreground/5 rounded-lg text-sm">
                                {{ selectedLog.details }}
                            </div>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div>
                                <div class="text-sm text-foreground/60">IP Address</div>
                                <div class="font-mono text-sm">{{ selectedLog.ipAddress }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-foreground/60">User Agent</div>
                                <div class="text-sm text-foreground/80 truncate" :title="selectedLog.userAgent">
                                    {{ selectedLog.userAgent }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    Activity, AlertTriangle, Users, Database, Search, Filter, Calendar, Download,
    ChevronDown, ChevronLeft, ChevronRight, X, Shield, UserPlus, Settings,
    Trash2, Edit, Eye, Lock
} from 'lucide-vue-next'

const searchQuery = ref('')
const showFilters = ref(false)
const selectedLog = ref(null)
const currentPage = ref(1)
const itemsPerPage = 25

const filters = ref({
    actionType: '',
    severity: '',
    admin: ''
})

const auditLogs = ref([
    {
        id: 1,
        timestamp: new Date(Date.now() - 300000),
        admin: 'Froggy',
        action: 'Member Kicked',
        actionType: 'member',
        target: 'InactivePlayer123',
        severity: 'medium',
        ipAddress: '203.15.142.87',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Member kicked for inactivity. Member had been offline for 15 days and failed to respond to multiple warnings.'
    },
    {
        id: 2,
        timestamp: new Date(Date.now() - 900000),
        admin: 'Velvet',
        action: 'Guild Settings Updated',
        actionType: 'guild',
        target: 'Guild Requirements',
        severity: 'low',
        ipAddress: '203.15.142.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        details: 'Updated minimum power requirement from 1.5M to 2.0M. Changed guild tax rate from 15% to 18%.'
    },
    {
        id: 3,
        timestamp: new Date(Date.now() - 1800000),
        admin: 'DragonHeart',
        action: 'Member Promoted',
        actionType: 'member',
        target: 'ShadowBlade',
        severity: 'low',
        ipAddress: '192.168.1.156',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: 'Promoted ShadowBlade from Member to Officer role due to exceptional GvG performance and leadership qualities.'
    },
    {
        id: 4,
        timestamp: new Date(Date.now() - 2700000),
        admin: 'System',
        action: 'Security Alert',
        actionType: 'security',
        target: 'Multiple Failed Logins',
        severity: 'critical',
        ipAddress: '45.123.67.89',
        userAgent: 'curl/7.68.0',
        details: 'Detected 15 failed login attempts from suspicious IP address. Account temporarily locked as precaution.'
    },
    {
        id: 5,
        timestamp: new Date(Date.now() - 3600000),
        admin: 'Froggy',
        action: 'API Key Generated',
        actionType: 'security',
        target: 'Discord Integration',
        severity: 'medium',
        ipAddress: '203.15.142.87',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: 'Generated new API key for Discord bot integration. Previous key revoked due to security rotation policy.'
    },
    {
        id: 6,
        timestamp: new Date(Date.now() - 5400000),
        admin: 'Velvet',
        action: 'Bulk Member Update',
        actionType: 'member',
        target: '23 Members',
        severity: 'medium',
        ipAddress: '203.15.142.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        details: 'Updated roles for 23 members based on recent activity scores. 15 promotions, 8 demotions.'
    }
])

const totalItems = computed(() => filteredLogs.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const filteredLogs = computed(() => {
    let filtered = auditLogs.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(log =>
            log.admin.toLowerCase().includes(query) ||
            log.action.toLowerCase().includes(query) ||
            log.target.toLowerCase().includes(query) ||
            log.ipAddress.includes(query)
        )
    }

    if (filters.value.actionType) {
        filtered = filtered.filter(log => log.actionType === filters.value.actionType)
    }

    if (filters.value.severity) {
        filtered = filtered.filter(log => log.severity === filters.value.severity)
    }

    if (filters.value.admin) {
        filtered = filtered.filter(log => log.admin.toLowerCase() === filters.value.admin)
    }

    const start = (currentPage.value - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

function getActionIcon(actionType) {
    const icons = {
        member: UserPlus,
        guild: Settings,
        security: Shield,
        system: Database
    }
    return icons[actionType] || Activity
}

function getActionColor(actionType) {
    const colors = {
        member: 'text-velaris-teal',
        guild: 'text-velaris-purple',
        security: 'text-velaris-amber',
        system: 'text-velaris-green'
    }
    return colors[actionType] || 'text-foreground/60'
}

function getSeverityClass(severity) {
    const classes = {
        low: 'bg-velaris-green/15 text-velaris-green',
        medium: 'bg-velaris-teal/15 text-velaris-teal',
        high: 'bg-velaris-amber/15 text-velaris-amber',
        critical: 'bg-red-500/15 text-red-500'
    }
    return classes[severity] || 'bg-foreground/10 text-foreground/60'
}

function formatDate(date) {
    return date.toLocaleDateString('en-AU', {
        month: 'short',
        day: 'numeric'
    })
}

function formatTime(date) {
    return date.toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatFullDate(date) {
    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

function clearFilters() {
    filters.value = {
        actionType: '',
        severity: '',
        admin: ''
    }
    searchQuery.value = ''
}
</script>