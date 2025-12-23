<template>
    <div class="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-4 sm:p-6 lg:p-8">
            <!-- Quick Water Logging -->
            <div v-if="!isEditing" class="mb-4 pb-4 border-b border-slate-700">
                <label class="block text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <Droplet :size="16" />
                    Quick Water Log
                </label>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="amount in waterAmounts"
                        :key="amount.ml"
                        @click="logWater(amount.ml)"
                        type="button"
                        class="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all flex items-center gap-2"
                    >
                        <Droplet :size="14" />
                        {{ amount.label }}
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                <!-- Edit Mode Header -->
                <div v-if="isEditing" class="pb-3 border-b border-amber-500/30">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-bold text-amber-400 flex items-center gap-2">
                            <Edit :size="20" />
                            Editing Entry
                        </h3>
                        <button
                            @click="emit('cancel')"
                            type="button"
                            class="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all flex items-center gap-2"
                        >
                            <X :size="16" />
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- Item Input with Autocomplete -->
                <div class="relative">
                    <label for="consumable" class="block text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                        <Utensils :size="16" />
                        What did you consume, goblin?
                    </label>
                    
                    <div class="relative">
                        <input 
                            id="consumable" 
                            v-model="itemInput" 
                            @input="handleItemInput"
                            @keydown="handleKeyDown"
                            @focus="showSuggestions = filteredFoods.length > 0" 
                            @blur="handleBlur" 
                            autocomplete="off"
                            placeholder="Start typing... Pizza, Coffee, etc."
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 pr-10 transition-all h-12" 
                        />
                        <Search v-if="!itemInput" :size="18" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <button 
                            v-else 
                            @click="clearInput"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                        >
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Autocomplete Dropdown -->
                    <Transition
                        enter-active-class="transition duration-150 ease-out"
                        enter-from-class="opacity-0 scale-95"
                        enter-to-class="opacity-100 scale-100"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100 scale-100"
                        leave-to-class="opacity-0 scale-95"
                    >
                        <div 
                            v-if="showSuggestions && filteredFoods.length" 
                            class="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                        >
                            <div
                                v-for="(food, i) in filteredFoods.slice(0, 10)" 
                                :key="food.id"
                                @mousedown.prevent="selectFood(food)"
                                :class="[
                                    'px-4 py-3 cursor-pointer flex items-center justify-between transition-colors',
                                    i === activeIndex 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'text-slate-200 hover:bg-slate-700'
                                ]"
                            >
                                <div class="flex items-center gap-3">
                                    <span class="text-lg">{{ getTypeEmoji(food.type) }}</span>
                                    <div>
                                        <div class="font-medium">{{ food.name }}</div>
                                        <div class="text-xs opacity-75">
                                            <template v-if="food.variants">
                                                {{ food.variants.length }} sizes available
                                            </template>
                                            <template v-else>
                                                {{ food.calories || 0 }} cal • {{ food.protein || 0 }}g protein
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <Flame v-if="food.timesUsed > 5" :size="14" class="text-orange-400" />
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- Grid: Type + Servings + Size -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Type Selector -->
                    <div>
                        <label class="block text-sm font-semibold text-emerald-400 mb-2">
                            Type
                        </label>
                        <Select v-model="log.type">
                            <SelectTrigger class="w-full bg-slate-900/50 border-slate-600 text-slate-100 h-12">
                                <SelectValue placeholder="Select type..." />
                            </SelectTrigger>
                            <SelectContent class="bg-slate-800 border-slate-600">
                                <SelectItem value="food" class="text-slate-100 focus:bg-slate-700">
                                    🍔 Food
                                </SelectItem>
                                <SelectItem value="drink" class="text-slate-100 focus:bg-slate-700">
                                    🥤 Drink
                                </SelectItem>
                                <SelectItem value="snack" class="text-slate-100 focus:bg-slate-700">
                                    🍿 Snack
                                </SelectItem>
                                <SelectItem value="treat" class="text-slate-100 focus:bg-slate-700">
                                    🍰 Treat
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <!-- Size/Variant -->
                    <div>
                        <label for="variant" class="block text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Ruler :size="16" />
                            Size
                        </label>
                        <input 
                            type="text" 
                            id="variant"
                            v-model="log.variant" 
                            @input="handleVariantInput"
                            placeholder="750ml, Large, etc."
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 h-12" 
                        />
                    </div>

                    <!-- Servings -->
                    <div>
                        <label for="servings" class="block text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Hash :size="16" />
                            Servings
                        </label>
                        <input 
                            type="number" 
                            id="servings"
                            v-model.number="log.servings" 
                            min="0.5"
                            step="0.5"
                            placeholder="1"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3 h-12" 
                        />
                    </div>
                </div>

                <!-- Timestamp and Mood Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Timestamp -->
                    <div class="lg:col-span-1">
                        <label for="date" class="block text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                            <Clock :size="16" />
                            When did you devour it?
                        </label>
                        <input 
                            id="date" 
                            type="datetime-local" 
                            v-model="log.timestamp"
                            class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-3" 
                        />
                    </div>

                    <!-- Mood Selector -->
                    <div class="lg:col-span-2">
                        <label class="block text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                            <Smile :size="16" />
                            How did it make you feel?
                        </label>
                        <div class="flex flex-wrap gap-2">
                            <button 
                                v-for="mood in moods" 
                                :key="mood.value" 
                                @click="log.mood = mood.value"
                                type="button"
                                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                :class="log.mood === mood.value
                                    ? 'bg-emerald-500 text-slate-900 shadow-lg scale-105 ring-2 ring-emerald-400'
                                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600 border border-slate-600'"
                            >
                                <span class="text-lg">{{ mood.emoji }}</span>
                                <span>{{ mood.label }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">

                <!-- Macros Toggle -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-slate-700"></div>
                    </div>
                    <div class="relative flex justify-center gap-3">
                        <button 
                            @click="showMacros = !showMacros"
                            type="button"
                            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-emerald-400 bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-emerald-500 transition-all shadow-sm"
                        >
                            <Calculator :size="16" />
                            <span>{{ showMacros ? 'Hide Macros' : 'Add Macros' }}</span>
                            <ChevronDown :size="16" :class="{ 'rotate-180': showMacros }" class="transition-transform duration-300" />
                        </button>

                        <!-- Energy Unit Toggle -->
                        <button
                            v-if="showMacros"
                            @click="toggleEnergyUnit"
                            type="button"
                            class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 transition-all"
                        >
                            {{ energyUnit === 'cal' ? 'Cal' : 'kJ' }}
                            <ArrowLeftRight :size="14" />
                        </button>
                    </div>
                </div>

                <!-- Macros Section -->
                <Transition 
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div v-if="showMacros" class="space-y-3">
                        <p class="text-xs text-slate-400 italic">Per serving (macros will multiply by servings count)</p>
                        <!-- All Macros in One Grid -->
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            <div>
                                <label for="calories" class="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                                    <Flame :size="12" />
                                    {{ energyUnit === 'cal' ? 'Calories' : 'Kilojoules' }}
                                </label>
                                <input 
                                    type="number" 
                                    id="calories" 
                                    placeholder="0" 
                                    min="0" 
                                    step="1"
                                    v-model.number="energyInput"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                                <p v-if="energyUnit === 'kj' && energyInput" class="text-xs text-slate-500 mt-1">
                                    ≈ {{ kjToCal(energyInput) }} cal
                                </p>
                            </div>
                            <div>
                                <label for="protein" class="block text-xs font-medium text-slate-400 mb-1.5">
                                    💪 Protein (g)
                                </label>
                                <input 
                                    type="number" 
                                    id="protein" 
                                    placeholder="0" 
                                    min="0" 
                                    step="0.1"
                                    v-model.number="log.protein"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                            </div>
                            <div>
                                <label for="carbs" class="block text-xs font-medium text-slate-400 mb-1.5">
                                    🍞 Carbs (g)
                                </label>
                                <input 
                                    type="number" 
                                    id="carbs" 
                                    placeholder="0" 
                                    min="0" 
                                    step="0.1"
                                    v-model.number="log.carbs"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                            </div>
                            <div>
                                <label for="fat" class="block text-xs font-medium text-slate-400 mb-1.5">
                                    🧈 Fat (g)
                                </label>
                                <input 
                                    type="number" 
                                    id="fat" 
                                    placeholder="0" 
                                    min="0" 
                                    step="0.1"
                                    v-model.number="log.fat"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                            </div>

                            <!-- Sodium -->
                            <div>
                                <label for="sodium" class="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                                    🧂 Sodium (mg)
                                </label>
                                <input 
                                    type="number" 
                                    id="sodium" 
                                    placeholder="0" 
                                    min="0" 
                                    step="1"
                                    v-model.number="log.sodium"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                            </div>

                            <!-- Sugar -->
                            <div>
                                <label for="sugar" class="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                                    🍬 Sugar (g)
                                </label>
                                <input 
                                    type="number" 
                                    id="sugar" 
                                    placeholder="0" 
                                    min="0" 
                                    step="0.1"
                                    v-model.number="log.sugar"
                                    class="w-full bg-slate-900/50 text-slate-100 rounded-lg border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2 text-sm" 
                                />
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Submit Button -->
                <button 
                    @click="handleSubmit" 
                    :disabled="!isFormValid"
                    class="w-full mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-900 font-bold px-6 py-4 rounded-lg shadow-lg transition-all duration-200 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transform hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2"
                >
                    <Pizza v-if="!isEditing" :size="20" />
                    <Save v-else :size="20" />
                    <span class="text-lg">{{ isEditing ? 'SAVE CHANGES' : 'DEVOUR' }}</span>
                </button>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePersonalStore } from '@/stores/usePersonalStore';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Utensils, 
    Clock, 
    Smile, 
    Calculator, 
    ChevronDown, 
    Search, 
    X, 
    Flame,
    Pizza,
    Hash,
    Ruler,
    ArrowLeftRight,
    Droplet,
    Edit,
    Save
} from 'lucide-vue-next';

const props = defineProps({
    log: Object,
    moods: Array,
    isEditing: { type: Boolean, default: false }
});

const emit = defineEmits(['submit', 'log-water', 'cancel']);

const personalStore = usePersonalStore();

const waterAmounts = [
    { ml: 250, label: '250ml' },
    { ml: 500, label: '500ml' },
    { ml: 750, label: '750ml' },
    { ml: 1000, label: '1L' }
];

const itemInput = ref(props.log.item || '');
const activeIndex = ref(0);
const showSuggestions = ref(false);
const showMacros = ref(false);
const energyUnit = ref('cal');
const energyInput = ref(0);

const filteredFoods = computed(() => {
    return personalStore.searchFoodDatabase(itemInput.value);
});

const isFormValid = computed(() => {
    return itemInput.value.trim() !== '' && props.log.timestamp && props.log.servings > 0;
});

// Initialize energy input based on existing calories
watch(() => props.log.calories, (newVal) => {
    if (energyUnit.value === 'cal') {
        energyInput.value = newVal || 0;
    } else {
        energyInput.value = calToKj(newVal || 0);
    }
}, { immediate: true });

watch(itemInput, () => {
    showSuggestions.value = filteredFoods.value.length > 0;
    activeIndex.value = 0;
});

// Update itemInput when switching to edit mode
watch(() => [props.isEditing, props.log.item], ([isEditing, item]) => {
    if (isEditing && item) {
        itemInput.value = item;
    }
}, { immediate: true });

// Show macros if editing an item with macros
watch(() => props.isEditing, (isEditing) => {
    if (isEditing && (props.log.calories || props.log.protein || props.log.carbs || props.log.fat)) {
        showMacros.value = true;
    } else if (!isEditing) {
        // Reset itemInput when exiting edit mode
        itemInput.value = '';
    }
}, { immediate: true });

function logWater(ml) {
    emit('log-water', ml);
}

function kjToCal(kj) {
    return Math.round(kj / 4.184);
}

function calToKj(cal) {
    return Math.round(cal * 4.184);
}

function toggleEnergyUnit() {
    if (energyUnit.value === 'cal') {
        energyUnit.value = 'kj';
        energyInput.value = calToKj(energyInput.value);
    } else {
        energyUnit.value = 'cal';
        energyInput.value = kjToCal(energyInput.value);
    }
}

function handleItemInput() {
    props.log.item = itemInput.value;
    tryMatchVariant();
}

function handleVariantInput() {
    tryMatchVariant();
}

function tryMatchVariant() {
    if (!itemInput.value || !props.log.variant) return;

    const foodItem = personalStore.foodDatabase.find(
        food => food.name.toLowerCase() === itemInput.value.toLowerCase()
    );

    if (!foodItem) return;

    if (foodItem.variants && foodItem.variants.length > 0) {
        const matchedVariant = foodItem.variants.find(
            v => v.size.toLowerCase() === props.log.variant.toLowerCase()
        );

        if (matchedVariant) {
            props.log.calories = matchedVariant.calories || 0;
            energyInput.value = energyUnit.value === 'cal' ? props.log.calories : calToKj(props.log.calories);
            props.log.protein = matchedVariant.protein || 0;
            props.log.carbs = matchedVariant.carbs || 0;
            props.log.fat = matchedVariant.fat || 0;
            props.log.sodium = matchedVariant.sodium || 0;
            props.log.sugar = matchedVariant.sugar || 0;
            props.log.type = foodItem.type;
            
            if (matchedVariant.calories) {
                showMacros.value = true;
            }
        }
    } else {
        props.log.calories = foodItem.calories || 0;
        energyInput.value = energyUnit.value === 'cal' ? props.log.calories : calToKj(props.log.calories);
        props.log.protein = foodItem.protein || 0;
        props.log.carbs = foodItem.carbs || 0;
        props.log.fat = foodItem.fat || 0;
        props.log.sodium = foodItem.sodium || 0;
        props.log.sugar = foodItem.sugar || 0;
        props.log.type = foodItem.type;
        
        if (foodItem.calories) {
            showMacros.value = true;
        }
    }
}

function selectFood(food) {
    itemInput.value = food.name;
    props.log.item = food.name;
    props.log.type = food.type;
    
    showSuggestions.value = false;
    activeIndex.value = 0;
    
    if (food.variants && food.variants.length === 1) {
        const variant = food.variants[0];
        props.log.variant = variant.size;
        props.log.calories = variant.calories || 0;
        energyInput.value = energyUnit.value === 'cal' ? props.log.calories : calToKj(props.log.calories);
        props.log.protein = variant.protein || 0;
        props.log.carbs = variant.carbs || 0;
        props.log.fat = variant.fat || 0;
        props.log.sodium = variant.sodium || 0;
        props.log.sugar = variant.sugar || 0;
        
        if (variant.calories) {
            showMacros.value = true;
        }
    } else if (!food.variants) {
        props.log.calories = food.calories || 0;
        energyInput.value = energyUnit.value === 'cal' ? props.log.calories : calToKj(props.log.calories);
        props.log.protein = food.protein || 0;
        props.log.carbs = food.carbs || 0;
        props.log.fat = food.fat || 0;
        props.log.sodium = food.sodium || 0;
        props.log.sugar = food.sugar || 0;
        
        if (food.calories) {
            showMacros.value = true;
        }
    }
}

function clearInput() {
    itemInput.value = '';
    props.log.item = '';
    showSuggestions.value = false;
}

function handleKeyDown(e) {
    if (!showSuggestions.value || filteredFoods.value.length === 0) return;
    
    const maxIndex = Math.min(filteredFoods.value.length - 1, 9);
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex.value = Math.min(activeIndex.value + 1, maxIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex.value = Math.max(activeIndex.value - 1, 0);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredFoods.value[activeIndex.value]) {
            selectFood(filteredFoods.value[activeIndex.value]);
        }
    } else if (e.key === 'Escape') {
        showSuggestions.value = false;
    } else if (e.key === 'Tab') {
        if (filteredFoods.value[activeIndex.value]) {
            e.preventDefault();
            selectFood(filteredFoods.value[activeIndex.value]);
        }
    }
}

function handleBlur() {
    setTimeout(() => (showSuggestions.value = false), 150);
}

function handleSubmit() {
    if (isFormValid.value) {
        // Convert kJ to calories before submitting
        if (energyUnit.value === 'kj') {
            props.log.calories = kjToCal(energyInput.value);
        } else {
            props.log.calories = energyInput.value;
        }
        
        emit('submit');
        
        if (!props.isEditing) {
            itemInput.value = '';
            showMacros.value = false;
            energyInput.value = 0;
            energyUnit.value = 'cal';
        }
    }
}

function getTypeEmoji(type) {
    return {
        food: '🍔',
        drink: '🥤',
        snack: '🍿',
        treat: '🍰'
    }[type] || '🍽️';
}
</script>