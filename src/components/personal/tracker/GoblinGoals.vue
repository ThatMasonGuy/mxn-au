<template>
    <div class="space-y-6">
        <!-- Daily Goals Card -->
        <div class="bg-gradient-to-br from-amber-900/30 to-slate-800 rounded-xl p-6 lg:p-8 border border-amber-500/30 shadow-xl">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-amber-400 flex items-center gap-2">
                    <Target :size="24" />
                    Daily Goals
                </h2>
                <button
                    @click="saveGoals"
                    :disabled="!isEditingGoals"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    :class="isEditingGoals 
                        ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-600' 
                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'"
                    @mouseenter="isEditingGoals = true"
                >
                    {{ isEditingGoals ? 'Save Goals' : 'Edit Goals' }}
                </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <!-- Calories -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <Flame :size="16" class="text-orange-400" />
                        <span class="text-xs text-slate-400">Calories</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.calories"
                        min="0"
                        step="50"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.calories || '—' }}
                    </div>
                </div>

                <!-- Protein -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-base">💪</span>
                        <span class="text-xs text-slate-400">Protein (g)</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.protein"
                        min="0"
                        step="5"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.protein || '—' }}
                    </div>
                </div>

                <!-- Carbs -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-base">🍞</span>
                        <span class="text-xs text-slate-400">Carbs (g)</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.carbs"
                        min="0"
                        step="5"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.carbs || '—' }}
                    </div>
                </div>

                <!-- Fat -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-base">🧈</span>
                        <span class="text-xs text-slate-400">Fat (g)</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.fat"
                        min="0"
                        step="5"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.fat || '—' }}
                    </div>
                </div>

                <!-- Water -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <Droplet :size="16" class="text-blue-400" />
                        <span class="text-xs text-slate-400">Water (L)</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.water"
                        min="0"
                        step="0.5"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.water || '—' }}
                    </div>
                </div>

                <!-- Sodium -->
                <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-base">🧂</span>
                        <span class="text-xs text-slate-400">Sodium (mg)</span>
                    </div>
                    <input
                        v-if="isEditingGoals"
                        type="number"
                        v-model.number="goals.sodium"
                        min="0"
                        step="100"
                        class="w-full bg-slate-800 text-slate-100 rounded px-2 py-1 text-lg font-bold border border-slate-600 focus:ring-2 focus:ring-amber-400"
                    />
                    <div v-else class="text-2xl font-bold text-slate-100">
                        {{ goals.sodium || '—' }}
                    </div>
                </div>
            </div>

            <p class="mt-4 text-xs text-slate-500 italic">
                💡 Tip: Goals will be used in Stats view to show your progress. Future: Exercise tracking will adjust these dynamically!
            </p>
        </div>

        <!-- Experimental Calculator -->
        <div class="bg-gradient-to-br from-purple-900/30 to-slate-800 rounded-xl p-6 lg:p-8 border border-purple-500/30 shadow-xl">
            <div class="flex items-center gap-2 mb-2">
                <Calculator :size="24" class="text-purple-400" />
                <h2 class="text-2xl font-bold text-purple-400">
                    Experimental Calculator
                </h2>
            </div>
            <p class="text-sm text-slate-400 mb-6">
                <AlertTriangle :size="14" class="inline mr-1 text-amber-400" />
                This is an estimate. Consult a healthcare professional for personalized advice.
            </p>

            <div class="space-y-6">
                <!-- Personal Info Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <!-- Gender -->
                    <div>
                        <label class="block text-sm font-medium text-purple-300 mb-2">
                            Gender
                        </label>
                        <Select v-model="calcData.gender" @update:modelValue="saveCalcData">
                            <SelectTrigger class="w-full bg-slate-900/50 border-slate-600 text-slate-100">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent class="bg-slate-800 border-slate-600">
                                <SelectItem value="male" class="text-slate-100 focus:bg-slate-700">Male</SelectItem>
                                <SelectItem value="female" class="text-slate-100 focus:bg-slate-700">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- Age -->
                    <div>
                        <label for="age" class="block text-sm font-medium text-purple-300 mb-2">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            v-model.number="calcData.age"
                            @input="saveCalcData"
                            min="15"
                            max="100"
                            placeholder="25"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-purple-500 px-3 py-2"
                        />
                    </div>

                    <!-- Height -->
                    <div>
                        <label for="height" class="block text-sm font-medium text-purple-300 mb-2">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            id="height"
                            v-model.number="calcData.height"
                            @input="saveCalcData"
                            min="100"
                            max="250"
                            placeholder="175"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-purple-500 px-3 py-2"
                        />
                    </div>

                    <!-- Current Weight -->
                    <div>
                        <label for="weight" class="block text-sm font-medium text-purple-300 mb-2">
                            Current Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            v-model.number="calcData.weight"
                            @input="saveCalcData"
                            min="30"
                            max="300"
                            step="0.1"
                            placeholder="70"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-purple-500 px-3 py-2"
                        />
                    </div>

                    <!-- Goal Weight -->
                    <div>
                        <label for="goalWeight" class="block text-sm font-medium text-purple-300 mb-2">
                            Goal Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="goalWeight"
                            v-model.number="calcData.goalWeight"
                            @input="saveCalcData"
                            min="30"
                            max="300"
                            step="0.1"
                            placeholder="65"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-purple-500 px-3 py-2"
                        />
                    </div>

                    <!-- Target Date -->
                    <div>
                        <label for="targetDate" class="block text-sm font-medium text-purple-300 mb-2">
                            Target Date
                        </label>
                        <input
                            type="date"
                            id="targetDate"
                            v-model="calcData.targetDate"
                            @input="saveCalcData"
                            :min="minTargetDate"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-purple-500 px-3 py-2"
                        />
                    </div>
                </div>

                <!-- Calculate Button -->
                <button
                    @click="calculate"
                    :disabled="!canCalculate"
                    class="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                    <Calculator :size="18" />
                    Calculate Recommended Calories
                </button>

                <!-- Results -->
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-2"
                >
                    <div v-if="results" class="space-y-4">
                        <!-- Warning Card -->
                        <div 
                            v-if="results.warning"
                            class="rounded-xl p-4 border-2"
                            :class="{
                                'bg-rose-500/10 border-rose-500': results.warning.severity === 'danger',
                                'bg-amber-500/10 border-amber-500': results.warning.severity === 'warning',
                                'bg-blue-500/10 border-blue-500': results.warning.severity === 'info'
                            }"
                        >
                            <h3 class="font-bold mb-2" :class="{
                                'text-rose-400': results.warning.severity === 'danger',
                                'text-amber-400': results.warning.severity === 'warning',
                                'text-blue-400': results.warning.severity === 'info'
                            }">
                                {{ results.warning.title }}
                            </h3>
                            <p class="text-sm text-slate-300">{{ results.warning.message }}</p>
                        </div>

                        <!-- Results Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <p class="text-xs text-slate-400 mb-1">Maintenance Calories</p>
                                <p class="text-3xl font-bold text-slate-200">{{ results.maintenance }} cal/day</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                                <p class="text-xs text-slate-400 mb-1">Weight Change</p>
                                <p class="text-3xl font-bold" :class="parseFloat(results.weightChange) < 0 ? 'text-emerald-400' : 'text-blue-400'">
                                    {{ results.weightChange > 0 ? '+' : '' }}{{ results.weightChange }} kg
                                </p>
                                <p class="text-xs text-slate-500 mt-1">{{ results.weeklyRate }} kg/week</p>
                            </div>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                            <p class="text-xs text-slate-400 mb-1">Recommended Daily Calories</p>
                            <p class="text-3xl font-bold text-amber-400">{{ results.recommended }} cal/day</p>
                        </div>

                        <!-- Copy to Goals Button -->
                        <button
                            @click="copyToGoals"
                            class="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Copy :size="16" />
                            Copy Recommended Calories to Goals
                        </button>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePersonalStore } from '@/stores/usePersonalStore';
import { 
    Target, 
    Flame, 
    Calculator, 
    AlertTriangle,
    Copy,
    Droplet
} from 'lucide-vue-next';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';

const personalStore = usePersonalStore();

const isEditingGoals = ref(false);
const goals = ref({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    water: 3,
    sodium: 2300
});

const calcData = ref({
    gender: 'male',
    age: null,
    height: null,
    weight: null,
    goalWeight: null,
    targetDate: ''
});

const results = ref(null);

const minTargetDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const canCalculate = computed(() => {
    return calcData.value.gender &&
        calcData.value.age &&
        calcData.value.height &&
        calcData.value.weight &&
        calcData.value.goalWeight &&
        calcData.value.targetDate;
});

onMounted(async () => {
    // Load goals from store
    await personalStore.loadGoals();
    if (personalStore.userGoals) {
        goals.value = { ...personalStore.userGoals };
    }
    
    // Load calculator data from localStorage
    loadCalcData();
});

function saveCalcData() {
    try {
        localStorage.setItem('goblinCalcData', JSON.stringify(calcData.value));
    } catch (error) {
        console.error('[ERROR] Failed to save calc data to localStorage:', error);
    }
}

function loadCalcData() {
    try {
        const saved = localStorage.getItem('goblinCalcData');
        if (saved) {
            calcData.value = JSON.parse(saved);
        }
    } catch (error) {
        console.error('[ERROR] Failed to load calc data from localStorage:', error);
    }
}

async function saveGoals() {
    await personalStore.saveGoals(goals.value);
    isEditingGoals.value = false;
}

function calculate() {
    if (!canCalculate.value) return;

    const { gender, age, height, weight, goalWeight, targetDate } = calcData.value;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Assume moderate activity (1.55 multiplier)
    const maintenance = Math.round(bmr * 1.55);

    // Calculate weight change needed
    const weightChange = goalWeight - weight;

    // Calculate weeks until target date
    const now = new Date();
    const target = new Date(targetDate);
    const weeksUntilTarget = Math.max(1, (target - now) / (1000 * 60 * 60 * 24 * 7));

    // Calculate weekly rate
    const weeklyRate = Math.abs(weightChange / weeksUntilTarget);

    // 1kg of fat = ~7700 calories
    const totalCalorieChange = weightChange * 7700;
    const dailyCalorieChange = Math.round(totalCalorieChange / (weeksUntilTarget * 7));
    const recommended = maintenance + dailyCalorieChange;

    // Determine safety warnings
    let warning = null;

    if (weeklyRate > 1) {
        warning = {
            severity: 'danger',
            title: '⚠️ DANGEROUS RATE',
            message: `${weeklyRate.toFixed(2)} kg/week is extremely unhealthy and dangerous. Recommended: 0.5-1 kg/week max. This rate can cause serious health issues including muscle loss, nutritional deficiencies, and metabolic damage. Please extend your timeline.`
        };
    } else if (weeklyRate > 0.75) {
        warning = {
            severity: 'warning',
            title: '⚠️ Aggressive Rate',
            message: `${weeklyRate.toFixed(2)} kg/week is quite aggressive. While possible, it may be difficult to sustain. Consider 0.5-0.75 kg/week for better adherence and health.`
        };
    } else if (weeklyRate < 0.25) {
        warning = {
            severity: 'info',
            title: 'ℹ️ Very Slow Rate',
            message: `${weeklyRate.toFixed(2)} kg/week is very gradual. This is perfectly safe but may test your patience. You could achieve your goal faster if desired.`
        };
    }

    // Additional check for very low calories
    if (recommended < 1200 && gender === 'female') {
        warning = {
            severity: 'danger',
            title: '⚠️ DANGEROUSLY LOW CALORIES',
            message: `${recommended} calories/day is far too low for women (minimum 1200). This will cause serious health problems. Please extend your timeline significantly.`
        };
    } else if (recommended < 1500 && gender === 'male') {
        warning = {
            severity: 'danger',
            title: '⚠️ DANGEROUSLY LOW CALORIES',
            message: `${recommended} calories/day is far too low for men (minimum 1500). This will cause serious health problems. Please extend your timeline significantly.`
        };
    }

    results.value = {
        maintenance,
        weightChange: weightChange.toFixed(1),
        weeklyRate: weeklyRate.toFixed(2),
        recommended,
        warning
    };
}

async function copyToGoals() {
    if (results.value) {
        goals.value.calories = results.value.recommended;
        
        // Simple macro calculation (40% carbs, 30% protein, 30% fat)
        const calsFromCarbs = results.value.recommended * 0.4;
        const calsFromProtein = results.value.recommended * 0.3;
        const calsFromFat = results.value.recommended * 0.3;
        
        goals.value.protein = Math.round(calsFromProtein / 4);
        goals.value.carbs = Math.round(calsFromCarbs / 4);
        goals.value.fat = Math.round(calsFromFat / 9);
        
        // Calculate water goal based on weight (35ml per kg)
        goals.value.water = Math.round((calcData.value.weight * 35 / 1000) * 2) / 2; // Round to nearest 0.5L
        
        // Sodium goal (recommended 2300mg/day)
        goals.value.sodium = 2300;
        
        await saveGoals();
        isEditingGoals.value = false;
        
        // Scroll to top to show goals
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
</script>