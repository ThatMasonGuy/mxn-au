<!-- components/topheroes/public/PublicQueueCard.vue -->
<template>
    <div class="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
        @click="$emit('view', queue)">

        <!-- Queue Name & Description -->
        <div class="mb-4">
            <h3 class="text-lg font-semibold mb-1 group-hover:text-velaris-purple transition-colors line-clamp-1">
                {{ queue.name }}
            </h3>
            <p v-if="queue.description" class="text-sm text-foreground/70 line-clamp-2">
                {{ queue.description }}
            </p>
        </div>

        <!-- Team Formation -->
        <div class="mb-4 p-4 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-lg border border-border/30">
            <div class="grid grid-cols-3 gap-3">
                <!-- Back Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div class="text-xs font-medium text-red-400 text-center">Back</div>
                        <div v-for="position in ['back1', 'back2']" :key="position"
                            class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 border transition-all duration-200 hover:brightness-75"
                            :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                            <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                {{ getHeroName(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="getHeroInPosition(position)" class="block sm:hidden text-sm font-bold">
                                {{ getHeroInitial(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="!getHeroInPosition(position)" class="text-foreground/30 text-xs">Empty</span>
                        </div>
                    </div>
                </div>

                <!-- Mid Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div class="text-xs font-medium text-amber-400 text-center">Mid</div>
                        <div v-for="position in ['mid1', 'mid2']" :key="position"
                            class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 border transition-all duration-200 hover:brightness-75"
                            :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                            <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                {{ getHeroName(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="getHeroInPosition(position)" class="block sm:hidden text-sm font-bold">
                                {{ getHeroInitial(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="!getHeroInPosition(position)" class="text-foreground/30 text-xs">Empty</span>
                        </div>
                    </div>
                </div>

                <!-- Front Row -->
                <div class="space-y-1.5">
                    <div class="space-y-1.5 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div class="text-xs font-medium text-green-400 text-center">Front</div>
                        <div v-for="position in ['front1', 'front2']" :key="position"
                            class="w-full h-10 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-md px-1 border transition-all duration-200 hover:brightness-75"
                            :class="getHeroInPosition(position) ? [getHeroFactionClass(getHeroInPosition(position).id), 'border-white/20'] : 'bg-foreground/20 border-2 border-dashed border-foreground/30'">
                            <span v-if="getHeroInPosition(position)" class="hidden sm:block truncate">
                                {{ getHeroName(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="getHeroInPosition(position)" class="block sm:hidden text-sm font-bold">
                                {{ getHeroInitial(getHeroInPosition(position).id) }}
                            </span>
                            <span v-if="!getHeroInPosition(position)" class="text-foreground/30 text-xs">Empty</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats & Actions Row -->
        <div class="flex items-center justify-between text-xs">
            <!-- Left: Voting -->
            <div class="flex items-center gap-2" @click.stop>
                <button @click="handleVote('up')" :class="[
                    'flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200',
                    userVote === 'up'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-foreground/5 text-foreground/60 hover:bg-green-500/10 hover:text-green-400 border border-border'
                ]">
                    <ThumbsUp class="h-3.5 w-3.5" />
                    <span class="font-medium">{{ upvoteCount }}</span>
                </button>

                <button @click="handleVote('down')" :class="[
                    'flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200',
                    userVote === 'down'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-foreground/5 text-foreground/60 hover:bg-red-500/10 hover:text-red-400 border border-border'
                ]">
                    <ThumbsDown class="h-3.5 w-3.5" />
                    <span class="font-medium">{{ downvoteCount }}</span>
                </button>
            </div>

            <!-- Right: Stats -->
            <div class="flex items-center gap-3 text-foreground/60">
                <div class="flex items-center gap-1" title="Comments">
                    <MessageSquare class="h-3.5 w-3.5" />
                    <span>{{ queue.commentCount || 0 }}</span>
                </div>
                <div class="flex items-center gap-1" title="Views">
                    <Eye class="h-3.5 w-3.5" />
                    <span>{{ queue.views || 0 }}</span>
                </div>
            </div>
        </div>

        <!-- Creator Info -->
        <div class="flex items-center justify-between text-xs text-foreground/60 mt-3 pt-3 border-t border-border/50">
            <div class="flex items-center gap-3">
                <div v-if="queue.createdBy" class="flex items-center gap-1">
                    <User class="h-3 w-3" />
                    <span>{{ queue.createdBy }}</span>
                </div>
                <div v-if="queue.fromServer" class="flex items-center gap-1">
                    <Server class="h-3 w-3" />
                    <span>S{{ queue.fromServer }}</span>
                </div>
            </div>
            <span>{{ formatDate(queue.lastUpdated || queue.createdAt) }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { ThumbsUp, ThumbsDown, MessageSquare, Eye, User, Server } from 'lucide-vue-next'

const props = defineProps({
    queue: {
        type: Object,
        required: true
    },
    heroes: {
        type: Array,
        default: () => []
    },
    userVotes: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['vote', 'view'])

// Computed
const queueHeroes = computed(() => props.queue.heroes || [])

const userVote = computed(() => props.userVotes[props.queue.id])

const upvoteCount = computed(() => props.queue.upvotes || 0)
const downvoteCount = computed(() => props.queue.downvotes || 0)

// Methods
const getHero = (heroId) => {
    return props.heroes.find(hero => hero.id === heroId)
}

const getHeroInPosition = (position) => {
    const heroEntry = queueHeroes.value.find(h => h.position === position)
    return heroEntry ? getHero(heroEntry.heroId) : null
}

const getHeroName = (heroId) => {
    const hero = getHero(heroId)
    return hero?.name || 'Unknown'
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

const handleVote = (voteType) => {
    emit('vote', { queueId: props.queue.id, voteType })
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'

    let date
    if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string') {
        let cleanedTimestamp = timestamp
            .replace(' at ', ' ')
            .replace(/\s+UTC[+-]\d+/, '')
        date = new Date(cleanedTimestamp)
    } else {
        date = new Date(timestamp)
    }

    if (isNaN(date.getTime())) return 'Unknown'

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 1) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`
    return date.toLocaleDateString()
}
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>