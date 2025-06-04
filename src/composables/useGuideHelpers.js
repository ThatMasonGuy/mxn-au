// @/composables/useGuideHelpers.js
import { useBlockRegistry } from '@/composables/useBlockRegistry'

export function resolveComponent(type) {
    const { getComponent } = useBlockRegistry()
    return getComponent(type) || null
}

export function generateId(prefix = 'block') {
    return `${prefix}-${Math.random().toString(36).substr(2, 6)}`
}

export function getDefaultProps(type) {
    const { getDefaultData } = useBlockRegistry()
    return getDefaultData(type)
}

export function buildEmptyBlock(type) {
    const { getComponent } = useBlockRegistry()
    const component = getComponent(type)

    if (!component) {
        console.warn(`[buildEmptyBlock] Unknown block type: ${type}`)
        return null
    }

    return {
        id: generateId(type.toLowerCase()),
        type,
        data: getDefaultProps(type),
        children: []
    }
}

export function cloneBlock(block) {
    return JSON.parse(JSON.stringify(block))
}

export function isBlockValid(block) {
    return block && typeof block.id === 'string' && typeof block.type === 'string'
}
