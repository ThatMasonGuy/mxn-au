// composables/useBlockRegistry.js
const blockModules = import.meta.glob('@/components/topheroes/events/guides/admin/blocks/*.vue', { eager: true })

const blockRegistry = {}

for (const path in blockModules) {
    const mod = blockModules[path]
    const name = path.match(/\/([^\/]+)\.vue$/)[1]

    blockRegistry[name] = {
        component: mod.default,
        defaultData: mod.defaultData || {},
        getDefaultData: mod.getDefaultData || (() => mod.defaultData || {}),
        meta: mod.meta || {
            id: name,
            title: name,
            category: 'Uncategorized',
            icon: 'QuestionMarkCircleIcon',
            description: 'No description provided.'
        }
    }
}

export function useBlockRegistry() {
    return {
        getComponent: (type) => blockRegistry[type]?.component,
        getDefaultData: (type) => blockRegistry[type]?.getDefaultData?.() || {},
        getMeta: (type) => blockRegistry[type]?.meta,
        getBlockPreview: (block) => {
            const data = block.data || {}

            const summary = Object.entries(data)
                .filter(([_, val]) => val !== null && val !== '' && val !== undefined)
                .map(([key, val]) => {
                    let stringVal = typeof val === 'string' ? val : JSON.stringify(val)
                    if (stringVal.length > 30) stringVal = stringVal.slice(0, 30) + '…'
                    return `${key}: ${stringVal}`
                })
                .join(', ')

            return summary ? `${block.type} — ${summary}` : `${block.type} block`
        },
        getAll: () => Object.values(blockRegistry),
        getGrouped: () => {
            const groups = {}
            for (const entry of Object.values(blockRegistry)) {
                const group = entry.meta.category || 'Uncategorized'
                if (!groups[group]) groups[group] = []
                groups[group].push(entry)
            }
            return groups
        }
    }
}

export function defineBlock({ defaultData = {}, meta = {} }) {
    return {
        defaultData,
        getDefaultData: () => structuredClone(defaultData),
        meta
    }
}