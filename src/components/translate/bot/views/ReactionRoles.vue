<!-- views/ReactionRoles.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-violet-400">Reaction Roles</h1>
            <p class="text-sm text-foreground/70 mt-1">Let users assign roles by reacting to messages</p>
        </div>

        <!-- Settings Navigation -->
        <div class="mb-8 flex flex-wrap gap-1 p-1 bg-card rounded-lg ring-1 ring-border/60">
            <button v-for="tab in reactionTabs" :key="tab.key" @click="activeTab = tab.key" :class="[
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
            <!-- Messages Management -->
            <div v-show="activeTab === 'messages'" class="space-y-6">
                <div class="translate-card">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">Reaction Role Messages</h3>
                            <p class="text-zinc-400">Create and manage reaction role messages</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-zinc-400">Reaction Roles {{ config.enabled ? 'Enabled' :
                                    'Disabled' }}</span>
                                <button @click="config.enabled = !config.enabled" :class="[
                                    'relative w-12 h-6 rounded-full transition-all',
                                    config.enabled ? 'bg-green-500' : 'bg-zinc-600'
                                ]">
                                    <div :class="[
                                        'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform',
                                        config.enabled ? 'translate-x-6' : 'translate-x-0.5'
                                    ]"></div>
                                </button>
                            </div>
                            <button @click="showCreateMessage = true" class="translate-btn-primary text-sm">
                                <Plus class="h-4 w-4" />
                                Create New
                            </button>
                        </div>
                    </div>

                    <!-- Active Messages -->
                    <div v-if="config.enabled">
                        <div v-if="reactionMessages.length === 0" class="text-center py-12 text-zinc-400">
                            <MessageSquare class="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h4 class="text-lg font-medium mb-2">No reaction role messages configured</h4>
                            <p class="text-sm mb-6">Create your first reaction role message to get started</p>
                            <button @click="showCreateMessage = true" class="translate-btn-primary">
                                <Plus class="h-4 w-4" />
                                Create Message
                            </button>
                        </div>

                        <div v-else class="space-y-4">
                            <div v-for="(message, index) in reactionMessages" :key="message.id"
                                class="translate-glass-card">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-white mb-1">{{ message.title || 'Untitled Message'
                                            }}</h4>
                                        <p class="text-sm text-zinc-400"># {{ getChannelName(message.channelId) }} • {{
                                            message.reactions.length }} reactions</p>
                                        <div class="mt-2 text-sm text-zinc-300 line-clamp-2">{{ message.content }}</div>
                                    </div>
                                    <div class="flex items-center gap-2 ml-4">
                                        <button @click="editMessage(index)" class="translate-btn-secondary text-sm">
                                            <Edit class="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button @click="deleteMessage(index)"
                                            class="translate-btn-secondary text-sm text-red-400">
                                            <Trash2 class="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <!-- Reaction Preview -->
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <div v-for="reaction in message.reactions" :key="reaction.emoji"
                                        class="flex items-center gap-2 px-3 py-1 bg-violet-500/20 rounded-lg text-sm">
                                        <span>{{ reaction.emoji }}</span>
                                        <span class="text-violet-300">@{{ getRoleName(reaction.roleId) }}</span>
                                    </div>
                                </div>

                                <!-- Usage Stats -->
                                <div class="grid grid-cols-3 gap-4 text-center text-sm">
                                    <div>
                                        <div class="font-medium text-white">{{ message.stats?.totalReactions || 0 }}
                                        </div>
                                        <div class="text-zinc-400">Total Reactions</div>
                                    </div>
                                    <div>
                                        <div class="font-medium text-white">{{ message.stats?.uniqueUsers || 0 }}</div>
                                        <div class="text-zinc-400">Unique Users</div>
                                    </div>
                                    <div>
                                        <div class="font-medium text-white">{{ formatTimeAgo(message.createdAt) }}</div>
                                        <div class="text-zinc-400">Created</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings -->
            <div v-show="activeTab === 'settings'" class="space-y-6">
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Reaction Role Behavior</h3>
                    <div class="space-y-6">
                        <!-- Remove on Unreact -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <RotateCcw class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Remove role when reaction is removed</div>
                                    <div class="text-sm text-zinc-400">Users lose the role when they unreact</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.removeOnUnreact }"
                                @click="config.removeOnUnreact = !config.removeOnUnreact">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <!-- Allow Multiple -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Users class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Allow multiple roles per message</div>
                                    <div class="text-sm text-zinc-400">Users can react to multiple emojis on the same
                                        message</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.allowMultiple }"
                                @click="config.allowMultiple = !config.allowMultiple">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <!-- Require Verification -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <Shield class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Require account verification</div>
                                    <div class="text-sm text-zinc-400">Only verified Discord accounts can use reaction
                                        roles</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.requireVerification }"
                                @click="config.requireVerification = !config.requireVerification">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <!-- Logging -->
                        <div class="setting-item">
                            <div class="setting-label">
                                <FileText class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Log role changes</div>
                                    <div class="text-sm text-zinc-400">Send role assignment logs to a channel</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: config.logChanges }"
                                @click="config.logChanges = !config.logChanges">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <!-- Log Channel -->
                        <div v-if="config.logChanges" class="setting-item">
                            <div class="setting-label">
                                <Hash class="h-5 w-5 text-violet-400" />
                                <div>
                                    <div class="font-medium text-white">Log Channel</div>
                                    <div class="text-sm text-zinc-400">Channel to send role change logs</div>
                                </div>
                            </div>
                            <select v-model="config.logChannelId" class="setting-select">
                                <option value="">Select a channel...</option>
                                <option v-for="channel in availableChannels" :key="channel.id" :value="channel.id">
                                    # {{ channel.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Role Limits -->
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Role Limits & Restrictions</h3>
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-white mb-2">Max roles per user</label>
                                <input v-model.number="config.maxRolesPerUser" type="number" min="1" max="50"
                                    class="translate-input" />
                                <p class="text-xs text-zinc-500 mt-1">Total reaction roles a user can have</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-white mb-2">Max roles per message</label>
                                <input v-model.number="config.maxRolesPerMessage" type="number" min="1" max="20"
                                    class="translate-input" />
                                <p class="text-xs text-zinc-500 mt-1">Total reactions on one message</p>
                            </div>
                        </div>

                        <!-- Restricted Roles -->
                        <div class="space-y-3">
                            <label class="block text-sm font-medium text-white">Restricted Roles</label>
                            <p class="text-sm text-zinc-400">Roles that cannot be assigned via reactions</p>
                            <div class="space-y-2">
                                <div v-for="role in restrictedRoles" :key="role.id"
                                    class="flex items-center justify-between p-2 rounded bg-red-500/10 border border-red-500/20">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded" :style="{ backgroundColor: role.color }"></div>
                                        <span class="text-sm">@{{ role.name }}</span>
                                    </div>
                                    <button @click="removeRestrictedRole(role.id)"
                                        class="text-red-400 hover:text-red-300">
                                        <X class="h-3 w-3" />
                                    </button>
                                </div>
                                <select @change="addRestrictedRole($event)" class="translate-input text-sm">
                                    <option value="">Add restricted role...</option>
                                    <option v-for="role in availableRestrictedRoles" :key="role.id" :value="role.id">
                                        @{{ role.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Analytics -->
            <div v-show="activeTab === 'analytics'" class="space-y-6">
                <div class="translate-card">
                    <h3 class="font-semibold text-violet-400 mb-6">Usage Statistics</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div class="text-center p-4 bg-violet-500/10 rounded-lg">
                            <div class="text-2xl font-bold text-violet-400">{{ analytics.totalMessages }}</div>
                            <div class="text-sm text-zinc-400">Active Messages</div>
                        </div>
                        <div class="text-center p-4 bg-fuchsia-500/10 rounded-lg">
                            <div class="text-2xl font-bold text-fuchsia-400">{{ analytics.totalReactions }}</div>
                            <div class="text-sm text-zinc-400">Total Reactions</div>
                        </div>
                        <div class="text-center p-4 bg-cyan-500/10 rounded-lg">
                            <div class="text-2xl font-bold text-cyan-400">{{ analytics.uniqueUsers }}</div>
                            <div class="text-sm text-zinc-400">Unique Users</div>
                        </div>
                        <div class="text-center p-4 bg-green-500/10 rounded-lg">
                            <div class="text-2xl font-bold text-green-400">{{ analytics.rolesAssigned }}</div>
                            <div class="text-sm text-zinc-400">Roles Assigned</div>
                        </div>
                    </div>

                    <!-- Top Roles -->
                    <div class="space-y-4">
                        <h4 class="font-medium text-white">Most Popular Roles</h4>
                        <div class="space-y-2">
                            <div v-for="role in analytics.topRoles" :key="role.id"
                                class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div class="flex items-center gap-3">
                                    <div class="w-4 h-4 rounded" :style="{ backgroundColor: role.color }"></div>
                                    <span class="text-white">@{{ role.name }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium text-white">{{ role.count }}</span>
                                    <div class="w-16 bg-zinc-700 rounded-full h-2">
                                        <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                                            :style="{ width: `${role.percentage}%` }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

        <!-- Create/Edit Message Modal -->
        <div v-if="showCreateMessage"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="translate-glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">Create Reaction Role Message</h3>
                    <button @click="showCreateMessage = false" class="p-2 text-zinc-400 hover:text-white">
                        <X class="h-5 w-5" />
                    </button>
                </div>

                <ReactionMessageCreator :available-channels="availableChannels" :available-roles="availableRoles"
                    @save="saveReactionMessage" @cancel="showCreateMessage = false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    MessageSquare, Settings, BarChart3, Users, Shield, RotateCcw, FileText,
    Hash, Plus, Edit, Trash2, X, Save
} from 'lucide-vue-next'
import ReactionMessageCreator from '@/components/translate/bot/modals/ReactionMessageCreator.vue'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()
const activeTab = ref('messages')
const saving = ref(false)
const showCreateMessage = ref(false)

const reactionTabs = ref([
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 }
])

// Configuration state
const config = ref({
    enabled: true,
    removeOnUnreact: true,
    allowMultiple: true,
    requireVerification: false,
    logChanges: true,
    logChannelId: '',
    maxRolesPerUser: 10,
    maxRolesPerMessage: 10
})

// Mock data
const reactionMessages = ref([
    {
        id: '1',
        title: 'Choose Your Game Roles',
        channelId: '1',
        content: 'React with the emojis below to get access to game-specific channels!',
        reactions: [
            { emoji: '🎮', roleId: '1' },
            { emoji: '⚔️', roleId: '2' },
            { emoji: '🏰', roleId: '3' }
        ],
        stats: {
            totalReactions: 156,
            uniqueUsers: 78,
        },
        createdAt: '2024-01-15T10:30:00Z'
    },
    {
        id: '2',
        title: 'Language Roles',
        channelId: '2',
        content: 'Get roles for your native languages!',
        reactions: [
            { emoji: '🇺🇸', roleId: '4' },
            { emoji: '🇪🇸', roleId: '5' },
            { emoji: '🇫🇷', roleId: '6' }
        ],
        stats: {
            totalReactions: 89,
            uniqueUsers: 45,
        },
        createdAt: '2024-01-10T14:20:00Z'
    }
])

const availableChannels = ref([
    { id: '1', name: 'role-selection' },
    { id: '2', name: 'welcome' },
    { id: '3', name: 'general' }
])

const availableRoles = ref([
    { id: '1', name: 'Gamer', color: '#E74C3C' },
    { id: '2', name: 'PvP', color: '#F39C12' },
    { id: '3', name: 'Builder', color: '#3498DB' },
    { id: '4', name: 'English', color: '#9B59B6' },
    { id: '5', name: 'Spanish', color: '#1ABC9C' },
    { id: '6', name: 'French', color: '#E67E22' }
])

const restrictedRoles = ref([
    { id: '7', name: 'Admin', color: '#E74C3C' },
    { id: '8', name: 'Moderator', color: '#F39C12' }
])

const availableRestrictedRoles = ref([
    { id: '9', name: 'VIP', color: '#F1C40F' }
])

const analytics = ref({
    totalMessages: 2,
    totalReactions: 245,
    uniqueUsers: 123,
    rolesAssigned: 189,
    topRoles: [
        { id: '1', name: 'Gamer', color: '#E74C3C', count: 78, percentage: 85 },
        { id: '4', name: 'English', color: '#9B59B6', count: 45, percentage: 49 },
        { id: '2', name: 'PvP', color: '#F39C12', count: 34, percentage: 37 },
        { id: '3', name: 'Builder', color: '#3498DB', count: 23, percentage: 25 }
    ]
})

// Helper functions
const getChannelName = (channelId) => {
    const channel = availableChannels.value.find(c => c.id === channelId)
    return channel?.name || 'Unknown Channel'
}

const getRoleName = (roleId) => {
    const role = availableRoles.value.find(r => r.id === roleId)
    return role?.name || 'Unknown Role'
}

const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
}

// Message management
const editMessage = (index) => {
    console.log('Edit message:', index)
    // Implement edit functionality
}

const deleteMessage = (index) => {
    reactionMessages.value.splice(index, 1)
}

const saveReactionMessage = (messageData) => {
    reactionMessages.value.push({
        ...messageData,
        id: Date.now().toString(),
        stats: {
            totalReactions: 0,
            uniqueUsers: 0
        }
    })
    showCreateMessage.value = false
}

// Role management
const addRestrictedRole = (event) => {
    const roleId = event.target.value
    if (!roleId) return

    const role = availableRoles.value.find(r => r.id === roleId)
    if (role && !restrictedRoles.value.find(r => r.id === roleId)) {
        restrictedRoles.value.push(role)
        availableRestrictedRoles.value = availableRestrictedRoles.value.filter(r => r.id !== roleId)
    }
    event.target.value = ''
}

const removeRestrictedRole = (roleId) => {
    const role = restrictedRoles.value.find(r => r.id === roleId)
    if (role) {
        restrictedRoles.value = restrictedRoles.value.filter(r => r.id !== roleId)
        availableRestrictedRoles.value.push(role)
    }
}

const saveChanges = async () => {
    saving.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Reaction role settings saved:', config.value)
    } catch (error) {
        console.error('Failed to save reaction role settings:', error)
    } finally {
        saving.value = false
    }
}

const resetDefaults = () => {
    config.value = {
        enabled: true,
        removeOnUnreact: true,
        allowMultiple: true,
        requireVerification: false,
        logChanges: true,
        logChannelId: '',
        maxRolesPerUser: 10,
        maxRolesPerMessage: 10
    }
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>