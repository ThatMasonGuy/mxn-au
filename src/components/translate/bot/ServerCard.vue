<template>
    <div 
        class="group relative cursor-pointer transition-all duration-300"
        :class="[
            server.hasBotInstalled 
                ? 'hover:scale-105' 
                : 'opacity-60 hover:opacity-80'
        ]"
        @click="handleClick"
    >
        <!-- Glow effect for installed servers -->
        <div 
            v-if="server.hasBotInstalled"
            class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"
        ></div>

        <div 
            class="relative p-6 bg-zinc-800/50 backdrop-blur border rounded-2xl transition-all"
            :class="[
                server.hasBotInstalled 
                    ? 'border-zinc-700/50 group-hover:border-violet-700/50' 
                    : 'border-zinc-700/30 border-dashed'
            ]"
        >
            <!-- Server Icon & Status -->
            <div class="flex items-start gap-4 mb-4">
                <!-- Server Icon -->
                <div class="relative flex-shrink-0">
                    <div 
                        v-if="server.icon"
                        class="h-16 w-16 rounded-2xl overflow-hidden border-2"
                        :class="[
                            server.hasBotInstalled 
                                ? 'border-violet-500/20' 
                                : 'border-zinc-700/30'
                        ]"
                    >
                        <img 
                            :src="getServerIconUrl(server)" 
                            :alt="server.name"
                            class="h-full w-full object-cover"
                        />
                    </div>
                    <div 
                        v-else
                        class="h-16 w-16 rounded-2xl flex items-center justify-center font-bold text-xl border-2"
                        :class="[
                            server.hasBotInstalled 
                                ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' 
                                : 'bg-zinc-700/30 border-zinc-700/30 text-zinc-500'
                        ]"
                    >
                        {{ getServerInitials(server.name) }}
                    </div>

                    <!-- Status Badge -->
                    <div 
                        class="absolute -bottom-1 -right-1 p-1.5 rounded-lg border-2 border-zinc-800"
                        :class="[
                            server.hasBotInstalled 
                                ? 'bg-green-500' 
                                : 'bg-zinc-600'
                        ]"
                    >
                        <Bot 
                            class="h-3 w-3"
                            :class="[
                                server.hasBotInstalled 
                                    ? 'text-white' 
                                    : 'text-zinc-400'
                            ]"
                        />
                    </div>
                </div>

                <!-- Server Info -->
                <div class="flex-1 min-w-0">
                    <h3 
                        class="font-bold truncate mb-1"
                        :class="[
                            server.hasBotInstalled 
                                ? 'text-white' 
                                : 'text-zinc-400'
                        ]"
                    >
                        {{ server.name }}
                    </h3>
                    <div class="flex items-center gap-2">
                        <span 
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                            :class="[
                                server.hasBotInstalled 
                                    ? 'bg-green-500/10 text-green-400' 
                                    : 'bg-amber-500/10 text-amber-400'
                            ]"
                        >
                            <div 
                                class="h-1.5 w-1.5 rounded-full"
                                :class="[
                                    server.hasBotInstalled 
                                        ? 'bg-green-400' 
                                        : 'bg-amber-400'
                                ]"
                            ></div>
                            {{ server.hasBotInstalled ? 'Bot Active' : 'Not Installed' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Server Stats (if bot is installed) -->
            <div 
                v-if="server.hasBotInstalled && serverStats"
                class="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-zinc-700/30"
            >
                <div class="text-center">
                    <p class="text-lg font-bold text-violet-400">{{ serverStats.translations || 0 }}</p>
                    <p class="text-xs text-zinc-500">Translations</p>
                </div>
                <div class="text-center">
                    <p class="text-lg font-bold text-fuchsia-400">{{ serverStats.channels || 0 }}</p>
                    <p class="text-xs text-zinc-500">Channels</p>
                </div>
            </div>

            <!-- Action Button -->
            <button
                class="w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                :class="[
                    server.hasBotInstalled
                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                        : 'bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                ]"
                @click.stop="handleAction"
            >
                <template v-if="server.hasBotInstalled">
                    <Settings class="h-4 w-4" />
                    <span>Configure Bot</span>
                </template>
                <template v-else>
                    <Plus class="h-4 w-4" />
                    <span>Invite Bot</span>
                </template>
            </button>

            <!-- Not Installed Overlay Message -->
            <div 
                v-if="!server.hasBotInstalled"
                class="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl"
            >
                <p class="text-xs text-amber-400/80 text-center">
                    Click to invite MXN Translate to this server
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bot, Settings, Plus } from 'lucide-vue-next'

const props = defineProps({
    server: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['configure', 'invite'])

const serverStats = ref(null)

const getServerIconUrl = (server) => {
    if (!server.icon) return null
    return `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=128`
}

const getServerInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const handleClick = () => {
    if (props.server.hasBotInstalled) {
        emit('configure', props.server.id)
    } else {
        emit('invite', props.server.id)
    }
}

const handleAction = (e) => {
    e.stopPropagation()
    handleClick()
}

// Optionally fetch server-specific stats if bot is installed
onMounted(async () => {
    if (props.server.hasBotInstalled) {
        // You could fetch server-specific stats here
        // For now, using mock data
        serverStats.value = {
            translations: Math.floor(Math.random() * 10000),
            channels: Math.floor(Math.random() * 50)
        }
    }
})
</script>

<style scoped>
button:active {
    transform: scale(0.98);
}
</style>
