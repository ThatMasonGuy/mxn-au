export function slugify(input, options = {}) {
    const {
        separator = '-',
        lower = true,
        strict = true,
    } = options

    let str = input.normalize('NFKD') // Normalize Unicode
        .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics

    if (strict) {
        // Remove anything that's not a-z, 0-9, or space/dash
        str = str.replace(/[^a-zA-Z0-9\s\-]/g, '')
    }

    str = str.trim().replace(/\s+/g, separator)

    return lower ? str.toLowerCase() : str
}
