<template>
    <div class="w-full">
        <label class="block text-xs font-medium text-muted-foreground mb-2">Score Filter</label>

        <div class="flex items-center gap-2">
            <select v-model="local.operator" @change="emitChange"
                class="px-3 py-2 rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]">
                <option value="">All Scores</option>
                <option value="gte">≥</option>
                <option value="lte">≤</option>
                <option value="eq">=</option>
            </select>

            <div v-if="local.operator" class="relative">
                <input v-model="inputText" @input="handleInput" @blur="normalize" inputmode="decimal"
                    placeholder="1.00M"
                    class="pl-3 pr-10 py-2 w-40 rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
                <span class="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground">pts</span>
            </div>

            <button v-if="local.operator" @click="clear"
                class="ml-auto px-2.5 py-1.5 rounded-md text-xs border border-border bg-muted hover:bg-muted/70 text-foreground">
                Clear
            </button>
        </div>

        <p v-if="local.operator && local.value !== null" class="mt-1 text-xs text-muted-foreground">
            Filtering: <span class="font-medium">{{ symbol }} {{ pretty }}</span>
        </p>
    </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ operator: '', value: null }) // value = raw number of points
    }
})
const emit = defineEmits(['update:modelValue'])

const local = reactive({
    operator: props.modelValue?.operator ?? '',
    value: props.modelValue?.value ?? null
})

// Text shown in the input (kept separate so typing feels natural)
const inputText = computed({
    get() {
        if (!local.operator) return ''
        if (local.value === null || Number.isNaN(local.value)) return ''
        return toShort(local.value) // e.g., 1.20M
    },
    set(_) { }
})

watch(() => props.modelValue, (nv) => {
    local.operator = nv?.operator ?? ''
    local.value = nv?.value ?? null
})

const symbol = computed(() => (
    local.operator === 'gte' ? '≥' :
        local.operator === 'lte' ? '≤' :
            local.operator === 'eq' ? '=' : ''
))

const pretty = computed(() => local.value == null ? '' : toShort(local.value))

function emitChange() {
    if (!local.operator) {
        emit('update:modelValue', { operator: '', value: null })
    } else {
        emit('update:modelValue', { operator: local.operator, value: local.value })
    }
}

function clear() {
    local.operator = ''
    local.value = null
    emitChange()
}

function handleInput(e) {
    const raw = (e?.target?.value ?? '').trim()
    const n = parseScore(raw)
    if (!Number.isNaN(n)) {
        local.value = n
        emitChange()
    }
}

function normalize() {
    if (local.operator && local.value != null) emitChange()
}

// --- Utils ---

// Accepts: "1,234,567" | "1.2m" | "1200k" | "0.95b" | "1500000"
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

// Format to fixed 2-dp short form: 00.00K/M/B
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