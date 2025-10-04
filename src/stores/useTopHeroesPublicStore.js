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
    serverTimestamp,
    increment,
    arrayUnion
} from 'firebase/firestore'
import { firestore } from '@/firebase'

// Discord Webhook URLs
const DISCORD_WEBHOOK_REPORTS = 'https://discord.com/api/webhooks/1423923070334402632/9iHvtuRkm2hNVXhFjXftfC_mcWplEOhzq_t3rZwKyC8HQ0Ly21Uo_robo8LuHY0s1XC0'
const DISCORD_WEBHOOK_COMMENTS = 'https://discord.com/api/webhooks/1423923484492435517/pSRHY1mM0uFrFmc6_iOLLhjjv7RERB92cS95GuEUuQBP7ihDeOTStHCq6-UYbzd5fCSS'

// Helper function to send Discord notifications
const sendDiscordNotification = async (webhookUrl, embed) => {
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        })
    } catch (error) {
        console.error('Failed to send Discord notification:', error)
    }
}

export const useTopHeroesPublicStore = defineStore('topHeroesPublic', () => {
    // State
    const heroes = ref([])
    const factions = ref([])
    const rarities = ref([])
    const tags = ref([])
    const bonds = ref([])
    const factionAuras = ref([])
    const gear = ref([])
    const relics = ref([])
    const pets = ref([])
    const skins = ref([])
    const queues = ref([])
    const metadata = ref(null)
    const queueDetails = ref({})
    const comments = ref({})
    const replies = ref({}) // Store replies by commentId

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

    const heroesCount = computed(() => heroes.value.length)

    const heroesByFaction = computed(() => {
        return factions.value.reduce((acc, faction) => {
            acc[faction.id] = heroes.value.filter(hero => hero.faction === faction.id)
            return acc
        }, {})
    })

    const heroesByRarity = computed(() => {
        return rarities.value.reduce((acc, rarity) => {
            acc[rarity.id] = heroes.value.filter(hero => hero.rarity === rarity.id)
            return acc
        }, {})
    })

    const gearByType = computed(() => {
        return gear.value.reduce((acc, item) => {
            acc[item.id] = item
            return acc
        }, {})
    })

    const relicsByType = computed(() => {
        return relics.value.reduce((acc, relic) => {
            if (!acc[relic.type]) acc[relic.type] = []
            acc[relic.type].push(relic)
            return acc
        }, {})
    })

    const relicsByRarity = computed(() => {
        return relics.value.reduce((acc, relic) => {
            if (!acc[relic.rarity]) acc[relic.rarity] = []
            acc[relic.rarity].push(relic)
            return acc
        }, {})
    })

    const petsByFaction = computed(() => {
        return pets.value.reduce((acc, pet) => {
            if (!acc[pet.faction]) acc[pet.faction] = []
            acc[pet.faction].push(pet)
            return acc
        }, {})
    })

    const skinsByRarity = computed(() => {
        return skins.value.reduce((acc, skin) => {
            if (!acc[skin.rarity]) acc[skin.rarity] = []
            acc[skin.rarity].push(skin)
            return acc
        }, {})
    })

    // Helper functions
    const getHeroById = (heroId) => {
        return heroes.value.find(hero => hero.id === heroId)
    }

    const getHeroesByIds = (heroIds) => {
        return heroIds.map(id => getHeroById(id)).filter(Boolean)
    }

    const getFactionById = (factionId) => {
        return factions.value.find(faction => faction.id === factionId)
    }

    const getRarityById = (rarityId) => {
        return rarities.value.find(rarity => rarity.id === rarityId)
    }

    const getTagById = (tagId) => {
        return tags.value.find(tag => tag.id === tagId)
    }

    const getGearById = (gearId) => {
        return gear.value.find(g => g.id === gearId)
    }

    const getRelicById = (relicId) => {
        return relics.value.find(r => r.id === relicId)
    }

    const getPetById = (petId) => {
        return pets.value.find(p => p.id === petId)
    }

    const getSkinById = (skinId) => {
        return skins.value.find(s => s.id === skinId)
    }

    const getBondsForHero = (heroId) => {
        return bonds.value.filter(bond => bond.heroes?.includes(heroId))
    }

    const getBondsForTeam = (heroIds) => {
        return bonds.value.filter(bond =>
            bond.heroes?.every(heroId => heroIds.includes(heroId))
        )
    }

    const getActiveBondsFiltered = (heroIds) => {
        const activeBonds = getBondsForTeam(heroIds)

        return activeBonds.filter(bond => {
            const isPartial = activeBonds.some(otherBond => {
                if (otherBond === bond) return false

                return otherBond.heroes.length > bond.heroes.length &&
                    bond.heroes.every(heroId => otherBond.heroes.includes(heroId))
            })

            return !isPartial
        })
    }

    const getFactionAuraForCount = (factionCount) => {
        return factionAuras.value.find(aura => aura.faction_count === factionCount)
    }

    const getFactionCounterData = (factionId) => {
        const faction = getFactionById(factionId)
        if (!faction) return null

        return {
            beats: getFactionById(faction.beats),
            losesTo: getFactionById(faction.loses_to),
            buffPercent: faction.buff_percent
        }
    }

    // Load all public data
    const loadAll = async (forceRefresh = false) => {
        if (!forceRefresh && !isDataStale.value && heroes.value.length > 0) {
            return
        }

        isLoading.value = true
        error.value = null

        try {
            console.log('📡 Loading public TopHeroes data...')

            // Fetch metadata
            const generalDocRef = doc(firestore, 'topheroes', 'general')
            const generalDoc = await getDoc(generalDocRef)

            if (generalDoc.exists()) {
                metadata.value = generalDoc.data()
            }

            // Fetch all collections in parallel
            const [
                heroesSnap,
                factionsSnap,
                raritiesSnap,
                tagsSnap,
                bondsSnap,
                factionAurasSnap,
                gearSnap,
                relicsSnap,
                petsSnap,
                skinsSnap,
                queuesSnap
            ] = await Promise.all([
                getDocs(query(collection(firestore, 'topheroes', 'general', 'heroes'), orderBy('rarity'), orderBy('name'))),
                getDocs(collection(firestore, 'topheroes', 'general', 'factions')),
                getDocs(collection(firestore, 'topheroes', 'general', 'rarities')),
                getDocs(collection(firestore, 'topheroes', 'general', 'tags')),
                getDocs(collection(firestore, 'topheroes', 'general', 'bonds')),
                getDocs(collection(firestore, 'topheroes', 'general', 'faction_auras')),
                getDocs(collection(firestore, 'topheroes', 'general', 'gear')),
                getDocs(collection(firestore, 'topheroes', 'general', 'relics')),
                getDocs(collection(firestore, 'topheroes', 'general', 'pets')),
                getDocs(collection(firestore, 'topheroes', 'general', 'skins')),
                getDocs(query(
                    collection(firestore, 'topheroes', 'general', 'queues'),
                    where('isVisible', '==', true),
                    orderBy('__name__')
                ))
            ])

            heroes.value = heroesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            factions.value = factionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            rarities.value = raritiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            tags.value = tagsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            bonds.value = bondsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            factionAuras.value = factionAurasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            gear.value = gearSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            relics.value = relicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            pets.value = petsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            skins.value = skinsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            // Sort queues by last updated
            queues.value = queuesSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => {
                    const dateA = new Date(a.lastUpdated?.seconds ? a.lastUpdated.seconds * 1000 : a.lastUpdated || 0)
                    const dateB = new Date(b.lastUpdated?.seconds ? b.lastUpdated.seconds * 1000 : b.lastUpdated || 0)
                    return dateB - dateA
                })

            lastFetched.value = Date.now()
            console.log(`✅ Loaded ${heroes.value.length} heroes, ${queues.value.length} queues, and all game data`)

        } catch (err) {
            console.error('❌ Failed to load public data:', err)
            error.value = `Failed to load data: ${err.message}`
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Get detailed queue info (with caching)
    const getQueueDetail = async (queueId) => {
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

            await updateDoc(queueRef, updates)

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

    // Load replies for a comment
    const loadReplies = async (queueId, commentId) => {
        try {
            const repliesQuery = query(
                collection(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId, 'replies'),
                orderBy('createdAt', 'asc')
            )

            const repliesSnap = await getDocs(repliesQuery)
            const repliesList = repliesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            if (!replies.value[commentId]) {
                replies.value[commentId] = []
            }
            replies.value[commentId] = repliesList

            return repliesList

        } catch (err) {
            console.error('Failed to load replies:', err)
            throw err
        }
    }

    // Add a comment
    const addComment = async (queueId, commentData) => {
        try {
            const comment = {
                ...commentData,
                createdAt: serverTimestamp(),
                upvotes: 0,
                downvotes: 0,
                replyCount: 0,
                reports: []
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'queues', queueId, 'comments'),
                comment
            )

            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(queueRef, {
                commentCount: increment(1)
            })

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

            // Send Discord notification for new comment
            const queueData = queueDetails.value[queueId] || queue
            const commentUrl = `${window.location.origin}/topheroes/queues/${queueId}#comment-${docRef.id}`

            sendDiscordNotification(DISCORD_WEBHOOK_COMMENTS, {
                title: '💬 New Comment',
                description: comment.text,
                url: commentUrl,
                color: 0x7C3AED, // velaris-purple
                fields: [
                    {
                        name: 'Author',
                        value: comment.username || 'Anonymous',
                        inline: true
                    },
                    {
                        name: 'Queue',
                        value: queueData?.name || queueId,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: `Queue ID: ${queueId} | Comment ID: ${docRef.id}`
                }
            })

            return { id: docRef.id, ...comment }

        } catch (err) {
            console.error('Failed to add comment:', err)
            throw err
        }
    }

    // Add a reply to a comment
    const addReply = async (queueId, commentId, replyData) => {
        try {
            const reply = {
                ...replyData,
                createdAt: serverTimestamp(),
                upvotes: 0,
                downvotes: 0,
                reports: []
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId, 'replies'),
                reply
            )

            // Update comment's reply count
            const commentRef = doc(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId)
            await updateDoc(commentRef, {
                replyCount: increment(1)
            })

            // Increment total comment count (replies count as comments)
            const queueRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(queueRef, {
                commentCount: increment(1)
            })

            // Update local state
            if (!replies.value[commentId]) {
                replies.value[commentId] = []
            }
            replies.value[commentId].push({ id: docRef.id, ...reply })

            // Update comment's reply count locally
            const commentsList = comments.value[queueId]
            if (commentsList) {
                const comment = commentsList.find(c => c.id === commentId)
                if (comment) {
                    comment.replyCount = (comment.replyCount || 0) + 1
                }
            }

            // Update queue comment counts
            const queue = queues.value.find(q => q.id === queueId)
            if (queue) {
                queue.commentCount = (queue.commentCount || 0) + 1
            }
            if (queueDetails.value[queueId]) {
                queueDetails.value[queueId].commentCount = (queueDetails.value[queueId].commentCount || 0) + 1
            }

            // Send Discord notification for new reply
            const queueData = queueDetails.value[queueId] || queue
            const parentComment = commentsList?.find(c => c.id === commentId)
            const replyUrl = `${window.location.origin}/topheroes/queues/${queueId}#comment-${commentId}`

            sendDiscordNotification(DISCORD_WEBHOOK_COMMENTS, {
                title: '↩️ New Reply',
                description: reply.text,
                url: replyUrl,
                color: 0x14B8A6, // velaris-teal
                fields: [
                    {
                        name: 'Author',
                        value: reply.username || 'Anonymous',
                        inline: true
                    },
                    {
                        name: 'Queue',
                        value: queueData?.name || queueId,
                        inline: true
                    },
                    {
                        name: 'Replying to',
                        value: parentComment?.username || 'Unknown',
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: `Queue ID: ${queueId} | Comment ID: ${commentId} | Reply ID: ${docRef.id}`
                }
            })

            return { id: docRef.id, ...reply }

        } catch (err) {
            console.error('Failed to add reply:', err)
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

    // Vote on reply
    const voteReply = async (queueId, commentId, replyId, voteType, previousVote) => {
        try {
            const replyRef = doc(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId, 'replies', replyId)

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

            await updateDoc(replyRef, updates)

            const repliesList = replies.value[commentId]
            if (repliesList) {
                const reply = repliesList.find(r => r.id === replyId)
                if (reply) {
                    if (previousVote === 'up') {
                        reply.upvotes = Math.max(0, (reply.upvotes || 0) - 1)
                    } else if (previousVote === 'down') {
                        reply.downvotes = Math.max(0, (reply.downvotes || 0) - 1)
                    }

                    if (voteType === 'up' && previousVote !== 'up') {
                        reply.upvotes = (reply.upvotes || 0) + 1
                    } else if (voteType === 'down' && previousVote !== 'down') {
                        reply.downvotes = (reply.downvotes || 0) + 1
                    }
                }
            }

        } catch (err) {
            console.error('Failed to vote on reply:', err)
            throw err
        }
    }

    // Report comment or reply
    const reportComment = async (queueId, itemId, reason, isReply = false, commentId = null) => {
        try {
            const report = {
                reason,
                reportedAt: new Date().toISOString()
            }

            let itemRef
            let itemPath
            let itemType
            let itemUrl

            // Construct the URL to the specific item
            const baseUrl = window.location.origin

            if (isReply && commentId) {
                // Reporting a reply
                itemRef = doc(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', commentId, 'replies', itemId)
                itemPath = `queues/${queueId}/comments/${commentId}/replies/${itemId}`
                itemType = 'Reply'
                itemUrl = `${baseUrl}/topheroes/queues/${queueId}#comment-${commentId}`
            } else {
                // Reporting a comment
                itemRef = doc(firestore, 'topheroes', 'general', 'queues', queueId, 'comments', itemId)
                itemPath = `queues/${queueId}/comments/${itemId}`
                itemType = 'Comment'
                itemUrl = `${baseUrl}/topheroes/queues/${queueId}#comment-${itemId}`
            }

            // Add report to the document's reports array
            await updateDoc(itemRef, {
                reports: arrayUnion(report)
            })

            // Update local state
            if (isReply && commentId) {
                const repliesList = replies.value[commentId]
                if (repliesList) {
                    const reply = repliesList.find(r => r.id === itemId)
                    if (reply) {
                        if (!reply.reports) reply.reports = []
                        reply.reports.push(report)
                    }
                }
            } else {
                const commentsList = comments.value[queueId]
                if (commentsList) {
                    const comment = commentsList.find(c => c.id === itemId)
                    if (comment) {
                        if (!comment.reports) comment.reports = []
                        comment.reports.push(report)
                    }
                }
            }

            // Get item details for Discord notification
            const queue = queues.value.find(q => q.id === queueId) || queueDetails.value[queueId]
            let itemText = 'Unknown content'
            let itemAuthor = 'Unknown'

            if (isReply && commentId) {
                const repliesList = replies.value[commentId]
                const reply = repliesList?.find(r => r.id === itemId)
                if (reply) {
                    itemText = reply.text
                    itemAuthor = reply.username || 'Anonymous'
                }
            } else {
                const commentsList = comments.value[queueId]
                const comment = commentsList?.find(c => c.id === itemId)
                if (comment) {
                    itemText = comment.text
                    itemAuthor = comment.username || 'Anonymous'
                }
            }

            // Send Discord notification for report
            sendDiscordNotification(DISCORD_WEBHOOK_REPORTS, {
                title: `🚩 ${itemType} Reported`,
                description: itemText.length > 200 ? itemText.substring(0, 200) + '...' : itemText,
                url: itemUrl,
                color: 0xEF4444, // red
                fields: [
                    {
                        name: 'Reason',
                        value: reason,
                        inline: true
                    },
                    {
                        name: 'Author',
                        value: itemAuthor,
                        inline: true
                    },
                    {
                        name: 'Queue',
                        value: queue?.name || queueId,
                        inline: false
                    },
                    {
                        name: 'Total Reports',
                        value: String((isReply
                            ? replies.value[commentId]?.find(r => r.id === itemId)?.reports?.length
                            : comments.value[queueId]?.find(c => c.id === itemId)?.reports?.length) || 1),
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: itemPath
                }
            })

            console.log(`Reported ${itemType.toLowerCase()} ${itemId} in queue ${queueId}: ${reason}`)

        } catch (err) {
            console.error('Failed to report comment:', err)
            throw err
        }
    }

    // Search heroes
    const searchHeroes = (searchTerm, filters = {}) => {
        let filtered = heroes.value

        if (searchTerm && searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(hero =>
                hero.searchTerms?.some(term => term.includes(search)) ||
                hero.name.toLowerCase().includes(search) ||
                hero.factionName?.toLowerCase().includes(search) ||
                hero.rarityName?.toLowerCase().includes(search)
            )
        }

        if (filters.faction) {
            filtered = filtered.filter(hero => hero.faction === filters.faction)
        }

        if (filters.rarity) {
            filtered = filtered.filter(hero => hero.rarity === filters.rarity)
        }

        if (filters.tag) {
            filtered = filtered.filter(hero => hero.tags?.includes(filters.tag))
        }

        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(hero =>
                filters.tags.every(tag => hero.tags?.includes(tag))
            )
        }

        return filtered
    }

    // Stats
    const getStats = computed(() => ({
        totalHeroes: heroes.value.length,
        heroesByFaction: Object.fromEntries(
            factions.value.map(faction => [
                faction.id,
                heroes.value.filter(hero => hero.faction === faction.id).length
            ])
        ),
        heroesByRarity: Object.fromEntries(
            rarities.value.map(rarity => [
                rarity.id,
                heroes.value.filter(hero => hero.rarity === rarity.id).length
            ])
        ),
        totalBonds: bonds.value.length,
        totalFactionAuras: factionAuras.value.length,
        totalGear: gear.value.length,
        totalRelics: relics.value.length,
        totalPets: pets.value.length,
        totalSkins: skins.value.length,
        totalQueues: queues.value.length,
        isDataStale: isDataStale.value
    }))

    return {
        // State
        heroes,
        factions,
        rarities,
        tags,
        bonds,
        factionAuras,
        gear,
        relics,
        pets,
        skins,
        queues,
        metadata,
        queueDetails,
        comments,
        replies,

        // Loading states
        isLoading,
        isLoadingQueue,
        isLoadingComments,

        // Error
        error,

        // Computed
        heroesCount,
        heroesByFaction,
        heroesByRarity,
        gearByType,
        relicsByType,
        relicsByRarity,
        petsByFaction,
        skinsByRarity,
        isDataStale,
        getStats,

        // Data loading
        loadAll,
        getQueueDetail,

        // Helper functions
        getHeroById,
        getHeroesByIds,
        getFactionById,
        getRarityById,
        getTagById,
        getGearById,
        getRelicById,
        getPetById,
        getSkinById,
        getBondsForHero,
        getBondsForTeam,
        getActiveBondsFiltered,
        getFactionAuraForCount,
        getFactionCounterData,
        searchHeroes,

        // Actions
        incrementViews,
        incrementShares,
        voteQueue,
        loadComments,
        loadReplies,
        addComment,
        addReply,
        voteComment,
        voteReply,
        reportComment
    }
})