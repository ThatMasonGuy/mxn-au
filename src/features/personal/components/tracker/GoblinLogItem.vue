<template>
    <div 
        class="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden transition-all duration-300 border hover:scale-[1.01]"
        :class="[borderClasses, hoverClasses]"
    >
        <div class="p-4 lg:p-6">
            <div class="flex items-start gap-3">
                <!-- Type Badge -->
                <div 
                    class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-2xl" 
                    :class="badgeClasses"
                >
                    {{ getTypeEmoji(log.type) }}
                </div>

                <!-- Main Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-baseline gap-2 flex-wrap">
                                <h3 class="font-bold text-lg text-slate-100">
                                    <span v-if="servings > 1" class="text-emerald-400">{{ servings }}x</span>
                                    {{ log.item }}
                                </h3>
                                <span v-if="log.variant" class="text-sm text-slate-400 font-medium">
                                    ({{ log.variant }})
                                </span>
                            </div>
                            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                                <span class="flex items-center gap-1">
                                    <Clock :size="12" />
                                    {{ formatTime(log.timestamp) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    {{ getMoodEmoji(log.mood) }}
                                </span>
                            </div>

                            <!-- Insights -->
                            <div v-if="insights.length > 0" class="mt-2 flex flex-wrap gap-2">
                                <div 
                                    v-for="insight in insights" 
                                    :key="insight.label"
                                    class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                                    :class="insight.color"
                                >
                                    <span>{{ insight.emoji }}</span>
                                    <span>{{ insight.text }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                @click="toggleMacros" 
                                v-if="hasMacros"
                                class="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 transition"
                                :title="showMacros ? 'Hide macros' : 'Show macros'"
                            >
                                <Eye v-if="!showMacros" :size="18" />
                                <EyeOff v-else :size="18" />
                            </button>
                            <button 
                                @click="$emit('edit')" 
                                class="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 transition"
                                title="Edit"
                            >
                                <Edit :size="18" />
                            </button>
                            <button 
                                @click="$emit('delete')" 
                                class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition"
                                title="Delete"
                            >
                                <Trash2 :size="18" />
                            </button>
                        </div>
                    </div>

                    <!-- Macros Display -->
                    <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 -translate-y-1"
                        enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-1"
                    >
                        <div v-if="showMacros && hasMacros" class="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            <div v-if="totalCalories" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <Flame :size="14" class="text-orange-400 flex-shrink-0" />
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Calories</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalCalories }}</div>
                                </div>
                            </div>
                            <div v-if="totalProtein" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <span class="text-sm flex-shrink-0">💪</span>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Protein</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalProtein }}g</div>
                                </div>
                            </div>
                            <div v-if="totalCarbs" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <span class="text-sm flex-shrink-0">🍞</span>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Carbs</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalCarbs }}g</div>
                                </div>
                            </div>
                            <div v-if="totalFat" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <span class="text-sm flex-shrink-0">🧈</span>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Fat</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalFat }}g</div>
                                </div>
                            </div>
                            <div v-if="totalSodium" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <span class="text-sm flex-shrink-0">🧂</span>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Sodium</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalSodium }}mg</div>
                                </div>
                            </div>
                            <div v-if="totalSugar" class="flex items-center gap-2 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <span class="text-sm flex-shrink-0">🍬</span>
                                <div class="min-w-0">
                                    <div class="text-xs text-slate-400">Sugar</div>
                                    <div class="font-semibold text-sm text-slate-200 truncate">{{ totalSugar }}g</div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Clock, Eye, EyeOff, Trash2, Flame, Edit } from 'lucide-vue-next';

const props = defineProps({
    log: { type: Object, required: true },
    userGoals: { type: Object, default: null }
});

defineEmits(['delete', 'edit']);

const showMacros = ref(false);

const servings = computed(() => {
    return props.log.servings || props.log.quantity || 1;
});

const hasMacros = computed(() => {
    return props.log.calories > 0 || props.log.protein > 0 || props.log.carbs > 0 || props.log.fat > 0 || props.log.sodium > 0 || props.log.sugar > 0;
});

const totalCalories = computed(() => {
    const val = (props.log.calories || 0) * servings.value;
    return Math.round(val);
});

const totalProtein = computed(() => {
    const val = (props.log.protein || 0) * servings.value;
    return Math.round(val * 10) / 10;
});

const totalCarbs = computed(() => {
    const val = (props.log.carbs || 0) * servings.value;
    return Math.round(val * 10) / 10;
});

const totalFat = computed(() => {
    const val = (props.log.fat || 0) * servings.value;
    return Math.round(val * 10) / 10;
});

const totalSodium = computed(() => {
    const val = (props.log.sodium || 0) * servings.value;
    return Math.round(val);
});

const totalSugar = computed(() => {
    const val = (props.log.sugar || 0) * servings.value;
    return Math.round(val * 10) / 10;
});

// Calculate insights based on user goals
const insights = computed(() => {
    if (!props.userGoals) return [];
    
    const insights = [];
    
    // Calories insight
    if (totalCalories.value && props.userGoals.calories) {
        const percentage = Math.round((totalCalories.value / props.userGoals.calories) * 100);
        if (percentage >= 50) {
            insights.push({
                emoji: '🔥',
                text: `${percentage}% of daily calories`,
                color: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                label: 'calories-high'
            });
        } else if (percentage >= 25) {
            insights.push({
                emoji: '📊',
                text: `${percentage}% of daily calories`,
                color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                label: 'calories-med'
            });
        } else if (percentage >= 10) {
            insights.push({
                emoji: '✅',
                text: `${percentage}% of daily calories`,
                color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                label: 'calories-low'
            });
        }
    }
    
    // Protein insight
    if (totalProtein.value && props.userGoals.protein) {
        const percentage = Math.round((totalProtein.value / props.userGoals.protein) * 100);
        if (percentage >= 30) {
            insights.push({
                emoji: '💪',
                text: `${percentage}% of daily protein`,
                color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                label: 'protein-high'
            });
        }
    }
    
    // Sodium warning
    if (totalSodium.value && props.userGoals.sodium) {
        const percentage = Math.round((totalSodium.value / props.userGoals.sodium) * 100);
        if (percentage >= 40) {
            insights.push({
                emoji: '⚠️',
                text: `${percentage}% of daily sodium`,
                color: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
                label: 'sodium-warning'
            });
        }
    }
    
    // High sugar warning
    if (totalSugar.value >= 20) {
        insights.push({
            emoji: '🍬',
            text: `High sugar: ${totalSugar.value}g`,
            color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
            label: 'sugar-high'
        });
    }
    
    return insights.slice(0, 3); // Limit to 3 insights max
});

function toggleMacros() {
    showMacros.value = !showMacros.value;
}

function formatTime(date) {
    if (!date) return '';
    return new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

function getTypeEmoji(type) {
    return {
        food: '🍔',
        drink: '🥤',
        snack: '🍿',
        treat: '🍰'
    }[type] || '🍽️';
}

function getMoodEmoji(mood) {
    return {
        delighted: '😍',
        satisfied: '😊',
        neutral: '😐',
        disappointed: '😕',
        regret: '🤢'
    }[mood] || '😐';
}

const badgeClasses = computed(() => ({
    'bg-rose-500/20': props.log.type === 'food',
    'bg-blue-500/20': props.log.type === 'drink',
    'bg-amber-500/20': props.log.type === 'snack',
    'bg-purple-500/20': props.log.type === 'treat'
}));

const borderClasses = computed(() => ({
    'border-l-4 border-rose-500': props.log.type === 'food',
    'border-l-4 border-blue-500': props.log.type === 'drink',
    'border-l-4 border-amber-500': props.log.type === 'snack',
    'border-l-4 border-purple-500': props.log.type === 'treat'
}));

const hoverClasses = computed(() => {
    const shadows = {
        food: 'hover:shadow-rose-500/20',
        drink: 'hover:shadow-blue-500/20',
        snack: 'hover:shadow-amber-500/20',
        treat: 'hover:shadow-purple-500/20'
    };
    return `${shadows[props.log.type] || ''} hover:shadow-xl`;
});
</script>