<template>
    <div class="relative" ref="container">
        <button @click.stop="toggle" :class="[
            'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border transition-colors select-none',
            statusStyle.bg, statusStyle.text, statusStyle.border,
            'hover:brightness-110'
        ]">
            <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', statusStyle.dot]" />
            {{ currentStatus?.label ?? taskStatus }}
            <ChevronDown :size="10" class="opacity-60" />
        </button>

        <!-- Dropdown -->
        <Teleport to="body">
            <div v-if="open" :style="dropdownStyle"
                class="fixed z-50 w-44 rounded-lg border border-zinc-600 bg-zinc-800 shadow-xl shadow-black/50 overflow-hidden">
                <div class="py-1">
                    <button v-for="s in allStatuses" :key="s.id" @click.stop="select(s.id)" :class="[
                        'w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left',
                        s.id === taskStatus
                            ? 'bg-zinc-700 text-zinc-100'
                            : 'text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
                    ]">
                        <span :class="['w-2 h-2 rounded-full flex-shrink-0', dotColor(s.color)]" />
                        {{ s.label }}
                        <Check v-if="s.id === taskStatus" :size="11" class="ml-auto text-emerald-400" />
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
    taskStatus: { type: String, required: true },
    allStatuses: { type: Array, required: true }, // [{ id, label, color }]
})

const emit = defineEmits(['update'])

const open = ref(false)
const container = ref(null)
const dropdownStyle = ref({})

const currentStatus = computed(() => props.allStatuses.find(s => s.id === props.taskStatus))

const STATUS_STYLES = {
    zinc: { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700', dot: 'bg-zinc-500' },
    blue: { bg: 'bg-blue-950/60', text: 'text-blue-400', border: 'border-blue-800/60', dot: 'bg-blue-400' },
    emerald: { bg: 'bg-emerald-950/60', text: 'text-emerald-400', border: 'border-emerald-800/60', dot: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-950/60', text: 'text-amber-400', border: 'border-amber-800/60', dot: 'bg-amber-400' },
    rose: { bg: 'bg-rose-950/60', text: 'text-rose-400', border: 'border-rose-800/60', dot: 'bg-rose-400' },
    purple: { bg: 'bg-purple-950/60', text: 'text-purple-400', border: 'border-purple-800/60', dot: 'bg-purple-400' },
}

const statusStyle = computed(() => {
    const color = currentStatus.value?.color ?? 'zinc'
    return STATUS_STYLES[color] ?? STATUS_STYLES.zinc
})

const dotColor = (color) => (STATUS_STYLES[color] ?? STATUS_STYLES.zinc).dot

const toggle = async () => {
    open.value = !open.value
    if (open.value) {
        await nextTick()
        positionDropdown()
    }
}

const positionDropdown = () => {
    const el = container.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    dropdownStyle.value = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
    }
}

const select = (id) => {
    emit('update', id)
    open.value = false
}

const onClickOutside = (e) => {
    if (open.value && !container.value?.contains(e.target)) {
        open.value = false
    }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>