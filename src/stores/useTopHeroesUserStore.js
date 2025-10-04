// stores/useTopHeroesUserStore.js
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
    serverTimestamp
} from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

export const useTopHeroesUserStore = defineStore('topHeroesUser', () => {
    const mainStore = useMainStore()

    // State (read-only for heroes, editable for user's queues)
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
    const userQueues = ref([])
    const allQueues = ref([])
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

    // Computed getters
    const currentUserId = computed(() => mainStore.user?.id || null)

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
            acc[tag.id] = heroes.value.filter(hero => hero.tags?.includes(tag.id))
            return acc
        }, {})
    })

    const visibleQueues = computed(() => {
        return allQueues.value.filter(queue => queue.isVisible)
    })

    const queues = computed(() => userQueues.value)

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

    // Data fetching functions (read-only)
    const fetchMetadata = async (forceRefresh = false) => {
        isLoadingMetadata.value = true
        error.value = null

        try {
            console.log('📡 Fetching TopHeroes metadata...')

            const generalDocRef = doc(firestore, 'topheroes', 'general')
            const generalDoc = await getDoc(generalDocRef)

            if (generalDoc.exists()) {
                metadata.value = generalDoc.data()
                console.log('✅ Metadata loaded')
            } else {
                throw new Error('TopHeroes data not found. Please contact an administrator.')
            }

            // Fetch all collections in parallel
            const [
                factionsSnap,
                raritiesSnap,
                tagsSnap,
                bondsSnap,
                factionAurasSnap,
                gearSnap,
                relicsSnap,
                petsSnap,
                skinsSnap
            ] = await Promise.all([
                getDocs(collection(firestore, 'topheroes', 'general', 'factions')),
                getDocs(collection(firestore, 'topheroes', 'general', 'rarities')),
                getDocs(collection(firestore, 'topheroes', 'general', 'tags')),
                getDocs(collection(firestore, 'topheroes', 'general', 'bonds')),
                getDocs(collection(firestore, 'topheroes', 'general', 'faction_auras')),
                getDocs(collection(firestore, 'topheroes', 'general', 'gear')),
                getDocs(collection(firestore, 'topheroes', 'general', 'relics')),
                getDocs(collection(firestore, 'topheroes', 'general', 'pets')),
                getDocs(collection(firestore, 'topheroes', 'general', 'skins'))
            ])

            factions.value = factionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            rarities.value = raritiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            tags.value = tagsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            bonds.value = bondsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            factionAuras.value = factionAurasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            gear.value = gearSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            relics.value = relicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            pets.value = petsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            skins.value = skinsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            console.log('✅ All metadata collections loaded')

        } catch (err) {
            console.error('❌ Failed to fetch metadata:', err)
            error.value = `Failed to load game data: ${err.message}`
            throw err
        } finally {
            isLoadingMetadata.value = false
        }
    }

    const fetchHeroes = async (forceRefresh = false) => {
        isLoadingHeroes.value = true
        error.value = null

        try {
            console.log('📡 Fetching heroes...')

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
        const userId = mainStore.user?.id || mainStore.user?.uid
    
        isLoadingQueues.value = true
        error.value = null
    
        try {
            console.log('📡 Fetching user queues...')
    
            // Build queries
            let userQueuesQuery = null
            if (userId) {
                userQueuesQuery = query(
                    collection(firestore, 'topheroes', 'general', 'queues'),
                    where('createdByUserId', '==', userId),
                    orderBy('createdAt', 'desc')
                )
            }
    
            const allQueuesQuery = query(
                collection(firestore, 'topheroes', 'general', 'queues'),
                where('isVisible', '==', true),
                where('__name__', '!=', '_metadata'),
                orderBy('__name__')
            )
    
            // Run queries (conditionally run user query)
            const [userQueuesSnap, allQueuesSnap] = await Promise.all([
                userQueuesQuery ? getDocs(userQueuesQuery) : Promise.resolve({ docs: [] }),
                getDocs(allQueuesQuery)
            ])
    
            // Map results
            userQueues.value = userQueuesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isOwner: true
            }))
    
            allQueues.value = allQueuesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isOwner: doc.data().createdByUserId === currentUserId.value
            })).sort((a, b) => {
                const dateA = new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt || 0)
                const dateB = new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt || 0)
                return dateB - dateA
            })
    
            console.log(`✅ Loaded ${userQueues.value.length} user queues and ${allQueues.value.length} visible queues`)
    
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

    // Queue CRUD operations (only for user's own queues)
    const createQueue = async (queueData) => {
        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Creating new queue:', queueData.name)

            const queueDocument = {
                ...queueData,
                gearData: queueData.gearData || {},
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdBy: queueData.createdBy || mainStore.user?.username || mainStore.user?.email || 'User',
                createdByUserId: mainStore.user?.id || mainStore.user?.uid,
                createdByUserEmail: mainStore.user?.email
            }

            const docRef = await addDoc(
                collection(firestore, 'topheroes', 'general', 'queues'),
                queueDocument
            )

            const newQueue = { id: docRef.id, ...queueDocument, isOwner: true }
            userQueues.value.unshift(newQueue)

            // Also add to allQueues if visible
            if (queueDocument.isVisible) {
                allQueues.value.unshift(newQueue)
            }

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
        const userId = mainStore.user?.id || mainStore.user?.uid

        // Check if user owns this queue
        const queue = userQueues.value.find(q => q.id === queueId)
        if (!queue || (queue.createdByUserId && queue.createdByUserId !== userId)) {
            throw new Error('You can only edit your own queues')
        }

        isSaving.value = true
        error.value = null

        try {
            console.log('🔥 Updating queue:', queueId)

            const updateData = {
                ...queueData,
                gearData: queueData.gearData || {},
                updatedAt: serverTimestamp()
            }

            const docRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await updateDoc(docRef, updateData)

            // Update in local state
            const queueIndex = userQueues.value.findIndex(q => q.id === queueId)
            if (queueIndex !== -1) {
                userQueues.value[queueIndex] = { id: queueId, ...updateData, isOwner: true }
            }

            const allQueuesIndex = allQueues.value.findIndex(q => q.id === queueId)
            if (allQueuesIndex !== -1) {
                if (updateData.isVisible) {
                    allQueues.value[allQueuesIndex] = { id: queueId, ...updateData, isOwner: true }
                } else {
                    allQueues.value.splice(allQueuesIndex, 1)
                }
            } else if (updateData.isVisible) {
                allQueues.value.unshift({ id: queueId, ...updateData, isOwner: true })
            }

            console.log('✅ Queue updated successfully:', queueId)
            return userQueues.value[queueIndex]

        } catch (err) {
            console.error('❌ Failed to update queue:', err)
            error.value = `Failed to update queue: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const deleteQueue = async (queueId) => {
        const userId = mainStore.user?.id || mainStore.user?.uid

        // Check if user owns this queue
        const queue = userQueues.value.find(q => q.id === queueId)
        if (!queue || (queue.createdByUserId && queue.createdByUserId !== userId)) {
            throw new Error('You can only delete your own queues')
        }

        isSaving.value = true
        error.value = null

        try {
            console.log('🗑️ Deleting queue:', queueId)

            const docRef = doc(firestore, 'topheroes', 'general', 'queues', queueId)
            await deleteDoc(docRef)

            userQueues.value = userQueues.value.filter(q => q.id !== queueId)
            allQueues.value = allQueues.value.filter(q => q.id !== queueId)

            console.log('✅ Queue deleted successfully:', queueId)

        } catch (err) {
            console.error('❌ Failed to delete queue:', err)
            error.value = `Failed to delete queue: ${err.message}`
            throw err
        } finally {
            isSaving.value = false
        }
    }

    const canEditQueue = (queue) => {
        const userId = mainStore.user?.id || mainStore.user?.uid
        return userId &&
            (queue.createdByUserId === userId || queue.isOwner)
    }

    // Search and filter methods
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
        userQueues,
        allQueues,
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
        currentUserId,
        heroesCount,
        heroesByFaction,
        heroesByRarity,
        heroesByTag,
        visibleQueues,
        gearByType,
        relicsByType,

        // Data loading
        loadAll,
        fetchMetadata,
        fetchHeroes,
        fetchQueues,

        // Queue CRUD (user's own only)
        createQueue,
        updateQueue,
        deleteQueue,
        canEditQueue,

        // Search and filter
        searchHeroes,
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
        getFactionCounterData
    }
})