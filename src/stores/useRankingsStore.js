// useRankingsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useRankingsStore = defineStore('rankings', () => {
    // State
    const members = ref([])
    const memberEvents = ref({}) // { memberId: [events] }
    const gvgEvents = ref([])
    const isLoading = ref(false)
    const loadError = ref(null)
    const lastFetchTime = ref(null)
    const cacheExpiryTime = 30 * 60 * 1000 // 30 minutes

    // Cache management
    const isCacheValid = computed(() => {
        if (!lastFetchTime.value) return false
        return Date.now() - lastFetchTime.value < cacheExpiryTime
    })

    // Current active/inactive members (excludes left/kicked)
    const currentMembers = computed(() =>
        members.value.filter(m => m.status === 'active' || m.status === 'inactive')
    )

    // Load all data
    const loadRankingsData = async (forceRefresh = false) => {
        if (!forceRefresh && isCacheValid.value && members.value.length > 0) {
            console.log('Using cached rankings data')
            return
        }

        isLoading.value = true
        loadError.value = null

        try {
            // Load all members
            const membersSnapshot = await getDocs(collection(firestore, 'topheroes/velaris/members'))
            const membersData = []

            for (const memberDoc of membersSnapshot.docs) {
                const memberData = {
                    id: memberDoc.id,
                    ...memberDoc.data()
                }

                // Growth calc
                if (memberData.history && memberData.history.length > 0) {
                    const sortedHistory = [...memberData.history].sort((a, b) => {
                        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
                        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
                        return dateA - dateB
                    })

                    memberData.earliestPower = sortedHistory[0].power || 0
                    memberData.latestPower =
                        sortedHistory[sortedHistory.length - 1].power || memberData.power || 0
                    memberData.powerGrowth = memberData.latestPower - memberData.earliestPower
                    memberData.powerGrowthPercent =
                        memberData.earliestPower > 0
                            ? ((memberData.powerGrowth / memberData.earliestPower) * 100).toFixed(1)
                            : 0
                } else {
                    memberData.earliestPower = memberData.power || 0
                    memberData.latestPower = memberData.power || 0
                    memberData.powerGrowth = 0
                    memberData.powerGrowthPercent = 0
                }

                membersData.push(memberData)

                // Member's events
                const eventsSnapshot = await getDocs(
                    collection(firestore, `topheroes/velaris/members/${memberDoc.id}/events`)
                )
                const events = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                memberEvents.value[memberDoc.id] = events
            }

            members.value = membersData

            // Load GvG events (catalog)
            const gvgSnapshot = await getDocs(
                query(collection(firestore, 'topheroes/velaris/events'), where('type', '==', 'GvG'))
            )
            gvgEvents.value = gvgSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            // Aggregate stats per member
            members.value = members.value.map(member => {
                const events = memberEvents.value[member.id] || []

                // GvG-only events for this member (define FIRST)
                const memberGvgEvents = events.filter(e => {
                    const eventData = gvgEvents.value.find(gvg => gvg.id === e.eventId)
                    return eventData?.type === 'GvG'
                })

                // Totals (define BEFORE using)
                const totalGvGScore = memberGvgEvents.reduce((sum, event) => {
                    const eventScore =
                        (event.scoreD1 || 0) + (event.scoreD2 || 0) +
                        (event.scoreD3 || 0) + (event.scoreD4 || 0) +
                        (event.scoreD5 || 0) + (event.scoreD6 || 0)
                    return sum + eventScore
                }, 0)

                const gvgAvgScore =
                    memberGvgEvents.length > 0 ? Math.round(totalGvGScore / memberGvgEvents.length) : 0

                // Total across all events
                const totalEventScore = events.reduce((sum, event) => {
                    const eventScore =
                        (event.scoreD1 || 0) + (event.scoreD2 || 0) +
                        (event.scoreD3 || 0) + (event.scoreD4 || 0) +
                        (event.scoreD5 || 0) + (event.scoreD6 || 0)
                    return sum + eventScore
                }, 0)

                // Performance by day
                const dayPerformance = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 }
                events.forEach(event => {
                    dayPerformance.D1 += event.scoreD1 || 0
                    dayPerformance.D2 += event.scoreD2 || 0
                    dayPerformance.D3 += event.scoreD3 || 0
                    dayPerformance.D4 += event.scoreD4 || 0
                    dayPerformance.D5 += event.scoreD5 || 0
                    dayPerformance.D6 += event.scoreD6 || 0
                })

                const bestDay = Object.entries(dayPerformance).reduce(
                    (best, [day, score]) => (score > best.score ? { day, score } : best),
                    { day: 'D1', score: 0 }
                )

                // Participation: % of GvG events they showed up to
                const participationRate =
                    gvgEvents.value.length > 0
                        ? (memberGvgEvents.length / gvgEvents.value.length) * 100
                        : 0

                const avgEventScore = events.length > 0 ? totalEventScore / events.length : 0
                const activityScore = Math.round(
                    (participationRate * 0.3) + (Math.min(avgEventScore / 10000, 100) * 0.7)
                )

                const contributionScore = Math.round(
                    (totalEventScore / 1_000_000) +            // Score contribution
                    (member.powerGrowth / 1_000_000) +        // Growth contribution
                    (participationRate * 2)                   // Participation contribution
                )

                return {
                    ...member,
                    totalEventScore,
                    totalGvGScore,
                    gvgAvgScore,
                    dayPerformance,
                    bestDay: bestDay.day,
                    bestDayScore: bestDay.score,
                    eventCount: events.length,
                    gvgCount: memberGvgEvents.length,
                    participationRate: Math.round(participationRate),
                    activityScore,
                    contributionScore,
                    avgEventScore: Math.round(avgEventScore)
                }
            })

            lastFetchTime.value = Date.now()
            console.log(`Loaded rankings data for ${members.value.length} members`)
        } catch (error) {
            console.error('Failed to load rankings data:', error)
            loadError.value = error.message
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // Computed rankings
    const powerRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active')
            .sort((a, b) => (b.power || 0) - (a.power || 0))
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    const growthRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active' && m.powerGrowth !== undefined)
            .sort((a, b) => b.powerGrowth - a.powerGrowth)
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    const activityRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active')
            .sort((a, b) => (b.activityScore || 0) - (a.activityScore || 0))
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    const gvgRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active')
            .sort((a, b) => (b.totalGvGScore || 0) - (a.totalGvGScore || 0))
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    const gvgAverageRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active')
            .filter(m => (m.gvgCount || 0) > 0)
            .sort((a, b) => (b.gvgAvgScore || 0) - (a.gvgAvgScore || 0))
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    const contributionRanking = computed(() =>
        [...members.value]
            .filter(m => m.status === 'active')
            .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
            .map((m, i) => ({ ...m, rank: i + 1, change: 0 }))
    )

    // Day performance rankings
    const dayRankings = computed(() => {
        const rankings = {}
        const days = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']

        days.forEach(day => {
            rankings[day] = [...members.value]
                .filter(m => m.status === 'active' && m.dayPerformance && m.dayPerformance[day] > 0)
                .sort((a, b) => (b.dayPerformance[day] || 0) - (a.dayPerformance[day] || 0))
                .slice(0, 10)
                .map((member, index) => ({
                    ...member,
                    rank: index + 1,
                    score: member.dayPerformance[day]
                }))
        })

        return rankings
    })

    // Weekly heroes
    const weeklyHeroes = computed(() => {
        const heroes = []

        if (growthRanking.value.length > 0) {
            const topGrowth = growthRanking.value[0]
            if (topGrowth.powerGrowth > 0) {
                heroes.push({
                    id: topGrowth.id,
                    name: topGrowth.name,
                    achievement: `Biggest Growth +${topGrowth.powerGrowthPercent}%`
                })
            }
        }

        if (activityRanking.value.length > 0) {
            const mostActive = activityRanking.value[0]
            if (mostActive.activityScore > 0) {
                heroes.push({
                    id: mostActive.id,
                    name: mostActive.name,
                    achievement: `Most Active (${mostActive.participationRate}% participation)`
                })
            }
        }

        if (gvgRanking.value.length > 0) {
            const gvgChamp = gvgRanking.value[0]
            if (gvgChamp.totalGvGScore > 0) {
                heroes.push({
                    id: gvgChamp.id,
                    name: gvgChamp.name,
                    achievement: `GvG Champion (${formatNumber(gvgChamp.totalGvGScore)} pts)`
                })
            }
        }

        if (contributionRanking.value.length > 0) {
            const topContributor = contributionRanking.value[0]
            heroes.push({ id: topContributor.id, name: topContributor.name, achievement: 'Top Contributor' })
        }

        return heroes.slice(0, 4)
    })

    // Insights - now using only current members (active/inactive)
    const insights = computed(() => {
        const insights = []

        if (currentMembers.value.length > 0) {
            const avgGrowth =
                currentMembers.value.reduce((sum, m) => sum + (m.powerGrowth || 0), 0) / currentMembers.value.length
            const growthPercent = ((avgGrowth / 1000000) * 100).toFixed(1)
            insights.push({
                icon: 'TrendingUp',
                color: 'velaris-green',
                text: `Guild growth rate averaged ${growthPercent}% this period`
            })

            const activeMembers = currentMembers.value.filter(m => m.eventCount > 0).length
            const participationPercent = Math.round((activeMembers / currentMembers.value.length) * 100)
            insights.push({
                icon: 'Users',
                color: 'velaris-teal',
                text: `${participationPercent}% of current members actively participated in events`
            })

            const topMembers = Math.ceil(currentMembers.value.length * 0.1)
            const topPower = powerRanking.value
                .slice(0, topMembers)
                .reduce((sum, m) => sum + (m.power || 0), 0)
            const totalCurrentPower = currentMembers.value.reduce((sum, m) => sum + (m.power || 0), 0)
            const topPercent = Math.round((topPower / totalCurrentPower) * 100)
            insights.push({
                icon: 'Target',
                color: 'velaris-amber',
                text: `Top ${topMembers} members carry ${topPercent}% of guild power`
            })

            const dayTotals = {}
            currentMembers.value.forEach(m => {
                if (m.dayPerformance) {
                    Object.entries(m.dayPerformance).forEach(([day, score]) => {
                        dayTotals[day] = (dayTotals[day] || 0) + score
                    })
                }
            })
            const bestOverallDay = Object.entries(dayTotals).reduce(
                (best, [day, score]) => (score > best.score ? { day, score } : best),
                { day: 'D1', score: 0 }
            )
            const dayNames = { D1: 'Construction', D2: 'Research', D3: 'Rally', D4: 'Hero', D5: 'Training', D6: 'Combat' }
            insights.push({
                icon: 'Activity',
                color: 'velaris-purple',
                text: `Guild performs best on ${dayNames[bestOverallDay.day]} tasks`
            })
        }

        return insights
    })

    const guildStats = computed(() => {
        const totalPower = currentMembers.value.reduce((sum, m) => sum + (m.power || 0), 0)
        const avgPower = currentMembers.value.length > 0 ? totalPower / currentMembers.value.length : 0
        const totalGrowth = currentMembers.value.reduce((sum, m) => sum + (m.powerGrowth || 0), 0)
        const growthPercent = totalPower > 0 ? ((totalGrowth / totalPower) * 100).toFixed(1) : 0
        const avgActivity =
            currentMembers.value.reduce((sum, m) => sum + (m.activityScore || 0), 0) / Math.max(currentMembers.value.length, 1)
        
        // Calculate average participation rate across current members
        const avgParticipationRate = currentMembers.value.length > 0 
            ? currentMembers.value.reduce((sum, m) => sum + (m.participationRate || 0), 0) / currentMembers.value.length 
            : 0
    
        return {
            totalMembers: members.value.length, // Keep total count including left/kicked for tracking
            currentMembers: currentMembers.value.length, // Current active/inactive count
            totalPower,
            avgPower,
            totalGrowth,
            growthPercent,
            avgActivity: Math.round(avgActivity * 10),
            participationRate: Math.round(avgParticipationRate) // Average participation rate as percentage
        }
    })

    // Helpers
    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
        return num.toString()
    }

    const forceRefresh = () => loadRankingsData(true)

    return {
        // State
        members,
        memberEvents,
        gvgEvents,
        isLoading,
        loadError,
        lastFetchTime,
        isCacheValid,

        // Computed
        currentMembers,

        // Methods
        loadRankingsData,
        forceRefresh,
        formatNumber,

        // Rankings
        powerRanking,
        growthRanking,
        activityRanking,
        gvgRanking,
        gvgAverageRanking,
        contributionRanking,
        dayRankings,

        // Generated
        weeklyHeroes,
        insights,
        guildStats
    }
}, {
    persist: {
        key: 'rankingsStore',
        paths: ['members', 'memberEvents', 'gvgEvents', 'lastFetchTime'],
        storage: localStorage
    }
})