<template>
    <div class="theme-switcher">
        <div class="flex space-x-2 items-center">
            <span class="text-sm font-medium">Theme:</span>
            <div class="inline-flex rounded-md shadow-sm" role="group">
                <button v-for="option in themeOptions" :key="option.value" type="button"
                    class="px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :class="getButtonClasses(option.value)" @click="updateTheme(option.value)">
                    {{ option.label }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: 'light'
    }
})

const emit = defineEmits(['update:modelValue'])

const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Light+', value: 'lightColour' },
    { label: 'Dark+', value: 'darkColour' }
]

const updateTheme = (value) => {
    emit('update:modelValue', value)
}

const getButtonClasses = (value) => {
    const isActive = value === props.modelValue

    const baseClasses = 'first:rounded-l-md last:rounded-r-md border'

    // Basic inactive button styling
    if (!isActive) {
        return `${baseClasses} text-gray-700 bg-white border-gray-300 hover:bg-gray-100`
    }

    // Active button styling based on theme
    switch (value) {
        case 'light':
            return `${baseClasses} bg-gray-100 text-gray-700 border-gray-300`
        case 'dark':
            return `${baseClasses} bg-gray-800 text-white border-gray-600`
        case 'lightColour':
            return `${baseClasses} bg-indigo-100 text-indigo-700 border-indigo-300`
        case 'darkColour':
            return `${baseClasses} bg-indigo-700 text-white border-indigo-600`
        default:
            return `${baseClasses} bg-indigo-600 text-white border-indigo-500`
    }
}
</script>

<style scoped>
.theme-switcher {
    margin: 0.75rem 0;
}
</style>