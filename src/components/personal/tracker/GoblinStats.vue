<template>
    <div class="space-y-6 mt-6">
        <!-- Today's Progress Card -->
        <div v-if="personalStore.todayProgress" class="bg-gradient-to-br from-purple-900/30 to-slate-800 rounded-xl p-6 lg:p-8 border border-purple-500/30 shadow-xl">
            <h2 class="text-2xl font-bold text-purple-400 mb-1 flex items-center gap-2">
                <TrendingUp :size="24" />
                Today's Progress
            </h2>
            <p class="text-sm text-slate-400 mb-6">
                Track your consumption against your daily goals
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <!-- Calories -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <Flame :size="16" class="text-orange-400" />
                            <span class="text-sm font-medium text-slate-300">Calories</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.calories.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.calories.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.calories.consumed }}
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.calories.goal }}</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="personalStore.todayProgress.calories.isOver ? 'bg-red-500' : 'bg-emerald-500'"
                                :style="{ width: `${Math.min(personalStore.todayProgress.calories.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.calories.isOver ? 'text-red-400' : 'text-emerald-400'">
                            <template v-if="personalStore.todayProgress.calories.isOver">
                                {{ Math.abs(personalStore.todayProgress.calories.remaining) }} over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.calories.remaining }} remaining
                            </template>
                        </p>
                    </div>
                </div>

                <!-- Protein -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-base">💪</span>
                            <span class="text-sm font-medium text-slate-300">Protein</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.protein.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.protein.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.protein.consumed }}g
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.protein.goal }}g</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="personalStore.todayProgress.protein.isOver ? 'bg-red-500' : 'bg-emerald-500'"
                                :style="{ width: `${Math.min(personalStore.todayProgress.protein.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.protein.isOver ? 'text-red-400' : 'text-emerald-400'">
                            <template v-if="personalStore.todayProgress.protein.isOver">
                                {{ Math.abs(personalStore.todayProgress.protein.remaining) }}g over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.protein.remaining }}g remaining
                            </template>
                        </p>
                    </div>
                </div>

                <!-- Carbs -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-base">🍞</span>
                            <span class="text-sm font-medium text-slate-300">Carbs</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.carbs.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.carbs.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.carbs.consumed }}g
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.carbs.goal }}g</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="personalStore.todayProgress.carbs.isOver ? 'bg-red-500' : 'bg-emerald-500'"
                                :style="{ width: `${Math.min(personalStore.todayProgress.carbs.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.carbs.isOver ? 'text-red-400' : 'text-emerald-400'">
                            <template v-if="personalStore.todayProgress.carbs.isOver">
                                {{ Math.abs(personalStore.todayProgress.carbs.remaining) }}g over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.carbs.remaining }}g remaining
                            </template>
                        </p>
                    </div>
                </div>

                <!-- Fat -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-base">🧈</span>
                            <span class="text-sm font-medium text-slate-300">Fat</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.fat.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.fat.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.fat.consumed }}g
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.fat.goal }}g</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="personalStore.todayProgress.fat.isOver ? 'bg-red-500' : 'bg-emerald-500'"
                                :style="{ width: `${Math.min(personalStore.todayProgress.fat.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.fat.isOver ? 'text-red-400' : 'text-emerald-400'">
                            <template v-if="personalStore.todayProgress.fat.isOver">
                                {{ Math.abs(personalStore.todayProgress.fat.remaining) }}g over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.fat.remaining }}g remaining
                            </template>
                        </p>
                    </div>
                </div>

                <!-- Water -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <Droplet :size="16" class="text-blue-400" />
                            <span class="text-sm font-medium text-slate-300">Water</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.water.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.water.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.water.consumed }}L
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.water.goal }}L</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                :style="{ width: `${Math.min(personalStore.todayProgress.water.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.water.isOver ? 'text-red-400' : 'text-blue-400'">
                            <template v-if="personalStore.todayProgress.water.isOver">
                                {{ Math.abs(personalStore.todayProgress.water.remaining) }}L over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.water.remaining }}L remaining
                            </template>
                        </p>
                    </div>
                </div>

                <!-- Sodium -->
                <div v-if="personalStore.todayProgress.sodium" class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-base">🧂</span>
                            <span class="text-sm font-medium text-slate-300">Sodium</span>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2 py-1 rounded',
                            personalStore.todayProgress.sodium.isOver 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                        ]">
                            {{ personalStore.todayProgress.sodium.percentage }}%
                        </span>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-bold text-slate-100">
                                {{ personalStore.todayProgress.sodium.consumed }}mg
                            </span>
                            <span class="text-sm text-slate-500">/ {{ personalStore.todayProgress.sodium.goal }}mg</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-2">
                            <div 
                                class="h-2 rounded-full transition-all duration-500"
                                :class="personalStore.todayProgress.sodium.isOver ? 'bg-red-500' : 'bg-emerald-500'"
                                :style="{ width: `${Math.min(personalStore.todayProgress.sodium.percentage, 100)}%` }"
                            ></div>
                        </div>
                        <p class="text-xs" :class="personalStore.todayProgress.sodium.isOver ? 'text-red-400' : 'text-emerald-400'">
                            <template v-if="personalStore.todayProgress.sodium.isOver">
                                {{ Math.abs(personalStore.todayProgress.sodium.remaining) }}mg over goal
                            </template>
                            <template v-else>
                                {{ personalStore.todayProgress.sodium.remaining }}mg remaining
                            </template>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Set Goals Notice -->
            <div v-if="!personalStore.userGoals" class="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div class="flex items-start gap-3">
                    <Target :size="20" class="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm text-amber-300 font-medium mb-1">Set your daily goals to track progress</p>
                        <button 
                            @click="$emit('switch-to-goals')" 
                            class="text-xs text-amber-400 hover:text-amber-300 underline"
                        >
                            Go to Goals →
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 7-Day Overview -->
        <div v-if="personalStore.weekSummary.length" class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 lg:p-8 border border-slate-700/50 shadow-xl">
            <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400 mb-1 flex items-center gap-2">
                <Calendar :size="24" />
                7-Day Overview
            </h2>
            <p class="text-sm text-slate-400 mb-6">
                Your nutritional summary for the past week
            </p>

            <div class="space-y-3">
                <div 
                    v-for="summary in personalStore.weekSummary" 
                    :key="summary.date"
                    class="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="text-sm font-medium text-slate-300">
                                {{ formatDisplayDate(summary.date) }}
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-500">
                                <span class="flex items-center gap-1">
                                    <Zap :size="12" />
                                    {{ Math.round(summary.totals.calories) }} cal
                                </span>
                                <span class="flex items-center gap-1">
                                    💪 {{ Math.round(summary.totals.protein) }}g
                                </span>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals && personalStore.userGoals.calories" class="text-xs">
                            <div :class="[
                                'font-bold px-2 py-1 rounded',
                                summary.totals.calories > personalStore.userGoals.calories 
                                    ? 'bg-red-500/20 text-red-400' 
                                    : 'bg-emerald-500/20 text-emerald-400'
                            ]">
                                {{ summary.totals.calories > personalStore.userGoals.calories ? '+' : '' }}{{ Math.round(((summary.totals.calories / personalStore.userGoals.calories) - 1) * 100) }}%
                            </div>
                        </div>
                    </div>

                    <!-- Mini progress bars -->
                    <div class="grid grid-cols-6 gap-2">
                        <div v-if="personalStore.userGoals">
                            <div class="text-xs text-slate-500 mb-1">Cal</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="h-1.5 rounded-full"
                                    :class="summary.totals.calories > personalStore.userGoals.calories ? 'bg-red-500' : 'bg-emerald-500'"
                                    :style="{ width: `${Math.min((summary.totals.calories / personalStore.userGoals.calories) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals">
                            <div class="text-xs text-slate-500 mb-1">Pro</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="h-1.5 rounded-full"
                                    :class="summary.totals.protein > personalStore.userGoals.protein ? 'bg-red-500' : 'bg-emerald-500'"
                                    :style="{ width: `${Math.min((summary.totals.protein / personalStore.userGoals.protein) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals">
                            <div class="text-xs text-slate-500 mb-1">Carb</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="h-1.5 rounded-full"
                                    :class="summary.totals.carbs > personalStore.userGoals.carbs ? 'bg-red-500' : 'bg-emerald-500'"
                                    :style="{ width: `${Math.min((summary.totals.carbs / personalStore.userGoals.carbs) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals">
                            <div class="text-xs text-slate-500 mb-1">Fat</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="h-1.5 rounded-full"
                                    :class="summary.totals.fat > personalStore.userGoals.fat ? 'bg-red-500' : 'bg-emerald-500'"
                                    :style="{ width: `${Math.min((summary.totals.fat / personalStore.userGoals.fat) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals">
                            <div class="text-xs text-slate-500 mb-1">H2O</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="bg-blue-500 h-1.5 rounded-full"
                                    :style="{ width: `${Math.min((summary.totals.water / personalStore.userGoals.water) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div v-if="personalStore.userGoals && personalStore.userGoals.sodium">
                            <div class="text-xs text-slate-500 mb-1">Na</div>
                            <div class="w-full bg-slate-800 rounded-full h-1.5">
                                <div 
                                    class="h-1.5 rounded-full"
                                    :class="summary.totals.sodium > personalStore.userGoals.sodium ? 'bg-red-500' : 'bg-emerald-500'"
                                    :style="{ width: `${Math.min((summary.totals.sodium / personalStore.userGoals.sodium) * 100, 100)}%` }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Type Distribution -->
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 lg:p-8 border border-slate-700/50 shadow-xl">
            <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400 mb-6">
                Weekly Distribution
            </h2>
            
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div class="bg-rose-500/10 rounded-lg p-4 border border-rose-500/30">
                    <div class="text-3xl mb-2">🍔</div>
                    <div class="text-2xl font-bold text-rose-400">{{ totalsByType.food }}</div>
                    <div class="text-xs text-slate-400">Food</div>
                </div>
                <div class="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <div class="text-3xl mb-2">🥤</div>
                    <div class="text-2xl font-bold text-blue-400">{{ totalsByType.drink }}</div>
                    <div class="text-xs text-slate-400">Drinks</div>
                </div>
                <div class="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                    <div class="text-3xl mb-2">🍿</div>
                    <div class="text-2xl font-bold text-amber-400">{{ totalsByType.snack }}</div>
                    <div class="text-xs text-slate-400">Snacks</div>
                </div>
                <div class="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                    <div class="text-3xl mb-2">🍰</div>
                    <div class="text-2xl font-bold text-purple-400">{{ totalsByType.treat }}</div>
                    <div class="text-xs text-slate-400">Treats</div>
                </div>
                <div class="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                    <div class="text-3xl mb-2">💧</div>
                    <div class="text-2xl font-bold text-blue-400">{{ totalsByType.water }}</div>
                    <div class="text-xs text-slate-400">Water</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePersonalStore } from '@/stores/usePersonalStore';
import { Calendar, TrendingUp, Flame, Target, Droplet, Zap } from 'lucide-vue-next';

defineEmits(['switch-to-goals']);

const personalStore = usePersonalStore();

const totalsByType = computed(() => {
    const totals = { food: 0, drink: 0, snack: 0, treat: 0, water: 0 };
    
    personalStore.weekSummary.forEach(day => {
        totals.food += day.byType.food || 0;
        totals.drink += day.byType.drink || 0;
        totals.snack += day.byType.snack || 0;
        totals.treat += day.byType.treat || 0;
        totals.water += day.byType.water || 0;
    });
    
    return totals;
});

function formatDisplayDate(isoDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const date = new Date(isoDate);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString(undefined, { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}
</script>