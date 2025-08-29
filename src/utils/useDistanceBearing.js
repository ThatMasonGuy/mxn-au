// utils/useDistanceBearing.js
import { getCountryCoordinates } from './useCountryCoords'

// Convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

// Convert radians to degrees
function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

// Calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return Math.round(R * c) // Distance in kilometers
}

// Calculate the bearing (direction) from point 1 to point 2
function calculateBearing(lat1, lng1, lat2, lng2) {
    const dLng = toRadians(lng2 - lng1)
    const lat1Rad = toRadians(lat1)
    const lat2Rad = toRadians(lat2)

    const y = Math.sin(dLng) * Math.cos(lat2Rad)
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng)

    let bearing = toDegrees(Math.atan2(y, x))

    // Normalize to 0-360 degrees
    bearing = (bearing + 360) % 360

    return bearing
}

// Convert bearing to compass direction with Lucide icon names
function getCompassDirection(bearing) {
    const directions = [
        { name: 'N', iconName: 'ArrowUp', min: 337.5, max: 22.5 },
        { name: 'NE', iconName: 'ArrowUpRight', min: 22.5, max: 67.5 },
        { name: 'E', iconName: 'ArrowRight', min: 67.5, max: 112.5 },
        { name: 'SE', iconName: 'ArrowDownRight', min: 112.5, max: 157.5 },
        { name: 'S', iconName: 'ArrowDown', min: 157.5, max: 202.5 },
        { name: 'SW', iconName: 'ArrowDownLeft', min: 202.5, max: 247.5 },
        { name: 'W', iconName: 'ArrowLeft', min: 247.5, max: 292.5 },
        { name: 'NW', iconName: 'ArrowUpLeft', min: 292.5, max: 337.5 }
    ]

    for (const dir of directions) {
        if (dir.name === 'N') {
            // Special case for North (wraps around 0°)
            if (bearing >= dir.min || bearing <= dir.max) {
                return dir
            }
        } else {
            if (bearing >= dir.min && bearing < dir.max) {
                return dir
            }
        }
    }

    // Fallback to North
    return directions[0]
}

// Format distance with appropriate units
function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        return '< 1 km'
    } else {
        // Use comma formatting for thousands
        return `${distanceKm.toLocaleString()} km`
    }
}

// Main function to get hint information
export function getCountryHint(fromCountry, toCountry) {
    if (!fromCountry || !toCountry) {
        return null
    }

    const fromCoords = getCountryCoordinates(fromCountry)
    const toCoords = getCountryCoordinates(toCountry)

    if (!fromCoords || !toCoords) {
        return null
    }

    // If it's the same country or very close, don't show a hint
    const distance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    if (distance < 50) {
        return {
            distance: 0,
            distanceText: 'Very close!',
            direction: { name: '', iconName: 'Target' },
            bearing: 0
        }
    }

    const bearing = calculateBearing(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    const direction = getCompassDirection(bearing)

    return {
        distance,
        distanceText: formatDistance(distance),
        direction,
        bearing: Math.round(bearing),
        fromCoords,
        toCoords
    }
}

// Helper function to get a more detailed hint description
export function getHintDescription(fromCountry, toCountry) {
    const hint = getCountryHint(fromCountry, toCountry)
    if (!hint) return null

    if (hint.distance === 0) {
        return `You're very close to the correct answer!`
    }

    return `The correct answer is ${hint.distanceText} ${hint.direction.name.toLowerCase()} of ${fromCountry}`
}