<template>
    <div class="w-full">
        <!-- Trigger Button -->
        <button @click="isOpen = true" :class="[
            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
            hasActiveFilter
                ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                : 'border-border bg-card hover:bg-muted text-muted-foreground'
        ]">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <Filter class="w-4 h-4" />
                    <span class="text-sm font-medium">
                        {{ hasActiveFilter ? 'Score: ' + filterSummary : 'Score Filter' }}
                    </span>
                </div>
                <ChevronRight class="w-4 h-4" />
            </div>
        </button>

        <!-- Modal Dialog -->
        <Dialog v-model:open="isOpen">
            <DialogContent class="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Score Filter</DialogTitle>
                    <DialogDescription>
                        Filter players by their score. Choose between total score or individual daily scores.
                    </DialogDescription>
                </DialogHeader>

                <div class="space-y-6 py-4">
                    <!-- Operator Selection -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground">Operator</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button @click="local.operator = 'gte'" :class="[
                                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200',
                                local.operator === 'gte'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50 hover:bg-muted'
                            ]">
                                <ChevronUp class="w-5 h-5" />
                                <div class="text-left">
                                    <div class="font-semibold">Greater Than</div>
                                    <div class="text-xs opacity-70">≥</div>
                                </div>
                            </button>

                            <button @click="local.operator = 'lte'" :class="[
                                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200',
                                local.operator === 'lte'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50 hover:bg-muted'
                            ]">
                                <ChevronDown class="w-5 h-5" />
                                <div class="text-left">
                                    <div class="font-semibold">Less Than</div>
                                    <div class="text-xs opacity-70">≤</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Value Input -->
                    <div v-if="local.operator" class="space-y-2">
                        <label class="text-sm font-medium text-foreground">Score Value</label>
                        <div class="relative">
                            <input v-model="inputText" @input="handleInput" 
                                type="text"
                                inputmode="numeric"
                                placeholder="e.g., 1500000 or 2000000"
                                class="w-full pl-4 pr-16 py-3 rounded-lg bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                            <span class="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-muted-foreground pointer-events-none">
                                points
                            </span>
                        </div>
                        <p v-if="local.value !== null" class="text-xs text-muted-foreground">
                            Formatted: <span class="font-medium">{{ formatNumber(local.value) }}</span>
                        </p>
                    </div>

                    <!-- Mode Selection -->
                    <div v-if="local.operator && local.value !== null" class="space-y-2">
                        <label class="text-sm font-medium text-foreground">Apply To</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button @click="local.mode = 'total'" :class="[
                                'px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left',
                                local.mode === 'total'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50 hover:bg-muted'
                            ]">
                                <div class="font-semibold">Total Score</div>
                                <div class="text-xs opacity-70 mt-0.5">Sum of all days</div>
                            </button>

                            <button @click="local.mode = 'each'" :class="[
                                'px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left',
                                local.mode === 'each'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border hover:border-primary/50 hover:bg-muted'
                            ]">
                                <div class="font-semibold">Each Day</div>
                                <div class="text-xs opacity-70 mt-0.5">Every day individually</div>
                            </button>
                        </div>
                    </div>

                    <!-- Preview -->
                    <div v-if="hasActiveFilter" class="p-4 rounded-lg bg-muted/50 border border-border">
                        <div class="text-xs font-medium text-muted-foreground mb-1">Active Filter</div>
                        <div class="text-sm font-semibold text-foreground">{{ filterSummary }}</div>
                    </div>
                </div>

                <DialogFooter class="gap-2">
                    <button v-if="hasActiveFilter" @click="clear" 
                        class="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                        Clear Filter
                    </button>
                    <button @click="apply"
                        :disabled="!local.operator || local.value === null"
                        class="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Apply Filter
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, reactive, watch, ref } from 'vue'
import { Filter, ChevronRight, ChevronUp, ChevronDown } from 'lucide-vue-next'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ operator: '', value: null, mode: 'total' })
    }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const inputText = ref('')

const local = reactive({
    operator: props.modelValue?.operator ?? '',
    value: props.modelValue?.value ?? null,
    mode: props.modelValue?.mode ?? 'total'
})

// Sync with parent
watch(() => props.modelValue, (nv) => {
    local.operator = nv?.operator ?? ''
    local.value = nv?.value ?? null
    local.mode = nv?.mode ?? 'total'
    if (local.value !== null) {
        inputText.value = String(local.value)
    }
}, { immediate: true })

const hasActiveFilter = computed(() => 
    local.operator && local.value !== null
)

const symbol = computed(() => 
    local.operator === 'gte' ? '≥' : local.operator === 'lte' ? '≤' : ''
)

const filterSummary = computed(() => {
    if (!hasActiveFilter.value) return ''
    const modeText = local.mode === 'each' ? 'each day' : 'total'
    return `${symbol.value} ${formatNumber(local.value)} (${modeText})`
})

function handleInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '') // Only allow digits
    if (raw === '') {
        local.value = null
        return
    }
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= 0) {
        local.value = n
    }
}

function formatNumber(num) {
    if (num == null || isNaN(num)) return ''
    return num.toLocaleString()
}

function apply() {
    emit('update:modelValue', {
        operator: local.operator,
        value: local.value,
        mode: local.mode
    })
    isOpen.value = false
}

function clear() {
    local.operator = ''
    local.value = null
    local.mode = 'total'
    inputText.value = ''
    emit('update:modelValue', { operator: '', value: null, mode: 'total' })
    isOpen.value = false
}

// Clear input when operator is cleared
watch(() => local.operator, (newOp) => {
    if (!newOp) {
        inputText.value = ''
        local.value = null
    }
})
</script>
