<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-950 to-zinc-900 flex">
        <!-- Sidebar Navigation -->
        <aside
            class="w-64 border-r border-zinc-800/50 bg-zinc-900/50 backdrop-blur flex flex-col h-screen sticky top-0 flex-shrink-0">
            <!-- Logo & Title -->
            <div class="p-6 border-b border-zinc-800/50 flex-shrink-0">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl">
                        <Bot class="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 class="font-bold text-white">MXN Translate</h1>
                        <p class="text-xs text-zinc-500">Bot Dashboard</p>
                    </div>
                </div>
            </div>

            <!-- Navigation Items (Scrollable) -->
            <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
                <button v-for="item in navItems" :key="item.id" @click="currentView = item.id" :class="[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left',
                    currentView === item.id
                        ? 'bg-violet-600 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                ]">
                    <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold truncate">{{ item.label }}</div>
                        <div v-if="item.subtitle" class="text-xs opacity-70 truncate">{{ item.subtitle }}</div>
                    </div>
                    <ChevronRight v-if="currentView === item.id" class="h-4 w-4 flex-shrink-0" />
                </button>
            </nav>

            <!-- User Section -->
            <div class="p-4 border-t border-zinc-800/50 flex-shrink-0">
                <div v-if="store.discordUser" class="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl">
                    <img :src="store.discordUser.avatarUrl" :alt="store.discordUser.username"
                        class="h-10 w-10 rounded-full border-2 border-violet-500/20" />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-white truncate">{{ store.discordUser.username }}</p>
                        <p class="text-xs text-zinc-500">Logged in</p>
                    </div>
                </div>
                <button @click="handleLogout"
                    class="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-white transition-all">
                    <LogOut class="h-4 w-4" />
                    <span class="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Top Bar with Server Selector -->
            <header class="border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur">
                <div class="px-8 py-4">
                    <div class="flex items-center gap-4">
                        <!-- Server Selector -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <label class="text-xs font-semibold text-zinc-400">Active Server</label>
                                <button 
                                    v-if="!store.serversLoading" 
                                    @click="refreshServers"
                                    class="p-1 text-zinc-500 hover:text-violet-400 transition-colors"
                                    title="Refresh server list"
                                >
                                    <RefreshCw class="h-3 w-3" />
                                </button>
                            </div>

                            <!-- Loading State -->
                            <div v-if="store.serversLoading" class="flex items-center gap-2 text-zinc-400">
                                <Loader2 class="h-4 w-4 animate-spin" />
                                <span class="text-sm">Loading servers...</span>
                            </div>

                            <!-- Error State -->
                            <div v-else-if="store.error" class="space-y-2">
                                <div class="flex items-center gap-2 text-red-400">
                                    <AlertCircle class="h-4 w-4" />
                                    <span class="text-sm">{{ store.error }}</span>
                                </div>
                                <button 
                                    v-if="store.error.includes('Session expired') || store.error.includes('log in')"
                                    @click="handleLogout"
                                    class="text-sm text-violet-400 hover:text-violet-300 underline"
                                >
                                    Log in again
                                </button>
                                <button 
                                    v-else
                                    @click="refreshServers"
                                    class="text-sm text-violet-400 hover:text-violet-300 underline"
                                >
                                    Try again
                                </button>
                            </div>

                            <!-- No Servers State -->
                            <div v-else-if="!serversWithBot.length && !serversWithoutBot.length"
                                class="text-zinc-400 text-sm">
                                No servers found. Make sure you have admin access to at least one server.
                            </div>

                            <!-- Server Dropdown -->
                            <select v-else v-model="selectedServerId" @change="handleServerChange"
                                class="w-full max-w-md px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all">
                                <option value="">Select a server...</option>
                                <optgroup v-if="serversWithBot.length > 0" label="Bot Installed">
                                    <option v-for="server in serversWithBot" :key="server.id" :value="server.id">
                                        {{ server.name }}
                                    </option>
                                </optgroup>
                                <optgroup v-if="serversWithoutBot.length > 0" label="Invite Bot">
                                    <option v-for="server in serversWithoutBot" :key="server.id"
                                        :value="'invite:' + server.id">
                                        {{ server.name }} (click to invite)
                                    </option>
                                </optgroup>
                            </select>
                        </div>

                        <!-- Quick Stats in Header -->
                        <div v-if="selectedServerId && !selectedServerId.startsWith('invite:')" class="flex items-center gap-6">
                            <div class="text-right">
                                <div class="text-2xl font-bold text-violet-400">
                                    {{ formatNumber(serverStats.channels?.total || 0) }}
                                </div>
                                <div class="text-xs text-zinc-500">Channels</div>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-fuchsia-400">
                                    {{ formatNumber(serverStats.messages?.total || 0) }}
                                </div>
                                <div class="text-xs text-zinc-500">Messages</div>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-violet-400">
                                    {{ formatNumber(serverStats.users?.total || 0) }}
                                </div>
                                <div class="text-xs text-zinc-500">Users</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Content Views -->
            <main class="flex-1 overflow-y-auto">
                <div class="p-8">
                    <!-- No Server Selected State -->
                    <div v-if="!selectedServerId" class="text-center py-24">
                        <div class="inline-flex p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl mb-4">
                            <Bot class="h-16 w-16 text-zinc-600" />
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Select a Server</h3>
                        <p class="text-zinc-500 max-w-md mx-auto">
                            Choose a server from the dropdown above to view stats and configure translation settings.
                        </p>
                    </div>

                    <!-- Dashboard Home -->
                    <DashboardHome v-else-if="currentView === 'home'" 
                        :server-id="selectedServerId" 
                        :config="config"
                        :initial-stats="serverStats"
                        @navigate="currentView = $event" />

                    <!-- Auto-Translate Config -->
                    <AutoTranslateConfig v-else-if="currentView === 'auto-translate'" :server-id="selectedServerId"
                        :config="config" @update="handleConfigUpdate" />

                    <!-- Announcements Config -->
                    <AnnouncementsConfig v-else-if="currentView === 'announcements'" :server-id="selectedServerId"
                        :config="config" @update="handleConfigUpdate" />

                    <!-- General Settings -->
                    <GeneralSettings v-else-if="currentView === 'general'" :server-id="selectedServerId"
                        :config="config" @update="handleConfigUpdate" />

                    <!-- Restrictions -->
                    <RestrictionsConfig v-else-if="currentView === 'restrictions'" :server-id="selectedServerId"
                        :config="config" @update="handleConfigUpdate" />

                    <!-- Audit Trail -->
                    <AuditTrail v-else-if="currentView === 'audit'" :server-id="selectedServerId" />

                    <!-- Calendar (Coming Soon) -->
                    <CalendarView v-else-if="currentView === 'calendar'" :server-id="selectedServerId" />
                </div>
            </main>

            <!-- Save Bar (shows when changes are unsaved) -->
            <div v-if="hasUnsavedChanges" class="border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur px-8 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <span class="text-sm text-zinc-300">You have unsaved changes</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button @click="discardChanges" class="px-4 py-2 text-zinc-400 hover:text-white transition-all">
                            Discard
                        </button>
                        <button @click="saveChanges" :disabled="saving"
                            class="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex items-center gap-2">
                            <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                            <Save v-else class="h-4 w-4" />
                            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import DashboardHome from '@/components/translate/bot/views/DashboardHome.vue'
import AutoTranslateConfig from '@/components/translate/bot/views/AutoTranslateConfig.vue'
import AnnouncementsConfig from '@/components/translate/bot/views/AnnouncementsConfig.vue'
import GeneralSettings from '@/components/translate/bot/views/GeneralSettings.vue'
import RestrictionsConfig from '@/components/translate/bot/views/RestrictionsConfig.vue'
import AuditTrail from '@/components/translate/bot/views/AuditTrail.vue'
import CalendarView from '@/components/translate/bot/views/CalendarView.vue'
import {
    Bot,
    LogOut,
    ChevronRight,
    Home,
    Languages,
    Megaphone,
    Settings,
    Ban,
    Calendar,
    Save,
    Loader2,
    AlertCircle,
    RefreshCw,
    ScrollText
} from 'lucide-vue-next'

const router = useRouter()
const store = useTranslateStore()

const currentView = ref('home')
const selectedServerId = ref('')
const config = ref(null)
const serverStats = ref({})
const hasUnsavedChanges = ref(false)
const saving = ref(false)

const navItems = [
    { id: 'home', label: 'Dashboard', subtitle: 'Overview & stats', icon: Home },
    { id: 'auto-translate', label: 'Auto-Translate', subtitle: 'Automatic translation', icon: Languages },
    { id: 'announcements', label: 'Redirects', subtitle: 'Protect channels', icon: Megaphone },
    { id: 'general', label: 'General Settings', subtitle: 'Bot behavior', icon: Settings },
    { id: 'restrictions', label: 'Restrictions', subtitle: 'Blocked channels', icon: Ban },
    { id: 'audit', label: 'Audit Trail', subtitle: 'Change history', icon: ScrollText },
    { id: 'calendar', label: 'Calendar', subtitle: 'Scheduled messages', icon: Calendar },
]

const serversWithBot = computed(() => {
    return (store.discordServers || []).filter(s => s.hasBotInstalled === true)
})

const serversWithoutBot = computed(() => {
    return (store.discordServers || []).filter(s => s.hasBotInstalled === false)
})

const selectedServerInfo = computed(() => {
    if (!selectedServerId.value) return null
    return store.discordServers.find(s => s.id === selectedServerId.value) || null
})

function formatNumber(num) {
    if (num === null || num === undefined) return '0'
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
}

async function refreshServers() {
    try {
        await store.fetchDiscordServers()
    } catch (error) {
        console.error('[Dashboard] Failed to refresh servers:', error)
    }
}

async function handleServerChange() {
    // Check if this is an invite action
    if (selectedServerId.value.startsWith('invite:')) {
        const serverId = selectedServerId.value.replace('invite:', '')
        window.open(store.getBotInviteUrl(serverId), '_blank')
        selectedServerId.value = ''
        return
    }

    if (!selectedServerId.value) {
        config.value = null
        serverStats.value = {}
        return
    }

    // Load config and stats for selected server
    try {
        const [configData, statsData] = await Promise.all([
            store.fetchServerConfig(selectedServerId.value),
            store.fetchServerStats(selectedServerId.value)
        ])
        config.value = configData
        serverStats.value = statsData
        hasUnsavedChanges.value = false
    } catch (error) {
        console.error('[Dashboard] Failed to load server data:', error)
    }
}

function handleConfigUpdate(updates) {
    config.value = { ...config.value, ...updates }
    hasUnsavedChanges.value = true
}

async function saveChanges() {
    if (!selectedServerId.value) return

    saving.value = true
    try {
        await store.updateServerConfig(selectedServerId.value, config.value)
        hasUnsavedChanges.value = false
    } catch (error) {
        console.error('[Dashboard] Failed to save:', error)
        alert('Failed to save configuration. Please try again.')
    } finally {
        saving.value = false
    }
}

function discardChanges() {
    if (confirm('Discard all unsaved changes?')) {
        handleServerChange()
        hasUnsavedChanges.value = false
    }
}

function handleLogout() {
    store.logoutDiscord()
    router.push('/translate/bot/login')
}

onMounted(async () => {
    console.log('[Dashboard] Mounted')

    // Check authentication
    if (!store.isDiscordAuthenticated) {
        const loaded = store.loadDiscordAuth()
        if (!loaded) {
            console.log('[Dashboard] Not authenticated, redirecting to login')
            router.push('/translate/bot/login')
            return
        }
    }

    console.log('[Dashboard] Authenticated as:', store.discordUser?.username)

    // Always fetch fresh server list on page load
    await refreshServers()
})

// Watch for auth changes
watch(() => store.isDiscordAuthenticated, (isAuth) => {
    if (!isAuth) {
        console.log('[Dashboard] Auth lost, redirecting to login')
        router.push('/translate/bot/login')
    }
})
</script>