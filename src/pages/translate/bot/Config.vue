<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-950 to-zinc-900">
        <!-- Noise texture overlay -->
        <div class="fixed inset-0 opacity-20 mix-blend-soft-light pointer-events-none"
            style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 opacity=%220.4%22/%3E%3C/svg%3E')">
        </div>

        <div class="relative z-10">
            <!-- Header -->
            <header class="px-8 py-6 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/30">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between mb-4">
                        <button
                            @click="router.back()"
                            class="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl text-zinc-300 hover:text-white transition-all"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            <span>Back to Dashboard</span>
                        </button>

                        <button
                            v-if="hasUnsavedChanges"
                            @click="saveConfig"
                            :disabled="saving"
                            class="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save v-if="!saving" class="h-4 w-4" />
                            <Loader2 v-else class="h-4 w-4 animate-spin" />
                            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
                        </button>
                    </div>

                    <!-- Server Header -->
                    <div v-if="serverInfo" class="flex items-center gap-4">
                        <div 
                            v-if="serverInfo.icon"
                            class="h-16 w-16 rounded-2xl overflow-hidden border-2 border-violet-500/20"
                        >
                            <img 
                                :src="`https://cdn.discordapp.com/icons/${serverInfo.id}/${serverInfo.icon}.png?size=128`" 
                                :alt="serverInfo.name"
                                class="h-full w-full object-cover"
                            />
                        </div>
                        <div 
                            v-else
                            class="h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-2xl bg-violet-500/10 border-2 border-violet-500/20 text-violet-400"
                        >
                            {{ serverInfo.name.substring(0, 2).toUpperCase() }}
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-white">{{ serverInfo.name }}</h1>
                            <p class="text-zinc-400">Translation Bot Configuration</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="px-8 py-12">
                <div class="max-w-7xl mx-auto">
                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-24">
                        <Loader2 class="h-12 w-12 text-violet-400 animate-spin mx-auto mb-4" />
                        <p class="text-zinc-300 font-semibold">Loading configuration...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="error" class="max-w-2xl mx-auto">
                        <div class="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <div class="flex items-start gap-4">
                                <AlertCircle class="h-8 w-8 text-red-400 flex-shrink-0" />
                                <div>
                                    <h3 class="text-xl font-bold text-red-300 mb-2">Failed to Load Configuration</h3>
                                    <p class="text-red-400/80 mb-4">{{ error }}</p>
                                    <button
                                        @click="loadConfig"
                                        class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-medium transition-all"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Configuration Panels -->
                    <div v-else class="space-y-6">
                        <!-- Success Message -->
                        <div 
                            v-if="saveSuccess"
                            class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 animate-fade-in"
                        >
                            <CheckCircle class="h-5 w-5 text-green-400" />
                            <p class="text-green-300 font-semibold">Configuration saved successfully!</p>
                        </div>

                        <!-- Auto-Translate Settings -->
                        <ConfigSection
                            title="Auto-Translate"
                            icon="Languages"
                            description="Automatically translate messages in specific channels without requiring reactions"
                        >
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                                    <div>
                                        <h4 class="font-semibold text-white mb-1">Enable Auto-Translate</h4>
                                        <p class="text-sm text-zinc-400">Automatically translate messages in configured channels</p>
                                    </div>
                                    <ToggleSwitch
                                        v-model="localConfig.autoTranslate.enabled"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>

                                <div v-if="localConfig.autoTranslate.enabled">
                                    <ChannelSelector
                                        v-model="localConfig.autoTranslate.channels"
                                        :server-id="serverId"
                                        label="Auto-Translate Channels"
                                        description="Select channels where messages should be automatically translated"
                                        @update:modelValue="markUnsaved"
                                    />

                                    <LanguageSelector
                                        v-model="localConfig.autoTranslate.defaultLanguage"
                                        label="Default Target Language"
                                        description="Language to translate messages into by default"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>
                            </div>
                        </ConfigSection>

                        <!-- Announcement Channels -->
                        <ConfigSection
                            title="Announcement Channels"
                            icon="Megaphone"
                            description="Automatically post translations of announcements to different language channels"
                        >
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                                    <div>
                                        <h4 class="font-semibold text-white mb-1">Enable Announcement Translation</h4>
                                        <p class="text-sm text-zinc-400">Mirror announcements to language-specific channels</p>
                                    </div>
                                    <ToggleSwitch
                                        v-model="localConfig.announcements.enabled"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>

                                <div v-if="localConfig.announcements.enabled">
                                    <ChannelSelector
                                        v-model="localConfig.announcements.sourceChannel"
                                        :server-id="serverId"
                                        :multiple="false"
                                        label="Source Announcement Channel"
                                        description="Channel to monitor for announcements"
                                        @update:modelValue="markUnsaved"
                                    />

                                    <div class="space-y-3 mt-4">
                                        <label class="block text-sm font-semibold text-white mb-2">
                                            Target Language Channels
                                        </label>
                                        <div
                                            v-for="(mapping, index) in localConfig.announcements.targetChannels"
                                            :key="index"
                                            class="flex items-end gap-3"
                                        >
                                            <div class="flex-1">
                                                <LanguageSelector
                                                    v-model="mapping.language"
                                                    :compact="true"
                                                    @update:modelValue="markUnsaved"
                                                />
                                            </div>
                                            <div class="flex-1">
                                                <ChannelSelector
                                                    v-model="mapping.channel"
                                                    :server-id="serverId"
                                                    :multiple="false"
                                                    :compact="true"
                                                    @update:modelValue="markUnsaved"
                                                />
                                            </div>
                                            <button
                                                @click="removeTargetChannel(index)"
                                                class="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 transition-all"
                                            >
                                                <Trash2 class="h-5 w-5" />
                                            </button>
                                        </div>
                                        <button
                                            @click="addTargetChannel"
                                            class="w-full py-2 px-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 border-dashed rounded-lg text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus class="h-4 w-4" />
                                            <span>Add Target Channel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ConfigSection>

                        <!-- General Settings -->
                        <ConfigSection
                            title="General Settings"
                            icon="Settings"
                            description="General bot behavior and preferences"
                        >
                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                                    <div>
                                        <h4 class="font-semibold text-white mb-1">Reply as Thread</h4>
                                        <p class="text-sm text-zinc-400">Post translations as threaded replies instead of regular messages</p>
                                    </div>
                                    <ToggleSwitch
                                        v-model="localConfig.general.replyAsThread"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>

                                <div class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                                    <div>
                                        <h4 class="font-semibold text-white mb-1">Show Original Language</h4>
                                        <p class="text-sm text-zinc-400">Display detected source language in translation replies</p>
                                    </div>
                                    <ToggleSwitch
                                        v-model="localConfig.general.showOriginalLanguage"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>

                                <div class="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                                    <div>
                                        <h4 class="font-semibold text-white mb-1">Allow DM Translations</h4>
                                        <p class="text-sm text-zinc-400">Enable translation requests via direct messages</p>
                                    </div>
                                    <ToggleSwitch
                                        v-model="localConfig.general.allowDMTranslations"
                                        @update:modelValue="markUnsaved"
                                    />
                                </div>
                            </div>
                        </ConfigSection>

                        <!-- Restricted Channels -->
                        <ConfigSection
                            title="Restricted Channels"
                            icon="Ban"
                            description="Channels where the bot should not respond to translation requests"
                        >
                            <ChannelSelector
                                v-model="localConfig.restrictions.blockedChannels"
                                :server-id="serverId"
                                label="Blocked Channels"
                                description="Translation reactions will be ignored in these channels"
                                @update:modelValue="markUnsaved"
                            />
                        </ConfigSection>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import ConfigSection from '@/components/translate/bot/config/ConfigSection.vue'
import ToggleSwitch from '@/components/translate/bot/config/ToggleSwitch.vue'
import ChannelSelector from '@/components/translate/bot/config/ChannelSelector.vue'
import LanguageSelector from '@/components/translate/bot/config/LanguageSelector.vue'
import { 
    ArrowLeft, 
    Save, 
    Loader2, 
    AlertCircle, 
    CheckCircle,
    Plus,
    Trash2
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useTranslateStore()

const serverId = route.params.serverId
const loading = ref(true)
const error = ref(null)
const saving = ref(false)
const saveSuccess = ref(false)
const hasUnsavedChanges = ref(false)
const serverInfo = ref(null)

// Local config state
const localConfig = ref({
    autoTranslate: {
        enabled: false,
        channels: [],
        defaultLanguage: 'en'
    },
    announcements: {
        enabled: false,
        sourceChannel: null,
        targetChannels: []
    },
    general: {
        replyAsThread: true,
        showOriginalLanguage: true,
        allowDMTranslations: true
    },
    restrictions: {
        blockedChannels: []
    }
})

async function loadConfig() {
    loading.value = true
    error.value = null

    try {
        const config = await store.fetchServerConfig(serverId)
        
        // Merge fetched config with defaults
        localConfig.value = {
            ...localConfig.value,
            ...config
        }

        // Get server info
        serverInfo.value = store.serversWithBot.find(s => s.id === serverId)
        
        hasUnsavedChanges.value = false
    } catch (err) {
        console.error('Failed to load config:', err)
        error.value = err.message || 'Failed to load configuration'
    } finally {
        loading.value = false
    }
}

async function saveConfig() {
    saving.value = true
    saveSuccess.value = false

    try {
        await store.updateServerConfig(serverId, localConfig.value)
        hasUnsavedChanges.value = false
        saveSuccess.value = true

        // Hide success message after 3 seconds
        setTimeout(() => {
            saveSuccess.value = false
        }, 3000)
    } catch (err) {
        console.error('Failed to save config:', err)
        error.value = err.message || 'Failed to save configuration'
    } finally {
        saving.value = false
    }
}

function markUnsaved() {
    hasUnsavedChanges.value = true
}

function addTargetChannel() {
    localConfig.value.announcements.targetChannels.push({
        language: 'en',
        channel: null
    })
    markUnsaved()
}

function removeTargetChannel(index) {
    localConfig.value.announcements.targetChannels.splice(index, 1)
    markUnsaved()
}

// Warn before leaving with unsaved changes
onMounted(() => {
    if (!store.isDiscordAuthenticated) {
        router.push('/translate/bot/login')
        return
    }

    loadConfig()

    // Prevent navigation with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges.value) {
            e.preventDefault()
            e.returnValue = ''
        }
    })
})
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>
