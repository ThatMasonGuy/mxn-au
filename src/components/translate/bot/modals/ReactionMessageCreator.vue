<!-- components/ReactionMessageCreator.vue -->
<template>
    <div class="space-y-6">
        <!-- Message Details -->
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-white mb-2">
                    Message Title
                </label>
                <input v-model="messageData.title" placeholder="e.g., Choose your roles" class="translate-input" />
            </div>

            <div>
                <label class="block text-sm font-medium text-white mb-2">
                    Channel
                </label>
                <select v-model="messageData.channelId" class="translate-input">
                    <option value="">Select a channel...</option>
                    <option v-for="channel in availableChannels" :key="channel.id" :value="channel.id">
                        # {{ channel.name }}
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-white mb-2">
                    Message Content
                </label>
                <textarea v-model="messageData.content" rows="4"
                    placeholder="React with the emojis below to get your roles!"
                    class="translate-input resize-none"></textarea>
            </div>
        </div>

        <!-- Emoji-Role Mappings -->
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h4 class="font-medium text-white">Emoji-Role Mappings</h4>
                <button @click="addReaction" class="translate-btn-secondary text-sm">
                    <Plus class="h-4 w-4" />
                    Add Reaction
                </button>
            </div>

            <div v-if="messageData.reactions.length === 0"
                class="text-center py-8 text-zinc-400 border border-dashed border-zinc-600 rounded-lg">
                <Smile class="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reactions configured</p>
                <p class="text-sm">Add your first emoji-role mapping to get started</p>
            </div>

            <div v-else class="space-y-3">
                <div v-for="(reaction, index) in messageData.reactions" :key="index"
                    class="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">

                    <!-- Emoji Input -->
                    <div class="flex-shrink-0">
                        <label class="block text-xs text-zinc-400 mb-1">Emoji</label>
                        <div class="relative">
                            <input v-model="reaction.emoji" @input="validateEmoji(reaction, index)" placeholder="😀"
                                class="w-16 text-center translate-input text-lg" maxlength="4" />
                            <div v-if="reaction.error" class="absolute -bottom-5 left-0 text-xs text-red-400">
                                {{ reaction.error }}
                            </div>
                        </div>
                    </div>

                    <!-- Role Select -->
                    <div class="flex-1">
                        <label class="block text-xs text-zinc-400 mb-1">Role</label>
                        <select v-model="reaction.roleId" class="translate-input text-sm">
                            <option value="">Select a role...</option>
                            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                                {{ role.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Role Preview -->
                    <div class="flex-shrink-0">
                        <label class="block text-xs text-zinc-400 mb-1">Preview</label>
                        <div v-if="reaction.roleId" class="px-3 py-1 rounded text-sm font-medium"
                            :style="{ backgroundColor: getRoleColor(reaction.roleId) + '20', color: getRoleColor(reaction.roleId) }">
                            @{{ getRoleName(reaction.roleId) }}
                        </div>
                        <div v-else class="px-3 py-1 rounded text-sm text-zinc-500 bg-zinc-700">
                            No role
                        </div>
                    </div>

                    <!-- Remove Button -->
                    <button @click="removeReaction(index)"
                        class="flex-shrink-0 p-2 text-red-400 hover:text-red-300 transition-colors">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Message Preview -->
        <div class="space-y-3">
            <h4 class="font-medium text-white">Message Preview</h4>
            <div class="p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
                <!-- Discord Message Style -->
                <div class="flex gap-3">
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                        BOT
                    </div>
                    <div class="flex-1">
                        <div class="flex items-baseline gap-2 mb-1">
                            <span class="font-semibold text-white">Translation Bot</span>
                            <span class="text-xs text-zinc-500 bg-violet-600 px-1 rounded text-white">APP</span>
                            <span class="text-xs text-zinc-500">Today at {{ formatCurrentTime() }}</span>
                        </div>

                        <!-- Message Content -->
                        <div class="text-zinc-200 mb-3 whitespace-pre-line">
                            {{ messageData.content || 'React with the emojis below to get your roles!' }}
                        </div>

                        <!-- Reaction Preview -->
                        <div v-if="validReactions.length > 0" class="flex flex-wrap gap-1">
                            <div v-for="reaction in validReactions" :key="reaction.emoji"
                                class="flex items-center gap-1 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-600 transition-colors cursor-pointer">
                                <span class="text-sm">{{ reaction.emoji }}</span>
                                <span class="text-xs text-zinc-400">1</span>
                            </div>
                        </div>

                        <!-- Role Assignment Info -->
                        <div v-if="validReactions.length > 0"
                            class="mt-3 p-2 bg-violet-600/10 border border-violet-600/20 rounded text-xs text-violet-300">
                            <strong>Available Roles:</strong>
                            {{validReactions.map(r => `${r.emoji} @${getRoleName(r.roleId)}`).join(' • ')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Advanced Options -->
        <div class="space-y-4">
            <details class="group">
                <summary
                    class="flex items-center gap-2 cursor-pointer text-sm font-medium text-white hover:text-violet-400 transition-colors">
                    <ChevronRight class="h-4 w-4 group-open:rotate-90 transition-transform" />
                    Advanced Options
                </summary>
                <div class="mt-4 space-y-4 pl-6">
                    <!-- Embed Options -->
                    <div class="space-y-3">
                        <h5 class="font-medium text-white">Embed Styling</h5>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">Embed Color</label>
                                <input v-model="messageData.embedColor" type="color"
                                    class="w-full h-8 rounded border border-zinc-600 bg-transparent" />
                            </div>
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">Embed Title</label>
                                <input v-model="messageData.embedTitle" placeholder="Role Selection"
                                    class="translate-input text-sm" />
                            </div>
                        </div>
                    </div>

                    <!-- Restrictions -->
                    <div class="space-y-3">
                        <h5 class="font-medium text-white">Role Restrictions</h5>
                        <div class="setting-item">
                            <div class="setting-label">
                                <Users class="h-4 w-4 text-violet-400" />
                                <div>
                                    <div class="text-sm font-medium text-white">Unique Roles Only</div>
                                    <div class="text-xs text-zinc-400">Users can only select one role from this message
                                    </div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: messageData.uniqueRoles }"
                                @click="messageData.uniqueRoles = !messageData.uniqueRoles">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-label">
                                <Shield class="h-4 w-4 text-violet-400" />
                                <div>
                                    <div class="text-sm font-medium text-white">Require Verification</div>
                                    <div class="text-xs text-zinc-400">Only verified Discord accounts can react</div>
                                </div>
                            </div>
                            <div class="toggle-switch" :class="{ active: messageData.requireVerification }"
                                @click="messageData.requireVerification = !messageData.requireVerification">
                                <div class="toggle-thumb"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button @click="$emit('cancel')" class="translate-btn-secondary">
                Cancel
            </button>
            <button @click="saveMessage" :disabled="!canSave" :class="[
                'translate-btn-primary',
                !canSave && 'opacity-50 cursor-not-allowed'
            ]">
                <Save class="h-4 w-4" />
                Create Message
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Plus, X, Save, Smile, ChevronRight, Users, Shield } from 'lucide-vue-next'

// Props
const props = defineProps({
    availableChannels: {
        type: Array,
        default: () => []
    },
    availableRoles: {
        type: Array,
        default: () => []
    }
})

// Emits
const emit = defineEmits(['save', 'cancel'])

// Message data
const messageData = ref({
    title: '',
    channelId: '',
    content: '',
    reactions: [],
    embedColor: '#7C3AED',
    embedTitle: '',
    uniqueRoles: false,
    requireVerification: false
})

// Computed properties
const validReactions = computed(() => {
    return messageData.value.reactions.filter(r =>
        r.emoji && r.roleId && !r.error
    )
})

const canSave = computed(() => {
    return messageData.value.title.trim() &&
        messageData.value.channelId &&
        messageData.value.content.trim() &&
        validReactions.value.length > 0
})

// Helper functions
const getRoleName = (roleId) => {
    const role = props.availableRoles.find(r => r.id === roleId)
    return role?.name || 'Unknown Role'
}

const getRoleColor = (roleId) => {
    const role = props.availableRoles.find(r => r.id === roleId)
    return role?.color || '#99AAB5'
}

const formatCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

// Emoji validation
const validateEmoji = (reaction, index) => {
    const emoji = reaction.emoji.trim()

    // Clear previous error
    reaction.error = ''

    if (!emoji) {
        return
    }

    // Check if it's a valid Unicode emoji
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u

    // Check if it's a custom Discord emoji format <:name:id> or <a:name:id>
    const customEmojiRegex = /^<a?:\w+:\d+>$/

    // Check if it's a simple emoji name format :name:
    const simpleEmojiRegex = /^:\w+:$/

    if (!emojiRegex.test(emoji) && !customEmojiRegex.test(emoji) && !simpleEmojiRegex.test(emoji)) {
        reaction.error = 'Invalid emoji format'
        return
    }

    // Check for duplicates
    const duplicateIndex = messageData.value.reactions.findIndex((r, i) =>
        i !== index && r.emoji === emoji
    )

    if (duplicateIndex !== -1) {
        reaction.error = 'Emoji already used'
        return
    }
}

// Reaction management
const addReaction = () => {
    messageData.value.reactions.push({
        emoji: '',
        roleId: '',
        error: ''
    })
}

const removeReaction = (index) => {
    messageData.value.reactions.splice(index, 1)
}

// Save message
const saveMessage = () => {
    if (!canSave.value) return

    const messageToSave = {
        ...messageData.value,
        reactions: validReactions.value.map(r => ({
            emoji: r.emoji,
            roleId: r.roleId
        })),
        createdAt: new Date().toISOString()
    }

    emit('save', messageToSave)
}
</script>

<style scoped>
/* Custom emoji input styling */
input[maxlength="4"] {
    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
}

/* Discord-like message preview */
.discord-message {
    font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* Color input styling */
input[type="color"] {
    -webkit-appearance: none;
    border: none;
    cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 4px;
    border: 1px solid rgb(63, 63, 70);
}

input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
}
</style>