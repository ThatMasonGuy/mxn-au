<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-950 to-zinc-900 flex items-center justify-center p-8">
        <!-- Noise texture overlay -->
        <div class="fixed inset-0 opacity-20 mix-blend-soft-light pointer-events-none"
            style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 opacity=%220.4%22/%3E%3C/svg%3E')">
        </div>

        <div class="max-w-md w-full relative z-10">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center gap-3 mb-4">
                    <div class="p-3 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl">
                        <Bot class="h-8 w-8 text-white" />
                    </div>
                </div>
                <h1 class="text-4xl font-black text-white mb-2">MXN Translate</h1>
                <p class="text-zinc-400">Bot Configuration Dashboard</p>
            </div>

            <!-- Main Card -->
            <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl opacity-20 group-hover:opacity-30 blur transition-opacity">
                </div>
                <div class="relative bg-zinc-800/80 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8">
                    
                    <!-- Error Message -->
                    <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div class="flex items-start gap-3">
                            <AlertCircle class="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p class="text-red-300 text-sm font-semibold mb-1">Authentication Error</p>
                                <p class="text-red-400/80 text-sm">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="text-center py-12">
                        <div class="inline-flex items-center gap-3 mb-4">
                            <Loader2 class="h-8 w-8 text-violet-400 animate-spin" />
                        </div>
                        <p class="text-zinc-300 font-semibold mb-2">{{ loadingMessage }}</p>
                        <p class="text-zinc-500 text-sm">This should only take a moment...</p>
                    </div>

                    <!-- Login Content -->
                    <div v-else>
                        <div class="text-center mb-6">
                            <h2 class="text-2xl font-bold text-white mb-2">Sign in with Discord</h2>
                            <p class="text-zinc-400">Manage your server's translation settings</p>
                        </div>

                        <!-- Features List -->
                        <div class="space-y-3 mb-8">
                            <div class="flex items-center gap-3 text-zinc-300">
                                <div class="flex-shrink-0 p-1.5 bg-violet-500/10 rounded-lg">
                                    <Shield class="h-4 w-4 text-violet-400" />
                                </div>
                                <span class="text-sm">Manage servers where you're an admin</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <div class="flex-shrink-0 p-1.5 bg-fuchsia-500/10 rounded-lg">
                                    <Settings class="h-4 w-4 text-fuchsia-400" />
                                </div>
                                <span class="text-sm">Configure auto-translate & announcement channels</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <div class="flex-shrink-0 p-1.5 bg-green-500/10 rounded-lg">
                                    <Lock class="h-4 w-4 text-green-400" />
                                </div>
                                <span class="text-sm">Your tokens are stored securely on our servers</span>
                            </div>
                        </div>

                        <!-- Discord Login Button -->
                        <button
                            @click="handleLogin"
                            class="group w-full relative px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-bold text-white overflow-hidden transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <svg class="h-6 w-6" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                            </svg>
                            <span>Continue with Discord</span>
                        </button>

                        <!-- Privacy Notice -->
                        <div class="mt-6 p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                            <p class="text-xs text-zinc-500 text-center">
                                By continuing, you agree to let MXN Translate access your Discord server list. 
                                Your access tokens are encrypted and stored securely - they never leave our servers.
                                <router-link to="/translate/legal" class="text-violet-400 hover:text-violet-300 underline">
                                    Privacy Policy
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Back to Home -->
            <div class="text-center mt-6">
                <router-link 
                    to="/translate" 
                    class="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft class="h-4 w-4" />
                    <span>Back to Translation Bot</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import { Bot, Shield, Settings, Lock, AlertCircle, Loader2, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const store = useTranslateStore()

const loading = ref(false)
const loadingMessage = ref('Authenticating...')
const error = ref(null)

function handleLogin() {
    error.value = null
    store.loginWithDiscord()
}

async function handleCallback() {
    const code = route.query.code
    const errorParam = route.query.error
    const errorDescription = route.query.error_description

    if (errorParam) {
        error.value = errorDescription || 'Discord authentication was cancelled or failed'
        return
    }

    if (!code) return

    loading.value = true
    loadingMessage.value = 'Authenticating with Discord...'

    try {
        await store.handleDiscordCallback(code)
        
        loadingMessage.value = 'Success! Redirecting...'
        
        // Small delay so user sees success message
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirect to dashboard
        router.push('/translate/bot/dashboard')
    } catch (err) {
        console.error('[Login] Auth error:', err)
        error.value = err.message || 'Failed to authenticate with Discord. Please try again.'
        loading.value = false
    }
}

onMounted(() => {
    // Check if we're returning from Discord OAuth
    if (route.query.code || route.query.error) {
        handleCallback()
    } else if (store.isDiscordAuthenticated) {
        // Already authenticated, redirect to dashboard
        router.push('/translate/bot/dashboard')
    } else {
        // Try to load from localStorage
        const loaded = store.loadDiscordAuth()
        if (loaded) {
            router.push('/translate/bot/dashboard')
        }
    }
})
</script>

<style scoped>
button {
    transition: all 0.2s ease;
}

button:active {
    transform: scale(0.98);
}

button:hover {
    box-shadow: 0 0 20px rgba(88, 101, 242, 0.4);
}
</style>