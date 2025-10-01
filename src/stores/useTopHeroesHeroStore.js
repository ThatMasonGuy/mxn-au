// stores/useTopHeroesHeroStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
    doc,
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useTopHeroesHeroStore = defineStore('topHeroesHero', () => {
    // State
    const heroes = ref([])
    const factions = ref([])
    const rarities = ref([])
    const tags = ref([])
    const bonds = ref([])
    const queues = ref([]) // Now each queue is a single team of 6 heroes
    const metadata = ref(null)

    // Loading states
    const isLoading = ref(false)
    const isLoadingHeroes = ref(false)
    const isLoadingMetadata = ref(false)
    const isLoadingQueues = ref(false)
    const isSaving = ref(false)

    // Error states
    const error = ref(null)
    const lastUpdated = ref(null)

    // Cache control
    const cacheTimeout = 5 * 60 * 1000 // 5 minutes
    const lastFetched = ref(null)

    // Computed getters
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

    const heroesByTag = computed(() => {
        return tags.value.reduce((acc, tag) => {
            acc[tag.id] = heroes.value.filter(hero => hero.tags.includes(tag.id))
            return acc
        }, {})
    })

    const activeQueues = computed(() => {
        return queues.value.filter(queue => queue.isVisible)
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

    const getBondsForHero = (heroName) => {
        return bonds.value.filter(bond => bond.heroes.includes(heroName))
    }

    const getBondsForTeam = (heroNames) => {
        return bonds.value.filter(bond =>
            bond.heroes.every(heroName => heroNames.includes(heroName))
        )
    }

    // Data fetching functions
    const fetchMetadata = async (forceRefresh = false) => {
        if (!forceRefresh && !isDataStale.value && metadata.value) {
            return metadata.value
        }

        isLoadingMetadata.value = true
        error.value = null

        try {
            console.log('📡 Fetching TopHeroes metadata from Firestore...')

            const generalDocRef = doc(firestore, 'topheroes', 'general')
            const generalDoc = await getDoc(generalDocRef)

            if (generalDoc.exists()) {
                metadata.value = generalDoc.data()
                console.log('✅ Metadata loaded:', metadata.value)
            } else {
                throw new Error('TopHeroes metadata not found. Please sync the data first.')
            }

            // Fetch collections in parallel
            const [factionsSnap, raritiesSnap, tagsSnap, bondsSnap] = await Promise.all([
                getDocs(collection(firestore, 'topheroes', 'general', 'factions')),
                getDocs(collection(firestore, 'topheroes', 'general', 'rarities')),
                getDocs(collection(firestore, 'topheroes', 'general', 'tags')),
                getDocs(collection(firestore, 'topheroes', 'general', 'bonds'))
            ])

            factions.value = factionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            rarities.value = raritiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            tags.value = tagsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            bonds.value = bondsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            console.log('✅ All metadata collections loaded')
            lastFetched.value = Date.now()

        } catch (err) {
            console.error('❌ Failed to fetch metadata:', err)
            error.value = `Failed to load metadata: ${err.message}`
            throw err
        } finally {
            isLoadingMetadata.value = false
        }
    }

    const fetchHeroes = async (forceRefresh = false) => {
        if (!forceRefresh && !isDataStale.value && heroes.value.length > 0) {
            return heroes.value
        }

        isLoadingHeroes.value = true
        error.value = null

        try {
            console.log('📡 Fetching heroes from Firestore...')

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

            console.log(`✅ Loaded ${heroes.value.length} heroes`)
            lastFetched.value = Date.now()
            lastUpdated.value = new Date().toISOString()

        } catch (err) {
            console.error('❌ Failed to fetch heroes:', err)
            error.value = `Failed to load heroes: ${err.message}`
            throw err
        } finally {
            isLoadingHeroes.value = false
        }
    }

    const fetchQueues = async (forceRefresh = false) => {
        if (!forceRefresh && queues.value.length > 0) {
            return queues.value
        }

        isLoadingQueues.value = true
        error.value = null

        try {
            console.log('📡 Fetching queues from Firestore...')

            const queuesQuery = query(
                collection(firestore, 'topheroes', 'general', 'queues'),
                where('__name__', '!=', '_metadata'),
                orderBy('__name__')
            )

            const queuesSnap = await getDocs(queuesQuery)

            // Sort by createdAt in JavaScript instead of Firestore
            const queuesData = queuesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Sort by createdAt locally (newest first)
            queues.value = queuesData.sort((a, b) => {
                const dateA = new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt || 0)
                const dateB = new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt || 0)
                return dateB - dateA
            })

            console.log(`✅ Loaded ${queues.value.length} queues`)

        } catch (err) {
            console.error('❌ Failed to fetch queues:', err)
            error.value = `Failed to load queues: ${err.message}`
            throw err
        } finally {
            isLoadingQueues.value = false
        }
    }

    const loadAll = async (forceRefresh = false) => {
        isLoading.value = true
        error.value = null

        try {
            console.log('🚀 Loading all TopHeroes data...')

            await fetchMetadata(forceRefresh)
            await Promise.all([
                fetchHeroes(forceRefresh),
                fetchQueues(forceRefresh)
            ])

            console.log('🎉 All TopHeroes data loaded successfully!')

        } catch (err) {
            console.error('❌ Failed to load TopHeroes data:', err)
            error.value = `Failed to load data: ${err.message}`
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // Hero CRUD operations
    const createHero = async (heroData) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Creating new hero:', heroData.name)

            // Create denormalized hero document
            const factionData = getFactionById(heroData.faction)
            const rarityData = getRarityById(heroData.rarity)
            const tagData = heroData.tags.map(tagId => getTagById(tagId)).filter(Boolean)

            const heroDocument = {
                ...heroData,
                // Denormalized data for easier querying
                factionName: factionData?.name,
                rarityName: rarityData?.name,
                tagNames: tagData.map(tag => tag.name),
                tagDescriptions: tagData.map(tag => ({ id: tag.id, name: tag.name, desc: tag.desc })),

                // Search terms for filtering
                searchTerms: [
                    heroData.name.toLowerCase(),
                    ...heroData.name.toLowerCase().split(' '),
                    factionData?.name.toLowerCase(),
                    rarityData?.name.toLowerCase(),
                    ...tagData.map(tag => tag.name.toLowerCase()),
                    ...heroData.tags
                ].filter(Boolean),

                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'heroes'),
                heroDocument
            )

            // Add to local state with generated ID
            const newHero = { id: docRef.id, ...heroDocument }
            heroes.value.push(newHero)

            console.log('✅ Hero created successfully:', docRef.id)
            return newHero

        } catch (err) {
            console.error('❌ Failed to create hero:', err)
            error.value = `Failed to create hero: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const updateHero = async (heroId, heroData) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Updating hero:', heroId)

            // Create denormalized hero document
            const factionData = getFactionById(heroData.faction)
            const rarityData = getRarityById(heroData.rarity)
            const tagData = heroData.tags.map(tagId => getTagById(tagId)).filter(Boolean)

            const updateData = {
                ...heroData,
                // Denormalized data for easier querying
                factionName: factionData?.name,
                rarityName: rarityData?.name,
                tagNames: tagData.map(tag => tag.name),
                tagDescriptions: tagData.map(tag => ({ id: tag.id, name: tag.name, desc: tag.desc })),

                // Search terms for filtering
                searchTerms: [
                    heroData.name.toLowerCase(),
                    ...heroData.name.toLowerCase().split(' '),
                    factionData?.name.toLowerCase(),
                    rarityData?.name.toLowerCase(),
                    ...tagData.map(tag => tag.name.toLowerCase()),
                    ...heroData.tags
                ].filter(Boolean),

                lastUpdated: serverTimestamp()
            }

            const docRef = doc(firestore, 'topheroes', 'general', 'heroes', heroId)
            await updateDoc(docRef, updateData)

            // Update local state
            const heroIndex = heroes.value.findIndex(hero => hero.id === heroId)
            if (heroIndex !== -1) {
                heroes.value[heroIndex] = { id: heroId, ...updateData }
            }

            console.log('✅ Hero updated successfully:', heroId)
            return heroes.value[heroIndex]

        } catch (err) {
            console.error('❌ Failed to update hero:', err)
            error.value = `Failed to update hero: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const deleteHero = async (heroId) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🗑️ Deleting hero:', heroId)

            const docRef = doc(firestore, 'topheroes', 'general', 'heroes', heroId)
            await deleteDoc(docRef)

            // Remove from local state
            heroes.value = heroes.value.filter(hero => hero.id !== heroId)

            console.log('✅ Hero deleted successfully:', heroId)

        } catch (err) {
            console.error('❌ Failed to delete hero:', err)
            error.value = `Failed to delete hero: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    // Queue CRUD operations (now includes gear data)
    const createQueue = async (queueData) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Creating new queue:', queueData.name)

            const queueDocument = {
                ...queueData,
                // Ensure gear data is included
                gearData: queueData.gearData || {},
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                createdBy: queueData.createdBy || 'admin'
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'queues'),
                queueDocument
            )

            // Add to local state
            const newQueue = { id: docRef.id, ...queueDocument }
            queues.value.unshift(newQueue) // Add to beginning for newest first

            // Update queues metadata
            await updateQueuesMetadata()

            console.log('✅ Queue created successfully:', docRef.id)
            return newQueue

        } catch (err) {
            console.error('❌ Failed to create queue:', err)
            error.value = `Failed to create queue: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const updateQueue = async (queueId, queueData) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Updating queue:', queueId)

            const updateData = {
                ...queueData,
                // Ensure gear data is preserved and updated
                gearData: queueData.gearData || {},
                lastUpdated: serverTimestamp()
            }

            const docRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(docRef, updateData)

            // Update local state
            const queueIndex = queues.value.findIndex(queue => queue.id === queueId)
            if (queueIndex !== -1) {
                queues.value[queueIndex] = { id: queueId, ...updateData }
            }

            console.log('✅ Queue updated successfully:', queueId)
            return queues.value[queueIndex]

        } catch (err) {
            console.error('❌ Failed to update queue:', err)
            error.value = `Failed to update queue: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const deleteQueue = async (queueId) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🗑️ Deleting queue:', queueId)

            const docRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await deleteDoc(docRef)

            // Remove from local state
            queues.value = queues.value.filter(queue => queue.id !== queueId)

            // Update queues metadata
            await updateQueuesMetadata()

            console.log('✅ Queue deleted successfully:', queueId)

        } catch (err) {
            console.error('❌ Failed to delete queue:', err)
            error.value = `Failed to delete queue: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    // Helper function to update queues metadata
    const updateQueuesMetadata = async () => {
        try {
            const queuesMetaRef = doc(firestore, 'topheroes', 'general', 'queues', '_metadata')
            await updateDoc(queuesMetaRef, {
                totalQueues: queues.value.length,
                lastUpdated: serverTimestamp()
            })
        } catch (err) {
            console.warn('Failed to update queues metadata:', err)
        }
    }

    // Search and filter methods
    const searchHeroes = (searchTerm, filters = {}) => {
        let filtered = heroes.value

        // Text search
        if (searchTerm && searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(hero =>
                hero.searchTerms?.some(term => term.includes(search)) ||
                hero.name.toLowerCase().includes(search) ||
                hero.factionName?.toLowerCase().includes(search) ||
                hero.rarityName?.toLowerCase().includes(search)
            )
        }

        // Faction filter
        if (filters.faction) {
            filtered = filtered.filter(hero => hero.faction === filters.faction)
        }

        // Rarity filter
        if (filters.rarity) {
            filtered = filtered.filter(hero => hero.rarity === filters.rarity)
        }

        // Tag filter
        if (filters.tag) {
            filtered = filtered.filter(hero => hero.tags.includes(filters.tag))
        }

        // Tags filter (multiple tags)
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(hero =>
                filters.tags.every(tag => hero.tags.includes(tag))
            )
        }

        return filtered
    }

    // Real-time listeners
    const subscribeToHeroes = (callback) => {
        const heroesQuery = query(
            collection(firestore, 'topheroes', 'general', 'heroes'),
            orderBy('rarity'),
            orderBy('name')
        )

        return onSnapshot(heroesQuery, (snapshot) => {
            heroes.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            lastUpdated.value = new Date().toISOString()

            if (callback) callback(heroes.value)
        }, (err) => {
            console.error('❌ Heroes subscription error:', err)
            error.value = `Real-time update failed: ${err.message}`
        })
    }

    const subscribeToQueues = (callback) => {
        const queuesQuery = query(
            collection(firestore, 'topheroes', 'general', 'queues'),
            where('__name__', '!=', '_metadata'),
            orderBy('__name__')
        )

        return onSnapshot(queuesQuery, (snapshot) => {
            const queuesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            // Sort by createdAt locally
            queues.value = queuesData.sort((a, b) => {
                const dateA = new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt || 0)
                const dateB = new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt || 0)
                return dateB - dateA
            })

            if (callback) callback(queues.value)
        }, (err) => {
            console.error('❌ Queues subscription error:', err)
            error.value = `Queues subscription failed: ${err.message}`
        })
    }

    // Batch operations
    const bulkUpdateHeroes = async (updates) => {
        isSaving.value = true
        error.value = null

        try {
            console.log(`🔥 Bulk updating ${updates.length} heroes...`)

            const batch = writeBatch(firestore)

            updates.forEach(({ heroId, data }) => {
                const docRef = doc(firestore, 'topheroes', 'general', 'heroes', heroId)
                batch.update(docRef, {
                    ...data,
                    lastUpdated: serverTimestamp()
                })
            })

            await batch.commit()

            // Refresh local data
            await fetchHeroes(true)

            console.log('✅ Bulk update completed')

        } catch (err) {
            console.error('❌ Failed to bulk update heroes:', err)
            error.value = `Failed to bulk update: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    // Utility methods
    const clearCache = () => {
        heroes.value = []
        factions.value = []
        rarities.value = []
        tags.value = []
        bonds.value = []
        queues.value = []
        metadata.value = null
        lastFetched.value = null
        lastUpdated.value = null
        error.value = null
    }

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
        totalQueues: queues.value.length,
        activeQueues: activeQueues.value.length,
        lastUpdated: lastUpdated.value,
        isDataStale: isDataStale.value
    }))

    return {
        // State
        heroes,
        factions,
        rarities,
        tags,
        bonds,
        queues,
        metadata,

        // Loading states
        isLoading,
        isLoadingHeroes,
        isLoadingMetadata,
        isLoadingQueues,
        isSaving,

        // Error state
        error,
        lastUpdated,

        // Computed
        heroesCount,
        heroesByFaction,
        heroesByRarity,
        heroesByTag,
        activeQueues,
        isDataStale,
        getStats,

        // Data loading
        loadAll,
        fetchMetadata,
        fetchHeroes,
        fetchQueues,
        clearCache,

        // Hero CRUD
        createHero,
        updateHero,
        deleteHero,
        bulkUpdateHeroes,

        // Queue CRUD
        createQueue,
        updateQueue,
        deleteQueue,

        // Search and filter
        searchHeroes,
        getHeroById,
        getHeroesByIds,
        getFactionById,
        getRarityById,
        getTagById,
        getBondsForHero,
        getBondsForTeam,

        // Real-time subscriptions
        subscribeToHeroes,
        subscribeToQueues
    }
})