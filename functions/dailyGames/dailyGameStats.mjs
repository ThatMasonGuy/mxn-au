function previousUTCDate(dateYYYYMMDD) {
    const [year, month, day] = dateYYYYMMDD.split('-').map(Number)
    const previous = new Date(Date.UTC(year, month - 1, day - 1))
    return previous.toISOString().slice(0, 10)
}

export function calculateDailyStreak(profile, outcome, playedUTC) {
    if (outcome !== 'win') return 0

    const priorStreak = Number.isFinite(profile?.currentStreak)
        ? Math.max(0, profile.currentStreak)
        : 0

    return profile?.lastPlayedUTC === previousUTCDate(playedUTC)
        ? priorStreak + 1
        : 1
}

export function hasRecordedDailyResult(profile, playedUTC) {
    return profile?.lastPlayedUTC === playedUTC
}

export function deriveFlagleOutcome(answers) {
    const correctCount = Array.isArray(answers)
        ? answers.filter(answer => answer?.correct === true).length
        : 0

    return {
        correctCount,
        outcome: correctCount === 5 ? 'win' : 'loss',
    }
}
