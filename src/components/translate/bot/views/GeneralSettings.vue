<template>
    <div class="space-y-6">
        <!-- Header -->
        <div>
            <h2 class="text-3xl font-bold text-white mb-2">General Settings</h2>
            <p class="text-zinc-400">Configure general bot behavior for this server</p>
        </div>

        <!-- Translation Enabled -->
        <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-1">Translation Enabled</h3>
                    <p class="text-sm text-zinc-500">Allow the bot to process translation requests in this server</p>
                </div>
                <button @click="toggleEnabled" :disabled="saving" :class="[
                    'relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ml-4',
                    localConfig.enabled ? 'bg-violet-600' : 'bg-zinc-700',
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                ]">
                    <span :class="[
                        'absolute top-1 left-1 h-5 w-5 bg-white rounded-full transition-transform',
                        localConfig.enabled ? 'translate-x-7' : 'translate-x-0'
                    ]"></span>
                </button>
            </div>
            <div v-if="!localConfig.enabled" class="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p class="text-sm text-amber-300 flex items-center gap-2">
                    <AlertTriangle class="h-4 w-4" />
                    Translation is disabled. The bot will not respond to translation requests.
                </p>
            </div>
        </div>

        <!-- Info Section -->
        <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <h3 class="text-lg font-semibold text-white mb-4">Translation Features</h3>
            <div class="space-y-4">
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                        <Flag class="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                        <p class="font-medium text-white">Flag Reactions</p>
                        <p class="text-sm text-zinc-500">React to any message with a flag emoji (🇪🇸, 🇫🇷, etc.) to translate it to that language</p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <div class="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
                        <Languages class="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <div>
                        <p class="font-medium text-white">Auto-Translate Channels</p>
                        <p class="text-sm text-zinc-500">Create paired channels that automatically translate all messages</p>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                        <Megaphone class="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                        <p class="font-medium text-white">Translation Redirects</p>
                        <p class="text-sm text-zinc-500">Protect important channels by redirecting translation replies elsewhere</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Command Reference -->
        <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <h3 class="text-lg font-semibold text-white mb-4">Commands Reference</h3>
            <div class="space-y-3 font-mono text-sm">
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate auto create</span>
                    <span class="text-zinc-500 ml-2">- Create an auto-translate channel pair</span>
                </div>
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate auto delete</span>
                    <span class="text-zinc-500 ml-2">- Remove an auto-translate channel</span>
                </div>
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate auto list</span>
                    <span class="text-zinc-500 ml-2">- List all auto-translate channels</span>
                </div>
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate config view</span>
                    <span class="text-zinc-500 ml-2">- View current translation configuration</span>
                </div>
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate config block-channel</span>
                    <span class="text-zinc-500 ml-2">- Block translations in a channel</span>
                </div>
                <div class="p-3 bg-zinc-900/50 border border-zinc-700/30 rounded-lg">
                    <span class="text-violet-300">/translate reaction-roles</span>
                    <span class="text-zinc-500 ml-2">- Set up reaction roles for language selection</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import { AlertTriangle, Flag, Languages, Megaphone } from 'lucide-vue-next'

const props = defineProps({
    serverId: String,
    config: Object
})

const emit = defineEmits(['update'])
const store = useTranslateStore()

const saving = ref(false)
const localConfig = ref({
    enabled: props.config?.general?.enabled ?? true
})

async function toggleEnabled() {
    saving.value = true
    try {
        localConfig.value.enabled = !localConfig.value.enabled
        emit('update', { general: { enabled: localConfig.value.enabled } })
    } finally {
        saving.value = false
    }
}

watch(() => props.config, (newConfig) => {
    if (newConfig) {
        localConfig.value = {
            enabled: newConfig.general?.enabled ?? true
        }
    }
}, { deep: true })
</script>