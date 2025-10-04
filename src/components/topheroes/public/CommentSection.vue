<!-- components/topheroes/public/CommentSection.vue -->
<template>
    <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageSquare class="h-5 w-5 text-velaris-purple" />
            Comments ({{ totalCommentsCount }})
        </h2>

        <!-- Add Comment Form -->
        <div class="mb-6 p-4 bg-foreground/5 rounded-lg border border-border">
            <h3 class="text-sm font-medium mb-3">Leave a Comment</h3>
            <div class="space-y-3">
                <input v-model="newComment.username" type="text" placeholder="Your name (optional)"
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-sm" />

                <textarea v-model="newComment.text" placeholder="Share your thoughts about this queue..."
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all text-sm h-24 resize-none"></textarea>

                <div class="flex items-center justify-between">
                    <p class="text-xs text-foreground/60">{{ newComment.text.length }}/500 characters</p>
                    <button @click="submitComment" :disabled="!canSubmit || isSubmitting"
                        class="bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        <span v-if="isSubmitting">Posting...</span>
                        <span v-else>Post Comment</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading Comments -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="inline-flex items-center gap-3 text-foreground/60">
                <div class="animate-spin h-6 w-6 border-2 border-velaris-purple border-t-transparent rounded-full">
                </div>
                <span class="text-sm">Loading comments...</span>
            </div>
        </div>

        <!-- No Comments -->
        <div v-else-if="comments.length === 0" class="text-center py-12">
            <MessageSquare class="h-12 w-12 mx-auto mb-3 text-foreground/30" />
            <p class="text-sm text-foreground/60">No comments yet. Be the first to share your thoughts!</p>
        </div>

        <!-- Comments List -->
        <div v-else class="space-y-4">
            <CommentItem v-for="comment in sortedComments" :key="comment.id" :comment="comment" :queue-id="queueId"
                @reply="handleReply" @report="handleReport" />
        </div>

        <!-- Report Modal -->
        <div v-if="showReportModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="closeReportModal">
            <div class="bg-card border border-border rounded-xl p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle class="h-5 w-5 text-amber-400" />
                    Report Comment
                </h3>
                <p class="text-sm text-foreground/70 mb-4">
                    Please select a reason for reporting this comment:
                </p>
                <div class="space-y-2 mb-4">
                    <label v-for="reason in reportReasons" :key="reason"
                        class="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-foreground/5 cursor-pointer transition-colors">
                        <input type="radio" :value="reason" v-model="selectedReason" class="text-velaris-purple" />
                        <span class="text-sm">{{ reason }}</span>
                    </label>
                </div>
                <div class="flex gap-3">
                    <button @click="closeReportModal"
                        class="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-foreground/5 transition-colors text-sm">
                        Cancel
                    </button>
                    <button @click="submitReport" :disabled="!selectedReason || isReporting"
                        class="flex-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                        <span v-if="isReporting">Reporting...</span>
                        <span v-else>Submit Report</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MessageSquare, AlertTriangle } from 'lucide-vue-next'
import { useTopHeroesPublicStore } from '@/stores/useTopHeroesPublicStore'
import CommentItem from './CommentItem.vue'

const props = defineProps({
    queueId: {
        type: String,
        required: true
    }
})

const publicStore = useTopHeroesPublicStore()

// State
const newComment = ref({
    username: '',
    text: ''
})
const isLoading = ref(true)
const isSubmitting = ref(false)
const showReportModal = ref(false)
const reportData = ref(null) // Changed from commentToReport to reportData
const selectedReason = ref('')
const isReporting = ref(false)

const reportReasons = [
    'Spam or misleading',
    'Harassment or hate speech',
    'Inappropriate content',
    'Off-topic',
    'Other'
]

// Computed
const comments = computed(() => publicStore.comments[props.queueId] || [])

const totalCommentsCount = computed(() => {
    let count = comments.value.length
    comments.value.forEach(comment => {
        count += comment.replyCount || 0
    })
    return count
})

const sortedComments = computed(() => {
    return [...comments.value].sort((a, b) => {
        const netA = (a.upvotes || 0) - (a.downvotes || 0)
        const netB = (b.upvotes || 0) - (b.downvotes || 0)

        if (netB !== netA) return netB - netA

        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0
        return dateB - dateA
    })
})

const canSubmit = computed(() => {
    return newComment.value.text.trim().length > 0 &&
        newComment.value.text.length <= 500
})

// Methods
const loadComments = async () => {
    isLoading.value = true
    try {
        await publicStore.loadComments(props.queueId)
    } catch (error) {
        console.error('Failed to load comments:', error)
    } finally {
        isLoading.value = false
    }
}

const submitComment = async () => {
    if (!canSubmit.value || isSubmitting.value) return

    isSubmitting.value = true
    try {
        const commentData = {
            username: newComment.value.username.trim() || 'Anonymous',
            text: newComment.value.text.trim()
        }

        await publicStore.addComment(props.queueId, commentData)

        newComment.value = {
            username: newComment.value.username,
            text: ''
        }
    } catch (error) {
        console.error('Failed to submit comment:', error)
    } finally {
        isSubmitting.value = false
    }
}

const handleReply = (commentId) => {
    // This will be handled by CommentItem component
}

const handleReport = (data) => {
    reportData.value = data
    selectedReason.value = ''
    showReportModal.value = true
}

const closeReportModal = () => {
    showReportModal.value = false
    reportData.value = null
    selectedReason.value = ''
}

const submitReport = async () => {
    if (!selectedReason.value || !reportData.value || isReporting.value) return

    isReporting.value = true
    try {
        await publicStore.reportComment(
            props.queueId,
            reportData.value.id,
            selectedReason.value,
            reportData.value.isReply,
            reportData.value.commentId
        )

        closeReportModal()

        // Show success feedback
        alert('Thank you for your report. We will review this content.')
    } catch (error) {
        console.error('Failed to report comment:', error)
        alert('Failed to submit report. Please try again.')
    } finally {
        isReporting.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadComments()
})
</script>