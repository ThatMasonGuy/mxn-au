<!-- components/topheroes/QueueCard.vue -->
<template>
    <div class="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group relative overflow-hidden"
        :class="{ 'opacity-60': !queue.isVisible }">

        <!-- Visibility indicator -->
        <div class="absolute top-3 right-3 z-10">
            <div class="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                :class="queue.isVisible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'">
                <component :is="queue.isVisible ? Eye : EyeOff" class="h-3 w-3" />
                <span>{{ queue.isVisible ? 'Visible' : 'Hidden' }}</span>
            </div>
        </div>

        <!-- Header -->
        <div class="mb-4 pr-24">
            <h3 class="text-lg font-semibold mb-1 group-hover:text-velaris-purple transition-colors">
                {{ queue.name }}
            </h3>
            <p v-if="queue.description" class="text-sm text-foreground/70 line-clamp-2">
                {{ queue.description }}
            </p>
        </div>

        <!-- Team Formation - Compact Grid -->
        <div class="mb-4 p-4 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-lg border border-border/30">
            <div class="grid grid-cols-3 gap-3">
                <!-- Back Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div class="text-xs font-medium text-red-400 text-center">Back</div>
                        <TooltipProvider v-for="position in ['back1', 'back2']" :key="position">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <div class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 cursor-default transition-all duration-200 hover:brightness-75 border"
                                        :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                                        <!-- Desktop: Show truncated name -->
                                        <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                            {{ getHeroName(getHeroInPosition(position).id) }}
                                        </span>
                                        <!-- Mobile: Show initial -->
                                        <span v-if="getHeroInPosition(position)"
                                            class="block sm:hidden text-sm font-bold">
                                            {{ getHeroInitial(getHeroInPosition(position).id) }}
                                        </span>
                                        <span v-if="!getHeroInPosition(position)"
                                            class="text-foreground/30 text-xs">Empty</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent v-if="getHeroInPosition(position)">
                                    <p>{{ getHeroName(getHeroInPosition(position).id) }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <!-- Mid Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div class="text-xs font-medium text-amber-400 text-center">Mid</div>
                        <TooltipProvider v-for="position in ['mid1', 'mid2']" :key="position">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <div class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 cursor-default transition-all duration-200 hover:brightness-75 border"
                                        :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                                        <!-- Desktop: Show truncated name -->
                                        <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                            {{ getHeroName(getHeroInPosition(position).id) }}
                                        </span>
                                        <!-- Mobile: Show initial -->
                                        <span v-if="getHeroInPosition(position)"
                                            class="block sm:hidden text-sm font-bold">
                                            {{ getHeroInitial(getHeroInPosition(position).id) }}
                                        </span>
                                        <span v-if="!getHeroInPosition(position)"
                                            class="text-foreground/30 text-xs">Empty</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent v-if="getHeroInPosition(position)">
                                    <p>{{ getHeroName(getHeroInPosition(position).id) }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <!-- Front Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div class="text-xs font-medium text-green-400 text-center">Front</div>
                        <TooltipProvider v-for="position in ['front1', 'front2']" :key="position">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <div class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 cursor-default transition-all duration-200 hover:brightness-75 border"
                                        :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                                        <!-- Desktop: Show truncated name -->
                                        <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                            {{ getHeroName(getHeroInPosition(position).id) }}
                                        </span>
                                        <!-- Mobile: Show initial -->
                                        <span v-if="getHeroInPosition(position)"
                                            class="block sm:hidden text-sm font-bold">
                                            {{ getHeroInitial(getHeroInPosition(position).id) }}
                                        </span>
                                        <span v-if="!getHeroInPosition(position)"
                                            class="text-foreground/30 text-xs">Empty</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent v-if="getHeroInPosition(position)">
                                    <p>{{ getHeroName(getHeroInPosition(position).id) }}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>

        <!-- Meta Info and Actions -->
        <div class="flex items-center justify-between text-xs">
            <!-- Left side: Creator, Server, Date -->
            <div class="flex items-center gap-3 text-foreground/60">
                <div v-if="queue.createdBy" class="flex items-center gap-1">
                    <User class="h-3 w-3" />
                    <span>{{ queue.createdBy }}</span>
                </div>
                <div v-if="queue.fromServer" class="flex items-center gap-1">
                    <Server class="h-3 w-3" />
                    <span>S{{ queue.fromServer }}</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <div class="flex items-center gap-1 cursor-default">
                                <Clock class="h-3 w-3" />
                                <span>{{ formatDate(queue.lastUpdated || queue.createdAt) }}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{{ formatFullDate(queue.lastUpdated || queue.createdAt) }}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <!-- Right side: Action buttons -->
            <div class="flex gap-2">
                <button @click="$emit('edit')"
                    class="bg-velaris-purple/10 text-velaris-purple hover:bg-velaris-purple/20 border border-velaris-purple/30 transition-all duration-200 font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5">
                    <Edit class="h-3.5 w-3.5" />
                    <span class="hidden sm:inline">Edit</span>
                </button>
                <button @click="handleDelete"
                    class="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all duration-200 font-medium py-1.5 px-3 rounded-lg flex items-center justify-center">
                    <Trash2 class="h-3.5 w-3.5" />
                </button>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <ConfirmationModal v-model:isOpen="showDeleteConfirmation" :title="`Delete ${queue.name}?`"
            :message="`Are you sure you want to delete this queue? This action cannot be undone.`"
            :details="`This will permanently remove the queue '${queue.name}' and all its team configuration.`"
            variant="danger" confirm-text="Delete Queue" cancel-text="Cancel" :confirm-icon="Trash2"
            :loading="isDeleting" @confirm="confirmDelete" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Edit, Trash2, Eye, EyeOff, User, Server, Clock } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ConfirmationModal from '@/components/velaris/new-admin/ConfirmationModal.vue'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    heroes: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['edit', 'delete'])

// State for delete confirmation
const showDeleteConfirmation = ref(false)
const isDeleting = ref(false)

// Computed properties
const queueHeroes = computed(() => {
    return props.queue.heroes || []
})

// Helper functions
const getHero = (heroId) => {
    return props.heroes.find(hero => hero.id === heroId)
}

const getHeroInPosition = (position) => {
    const heroEntry = queueHeroes.value.find(h => h.position === position)
    return heroEntry ? getHero(heroEntry.heroId) : null
}

const getHeroName = (heroId) => {
    const hero = getHero(heroId)
    return hero?.name || 'Unknown Hero'
}

const getHeroInitial = (heroId) => {
    const hero = getHero(heroId)
    return hero?.name?.charAt(0) || '?'
}

const getHeroFactionClass = (heroId) => {
    const hero = getHero(heroId)
    if (!hero) return 'bg-gray-500'

    const classes = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return classes[hero.faction] || 'bg-gray-500'
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'

    let date

    // Handle Firestore timestamp object
    if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    }
    // Handle string format like "October 1, 2025 at 3:53:17 PM UTC+10"
    else if (typeof timestamp === 'string') {
        // Replace "at" with nothing and handle the UTC offset
        let cleanedTimestamp = timestamp
            .replace(' at ', ' ')  // Remove the "at"
            .replace(/\s+UTC[+-]\d+/, '')  // Remove UTC offset as JS handles it poorly

        date = new Date(cleanedTimestamp)

        // If still invalid, try one more parsing approach
        if (isNaN(date.getTime())) {
            // Try to parse manually - split by common delimiters
            date = new Date(timestamp.split(' at ')[0] + ' ' + timestamp.split(' at ')[1]?.split(' UTC')[0])
        }
    }
    // Handle regular Date object or timestamp number
    else {
        date = new Date(timestamp)
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Failed to parse date:', timestamp)
        return 'Unknown'
    }

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}mo ago`

    return date.toLocaleDateString()
}

const formatFullDate = (timestamp) => {
    if (!timestamp) return 'Unknown'

    let date

    // Handle Firestore timestamp object
    if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    }
    // Handle string format like "October 1, 2025 at 3:53:17 PM UTC+10"
    else if (typeof timestamp === 'string') {
        // Replace "at" with nothing and handle the UTC offset
        let cleanedTimestamp = timestamp
            .replace(' at ', ' ')
            .replace(/\s+UTC[+-]\d+/, '')

        date = new Date(cleanedTimestamp)

        // If still invalid, try one more parsing approach
        if (isNaN(date.getTime())) {
            date = new Date(timestamp.split(' at ')[0] + ' ' + timestamp.split(' at ')[1]?.split(' UTC')[0])
        }
    }
    // Handle regular Date object or timestamp number
    else {
        date = new Date(timestamp)
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Failed to parse date:', timestamp)
        return 'Unknown date'
    }

    return date.toLocaleString()
}

// Delete confirmation handlers
const handleDelete = () => {
    showDeleteConfirmation.value = true
}

const confirmDelete = async () => {
    isDeleting.value = true
    try {
        emit('delete')
        showDeleteConfirmation.value = false
    } catch (error) {
        console.error('Error deleting queue:', error)
    } finally {
        isDeleting.value = false
    }
}
</script>

<style scoped>
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>