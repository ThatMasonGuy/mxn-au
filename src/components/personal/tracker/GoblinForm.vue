// GoblinForm.vue
<template>
    <div class="bg-slate-800 rounded-lg shadow-lg mb-8 overflow-hidden">
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- What did you consume -->
                <div class="relative">
                    <label for="consumable" class="block text-sm font-medium text-slate-300 mb-2">
                        What did you consume, goblin?
                    </label>
                    <input id="consumable" v-model="itemInput" @input="updateItem" @keydown="handleKeyDown"
                        @keydown.tab.prevent="selectAutocompleteItem($event)"
                        @focus="showSuggestions = filteredItems.length > 0" @blur="handleBlur" autocomplete="off"
                        placeholder="Pizza, Coffee, Human Souls..."
                        class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />

                    <ul v-if="showSuggestions && filteredItems.length" role="listbox"
                        class="bg-slate-800 border border-slate-600 rounded-md mt-1 text-sm max-h-40 overflow-y-auto absolute z-50 w-full">
                        <li v-for="(item, i) in filteredItems" :key="item" role="option"
                            @mousedown.prevent="chooseItem(item)" :class="[
                                'px-4 py-2 cursor-pointer',
                                i === activeIndex ? 'bg-emerald-600 text-slate-900' : 'text-slate-300 hover:bg-slate-700'
                            ]">
                            {{ item }}
                        </li>
                    </ul>
                </div>

                <!-- Type selector -->
                <div>
                    <label for="type" class="block text-sm font-medium text-slate-300 mb-2">
                        Type
                    </label>
                    <select id="type" v-model="log.type"
                        class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2">
                        <option value="food">Food</option>
                        <option value="drink">Drink</option>
                        <option value="snack">Snack</option>
                        <option value="treat">Treat</option>
                    </select>
                </div>

                <!-- When did you eat it -->
                <div>
                    <label for="date" class="block text-sm font-medium text-slate-300 mb-2">
                        When did you devour it?
                    </label>
                    <input id="date" type="datetime-local" v-model="log.timestamp"
                        class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />
                </div>

                <!-- Quantity -->
                <div>
                    <label for="quantity" class="block text-sm font-medium text-slate-300 mb-2">
                        How much?
                    </label>
                    <div class="flex space-x-2">
                        <input id="quantity" type="number" v-model.number="log.quantity" min="1"
                            class="w-20 bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2" />
                        <select v-model="log.unit"
                            class="flex-1 bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2">
                            <option value="piece">piece(s)</option>
                            <option value="cup">cup(s)</option>
                            <option value="bowl">bowl(s)</option>
                            <option value="plate">plate(s)</option>
                            <option value="serving">serving(s)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Mood Selector -->
            <div class="mt-6">
                <label class="block text-sm font-medium text-slate-300 mb-3">
                    How did it make you feel?
                </label>
                <div class="flex flex-wrap gap-2">
                    <button v-for="mood in moods" :key="mood.value" @click="selectMood(mood.value)"
                        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1"
                        :class="log.mood === mood.value
                            ? 'bg-emerald-500 text-slate-900 shadow-md scale-105'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'" type="button">
                        <span class="text-lg">{{ mood.emoji }}</span>
                        <span>{{ mood.label }}</span>
                    </button>
                </div>
            </div>

            <!-- Styled Divider + Toggle Button -->
            <div class="mt-12 relative text-center">
                <div class="border-t border-slate-700"></div>

                <button @click="showMacros = !showMacros"
                    class="relative -top-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-emerald-400 border border-slate-600 bg-slate-700 hover:bg-slate-600 hover:border-slate-500 hover:text-emerald-300 transition duration-200 shadow-sm">
                    <span>{{ showMacros ? 'Hide Macros' : 'Add Macros' }}</span>
                    <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': showMacros }"
                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <!-- Macros Section -->
            <Transition name="fade-slide" enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95">
                <div v-if="showMacros" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div v-for="(field, index) in macroFields" :key="index">
                        <label :for="field.key" class="block text-xs font-medium text-slate-300 mb-1">
                            {{ field.label }}
                        </label>
                        <input type="number" :id="field.key" :placeholder="field.placeholder" min="0" step="any"
                            v-model.number="log[field.key]"
                            class="w-full bg-slate-700 text-slate-200 rounded-md border-slate-600 focus:ring-2 focus:ring-amber-400 px-3 py-2" />
                    </div>
                </div>
            </Transition>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-center">
                <button @click="$emit('submit')" :disabled="!isFormValid"
                    class="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0">
                    DEVOUR
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    log: Object,
    moods: Array,
    previousItems: Array,
});

const emit = defineEmits(['update:item', 'submit', 'update:mood']);

const itemInput = ref(props.log.item);
const activeIndex = ref(0);
const showSuggestions = ref(false);
const showMacros = ref(false);

const macroFields = [
    { key: 'calories', label: 'Calories (kcal)', placeholder: 'e.g. 350' },
    { key: 'protein', label: 'Protein (g)', placeholder: 'e.g. 20' },
    { key: 'carbs', label: 'Carbs (g)', placeholder: 'e.g. 30' },
    { key: 'fat', label: 'Fat (g)', placeholder: 'e.g. 12' }
];

const filteredItems = computed(() => {
    const input = itemInput.value.trim().toLowerCase();
    return input ? props.previousItems.filter(i => i.toLowerCase().includes(input)) : [];
});

watch(itemInput, () => {
    showSuggestions.value = filteredItems.value.length > 0;
    activeIndex.value = 0;
});

function updateItem() {
    emit('update:item', itemInput.value);
}

function chooseItem(item) {
    itemInput.value = item;
    emit('update:item', item);
    showSuggestions.value = false;
    activeIndex.value = 0;
    document.getElementById('consumable')?.blur();
}

function selectAutocompleteItem(e) {
    if (showSuggestions.value && filteredItems.value[activeIndex.value]) {
        e.preventDefault();
        chooseItem(filteredItems.value[activeIndex.value]);
    }
}

function handleKeyDown(e) {
    if (!showSuggestions.value || filteredItems.value.length === 0) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % filteredItems.value.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length;
    } else if (e.key === 'Enter') {
        e.preventDefault();
        selectAutocompleteItem(e);
    } else if (e.key === 'Escape') {
        showSuggestions.value = false;
    }
}

function handleBlur() {
    setTimeout(() => (showSuggestions.value = false), 100);
}

function selectMood(mood) {
    emit('update:mood', mood);
}

const isFormValid = computed(() => itemInput.value.trim() !== '' && props.log.timestamp);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: scale(0.97);
}
</style>