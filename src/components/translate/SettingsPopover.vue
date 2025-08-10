<!-- src/components/translate/SettingsPopover.vue -->
<template>
    <!-- Popover (shadcn/vue) so it portals and stays inside viewport -->
    <Popover v-model:open="open">
        <!-- Trigger button -->
        <PopoverTrigger as-child>
            <button
                class="group relative p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 text-white backdrop-blur-sm overflow-hidden"
                aria-label="Open settings">
                <div
                    class="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Settings class="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </PopoverTrigger>

        <!-- Content -->
        <PopoverContent side="bottom" align="end" :side-offset="8"
            class="relative w-[min(34rem,calc(100vw-2rem))] p-0 bg-slate-950/95 text-white border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <!-- Ambient accents -->
            <div
                class="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl bg-fuchsia-500/20" />
            <div
                class="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl bg-indigo-500/20" />
            <div class="h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500" />

            <!-- Body (scrollable to avoid overflow) -->
            <div class="relative max-h-[80vh] overflow-y-auto p-6 space-y-6">
                <!-- Header -->
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        <SlidersVertical class="w-5 h-5" />
                    </div>
                    <div class="mr-auto">
                        <h3
                            class="text-lg font-semibold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                            Settings</h3>
                        <p class="text-xs text-white/60">Tune how the translator behaves</p>
                    </div>
                    <!-- Login button (explicit route) -->
                    <button v-if="!isLoggedIn" @click="goLogin"
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/25 transition-colors">
                        <LogIn class="w-4 h-4" /> <span>Login</span>
                    </button>
                    <!-- Coffee / Support (fixed link) -->
                    <a href="https://buymeacoffee.com/ThatMasonGuy" target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm bg-amber-500/15 text-amber-300 border border-amber-400/20 hover:bg-amber-500/25 transition-colors ml-2">
                        <Coffee class="w-4 h-4" /> <span>Buy me a coffee</span>
                    </a>
                </div>

                <Separator class="bg-white/10" />

                <!-- API key section -->
                <section class="space-y-3">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                        <h4 class="text-sm font-semibold text-white/90">OpenAI API key</h4>
                    </div>

                    <!-- Why this exists -->
                    <div class="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                        <div class="p-1.5 rounded-lg bg-white/10">
                            <KeyRound class="w-4 h-4" />
                        </div>
                        <p class="text-xs text-white/70 leading-relaxed">
                            This lets translations run against <span class="text-white/90 font-medium">your own OpenAI
                                account</span> so usage is billed to you.
                            The key is stored <span class="text-white/90 font-medium">locally in your browser</span> and
                            you can remove it anytime.
                            If your deployment uses a server key instead, you can leave this blank.
                        </p>
                    </div>

                    <div class="space-y-2">
                        <Label for="apiKey" class="text-xs text-white/70">API key (starts with <code
                                class="font-mono">sk-</code>)</Label>
                        <div class="flex items-center gap-2">
                            <input id="apiKey" v-model="store.apiKey" :type="store.showApiKey ? 'text' : 'password'"
                                placeholder="sk-..."
                                class="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                autocomplete="off" spellcheck="false" />
                            <Button variant="secondary" class="bg-white/10 hover:bg-white/15 text-white/90"
                                type="button" @click="store.toggleShowApiKey()">
                                {{ store.showApiKey ? 'Hide' : 'Show' }}
                            </Button>
                        </div>
                    </div>

                    <!-- Safety note -->
                    <div class="flex items-start gap-3 text-xs text-white/60">
                        <ShieldCheck class="w-4 h-4 mt-0.5" />
                        <p>We don’t send your key to our servers. It’s only used for translation requests. Change this
                            copy if your policy differs.</p>
                    </div>
                </section>

                <Separator class="bg-white/10" />

                <!-- Preferences -->
                <section class="space-y-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                        <h4 class="text-sm font-semibold text-white/90">Preferences</h4>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <!-- Auto copy -->
                        <div
                            class="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                            <div class="min-w-0">
                                <div class="text-sm text-white/90">Auto‑copy translations</div>
                                <div class="text-xs text-white/50">Copy to clipboard after each run</div>
                            </div>
                            <Switch v-model:checked="store.autoCopy" />
                        </div>

                        <!-- Sync history -->
                        <div
                            class="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                            <div class="min-w-0">
                                <div class="text-sm text-white/90">Sync history to cloud</div>
                                <div class="text-xs text-white/50">Access on any device once logged in</div>
                            </div>
                            <Switch v-model:checked="store.syncHistory" />
                        </div>
                    </div>
                </section>

                <Separator class="bg-white/10" />

                <!-- Footer -->
                <div class="flex items-center justify-between">
                    <div class="text-xs text-white/50">
                        <span class="inline-flex items-center gap-1">
                            <Sparkles class="w-4 h-4" /> crafted with care
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Button variant="ghost" class="text-white/70 hover:text-white hover:bg-white/10"
                            @click="clearKey">
                            Clear key
                        </Button>
                        <Button class="bg-violet-600 hover:bg-violet-500 text-white" @click="open = false">Done</Button>
                    </div>
                </div>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslateStore } from '@/stores/useTranslateStore'
import { useMainStore } from '@/stores/useMainStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Settings, SlidersVertical, Coffee, KeyRound, ShieldCheck, Sparkles, LogIn } from 'lucide-vue-next'

const store = useTranslateStore()
const main = useMainStore()
const open = ref(false)
const router = useRouter()
const isLoggedIn = computed(() => !!main.user)

const clearKey = () => { store.apiKey = '' }
const goLogin = () => { open.value = false; router.push('/login') }
</script>