<!-- components/topheroes/modals/SelectionModal.vue -->
<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
                <DialogTitle class="text-base sm:text-lg">{{ title }}</DialogTitle>
                <DialogDescription class="text-sm">
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-3 sm:space-y-4">
                <!-- Search/Filter -->
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                    <input v-model="searchQuery" type="search" placeholder="Search..."
                        class="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-velaris-purple/50" />
                </div>

                <!-- Current Selection Display -->
                <div v-if="currentSelection"
                    class="p-2.5 sm:p-3 bg-velaris-purple/10 border border-velaris-purple/30 rounded-lg">
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div
                                class="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {{ currentSelection.name.charAt(0) }}
                            </div>
                            <div class="min-w-0">
                                <p class="font-medium text-sm sm:text-base truncate">{{ currentSelection.name }}</p>
                                <p v-if="currentSelection.type" class="text-xs text-foreground/60 capitalize">
                                    {{ currentSelection.type }}
                                </p>
                            </div>
                        </div>
                        <button @click="clearSelection"
                            class="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0">
                            <X class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                    </div>
                </div>

                <!-- Items Grid -->
                <div class="space-y-3 sm:space-y-4">
                    <!-- Group by type if items have types -->
                    <template v-if="groupByType">
                        <div v-for="(typeItems, type) in groupedItems" :key="type" class="space-y-2">
                            <h4
                                class="text-xs sm:text-sm font-medium text-foreground/70 capitalize flex items-center gap-2">
                                <component :is="getTypeIcon(type)" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                {{ type }}
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                <button v-for="item in typeItems" :key="item.id" @click="selectItem(item)"
                                    :disabled="isDisabled(item)"
                                    class="p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-left"
                                    :class="getItemClass(item)">
                                    <div class="flex items-center gap-1.5 sm:gap-2 mb-1">
                                        <div class="h-5 w-5 sm:h-6 sm:w-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                            :class="getRarityGradient(item.rarity)">
                                            {{ item.name.charAt(0) }}
                                        </div>
                                        <p class="font-medium text-xs sm:text-sm truncate">{{ item.name }}</p>
                                    </div>
                                    <p v-if="item.faction" class="text-xs text-foreground/60 capitalize truncate">
                                        {{ item.faction }}
                                    </p>
                                </button>
                            </div>
                        </div>
                    </template>

                    <!-- Ungrouped display -->
                    <template v-else>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                            <button v-for="item in filteredItems" :key="item.id" @click="selectItem(item)"
                                class="p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 text-left"
                                :class="getItemClass(item)">
                                <div class="flex items-center gap-1.5 sm:gap-2 mb-1">
                                    <div class="h-5 w-5 sm:h-6 sm:w-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                        :class="getRarityGradient(item.rarity)">
                                        {{ item.name.charAt(0) }}
                                    </div>
                                    <p class="font-medium text-xs sm:text-sm truncate">{{ item.name }}</p>
                                </div>
                                <p v-if="item.faction" class="text-xs text-foreground/60 capitalize truncate">
                                    {{ item.faction }}
                                </p>
                                <p v-if="item.type" class="text-xs text-foreground/60 capitalize truncate">
                                    {{ item.type }}
                                </p>
                            </button>
                        </div>
                    </template>
                </div>

                <!-- Empty State -->
                <div v-if="filteredItems.length === 0" class="text-center py-8 sm:py-12 text-foreground/60">
                    <Library class="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                    <p class="text-xs sm:text-sm">No items found</p>
                </div>
            </div>

            <DialogFooter class="mt-4 sm:mt-6">
                <Button variant="outline" @click="handleClose" class="w-full sm:w-auto text-sm">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { X, Search, Library, Sword, Shield, Zap } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    items: {
        type: Array,
        required: true
    },
    currentSelection: {
        type: Object,
        default: null
    },
    groupByType: {
        type: Boolean,
        default: false
    },
    disabledItems: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:isOpen', 'select', 'clear'])

const searchQuery = ref('')

const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) return props.items

    const search = searchQuery.value.toLowerCase()
    return props.items.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.type?.toLowerCase().includes(search) ||
        item.faction?.toLowerCase().includes(search)
    )
})

const groupedItems = computed(() => {
    if (!props.groupByType) return {}

    return filteredItems.value.reduce((acc, item) => {
        const type = item.type || 'other'
        if (!acc[type]) acc[type] = []
        acc[type].push(item)
        return acc
    }, {})
})

const isDisabled = (item) => {
    return props.disabledItems.includes(item.id)
}

const getItemClass = (item) => {
    const isSelected = props.currentSelection?.id === item.id
    const disabled = isDisabled(item)

    if (disabled) {
        return 'border-border/30 bg-foreground/5 opacity-50 cursor-not-allowed'
    }

    if (isSelected) {
        return 'border-velaris-purple bg-velaris-purple/10 hover:bg-velaris-purple/20'
    }

    return 'border-border/50 hover:border-velaris-purple/50 hover:bg-velaris-purple/5 cursor-pointer'
}

const getRarityGradient = (rarity) => {
    const gradients = {
        mythic: 'bg-gradient-to-br from-red-500 to-red-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600',
        uncommon: 'bg-gradient-to-br from-green-500 to-green-600'
    }
    return gradients[rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
}

const getTypeIcon = (type) => {
    const icons = {
        damage: Sword,
        defense: Shield,
        utility: Zap
    }
    return icons[type] || Library
}

const selectItem = (item) => {
    if (isDisabled(item)) return
    emit('select', item)
    handleClose()
}

const clearSelection = () => {
    emit('clear')
}

const handleOpenChange = (open) => {
    emit('update:isOpen', open)
}

const handleClose = () => {
    emit('update:isOpen', false)
    searchQuery.value = ''
}

watch(() => props.isOpen, (isOpen) => {
    if (!isOpen) {
        searchQuery.value = ''
    }
})
</script>