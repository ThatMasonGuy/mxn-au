<template>
    <div class="w-full">
        <label class="block text-xs font-medium text-muted-foreground mb-2">Score Filter</label>

        <div class="space-y-2">
            <!-- Operator and Value Row -->
            <div class="flex items-center gap-2">
                <select v-model="local.operator" @change="emitChange"
                    class="px-3 py-2 rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]">
                    <option value="">All Scores</option>
                    <option value="gte">≥</option>
                    <option value="lte">≤</option>
                </select>

                <div v-if="local.operator" class="relative flex-1 max-w-[180px]">
                    <input v-model.lazy="inputText" @input="handleInput" @blur="normalize" inputmode="decimal"
                        placeholder="e.g., 1.5M or 2000000"
                        class="w-full pl-3 pr-12 py-2 rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
                    <span
                        class="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground pointer-events-none">
                        pts
                    </span>
                </div>

                <button v-if="local.operator" @click="clear"
                    class="px-3 py-2 rounded-md text-xs border border-border bg-muted hover:bg-muted/70 text-foreground transition-colors">
                    Clear
                </button>
            </div>

            <!-- Mode Selector (only shown when filter is active) -->
            <div v-if="local.operator && local.value !== null" class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">Apply to:</span>
                <div class="flex gap-1 bg-muted/50 rounded-md p-1">
                    <button @click="setMode('total')" :class="[
                        'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                        local.mode === 'total'
                            ? 'bg-card text-foreground shadow-sm border border-border'
                            : 'text-muted-foreground hover:text-foreground'
                    ]">
                        Total Score
                    </button>
                    <button @click="setMode('each')" :class="[
                        'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                        local.mode === 'each'
                            ? 'bg-card text-foreground shadow-sm border border-border'
                            : 'text-muted-foreground hover:text-foreground'
                    ]">
                        Each Day
                    </button>
                </div>
            </div>

            <!-- Active Filter Summary -->
            <p v-if="local.operator && local.value !== null" class="text-xs text-muted-foreground">
                <span class="font-medium">{{ filterDescription }}</span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, watch, ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ operator: '', value: null, mode: 'total' })
    }
})
const emit = defineEmits(['update:modelValue'])

const local = reactive({
    operator: props.modelValue?.operator ?? '',
    value: props.modelValue?.value ?? null,
    mode: props.modelValue?.mode ?? 'total' // 'total' or 'each'
})

const inputText = ref('')

// Initialize inputText when component mounts or value changes
watch(() => local.value, (newVal) => {
    if (newVal !== null && !Number.isNaN(newVal)) {
        inputText.value = toShort(newVal)
    }
}, { immediate: true })

watch(() => props.modelValue, (nv) => {
    local.operator = nv?.operator ?? ''
    local.value = nv?.value ?? null
    local.mode = nv?.mode ?? 'total'
    if (local.value !== null && !Number.isNaN(local.value)) {
        inputText.value = toShort(local.value)
    }
})

const symbol = computed(() => (
    local.operator === 'gte' ? '≥' :
        local.operator === 'lte' ? '≤' : ''
))

const filterDescription = computed(() => {
    if (!local.operator || local.value === null) return ''
    const scoreText = toShort(local.value)
    const modeText = local.mode === 'each' ? 'each day' : 'total'
    return `${symbol.value} ${scoreText} (${modeText})`
})

function setMode(mode) {
    local.mode = mode
    emitChange()
}

function emitChange() {
    if (!local.operator) {
        emit('update:modelValue', { operator: '', value: null, mode: 'total' })
    } else {
        emit('update:modelValue', {
            operator: local.operator,
            value: local.value,
            mode: local.mode
        })
    }
}

function clear() {
    local.operator = ''
    local.value = null
    local.mode = 'total'
    inputText.value = ''
    emitChange()
}

function handleInput(e) {
    const raw = (e?.target?.value ?? '').trim()
    const n = parseScore(raw)
    if (!Number.isNaN(n) && n >= 0) {
        local.value = n
        emitChange()
    }
}

function normalize() {
    if (local.operator && local.value != null) {
        inputText.value = toShort(local.value)
        emitChange()
    }
}

// --- Utils ---

// Accepts: "1,234,567" | "1.2m" | "1200k" | "0.95b" | "1500000" | "1.5M"
function parseScore(s) {
    if (!s) return NaN
    const str = String(s).replace(/,/g, '').trim().toLowerCase()
    const match = str.match(/^([0-9]*\.?[0-9]+)\s*([kmb])?$/)
    if (!match) {
        const n = Number.parseFloat(str)
        return Number.isFinite(n) ? Math.round(n) : NaN
    }
    let n = Number.parseFloat(match[1])
    const unit = match[2]
    if (unit === 'k') n *= 1_000
    else if (unit === 'm') n *= 1_000_000
    else if (unit === 'b') n *= 1_000_000_000
    return Math.round(n)
}

// Format to short form: 1.50M, 2.00M, etc.
function toShort(num) {
    if (num == null || !Number.isFinite(num)) return ''
    const abs = Math.abs(num)
    const f = (n, suf) => (n).toFixed(2) + suf
    if (abs >= 1_000_000_000) return f(num / 1_000_000_000, 'B')
    if (abs >= 1_000_000) return f(num / 1_000_000, 'M')
    if (abs >= 1_000) return f(num / 1_000, 'K')
    return String(num)
}
</script>