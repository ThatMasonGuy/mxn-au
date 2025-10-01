<!-- views/BotConfiguration.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-8 text-center">
            <div
                class="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                <Bot class="h-8 w-8 text-white" />
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Bot Configuration</h1>
            <p class="text-zinc-300 mb-2">Welcome to {{ store.selectedServer?.name }}!</p>
            <p class="text-zinc-400">Configure your translation bot features and settings</p>
        </div>

        <!-- Quick Setup Cards -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <!-- Translation Setup -->
            <div class="translate-card hover:scale-105 transition-transform cursor-pointer"
                @click="navigateToFeature('translation')">
                <div class="text-center p-2">
                    <div class="mx-auto w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center mb-4">
                        <Languages class="h-6 w-6 text-violet-400" />
                    </div>
                    <h3 class="font-semibold text-white mb-2">Translation Settings</h3>
                    <p class="text-zinc-400 text-sm mb-4">Configure automatic message translation with flag reactions
                    </p>
                    <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Status:</span>
                            <span class="text-green-400">Enabled</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Languages:</span>
                            <span class="text-white">40+ supported</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Channels:</span>
                            <span class="text-white">All allowed</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reaction Roles Setup -->
            <div class="translate-card hover:scale-105 transition-transform cursor-pointer"
                @click="navigateToFeature('reaction-roles')">
                <div class="text-center p-2">
                    <div class="mx-auto w-12 h-12 rounded-xl bg-fuchsia-500/15 flex items-center justify-center mb-4">
                        <Users class="h-6 w-6 text-fuchsia-400" />
                    </div>
                    <h3 class="font-semibold text-white mb-2">Reaction Roles</h3>
                    <p class="text-zinc-400 text-sm mb-4">Let users assign roles by reacting to messages</p>
                    <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Status:</span>
                            <span class="text-amber-400">Setup Required</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Messages:</span>
                            <span class="text-white">0 configured</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Roles:</span>
                            <span class="text-white">{{ availableRoles.length }} available</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Analytics Overview -->
            <div class="translate-card hover:scale-105 transition-transform cursor-pointer"
                @click="navigateToFeature('analytics')">
                <div class="text-center p-2">
                    <div class="mx-auto w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                        <BarChart3 class="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 class="font-semibold text-white mb-2">Analytics</h3>
                    <p class="text-zinc-400 text-sm mb-4">View detailed usage statistics and insights</p>
                    <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Translations:</span>
                            <span class="text-white">{{ stats.translations }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Active Users:</span>
                            <span class="text-white">{{ stats.activeUsers }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-zinc-500">Success Rate:</span>
                            <span class="text-green-400">{{ stats.successRate }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Getting Started Guide -->
        <div class="translate-card mb-8">
            <h3 class="font-semibold text-violet-400 mb-6">Getting Started</h3>
            <div class="grid gap-6 md:grid-cols-2">
                <div>
                    <h4 class="font-medium text-white mb-3">Translation Setup</h4>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check class="h-3 w-3 text-white" />
                            </div>
                            <div>
                                <div class="text-sm text-white">Bot Added Successfully</div>
                                <div class="text-xs text-zinc-400">The bot is now active in your server</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <div class="text-sm text-white">Test Translation</div>
                                <div class="text-xs text-zinc-400">Send a message and react with a flag emoji</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <div class="text-sm text-zinc-400">Configure Settings</div>
                                <div class="text-xs text-zinc-500">Customize channels, rate limits, and more</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 class="font-medium text-white mb-3">Reaction Roles Setup</h4>
                    <div class="space-y-3">
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                                <div class="text-sm text-zinc-400">Create Role Message</div>
                                <div class="text-xs text-zinc-500">Set up your first reaction role message</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <div class="text-sm text-zinc-400">Add Emoji-Role Pairs</div>
                                <div class="text-xs text-zinc-500">Map emojis to server roles</div>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <div class="text-sm text-zinc-400">Test & Deploy</div>
                                <div class="text-xs text-zinc-500">Send message and test reactions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button @click="testTranslation" class="translate-card p-4 hover:scale-105 transition-transform text-left">
                <div class="flex items-center gap-3 mb-2">
                    <Globe class="h-5 w-5 text-violet-400" />
                    <span class="font-medium text-white">Test Translation</span>
                </div>
                <p class="text-xs text-zinc-400">Send a test message to verify translation works</p>
            </button>

            <button @click="navigateToFeature('reaction-roles')"
                class="translate-card p-4 hover:scale-105 transition-transform text-left">
                <div class="flex items-center gap-3 mb-2">
                    <Plus class="h-5 w-5 text-fuchsia-400" />
                    <span class="font-medium text-white">Create Role Message</span>
                </div>
                <p class="text-xs text-zinc-400">Set up your first reaction role message</p>
            </button>

            <button @click="navigateToFeature('settings')"
                class="translate-card p-4 hover:scale-105 transition-transform text-left">
                <div class="flex items-center gap-3 mb-2">
                    <Settings class="h-5 w-5 text-cyan-400" />
                    <span class="font-medium text-white">Bot Settings</span>
                </div>
                <p class="text-xs text-zinc-400">Configure permissions and behavior</p>
            </button>

            <button @click="navigateToFeature('analytics')"
                class="translate-card p-4 hover:scale-105 transition-transform text-left">
                <div class="flex items-center gap-3 mb-2">
                    <TrendingUp class="h-5 w-5 text-green-400" />
                    <span class="font-medium text-white">View Analytics</span>
                </div>
                <p class="text-xs text-zinc-400">See usage statistics and performance</p>
            </button>
        </div>

        <!-- Support Section -->
        <div class="mt-8 translate-card">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <HelpCircle class="h-6 w-6 text-blue-400" />
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-white mb-2">Need Help?</h3>
                    <p class="text-zinc-400 text-sm mb-4">
                        Check out our documentation or get support if you run into any issues.
                    </p>
                    <div class="flex flex-wrap gap-3">
                        <a href="#" class="translate-btn-secondary text-sm">
                            <FileText class="h-4 w-4" />
                            Documentation
                        </a>
                        <a href="#" class="translate-btn-secondary text-sm">
                            <MessageSquare class="h-4 w-4" />
                            Discord Support
                        </a>
                        <button @click="runDiagnostics" class="translate-btn-secondary text-sm">
                            <Search class="h-4 w-4" />
                            Run Diagnostics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
    Bot, Languages, Users, BarChart3, Check, Globe, Plus, Settings,
    TrendingUp, HelpCircle, FileText, MessageSquare, Search
} from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()

// Mock data
const stats = ref({
    translations: 0,
    activeUsers: 0,
    successRate: 100
})

const availableRoles = ref([
    { id: '1', name: 'Member' },
    { id: '2', name: 'VIP' },
    { id: '3', name: 'Gamer' }
])

const navigateToFeature = (feature) => {
    // Emit navigation event to parent
    console.log(`Navigate to ${feature}`)
    // In real app, this would trigger navigation
}

const testTranslation = () => {
    console.log('Testing translation functionality')
    // Could open a modal or send a test message
}

const runDiagnostics = () => {
    console.log('Running bot diagnostics')
    // Check bot permissions, connectivity, etc.
}

onMounted(() => {
    // Load initial configuration data
    loadConfigurationData()
})

const loadConfigurationData = async () => {
    try {
        // Load server stats, role data, etc.
        await store.loadBotConfig()
    } catch (error) {
        console.error('Failed to load configuration data:', error)
    }
}
</script>