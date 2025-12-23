// stores/useGuildDataStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firestore } from '@/firebase'
import {
    collection,
    doc,
    getDoc,
    setDoc,
    getDocs,
    updateDoc,
    increment,
    writeBatch,
    serverTimestamp,
    query,
    orderBy,
    limit
} from 'firebase/firestore'

/**
 * Firestore Structure:
 * 
 * /topheroes/guilds (document)
 *   - totalDatasets: number
 *   - totalVersions: number
 *   - totalGuilds: number
 *   - totalEvents: number
 *   - lastUpdated: timestamp
 * 
 * /topheroes/guilds/datasets/{datasetId} (document)
 *   - name: string
 *   - timePeriod: { start: date, end: date }
 *   - guildCount: number
 *   - guildIds: string[]
 *   - eventType: string
 *   - versions: number
 *   - latestVersion: string
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *   - stats: { totalGvGWins, avgPower, etc. }
 * 
 * /topheroes/guilds/datasets/{datasetId}/versions/{versionId} (document)
 *   - guilds: array of guild data objects
 *   - metadata: { kvkGlobalSettings, etc. }
 *   - createdAt: timestamp
 *   - createdBy: string
 *   - changeLog: string
 *   - stats: computed stats
 * 
 * /topheroes/guilds/profiles/{guildId} (document)
 *   - name: string (most recent)
 *   - shorthand: string (most recent)
 *   - power: number (most recent)
 *   - datasetsAppeared: number
 *   - totalVersions: number
 *   - firstSeen: timestamp
 *   - lastSeen: timestamp
 *   - history: { datasetId, versionId, timestamp }[]
 * 
 * /topheroes/guilds/profiles/{guildId}/datasets/{datasetId}/versions/{versionId} (document)
 *   - name, shorthand, power, gvg data, kvk data, etc.
 *   - timestamp: timestamp
 */

export const useGuildDataStore = defineStore('guildData', () => {
    // State
    const currentDatasetId = ref('')
    const currentVersionId = ref('')
    const guilds = ref([])
    const datasets = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    // Computed
    const hasUnsavedChanges = computed(() => {
        // Compare current guilds with last saved version
        return true // Implement actual comparison logic
    })

    // Helper to generate version ID
    const generateVersionId = () => {
        return `v${Date.now()}`
    }

    // Helper to generate guild ID from shorthand
    const generateGuildId = (shorthand) => {
        return shorthand.toLowerCase().replace(/[^a-z0-9]/g, '')
    }

    // Helper to calculate GvG stats
    const calculateGvGStats = (guild) => {
        const totalScore = guild.gvgDays?.reduce((sum, day) => sum + (day.score || 0), 0) || 0
        const wins = guild.gvgDays?.filter(day => day.won).length || 0
        const losses = guild.gvgDays?.filter(day => !day.won && day.score !== null && day.score !== undefined).length || 0

        return { totalScore, wins, losses }
    }

    // Helper to calculate KvK stats
    const calculateKvKStats = (guild) => {
        const totalScore = guild.kvkPrepDays?.reduce((sum, day) => sum + (day.score || 0), 0) || 0
        const avgRank = guild.kvkPrepDays?.filter(day => day.rank !== null).length > 0
            ? guild.kvkPrepDays.filter(day => day.rank !== null).reduce((sum, day) => sum + day.rank, 0) /
            guild.kvkPrepDays.filter(day => day.rank !== null).length
            : null

        return { totalScore, avgRank }
    }

    // Helper to calculate stats
    const calculateDatasetStats = (guildsData) => {
        let totalGvGWins = 0
        let totalGvGLosses = 0
        let totalGvGScore = 0
        let totalKvKScore = 0
        const kvkRanks = []

        guildsData.forEach(guild => {
            // GvG stats
            const gvgStats = calculateGvGStats(guild)
            totalGvGWins += gvgStats.wins
            totalGvGLosses += gvgStats.losses
            totalGvGScore += gvgStats.totalScore

            // KvK stats
            const kvkStats = calculateKvKStats(guild)
            totalKvKScore += kvkStats.totalScore
            if (kvkStats.avgRank !== null) {
                kvkRanks.push(kvkStats.avgRank)
            }
        })

        const avgPower = guildsData.reduce((sum, g) => sum + (g.guildPower || 0), 0) / guildsData.length
        const maxPower = Math.max(...guildsData.map(g => g.guildPower || 0))
        const minPower = Math.min(...guildsData.map(g => g.guildPower || 0))

        const avgKvKRank = kvkRanks.length > 0
            ? kvkRanks.reduce((sum, r) => sum + r, 0) / kvkRanks.length
            : null

        return {
            guildCount: guildsData.length,
            totalGvGWins,
            totalGvGLosses,
            totalGvGScore,
            totalKvKScore,
            avgPower: Math.round(avgPower),
            maxPower,
            minPower,
            avgKvKRank: avgKvKRank ? avgKvKRank.toFixed(1) : null,
            hasGvGData: guildsData.some(g => g.gvgDays?.some(day => day.score !== null)),
            hasKvKData: guildsData.some(g => g.kvkPrepDays?.some(day => day.score !== null))
        }
    }

    /**
     * Load all available datasets (metadata only)
     */
    const loadDatasets = async () => {
        isLoading.value = true
        error.value = null

        try {
            const datasetsRef = collection(firestore, 'topheroes', 'guilds', 'datasets')
            const snapshot = await getDocs(datasetsRef)

            datasets.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            return datasets.value
        } catch (err) {
            console.error('Error loading datasets:', err)
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load a specific dataset version
     */
    const loadDatasetVersion = async (datasetId, versionId = null) => {
        isLoading.value = true
        error.value = null

        try {
            // Get dataset metadata
            const datasetRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId)
            const datasetSnap = await getDoc(datasetRef)

            if (!datasetSnap.exists()) {
                throw new Error('Dataset not found')
            }

            const datasetData = datasetSnap.data()

            // Use latest version if not specified
            const targetVersionId = versionId || datasetData.latestVersion

            if (!targetVersionId) {
                throw new Error('No versions available for this dataset')
            }

            // Load the version data
            const versionRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'versions', targetVersionId)
            const versionSnap = await getDoc(versionRef)

            if (!versionSnap.exists()) {
                throw new Error('Version not found')
            }

            const versionData = versionSnap.data()

            currentDatasetId.value = datasetId
            currentVersionId.value = targetVersionId
            guilds.value = versionData.guilds || []

            return {
                dataset: { id: datasetId, ...datasetData },
                version: {
                    id: targetVersionId,
                    ...versionData,
                    metadata: versionData.metadata || {}
                }
            }
        } catch (err) {
            console.error('Error loading dataset version:', err)
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Save a new version of a dataset
     */
    const saveDatasetVersion = async (datasetId, guildsData, metadata = {}) => {
        isLoading.value = true
        error.value = null

        try {
            const batch = writeBatch(firestore)
            const versionId = generateVersionId()
            const timestamp = new Date().toISOString()

            // Calculate stats
            const stats = calculateDatasetStats(guildsData)

            // Get unique guild IDs
            const guildIds = [...new Set(guildsData.map(g => generateGuildId(g.shorthand)))]

            // 1. Create/update dataset metadata
            const datasetRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId)
            const datasetSnap = await getDoc(datasetRef)
            const isNewDataset = !datasetSnap.exists()

            const datasetData = {
                name: metadata.name || datasetId,
                timePeriod: metadata.timePeriod || { start: timestamp, end: timestamp },
                eventType: metadata.eventType || 'mixed',
                guildCount: guildsData.length,
                guildIds: guildIds,
                latestVersion: versionId,
                updatedAt: timestamp,
                stats: stats,
                ...(isNewDataset && { createdAt: timestamp, versions: 0 })
            }

            batch.set(datasetRef, datasetData, { merge: true })

            // 2. Create version document
            const versionRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'versions', versionId)
            const versionData = {
                guilds: guildsData,
                metadata: {
                    ...metadata,
                    kvkGlobalSettings: metadata.kvkGlobalSettings || null
                },
                createdAt: timestamp,
                createdBy: metadata.createdBy || 'system',
                changeLog: metadata.changeLog || 'Dataset saved',
                stats: stats
            }

            batch.set(versionRef, versionData)

            // 3. Update guild profiles and their version data
            for (const guild of guildsData) {
                const guildId = generateGuildId(guild.shorthand)
                const guildProfileRef = doc(firestore, 'topheroes', 'guilds', 'profiles', guildId)
                const guildProfileSnap = await getDoc(guildProfileRef)

                const gvgStats = calculateGvGStats(guild)
                const kvkStats = calculateKvKStats(guild)

                if (!guildProfileSnap.exists()) {
                    // Create new guild profile
                    batch.set(guildProfileRef, {
                        name: guild.name,
                        shorthand: guild.shorthand,
                        power: guild.guildPower,
                        datasetsAppeared: 1,
                        totalVersions: 1,
                        firstSeen: timestamp,
                        lastSeen: timestamp,
                        history: [{
                            datasetId,
                            versionId,
                            timestamp
                        }]
                    })
                } else {
                    // Update existing guild profile
                    const existingData = guildProfileSnap.data()
                    batch.update(guildProfileRef, {
                        name: guild.name,
                        shorthand: guild.shorthand,
                        power: guild.guildPower,
                        totalVersions: increment(1),
                        lastSeen: timestamp,
                        history: [
                            ...(existingData.history || []),
                            { datasetId, versionId, timestamp }
                        ]
                    })
                }

                // Create version-specific guild data
                const guildVersionRef = doc(
                    firestore,
                    'topheroes', 'guilds', 'profiles', guildId,
                    'datasets', datasetId,
                    'versions', versionId
                )

                batch.set(guildVersionRef, {
                    ...guild,
                    gvgStats,
                    kvkStats,
                    timestamp
                })
            }

            // 4. Update aggregate statistics
            const aggregateRef = doc(firestore, 'topheroes', 'guilds')
            const aggregateSnap = await getDoc(aggregateRef)

            if (!aggregateSnap.exists()) {
                // Initialize aggregate document
                batch.set(aggregateRef, {
                    totalDatasets: 1,
                    totalVersions: 1,
                    totalGuilds: guildIds.length,
                    totalEvents: 1,
                    lastUpdated: timestamp
                })
            } else {
                // Update aggregate document
                const updateData = {
                    totalVersions: increment(1),
                    lastUpdated: timestamp
                }

                if (isNewDataset) {
                    updateData.totalDatasets = increment(1)
                }

                // Count new guilds
                const existingGuilds = aggregateSnap.data().totalGuilds || 0
                const newGuildsCount = guildIds.filter(async (id) => {
                    const guildRef = doc(firestore, 'topheroes', 'guilds', 'profiles', id)
                    const guildSnap = await getDoc(guildRef)
                    return !guildSnap.exists()
                }).length

                if (newGuildsCount > 0) {
                    updateData.totalGuilds = increment(newGuildsCount)
                }

                batch.update(aggregateRef, updateData)
            }

            // Increment dataset version count
            batch.update(datasetRef, { versions: increment(1) })

            // Commit all changes
            await batch.commit()

            currentDatasetId.value = datasetId
            currentVersionId.value = versionId
            guilds.value = guildsData

            return {
                datasetId,
                versionId,
                stats
            }
        } catch (err) {
            console.error('Error saving dataset version:', err)
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load guild history across all datasets
     */
    const loadGuildHistory = async (guildId) => {
        isLoading.value = true
        error.value = null

        try {
            const guildProfileRef = doc(firestore, 'topheroes', 'guilds', 'profiles', guildId)
            const guildProfileSnap = await getDoc(guildProfileRef)

            if (!guildProfileSnap.exists()) {
                throw new Error('Guild not found')
            }

            const profile = guildProfileSnap.data()

            // Load all datasets this guild appeared in
            const datasetsRef = collection(firestore, 'topheroes', 'guilds', 'profiles', guildId, 'datasets')
            const datasetsSnap = await getDocs(datasetsRef)

            const history = []

            for (const datasetDoc of datasetsSnap.docs) {
                const versionsRef = collection(datasetDoc.ref, 'versions')
                const versionsSnap = await getDocs(versionsRef)

                for (const versionDoc of versionsSnap.docs) {
                    history.push({
                        datasetId: datasetDoc.id,
                        versionId: versionDoc.id,
                        ...versionDoc.data()
                    })
                }
            }

            // Sort by timestamp
            history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

            return {
                profile: { id: guildId, ...profile },
                history
            }
        } catch (err) {
            console.error('Error loading guild history:', err)
            error.value = err.message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Load guild profile by shorthand (for autofill)
     */
    const loadGuildByShorthand = async (shorthand) => {
        try {
            const guildId = generateGuildId(shorthand)
            const guildProfileRef = doc(firestore, 'topheroes', 'guilds', 'profiles', guildId)
            const guildProfileSnap = await getDoc(guildProfileRef)

            if (guildProfileSnap.exists()) {
                return {
                    id: guildId,
                    ...guildProfileSnap.data()
                }
            }

            return null
        } catch (err) {
            console.error('Error loading guild by shorthand:', err)
            return null
        }
    }

    /**
     * Get all versions of a dataset
     */
    const getDatasetVersions = async (datasetId) => {
        try {
            const versionsRef = collection(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'versions')
            const q = query(versionsRef, orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (err) {
            console.error('Error getting dataset versions:', err)
            throw err
        }
    }

    /**
     * Get aggregate statistics
     */
    const getAggregateStats = async () => {
        try {
            const aggregateRef = doc(firestore, 'topheroes', 'guilds')
            const aggregateSnap = await getDoc(aggregateRef)

            if (aggregateSnap.exists()) {
                return aggregateSnap.data()
            }

            return {
                totalDatasets: 0,
                totalVersions: 0,
                totalGuilds: 0,
                totalEvents: 0,
                lastUpdated: null
            }
        } catch (err) {
            console.error('Error getting aggregate stats:', err)
            throw err
        }
    }

    /**
     * Delete a dataset version (soft delete - mark as archived)
     */
    const archiveDatasetVersion = async (datasetId, versionId) => {
        try {
            const versionRef = doc(firestore, 'topheroes', 'guilds', 'datasets', datasetId, 'versions', versionId)
            await updateDoc(versionRef, {
                archived: true,
                archivedAt: new Date().toISOString()
            })
        } catch (err) {
            console.error('Error archiving dataset version:', err)
            throw err
        }
    }

    /**
     * Search guilds by name or shorthand
     */
    const searchGuilds = async (searchTerm) => {
        try {
            const profilesRef = collection(firestore, 'topheroes', 'guilds', 'profiles')
            const snapshot = await getDocs(profilesRef)

            const results = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(guild =>
                    guild.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    guild.shorthand?.toLowerCase().includes(searchTerm.toLowerCase())
                )

            return results
        } catch (err) {
            console.error('Error searching guilds:', err)
            throw err
        }
    }

    return {
        // State
        currentDatasetId,
        currentVersionId,
        guilds,
        datasets,
        isLoading,
        error,

        // Computed
        hasUnsavedChanges,

        // Actions
        loadDatasets,
        loadDatasetVersion,
        saveDatasetVersion,
        loadGuildHistory,
        loadGuildByShorthand,
        getDatasetVersions,
        getAggregateStats,
        archiveDatasetVersion,
        searchGuilds,

        // Helpers
        generateGuildId,
        generateVersionId,
        calculateGvGStats,
        calculateKvKStats
    }
})