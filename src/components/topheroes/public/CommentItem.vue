<!-- components/topheroes/public/CommentItem.vue -->
<template>
    <div class="p-4 bg-foreground/5 rounded-lg border border-border hover:border-velaris-purple/30 transition-all">
        <!-- Comment Header -->
        <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
                <div
                    class="h-8 w-8 rounded-full bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-sm font-bold">
                    {{ getInitial(comment.username) }}
                </div>
                <div>
                    <p class="font-medium text-sm">{{ comment.username || 'Anonymous' }}</p>
                    <p class="text-xs text-foreground/60">{{ formatCommentDate(comment.createdAt) }}</p>
                </div>
            </div>

            <!-- Comment Actions -->
            <div class="flex items-center gap-2" @click.stop>
                <button @click="voteComment('up')" :class="[
                    'flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200',
                    getCommentVote() === 'up'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-foreground/5 text-foreground/60 hover:bg-green-500/10 hover:text-green-400 border border-border'
                ]">
                    <ThumbsUp class="h-3 w-3" />
                    <span class="text-xs font-medium">{{ comment.upvotes || 0 }}</span>
                </button>

                <button @click="voteComment('down')" :class="[
                    'flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200',
                    getCommentVote() === 'down'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-foreground/5 text-foreground/60 hover:bg-red-500/10 hover:text-red-400 border border-border'
                ]">
                    <ThumbsDown class="h-3 w-3" />
                    <span class="text-xs font-medium">{{ comment.downvotes || 0 }}</span>
                </button>

                <button @click="$emit('report', comment.id)"
                    class="px-2 py-1 rounded-lg transition-all duration-200 bg-foreground/5 text-foreground/60 hover:bg-red-500/10 hover:text-red-400 border border-border">
                    <Flag class="h-3 w-3" />
                </button>
            </div>
        </div>

        <!-- Comment Text -->
        <p class="text-sm text-foreground/80 whitespace-pre-wrap mb-3">{{ comment.text }}</p>

        <!-- Reply Button -->
        <button @click="showReplyForm = !showReplyForm"
            class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors flex items-center gap-1 mb-3">
            <MessageSquare class="h-3 w-3" />
            Reply {{ comment.replyCount ? `(${comment.replyCount})` : '' }}
        </button>

        <!-- Reply Form -->
        <div v-if="showReplyForm" class="mt-3 p-3 bg-background/50 rounded-lg border border-border">
            <div class="space-y-2">
                <input v-model="replyUsername" type="text" placeholder="Your name (optional)"
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-xs" />

                <textarea v-model="replyText" placeholder="Write a reply..."
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-xs h-20 resize-none"></textarea>

                <div class="flex items-center justify-between">
                    <p class="text-xs text-foreground/60">{{ replyText.length }}/300 characters</p>
                    <div class="flex gap-2">
                        <button @click="showReplyForm = false"
                            class="px-3 py-1 text-xs text-foreground/60 hover:text-foreground transition-colors">
                            Cancel
                        </button>
                        <button @click="submitReply" :disabled="!canSubmitReply || isSubmittingReply"
                            class="bg-velaris-purple text-white px-3 py-1 rounded text-xs font-medium hover:bg-velaris-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="isSubmittingReply">Posting...</span>
                            <span v-else>Post Reply</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Replies List -->
        <div v-if="comment.replies && comment.replies.length > 0"
            class="mt-4 pl-6 space-y-3 border-l-2 border-velaris-purple/30">
            <div v-for="reply in sortedReplies" :key="reply.id"
                class="p-3 bg-background/50 rounded-lg border border-border/50">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <div
                            class="h-6 w-6 rounded-full bg-gradient-to-br from-velaris-teal to-velaris-purple flex items-center justify-center text-white text-xs font-bold">
                            {{ getInitial(reply.username) }}
                        </div>
                        <div>
                            <p class="font-medium text-xs">{{ reply.username || 'Anonymous' }}</p>
                            <p class="text-xs text-foreground/50">{{ formatCommentDate(reply.createdAt) }}</p>
                        </div>
                    </div>

                    <button @click="$emit('report', reply.id)"
                        class="px-1.5 py-1 rounded transition-all duration-200 bg-foreground/5 text-foreground/40 hover:bg-red-500/10 hover:text-red-400">
                        <Flag class="h-2.5 w-2.5" />
                    </button>
                </div>
                <p class="text-xs text-foreground/70 whitespace-pre-wrap">{{ reply.text }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ThumbsUp, ThumbsDown, MessageSquare, Flag } from 'lucide-vue-next'
import { useTopHeroesPublicStore } from '@/stores/useTopHeroesPublicStore'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    },
    queueId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['reply', 'report'])

const publicStore = useTopHeroesPublicStore()

// State
const showReplyForm = ref(false)
const replyUsername = ref('')
const replyText = ref('')
const isSubmittingReply = ref(false)
const commentVotes = ref({})

// Computed
const canSubmitReply = computed(() => {
    return replyText.value.trim().length > 0 && replyText.value.length <= 300
})

const sortedReplies = computed(() => {
    if (!props.comment.replies) return []
    return [...props.comment.replies].sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0
        return dateA - dateB // Oldest first for replies
    })
})

// Methods
const getCommentVote = () => {
    if (Object.keys(commentVotes.value).length === 0) {
        const savedVotes = localStorage.getItem('topheroes_comment_votes')
        if (savedVotes) {
            commentVotes.value = JSON.parse(savedVotes)
        }
    }
    return commentVotes.value[props.comment.id]
}

const voteComment = (voteType) => {
    const previousVote = commentVotes.value[props.comment.id]

    if (previousVote === voteType) {
        delete commentVotes.value[props.comment.id]
    } else {
        commentVotes.value[props.comment.id] = voteType
    }

    localStorage.setItem('topheroes_comment_votes', JSON.stringify(commentVotes.value))
    publicStore.voteComment(props.queueId, props.comment.id, voteType, previousVote)
}

const submitReply = async () => {
    if (!canSubmitReply.value || isSubmittingReply.value) return

    isSubmittingReply.value = true
    try {
        const replyData = {
            username: replyUsername.value.trim() || 'Anonymous',
            text: replyText.value.trim()
        }

        await publicStore.addReply(props.queueId, props.comment.id, replyData)

        // Reset form
        replyText.value = ''
        showReplyForm.value = false
    } catch (error) {
        console.error('Failed to submit reply:', error)
    } finally {
        isSubmittingReply.value = false
    }
}

const getInitial = (username) => {
    if (!username || username === 'Anonymous') return 'A'
    return username.charAt(0).toUpperCase()
}

const formatCommentDate = (timestamp) => {
    if (!timestamp) return 'Just now'

    let date
    if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000)
    } else {
        date = new Date(timestamp)
    }

    if (isNaN(date.getTime())) return 'Just now'

    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
}
</script>