// @/services/eventAggregationService.js
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { clean } from '@/utils/cleanNumber'

/**
 * Calculates aggregate event statistics and player rankings
 * @param {Array} players - Array of player objects with score data
 * @param {Object} event - Event object containing event details
 * @returns {Object} Aggregated data including day totals, overall total, and ranked players
 */
export const calculateEventAggregates = (players, event) => {
    if (!players || players.length === 0) {
        return {
            dayTotals: { d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0 },
            overallTotal: 0,
            totalParticipants: 0,
            rankedPlayers: []
        }
    }

    // Calculate day totals
    const dayTotals = {
        d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0
    }

    // Calculate each player's total score and prepare for ranking
    const playersWithTotals = players.map(player => {
        const scores = {
            d1: clean(player.scoreD1),
            d2: clean(player.scoreD2),
            d3: clean(player.scoreD3),
            d4: clean(player.scoreD4),
            d5: clean(player.scoreD5),
            d6: clean(player.scoreD6)
        }

        // Add to day totals
        Object.keys(dayTotals).forEach(day => {
            dayTotals[day] += scores[day]
        })

        // Calculate player's overall score
        const playerTotal = Object.values(scores).reduce((sum, score) => sum + score, 0)

        return {
            ...player,
            calculatedTotal: playerTotal,
            dayScores: scores
        }
    })

    // Sort players by total score (highest first) and assign ranks
    const rankedPlayers = playersWithTotals
        .filter(player => player.calculatedTotal > 0) // Only rank players with scores
        .sort((a, b) => {
            // Primary sort: total score (descending)
            if (b.calculatedTotal !== a.calculatedTotal) {
                return b.calculatedTotal - a.calculatedTotal
            }

            // Secondary sort: by name (ascending) for tie-breaking
            return a.name.localeCompare(b.name)
        })
        .map((player, index) => ({
            ...player,
            calculatedRank: index + 1
        }))

    // Calculate overall event total
    const overallTotal = Object.values(dayTotals).reduce((sum, dayTotal) => sum + dayTotal, 0)

    return {
        dayTotals,
        overallTotal,
        totalParticipants: rankedPlayers.length,
        rankedPlayers,
        allPlayersWithTotals: playersWithTotals // Include unranked players for updates
    }
}

/**
 * Updates the main event document with aggregate statistics
 * @param {string} eventId - Event ID
 * @param {Object} aggregates - Calculated aggregates from calculateEventAggregates
 * @param {Object} event - Original event object
 */
export const updateEventAggregates = async (eventId, aggregates, event) => {
    try {
        const eventRef = doc(firestore, `topheroes/velaris/events/${eventId}`)

        const updateData = {
            // Day-by-day totals
            totalScoreD1: aggregates.dayTotals.d1,
            totalScoreD2: aggregates.dayTotals.d2,
            totalScoreD3: aggregates.dayTotals.d3,
            totalScoreD4: aggregates.dayTotals.d4,
            totalScoreD5: aggregates.dayTotals.d5,
            totalScoreD6: aggregates.dayTotals.d6,

            // Overall statistics
            totalScore: aggregates.overallTotal,
            totalParticipants: aggregates.totalParticipants,

            // Metadata
            lastAggregationUpdate: serverTimestamp(),
            aggregationEnteredBy: event.enteredBy || 'system',

            // Rankings summary (top 3 for quick reference)
            topPlayers: aggregates.rankedPlayers.slice(0, 3).map(player => ({
                id: player.id,
                name: player.name,
                rank: player.calculatedRank,
                score: player.calculatedTotal
            }))
        }

        await updateDoc(eventRef, updateData)

        return { success: true, aggregates: updateData }
    } catch (error) {
        console.error('Error updating event aggregates:', error)
        throw new Error(`Failed to update event aggregates: ${error.message}`)
    }
}

/**
 * Updates individual player documents with their calculated ranks
 * @param {Array} rankedPlayers - Array of players with calculated ranks
 * @param {string} eventId - Event ID
 */
export const updatePlayerRanks = async (rankedPlayers, eventId) => {
    const updatePromises = rankedPlayers.map(async (player) => {
        try {
            const playerEventRef = doc(firestore, `topheroes/velaris/members/${player.id}/events/${eventId}`)

            await updateDoc(playerEventRef, {
                calculatedRank: player.calculatedRank,
                calculatedTotal: player.calculatedTotal,
                lastRankUpdate: serverTimestamp()
            })

            return { success: true, playerId: player.id, rank: player.calculatedRank }
        } catch (error) {
            console.error(`Error updating rank for player ${player.id}:`, error)
            return { success: false, playerId: player.id, error: error.message }
        }
    })

    const results = await Promise.allSettled(updatePromises)

    const successful = results.filter(result =>
        result.status === 'fulfilled' && result.value.success
    ).length

    const failed = results.filter(result =>
        result.status === 'rejected' || !result.value.success
    ).length

    return {
        successful,
        failed,
        total: rankedPlayers.length,
        results: results.map(result => result.status === 'fulfilled' ? result.value : { success: false, error: result.reason })
    }
}

/**
 * Main function to calculate and save all event aggregates and rankings
 * @param {Array} players - Array of player objects
 * @param {Object} event - Event object
 * @param {string} eventId - Event ID
 */
export const processEventAggregation = async (players, event, eventId) => {
    try {
        // Calculate aggregates
        const aggregates = calculateEventAggregates(players, event)

        // Update main event document
        const eventUpdateResult = await updateEventAggregates(eventId, aggregates, event)

        // Update player ranks (only for players with scores)
        const rankUpdateResult = await updatePlayerRanks(aggregates.rankedPlayers, eventId)

        return {
            success: true,
            aggregates: aggregates,
            eventUpdate: eventUpdateResult,
            rankUpdates: rankUpdateResult,
            summary: {
                totalPlayers: players.length,
                rankedPlayers: aggregates.rankedPlayers.length,
                eventTotal: aggregates.overallTotal,
                successfulRankUpdates: rankUpdateResult.successful,
                failedRankUpdates: rankUpdateResult.failed
            }
        }
    } catch (error) {
        console.error('Error processing event aggregation:', error)
        throw error
    }
}