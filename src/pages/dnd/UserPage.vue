<template>
    <div class="h-screen bg-gradient-to-br from-[rgb(var(--primary-900))] via-[rgb(var(--primary-950))] to-[rgb(var(--primary-900))] overflow-hidden font-medieval"
        :style="cssVariables">
        <!-- Medieval border overlay -->
        <div class="absolute inset-0 pointer-events-none z-10">
            <div class="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/40 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 to-transparent"></div>
            <div class="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/40 to-transparent"></div>
        </div>

        <!-- Campaign Header -->
        <div
            class="relative z-20 bg-[rgb(var(--primary-900))]/95 backdrop-blur border-b-2 border-[rgb(var(--accent-800))]/50 shadow-xl px-6 py-3">
            <div class="flex items-center justify-between">
                <!-- Campaign Info -->
                <div class="flex items-center gap-6">
                    <h1 class="text-2xl font-bold text-[rgb(var(--accent-100))]">{{ campaign.name }}</h1>
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            <Users class="w-4 h-4 text-[rgb(var(--accent-500))]" />
                            <span class="text-[rgb(var(--accent-300))]">{{ connectedPlayers }} Players</span>
                        </div>
                        <div class="text-[rgb(var(--accent-600))]">•</div>
                        <div class="flex items-center gap-2">
                            <Hash class="w-4 h-4 text-[rgb(var(--accent-500))]" />
                            <span class="text-[rgb(var(--accent-300))]">Session {{ campaign.sessionNumber }}</span>
                        </div>
                        <div class="text-[rgb(var(--accent-600))]">•</div>
                        <div class="flex items-center gap-2">
                            <MapPin class="w-4 h-4 text-[rgb(var(--accent-500))]" />
                            <span class="text-[rgb(var(--accent-300))]">{{ campaign.location }}</span>
                        </div>
                    </div>
                </div>

                <!-- Color Picker with Popover (fixed) -->
                <Popover v-model:open="themeOpen">
                    <PopoverTrigger as-child>
                        <button
                            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/50 border border-[rgb(var(--accent-700))]/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgb(var(--accent-900))]/30 transition-all"
                            aria-label="Open theme selector">
                            <Palette class="w-4 h-4 text-[rgb(var(--accent-400))]" />
                            <span class="text-xs text-[rgb(var(--accent-300))]">Theme</span>
                            <div class="flex gap-1">
                                <div class="w-4 h-4 rounded-full border border-stone-700"
                                    :style="`background: ${playerPrimaryColor}`"></div>
                                <div class="w-4 h-4 rounded-full border border-stone-700"
                                    :style="`background: ${playerAccentColor}`"></div>
                            </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        class="w-80 p-4 bg-[rgb(var(--primary-900))]/95 backdrop-blur border-2 border-[rgb(var(--accent-800))]/50 rounded-xl shadow-xl"
                        side="bottom" align="end" :side-offset="8">
                        <div class="space-y-4">
                            <h4 class="font-semibold text-[rgb(var(--accent-100))]">Choose Theme</h4>

                            <!-- Preset Pairs -->
                            <div class="grid grid-cols-2 gap-2">
                                <button v-for="pair in colorPairs" :key="pair.name" @click="setColorPair(pair)"
                                    class="flex items-center gap-2 p-2 rounded-lg bg-stone-800/50 hover:bg-stone-800/70 border border-[rgb(var(--accent-900))]/30 hover:border-[rgb(var(--accent-700))]/50 transition-all hover:-translate-y-0.5 hover:shadow-md">
                                    <div class="flex gap-1">
                                        <div class="w-6 h-6 rounded-full" :style="`background: ${pair.primary}`"></div>
                                        <div class="w-6 h-6 rounded-full" :style="`background: ${pair.accent}`"></div>
                                    </div>
                                    <span class="text-xs text-[rgb(var(--accent-200))]">{{ pair.name }}</span>
                                </button>
                            </div>

                            <!-- Custom Colors -->
                            <div class="space-y-2">
                                <h5 class="text-xs font-medium text-[rgb(var(--accent-300))]">Custom Colors</h5>
                                <div class="flex gap-2">
                                    <div class="flex-1">
                                        <label class="text-xs text-[rgb(var(--accent-400))] block mb-1">Primary</label>
                                        <input type="color" v-model="playerPrimaryColor"
                                            class="w-full h-10 rounded cursor-pointer" />
                                    </div>
                                    <div class="flex-1">
                                        <label class="text-xs text-[rgb(var(--accent-400))] block mb-1">Accent</label>
                                        <input type="color" v-model="playerAccentColor"
                                            class="w-full h-10 rounded cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        <!-- Main Layout Grid -->
        <div class="flex h-[calc(100%-60px)] p-4 gap-3">
            <!-- Left Section - 30% -->
            <div class="w-[30%] flex flex-col gap-3">
                <!-- Player Card - 40% height -->
                <div
                    class="h-[40%] bg-gradient-to-br from-[rgb(var(--accent-900))]/90 to-[rgb(var(--accent-950))]/90 backdrop-blur rounded-xl border-2 border-[rgb(var(--accent-800))]/50 shadow-2xl p-4 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
                        <Shield class="w-full h-full text-[rgb(var(--accent-600))]" />
                    </div>
                    <div class="relative z-10 h-full flex flex-col">
                        <!-- Player Info Header -->
                        <div class="flex items-center gap-3 mb-4">
                            <div
                                class="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-[rgb(var(--accent-100))] text-xl font-bold shadow-lg ring-2 ring-red-800/50">
                                {{ playerData.name.charAt(0) }}
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-[rgb(var(--accent-100))]">{{ playerData.name }}</h2>
                                <p class="text-xs text-[rgb(var(--accent-300))]">Level {{ playerData.level }} {{
                                    playerData.class }}</p>
                            </div>
                        </div>

                        <!-- Main 6 Stats Grid -->
                        <div class="flex-1 grid grid-cols-3 gap-2">
                            <button v-for="stat in mainStats" :key="stat.name" @click="rollSavingThrow(stat.name)"
                                class="bg-stone-800/50 hover:bg-stone-800/70 border border-[rgb(var(--accent-900))]/50 hover:border-[rgb(var(--accent-700))]/50 transition-all rounded-lg p-2 text-center group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgb(var(--accent-900))]/30 flex flex-col justify-center">
                                <div class="text-xs text-[rgb(var(--accent-400))] mb-1">{{ stat.short }}</div>
                                <div class="text-2xl font-bold text-[rgb(var(--accent-100))]">{{ stat.value }}</div>
                                <div class="text-xs text-[rgb(var(--accent-600))]">
                                    {{ stat.modifier >= 0 ? '+' : '' }}{{ stat.modifier }}
                                </div>
                            </button>
                        </div>

                        <!-- Quick Stats Bar -->
                        <div class="flex gap-2 mt-3 pt-3 border-t border-[rgb(var(--accent-800))]/50">
                            <div class="flex-1 text-center">
                                <div class="text-xs text-[rgb(var(--accent-400))]">AC</div>
                                <div class="text-lg font-bold text-[rgb(var(--accent-200))]">{{ quickStats.ac }}</div>
                            </div>
                            <div class="flex-1 text-center">
                                <div class="text-xs text-[rgb(var(--accent-400))]">HP</div>
                                <div class="text-lg font-bold text-red-400">{{ quickStats.hp }}</div>
                            </div>
                            <div class="flex-1 text-center">
                                <div class="text-xs text-[rgb(var(--accent-400))]">Speed</div>
                                <div class="text-lg font-bold text-[rgb(var(--accent-200))]">{{ quickStats.speed }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Skills & Saves - 60% height -->
                <div
                    class="flex-1 bg-gradient-to-br from-[rgb(var(--accent-900))]/90 to-[rgb(var(--accent-950))]/90 backdrop-blur rounded-xl border-2 border-[rgb(var(--accent-800))]/50 shadow-2xl p-4 overflow-hidden">
                    <h3 class="text-lg font-bold text-[rgb(var(--accent-100))] mb-3 flex items-center gap-2">
                        <Scroll class="w-5 h-5 text-[rgb(var(--accent-500))]" />
                        Skills & Saves
                    </h3>
                    <div class="overflow-y-auto h-[calc(100%-3rem)] pr-2 custom-scrollbar">
                        <div class="grid grid-cols-2 gap-2">
                            <button v-for="skill in skills" :key="skill.name" @click="rollSavingThrow(skill.name)"
                                class="bg-stone-800/30 hover:bg-stone-800/50 border border-[rgb(var(--accent-900))]/30 hover:border-[rgb(var(--accent-700))]/50 transition-all rounded-lg p-2 text-left group hover:-translate-y-0.5 hover:shadow-md hover:shadow-[rgb(var(--accent-900))]/20">
                                <div class="flex justify-between items-center">
                                    <span class="text-xs font-medium text-[rgb(var(--accent-200))]">{{ skill.name
                                        }}</span>
                                    <span class="text-sm font-bold text-[rgb(var(--accent-500))]">
                                        {{ skill.modifier >= 0 ? '+' : '' }}{{ skill.modifier }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Center Section - 40% -->
            <div class="w-[40%] flex flex-col gap-3">
                <!-- Notes Section -->
                <div
                    class="h-[60%] bg-gradient-to-br from-[var(--accent-900)] to-[var(--accent-950)] backdrop-blur rounded-xl border-2 border-[var(--accent-800-50)] shadow-2xl p-4 flex flex-col">
                    <!-- Notes Header with Toggle -->
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-bold text-[var(--accent-100)] flex items-center gap-2">
                            <BookOpen class="w-5 h-5 text-[var(--accent-500)]" />
                            {{ isPartyNotes ? 'Party Notes' : 'Personal Notes' }}
                        </h3>
                        <div class="flex gap-2">
                            <button @click="isPartyNotes = false"
                                class="px-3 py-1 rounded-lg text-xs font-medium transition-all" :class="!isPartyNotes
                                        ? 'bg-red-800 text-[var(--accent-100)] shadow-lg shadow-red-900/50'
                                        : 'bg-stone-800/50 text-[var(--accent-400)] hover:bg-stone-800/70 hover:-translate-y-0.5'
                                    ">
                                Personal
                            </button>
                            <button @click="isPartyNotes = true"
                                class="px-3 py-1 rounded-lg text-xs font-medium transition-all" :class="isPartyNotes
                                        ? 'bg-red-800 text-[var(--accent-100)] shadow-lg shadow-red-900/50'
                                        : 'bg-stone-800/50 text-[var(--accent-400)] hover:bg-stone-800/70 hover:-translate-y-0.5'
                                    ">
                                Party
                            </button>
                        </div>
                    </div>

                    <!-- Notes Content -->
                    <div class="flex-1 relative">
                        <textarea v-if="!isPartyNotes" v-model="personalNotes"
                            placeholder="Your personal adventure notes..."
                            class="w-full h-full bg-stone-800/50 border border-[var(--accent-900-30)] rounded-lg p-3 text-[var(--accent-100)] placeholder-[var(--accent-600-50)] resize-none custom-scrollbar focus:outline-none focus:border-[var(--accent-700-50)] focus:shadow-lg focus:shadow-[var(--accent-900-20)]" />
                        <textarea v-else v-model="partyNotes" placeholder="Share notes with your party..."
                            class="w-full h-full bg-stone-800/50 border border-[var(--accent-900-30)] rounded-lg p-3 text-[var(--accent-100)] placeholder-[var(--accent-600-50)] resize-none custom-scrollbar focus:outline-none focus:border-[var(--accent-700-50)] focus:shadow-lg focus:shadow-[var(--accent-900-20)]" />
                        <div v-if="isPartyNotes"
                            class="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-[var(--accent-500)]">
                            <Users class="w-3 h-3" />
                            <span>{{ connectedPlayers }} viewing</span>
                        </div>
                    </div>
                </div>

                <!-- Activity Feed -->
                <div
                    class="h-[40%] bg-gradient-to-br from-[var(--accent-900)] to-[var(--accent-950)] backdrop-blur rounded-xl border-2 border-[var(--accent-800-50)] shadow-2xl p-4 overflow-hidden">
                    <h3 class="text-lg font-bold text-[var(--accent-100)] mb-3 flex items-center gap-2">
                        <MessageSquare class="w-5 h-5 text-[var(--accent-500)]" />
                        Party Activity
                    </h3>
                    <div class="overflow-y-auto h-[calc(100%-3rem)] pr-2 custom-scrollbar">
                        <div class="space-y-2">
                            <div v-for="(activity, idx) in activities" :key="idx"
                                class="bg-stone-800/30 border border-[var(--accent-900-30)] rounded-lg p-2 text-sm animate-fade-in">
                                <div class="flex items-center gap-2">
                                    <component :is="activity.icon" class="w-4 h-4 text-[var(--accent-500)]" />
                                    <span class="font-medium text-[var(--accent-200)]">{{ activity.player }}</span>
                                    <span class="text-[var(--accent-400)]">{{ activity.action }}</span>
                                    <span v-if="activity.result" class="ml-auto font-bold text-[var(--accent-300)]">{{
                                        activity.result }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Section - 30% -->
            <div class="w-[30%] flex flex-col gap-3">
                <!-- Items & Actions -->
                <div
                    class="h-[70%] bg-gradient-to-br from-[var(--accent-900)] to-[var(--accent-950)] backdrop-blur rounded-xl border-2 border-[var(--accent-800-50)] shadow-2xl p-4 flex flex-col">
                    <h3 class="text-lg font-bold text-[var(--accent-100)] mb-3 flex items-center gap-2">
                        <Package class="w-5 h-5 text-[var(--accent-500)]" />
                        Inventory & Actions
                    </h3>
                    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <!-- Items -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-[var(--accent-300)] mb-2">Items</h4>
                            <div class="space-y-1">
                                <div v-for="item in inventory" :key="item.name"
                                    class="bg-stone-800/30 border border-[var(--accent-900-30)] rounded-lg p-2 hover:bg-stone-800/50 hover:border-[var(--accent-700-50)] transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--accent-900-20)]">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-[var(--accent-200)]">{{ item.name }}</span>
                                        <span
                                            class="text-xs text-[var(--accent-500)] group-hover:text-[var(--accent-400)]">{{
                                            item.quantity }}x</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div>
                            <h4 class="text-sm font-semibold text-[var(--accent-300)] mb-2">Actions</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <button v-for="action in actions" :key="action.name"
                                    class="bg-gradient-to-br from-red-800 to-red-900 text-[var(--accent-100)] rounded-lg px-3 py-2 text-xs font-medium hover:from-red-700 hover:to-red-800 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-900/50">
                                    {{ action.name }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dice Box -->
                <div
                    class="h-[30%] bg-gradient-to-br from-[var(--accent-900)] to-[var(--accent-950)] backdrop-blur rounded-xl border-2 border-[var(--accent-800-50)] shadow-2xl p-4 relative overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center opacity-10">
                        <Dices class="w-32 h-32 text-[var(--accent-600)]" />
                    </div>
                    <div class="relative z-10 h-full flex flex-col items-center justify-center">
                        <div v-if="lastRoll" class="text-center mb-2">
                            <p class="text-sm text-[var(--accent-400)]">Last Roll</p>
                            <p class="text-3xl font-bold text-[var(--accent-200)]">{{ lastRoll.result }}</p>
                            <p class="text-xs text-[var(--accent-500)]">{{ lastRoll.type }}</p>
                        </div>
                        <p v-else class="text-[var(--accent-400)] text-sm">Click the D20 to roll!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating D20 Button -->
        <button @click="showDiceModal = true"
            class="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-red-800 to-red-950 rounded-full shadow-2xl hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(220,38,38,0.3)] transition-all hover:rotate-12 group z-50 border-2 border-red-800/50"
            :class="{ 'animate-spin-dice': isRolling }">
            <div class="w-full h-full flex items-center justify-center text-[rgb(var(--accent-100))] relative">
                <Dices class="w-10 h-10 group-hover:drop-shadow-[0_0_8px_rgba(var(--accent-600),0.8)] transition-all" />
                <span v-if="currentRoll"
                    class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[rgb(var(--accent-300)))] drop-shadow-[0_0_10px_rgba(var(--accent-600),0.8)]">
                    {{ currentRoll }}
                </span>
            </div>
        </button>

        <!-- Dice Modal -->
        <Transition name="modal">
            <div v-if="showDiceModal"
                class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                @click.self="showDiceModal = false">
                <div
                    class="bg-gradient-to-br from-[var(--accent-900)] to-[var(--accent-950)] rounded-2xl p-6 shadow-2xl border-2 border-[var(--accent-800-50)] max-w-md w-full mx-4 transform transition-all">
                    <h3 class="text-2xl font-bold text-[var(--accent-100)] mb-4 flex items-center gap-2">
                        <Dices class="w-6 h-6 text-[var(--accent-500)]" />
                        Roll Dice
                    </h3>

                    <div class="space-y-4">
                        <!-- Dice Type Selection -->
                        <div>
                            <label class="text-sm font-medium text-[var(--accent-300)] mb-2 block">Select Dice
                                Type</label>
                            <div class="grid grid-cols-4 gap-2">
                                <button v-for="dice in diceTypes" :key="dice" @click="selectedDice = dice"
                                    class="p-3 rounded-lg transition-all border" :class="selectedDice === dice
                                            ? 'bg-red-800 text-[var(--accent-100)] border-red-700 shadow-lg shadow-red-900/50'
                                            : 'bg-stone-800/50 hover:bg-stone-800/70 text-[var(--accent-300)] border-[var(--accent-900-30)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--accent-900-20)]'
                                        ">
                                    {{ dice }}
                                </button>
                            </div>
                        </div>

                        <!-- Dice Count -->
                        <div>
                            <label class="text-sm font-medium text-[var(--accent-300)] mb-2 block">Number of
                                Dice</label>
                            <div class="flex gap-2">
                                <button v-for="n in 6" :key="n" @click="diceCount = n"
                                    class="w-12 h-12 rounded-lg transition-all border" :class="diceCount === n
                                            ? 'bg-red-800 text-[var(--accent-100)] border-red-700 shadow-lg shadow-red-900/50'
                                            : 'bg-stone-800/50 hover:bg-stone-800/70 text-[var(--accent-300)] border-[var(--accent-900-30)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--accent-900-20)]'
                                        ">
                                    {{ n }}
                                </button>
                            </div>
                        </div>

                        <!-- Roll Button -->
                        <button @click="rollDice"
                            class="w-full bg-gradient-to-br from-red-800 to-red-950 text-[var(--accent-100)] py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-900 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-900/50 border border-red-800/50">
                            Roll {{ diceCount }}{{ selectedDice }}!
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Shield, Scroll, MessageSquare, Package, Dices, Zap, Heart, Sparkles, BookOpen, Users, MapPin, Hash, Palette } from 'lucide-vue-next'

// ✅ Use shadcn/vue popover wrappers, not raw radix-vue
//    (You should have these in /components/ui/popover from shadcn/vue preset)
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Campaign Data
const campaign = ref({
    name: 'The Lost Mines of Phandelver',
    sessionNumber: 12,
    location: 'Cragmaw Castle'
})

// Player Data
const playerData = ref({
    name: 'Thorin Oakenshield',
    level: 5,
    class: 'Fighter'
})

// Popover open state (fixed)
const themeOpen = ref(false)

// Color Theme System
const playerPrimaryColor = ref('#78350f')
const playerAccentColor = ref('#d97706')

const colorPairs = [
    { name: 'Amber & Red', primary: '#78350f', accent: '#d97706' },
    { name: 'Slate & Blue', primary: '#1e293b', accent: '#3b82f6' },
    { name: 'Emerald & Lime', primary: '#14532d', accent: '#059669' },
    { name: 'Purple & Pink', primary: '#4c1d95', accent: '#db2777' },
    { name: 'Teal & Cyan', primary: '#134e4a', accent: '#06b6d4' },
    { name: 'Rose & Orange', primary: '#881337', accent: '#ea580c' },
    { name: 'Indigo & Violet', primary: '#312e81', accent: '#8b5cf6' },
    { name: 'Zinc & Amber', primary: '#27272a', accent: '#f59e0b' }
]

const setColorPair = (pair) => {
    playerPrimaryColor.value = pair.primary
    playerAccentColor.value = pair.accent
    // ✅ Close popover after selection
    themeOpen.value = false
}

// Generate color variations from hex
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null
}

const cssVariables = computed(() => {
    const primaryRgb = hexToRgb(playerPrimaryColor.value)
    const accentRgb = hexToRgb(playerAccentColor.value)
    if (!primaryRgb || !accentRgb) return {}

    return {
        '--primary-900': `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
        '--primary-950': `${Math.max(0, primaryRgb.r - 20)}, ${Math.max(0, primaryRgb.g - 20)}, ${Math.max(
            0,
            primaryRgb.b - 20
        )}`,
        '--accent-100': `${Math.min(255, accentRgb.r + 150)}, ${Math.min(255, accentRgb.g + 150)}, ${Math.min(
            255,
            accentRgb.b + 150
        )}`,
        '--accent-200': `${Math.min(255, accentRgb.r + 120)}, ${Math.min(255, accentRgb.g + 120)}, ${Math.min(
            255,
            accentRgb.b + 120
        )}`,
        '--accent-300': `${Math.min(255, accentRgb.r + 90)}, ${Math.min(255, accentRgb.g + 90)}, ${Math.min(
            255,
            accentRgb.b + 90
        )}`,
        '--accent-400': `${Math.min(255, accentRgb.r + 60)}, ${Math.min(255, accentRgb.g + 60)}, ${Math.min(
            255,
            accentRgb.b + 60
        )}`,
        '--accent-500': `${Math.min(255, accentRgb.r + 30)}, ${Math.min(255, accentRgb.g + 30)}, ${Math.min(
            255,
            accentRgb.b + 30
        )}`,
        '--accent-600': `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`,
        '--accent-700': `${Math.max(0, accentRgb.r - 30)}, ${Math.max(0, accentRgb.g - 30)}, ${Math.max(
            0,
            accentRgb.b - 30
        )}`,
        '--accent-800': `${Math.max(0, accentRgb.r - 60)}, ${Math.max(0, accentRgb.g - 60)}, ${Math.max(
            0,
            accentRgb.b - 60
        )}`,
        '--accent-900': `${Math.max(0, accentRgb.r - 90)}, ${Math.max(0, accentRgb.g - 90)}, ${Math.max(
            0,
            accentRgb.b - 90
        )}`,
        '--accent-950': `${Math.max(0, accentRgb.r - 120)}, ${Math.max(0, accentRgb.g - 120)}, ${Math.max(
            0,
            accentRgb.b - 120
        )}`
    }
})

// Main 6 Stats
const mainStats = ref([
    { name: 'Strength', short: 'STR', value: 16, modifier: 3 },
    { name: 'Dexterity', short: 'DEX', value: 14, modifier: 2 },
    { name: 'Constitution', short: 'CON', value: 15, modifier: 2 },
    { name: 'Intelligence', short: 'INT', value: 10, modifier: 0 },
    { name: 'Wisdom', short: 'WIS', value: 13, modifier: 1 },
    { name: 'Charisma', short: 'CHA', value: 8, modifier: -1 }
])

// Quick Stats
const quickStats = ref({
    ac: 18,
    hp: '42/50',
    speed: '30ft'
})

// Skills
const skills = ref([
    { name: 'Acrobatics', modifier: 2 },
    { name: 'Athletics', modifier: 3 },
    { name: 'Deception', modifier: -1 },
    { name: 'History', modifier: 0 },
    { name: 'Insight', modifier: 1 },
    { name: 'Investigation', modifier: 0 },
    { name: 'Medicine', modifier: 1 },
    { name: 'Nature', modifier: 0 },
    { name: 'Perception', modifier: 1 },
    { name: 'Performance', modifier: -1 },
    { name: 'Persuasion', modifier: -1 },
    { name: 'Religion', modifier: 0 },
    { name: 'Sleight of Hand', modifier: 2 },
    { name: 'Stealth', modifier: 2 },
    { name: 'Survival', modifier: 1 }
])

// Inventory
const inventory = ref([
    { name: 'Longsword', quantity: 1 },
    { name: 'Health Potion', quantity: 3 },
    { name: 'Rope (50ft)', quantity: 1 },
    { name: 'Torch', quantity: 5 },
    { name: 'Rations', quantity: 7 },
    { name: "Thieves' Tools", quantity: 1 }
])

// Actions
const actions = ref([{ name: 'Attack' }, { name: 'Dash' }, { name: 'Dodge' }, { name: 'Help' }, { name: 'Hide' }, { name: 'Ready' }])

// Notes
const isPartyNotes = ref(false)
const personalNotes = ref('')
const partyNotes = ref('')

// Activity Feed
const activities = ref([
    { player: 'Gandalf', action: 'rolled Investigation', result: '18', icon: Dices },
    { player: 'Legolas', action: "cast Hunter's Mark", result: '', icon: Zap },
    { player: 'Gimli', action: 'took 8 damage', result: '', icon: Heart },
    { player: 'Aragorn', action: 'found Magic Sword', result: '+1', icon: Sparkles },
    { player: 'Frodo', action: 'rolled Stealth', result: 'Nat 20!', icon: Dices }
])

// Dice System
const showDiceModal = ref(false)
const selectedDice = ref('d20')
const diceCount = ref(1)
const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']
const isRolling = ref(false)
const currentRoll = ref(null)
const lastRoll = ref(null)

// Multiplayer
const connectedPlayers = ref(4)

// Roll Dice Function
const rollDice = () => {
    showDiceModal.value = false
    isRolling.value = true
    currentRoll.value = null

    let rollCount = 0
    const maxRolls = 20
    const diceMax = parseInt(selectedDice.value.substring(1))

    const rollInterval = setInterval(() => {
        currentRoll.value = Math.floor(Math.random() * diceMax) + 1
        rollCount++

        if (rollCount >= maxRolls) {
            clearInterval(rollInterval)
            isRolling.value = false

            let total = 0
            for (let i = 0; i < diceCount.value; i++) {
                total += Math.floor(Math.random() * diceMax) + 1
            }

            currentRoll.value = total
            lastRoll.value = {
                result: total,
                type: `${diceCount.value}${selectedDice.value}`
            }

            activities.value.unshift({
                player: playerData.value.name,
                action: `rolled ${diceCount.value}${selectedDice.value}`,
                result: total.toString(),
                icon: Dices
            })

            if (activities.value.length > 5) activities.value.pop()

            setTimeout(() => {
                currentRoll.value = null
            }, 3000)
        }
    }, 100)
}

// Roll Saving Throw
const rollSavingThrow = (statName) => {
    const roll = Math.floor(Math.random() * 20) + 1
    let modifier = 0

    const mainStat = mainStats.value.find((s) => s.name === statName)
    if (mainStat) {
        modifier = mainStat.modifier
    } else {
        const skill = skills.value.find((s) => s.name === statName)
        if (skill) modifier = skill.modifier
    }

    const total = roll + modifier

    activities.value.unshift({
        player: playerData.value.name,
        action: `${statName} ${roll === 20 ? '(NAT 20!)' : roll === 1 ? '(NAT 1!)' : 'check'}`,
        result: `${total} (${roll}+${modifier})`,
        icon: Dices
    })

    if (activities.value.length > 5) activities.value.pop()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600&display=swap');

.font-medieval {
    font-family: 'Crimson Text', serif;
}

h1,
h2,
h3,
h4 {
    font-family: 'Cinzel', serif;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(var(--primary-900), 0.3);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(var(--accent-600), 0.4);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--accent-600), 0.6);
}

/* Animations */
@keyframes spin-dice {
    0% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.animate-spin-dice {
    animation: spin-dice 0.2s linear infinite;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
    transition: transform 0.3s ease;
}

.modal-enter-from .transform {
    transform: scale(0.9);
}

.modal-leave-to .transform {
    transform: scale(0.9);
}
</style>