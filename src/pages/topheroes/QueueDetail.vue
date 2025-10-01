<!-- pages/QueueDetail.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Theme Switcher -->
        <ThemeSwitcher />
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div
                    class="animate-spin h-12 w-12 border-4 border-velaris-purple border-t-transparent rounded-full mx-auto mb-4">
                </div>
                <p class="text-foreground/60">Loading queue...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen">
            <div class="text-center max-w-md mx-auto px-4">
                <div class="h-24 w-24 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <XCircle class="h-12 w-12 text-red-400" />
                </div>
                <h2 class="text-2xl font-bold mb-2">Queue Not Found</h2>
                <p class="text-foreground/60 mb-6">{{ error }}</p>
                <button @click="router.push('/topheroes/queues')"
                    class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center">
                    <ArrowLeft class="h-4 w-4 mr-2" />
                    Back to Browse
                </button>
            </div>
        </div>

        <!-- Queue Detail -->
        <div v-else-if="queue" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16">
            <!-- Back Button -->
            <button @click="router.push('/topheroes/queues')"
                class="mb-6 flex items-center gap-2 text-foreground/60 hover:text-velaris-purple transition-colors">
                <ArrowLeft class="h-4 w-4" />
                Back to Browse
            </button>

            <!-- Header Section -->
            <div class="bg-card border border-border rounded-xl p-8 mb-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold mb-2">{{ queue.name }}</h1>
                        <p v-if="queue.description" class="text-lg text-foreground/70">{{ queue.description }}</p>
                    </div>

                    <!-- Vote Buttons with Rating Bar -->
                    <div class="flex flex-col items-center gap-2">
                        <div class="flex items-center gap-3">
                            <button @click="handleVote('up')" :class="[
                                'flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px]',
                                userVote === 'up'
                                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 shadow-lg'
                                    : 'bg-foreground/5 text-foreground/60 hover:bg-green-500/10 hover:text-green-400 border-2 border-border'
                            ]">
                                <ThumbsUp class="h-6 w-6" />
                                <span class="text-2xl font-bold">{{ queue.upvotes || 0 }}</span>
                            </button>

                            <button @click="handleVote('down')" :class="[
                                'flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px]',
                                userVote === 'down'
                                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50 shadow-lg'
                                    : 'bg-foreground/5 text-foreground/60 hover:bg-red-500/10 hover:text-red-400 border-2 border-border'
                            ]">
                                <ThumbsDown class="h-6 w-6" />
                                <span class="text-2xl font-bold">{{ queue.downvotes || 0 }}</span>
                            </button>
                        </div>

                        <!-- Rating Bar -->
                        <div class="w-full" style="width: 172px;">
                            <div class="h-2 bg-foreground/10 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                                    :style="{ width: `${queueRating}%` }">
                                </div>
                            </div>
                            <p class="text-xs text-center mt-1 text-foreground/60">{{ queueRating }}% positive</p>
                        </div>
                    </div>
                </div>

                <!-- Meta Info -->
                <div class="flex items-center gap-4 text-sm text-foreground/60 pt-4 border-t border-border/50">
                    <div v-if="queue.createdBy" class="flex items-center gap-2">
                        <User class="h-4 w-4" />
                        <span>Created by <strong class="text-foreground">{{ queue.createdBy }}</strong></span>
                    </div>
                    <div v-if="queue.fromServer" class="flex items-center gap-2">
                        <Server class="h-4 w-4" />
                        <span>Server <strong class="text-foreground">{{ queue.fromServer }}</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Eye class="h-4 w-4" />
                        <span>{{ queue.views || 0 }} views</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Clock class="h-4 w-4" />
                        <span>Updated {{ formatDate(queue.lastUpdated || queue.createdAt) }}</span>
                    </div>
                </div>
            </div>

            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Main Content (Left Side) -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Team Formation -->
                    <div class="bg-card border border-border rounded-xl p-6">
                        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Users class="h-5 w-5 text-velaris-purple" />
                            Team Formation
                        </h2>

                        <TeamFormationDisplay :queue="queue" :heroes="publicStore.heroes" :tags="publicStore.tags"
                            :bonds="publicStore.bonds" />
                    </div>

                    <!--
                    <div class="bg-card border border-border rounded-xl p-6">
                        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Zap class="h-5 w-5 text-velaris-amber" />
                            Gear Configuration
                        </h2>

                        <GearSetupDisplay :queue="queue" :heroes="publicStore.heroes" />
                    </div>
                    Gear Setup -->
                    
                    <!-- Comments Section -->
                    <CommentSection :queue-id="queueId" />
                </div>

                <!-- Sidebar (Right Side) -->
                <div class="space-y-6">
                    <!-- Team Synergies -->
                    <div
                        class="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Zap class="h-5 w-5 text-emerald-400" />
                            Team Synergies
                        </h3>
                        <TeamSynergiesDisplay :queue="queue" :heroes="publicStore.heroes" :bonds="publicStore.bonds" />
                    </div>

                    <!-- Share Section -->
                    <div class="bg-card border border-border rounded-xl p-6">
                        <h3 class="text-lg font-semibold mb-4">Share Queue</h3>
                        <button @click="copyLink" :disabled="shareOnCooldown"
                            class="w-full bg-velaris-purple/10 text-velaris-purple hover:bg-velaris-purple/20 border border-velaris-purple/30 transition-all duration-200 font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Share2 class="h-4 w-4" />
                            {{ linkCopied ? 'Copied!' : 'Copy Link' }}
                        </button>
                        <div class="mt-3 text-center">
                            <p class="text-xs text-foreground/60">
                                Shared {{ queue.shares || 0 }} time{{ (queue.shares || 0) !== 1 ? 's' : '' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    ArrowLeft, ThumbsUp, ThumbsDown, User, Server, Eye, Clock,
    Users, Zap, Share2, XCircle
} from 'lucide-vue-next'
import { useTopHeroesPublicStore } from '@/stores/useTopHeroesPublicStore'
import TeamFormationDisplay from '@/components/topheroes/public/TeamFormationDisplay.vue'
import GearSetupDisplay from '@/components/topheroes/public/GearSetupDisplay.vue'
import TeamSynergiesDisplay from '@/components/topheroes/public/TeamSynergiesDisplay.vue'
import CommentSection from '@/components/topheroes/public/CommentSection.vue'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'

const route = useRoute()
const router = useRouter()
const publicStore = useTopHeroesPublicStore()

// State
const queueId = computed(() => route.params.id)
const queue = ref(null)
const isLoading = ref(true)
const error = ref(null)
const userVote = ref(null)
const linkCopied = ref(false)
const shareOnCooldown = ref(false)
const lastShareTime = ref(0)

// Computed
const queueRating = computed(() => {
    if (!queue.value) return 0
    const upvotes = queue.value.upvotes || 0
    const downvotes = queue.value.downvotes || 0
    const total = upvotes + downvotes
    if (total === 0) return 0
    return Math.round((upvotes / total) * 100)
})

// Methods
const loadQueue = async () => {
    isLoading.value = true
    error.value = null

    try {
        // Ensure heroes, bonds, and tags are loaded
        if (!publicStore.heroes?.length || !publicStore.bonds?.length || !publicStore.tags?.length) {
            await publicStore.loadAll()
        }

        // Load queue detail
        queue.value = await publicStore.getQueueDetail(queueId.value)

        // Increment view count
        await publicStore.incrementViews(queueId.value)

        // Load user vote from localStorage
        const savedVotes = localStorage.getItem('topheroes_votes')
        if (savedVotes) {
            const votes = JSON.parse(savedVotes)
            userVote.value = votes[queueId.value]
        }

        // Load last share time from localStorage
        const savedShareTimes = localStorage.getItem('topheroes_share_times')
        if (savedShareTimes) {
            const shareTimes = JSON.parse(savedShareTimes)
            lastShareTime.value = shareTimes[queueId.value] || 0
        }

    } catch (err) {
        console.error('Failed to load queue:', err)
        error.value = err.message || 'Failed to load queue'
    } finally {
        isLoading.value = false
    }
}

const handleVote = (voteType) => {
    const previousVote = userVote.value

    // Toggle vote if clicking same type
    if (previousVote === voteType) {
        userVote.value = null
    } else {
        userVote.value = voteType
    }

    // Save to localStorage
    const savedVotes = JSON.parse(localStorage.getItem('topheroes_votes') || '{}')
    if (userVote.value) {
        savedVotes[queueId.value] = userVote.value
    } else {
        delete savedVotes[queueId.value]
    }
    localStorage.setItem('topheroes_votes', JSON.stringify(savedVotes))

    // Send to backend
    publicStore.voteQueue(queueId.value, voteType, previousVote)
}

const copyLink = async () => {
    // Check cooldown (1 minute = 60000ms)
    const now = Date.now()
    if (now - lastShareTime.value < 60000) {
        shareOnCooldown.value = true
        // Just copy without incrementing
        const url = window.location.href
        await navigator.clipboard.writeText(url)
        linkCopied.value = true
        setTimeout(() => {
            linkCopied.value = false
        }, 2000)
        return
    }

    // Copy to clipboard
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    linkCopied.value = true

    // Update last share time
    lastShareTime.value = now
    const savedShareTimes = JSON.parse(localStorage.getItem('topheroes_share_times') || '{}')
    savedShareTimes[queueId.value] = now
    localStorage.setItem('topheroes_share_times', JSON.stringify(savedShareTimes))

    // Increment share counter in backend
    await publicStore.incrementShares(queueId.value)

    // Set cooldown
    shareOnCooldown.value = true

    setTimeout(() => {
        linkCopied.value = false
    }, 2000)

    // Remove cooldown after 1 minute
    setTimeout(() => {
        shareOnCooldown.value = false
    }, 60000)
}

const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'

    let date
    if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    } else if (typeof timestamp === 'string') {
        let cleanedTimestamp = timestamp.replace(' at ', ' ').replace(/\s+UTC[+-]\d+/, '')
        date = new Date(cleanedTimestamp)
    } else {
        date = new Date(timestamp)
    }

    if (isNaN(date.getTime())) return 'Unknown'

    return date.toLocaleDateString()
}

// Lifecycle
onMounted(() => {
    loadQueue()
})
</script>