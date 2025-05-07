// @/composables/useGuideHelpers.js
import TitleSection from '@/components/topheroes/events/guides/admin/blocks/TitleSection.vue'
import TipList from '@/components/topheroes/events/guides/admin/blocks/TipList.vue'

// 1. Component Map
const componentMap = {
    TitleSection,
    TipList
    // Add more as you build
}

// 2. Resolve Component
export function resolveComponent(type) {
    return componentMap[type] || null
}

// 3. Generate Unique ID
export function generateId(prefix = 'block') {
    return `${prefix}-${Math.random().toString(36).substr(2, 6)}`
}

// 4. Default Props per Component Type
export function getDefaultProps(type) {
    switch (type) {
        case 'TitleSection':
            return { title: '', subtitle: '' }
        case 'Divider':
            return { style: 'solid' }
        case 'CalloutBox':
            return { title: '', content: '', calloutType: 'info' }
        // Add more as needed
        default:
            return {}
    }
}

// 5. Create an Empty Block
export function buildEmptyBlock(type) {
    return {
        id: generateId(),
        type,
        data: getDefaultProps(type),
        children: []
    }
}


// 6. Deep Clone a Block
export function cloneBlock(block) {
    return JSON.parse(JSON.stringify(block))
}

// 7. Optional: Validate Block
export function isBlockValid(block) {
    return block && typeof block.id === 'string' && typeof block.type === 'string'
}
