<!-- Settings.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-velaris-purple">Settings</h1>
            <p class="text-sm text-foreground/70 mt-1">Configure your admin dashboard and guild preferences</p>
        </div>

        <!-- Settings Navigation -->
        <div class="mb-8 flex flex-wrap gap-1 p-1 bg-card rounded-lg ring-1 ring-border/60">
            <button v-for="tab in settingsTabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2',
                activeTab === tab.key
                    ? 'bg-velaris-purple text-white shadow-sm'
                    : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
            ]">
                <component :is="tab.icon" class="h-4 w-4" />
                {{ tab.label }}
            </button>
        </div>

        <!-- Settings Content -->
        <div class="space-y-8">
            <!-- General Settings -->
            <div v-show="activeTab === 'general'" class="space-y-6">
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">General Preferences</h3>
                    <div class="space-y-6">
                        <!-- Theme Selection -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Palette class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Theme</div>
                                    <div class="text-sm text-foreground/60">Choose your preferred color scheme</div>
                                </div>
                            </div>
                            <div class="flex gap-2 items-center">
                                <!-- Normal 3 themes -->
                                <button class="theme-option"
                                    :class="{ 'active': store.currentTheme === 'light' && store.themeVariant !== 'froggy' }"
                                    @click="store.setLightTheme()">
                                    <Sun class="h-4 w-4" />
                                    Light
                                </button>
                                <button class="theme-option"
                                    :class="{ 'active': store.currentTheme === 'dark' && store.themeVariant !== 'froggy' }"
                                    @click="store.setDarkTheme()">
                                    <Moon class="h-4 w-4" />
                                    Dark
                                </button>
                                <button class="theme-option"
                                    :class="{ 'active': store.currentTheme === 'auto' && store.themeVariant !== 'froggy' }"
                                    @click="store.setAutoTheme()">
                                    <Monitor class="h-4 w-4" />
                                    Auto
                                </button>

                                <!-- Divider -->
                                <div class="w-px h-6 bg-border/50 mx-1"></div>

                                <!-- Froggy button -->
                                <button class="theme-option relative overflow-hidden" :class="{
                                    'active bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700': store.themeVariant === 'froggy',
                                    'text-foreground/70 hover:text-foreground hover:bg-foreground/5': store.themeVariant !== 'froggy'
                                }" @click="store.setFroggyTheme()">
                                    <!-- Soft green overlay -->
                                    <span class="absolute inset-0 bg-green-400/10 pointer-events-none"></span>
                                    <span class="relative flex items-center gap-2">
                                        <FroggyIcon />
                                        froggy
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- Language -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Globe class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Language</div>
                                    <div class="text-sm text-foreground/60">Interface language</div>
                                </div>
                            </div>
                            <select class="setting-select" v-model="store.language">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>

                        <!-- Timezone -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Clock class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Timezone</div>
                                    <div class="text-sm text-foreground/60">Your local timezone</div>
                                </div>
                            </div>
                            <select class="setting-select" v-model="store.timezone">
                                <option value="UTC">UTC (GMT+0)</option>
                                <option value="EST">Eastern (GMT-5)</option>
                                <option value="PST">Pacific (GMT-8)</option>
                                <option value="AEST">Australian Eastern (GMT+10)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Customization -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Dashboard Layout</h3>
                    <div class="space-y-4">
                        <div class="setting-item">
                            <div class="setting-label">
                                <Layout class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Sidebar Default State</div>
                                    <div class="text-sm text-foreground/60">How the sidebar appears on load</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: store.sidebarExpanded }"
                                @click="store.sidebarExpanded = !store.sidebarExpanded">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <BarChart3 class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Compact KPI Cards</div>
                                    <div class="text-sm text-foreground/60">Show condensed metrics view</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: store.compactKPIs }"
                                @click="store.compactKPIs = !store.compactKPIs">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notifications -->
            <div v-show="activeTab === 'notifications'" class="space-y-6">
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Notification Preferences</h3>
                    <div class="space-y-6">
                        <div v-for="notif in notificationSettings" :key="notif.key" class="setting-item">
                            <div class="setting-label">
                                <component :is="notif.icon" class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">{{ notif.title }}</div>
                                    <div class="text-sm text-foreground/60">{{ notif.description }}</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: notif.enabled }"
                                @click="notif.enabled = !notif.enabled">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notification Methods -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Delivery Methods</h3>
                    <div class="grid gap-4 sm:grid-cols-3">
                        <div class="method-card">
                            <Mail class="h-6 w-6 text-velaris-teal" />
                            <div class="font-medium">Email</div>
                            <div class="text-xs text-foreground/60">admin@velaris.guild</div>
                            <div class="toggle-switch active mt-2">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="method-card">
                            <MessageSquare class="h-6 w-6 text-velaris-green" />
                            <div class="font-medium">Discord</div>
                            <div class="text-xs text-foreground/60">@Froggy#1234</div>
                            <div class="toggle-switch active mt-2">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                        <div class="method-card">
                            <Smartphone class="h-6 w-6 text-velaris-amber" />
                            <div class="font-medium">Push</div>
                            <div class="text-xs text-foreground/60">Browser notifications</div>
                            <div class="toggle-switch mt-2">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Security -->
            <div v-show="activeTab === 'security'" class="space-y-6">
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Security Settings</h3>
                    <div class="space-y-6">
                        <div class="setting-item">
                            <div class="setting-label">
                                <Shield class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Two-Factor Authentication</div>
                                    <div class="text-sm text-foreground/60">Add an extra layer of security</div>
                                </div>
                            </div>
                            <button class="btn-solid-purple">
                                Enable 2FA
                            </button>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <Key class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">API Keys</div>
                                    <div class="text-sm text-foreground/60">Manage your API access keys</div>
                                </div>
                            </div>
                            <button class="btn-soft-violet">
                                Manage Keys
                            </button>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <Activity class="h-5 w-5 text-velaris-purple" />
                                <div>
                                    <div class="font-medium">Login Activity</div>
                                    <div class="text-sm text-foreground/60">View recent login attempts</div>
                                </div>
                            </div>
                            <button class="btn-soft-violet">
                                View Activity
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Session Management -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Active Sessions</h3>
                    <div class="space-y-3">
                        <div v-for="session in activeSessions" :key="session.id" class="session-item">
                            <div class="flex items-center gap-3">
                                <div
                                    class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center">
                                    <component :is="session.device === 'desktop' ? Monitor : Smartphone"
                                        class="h-5 w-5 text-white" />
                                </div>
                                <div class="flex-1">
                                    <div class="text-sm font-medium">{{ session.location }}</div>
                                    <div class="text-xs text-foreground/60">{{ session.device }} • {{ session.browser }}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-xs text-foreground/60">{{ session.lastActive }}</div>
                                    <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                        :class="session.current ? 'bg-velaris-green/15 text-velaris-green' : 'bg-foreground/10 text-foreground/60'">
                                        <div class="h-1.5 w-1.5 rounded-full"
                                            :class="session.current ? 'bg-velaris-green' : 'bg-foreground/40'">
                                        </div>
                                        {{ session.current ? 'Current' : 'Inactive' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Integrations -->
            <div v-show="activeTab === 'integrations'" class="space-y-6">
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Connected Services</h3>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-for="integration in integrations" :key="integration.name" class="integration-card">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-lg flex items-center justify-center"
                                        :style="{ backgroundColor: integration.color + '20' }">
                                        <component :is="integration.icon" class="h-5 w-5"
                                            :style="{ color: integration.color }" />
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ integration.name }}</div>
                                        <div class="text-xs text-foreground/60">{{ integration.description }}</div>
                                    </div>
                                </div>
                                <div class="toggle-switch" :class="{ active: integration.connected }"
                                    @click="integration.connected = !integration.connected">
                                    <div class="toggle-thumb"></div>
                                </div>
                            </div>
                            <div v-if="integration.connected"
                                class="text-xs text-velaris-green bg-velaris-green/10 rounded px-2 py-1">
                                ✓ Connected {{ integration.connectedSince }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8 flex items-center justify-end gap-3">
            <button class="btn-soft-violet" @click="resetDefaults">
                Reset to Defaults
            </button>
            <button class="btn-solid-purple" @click="saveChanges">
                <Save class="h-4 w-4" />
                Save Changes
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    Settings, Bell, Shield, Zap, Palette, Sun, Moon, Monitor, Globe, Clock,
    Layout, BarChart3, Mail, MessageSquare, Smartphone, Key, Activity,
    Save, Webhook, Database, Calendar, Target
} from 'lucide-vue-next'
import FroggyIcon from '@/assets/icons/FroggyIcon.vue'
import { useTopheroesAdminStore } from '@/stores/topheroesAdmin/useTopheroesAdminStore'

const store = useTopheroesAdminStore()
const activeTab = ref('general')

const settingsTabs = ref([
    { key: 'general', label: 'General', icon: Settings },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'integrations', label: 'Integrations', icon: Zap }
])

const notificationSettings = ref([
    {
        key: 'member_join',
        title: 'New Member Joins',
        description: 'When someone joins the guild',
        icon: Bell,
        enabled: true
    },
    {
        key: 'gvg_alerts',
        title: 'GvG Battle Alerts',
        description: 'Important battle notifications',
        icon: Shield,
        enabled: true
    },
    {
        key: 'boss_timers',
        title: 'Boss Timer Warnings',
        description: 'Guild boss spawn notifications',
        icon: Clock,
        enabled: true
    },
    {
        key: 'low_activity',
        title: 'Low Activity Warnings',
        description: 'When members are inactive',
        icon: Activity,
        enabled: false
    }
])

const activeSessions = ref([
    {
        id: 1,
        location: 'Brisbane, Australia',
        device: 'desktop',
        browser: 'Chrome on Windows',
        lastActive: '2 minutes ago',
        current: true
    },
    {
        id: 2,
        location: 'Sydney, Australia',
        device: 'mobile',
        browser: 'Safari on iPhone',
        lastActive: '2 hours ago',
        current: false
    }
])

const integrations = ref([
    {
        name: 'Discord Bot',
        description: 'Guild management bot',
        icon: MessageSquare,
        color: '#5865F2',
        connected: true,
        connectedSince: '3 months ago'
    },
    {
        name: 'Game API',
        description: 'Real-time game data sync',
        icon: Database,
        color: '#10B981',
        connected: true,
        connectedSince: '1 month ago'
    },
    {
        name: 'Calendar Sync',
        description: 'Event scheduling',
        icon: Calendar,
        color: '#F59E0B',
        connected: false,
        connectedSince: null
    },
    {
        name: 'Analytics',
        description: 'Performance tracking',
        icon: Target,
        color: '#8B5CF6',
        connected: false,
        connectedSince: null
    }
])

function saveChanges() {
    // Store preferences are already reactive and auto-saved
    store.savePreferences()
    console.log('Settings saved!')
}

function resetDefaults() {
    store.setAutoTheme()
    store.sidebarExpanded = true
    store.compactKPIs = false
    store.language = 'en'
    store.timezone = 'AEST'
    store.savePreferences()
}
</script>