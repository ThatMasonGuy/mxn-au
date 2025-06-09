<template>
    <div class="w-full">
        <div class="flex items-center justify-between">
            <Label v-if="label">
                {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
            </Label>
            <slot name="label-extra" />
        </div>

        <div class="relative group w-full">
            <Tooltip v-if="hint">
                <TooltipTrigger as-child>
                    <div class="absolute top-1/2 right-2 -translate-y-1/2">
                        <InfoIcon class="w-4 h-4 text-gray-400 hover:text-teal-500 transition" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>{{ hint }}</TooltipContent>
            </Tooltip>

            <div class="flex items-center w-full relative">
                <span v-if="prefix"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 group-hover:text-teal-500 transition">
                    {{ prefix }}
                </span>

                <slot name="icon" />

                <!-- SINGLE SELECT DROPDOWN (old way, only for type 'select') -->
                <Select v-if="type === 'select'" :modelValue="modelValue"
                    @update:modelValue="emit('update:modelValue', $event)">
                    <SelectTrigger
                        class="bg-gray-700/50 border border-gray-600 text-white h-[48px] px-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-indigo-500/10 shadow-md hover:shadow-md hover:shadow-indigo-500/40 focus:shadow-indigo-500/40 focus:shadow-md"
                        :disabled="disabled">
                        <SelectValue :placeholder="placeholder || 'Select option'" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="opt in options" :key="opt.value" :value="opt.value"
                            @pointerup="() => !multiple && blurSelect()">
                            {{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <!-- MULTISELECT CHECKBOX DROPDOWN -->
                <DropdownMenu v-else-if="type === 'multiselect'">
                    <DropdownMenuTrigger
                        class="bg-gray-700/50 border border-gray-600 text-white h-[48px] px-3 rounded-lg w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-indigo-500/10 shadow-md hover:shadow-md hover:shadow-indigo-500/40 focus:shadow-indigo-500/40 focus:shadow-md"
                        :disabled="disabled">
                        <span>
                            {{ selectedLabels.length > 0 ? selectedLabels.join(', ') : (placeholder || 'Select options')
                            }}
                        </span>
                        <ChevronDownIcon class="w-4 h-4 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuCheckboxItem v-for="opt in options" :key="opt.value"
                            :checked="modelValueLocal.includes(opt.value)" @update:checked="toggleCheckbox(opt.value)">
                            {{ opt.label }}
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- STANDARD INPUTS -->
                <Input v-else v-model="modelValueLocal" :type="type === 'currency' ? 'number' : type"
                    :placeholder="placeholder" :disabled="disabled" :required="required" :step="step" :min="min"
                    :max="max"
                    :class="[inputPadding, error ? 'border-red-500' : '', 'bg-gray-700/50 border border-gray-600 text-white h-[48px] pr-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-indigo-500/10 shadow-md hover:shadow-md hover:shadow-indigo-500/40 focus:shadow-indigo-500/40 focus:shadow-md']"
                    @blur="handleBlur" />

                <button v-if="clearable && modelValueLocal && !disabled && type !== 'select'"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500" @click="clear">
                    &times;
                </button>
            </div>

            <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select'
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import {
    Tooltip, TooltipTrigger, TooltipContent
} from '@/components/ui/tooltip'
import { InfoIcon, ChevronDownIcon } from 'lucide-vue-next'

const props = defineProps({
    modelValue: [String, Number, Date, Array],
    type: { type: String, default: 'text' },
    label: String,
    placeholder: String,
    disabled: Boolean,
    required: Boolean,
    prefix: String,
    suffix: String,
    hint: String,
    error: String,
    step: [String, Number],
    min: [String, Number],
    max: [String, Number],
    clearable: Boolean,
    trimOnBlur: Boolean,
    options: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])
const { modelValue } = toRefs(props)

const modelValueLocal = computed({
    get: () => {
        // Use array for multiselect, otherwise passthrough
        if (props.type === 'multiselect') {
            return Array.isArray(modelValue.value) ? modelValue.value : []
        }
        return modelValue.value
    },
    set: (val) => emit('update:modelValue', val)
})

const selectedLabels = computed(() => {
    if (props.type !== 'multiselect' || !Array.isArray(modelValueLocal.value)) return []
    return props.options
        .filter(opt => modelValueLocal.value.includes(opt.value))
        .map(opt => opt.label)
})

const inputPadding = computed(() => (props.prefix ? 'pl-7' : 'pl-3'))

function clear() {
    emit('update:modelValue', props.type === 'multiselect' ? [] : '')
}

function handleBlur(e) {
    if (props.trimOnBlur && typeof e.target?.value === 'string') {
        emit('update:modelValue', e.target.value.trim())
    }
}

function blurSelect() {
    requestAnimationFrame(() => {
        const active = document.activeElement
        if (active && typeof active.blur === 'function') {
            active.blur()
        }
    })
}

// Multi-select checkbox logic
function toggleCheckbox(value) {
    let updated = Array.isArray(modelValueLocal.value) ? [...modelValueLocal.value] : []
    const idx = updated.indexOf(value)
    if (idx === -1) updated.push(value)
    else updated.splice(idx, 1)
    emit('update:modelValue', updated)
}
</script>