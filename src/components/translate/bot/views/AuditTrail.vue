<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Audit Trail</h2>
                <p class="text-zinc-400">History of all configuration changes made through the dashboard</p>
            </div>
            <button 
                @click="loadAuditLogs" 
                :disabled="loading"
                class="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all"
            >
                <RefreshCw :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
                Refresh
            </button>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px]">
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search actions, users..."
                        class="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
            </div>
            
            <select v-model="filterAction"
                class="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
            </select>

            <select v-model="filterCategory"
                class="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="">All Categories</option>
                <option value="auto_translate">Auto-Translate</option>
                <option value="redirect">Redirects</option>
                <option value="restriction">Restrictions</option>
                <option value="general">General Settings</option>
            </select>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <Loader2 class="h-12 w-12 text-violet-400 animate-spin" />
        </div>

        <!-- Audit Log List -->
        <div v-else-if="filteredLogs.length > 0" class="space-y-3">
            <div v-for="log in filteredLogs" :key="log.id"
                class="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-xl hover:bg-zinc-800/50 transition-colors">
                <div class="flex items-start gap-4">
                    <!-- Action Icon -->
                    <div :class="[
                        'p-2 rounded-lg flex-shrink-0',
                        getActionStyles(log.action).bg
                    ]">
                        <component :is="getActionStyles(log.action).icon" 
                            :class="['h-5 w-5', getActionStyles(log.action).color]" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-white font-medium">
                                    {{ formatActionDescription(log) }}
                                </p>
                                <p class="text-sm text-zinc-500 mt-1">
                                    {{ getCategoryLabel(log.category) }}
                                    <span v-if="log.details" class="text-zinc-600"> • </span>
                                    <span v-if="log.details" class="text-zinc-400">{{ log.details }}</span>
                                </p>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-sm text-zinc-400">{{ formatRelativeTime(log.created_at) }}</p>
                                <p class="text-xs text-zinc-600">{{ formatDateTime(log.created_at) }}</p>
                            </div>
                        </div>

                        <!-- User Info -->
                        <div class="mt-3 pt-3 border-t border-zinc-700/30 flex items-center gap-2">
                            <img 
                                v-if="log.user_avatar" 
                                :src="log.user_avatar" 
                                :alt="log.user_name"
                                class="h-5 w-5 rounded-full"
                            />
                            <div v-else class="h-5 w-5 rounded-full bg-zinc-700 flex items-center justify-center">
                                <User class="h-3 w-3 text-zinc-400" />
                            </div>
                            <span class="text-sm text-zinc-400">{{ log.user_name || 'Unknown User' }}</span>
                            <span class="text-xs text-zinc-600">({{ log.user_id }})</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Load More -->
            <div v-if="hasMore" class="text-center pt-4">
                <button 
                    @click="loadMore"
                    :disabled="loadingMore"
                    class="px-6 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all"
                >
                    <span v-if="loadingMore" class="flex items-center gap-2">
                        <Loader2 class="h-4 w-4 animate-spin" />
                        Loading...
                    </span>
                    <span v-else>Load More</span>
                </button>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-24">
            <div class="inline-flex p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl mb-6">
                <ScrollText class="h-16 w-16 text-zinc-600" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">No Audit Logs</h3>
            <p class="text-zinc-500">
                {{ searchQuery || filterAction || filterCategory 
                    ? 'No logs match your filters' 
                    : 'Configuration changes will appear here' }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import {
    ScrollText,
    RefreshCw,
    Search,
    Loader2,
    User,
    Plus,
    Trash2,
    Settings,
    ToggleRight,
    ToggleLeft,
    Edit,
    Shield,
    Languages,
    Megaphone,
    Ban
} from 'lucide-vue-next'

const props = defineProps({
    serverId: String
})

const store = useTranslateStore()

const loading = ref(true)
const loadingMore = ref(false)
const auditLogs = ref([])
const searchQuery = ref('')
const filterAction = ref('')
const filterCategory = ref('')
const page = ref(1)
const hasMore = ref(false)
const pageSize = 25

const actionStyles = {
    create: { icon: Plus, bg: 'bg-green-500/10 border border-green-500/20', color: 'text-green-400' },
    update: { icon: Edit, bg: 'bg-blue-500/10 border border-blue-500/20', color: 'text-blue-400' },
    delete: { icon: Trash2, bg: 'bg-red-500/10 border border-red-500/20', color: 'text-red-400' },
    enable: { icon: ToggleRight, bg: 'bg-green-500/10 border border-green-500/20', color: 'text-green-400' },
    disable: { icon: ToggleLeft, bg: 'bg-amber-500/10 border border-amber-500/20', color: 'text-amber-400' },
    default: { icon: Settings, bg: 'bg-zinc-700/50 border border-zinc-600/50', color: 'text-zinc-400' }
}

const categoryLabels = {
    auto_translate: 'Auto-Translate',
    redirect: 'Redirects',
    restriction: 'Restrictions',
    general: 'General Settings',
    config: 'Configuration'
}

function getActionStyles(action) {
    return actionStyles[action] || actionStyles.default
}

function getCategoryLabel(category) {
    return categoryLabels[category] || category
}

function formatActionDescription(log) {
    const action = log.action
    const category = getCategoryLabel(log.category)
    
    switch (action) {
        case 'create':
            return `Created ${category.toLowerCase()}`
        case 'delete':
            return `Removed ${category.toLowerCase()}`
        case 'update':
            return `Updated ${category.toLowerCase()}`
        case 'enable':
            return `Enabled ${category.toLowerCase()}`
        case 'disable':
            return `Disabled ${category.toLowerCase()}`
        default:
            return `${action} ${category.toLowerCase()}`
    }
}

function formatRelativeTime(dateStr) {
    if (!dateStr) return ''
    
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

function formatDateTime(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const filteredLogs = computed(() => {
    let logs = auditLogs.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        logs = logs.filter(log => 
            log.user_name?.toLowerCase().includes(query) ||
            log.details?.toLowerCase().includes(query) ||
            log.action?.toLowerCase().includes(query)
        )
    }

    if (filterAction.value) {
        logs = logs.filter(log => log.action === filterAction.value)
    }

    if (filterCategory.value) {
        logs = logs.filter(log => log.category === filterCategory.value)
    }

    return logs
})

async function loadAuditLogs() {
    if (!props.serverId) return

    loading.value = true
    page.value = 1
    
    try {
        const result = await store.fetchAuditLogs(props.serverId, 1, pageSize)
        auditLogs.value = result.logs || []
        hasMore.value = result.hasMore || false
    } catch (error) {
        console.error('Failed to load audit logs:', error)
        auditLogs.value = []
    } finally {
        loading.value = false
    }
}

async function loadMore() {
    if (!props.serverId || loadingMore.value) return

    loadingMore.value = true
    page.value++
    
    try {
        const result = await store.fetchAuditLogs(props.serverId, page.value, pageSize)
        auditLogs.value.push(...(result.logs || []))
        hasMore.value = result.hasMore || false
    } catch (error) {
        console.error('Failed to load more audit logs:', error)
        page.value--
    } finally {
        loadingMore.value = false
    }
}

watch(() => props.serverId, () => {
    loadAuditLogs()
})

onMounted(() => {
    loadAuditLogs()
})
</script>