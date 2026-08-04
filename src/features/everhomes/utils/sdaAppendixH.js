export function getAppendixHBedroomCapacity(row) {
    const dwelling = String(row?.dwelling ?? '')
    const bedroomMatch = dwelling.match(/(\d+)\s+bedrooms?/i)
    if (bedroomMatch) return Number(bedroomMatch[1])

    const residentCapacity = Number(row?.maxResidents)
    return Number.isInteger(residentCapacity) && residentCapacity > 0
        ? residentCapacity
        : 0
}

export function getAppendixHParticipantLimit(row) {
    const bedroomCapacity = getAppendixHBedroomCapacity(row)
    if (bedroomCapacity < 1) return 0

    // The workbook still calculates a one-participant amount for one-bedroom /
    // one-resident dwelling types, so preserve that practical floor.
    return Math.max(1, bedroomCapacity - 1)
}

export function isValidAppendixHParticipantRow(row) {
    const participantCount = Number(row?.sdaEligibleCount)
    const limit = getAppendixHParticipantLimit(row)
    return Number.isInteger(participantCount)
        && participantCount >= 1
        && participantCount <= limit
}
