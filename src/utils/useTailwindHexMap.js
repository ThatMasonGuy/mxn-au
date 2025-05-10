export const tailwindHexMap = {
    'fuchsia-500': '#d946ef',
    'fuchsia-300': '#f0abfc',
    'green-500': '#22c55e',
    'green-300': '#86efac',
    'amber-500': '#f59e0b',
    'amber-300': '#fcd34d',
    'rose-500': '#f43f5e',
    'rose-300': '#fda4af',
    'sky-500': '#0ea5e9',
    'sky-300': '#7dd3fc',
    'pink-500': '#ec4899',
    'pink-300': '#f9a8d4',
    'emerald-500': '#10b981',
    'emerald-300': '#6ee7b7',
    'cyan-500': '#06b6d4',
    'cyan-300': '#67e8f9',
    'slate-500': '#64748b',
    'slate-300': '#cbd5e1',
}

export function resolveTailwindHexFromClasses(styleClass = '') {
    const match = styleClass.match(/(?:bg|text|border)-(\w+)-(\d+)/)
    if (!match) return null
    const key = `${match[1]}-${match[2]}` // strip off the /opacity part
    return tailwindHexMap[key] || null
}
