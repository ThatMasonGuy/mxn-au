<template>
    <div :class="[compact ? '' : 'space-y-3']">
        <label v-if="!compact && label" class="block text-sm font-semibold text-white">
            {{ label }}
        </label>
        <p v-if="!compact && description" class="text-sm text-zinc-400 mb-2">
            {{ description }}
        </p>

        <!-- Multiple Select -->
        <div v-if="multiple" class="space-y-2">
            <div v-for="channel in availableChannels" :key="channel.id"
                class="flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-900/70 rounded-lg transition-colors cursor-pointer"
                @click="toggleChannel(channel.id)">
                <div class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    :class="[
                        isSelected(channel.id)
                            ? 'bg-violet-600 border-violet-600'
                            : 'border-zinc-600'
                    ]">
                    <Check v-if="isSelected(channel.id)" class="h-3 w-3 text-white" />
                </div>
                <Hash class="h-4 w-4 text-zinc-500 flex-shrink-0" />
                <span class="text-zinc-300">{{ channel.name }}</span>
            </div>
        </div>

        <!-- Single Select -->
        <select v-else :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
            class="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all">
            <option value="">Select a channel...</option>
            <option v-for="channel in availableChannels" :key="channel.id" :value="channel.id">
                # {{ channel.name }}
            </option>
        </select>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center gap-2 text-zinc-500 text-sm">
            <Loader2 class="h-4 w-4 animate-spin" />
            <span>Loading channels...</span>
        </div>

        <!-- Error State -->
        <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p class="text-red-400 text-sm">{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTranslateStore } from '@/stores/useTranslateBotStore'
import { Hash, Check, Loader2 } from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: [Array, String, null],
        default: null
    },
    serverId: {
        type: String,
        required: true
    },
    multiple: {
        type: Boolean,
        default: true
    },
    label: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    compact: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const store = useTranslateStore()
const loading = ref(true)
const error = ref(null)
const availableChannels = ref([])

const selectedChannels = computed(() => {
    if (props.multiple) {
        return Array.isArray(props.modelValue) ? props.modelValue : []
    }
    return props.modelValue ? [props.modelValue] : []
})

function isSelected(channelId) {
    return selectedChannels.value.includes(channelId)
}

function toggleChannel(channelId) {
    if (!props.multiple) return

    const current = [...selectedChannels.value]
    const index = current.indexOf(channelId)

    if (index > -1) {
        current.splice(index, 1)
    } else {
        current.push(channelId)
    }

    emit('update:modelValue', current)
}

async function fetchChannels() {
    loading.value = true
    error.value = null

    try {
        // Use the getServerChannels function
        const response = await fetch(
            `${import.meta.env.VITE_FUNCTIONS_URL}/getServerChannels?serverId=${props.serverId}`,
            {
                headers: {
                    'Authorization': `Bearer ${store.discordToken}`
                }
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch channels')
        }

        const data = await response.json()

        // Filter to only show text channels (type 0) and sort by position
        availableChannels.value = data.channels
            .filter(c => c.type === 0)
            .sort((a, b) => a.position - b.position)
    } catch (err) {
        console.error('Error fetching channels:', err)
        error.value = err.message || 'Failed to load channels'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchChannels()
})
</script>