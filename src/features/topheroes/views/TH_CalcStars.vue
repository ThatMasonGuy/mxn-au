<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1
                    class="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    TopHeroes Shard Calculator
                </h1>
                <p class="text-gray-300">Calculate shards needed to upgrade your heroes</p>
            </div>

            <!-- Mode Toggle -->
            <div class="flex justify-center mb-8">
                <div class="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-700">
                    <button @click="mode = 'calculate'" :class="[
                        'px-6 py-2 rounded-full font-medium transition-all duration-300',
                        mode === 'calculate'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-400 hover:text-white'
                    ]">
                        Calculate Needed
                    </button>
                    <button @click="mode = 'predict'" :class="[
                        'px-6 py-2 rounded-full font-medium transition-all duration-300',
                        mode === 'predict'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'text-gray-400 hover:text-white'
                    ]">
                        Predict Progress
                    </button>
                </div>
            </div>

            <!-- Hero Tier Selection -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold text-white mb-4">Hero Tier</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button @click="selectedTier = 'legendary'" :class="[
                            'p-4 rounded-xl border-2 transition-all duration-300',
                            selectedTier === 'legendary'
                                ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
                                : 'border-gray-600 bg-gray-700/50 hover:border-yellow-400'
                        ]">
                            <div class="text-yellow-400 font-semibold">LEGENDARY</div>
                            <div class="text-sm text-gray-300">500 total shards</div>
                        </button>
                        <button @click="selectedTier = 'mythic'" :class="[
                            'p-4 rounded-xl border-2 transition-all duration-300',
                            selectedTier === 'mythic'
                                ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                                : 'border-gray-600 bg-gray-700/50 hover:border-purple-400'
                        ]">
                            <div class="text-purple-400 font-semibold">MYTHIC</div>
                            <div class="text-sm text-gray-300">1000 total shards</div>
                        </button>
                    </div>
                </div>

                <!-- Current Status -->
                <div class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold text-white mb-4">Current Status</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Current Star Level</label>
                            <select v-model="currentStar"
                                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option v-for="star in starOptions" :key="star.value" :value="star.value">
                                    {{ star.label }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Current Step (1-5)</label>
                            <input v-model.number="currentStep" type="number" min="0" max="5"
                                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mode-specific inputs -->
            <div v-if="mode === 'calculate'"
                class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
                <h3 class="text-xl font-semibold text-white mb-4">Target Goal</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Target Star Level</label>
                        <select v-model="targetStar"
                            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option v-for="star in starOptions" :key="star.value" :value="star.value">
                                {{ star.label }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Target Step (1-5)</label>
                        <input v-model.number="targetStep" type="number" min="0" max="5"
                            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
            </div>

            <div v-else class="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
                <h3 class="text-xl font-semibold text-white mb-4">Available Shards</h3>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Number of Shards You Have</label>
                    <input v-model.number="availableShards" type="number" min="0"
                        class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your shard count..." />
                </div>
            </div>

            <!-- Results -->
            <div
                class="bg-gradient-to-r from-gray-800/40 to-gray-700/40 backdrop-blur-sm rounded-2xl border border-gray-600 p-8 mb-8">
                <div v-if="mode === 'calculate'">
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">Shards Needed</h3>
                    <div class="text-center">
                        <div
                            class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25 mb-6">
                            <span class="text-4xl font-bold text-white">{{ shardsNeeded }}</span>
                        </div>
                        <div class="text-gray-300 mb-4">
                            <div class="flex justify-center items-center space-x-2 mb-2">
                                <span>From:</span>
                                <div class="flex gap-0.5 items-center">
                                    <Star v-for="(star, i) in starProgressRowGlobal(currentStar, currentStep, true)" :key="i"
                                        :color="star.color" :steps="star.steps" :size="32" :starId="`star-${i}`" />
                                </div>
                            </div>
                            <div class="flex justify-center items-center space-x-2">
                                <span>To:</span>
                                <div class="flex gap-0.5 items-center">
                                    <Star v-for="(star, i) in starProgressRowGlobal(targetStar, targetStep, true)"
                                        :key="i" :color="star.color" :steps="star.steps" :size="32" :starId="`star-${i}`" />
                                </div>
                            </div>
                        </div>
                        <div v-if="shardsNeeded === 0" class="text-green-400 font-medium">
                            🎉 You're already at your target!
                        </div>
                        <div v-else-if="shardsNeeded < 0" class="text-red-400 font-medium">
                            ⚠️ Target is lower than current level
                        </div>
                    </div>
                </div>

                <div v-else>
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">Progress Prediction</h3>
                    <div class="text-center">
                        <div v-if="predictedLevel">
                            <div
                                class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/25 mb-6">
                                <div class="text-center">
                                    <div class="flex gap-0.5 items-center">
                                        <Star
                                            v-for="(star, i) in starProgressRowGlobal(predictedLevel.star, predictedLevel.step, true)"
                                            :key="i" :color="star.color" :steps="star.steps" :size="32" :starId="`star-${i}`" />
                                    </div>
                                    <div class="text-lg font-bold text-white">Step {{ predictedLevel.step }}</div>
                                </div>
                            </div>
                            <div class="text-gray-300 mb-4">
                                <div class="mb-2">You can reach:</div>
                                <div class="text-xl font-semibold text-white">
                                    {{ getStarName(predictedLevel.star) }} {{ predictedLevel.star }}★ Step {{
                                        predictedLevel.step }}
                                </div>
                            </div>
                            <div v-if="predictedLevel.remaining > 0" class="text-yellow-400 font-medium">
                                {{ predictedLevel.remaining }} shards remaining
                            </div>
                            <div v-else class="text-purple-400 font-medium">
                                Perfect upgrade! No shards wasted.
                            </div>
                        </div>
                        <div v-else class="text-red-400 font-medium">
                            Not enough shards for any upgrade
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Star from '@/assets/TH_Star.vue'

const mode = ref('calculate')
const selectedTier = ref('legendary')
const availableShards = ref(0)
const currentStar = ref(1)
const currentStep = ref(0)
const targetStar = ref(1)
const targetStep = ref(0)

watch(targetStar, (val) => {
    if (targetStar.value === 15) targetStep.value = 0
})

const starOptions = computed(() => [
    { value: 1, label: '⭐ 1 Star' },
    { value: 2, label: '⭐⭐ 2 Stars' },
    { value: 3, label: '⭐⭐⭐ 3 Stars' },
    { value: 4, label: '⭐⭐⭐⭐ 4 Stars' },
    { value: 5, label: '⭐⭐⭐⭐⭐ 5 Stars' },
    { value: 6, label: '🔴 6 Stars' },
    { value: 7, label: '🔴🔴 7 Stars' },
    { value: 8, label: '🔴🔴🔴 8 Stars' },
    { value: 9, label: '🔴🔴🔴🔴 9 Stars' },
    { value: 10, label: '🔴🔴🔴🔴🔴 10 Stars' },
    { value: 11, label: '⚪ 11 Stars' },
    { value: 12, label: '⚪⚪ 12 Stars' },
    { value: 13, label: '⚪⚪⚪ 13 Stars' },
    { value: 14, label: '⚪⚪⚪⚪ 14 Stars' },
    { value: 15, label: '⚪⚪⚪⚪⚪ 15 Stars' }
])

const shardCosts = {
    legendary: {
        0: { perStep: 1, total: 5 },
        1: { perStep: 1, total: 5 },
        2: { perStep: 1, total: 5 },
        3: { perStep: 2, total: 10 },
        4: { perStep: 2, total: 10 },
        5: { perStep: 4, total: 20 },
        6: { perStep: 6, total: 30 },
        7: { perStep: 4, total: 20 },
        8: { perStep: 4, total: 20 },
        9: { perStep: 8, total: 40 },
        10: { perStep: 8, total: 40 },
        11: { perStep: 16, total: 80 },
        12: { perStep: 4, total: 20 },
        13: { perStep: 8, total: 40 },
        14: { perStep: 16, total: 80 },
        15: { perStep: 16, total: 80 }
    },
    mythic: {
        0: { perStep: 2, total: 10 },
        1: { perStep: 2, total: 10 },
        2: { perStep: 2, total: 10 },
        3: { perStep: 4, total: 20 },
        4: { perStep: 4, total: 20 },
        5: { perStep: 8, total: 40 },
        6: { perStep: 12, total: 60 },
        7: { perStep: 8, total: 40 },
        8: { perStep: 8, total: 40 },
        9: { perStep: 16, total: 80 },
        10: { perStep: 16, total: 80 },
        11: { perStep: 32, total: 160 },
        12: { perStep: 8, total: 40 },
        13: { perStep: 16, total: 80 },
        14: { perStep: 32, total: 160 },
        15: { perStep: 32, total: 160 }
    }
}

// --- Calculation functions update ---
function calculateShardsNeeded(fromStar, fromStep, toStar, toStep) {
    if (toStar < fromStar || (toStar === fromStar && toStep <= fromStep)) {
        return toStar === fromStar && toStep === fromStep ? 0 : -1;
    }

    const costs = shardCosts[selectedTier.value];
    let totalShards = 0;

    // Start at first upgradeable star/step
    let star = fromStar;
    let step = fromStep;

    // If you start at 0/0, you need to go from star 0, step 0
    while (star < toStar || (star === toStar && step < toStep)) {
        // If step == 5, move to next star, reset step
        if (step >= 5) {
            star += 1;
            step = 0;
            continue;
        }

        // Stop if we reached the last needed step/star
        if (star > toStar || (star === toStar && step >= toStep)) break;

        // Don't process if star is 0 (no cost, just a placeholder)
        if (star === 0) {
            star = 1;
            step = 0;
            continue;
        }

        // Add cost for this step
        totalShards += costs[star].perStep;
        step += 1;
    }

    return totalShards;
}

function predictMaxLevel(fromStar, fromStep, shards) {
    const costs = shardCosts[selectedTier.value];
    let star = fromStar;
    let step = fromStep;
    let remaining = shards;

    while (remaining > 0) {
        // If step == 5, move to next star, reset step
        if (step >= 5) {
            star += 1;
            step = 0;
            continue;
        }

        // Don't process if star is 0
        if (star === 0) {
            star = 1;
            step = 0;
            continue;
        }

        // Get cost for this step
        const cost = costs[star]?.perStep;
        if (cost == null || remaining < cost) break;

        remaining -= cost;
        step += 1;
    }

    return {
        star,
        step,
        remaining
    };
}

function getStarName(starLevel) {
    if (starLevel <= 5) return 'Gold'
    if (starLevel <= 10) return 'Red'
    return 'White'
}

const shardsNeeded = computed(() => {
    if (mode.value !== 'calculate') return 0
    return calculateShardsNeeded(
        currentStar.value,
        currentStep.value,
        targetStar.value,
        targetStep.value
    )
})

function getStarColor(starIdx) {
    if (starIdx < 5) return 'gold'
    if (starIdx < 10) return 'red'
    return 'white'
}

function starProgressRow(starCount, starLevel, step) {
    // starLevel: 1-based index, so star 1 = 1, star 5 = 5
    return Array.from({ length: starCount }, (_, i) => {
        const color = getStarColor(i)
        if (i + 1 < starLevel) {
            // All previous stars full
            return { steps: 5, color }
        } else if (i + 1 === starLevel) {
            // Current star, fill with step progress
            return { steps: step, color }
        } else {
            // Future stars empty
            return { steps: 0, color }
        }
    })
}

function getStarColorByGroup(groupIdx) {
    if (groupIdx === 0) return 'gold'
    if (groupIdx === 1) return 'red'
    return 'white'
}

// Returns {steps, color} for each star in the display group
function starProgressRowGlobal(globalStar, step, isCurrent = true) {
    // Which 5-star group? 0=gold, 1=red, 2=white
    const groupIdx = Math.floor((globalStar - 1) / 5)
    const base = groupIdx * 5
    const color = getStarColorByGroup(groupIdx)

    return Array.from({ length: 5 }, (_, i) => {
        const thisGlobal = base + i + 1 // Global star index
        if (thisGlobal < globalStar) {
            // Full stars (before current)
            return { steps: 5, color }
        } else if (thisGlobal === globalStar) {
            // Current star (partial fill)
            return { steps: isCurrent ? step : 5, color }
        } else {
            // Future stars (empty)
            return { steps: 0, color }
        }
    })
}

const predictedLevel = computed(() => {
    if (mode.value !== 'predict' || availableShards.value <= 0) return null
    return predictMaxLevel(currentStar.value, currentStep.value, availableShards.value)
})
</script>

<style scoped>
/* Additional custom styles if needed */
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
}
</style>