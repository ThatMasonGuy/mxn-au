<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Restrictions</h2>
                <p class="text-zinc-400">Channels where the bot will not respond to translation requests</p>
            </div>
            <div v-if="blockedChannels.length > 0"
                class="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm font-medium">
                {{ blockedChannels.length }} blocked
            </div>
        </div>

        <!-- Info Banner -->
        <div class="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle class="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-zinc-300">
                <p class="font-semibold text-white mb-1">About Blocked Channels</p>
                <p>When a channel is blocked, the bot will ignore all flag emoji reactions and will not translate messages in that channel. 
                This is useful for channels where you don't want translations to appear.</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <Loader2 class="h-12 w-12 text-violet-400 animate-spin" />
        </div>

        <!-- Channel List -->
        <div v-else class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <h3 class="text-lg font-semibold text-white mb-4">All Channels</h3>
            <p class="text-sm text-zinc-500 mb-4">Click a channel to toggle blocking</p>

            <div class="space-y-2 max-h-[500px] overflow-y-auto">
                <div v-for="channel in availableChannels" :key="channel.id" 
                    @click="toggleBlock(channel.id)"
                    :class="[
                        'flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all',
                        isBlocked(channel.id)
                            ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                            : 'bg-zinc-900/50 border-zinc-700/50 hover:bg-zinc-900'
                    ]">
                    <div :class="[
                        'h-5 w-5 rounded border-2 flex items-center justify-center transition-colors',
                        isBlocked(channel.id)
                            ? 'bg-red-600 border-red-600'
                            : 'border-zinc-600'
                    ]">
                        <Ban v-if="isBlocked(channel.id)" class="h-3 w-3 text-white" />
                    </div>
                    <Hash class="h-4 w-4 text-zinc-500 flex-shrink-0" />
                    <span class="text-white flex-1">{{ channel.name }}</span>
                    <span v-if="isBlocked(channel.id)"
                        class="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full font-medium">
                        Blocked
                    </span>
                    <span v-else class="text-xs text-zinc-600">
                        Click to block
                    </span>
                    <Loader2 v-if="savingChannels.has(channel.id)" class="h-4 w-4 text-violet-400 animate-spin" />
                </div>
            </div>

            <div v-if="availableChannels.length === 0" class="text-center py-12">
                <Hash class="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                <p class="text-zinc-500">No channels available</p>
                <p class="text-sm text-zinc-600 mt-1">Channels will appear once the bot has access to them</p>
            </div>
        </div>

        <!-- Blocked Summary -->
        <div v-if="blockedChannels.length > 0" class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
            <h3 class="text-lg font-semibold text-white mb-4">Currently Blocked</h3>
            <div class="flex flex-wrap gap-2">
                <div v-for="channelId in blockedChannels" :key="channelId"
                    class="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <Hash class="h-3 w-3 text-red-400" />
                    <span class="text-sm text-red-300">{{ getChannelName(channelId) }}</span>
                    <button @click.stop="toggleBlock(channelId)" class="p-0.5 hover:bg-red-500/20 rounded">
                        <X class="h-3 w-3 text-red-400" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import { Ban, Hash, X, Loader2, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
    serverId: String,
    config: Object
})

const emit = defineEmits(['update'])
const store = useTranslateStore()

const loading = ref(true)
const availableChannels = ref([])
const blockedChannels = ref([])
const channelMap = ref({})
const savingChannels = ref(new Set())

function isBlocked(channelId) {
    return blockedChannels.value.includes(channelId)
}

function getChannelName(channelId) {
    return channelMap.value[channelId] || channelId
}

async function loadData() {
    if (!props.serverId) return

    loading.value = true
    try {
        // Load channels
        const channels = await store.fetchServerChannels(props.serverId)
        availableChannels.value = channels.filter(ch => ch.type === 0)
        
        channelMap.value = {}
        channels.forEach(ch => {
            channelMap.value[ch.id] = ch.name
        })

        // Load blocked channels from config
        blockedChannels.value = props.config?.restrictions?.blockedChannels || []
    } catch (error) {
        console.error('Failed to load restrictions:', error)
    } finally {
        loading.value = false
    }
}

async function toggleBlock(channelId) {
    if (savingChannels.value.has(channelId)) return

    savingChannels.value.add(channelId)
    
    try {
        if (isBlocked(channelId)) {
            await store.unblockChannel(props.serverId, channelId)
            blockedChannels.value = blockedChannels.value.filter(id => id !== channelId)
        } else {
            await store.blockChannel(props.serverId, channelId)
            blockedChannels.value.push(channelId)
        }
    } catch (error) {
        console.error('Failed to toggle block:', error)
        alert('Failed to update channel. Please try again.')
    } finally {
        savingChannels.value.delete(channelId)
    }
}

watch(() => props.serverId, () => {
    loadData()
})

watch(() => props.config, () => {
    blockedChannels.value = props.config?.restrictions?.blockedChannels || []
}, { deep: true })

onMounted(() => {
    loadData()
})
</script>