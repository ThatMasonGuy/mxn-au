// stores/useTopHeroesPublicStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    doc,
    collection,
    getDocs,
    getDoc,
    updateDoc,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    increment
} from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useTopHeroesPublicStore = defineStore('topHeroesPublic', () => {
    // State
    const heroes = ref([])
    const queues = ref([])
    const bonds = ref([]) // Add bonds to state
    const tags = ref([]) // Add tags to state
    const queueDetails = ref({}) // Cache for detailed queue views
    const comments = ref({}) // { queueId: [comments] }

    // Loading states
    const isLoading = ref(false)
    const isLoadingQueue = ref(false)
    const isLoadingComments = ref(false)

    // Error state
    const error = ref(null)

    // Cache control
    const lastFetched = ref(null)
    const cacheTimeout = 5 * 60 * 1000 // 5 minutes

    // Computed
    const isDataStale = computed(() => {
        if (!lastFetched.value) return true
        return Date.now() - lastFetched.value > cacheTimeout
    })

    // Load all public data (heroes, visible queues, and bonds)
    const loadAll = async (forceRefresh = false) => {
        if (!forceRefresh && !isDataStale.value && heroes.value.length > 0) {
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('Loading public TopHeroes data...')

            // Fetch heroes
            const heroesQuery = query(
                collection(firestore, 'topheroes', 'general', 'heroes'),
                orderBy('rarity'),
                orderBy('name')
            )
            const heroesSnap = await getDocs(heroesQuery)
            heroes.value = heroesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Fetch bonds
            const bondsQuery = query(
                collection(firestore, 'topheroes', 'general', 'bonds')
            )
            const bondsSnap = await getDocs(bondsQuery)
            bonds.value = bondsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Fetch tags
            const tagsQuery = query(
                collection(firestore, 'topheroes', 'general', 'tags')
            )
            const tagsSnap = await getDocs(tagsQuery)
            tags.value = tagsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Fetch visible queues only
            const queuesQuery = query(
                collection(firestore, 'topheroes', 'general', 'queues'),
                where('isVisible', '==', true),
                orderBy('__name__')
            )
            const queuesSnap = await getDocs(queuesQuery)

            queues.value = queuesSnap.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .sort((a, b) => {
                    const dateA = new Date(a.lastUpdated?.seconds ? a.lastUpdated.seconds * 1000 : a.lastUpdated || 0)
                    const dateB = new Date(b.lastUpdated?.seconds ? b.lastUpdated.seconds * 1000 : b.lastUpdated || 0)
                    return dateB - dateA
                })

            lastFetched.value = Date.now()
            console.log(`Loaded ${heroes.value.length} heroes, ${queues.value.length} queues, ${bonds.value.length} bonds, and ${tags.value.length} tags`)

        } catch (err) {
            console.error('Failed to load public data:', err)
            error.value = `Failed to load data: ${err.message}`
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Get detailed queue info (with caching)
    const getQueueDetail = async (queueId) => {
        // Return cached if available
        if (queueDetails.value[queueId]) {
            return queueDetails.value[queueId]
        }

        isLoadingQueue.value = true
        error.value = null

        try {
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            const queueSnap = await getDoc(queueRef)

            if (!queueSnap.exists()) {
                throw new Error('Queue not found')
            }

            const queueData = {
                id: queueSnap.id,
                ...queueSnap.data()
            }

            // Cache it
            queueDetails.value[queueId] = queueData

            return queueData

        } catch (err) {
            console.error('Failed to load queue detail:', err)
            error.value = `Failed to load queue: ${err.message}`
            throw err
        } finally {
            isLoadingQueue.value = false
        }
    }

    // Increment view count
    const incrementViews = async (queueId) => {
        try {
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(queueRef, {
                views: increment(1)
            })

            // Update local cache
            const queue = queues.value.find(q => q.id === queueId)
            if (queue) {
                queue.views = (queue.views || 0) + 1
            }
            if (queueDetails.value[queueId]) {
                queueDetails.value[queueId].views = (queueDetails.value[queueId].views || 0) + 1
            }

        } catch (err) {
            console.error('Failed to increment views:', err)
        }
    }

    // Increment share count
    const incrementShares = async (queueId) => {
        try {
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(queueRef, {
                shares: increment(1)
            })

            // Update local cache
            const queue = queues.value.find(q => q.id === queueId)
            if (queue) {
                queue.shares = (queue.shares || 0) + 1
            }
            if (queueDetails.value[queueId]) {
                queueDetails.value[queueId].shares = (queueDetails.value[queueId].shares || 0) + 1
            }

        } catch (err) {
            console.error('Failed to increment shares:', err)
        }
    }

    // Vote on queue
    const voteQueue = async (queueId, voteType, previousVote) => {
        try {
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)

            const updates = {}

            // Remove previous vote
            if (previousVote === 'up') {
                updates.upvotes = increment(-1)
            } else if (previousVote === 'down') {
                updates.downvotes = increment(-1)
            }

            // Add new vote (if not removing)
            if (voteType === 'up' && previousVote !== 'up') {
                updates.upvotes = increment(1)
            } else if (voteType === 'down' && previousVote !== 'down') {
                updates.downvotes = increment(1)
            }

            await updateDoc(queueRef, updates)

            // Update local cache
            const updateLocal = (queue) => {
                if (!queue) return

                if (previousVote === 'up') {
                    queue.upvotes = Math.max(0, (queue.upvotes || 0) - 1)
                } else if (previousVote === 'down') {
                    queue.downvotes = Math.max(0, (queue.downvotes || 0) - 1)
                }

                if (voteType === 'up' && previousVote !== 'up') {
                    queue.upvotes = (queue.upvotes || 0) + 1
                } else if (voteType === 'down' && previousVote !== 'down') {
                    queue.downvotes = (queue.downvotes || 0) + 1
                }
            }

            const queue = queues.value.find(q => q.id === queueId)
            updateLocal(queue)
            updateLocal(queueDetails.value[queueId])

        } catch (err) {
            console.error('Failed to vote:', err)
            throw err
        }
    }

    // Load comments for a queue
    const loadComments = async (queueId) => {
        isLoadingComments.value = true
        error.value = null

        try {
            const commentsQuery = query(
                collection(firestore, 'topheroes', 'general', 'queues', queueId, 'comments'),
                orderBy('createdAt', 'desc')
            )

            const commentsSnap = await getDocs(commentsQuery)
            const commentsList = commentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            comments.value[queueId] = commentsList

            return commentsList

        } catch (err) {
            console.error('Failed to load comments:', err)
            error.value = `Failed to load comments: ${err.message}`
            throw err
        } finally {
            isLoadingComments.value = false
        }
    }

    // Add a comment
    const addComment = async (queueId, commentData) => {
        try {
            const comment = {
                ...commentData,
                createdAt: serverTimestamp(),
                upvotes: 0,
                downvotes: 0
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'queues', queueId, 'comments'),
                comment
            )

            // Update comment count on queue
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(queueRef, {
                commentCount: increment(1)
            })

            // Update local cache
            if (!comments.value[queueId]) {
                comments.value[queueId] = []
            }
            comments.value[queueId].unshift({ id: docRef.id, ...comment })

            const queue = queues.value.find(q => q.id === queueId)
            if (queue) {
                queue.commentCount = (queue.commentCount || 0) + 1
            }
            if (queueDetails.value[queueId]) {
                queueDetails.value[queueId].commentCount = (queueDetails.value[queueId].commentCount || 0) + 1
            }

            return { id: docRef.id, ...comment }

        } catch (err) {
            console.error('Failed to add comment:', err)
            throw err
        }
    }

    // Vote on comment
    const voteComment = async (queueId, commentId, voteType, previousVote) => {
        try {
            const commentRef = doc(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId)

            const updates = {}

            if (previousVote === 'up') {
                updates.upvotes = increment(-1)
            } else if (previousVote === 'down') {
                updates.downvotes = increment(-1)
            }

            if (voteType === 'up' && previousVote !== 'up') {
                updates.upvotes = increment(1)
            } else if (voteType === 'down' && previousVote !== 'down') {
                updates.downvotes = increment(1)
            }

            await updateDoc(commentRef, updates)

            // Update local cache
            const commentsList = comments.value[queueId]
            if (commentsList) {
                const comment = commentsList.find(c => c.id === commentId)
                if (comment) {
                    if (previousVote === 'up') {
                        comment.upvotes = Math.max(0, (comment.upvotes || 0) - 1)
                    } else if (previousVote === 'down') {
                        comment.downvotes = Math.max(0, (comment.downvotes || 0) - 1)
                    }

                    if (voteType === 'up' && previousVote !== 'up') {
                        comment.upvotes = (comment.upvotes || 0) + 1
                    } else if (voteType === 'down' && previousVote !== 'down') {
                        comment.downvotes = (comment.downvotes || 0) + 1
                    }
                }
            }

        } catch (err) {
            console.error('Failed to vote on comment:', err)
            throw err
        }
    }

    return {
        // State
        heroes,
        queues,
        bonds,
        tags,
        queueDetails,
        comments,

        // Loading states
        isLoading,
        isLoadingQueue,
        isLoadingComments,

        // Error
        error,

        // Actions
        loadAll,
        getQueueDetail,
        incrementViews,
        incrementShares,
        voteQueue,
        loadComments,
        addComment,
        voteComment
    }
})