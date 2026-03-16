export function simpleHash(input) {
    let hash = 5381
    let str = typeof input === 'string' ? input : JSON.stringify(input)

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i)
    }

    return (hash >>> 0).toString(36) // Convert to base-36 for shorter string
}
