<template>
    <div class="relative w-full md:w-72">
        <label for="tool-search" class="sr-only">Search tools</label>

        <input id="tool-search" v-model="internalValue" type="text" placeholder="Search tools..."
            :aria-label="'Search tools'" :aria-describedby="'tool-search-desc'"
            class="w-full pl-10 pr-8 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
            @input="onInput" @keydown.enter="emitSearch" />

        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none"
            aria-hidden="true" />

        <button v-if="internalValue" @click="clearInput" aria-label="Clear search"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50">
            <XMarkIcon class="w-4 h-4 text-white/70" />
        </button>

        <p id="tool-search-desc" class="sr-only">
            Enter a keyword to filter the tools on this page.
        </p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
    modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'search'])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, newVal => {
    internalValue.value = newVal
})

// === Emit debounced search ===
function onInput() {
    emit('update:modelValue', internalValue.value)
}

// === Emit immediately on Enter key ===
function emitSearch() {
    emit('search', internalValue.value)
}

// === Clear field ===
function clearInput() {
    internalValue.value = ''
    emit('update:modelValue', '')
    emit('search', '')
}
</script>