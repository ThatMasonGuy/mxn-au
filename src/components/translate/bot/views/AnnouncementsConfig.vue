<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Translation Redirects</h2>
                <p class="text-zinc-400">Protect channels by redirecting translation replies elsewhere</p>
            </div>
            <div class="px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-fuchsia-300 text-sm font-medium">
                {{ routes.length }} redirect{{ routes.length === 1 ? '' : 's' }} configured
            </div>
        </div>

        <!-- Info Banner -->
        <div class="p-4 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-xl flex items-start gap-3">
            <Info class="h-5 w-5 text-fuchsia-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-zinc-300">
                <p class="font-semibold text-white mb-1">Keep Important Channels Clean</p>
                <p>When someone requests a translation in a <strong>protected channel</strong> (like #announcements), 
                the translation reply will be posted to the <strong>redirect channel</strong> instead. 
                This keeps your announcement and important channels free of translation clutter.</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <Loader2 class="h-12 w-12 text-fuchsia-400 animate-spin" />
        </div>

        <div v-else class="space-y-6">
            <!-- Existing Routes -->
            <div v-if="routes.length > 0" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Active Routes</h3>
                
                <div v-for="route in routes" :key="route.id"
                    class="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <!-- Protected Channel -->
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <Shield class="h-4 w-4 text-amber-400" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs text-zinc-500 mb-0.5">Protected</p>
                                    <p class="text-white font-medium truncate">{{ route.sourceChannelName || route.source_channel_id }}</p>
                                </div>
                            </div>

                            <!-- Arrow -->
                            <ArrowRight class="h-5 w-5 text-fuchsia-400 flex-shrink-0" />

                            <!-- Redirect Channel -->
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="p-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg">
                                    <MessageSquareShare class="h-4 w-4 text-fuchsia-400" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs text-zinc-500 mb-0.5">Redirect To</p>
                                    <p class="text-white font-medium truncate">{{ route.announcementChannelName || route.announcement_channel_id }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Delete Button -->
                        <button 
                            @click="confirmDelete(route)"
                            class="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all ml-4"
                            title="Remove redirect"
                        >
                            <Trash2 class="h-4 w-4" />
                        </button>
                    </div>

                    <div v-if="route.created_at" class="mt-3 pt-3 border-t border-zinc-700/30 text-xs text-zinc-500">
                        Created: {{ formatDate(route.created_at) }}
                    </div>
                </div>
            </div>

            <!-- Add New Route -->
            <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                <h3 class="text-lg font-semibold text-white mb-4">Add New Redirect</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <!-- Protected Channel -->
                    <div>
                        <label class="block text-sm font-medium text-zinc-400 mb-2">Protected Channel</label>
                        <select v-model="newRoute.sourceChannel"
                            class="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                            <option :value="null">Select channel to protect...</option>
                            <option 
                                v-for="channel in availableSourceChannels" 
                                :key="channel.id" 
                                :value="channel.id"
                            >
                                # {{ channel.name }}
                            </option>
                        </select>
                        <p class="mt-1 text-xs text-zinc-500">Translations requested here will be redirected</p>
                    </div>

                    <!-- Redirect Channel -->
                    <div>
                        <label class="block text-sm font-medium text-zinc-400 mb-2">Redirect To</label>
                        <select v-model="newRoute.announcementChannel"
                            class="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                            <option :value="null">Select destination channel...</option>
                            <option 
                                v-for="channel in availableChannels" 
                                :key="channel.id" 
                                :value="channel.id"
                                :disabled="channel.id === newRoute.sourceChannel"
                            >
                                # {{ channel.name }}
                            </option>
                        </select>
                        <p class="mt-1 text-xs text-zinc-500">Translation replies will appear here instead</p>
                    </div>
                </div>

                <button 
                    @click="addRoute"
                    :disabled="!canAddRoute || saving"
                    class="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl text-white font-medium transition-all"
                >
                    <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
                    <Plus v-else class="h-4 w-4" />
                    <span>{{ saving ? 'Adding...' : 'Add Redirect' }}</span>
                </button>
            </div>

            <!-- Empty State (when no routes and no channels) -->
            <div v-if="routes.length === 0 && availableChannels.length === 0" class="text-center py-12">
                <Megaphone class="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                <p class="text-zinc-500">No channels available</p>
                <p class="text-sm text-zinc-600 mt-1">Channels will appear once the bot has access to them</p>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-white mb-2">Remove Redirect?</h3>
                <p class="text-zinc-400 mb-6">
                    Translations requested in 
                    <span class="text-white font-medium">#{{ deletingRoute?.sourceChannelName }}</span> 
                    will no longer be redirected to 
                    <span class="text-white font-medium">#{{ deletingRoute?.announcementChannelName }}</span>.
                    They will appear as replies in the original channel instead.
                </p>
                <div class="flex items-center gap-3 justify-end">
                    <button 
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        @click="deleteRoute"
                        :disabled="deleting"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <Loader2 v-if="deleting" class="h-4 w-4 animate-spin" />
                        <span>{{ deleting ? 'Removing...' : 'Remove' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import {
    Shield,
    MessageSquareShare,
    Hash,
    ArrowRight,
    Plus,
    Trash2,
    Info,
    Loader2,
    Megaphone
} from 'lucide-vue-next'

const props = defineProps({
    serverId: String,
    config: Object
})

const emit = defineEmits(['update'])
const store = useTranslateStore()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const routes = ref([])
const availableChannels = ref([])
const channelMap = ref({})
const showDeleteModal = ref(false)
const deletingRoute = ref(null)

const newRoute = ref({
    sourceChannel: null,
    announcementChannel: null
})

// Filter out channels that already have routes
const availableSourceChannels = computed(() => {
    const usedSourceIds = new Set(routes.value.map(r => r.source_channel_id))
    return availableChannels.value.filter(ch => !usedSourceIds.has(ch.id))
})

const canAddRoute = computed(() => {
    return newRoute.value.sourceChannel && 
           newRoute.value.announcementChannel && 
           newRoute.value.sourceChannel !== newRoute.value.announcementChannel
})

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
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

        // Load announcement routes from config
        const configRoutes = props.config?.announcements?.routes || []
        routes.value = configRoutes.map(route => ({
            ...route,
            sourceChannelName: channelMap.value[route.source_channel_id] || null,
            announcementChannelName: channelMap.value[route.announcement_channel_id] || null
        }))
    } catch (error) {
        console.error('Failed to load announcement config:', error)
        routes.value = []
    } finally {
        loading.value = false
    }
}

async function addRoute() {
    if (!canAddRoute.value) return

    saving.value = true
    try {
        await store.addAnnouncementRoute(
            props.serverId,
            newRoute.value.sourceChannel,
            newRoute.value.announcementChannel
        )

        // Add to local state
        routes.value.push({
            source_channel_id: newRoute.value.sourceChannel,
            announcement_channel_id: newRoute.value.announcementChannel,
            sourceChannelName: channelMap.value[newRoute.value.sourceChannel],
            announcementChannelName: channelMap.value[newRoute.value.announcementChannel],
            created_at: new Date().toISOString()
        })

        // Reset form
        newRoute.value = { sourceChannel: null, announcementChannel: null }
    } catch (error) {
        console.error('Failed to add announcement route:', error)
        alert('Failed to add route. Please try again.')
    } finally {
        saving.value = false
    }
}

function confirmDelete(route) {
    deletingRoute.value = route
    showDeleteModal.value = true
}

async function deleteRoute() {
    if (!deletingRoute.value) return

    deleting.value = true
    try {
        await store.removeAnnouncementRoute(props.serverId, deletingRoute.value.source_channel_id)
        routes.value = routes.value.filter(r => r.source_channel_id !== deletingRoute.value.source_channel_id)
        showDeleteModal.value = false
        deletingRoute.value = null
    } catch (error) {
        console.error('Failed to remove announcement route:', error)
        alert('Failed to remove route. Please try again.')
    } finally {
        deleting.value = false
    }
}

watch(() => props.serverId, () => {
    loadData()
})

watch(() => props.config, () => {
    loadData()
}, { deep: true })

onMounted(() => {
    loadData()
})
</script>