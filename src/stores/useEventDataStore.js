// src/stores/eventDataStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInstanceByDom } from 'echarts/core'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useEventDataStore = defineStore('eventData', () => {
    // --- Raw and Meta ---
    const rawData = ref([])
    const eventMeta = ref({ guildName: '', eventName: '', byline: '' })

    // --- Cache Management ---
    const lastFetchTime = ref(null)
    const cachedEventId = ref(null) // Track which event is cached
    const cacheExpiryTime = 15 * 60 * 1000 // 15 minutes in milliseconds
    const isLoading = ref(false)
    const loadError = ref(null)

    // --- Core Player Data ---
    const players = ref([])
    const isLoaded = ref(false)

    // --- UI State ---
    const searchTerm = ref('')
    const sortField = ref('dynamicTotalRank')
    const sortDirection = ref('asc')
    const activeRoleFilters = ref(['all'])
    const activeCastleFilters = ref(['all'])
    const activePowerFilters = ref(['all'])
    const activeDayFilters = ref([])
    const lowScoreFilter = ref(false)
    const itemsPerPage = ref(20)
    const page = ref(1)
    const summaryView = ref(true)
    const comparisonView = ref(false)
    const selectedComparisonPlayers = ref([])
    const maxComparisonPlayers = 10
    const comparisonSearchTerm = ref('')
    const comparisonFields = [
        { key: 'Power', label: 'Power', fmt: v => v.toLocaleString() },
        { key: 'Castle', label: 'Castle', fmt: v => v },
        { key: 'Role', label: 'Role', fmt: v => v },
        { key: 'Total Score', label: 'Total Score', fmt: v => v.toLocaleString() },
        { key: 'Total Rank', label: 'Total Rank', fmt: v => v || '-' },
        { key: 'scorePerPower', label: 'Score Per Power', fmt: v => formatNumber(v * 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
    ]

    // Player Color Map
    const playerColorMap = computed(() => {
        const colours = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
            '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
            '#bcbd22', '#17becf'
        ]
        const map = {}
        selectedComparisonPlayers.value.forEach((p, i) => {
            map[p.Player] = colours[i % colours.length]
        })
        return map
    })

    // Highlighting functions
    const highlightSeries = name => {
        const chart = getComparisonChart()
        if (!chart) return
        chart.dispatchAction({ type: 'downplay', seriesIndex: 'all' })
        chart.dispatchAction({ type: 'highlight', seriesName: name })
    }

    const downplaySeries = () => {
        const chart = getComparisonChart()
        if (!chart) return
        chart.dispatchAction({ type: 'downplay', seriesIndex: 'all' })
    }

    // Get chart DOM
    function getComparisonChart() {
        const dom = document.getElementById('playerComparisonDailyChart')
        return dom ? getInstanceByDom(dom) : null
    }

    // --- Constants ---
    const ALL_DAYS = [1, 2, 3, 4, 5, 6]
    const dayTasks = {
        D1: 'Construction', D2: 'Research', D3: 'Rally',
        D4: 'Hero', D5: 'Training', D6: 'Combat'
    }
    const comparisonColours = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ]

    // --- Cache Helper Functions ---
    const isCacheValid = (eventId) => {
        if (!lastFetchTime.value || !cachedEventId.value) return false
        if (cachedEventId.value !== eventId) return false // Different event
        return Date.now() - lastFetchTime.value < cacheExpiryTime
    }

    const clearCache = () => {
        rawData.value = []
        players.value = []
        eventMeta.value = { guildName: '', eventName: '', byline: '' }
        lastFetchTime.value = null
        cachedEventId.value = null
        isLoaded.value = false
    }

    // --- Firestore Loaders ---
    async function loadFromFirestore(eventId) {
        if (isLoading.value) return

        try {
            // Check if we have valid cached data for this specific event
            if (isLoaded.value && isCacheValid(eventId)) {
                console.log('Using cached event data for event:', eventId)
                return
            }

            // Clear cache if we're loading a different event
            if (cachedEventId.value && cachedEventId.value !== eventId) {
                console.log('Clearing cache - switching from event', cachedEventId.value, 'to', eventId)
                clearCache()
            }

            isLoading.value = true
            loadError.value = null

            // Fetch event metadata
            const eventDocRef = doc(firestore, 'topheroes', 'velaris', 'events', eventId)
            const eventDocSnap = await getDoc(eventDocRef)

            if (!eventDocSnap.exists()) {
                throw new Error('Event not found')
            }

            const eventData = eventDocSnap.data()

            // Update event metadata
            eventMeta.value = {
                guildName: eventData.guild || '',
                eventName: eventData.event || '',
                byline: formatDateRange(eventData.startDate, eventData.endDate) || ''
            }

            // Fetch all member event data with member profiles
            const memberEventData = await Promise.all(
                eventData.memberIds.map(async (memberId) => {
                    try {
                        // Fetch member profile for country and other base info
                        const memberDocRef = doc(firestore, 'topheroes', 'velaris', 'members', memberId)
                        const memberDocSnap = await getDoc(memberDocRef)

                        // Fetch member event data
                        const memberEventDocRef = doc(firestore, 'topheroes', 'velaris', 'members', memberId, 'events', eventId)
                        const memberEventDocSnap = await getDoc(memberEventDocRef)

                        if (memberEventDocSnap.exists()) {
                            const memberProfile = memberDocSnap.exists() ? memberDocSnap.data() : {}
                            const eventData = memberEventDocSnap.data()

                            // Merge member profile data with event data
                            return {
                                ...eventData,
                                // Add country from member profile
                                country: memberProfile.country || '',
                                // Add other member profile fields that might be useful
                                memberId: memberId
                            }
                        }
                        return null
                    } catch (error) {
                        console.warn(`Failed to fetch data for member ${memberId}:`, error)
                        return null
                    }
                })
            )

            // Filter out null entries and transform to expected format
            const validMemberData = memberEventData
                .filter(data => data !== null)
                .map(transformFirestoreToPlayerData)

            rawData.value = validMemberData
            players.value = normalizePlayerData(validMemberData)

            // Update cache timestamp and event ID
            lastFetchTime.value = Date.now()
            cachedEventId.value = eventId
            isLoaded.value = true

            console.log(`Loaded ${validMemberData.length} players from Firestore for event:`, eventId)

        } catch (error) {
            console.error('Failed to load event data from Firestore:', error)
            loadError.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    // Transform Firestore document format to expected player data format
    function transformFirestoreToPlayerData(firestoreDoc) {
        return {
            Player: firestoreDoc.player || '',
            Power: firestoreDoc.power || 0,
            Castle: firestoreDoc.castle || 0,
            Role: firestoreDoc.role || '',
            Country: firestoreDoc.country || '', // Now populated from member profile
            'Score (D1)': firestoreDoc.scoreD1 || 0,
            'Score (D2)': firestoreDoc.scoreD2 || 0,
            'Score (D3)': firestoreDoc.scoreD3 || 0,
            'Score (D4)': firestoreDoc.scoreD4 || 0,
            'Score (D5)': firestoreDoc.scoreD5 || 0,
            'Score (D6)': firestoreDoc.scoreD6 || 0,
            // Additional fields that might be useful
            notes: firestoreDoc.notes || '',
            enteredBy: firestoreDoc.enteredBy || '',
            playerId: firestoreDoc.playerId || '',
            memberId: firestoreDoc.memberId || ''
        }
    }

    // Keep the original loadEvent function for backwards compatibility
    function loadEvent(eventJson) {
        const base = Array.isArray(eventJson) ? eventJson[0] : eventJson
        rawData.value = base.Players || []
        eventMeta.value.guildName = base.Guild || base.guildName || ''
        eventMeta.value.eventName = base.Event || base.eventName || ''
        eventMeta.value.byline = base.Byline || base.byline || ''
        players.value = normalizePlayerData(rawData.value)
        lastFetchTime.value = Date.now()
        cachedEventId.value = null // JSON loads don't have event IDs
        isLoaded.value = true
    }

    function formatDateRange(startDate, endDate) {
        if (!startDate || !endDate) return ''

        try {
            // Convert Firestore timestamps to Date objects
            const start = startDate.toDate ? startDate.toDate() : new Date(startDate)
            const end = endDate.toDate ? endDate.toDate() : new Date(endDate)

            // Format dates as readable strings
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }

            const startStr = start.toLocaleDateString('en-US', options)
            const endStr = end.toLocaleDateString('en-US', options)

            return `${startStr} - ${endStr}`
        } catch (error) {
            console.warn('Error formatting date range:', error)
            return ''
        }
    }

    function normalizePlayerData(data) {
        return data.map(p => {
            const power = p.Power || 0
            const castle = Number(p.Castle) || 0
            const total = ALL_DAYS.reduce((sum, d) => sum + (Number(p[`Score (D${d})`]) || 0), 0)

            return {
                ...p,
                Country: p.Country || '',
                Power: power,
                Castle: castle,
                'Total Score': total,
                scorePerPower: power > 0 ? total / power : 0,
                ...ALL_DAYS.reduce((acc, d) => ({
                    ...acc,
                    [`Score (D${d})`]: Number(p[`Score (D${d})`]) || 0
                }), {})
            }
        })
            .sort((a, b) => b['Total Score'] - a['Total Score'])
            .map((p, i) => ({ ...p, 'Total Rank': i + 1 }))
    }

    // --- Basic Stats ---
    const totalPlayers = computed(() => players.value.length)
    const activePlayers = computed(() => players.value.filter(p => p['Total Score'] > 0).length)
    const totalScoreOverall = computed(() => players.value.reduce((s, p) => s + (p['Total Score'] || 0), 0))
    const averagePower = computed(() => {
        const total = players.value.reduce((s, p) => s + (p.Power || 0), 0)
        return players.value.length ? (total / players.value.length).toFixed(1) : 0
    })
    const averageCastle = computed(() => {
        const total = players.value.reduce((s, p) => s + (p.Castle || 0), 0)
        return players.value.length ? Math.round(total / players.value.length) : 0
    })

    // --- Day Management ---
    const allDays = computed(() => ALL_DAYS)
    const daysWithData = computed(() => ALL_DAYS.filter(day => players.value.some(p => p[`Score (D${day})`] > 0)))
    const dayHasData = computed(() => {
        const map = {}
        ALL_DAYS.forEach(day => {
            map[day] = players.value.some(p => p[`Score (D${day})`] > 0)
        })
        return map
    })

    const dayOptions = computed(() => [
        { label: 'All Days', value: 'all', disabled: false },
        ...ALL_DAYS.map(day => ({
            label: `Day ${day}`,
            value: day,
            disabled: !dayHasData.value[day]
        }))
    ])

    // --- Player Rankings ---
    const topPerformers = computed(() => {
        return [...players.value]
            .filter(p => p['Total Score'] > 0)
            .sort((a, b) => b['Total Score'] - a['Total Score'])
            .slice(0, 10)
    })

    const efficiencyLeaders = computed(() => {
        return [...players.value]
            .filter(p => p['Total Score'] > 0 && p.Power > 0)
            .sort((a, b) => b.scorePerPower - a.scorePerPower)
            .slice(0, 10)
    })

    // --- Search & Filter ---
    const filteredData = computed(() => {
        let data = [...players.value]
        const term = searchTerm.value.trim().toLowerCase()

        if (term) data = data.filter(p => p.Player.toLowerCase().includes(term))
        if (!activeRoleFilters.value.includes('all')) data = data.filter(p => activeRoleFilters.value.includes(p.Role))
        if (!activeCastleFilters.value.includes('all')) data = data.filter(p => {
            const lv = p.Castle
            return activeCastleFilters.value.some(f => {
                if (f === '30-35') return lv >= 30 && lv <= 35
                if (f === '36-40') return lv >= 36 && lv <= 40
                if (f === '41-45') return lv >= 41 && lv <= 45
                if (f === '46-50') return lv >= 46 && lv <= 50
                if (f === '51+') return lv >= 51
            })
        })
        if (!activePowerFilters.value.includes('all')) data = data.filter(p => {
            const pow = p.Power
            return activePowerFilters.value.some(f => {
                if (f === '0-25M') return pow < 25000000
                if (f === '25-50M') return pow >= 25000000 && pow < 50000000
                if (f === '50-75M') return pow >= 50000000 && pow < 75000000
                if (f === '75-100M') return pow >= 75000000 && pow < 100000000
                if (f === '100M+') return pow >= 100000000
            })
        })
        if (lowScoreFilter.value) {
            data = data.filter(p => {
                const days = activeDayFilters.value.length > 0 ? activeDayFilters.value : ALL_DAYS
                return days.some(d => (p[`Score (D${d})`] || 0) < 1_000_000)
            })
        }

        return data
    })

    const processedFilteredData = computed(() => {
        const days = activeDayFilters.value.length ? activeDayFilters.value : ALL_DAYS
        return filteredData.value.map(p => {
            const score = days.reduce((s, d) => s + (p[`Score (D${d})`] || 0), 0)
            return {
                ...p,
                dynamicTotalScore: score,
                dynamicTotalRank: 0,
                scorePerPower: p.Power > 0 ? score / p.Power : 0
            }
        }).sort((a, b) => b.dynamicTotalScore - a.dynamicTotalScore)
            .map((p, i) => ({ ...p, dynamicTotalRank: i + 1 }))
    })

    const averagePlayer = computed(() => {
        const activePlayers = players.value.filter(p => p['Total Score'] > 0)
        if (!activePlayers.length) return null

        const avg = (field) => activePlayers.reduce((sum, p) => sum + (Number(p[field]) || 0), 0) / activePlayers.length

        return {
            Player: 'Average Player',
            Power: Number(avg('Power')),
            Castle: Math.round(avg('Castle')),
            Role: 'N/A',
            Country: 'N/A',
            'Total Score': Math.round(avg('Total Score')),
            scorePerPower: Number(avg('scorePerPower')),
            'Total Rank': 0,
            ...ALL_DAYS.reduce((acc, day) => ({
                ...acc,
                [`Score (D${day})`]: Math.round(avg(`Score (D${day})`))
            }), {})
        }
    })

    function togglePlayerForComparison(player) {
        const idx = selectedComparisonPlayers.value.findIndex(p => p.Player === player.Player)
        const wasRemoval = idx > -1

        if (wasRemoval) {
            selectedComparisonPlayers.value.splice(idx, 1)
        } else {
            if (selectedComparisonPlayers.value.length >= maxComparisonPlayers) {
                alert(`Max ${maxComparisonPlayers} players.`)
                return
            }
            selectedComparisonPlayers.value.push(player)

            // Add Average Player if it's first real player
            const realCount = selectedComparisonPlayers.value.filter(p => p.Player !== 'Average Player').length
            const avgPresent = selectedComparisonPlayers.value.some(p => p.Player === 'Average Player')

            if (realCount === 1 && !avgPresent) {
                selectedComparisonPlayers.value.push(averagePlayer.value)
            }
        }
    }

    const addPlayerToComparisonFromSearch = (player) => {
        if (selectedComparisonPlayers.value.length >= maxComparisonPlayers) {
            alert(`Max ${maxComparisonPlayers} players allowed.`)
            return
        }
        selectedComparisonPlayers.value.push(player)
        comparisonSearchTerm.value = ''
    }

    const filteredAndSortedData = computed(() => {
        const sorted = [...processedFilteredData.value]

        if (sortField.value) {
            sorted.sort((a, b) => {
                let valA = a[sortField.value]
                let valB = b[sortField.value]

                if (sortField.value === 'dynamicTotalRank') {
                    return sortDirection.value === 'asc' ? valA - valB : valB - valA
                }
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortDirection.value === 'asc'
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA)
                }
                return sortDirection.value === 'asc' ? valA - valB : valB - valA
            })
        }

        return sorted
    })

    const paginatedData = computed(() => {
        const start = (page.value - 1) * itemsPerPage.value
        return filteredAndSortedData.value.slice(start, start + itemsPerPage.value)
    })

    const toggleFilter = (filterRef, value) => {
        const filters = filterRef.value
        if (value === 'all') {
            filterRef.value = ['all']
        } else if (filters.includes(value)) {
            filters.splice(filters.indexOf(value), 1)
            if (!filters.length) filterRef.value = ['all']
        } else {
            if (filters.includes('all')) filters.splice(filters.indexOf('all'), 1)
            filters.push(value)
        }
    }

    const toggleRoleFilter = (role) => toggleFilter(activeRoleFilters, role)
    const toggleCastleFilter = (castle) => toggleFilter(activeCastleFilters, castle)
    const togglePowerFilter = (power) => toggleFilter(activePowerFilters, power)
    const toggleDayFilter = (day) => {
        if (day === 'all') {
            activeDayFilters.value = []
        } else {
            const idx = activeDayFilters.value.indexOf(day)
            if (idx > -1) {
                activeDayFilters.value.splice(idx, 1)
            } else {
                activeDayFilters.value.push(day)
                activeDayFilters.value.sort((a, b) => a - b)
            }
        }
        page.value = 1
    }

    const toggleLowScoreFilter = () => {
        lowScoreFilter.value = !lowScoreFilter.value
        page.value = 1
    }

    const updateSort = field => {
        if (sortField.value === field) sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        else sortField.value = field
        console.log('Updating sort:', sortField.value, sortDirection.value)
        page.value = 1
    }

    const filteredComparisonSearchResults = computed(() => {
        const term = comparisonSearchTerm.value.toLowerCase().trim()
        if (!term) return []

        // Build the full search pool
        let pool = [...processedFilteredData.value]
        if (averagePlayer.value) pool.push(averagePlayer.value)

        return pool.filter(p =>
            p.Player.toLowerCase().includes(term) &&
            !selectedComparisonPlayers.value.some(sel => sel.Player === p.Player)
        )
    })

    const updateComparisonSearchTerm = (value) => {
        comparisonSearchTerm.value = value
    }

    function formatNumber(num, decimals = 0) {
        const number = Number(num);
        if (isNaN(number)) return '-';
        return number.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    // Force refresh function to bypass cache
    const forceRefresh = async (eventId) => {
        clearCache()
        await loadFromFirestore(eventId)
    }

    return {
        // Data
        rawData, eventMeta, players, isLoaded,

        // Cache & Loading
        isLoading, loadError, lastFetchTime, cachedEventId, isCacheValid, clearCache, forceRefresh,

        // Stats
        totalPlayers, activePlayers, totalScoreOverall, averagePower, averageCastle,

        // Days
        allDays, daysWithData, dayHasData, dayOptions,

        // Loaders
        loadFromFirestore, loadEvent,

        // UI State
        searchTerm, sortField, sortDirection,
        activeRoleFilters, activeCastleFilters, activePowerFilters, activeDayFilters,
        lowScoreFilter, page, itemsPerPage, paginatedData,
        summaryView, comparisonView, selectedComparisonPlayers, comparisonSearchTerm, maxComparisonPlayers,

        // Computed data
        filteredData, filteredAndSortedData,

        // Actions
        toggleFilter, updateSort,
        topPerformers, efficiencyLeaders, formatNumber,
        toggleRoleFilter, toggleCastleFilter, togglePowerFilter, toggleDayFilter, toggleLowScoreFilter,
        togglePlayerForComparison, addPlayerToComparisonFromSearch,
        updateComparisonSearchTerm, filteredComparisonSearchResults,

        // Comparison
        comparisonFields, playerColorMap, highlightSeries, downplaySeries, averagePlayer
    }
}, {
    persist: {
        key: 'eventDataStore',
        paths: ['rawData', 'eventMeta', 'players', 'isLoaded', 'lastFetchTime', 'cachedEventId'],
        storage: localStorage
    }
})