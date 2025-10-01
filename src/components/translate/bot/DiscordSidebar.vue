<!-- DiscordSidebar.vue -->
<template>
    <!-- Desktop Sidebar -->
    <aside class="border-r border-border bg-card sticky top-16 h-[calc(100dvh-4rem)]" :class="[
        collapsed ? 'w-[72px]' : 'w-[260px]',
        'hidden lg:block'
    ]">
        <div
            :class="collapsed ? 'flex items-center justify-center px-1 py-3' : 'flex items-center justify-between p-3'">
            <span class="text-xs uppercase tracking-wide text-foreground/50" v-if="!collapsed">
                {{ getSectionTitle() }}
            </span>
            <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-border/60 hover:bg-foreground/5 transition"
                aria-label="Collapse sidebar" @click="toggleCollapse">
                <component :is="collapsed ? ChevronRight : ChevronLeft" class="h-5 w-5 text-foreground/70" />
            </button>
        </div>

        <nav :class="collapsed ? 'px-1 pt-0 space-y-1 flex flex-col items-center' : 'p-3 pt-0 space-y-1'">
            <!-- Main Navigation -->
            <DiscordSidebarItem v-for="item in mainNavigationItems" :key="item.key" :icon="item.icon"
                :label="item.label" :active="activeView === item.key" :collapsed="collapsed"
                @click="$emit('navigate', item.key)" />

            <!-- Feature Navigation (if bot is in server) -->
            <div v-if="featureItems.length > 0"
                :class="collapsed ? 'my-4 h-px bg-border/80 w-6' : 'my-3 h-px bg-border/60'"></div>
            <DiscordSidebarItem v-for="item in featureItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />

            <!-- Settings Navigation -->
            <div v-if="settingsItems.length > 0"
                :class="collapsed ? 'my-4 h-px bg-border/80 w-6' : 'my-3 h-px bg-border/60'"></div>
            <DiscordSidebarItem v-for="item in settingsItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />
        </nav>

        <!-- Bottom Action Button -->
        <div :class="collapsed ? 'px-0 pb-3 mt-auto' : 'p-3 mt-auto'">
            <!-- Invite Bot button if bot not in server -->
            <button v-if="!store.isBotInSelectedServer" @click="inviteBot" :disabled="inviting" :class="[
                'w-full rounded-lg transition shadow-[0_0_24px_hsl(262_83%_58%/0.35)]',
                collapsed ? 'h-8 w-8 mx-auto flex items-center justify-center' : 'px-3 py-2 text-sm',
                inviting ? 'bg-zinc-600 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700',
                'text-white'
            ]">
                <Plus v-if="collapsed" class="h-5 w-5" />
                <template v-else>
                    <RefreshCw v-if="inviting" class="h-4 w-4 animate-spin mr-2" />
                    <Plus v-else class="h-4 w-4 mr-2" />
                    {{ inviting ? 'Adding...' : 'Invite Bot' }}
                </template>
            </button>

            <!-- Server info if bot is in server -->
            <div v-else-if="!collapsed" class="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div class="flex items-center gap-2 mb-2">
                    <div class="translate-status-online"></div>
                    <span class="text-sm font-medium text-green-400">Bot Active</span>
                </div>
                <div class="text-xs text-zinc-400">
                    {{ store.selectedServer?.memberCount || 0 }} members
                </div>
            </div>

            <!-- Collapsed server status -->
            <div v-else class="flex items-center justify-center">
                <div class="translate-status-online"></div>
            </div>
        </div>
    </aside>

    <!-- Mobile Off-canvas sidebar -->
    <transition name="fade">
        <div v-if="mobileOpen" class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/50" @click="$emit('close-mobile')"></div>
            <aside class="absolute inset-y-0 left-0 w-72 border-r border-border bg-card p-3 shadow-2xl">
                <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div
                            class="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                            <Bot class="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <span class="text-sm font-semibold">Translation Bot</span>
                            <div v-if="store.selectedServer" class="text-xs text-zinc-400">{{ store.selectedServer.name
                                }}
                            </div>
                        </div>
                    </div>
                    <button
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-border/60 hover:bg-foreground/5"
                        @click="$emit('close-mobile')">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <nav class="space-y-1">
                    <!-- Main Navigation -->
                    <DiscordSidebarItem v-for="item in mainNavigationItems" :key="item.key" :icon="item.icon"
                        :label="item.label" :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />

                    <!-- Feature Navigation -->
                    <div v-if="featureItems.length > 0" class="my-3 h-px bg-border/60"></div>
                    <DiscordSidebarItem v-for="item in featureItems" :key="item.key" :icon="item.icon"
                        :label="item.label" :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />

                    <!-- Settings Navigation -->
                    <div v-if="settingsItems.length > 0" class="my-3 h-px bg-border/60"></div>
                    <DiscordSidebarItem v-for="item in settingsItems" :key="item.key" :icon="item.icon"
                        :label="item.label" :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />
                </nav>

                <div class="pt-3">
                    <button v-if="!store.isBotInSelectedServer" @click="inviteBot"
                        class="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-sm text-white hover:from-violet-700 hover:to-fuchsia-700 transition shadow-[0_0_24px_hsl(262_83%_58%/0.35)]">
                        <Plus class="h-4 w-4 mr-2" />
                        Invite Bot
                    </button>
                    <div v-else class="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                        <div class="flex items-center justify-center gap-2 mb-1">
                            <div class="translate-status-online"></div>
                            <span class="text-sm font-medium text-green-400">Bot Active</span>
                        </div>
                        <div class="text-xs text-zinc-400">
                            {{ store.selectedServer?.memberCount || 0 }} members
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import DiscordSidebarItem from './DiscordSidebarItem.vue'
import {
    Server, Settings, Languages, Users, BarChart3, Shield, Bot,
    ChevronLeft, ChevronRight, X, Plus, LayoutDashboard, RefreshCw,
    TrendingUp, Cog
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const props = defineProps({
    mobileOpen: { type: Boolean, default: false },
    activeView: { type: String, default: 'dashboard' },
    collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate', 'close-mobile', 'toggle-collapse'])

const store = useDiscordBotStore()
const inviting = ref(false)

// Dynamic navigation based on current state
const mainNavigationItems = computed(() => {
    if (!store.isAuthenticated || !store.isServerSelected || !store.isBotInSelectedServer) {
        return []
    }

    return [
        { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ]
})

const featureItems = computed(() => {
    if (!store.isAuthenticated || !store.isServerSelected || !store.isBotInSelectedServer) {
        return []
    }

    return [
        { key: 'translation', icon: Languages, label: 'Translation' },
        { key: 'reaction-roles', icon: Users, label: 'Reaction Roles' },
        { key: 'analytics', icon: BarChart3, label: 'Analytics' },
        { key: 'server-analytics', icon: TrendingUp, label: 'Server Analytics' }
    ]
})

const settingsItems = computed(() => {
    if (!store.isAuthenticated || !store.isServerSelected || !store.isBotInSelectedServer) {
        return []
    }

    return [
        { key: 'settings', icon: Cog, label: 'Bot Settings' }
    ]
})

const getSectionTitle = () => {
    if (!store.isAuthenticated) return 'Authentication'
    if (!store.isServerSelected) return 'Server Selection'
    if (!store.isBotInSelectedServer) return 'Bot Setup'
    return 'Bot Controls'
}

function toggleCollapse() {
    emit('toggle-collapse', !props.collapsed)
}

function handleMobileNavigate(key) {
    emit('navigate', key)
    emit('close-mobile')
}

async function inviteBot() {
    if (!store.selectedServer) return

    inviting.value = true
    try {
        await store.inviteBotToServer(store.selectedServer)
    } catch (error) {
        console.error('Failed to invite bot:', error)
    } finally {
        inviting.value = false
    }
}
</script>