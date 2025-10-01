<!-- views/BotInvitation.vue -->
<template>
    <div class="flex items-center justify-center min-h-screen p-8">
        <div class="w-full max-w-2xl">
            <div class="translate-glass-card text-center">
                <div class="mb-8">
                    <div
                        class="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-6 relative">
                        <Bot class="h-10 w-10 text-white" />
                        <div
                            class="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                            <Plus class="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <h1 class="text-3xl font-black text-white mb-2">Add Translation Bot</h1>
                    <p class="text-zinc-300 mb-4">
                        The bot needs to be added to <strong>{{ store.selectedServer?.name }}</strong> to continue
                    </p>
                    <p class="text-zinc-400 text-sm">
                        You'll be redirected to Discord to authorize the bot with the necessary permissions
                    </p>
                </div>

                <!-- Server Info -->
                <div class="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div class="flex items-center justify-center gap-4 mb-4">
                        <div
                            class="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                            {{ getServerInitials(store.selectedServer?.name) }}
                        </div>
                        <div class="text-left">
                            <h3 class="text-xl font-bold text-white">{{ store.selectedServer?.name }}</h3>
                            <p class="text-zinc-400">{{ store.selectedServer?.memberCount }} members</p>
                            <div class="flex items-center gap-2 mt-1">
                                <Crown v-if="store.selectedServer?.permissions === 8" class="h-4 w-4 text-amber-400" />
                                <span class="text-sm text-zinc-500">
                                    {{ store.selectedServer?.permissions === 8 ? 'Administrator' : 'Manage Server' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="store.selectedServer?.features?.length" class="flex flex-wrap justify-center gap-2">
                        <span v-for="feature in store.selectedServer.features" :key="feature"
                            class="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                            {{ formatFeature(feature) }}
                        </span>
                    </div>
                </div>

                <!-- Permissions Preview -->
                <div class="mb-8 text-left">
                    <h3 class="text-lg font-semibold text-white mb-4 text-center">Bot Permissions</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-violet-400">Required Permissions</h4>
                            <div v-for="permission in requiredPermissions" :key="permission.name"
                                class="flex items-center gap-3 text-sm">
                                <Check class="h-4 w-4 text-green-400 flex-shrink-0" />
                                <div>
                                    <div class="text-white">{{ permission.name }}</div>
                                    <div class="text-zinc-500 text-xs">{{ permission.description }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-cyan-400">Optional Permissions</h4>
                            <div v-for="permission in optionalPermissions" :key="permission.name"
                                class="flex items-center gap-3 text-sm">
                                <Info class="h-4 w-4 text-cyan-400 flex-shrink-0" />
                                <div>
                                    <div class="text-white">{{ permission.name }}</div>
                                    <div class="text-zinc-500 text-xs">{{ permission.description }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="space-y-4">
                    <button @click="inviteBot" :disabled="inviting" class="translate-btn-primary w-full text-lg py-4">
                        <RefreshCw v-if="inviting" class="h-5 w-5 animate-spin" />
                        <ExternalLink v-else class="h-5 w-5" />
                        <span>{{ inviting ? 'Adding Bot...' : 'Add Bot to Server' }}</span>
                    </button>

                    <div class="flex items-center justify-center gap-4">
                        <button @click="goBack" class="translate-btn-secondary">
                            <ArrowLeft class="h-4 w-4" />
                            Choose Different Server
                        </button>

                        <button @click="refreshStatus" :disabled="checking" class="translate-btn-secondary">
                            <RefreshCw :class="['h-4 w-4', { 'animate-spin': checking }]" />
                            {{ checking ? 'Checking...' : 'Check Status' }}
                        </button>
                    </div>
                </div>

                <!-- Help Section -->
                <div class="mt-8 pt-6 border-t border-white/10 text-sm">
                    <details class="group">
                        <summary
                            class="cursor-pointer text-violet-400 hover:text-violet-300 flex items-center justify-center gap-2">
                            <HelpCircle class="h-4 w-4" />
                            Need help with bot setup?
                            <ChevronDown class="h-4 w-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="mt-4 space-y-3 text-zinc-400">
                            <div class="flex items-start gap-3">
                                <Shield class="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div class="text-left">
                                    <strong class="text-white">Secure & Safe:</strong> The bot only requests necessary
                                    permissions and never stores sensitive data.
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <Zap class="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div class="text-left">
                                    <strong class="text-white">Instant Setup:</strong> Once added, the bot works
                                    immediately with flag reactions for translations.
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <MessageSquare class="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                                <div class="text-left">
                                    <strong class="text-white">Support:</strong> Having issues? Contact support via our
                                    <a href="#" class="text-violet-400 hover:text-violet-300 underline">Discord
                                        server</a>.
                                </div>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    Bot, Plus, Crown, Check, Info, ExternalLink, ArrowLeft, RefreshCw,
    HelpCircle, ChevronDown, Shield, Zap, MessageSquare
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const emit = defineEmits(['bot-added'])

const store = useDiscordBotStore()
const inviting = ref(false)
const checking = ref(false)

const requiredPermissions = [
    {
        name: 'Read Messages',
        description: 'See messages to translate'
    },
    {
        name: 'Send Messages',
        description: 'Send translation responses'
    },
    {
        name: 'Add Reactions',
        description: 'React with flag emojis'
    },
    {
        name: 'Read Message History',
        description: 'Access previous messages'
    }
]

const optionalPermissions = [
    {
        name: 'Manage Roles',
        description: 'For reaction role features'
    },
    {
        name: 'Use External Emojis',
        description: 'Support custom server emojis'
    },
    {
        name: 'Create Public Threads',
        description: 'Enhanced translation threads'
    }
]

const getServerInitials = (name) => {
    if (!name) return 'S'
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

const formatFeature = (feature) => {
    return feature.charAt(0) + feature.slice(1).toLowerCase().replace('_', ' ')
}

const inviteBot = async () => {
    inviting.value = true
    try {
        await store.inviteBotToServer(store.selectedServer)
        // Check if bot was successfully added
        setTimeout(async () => {
            await refreshStatus()
            if (store.isBotInSelectedServer) {
                emit('bot-added')
            }
        }, 2000)
    } catch (error) {
        console.error('Failed to invite bot:', error)
    } finally {
        inviting.value = false
    }
}

const refreshStatus = async () => {
    checking.value = true
    try {
        await store.refreshBotData()
        if (store.isBotInSelectedServer) {
            emit('bot-added')
        }
    } catch (error) {
        console.error('Failed to check bot status:', error)
    } finally {
        checking.value = false
    }
}

const goBack = () => {
    store.setSelectedServer(null)
}
</script>