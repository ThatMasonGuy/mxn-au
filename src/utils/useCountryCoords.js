// utils/useCountryCoords.js
import countries from 'world-countries'

// Create a lookup map for faster access
const countryCoordMap = new Map()

// Initialize the coordinate map
countries.forEach(country => {
    // Get the main name
    const mainName = country.name.common
    const coords = country.latlng

    if (coords && coords.length === 2) {
        countryCoordMap.set(mainName.toLowerCase(), {
            lat: coords[0],
            lng: coords[1],
            name: mainName
        })

        // Add alternative names
        if (country.name.official) {
            countryCoordMap.set(country.name.official.toLowerCase(), {
                lat: coords[0],
                lng: coords[1],
                name: mainName
            })
        }

        // Add native names
        if (country.name.nativeName) {
            Object.values(country.name.nativeName).forEach(nativeName => {
                if (nativeName.common) {
                    countryCoordMap.set(nativeName.common.toLowerCase(), {
                        lat: coords[0],
                        lng: coords[1],
                        name: mainName
                    })
                }
                if (nativeName.official) {
                    countryCoordMap.set(nativeName.official.toLowerCase(), {
                        lat: coords[0],
                        lng: coords[1],
                        name: mainName
                    })
                }
            })
        }

        // Add common aliases
        const aliases = getCountryAliases(mainName)
        aliases.forEach(alias => {
            countryCoordMap.set(alias.toLowerCase(), {
                lat: coords[0],
                lng: coords[1],
                name: mainName
            })
        })
    }
})

function getCountryAliases(countryName) {
    const aliases = []

    const aliasMap = {
        'United States': ['USA', 'United States of America', 'America', 'US'],
        'United Kingdom': ['UK', 'Great Britain', 'Britain', 'GB'],
        'Netherlands': ['Holland'],
        'Russia': ['Russian Federation'],
        'South Korea': ['Korea, Republic of', 'Korea'],
        'North Korea': ['Korea, Democratic People\'s Republic of', 'DPRK'],
        'Czech Republic': ['Czechia'],
        'Ivory Coast': ['Cote d\'Ivoire', 'Côte d\'Ivoire'],
        'Palestine': ['Palestine, State of'],
        'China': ['People\'s Republic of China', 'PRC'],
        'Taiwan': ['Taiwan, Province of China', 'Republic of China', 'ROC'],
        'Vatican City': ['Holy See'],
        'Myanmar': ['Burma'],
        'Democratic Republic of the Congo': ['DRC', 'Congo-Kinshasa'],
        'Republic of the Congo': ['Congo-Brazzaville'],
        'Eswatini': ['Swaziland'],
        'North Macedonia': ['Macedonia']
    }

    // Check if this country has aliases
    if (aliasMap[countryName]) {
        aliases.push(...aliasMap[countryName])
    }

    // Check if this country is an alias of another
    for (const [main, aliasList] of Object.entries(aliasMap)) {
        if (aliasList.includes(countryName)) {
            aliases.push(main)
            aliases.push(...aliasList.filter(a => a !== countryName))
        }
    }

    return aliases
}

export function getCountryCoordinates(countryName) {
    if (!countryName) return null

    // Try exact match first
    const coords = countryCoordMap.get(countryName.toLowerCase().trim())
    if (coords) return coords

    // Try fuzzy matching
    const normalized = countryName.toLowerCase().trim()
    for (const [key, value] of countryCoordMap) {
        if (key.includes(normalized) || normalized.includes(key)) {
            return value
        }
    }

    return null
}