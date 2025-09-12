// src/stores/useKvKEventDataStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getInstanceByDom } from 'echarts/core'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useKvKEventDataStore = defineStore('kvkEventData', () => {
    // --- Raw and Meta ---
    const rawData = ref({})
    const eventMeta = ref({ eventName: '', byline: '', serverNames: {} })

    // --- Cache Management ---
    const lastFetchTime = ref(null)
    const cachedEventId = ref(null)
    const cacheExpiryTime = 15 * 60 * 1000 // 15 minutes
    const isLoading = ref(false)
    const loadError = ref(null)

    // --- Core Guild Data ---
    const guilds = ref([])
    const servers = ref([])
    const isLoaded = ref(false)

    // --- UI State ---
    const searchTerm = ref('')
    const sortField = ref('totalScore')
    const sortDirection = ref('desc')
    const activeServerFilters = ref(['all'])
    const activeDayFilters = ref([])
    const scoreFilter = ref({ operator: '', value: null })
    const itemsPerPage = ref(20)
    const page = ref(1)
    const summaryView = ref(true)
    const comparisonView = ref(false)
    const selectedComparisonGuilds = ref([])
    const maxComparisonGuilds = 10
    const comparisonSearchTerm = ref('')
    const comparisonFields = [
        { key: 'server', label: 'Server', fmt: v => v },
        { key: 'fullName', label: 'Full Name', fmt: v => v },
        { key: 'totalScore', label: 'Total Score', fmt: v => v.toLocaleString() },
        { key: 'totalRank', label: 'Total Rank', fmt: v => v || '-' },
        { key: 'averageDaily', label: 'Average Daily', fmt: v => Math.round(v).toLocaleString() }
    ]

    // Guild Color Map for comparisons
    const guildColorMap = computed(() => {
        const colours = Array.from({ length: 10 }, (_, i) => `var(--comparison-${i + 1})`)
        const map = {}
        selectedComparisonGuilds.value.forEach((g, i) => {
            map[g.shortCode] = colours[i % colours.length]
        })
        return map
    })

    // Highlighting functions for charts
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

    function getComparisonChart() {
        const dom = document.getElementById('kvkComparisonDailyChart')
        return dom ? getInstanceByDom(dom) : null
    }

    // --- Constants ---
    const ALL_DAYS = [1, 2, 3, 4, 5, 6]
    const dayTasks = {
        D1: 'Construction', D2: 'Research', D3: 'Rally',
        D4: 'Hero', D5: 'Training', D6: 'Combat'
    }

    // --- Cache Helper Functions ---
    const isCacheValid = (eventId) => {
        if (!lastFetchTime.value || !cachedEventId.value) return false
        if (cachedEventId.value !== eventId) return false
        return Date.now() - lastFetchTime.value < cacheExpiryTime
    }

    const clearCache = () => {
        rawData.value = {}
        guilds.value = []
        servers.value = []
        eventMeta.value = { eventName: '', byline: '', serverNames: {} }
        lastFetchTime.value = null
        cachedEventId.value = null
        isLoaded.value = false
    }

    // Generate fake data for development
    function generateFakeData() {
        const serverList = ['10154', '10155']
        const serverNames = {
            '10154': '154',
            '10155': '155'
        }

        const guildList = [
            { short: 'VLR', full: 'Velaris', server: '10154' },
            { short: 'TOP', full: 'Olympus', server: '10154' },
            { short: 'PHX', full: 'Phoenix Rising', server: '10154' },
            { short: 'DRG', full: 'Dragon Lords', server: '10154' },
            { short: 'STR', full: 'Storm Riders', server: '10154' },
            { short: 'ICE', full: 'Ice Crown', server: '10154' },
            { short: 'FIR', full: 'Fire Nation', server: '10154' },
            { short: 'THU', full: 'Thunder Hawks', server: '10154' },
            { short: 'WIN', full: 'Winter Wolves', server: '10154' },
            { short: 'GOL', full: 'Golden Eagles', server: '10154' },

            { short: 'SHA', full: 'Shadow Legion', server: '10155' },
            { short: 'BLA', full: 'Black Knights', server: '10155' },
            { short: 'CRI', full: 'Crimson Tide', server: '10155' },
            { short: 'INA', full: 'Iron Alliance', server: '10155' },
            { short: 'SKY', full: 'Sky Warriors', server: '10155' },
            { short: 'EAR', full: 'Earth Guardians', server: '10155' },
            { short: 'SIL', full: 'Silver Hunters', server: '10155' },
            { short: 'NIG', full: 'Night Raiders', server: '10155' },
            { short: 'ROS', full: 'Rose Guild', server: '10155' },
            { short: 'STO', full: 'Stone Fortress', server: '10155' }
        ]

        const guilds = {}
        const events = {
            "KvK-09-2025": {}
        }

        // Create guild entries
        guildList.forEach(guild => {
            guilds[guild.short] = {
                shortCode: guild.short,
                fullName: guild.full,
                server: guild.server
            }
        })

        // Generate daily scores for each guild with more realistic patterns
        ALL_DAYS.forEach(day => {
            events["KvK-09-2025"][`D${day}`] = {}
            guildList.forEach((guild, index) => {
                // Create server-based performance patterns
                const isServer154 = guild.server === '10154'

                // Base performance with server bias
                let baseScore = Math.floor(Math.random() * 300000000) + 100000000

                // Add server performance patterns
                if (isServer154) {
                    // Server 154 stronger on certain days
                    if ([1, 3, 5].includes(day)) {
                        baseScore *= 1.2 // 20% boost
                    }
                } else {
                    // Server 155 stronger on other days
                    if ([2, 4, 6].includes(day)) {
                        baseScore *= 1.15 // 15% boost
                    }
                }

                // Top guilds get consistent high scores
                if (index < 3) {
                    baseScore = Math.max(baseScore, 300000000)
                }

                events["KvK-09-2025"][`D${day}`][guild.short] = Math.floor(baseScore)
            })
        })

        return {
            guilds,
            events,
            eventMeta: {
                eventName: 'KvK September 2025',
                byline: 'Sep 1, 2025 - Sep 6, 2025',
                serverNames
            }
        }
    }

    // Load fake data for development
    function loadFakeData() {
        const fakeData = generateFakeData()
        loadKvKEvent(fakeData)
    }

    // Load KvK event data
    function loadKvKEvent(eventData) {
        rawData.value = eventData
        eventMeta.value = eventData.eventMeta || { eventName: '', byline: '', serverNames: {} }

        // Get the first (and likely only) event
        const eventKey = Object.keys(eventData.events)[0]
        const eventScores = eventData.events[eventKey]

        // Transform data into normalized guild format
        guilds.value = normalizeGuildData(eventData.guilds, eventScores)
        servers.value = calculateServerTotals(guilds.value)

        lastFetchTime.value = Date.now()
        isLoaded.value = true
    }

    // Normalize guild data similar to player normalization
    function normalizeGuildData(guildMeta, eventScores) {
        const normalizedGuilds = []

        Object.keys(guildMeta).forEach(shortCode => {
            const guild = guildMeta[shortCode]

            // Calculate daily scores and total
            const dailyScores = {}
            let totalScore = 0

            ALL_DAYS.forEach(day => {
                const score = eventScores[`D${day}`][shortCode] || 0
                dailyScores[`D${day}`] = score
                totalScore += score
            })

            normalizedGuilds.push({
                shortCode: guild.shortCode,
                fullName: guild.fullName,
                server: guild.server,
                totalScore,
                averageDaily: totalScore / 6,
                ...dailyScores
            })
        })

        // Sort by total score and add ranks
        return normalizedGuilds
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((guild, index) => ({
                ...guild,
                totalRank: index + 1
            }))
    }

    // Calculate server totals
    function calculateServerTotals(guilds) {
        const serverTotals = {}

        guilds.forEach(guild => {
            if (!serverTotals[guild.server]) {
                serverTotals[guild.server] = {
                    server: guild.server,
                    serverName: eventMeta.value.serverNames[guild.server] || guild.server,
                    totalScore: 0,
                    guildCount: 0,
                    guilds: [],
                    dailyTotals: {}
                }

                // Initialize daily totals
                ALL_DAYS.forEach(day => {
                    serverTotals[guild.server].dailyTotals[`D${day}`] = 0
                })
            }

            serverTotals[guild.server].totalScore += guild.totalScore
            serverTotals[guild.server].guildCount += 1
            serverTotals[guild.server].guilds.push(guild)

            // Add daily scores
            ALL_DAYS.forEach(day => {
                serverTotals[guild.server].dailyTotals[`D${day}`] += guild[`D${day}`]
            })
        })

        return Object.values(serverTotals).sort((a, b) => b.totalScore - a.totalScore)
    }

    // --- Basic Stats ---
    const totalGuilds = computed(() => guilds.value.length)
    const totalScoreOverall = computed(() => guilds.value.reduce((s, g) => s + g.totalScore, 0))
    const averageGuildScore = computed(() => {
        return guilds.value.length ? Math.round(totalScoreOverall.value / guilds.value.length) : 0
    })

    // Server stats
    const winningServer = computed(() => {
        return servers.value.length > 0 ? servers.value[0] : null
    })

    const serverScoreDifference = computed(() => {
        if (servers.value.length < 2) return 0
        return servers.value[0].totalScore - servers.value[1].totalScore
    })

    // --- ENHANCED INSIGHTS ---

    // Daily Battle Results Analysis
    const dailyBattleResults = computed(() => {
        if (servers.value.length < 2) {
            return {
                mostCompetitiveDay: 1,
                smallestMargin: 0,
                dailyWinners: [],
                competitivenessScore: 0
            }
        }

        const [server1, server2] = servers.value
        const dailyMargins = []
        const dailyWinners = []

        ALL_DAYS.forEach(day => {
            const score1 = server1.dailyTotals[`D${day}`] || 0
            const score2 = server2.dailyTotals[`D${day}`] || 0
            const margin = Math.abs(score1 - score2)
            const winner = score1 > score2 ? server1 : server2

            dailyMargins.push({ day, margin, winner })
            dailyWinners.push(winner.server)
        })

        const smallestMarginDay = dailyMargins.reduce((min, curr) =>
            curr.margin < min.margin ? curr : min
        )

        // Calculate overall competitiveness (lower margins = more competitive)
        const avgMargin = dailyMargins.reduce((sum, d) => sum + d.margin, 0) / dailyMargins.length
        const totalScore = server1.totalScore + server2.totalScore
        const competitivenessScore = Math.round((1 - (avgMargin / totalScore)) * 100)

        return {
            mostCompetitiveDay: smallestMarginDay.day,
            smallestMargin: smallestMarginDay.margin,
            dailyWinners,
            dailyMargins,
            competitivenessScore,
            avgDailyMargin: Math.round(avgMargin)
        }
    })

    // Server Balance Analysis
    const serverBalance = computed(() => {
        if (!winningServer.value || servers.value.length < 2) return 50

        const total = servers.value.reduce((sum, s) => sum + s.totalScore, 0)
        const winnerPercent = Math.round((winningServer.value.totalScore / total) * 100)
        return winnerPercent
    })

    // Daily Performance Swings
    const biggestDailySwing = computed(() => {
        if (servers.value.length < 2) {
            return { day: null, swing: 0, description: 'N/A' }
        }

        const [server1, server2] = servers.value
        let maxSwing = 0
        let swingDay = null
        let description = ''

        for (let day = 2; day <= 6; day++) {
            const prevDay = day - 1

            // Previous day margin
            const prevS1 = server1.dailyTotals[`D${prevDay}`] || 0
            const prevS2 = server2.dailyTotals[`D${prevDay}`] || 0
            const prevMargin = prevS1 - prevS2

            // Current day margin
            const currS1 = server1.dailyTotals[`D${day}`] || 0
            const currS2 = server2.dailyTotals[`D${day}`] || 0
            const currMargin = currS1 - currS2

            // Swing calculation (change in margin)
            const swing = Math.abs(currMargin - prevMargin)

            if (swing > maxSwing) {
                maxSwing = swing
                swingDay = day

                // Determine what happened
                if (prevMargin > 0 && currMargin < 0) {
                    description = `${server2.serverName} took the lead`
                } else if (prevMargin < 0 && currMargin > 0) {
                    description = `${server1.serverName} regained control`
                } else if (prevMargin > 0 && currMargin > prevMargin) {
                    description = `${server1.serverName} extended lead`
                } else if (prevMargin < 0 && currMargin < prevMargin) {
                    description = `${server2.serverName} extended lead`
                } else {
                    description = 'Major momentum shift'
                }
            }
        }

        return {
            day: swingDay,
            swing: Math.round(maxSwing),
            description
        }
    })

    // Guild Distribution Analysis
    const guildDistribution = computed(() => {
        if (!guilds.value.length) return {}

        const scoreRanges = [
            { min: 0, max: 500000000, label: '0-500M', guilds: [] },
            { min: 500000000, max: 1000000000, label: '500M-1B', guilds: [] },
            { min: 1000000000, max: 1500000000, label: '1B-1.5B', guilds: [] },
            { min: 1500000000, max: 2000000000, label: '1.5B-2B', guilds: [] },
            { min: 2000000000, max: Infinity, label: '2B+', guilds: [] }
        ]

        guilds.value.forEach(guild => {
            const range = scoreRanges.find(r =>
                guild.totalScore >= r.min && guild.totalScore < r.max
            )
            if (range) range.guilds.push(guild)
        })

        return {
            ranges: scoreRanges,
            topTierCount: scoreRanges[4].guilds.length + scoreRanges[3].guilds.length,
            lowPerformerCount: scoreRanges[0].guilds.length
        }
    })

    const prepStageAnalysis = computed(() => {
        if (servers.value.length < 2) {
            return {
                prepWinner: null,
                prepScore: { server1: 0, server2: 0 },
                prepDaysWon: { server1: 0, server2: 0 },
                warScore: { server1: 0, server2: 0 }
            }
        }
    
        const [server1, server2] = servers.value
        const prepDays = [1, 2, 3, 4, 5]
        const warDay = 6
        
        let prepScore1 = 0, prepScore2 = 0
        let prepDaysWon1 = 0, prepDaysWon2 = 0
        
        // Calculate prep stage (days 1-5)
        prepDays.forEach(day => {
            const score1 = server1.dailyTotals[`D${day}`] || 0
            const score2 = server2.dailyTotals[`D${day}`] || 0
            prepScore1 += score1
            prepScore2 += score2
            
            if (score1 > score2) prepDaysWon1++
            else if (score2 > score1) prepDaysWon2++
        })
        
        // War stage (day 6)
        const warScore1 = server1.dailyTotals[`D${warDay}`] || 0
        const warScore2 = server2.dailyTotals[`D${warDay}`] || 0
        
        const prepWinner = prepDaysWon1 > prepDaysWon2 ? server1 : 
                          prepDaysWon2 > prepDaysWon1 ? server2 : null
        
        return {
            prepWinner,
            prepScore: { server1: prepScore1, server2: prepScore2 },
            prepDaysWon: { server1: prepDaysWon1, server2: prepDaysWon2 },
            warScore: { server1: warScore1, server2: warScore2 },
            isDefending: prepWinner ? prepWinner.server === server1.server : null
        }
    })
    
    // 3. Add active participants calculation
    const activeParticipants = computed(() => {
        const minimumScore = 50000000 // 50M minimum to be considered "active"
        return guilds.value.filter(guild => guild.totalScore >= minimumScore).length
    })
    
    // 4. Fix performance consistency calculation
    const performanceConsistency = computed(() => {
        if (!guilds.value.length) return []
        
        const consistencyScores = guilds.value.map(guild => {
            const dailyScores = [1, 2, 3, 4, 5, 6].map(day => guild[`D${day}`] || 0)
            const nonZeroScores = dailyScores.filter(score => score > 0)
            
            if (nonZeroScores.length < 3) {
                return {
                    guild: guild.shortCode,
                    fullName: guild.fullName,
                    consistencyScore: 0,
                    averageDaily: 0
                }
            }
            
            const mean = nonZeroScores.reduce((sum, score) => sum + score, 0) / nonZeroScores.length
            const variance = nonZeroScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / nonZeroScores.length
            const stdDev = Math.sqrt(variance)
            
            // Coefficient of variation (lower is more consistent)
            const coefficientOfVariation = mean > 0 ? (stdDev / mean) : 1
            const consistencyScore = Math.max(0, Math.round((1 - coefficientOfVariation) * 100))
    
            return {
                guild: guild.shortCode,
                fullName: guild.fullName,
                consistencyScore: Math.min(100, consistencyScore),
                averageDaily: Math.round(mean)
            }
        })
    
        return consistencyScores
            .filter(item => item.consistencyScore > 0)
            .sort((a, b) => b.consistencyScore - a.consistencyScore)
    })

    // --- Day Management ---
    const allDays = computed(() => ALL_DAYS)
    const dayHasData = computed(() => {
        const map = {}
        ALL_DAYS.forEach(day => {
            map[day] = guilds.value.some(g => g[`D${day}`] > 0)
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

    // --- Guild Rankings ---
    const topGuilds = computed(() => {
        return [...guilds.value]
            .filter(g => g.totalScore > 0)
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10)
    })

    // --- Search & Filter ---
    const filteredData = computed(() => {
        let data = [...guilds.value]
        const term = searchTerm.value.trim().toLowerCase()

        if (term) {
            data = data.filter(g =>
                g.shortCode.toLowerCase().includes(term) ||
                g.fullName.toLowerCase().includes(term)
            )
        }

        if (!activeServerFilters.value.includes('all')) {
            data = data.filter(g => activeServerFilters.value.includes(g.server))
        }

        if (scoreFilter.value.operator && scoreFilter.value.value) {
            data = data.filter(g => {
                const days = activeDayFilters.value.length > 0 ? activeDayFilters.value : ALL_DAYS
                const totalScore = days.reduce((sum, d) => sum + (g[`D${d}`] || 0), 0)

                switch (scoreFilter.value.operator) {
                    case 'gte': return totalScore >= scoreFilter.value.value
                    case 'lte': return totalScore <= scoreFilter.value.value
                    case 'eq': return totalScore === scoreFilter.value.value
                    default: return true
                }
            })
        }

        return data
    })

    const processedFilteredData = computed(() => {
        const days = activeDayFilters.value.length ? activeDayFilters.value : ALL_DAYS
        return filteredData.value.map(g => {
            const score = days.reduce((s, d) => s + (g[`D${d}`] || 0), 0)
            return {
                ...g,
                dynamicTotalScore: score,
                dynamicTotalRank: 0,
            }
        }).sort((a, b) => b.dynamicTotalScore - a.dynamicTotalScore)
            .map((g, i) => ({ ...g, dynamicTotalRank: i + 1 }))
    })

    const filteredAndSortedData = computed(() => {
        const sorted = [...processedFilteredData.value]

        if (sortField.value) {
            sorted.sort((a, b) => {
                let valA = a[sortField.value]
                let valB = b[sortField.value]

                if (sortField.value === 'totalRank' || sortField.value === 'dynamicTotalRank') {
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

    // Filter functions
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

    const toggleServerFilter = (server) => toggleFilter(activeServerFilters, server)

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

    const updateScoreFilter = (filterObj) => {
        scoreFilter.value = filterObj
        page.value = 1
    }

    const clearAllFilters = () => {
        activeServerFilters.value = ['all']
        activeDayFilters.value = []
        scoreFilter.value = { operator: '', value: null }
        page.value = 1
    }

    const updateSort = field => {
        if (sortField.value === field) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortField.value = field
        }
        page.value = 1
    }

    // Comparison functionality
    function toggleGuildForComparison(guild) {
        const idx = selectedComparisonGuilds.value.findIndex(g => g.shortCode === guild.shortCode)
        const wasRemoval = idx > -1

        if (wasRemoval) {
            selectedComparisonGuilds.value.splice(idx, 1)
        } else {
            if (selectedComparisonGuilds.value.length >= maxComparisonGuilds) {
                alert(`Max ${maxComparisonGuilds} guilds allowed.`)
                return
            }
            selectedComparisonGuilds.value.push(guild)
        }
    }

    const addGuildToComparisonFromSearch = (guild) => {
        if (selectedComparisonGuilds.value.length >= maxComparisonGuilds) {
            alert(`Max ${maxComparisonGuilds} guilds allowed.`)
            return
        }
        selectedComparisonGuilds.value.push(guild)
        comparisonSearchTerm.value = ''
    }

    const filteredComparisonSearchResults = computed(() => {
        const term = comparisonSearchTerm.value.toLowerCase().trim()
        if (!term) return []

        return processedFilteredData.value.filter(g =>
            (g.shortCode.toLowerCase().includes(term) || g.fullName.toLowerCase().includes(term)) &&
            !selectedComparisonGuilds.value.some(sel => sel.shortCode === g.shortCode)
        )
    })

    const updateComparisonSearchTerm = (value) => {
        comparisonSearchTerm.value = value
    }

    function formatNumber(num, decimals = 0) {
        const number = Number(num)
        if (isNaN(number)) return '-'
        
        const absNumber = Math.abs(number)
        
        // Format large numbers with K/M/B suffixes
        if (absNumber >= 1e9) {
            return (number / 1e9).toFixed(decimals) + 'B'
        } else if (absNumber >= 1e6) {
            return (number / 1e6).toFixed(decimals) + 'M'
        } else if (absNumber >= 1e3) {
            return (number / 1e3).toFixed(decimals) + 'K'
        }
        
        return number.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })
    }

    // Force refresh function
    const forceRefresh = async (eventId) => {
        clearCache()
        // For now, just reload fake data
        loadFakeData()
    }

    return {
        // Data
        rawData, eventMeta, guilds, servers, isLoaded,

        // Cache & Loading
        isLoading, loadError, lastFetchTime, cachedEventId, isCacheValid, clearCache, forceRefresh,

        // Stats
        totalGuilds, totalScoreOverall, averageGuildScore, winningServer, serverScoreDifference,

        // ENHANCED INSIGHTS
        dailyBattleResults, serverBalance, guildDistribution, biggestDailySwing, performanceConsistency,

        // Days
        allDays, dayHasData, dayOptions,

        // Loaders
        loadKvKEvent, loadFakeData,

        // UI State
        searchTerm, sortField, sortDirection,
        activeServerFilters, activeDayFilters,
        page, itemsPerPage, paginatedData,
        prepStageAnalysis,
        activeParticipants,
        summaryView, comparisonView, selectedComparisonGuilds, comparisonSearchTerm, maxComparisonGuilds,

        // Computed data
        filteredData, filteredAndSortedData, processedFilteredData,

        // Actions
        toggleFilter, updateSort,
        topGuilds, formatNumber,
        toggleServerFilter, toggleDayFilter,
        scoreFilter, updateScoreFilter, clearAllFilters,
        toggleGuildForComparison, addGuildToComparisonFromSearch,
        updateComparisonSearchTerm, filteredComparisonSearchResults,

        // Comparison
        comparisonFields, guildColorMap, highlightSeries, downplaySeries
    }
}, {
    persist: {
        key: 'kvkEventDataStore',
        paths: ['rawData', 'eventMeta', 'guilds', 'servers', 'isLoaded', 'lastFetchTime', 'cachedEventId'],
        storage: localStorage
    }
})