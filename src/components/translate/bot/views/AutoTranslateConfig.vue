<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white mb-2">Auto-Translate Channels</h2>
                <p class="text-zinc-400">Create paired channels that automatically translate messages between languages</p>
            </div>
            <div class="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-300 text-sm font-medium">
                {{ channelPairs.length }} active pair{{ channelPairs.length === 1 ? '' : 's' }}
            </div>
        </div>

        <!-- Info Banner -->
        <div class="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl flex items-start gap-3">
            <Info class="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-zinc-300">
                <p class="font-semibold text-white mb-1">How Auto-Translate Works</p>
                <p>Messages in the <strong>source channel</strong> are automatically translated and posted to the <strong>target channel</strong>, and vice versa. 
                This allows users speaking different languages to have seamless conversations.</p>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-24">
            <Loader2 class="h-12 w-12 text-violet-400 animate-spin" />
        </div>

        <div v-else class="space-y-6">
            <!-- Existing Channel Pairs -->
            <div v-if="channelPairs.length > 0" class="space-y-4">
                <h3 class="text-lg font-semibold text-white">Active Pairs</h3>
                
                <div v-for="pair in channelPairs" :key="pair.id"
                    class="p-5 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4 flex-1 min-w-0">
                            <!-- Source Channel -->
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="p-2 bg-zinc-700/50 rounded-lg">
                                    <Hash class="h-4 w-4 text-zinc-400" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs text-zinc-500 mb-0.5">Source</p>
                                    <p class="text-white font-medium truncate">{{ pair.sourceChannelName || pair.source_channel_id }}</p>
                                </div>
                            </div>

                            <!-- Arrows showing bidirectional -->
                            <div class="flex flex-col items-center gap-0.5 flex-shrink-0">
                                <ArrowRight class="h-4 w-4 text-violet-400" />
                                <ArrowLeft class="h-4 w-4 text-fuchsia-400" />
                            </div>

                            <!-- Target Channel -->
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                    <Languages class="h-4 w-4 text-violet-400" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs text-zinc-500 mb-0.5">{{ getLanguageName(pair.target_language) }}</p>
                                    <p class="text-white font-medium truncate">{{ pair.channelName || pair.channel_id }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Status & Actions -->
                        <div class="flex items-center gap-3 flex-shrink-0 ml-4">
                            <span :class="[
                                'px-2.5 py-1 rounded-full text-xs font-medium',
                                pair.is_active 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/50'
                            ]">
                                {{ pair.is_active ? 'Active' : 'Inactive' }}
                            </span>
                            
                            <button 
                                @click="confirmDelete(pair)"
                                class="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                                title="Remove auto-translate pair"
                            >
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="mt-4 pt-4 border-t border-zinc-700/30 flex items-center gap-6 text-xs text-zinc-500">
                        <span v-if="pair.created_at">
                            Created: {{ formatDate(pair.created_at) }}
                        </span>
                        <span v-if="pair.webhook_id" class="flex items-center gap-1">
                            <Webhook class="h-3 w-3" />
                            Webhook configured
                        </span>
                    </div>
                </div>
            </div>

            <!-- Create New Pair -->
            <div class="p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl backdrop-blur">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-semibold text-white">Create New Auto-Translate Pair</h3>
                    <button 
                        v-if="!showCreateForm"
                        @click="showCreateForm = true"
                        class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-medium transition-all"
                    >
                        <Plus class="h-4 w-4" />
                        New Pair
                    </button>
                </div>

                <!-- Create Form -->
                <div v-if="showCreateForm" class="space-y-6">
                    <!-- Step 1: Source Channel -->
                    <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">1</div>
                            <h4 class="font-semibold text-white">Source Channel</h4>
                        </div>
                        <p class="text-sm text-zinc-500 mb-3">Select the channel where users will send messages in the original language</p>
                        
                        <select v-model="newPair.sourceChannelId"
                            class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                            <option :value="null">Select source channel...</option>
                            <option v-for="channel in availableSourceChannels" :key="channel.id" :value="channel.id">
                                # {{ channel.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Step 2: Target Language -->
                    <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">2</div>
                            <h4 class="font-semibold text-white">Target Language</h4>
                        </div>
                        <p class="text-sm text-zinc-500 mb-3">Messages from the source channel will be translated to this language</p>
                        
                        <select v-model="newPair.targetLanguage"
                            class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                            <option :value="null">Select language...</option>
                            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                                {{ lang.flag }} {{ lang.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Step 3: Target Channel -->
                    <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">3</div>
                            <h4 class="font-semibold text-white">Target Channel</h4>
                        </div>
                        <p class="text-sm text-zinc-500 mb-3">Where should translated messages be posted?</p>
                        
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                <input type="radio" v-model="newPair.targetChannelMode" value="create" 
                                    class="w-4 h-4 text-violet-600 bg-zinc-700 border-zinc-600 focus:ring-violet-500">
                                <div>
                                    <p class="text-white font-medium">Create new channel</p>
                                    <p class="text-xs text-zinc-500">Bot will create a new channel for translations</p>
                                </div>
                            </label>
                            
                            <label class="flex items-center gap-3 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                <input type="radio" v-model="newPair.targetChannelMode" value="existing"
                                    class="w-4 h-4 text-violet-600 bg-zinc-700 border-zinc-600 focus:ring-violet-500">
                                <div>
                                    <p class="text-white font-medium">Use existing channel</p>
                                    <p class="text-xs text-zinc-500">Select an existing channel</p>
                                </div>
                            </label>
                        </div>

                        <!-- New Channel Name -->
                        <div v-if="newPair.targetChannelMode === 'create'" class="mt-4">
                            <label class="block text-sm font-medium text-zinc-400 mb-2">New Channel Name</label>
                            <div class="flex items-center gap-2">
                                <span class="text-zinc-500">#</span>
                                <input v-model="newPair.newChannelName" type="text" 
                                    :placeholder="suggestedChannelName"
                                    class="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                            </div>
                        </div>

                        <!-- Existing Channel Selector -->
                        <div v-if="newPair.targetChannelMode === 'existing'" class="mt-4">
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Select Channel</label>
                            <select v-model="newPair.existingChannelId"
                                class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option :value="null">Select channel...</option>
                                <option v-for="channel in availableTargetChannels" :key="channel.id" :value="channel.id">
                                    # {{ channel.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Step 4: Reverse Translation -->
                    <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">4</div>
                            <h4 class="font-semibold text-white">Reverse Translation</h4>
                        </div>
                        <p class="text-sm text-zinc-500 mb-3">Messages from the target channel will be translated back to this language</p>
                        
                        <select v-model="newPair.reverseLanguage" disabled
                            class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 cursor-not-allowed opacity-75">
                            <option value="en">🇬🇧 English</option>
                        </select>
                        <p class="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                            <Lock class="h-3 w-3" />
                            Different reverse languages coming soon
                        </p>
                    </div>

                    <!-- Step 5: Role Restriction (Optional) -->
                    <div class="p-4 bg-zinc-900/50 border border-zinc-700/30 rounded-xl">
                        <div class="flex items-center gap-2 mb-4">
                            <div class="h-6 w-6 rounded-full bg-zinc-600 flex items-center justify-center text-xs font-bold text-white">5</div>
                            <h4 class="font-semibold text-white">Role Restriction</h4>
                            <span class="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-700/50 rounded">Optional</span>
                        </div>
                        <p class="text-sm text-zinc-500 mb-3">Optionally restrict who can see the target channel</p>
                        
                        <label class="flex items-center gap-3 mb-4">
                            <input type="checkbox" v-model="newPair.useRoleRestriction"
                                class="w-4 h-4 text-violet-600 bg-zinc-700 border-zinc-600 rounded focus:ring-violet-500">
                            <span class="text-white">Restrict access with a role</span>
                        </label>

                        <div v-if="newPair.useRoleRestriction" class="space-y-3 pl-7">
                            <label class="flex items-center gap-3 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                <input type="radio" v-model="newPair.roleMode" value="create"
                                    class="w-4 h-4 text-violet-600 bg-zinc-700 border-zinc-600 focus:ring-violet-500">
                                <div>
                                    <p class="text-white font-medium">Create new role</p>
                                    <p class="text-xs text-zinc-500">Bot will create a role for this channel</p>
                                </div>
                            </label>
                            
                            <label class="flex items-center gap-3 p-3 bg-zinc-800/30 border border-zinc-700/30 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors">
                                <input type="radio" v-model="newPair.roleMode" value="existing"
                                    class="w-4 h-4 text-violet-600 bg-zinc-700 border-zinc-600 focus:ring-violet-500">
                                <div>
                                    <p class="text-white font-medium">Use existing role</p>
                                    <p class="text-xs text-zinc-500">Select an existing role</p>
                                </div>
                            </label>

                            <!-- New Role Name -->
                            <div v-if="newPair.roleMode === 'create'" class="mt-3">
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Role Name</label>
                                <input v-model="newPair.newRoleName" type="text" 
                                    :placeholder="suggestedRoleName"
                                    class="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                            </div>

                            <!-- Existing Role Selector -->
                            <div v-if="newPair.roleMode === 'existing'" class="mt-3">
                                <label class="block text-sm font-medium text-zinc-400 mb-2">Select Role</label>
                                <select v-model="newPair.existingRoleId"
                                    class="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option :value="null">Select role...</option>
                                    <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                                        {{ role.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Summary -->
                    <div v-if="canCreate" class="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
                        <h4 class="font-semibold text-white mb-2">Summary</h4>
                        <div class="text-sm text-zinc-300 space-y-1">
                            <p>
                                <span class="text-zinc-500">Source:</span> 
                                <span class="text-white font-medium">#{{ getChannelName(newPair.sourceChannelId) }}</span>
                            </p>
                            <p>
                                <span class="text-zinc-500">Target:</span> 
                                <span class="text-white font-medium">
                                    #{{ newPair.targetChannelMode === 'create' 
                                        ? (newPair.newChannelName || suggestedChannelName) 
                                        : getChannelName(newPair.existingChannelId) }}
                                </span>
                                <span class="text-violet-400">({{ getLanguageName(newPair.targetLanguage) }})</span>
                            </p>
                            <p>
                                <span class="text-zinc-500">Reverse to:</span> 
                                <span class="text-fuchsia-400">English</span>
                            </p>
                            <p v-if="newPair.useRoleRestriction">
                                <span class="text-zinc-500">Role:</span> 
                                <span class="text-amber-400">
                                    {{ newPair.roleMode === 'create' 
                                        ? (newPair.newRoleName || suggestedRoleName) 
                                        : getRoleName(newPair.existingRoleId) }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3 justify-end">
                        <button @click="resetForm"
                            class="px-4 py-2 text-zinc-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button 
                            @click="createPair"
                            :disabled="!canCreate || creating"
                            class="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl text-white font-medium transition-all"
                        >
                            <Loader2 v-if="creating" class="h-4 w-4 animate-spin" />
                            <Sparkles v-else class="h-4 w-4" />
                            <span>{{ creating ? 'Creating...' : 'Create Pair' }}</span>
                        </button>
                    </div>
                </div>

                <!-- Empty state when form is hidden -->
                <div v-if="!showCreateForm && channelPairs.length === 0" class="text-center py-12">
                    <div class="inline-flex p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl mb-4">
                        <Languages class="h-12 w-12 text-zinc-600" />
                    </div>
                    <p class="text-zinc-500">No auto-translate pairs configured</p>
                    <p class="text-sm text-zinc-600 mt-1">Click "New Pair" to set up automatic translation between channels</p>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 class="text-xl font-bold text-white mb-2">Remove Auto-Translate Pair?</h3>
                <p class="text-zinc-400 mb-6">
                    This will disable auto-translation between 
                    <span class="text-white font-medium">#{{ deletingPair?.sourceChannelName || deletingPair?.source_channel_id }}</span> and 
                    <span class="text-white font-medium">#{{ deletingPair?.channelName || deletingPair?.channel_id }}</span>.
                    The channels themselves won't be deleted.
                </p>
                <div class="flex items-center gap-3 justify-end">
                    <button 
                        @click="showDeleteModal = false"
                        class="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        @click="deletePair"
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
    Languages, 
    Hash, 
    ArrowRight,
    ArrowLeft,
    Trash2, 
    Info, 
    Loader2,
    Webhook,
    Plus,
    Sparkles,
    Lock
} from 'lucide-vue-next'

const props = defineProps({
    serverId: String,
    config: Object
})

const emit = defineEmits(['update'])
const store = useTranslateStore()

const loading = ref(true)
const creating = ref(false)
const deleting = ref(false)
const showCreateForm = ref(false)
const showDeleteModal = ref(false)
const deletingPair = ref(null)

const channelPairs = ref([])
const availableChannels = ref([])
const availableRoles = ref([])
const channelMap = ref({})
const roleMap = ref({})

const newPair = ref({
    sourceChannelId: null,
    targetLanguage: null,
    targetChannelMode: 'create',
    newChannelName: '',
    existingChannelId: null,
    reverseLanguage: 'en',
    useRoleRestriction: false,
    roleMode: 'create',
    newRoleName: '',
    existingRoleId: null
})

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'el', name: 'Greek', flag: '🇬🇷' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
    { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
    { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
    { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
    { code: 'ms', name: 'Malay', flag: '🇲🇾' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' }
]

const languageNames = Object.fromEntries(languages.map(l => [l.code, l.name]))

// Channels not already used as source in existing pairs
const availableSourceChannels = computed(() => {
    const usedSources = new Set(channelPairs.value.map(p => p.source_channel_id))
    return availableChannels.value.filter(ch => !usedSources.has(ch.id))
})

// Channels not already used as target and not the selected source
const availableTargetChannels = computed(() => {
    const usedTargets = new Set(channelPairs.value.map(p => p.channel_id))
    return availableChannels.value.filter(ch => 
        !usedTargets.has(ch.id) && ch.id !== newPair.value.sourceChannelId
    )
})

const suggestedChannelName = computed(() => {
    if (!newPair.value.sourceChannelId || !newPair.value.targetLanguage) return 'translations'
    const sourceName = channelMap.value[newPair.value.sourceChannelId] || 'chat'
    const langName = languageNames[newPair.value.targetLanguage]?.toLowerCase() || newPair.value.targetLanguage
    return `${sourceName}-${langName}`
})

const suggestedRoleName = computed(() => {
    const langName = languageNames[newPair.value.targetLanguage] || 'Language'
    return `${langName} Speaker`
})

const canCreate = computed(() => {
    if (!newPair.value.sourceChannelId || !newPair.value.targetLanguage) return false
    
    if (newPair.value.targetChannelMode === 'create') {
        // Channel name will use suggested if empty, so this is fine
    } else if (!newPair.value.existingChannelId) {
        return false
    }
    
    if (newPair.value.useRoleRestriction) {
        if (newPair.value.roleMode === 'existing' && !newPair.value.existingRoleId) {
            return false
        }
    }
    
    return true
})

function getLanguageName(code) {
    return languageNames[code] || code?.toUpperCase() || 'Unknown'
}

function getChannelName(channelId) {
    return channelMap.value[channelId] || channelId
}

function getRoleName(roleId) {
    return roleMap.value[roleId] || roleId
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

function resetForm() {
    showCreateForm.value = false
    newPair.value = {
        sourceChannelId: null,
        targetLanguage: null,
        targetChannelMode: 'create',
        newChannelName: '',
        existingChannelId: null,
        reverseLanguage: 'en',
        useRoleRestriction: false,
        roleMode: 'create',
        newRoleName: '',
        existingRoleId: null
    }
}

async function loadData() {
    if (!props.serverId) return

    loading.value = true
    try {
        // Load channels from Discord (fresh)
        const channels = await store.fetchServerChannels(props.serverId)
        availableChannels.value = channels.filter(ch => ch.type === 0 || ch.type === 5)
        
        channelMap.value = {}
        channels.forEach(ch => {
            channelMap.value[ch.id] = ch.name
        })

        // Load roles
        try {
            const roles = await store.fetchServerRoles(props.serverId)
            availableRoles.value = roles.filter(r => r.name !== '@everyone' && !r.managed)
            
            roleMap.value = {}
            roles.forEach(r => {
                roleMap.value[r.id] = r.name
            })
        } catch (e) {
            console.log('Roles fetch not available yet')
            availableRoles.value = []
        }

        // Load existing pairs from config
        const pairs = props.config?.autoTranslate?.pairs || []
        channelPairs.value = pairs.map(pair => ({
            ...pair,
            channelName: channelMap.value[pair.channel_id] || null,
            sourceChannelName: channelMap.value[pair.source_channel_id] || null
        }))
    } catch (error) {
        console.error('Failed to load auto-translate config:', error)
        channelPairs.value = []
    } finally {
        loading.value = false
    }
}

async function createPair() {
    if (!canCreate.value) return

    creating.value = true
    try {
        const payload = {
            sourceChannelId: newPair.value.sourceChannelId,
            targetLanguage: newPair.value.targetLanguage,
            reverseLanguage: newPair.value.reverseLanguage,
            createChannel: newPair.value.targetChannelMode === 'create',
            channelName: newPair.value.targetChannelMode === 'create' 
                ? (newPair.value.newChannelName || suggestedChannelName.value)
                : null,
            existingChannelId: newPair.value.targetChannelMode === 'existing'
                ? newPair.value.existingChannelId
                : null,
            useRole: newPair.value.useRoleRestriction,
            createRole: newPair.value.useRoleRestriction && newPair.value.roleMode === 'create',
            roleName: newPair.value.useRoleRestriction && newPair.value.roleMode === 'create'
                ? (newPair.value.newRoleName || suggestedRoleName.value)
                : null,
            existingRoleId: newPair.value.useRoleRestriction && newPair.value.roleMode === 'existing'
                ? newPair.value.existingRoleId
                : null
        }

        const result = await store.createAutoTranslatePair(props.serverId, payload)
        
        // Add to local state
        channelPairs.value.push({
            id: result.id,
            channel_id: result.channelId,
            source_channel_id: newPair.value.sourceChannelId,
            target_language: newPair.value.targetLanguage,
            is_active: true,
            created_at: new Date().toISOString(),
            channelName: result.channelName || channelMap.value[result.channelId],
            sourceChannelName: channelMap.value[newPair.value.sourceChannelId]
        })

        resetForm()
    } catch (error) {
        console.error('Failed to create auto-translate pair:', error)
        alert('Failed to create auto-translate pair: ' + error.message)
    } finally {
        creating.value = false
    }
}

function confirmDelete(pair) {
    deletingPair.value = pair
    showDeleteModal.value = true
}

async function deletePair() {
    if (!deletingPair.value) return

    deleting.value = true
    try {
        await store.deleteAutoTranslateChannel(props.serverId, deletingPair.value.channel_id)
        channelPairs.value = channelPairs.value.filter(p => p.id !== deletingPair.value.id)
        showDeleteModal.value = false
        deletingPair.value = null
    } catch (error) {
        console.error('Failed to delete auto-translate pair:', error)
        alert('Failed to remove auto-translate pair. Please try again.')
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