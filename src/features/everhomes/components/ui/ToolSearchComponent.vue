<template>
    <div class="relative w-full">
        <label for="tool-search" class="sr-only">Search tools</label>

        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />

        <input
            id="tool-search"
            v-model="internalValue"
            type="text"
            placeholder="Search tools..."
            class="w-full pl-10 pr-9 py-2.5 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all duration-200"
            style="background: #0f1e30; border: 1px solid rgba(255,255,255,0.12);"
            @input="onInput"
            @keydown.enter="emitSearch"
        />

        <button
            v-if="internalValue"
            @click="clearInput"
            aria-label="Clear search"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors"
        >
            <X class="w-3.5 h-3.5" />
        </button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
    modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'search'])
const internalValue = ref(props.modelValue)

watch(() => props.modelValue, val => { internalValue.value = val })

function onInput() { emit('update:modelValue', internalValue.value) }
function emitSearch() { emit('search', internalValue.value) }
function clearInput() {
    internalValue.value = ''
    emit('update:modelValue', '')
    emit('search', '')
}
</script>
