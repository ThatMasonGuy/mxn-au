<!-- views/Authentication.vue -->
<template>
    <div class="flex items-center justify-center min-h-[calc(100vh-8rem)] p-8">
        <div class="w-full max-w-md">
            <div class="translate-glass-card text-center">
                <div class="mb-8">
                    <div
                        class="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mb-4">
                        <Bot class="h-8 w-8 text-white" />
                    </div>
                    <h1 class="text-3xl font-black text-white mb-2">Translation Bot</h1>
                    <p class="text-zinc-300">Manage your Discord translation and reaction role settings</p>
                </div>

                <button @click="authenticateDiscord" :disabled="loading" class="translate-btn-primary w-full mb-6">
                    <Shield class="h-5 w-5" />
                    <span v-if="loading">Connecting...</span>
                    <span v-else>Login with Discord</span>
                </button>

                <div class="space-y-4 text-sm text-zinc-400">
                    <div class="flex items-center gap-3">
                        <Check class="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>Only access servers where you have Manage Server permissions</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Check class="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>Secure OAuth2 authentication through Discord</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <Check class="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span>No message content access - only server management</span>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-white/10">
                    <p class="text-xs text-zinc-500 mb-4">
                        Having trouble? Check our
                        <a href="#" class="text-violet-400 hover:text-violet-300 underline">setup guide</a>
                        or
                        <a href="#" class="text-violet-400 hover:text-violet-300 underline">contact support</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bot, Shield, Check } from 'lucide-vue-next'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'
import { useRouter } from 'vue-router'

const store = useDiscordBotStore()
const router = useRouter()
const loading = ref(false)

const authenticateDiscord = async () => {
    loading.value = true
    try {
        await store.authenticateWithDiscord()
        // Navigation will be handled by the store/main component
    } catch (error) {
        console.error('Authentication failed:', error)
        // Show error toast
    } finally {
        loading.value = false
    }
}
</script>