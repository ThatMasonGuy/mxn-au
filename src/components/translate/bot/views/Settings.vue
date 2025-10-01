<!-- views/Settings.vue (Bot Settings) -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-violet-400">Bot Settings</h1>
            <p class="text-sm text-foreground/70 mt-1">Configure bot behavior, permissions, and integrations for {{
                store.selectedServer?.name }}</p>
        </div>

        <!-- Settings Navigation -->
        <div class="mb-8 flex flex-wrap gap-1 p-1 bg-card rounded-lg ring-1 ring-border/60">
            <button v-for="tab in settingsTabs" :key="tab.key" @click="activeTab = tab.key" :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2',
                activeTab === tab.key
                    ? 'bg-violet-600 text-white shadow-sm'
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
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Bot Configuration</h3>
                    <div class="space-y-6">
                        <!-- Bot Status -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Bot class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Bot Status</div>
                                    <div class="text-sm text-zinc-400">Enable or disable the bot in this server</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.enabled }"
                                @click="config.enabled = !config.enabled">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <!-- Bot Prefix -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Hash class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Command Prefix</div>
                                    <div class="text-sm text-zinc-400">Prefix for slash commands (if any)</div>
                                </div>
                            </div>
                            <input v-model="config.prefix" class="setting-select w-20 text-center" maxlength="3"
                                placeholder="/" />
                        </div>

                        <!-- Language -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Globe class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Bot Language</div>
                                    <div class="text-sm text-zinc-400">Language for bot responses and messages</div>
                                </div>
                            </div>
                            <select class="setting-select" v-model="config.language">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="ja">日本語</option>
                                <option value="ko">한국어</option>
                            </select>
                        </div>

                        <!-- Timezone -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Clock class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Server Timezone</div>
                                    <div class="text-sm text-zinc-400">Timezone for timestamps and logs</div>
                                </div>
                            </div>
                            <select class="setting-select" v-model="config.timezone">
                                <option value="UTC">UTC (GMT+0)</option>
                                <option value="America/New_York">Eastern (GMT-5)</option>
                                <option value="America/Los_Angeles">Pacific (GMT-8)</option>
                                <option value="Europe/London">London (GMT+0)</option>
                                <option value="Europe/Paris">Paris (GMT+1)</option>
                                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                                <option value="Australia/Sydney">Sydney (GMT+10)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Response Settings -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Response Behavior</h3>
                    <div class="space-y-6">
                        <div class="setting-item">
                            <div class="setting-label">
                                <MessageCircle class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Auto-delete Failed Attempts</div>
                                    <div class="text-sm text-zinc-400">Remove failed translation attempts after 10
                                        seconds</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.autoDeleteFailed }"
                                @click="config.autoDeleteFailed = !config.autoDeleteFailed">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <Bell class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Send Error Notifications</div>
                                    <div class="text-sm text-zinc-400">Notify users when translations fail</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.sendErrorNotifications }"
                                @click="config.sendErrorNotifications = !config.sendErrorNotifications">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <Sparkles class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Show Translation Credits</div>
                                    <div class="text-sm text-zinc-400">Display "Translated by [Bot]" footer</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.showCredits }"
                                @click="config.showCredits = !config.showCredits">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Permissions -->
            <div v-show="activeTab === 'permissions'" class="space-y-6">
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Role Permissions</h3>
                    <div class="space-y-4">
                        <div v-for="role in serverRoles" :key="role.id"
                            class="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div class="flex items-center gap-3">
                                <div class="w-4 h-4 rounded" :style="{ backgroundColor: role.color }"></div>
                                <div>
                                    <div class="text-sm font-medium text-white">@{{ role.name }}</div>
                                    <div class="text-xs text-zinc-400">{{ role.memberCount }} members</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-6">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-zinc-400">Translation</span>
                                    <div class="toggle-switch" :class="{ active: role.permissions.translation }"
                                        @click="role.permissions.translation = !role.permissions.translation">
                                        <div class="toggle-thumb"></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-zinc-400">Reaction Roles</span>
                                    <div class="toggle-switch" :class="{ active: role.permissions.reactionRoles }"
                                        @click="role.permissions.reactionRoles = !role.permissions.reactionRoles">
                                        <div class="toggle-thumb"></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs text-zinc-400">Manage Bot</span>
                                    <div class="toggle-switch" :class="{ active: role.permissions.manageBot }"
                                        @click="role.permissions.manageBot = !role.permissions.manageBot">
                                        <div class="toggle-thumb"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Channel Override -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Channel Overrides</h3>
                    <p class="text-sm text-zinc-400 mb-4">Specific permissions for individual channels</p>

                    <div class="space-y-3">
                        <div v-for="override in channelOverrides" :key="override.id"
                            class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div class="flex items-center gap-2">
                                <Hash class="h-4 w-4 text-zinc-400" />
                                <span class="text-sm text-white">{{ override.name }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <select v-model="override.permission" class="setting-select text-sm">
                                    <option value="inherit">Inherit</option>
                                    <option value="allow">Allow All</option>
                                    <option value="deny">Deny All</option>
                                    <option value="translation-only">Translation Only</option>
                                    <option value="reactions-only">Reaction Roles Only</option>
                                </select>
                                <button @click="removeChannelOverride(override.id)"
                                    class="text-red-400 hover:text-red-300">
                                    <X class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <button @click="addChannelOverride" class="translate-btn-secondary text-sm">
                            <Plus class="h-4 w-4" />
                            Add Channel Override
                        </button>
                    </div>
                </div>
            </div>

            <!-- Logging -->
            <div v-show="activeTab === 'logging'" class="space-y-6">
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Activity Logging</h3>
                    <div class="space-y-6">
                        <div v-for="logType in logTypes" :key="logType.key" class="setting-item">
                            <div class="setting-label">
                                <component :is="logType.icon" class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">{{ logType.title }}</div>
                                    <div class="text-sm text-zinc-400">{{ logType.description }}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="toggle-switch" :class="{ active: logType.enabled }"
                                    @click="logType.enabled = !logType.enabled">
                                    <div class="toggle-thumb"></div>
                                </div>
                                <select v-if="logType.enabled" v-model="logType.channelId"
                                    class="setting-select text-sm">
                                    <option value="">Select channel...</option>
                                    <option v-for="channel in availableChannels" :key="channel.id" :value="channel.id">
                                        # {{ channel.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Log Retention -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Log Retention</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">Translation Logs</label>
                            <select v-model="config.logRetention.translations" class="setting-select">
                                <option value="7">7 days</option>
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="365">1 year</option>
                                <option value="forever">Forever</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">Error Logs</label>
                            <select v-model="config.logRetention.errors" class="setting-select">
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="365">1 year</option>
                                <option value="forever">Forever</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Integrations -->
            <div v-show="activeTab === 'integrations'" class="space-y-6">
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">External Integrations</h3>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div v-for="integration in integrations" :key="integration.key" class="integration-card">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-lg flex items-center justify-center"
                                        :style="{ backgroundColor: integration.color + '20' }">
                                        <component :is="integration.icon" class="h-5 w-5"
                                            :style="{ color: integration.color }" />
                                    </div>
                                    <div>
                                        <div class="font-medium text-white">{{ integration.name }}</div>
                                        <div class="text-xs text-zinc-400">{{ integration.description }}</div>
                                    </div>
                                </div>
                                <div class="toggle-switch" :class="{ active: integration.connected }"
                                    @click="toggleIntegration(integration)">
                                    <div class="toggle-thumb"></div>
                                </div>
                            </div>
                            <div v-if="integration.connected"
                                class="text-xs text-green-400 bg-green-400/10 rounded px-2 py-1">
                                ✓ Connected {{ integration.connectedSince }}
                            </div>
                            <div v-else class="text-xs text-zinc-500">
                                Click to configure {{ integration.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Webhook Configuration -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-4">Webhooks</h3>
                    <p class="text-sm text-zinc-400 mb-4">Send bot events to external services</p>

                    <div class="space-y-3">
                        <div v-for="webhook in webhooks" :key="webhook.id"
                            class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div>
                                <div class="text-sm font-medium text-white">{{ webhook.name }}</div>
                                <div class="text-xs text-zinc-400">{{ webhook.url }}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs" :class="webhook.active ? 'text-green-400' : 'text-red-400'">
                                    {{ webhook.active ? 'Active' : 'Inactive' }}
                                </span>
                                <button @click="editWebhook(webhook)" class="text-violet-400 hover:text-violet-300">
                                    <Edit class="h-4 w-4" />
                                </button>
                                <button @click="deleteWebhook(webhook.id)" class="text-red-400 hover:text-red-300">
                                    <Trash2 class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <button @click="addWebhook" class="translate-btn-secondary text-sm">
                            <Plus class="h-4 w-4" />
                            Add Webhook
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <div class="mt-8 flex items-center justify-end gap-3">
            <button class="translate-btn-secondary" @click="resetDefaults">
                Reset to Defaults
            </button>
            <button class="translate-btn-primary" @click="saveChanges" :disabled="saving">
                <Save class="h-4 w-4" />
                {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    Settings, Shield, FileText, Zap, Bot, Hash, Globe, Clock, MessageCircle,
    Bell, Sparkles, Plus, X, Save, Edit, Trash2, Languages, Users,
    AlertTriangle, Activity, Webhook, Database, MessageSquare
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()
const activeTab = ref('general')
const saving = ref(false)

const settingsTabs = ref([
    { key: 'general', label: 'General', icon: Settings },
    { key: 'permissions', label: 'Permissions', icon: Shield },
    { key: 'logging', label: 'Logging', icon: FileText },
    { key: 'integrations', label: 'Integrations', icon: Zap }
])

// Configuration state
const config = ref({
    enabled: true,
    prefix: '/',
    language: 'en',
    timezone: 'UTC',
    autoDeleteFailed: true,
    sendErrorNotifications: true,
    showCredits: false,
    logRetention: {
        translations: '30',
        errors: '90'
    }
})

// Mock data
const serverRoles = ref([
    {
        id: '1',
        name: 'Member',
        color: '#99AAB5',
        memberCount: 245,
        permissions: { translation: true, reactionRoles: true, manageBot: false }
    },
    {
        id: '2',
        name: 'VIP',
        color: '#F1C40F',
        memberCount: 89,
        permissions: { translation: true, reactionRoles: true, manageBot: false }
    },
    {
        id: '3',
        name: 'Moderator',
        color: '#E74C3C',
        memberCount: 12,
        permissions: { translation: true, reactionRoles: true, manageBot: true }
    },
    {
        id: '4',
        name: 'Admin',
        color: '#9B59B6',
        memberCount: 3,
        permissions: { translation: true, reactionRoles: true, manageBot: true }
    }
])

const channelOverrides = ref([
    { id: '1', name: 'announcements', permission: 'deny' },
    { id: '2', name: 'mod-only', permission: 'translation-only' }
])

const availableChannels = ref([
    { id: '1', name: 'general' },
    { id: '2', name: 'bot-logs' },
    { id: '3', name: 'mod-logs' },
    { id: '4', name: 'audit-log' }
])

const logTypes = ref([
    {
        key: 'translations',
        title: 'Translation Activity',
        description: 'Log all translation requests and responses',
        icon: Languages,
        enabled: true,
        channelId: '2'
    },
    {
        key: 'reactionRoles',
        title: 'Reaction Role Changes',
        description: 'Log role assignments and removals',
        icon: Users,
        enabled: true,
        channelId: '2'
    },
    {
        key: 'errors',
        title: 'Bot Errors',
        description: 'Log errors and failed operations',
        icon: AlertTriangle,
        enabled: true,
        channelId: '3'
    },
    {
        key: 'commands',
        title: 'Command Usage',
        description: 'Log slash command executions',
        icon: Hash,
        enabled: false,
        channelId: ''
    }
])

const integrations = ref([
    {
        key: 'analytics',
        name: 'Analytics Dashboard',
        description: 'Advanced usage analytics',
        icon: Activity,
        color: '#8B5CF6',
        connected: false,
        connectedSince: null
    },
    {
        key: 'database',
        name: 'External Database',
        description: 'Custom data storage',
        icon: Database,
        color: '#10B981',
        connected: false,
        connectedSince: null
    },
    {
        key: 'webhook',
        name: 'Discord Webhooks',
        description: 'Custom message posting',
        icon: Webhook,
        color: '#F59E0B',
        connected: true,
        connectedSince: '2 weeks ago'
    },
    {
        key: 'api',
        name: 'External API',
        description: 'Third-party integrations',
        icon: MessageSquare,
        color: '#EF4444',
        connected: false,
        connectedSince: null
    }
])

const webhooks = ref([
    {
        id: '1',
        name: 'Translation Alerts',
        url: 'https://api.example.com/webhooks/translations',
        active: true
    },
    {
        id: '2',
        name: 'Error Notifications',
        url: 'https://monitor.example.com/discord-bot',
        active: false
    }
])

// Methods
const addChannelOverride = () => {
    // Implementation for adding channel override
    console.log('Add channel override')
}

const removeChannelOverride = (id) => {
    channelOverrides.value = channelOverrides.value.filter(o => o.id !== id)
}

const toggleIntegration = (integration) => {
    integration.connected = !integration.connected
    if (integration.connected) {
        integration.connectedSince = 'just now'
    } else {
        integration.connectedSince = null
    }
}

const addWebhook = () => {
    console.log('Add webhook')
}

const editWebhook = (webhook) => {
    console.log('Edit webhook:', webhook)
}

const deleteWebhook = (id) => {
    webhooks.value = webhooks.value.filter(w => w.id !== id)
}

const saveChanges = async () => {
    saving.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Bot settings saved:', {
            config: config.value,
            roles: serverRoles.value,
            logs: logTypes.value,
            integrations: integrations.value
        })
    } catch (error) {
        console.error('Failed to save bot settings:', error)
    } finally {
        saving.value = false
    }
}

const resetDefaults = () => {
    config.value = {
        enabled: true,
        prefix: '/',
        language: 'en',
        timezone: 'UTC',
        autoDeleteFailed: true,
        sendErrorNotifications: true,
        showCredits: false,
        logRetention: {
            translations: '30',
            errors: '90'
        }
    }

    // Reset role permissions
    serverRoles.value.forEach(role => {
        role.permissions = {
            translation: true,
            reactionRoles: true,
            manageBot: role.name === 'Admin' || role.name === 'Moderator'
        }
    })
}
</script>