<template>
    <div
        class="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-500/30 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group">
        <!-- Card Header -->
        <div :class="getHeaderGradient(hero.rarity)" class="p-4 border-b border-slate-800/50">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="text-lg font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                        {{ hero.name }}
                    </h4>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span :class="getRarityBadgeClass(hero.rarity)"
                            class="px-2 py-1 rounded text-xs font-bold uppercase">
                            {{ hero.rarity }}
                        </span>
                        <span v-if="hero.faction" :class="getFactionBadgeClass(hero.faction)"
                            class="px-2 py-1 rounded text-xs font-bold capitalize">
                            {{ hero.faction }}
                        </span>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <div class="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-lg">
                        <TrendingUp class="w-3 h-3 text-emerald-300" />
                        <span class="text-xs font-bold text-emerald-300">Perfect Match</span>
                    </div>
                    <div v-if="hasMissingTrait3" class="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-lg">
                        <AlertCircle class="w-3 h-3 text-amber-400" />
                        <span class="text-xs font-semibold text-amber-400">Missing Data</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Traits Grid -->
        <div class="p-4">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="(traitId, slot) in hero.traits" :key="slot" :class="[
                    'p-3 rounded-lg border transition-all duration-200',
                    isSharedTrait(traitId)
                        ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950/50 border-slate-700/50'
                ]">
                    <div class="flex items-start justify-between mb-1">
                        <span :class="[
                            'text-xs font-semibold',
                            isSharedTrait(traitId) ? 'text-emerald-300' : 'text-slate-400'
                        ]">
                            Trait {{ slot }}
                        </span>
                        <Zap v-if="isSharedTrait(traitId)" class="w-3 h-3 text-emerald-400 animate-pulse" />
                    </div>
                    <p :class="[
                        'text-sm font-medium leading-tight',
                        isSharedTrait(traitId) ? 'text-white' : 'text-slate-300',
                        !traitId && 'text-amber-400 italic'
                    ]">
                        {{ getTraitName(traitId) || 'Unknown' }}
                    </p>
                    <p v-if="!traitId" class="text-amber-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle class="w-3 h-3" />
                        Missing
                    </p>
                </div>
            </div>
        </div>

        <!-- Perfect Match Summary -->
        <div class="px-4 pb-4">
            <div
                class="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg p-3 border border-emerald-500/20">
                <div class="flex items-start gap-2">
                    <Sparkles class="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-emerald-300 mb-1">All 4 Traits Match:</p>
                        <p class="text-sm text-slate-300 leading-relaxed">
                            {{ sharedTraitNames.join(', ') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUp, AlertCircle, Zap, Sparkles } from 'lucide-vue-next'

const props = defineProps({
    hero: {
        type: Object,
        required: true
    },
    sharedTraits: {
        type: Array,
        required: true
    },
    traitLookup: {
        type: Object,
        required: true
    }
})

const hasMissingTrait3 = computed(() => {
    return !props.hero.traits['3']
})

const sharedTraitNames = computed(() => {
    return props.sharedTraits.map(traitId => props.traitLookup[traitId] || 'Unknown')
})

const isSharedTrait = (traitId) => {
    return traitId && props.sharedTraits.includes(traitId)
}

const getTraitName = (traitId) => {
    return props.traitLookup[traitId]
}

const getRarityBadgeClass = (rarity) => {
    if (rarity === 'mythic') {
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
    }
    return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
}

const getFactionBadgeClass = (faction) => {
    switch (faction) {
        case 'horde':
            return 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
        case 'league':
            return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
        case 'nature':
            return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
        default:
            return 'bg-slate-700/50 text-slate-300'
    }
}

const getHeaderGradient = (rarity) => {
    if (rarity === 'mythic') {
        return 'bg-gradient-to-r from-amber-900/30 to-orange-900/30'
    }
    return 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30'
}
</script>