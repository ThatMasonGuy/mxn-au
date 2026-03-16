<template>
    <button
        @click="toggle"
        :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
            modelValue ? 'bg-violet-600' : 'bg-zinc-700'
        ]"
        role="switch"
        :aria-checked="modelValue"
    >
        <span
            :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                modelValue ? 'translate-x-6' : 'translate-x-1'
            ]"
        />
    </button>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
    emit('update:modelValue', !props.modelValue)
}
</script>
