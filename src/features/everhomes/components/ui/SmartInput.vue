<template>
    <div class="w-full">
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>

        <label class="group relative w-full flex items-center cursor-text" :class="{ 'opacity-60': disabled }">
            <!-- Prefix icon/slot -->
            <span v-if="prefix"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 group-hover:text-teal-500 transition">
                {{ prefix }}
            </span>

            <!-- Dynamic input -->
            <component :is="inputTag" v-model="modelValueLocal" v-bind="inputAttrs" :class="inputClass" class="w-full"
                :disabled="disabled" @input="update" @change="update">
                <!-- Options for select -->
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </component>
        </label>

        <!-- Hint or helper -->
        <p v-if="hint" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
    modelValue: [String, Number, Date],
    type: {
        type: String,
        default: 'text' // text | number | date | select | currency
    },
    label: String,
    placeholder: String,
    disabled: Boolean,
    prefix: String,
    hint: String,
    step: [String, Number],
    min: [String, Number],
    max: [String, Number],
    options: {
        type: Array,
        default: () => [] // for select: [{ label, value }]
    }
})

const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)
const modelValueLocal = computed({
    get: () => modelValue.value,
    set: (val) => emit('update:modelValue', val)
})

const inputTag = computed(() => {
    return props.type === 'select' ? 'select' : 'input'
})

const inputAttrs = computed(() => {
    const base = {
        placeholder: props.placeholder || '',
        step: props.step,
        min: props.min,
        max: props.max,
        type: props.type === 'currency' ? 'number' : props.type
    }
    return base
})

const inputClass = computed(() => {
    return [
        props.prefix ? 'pl-7' : 'pl-3',
        'pr-3 py-2 text-gray-700 border border-gray-300 rounded-md',
        'group-focus-within:ring-2 group-focus-within:ring-teal-500',
        'focus:outline-none placeholder-gray-400 transition'
    ].join(' ')
})

function update(e) {
    emit('update:modelValue', e?.target?.value ?? e)
}
</script>