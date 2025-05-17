<template>
    <div class="relative group cursor-pointer rounded-xl p-4 transition-all duration-300 border bg-slate-800"
        @click="openProfile" :class="{
            'opacity-60 grayscale': member.status !== 'active',
            'border-slate-700': !highlightColor,
        }" :style="highlightColor
            ? {
                borderColor: highlightColor,
                boxShadow: `0 0 ${hovered ? 10 : 4}px ${highlightColor}88`
            }
            : {}" @mouseenter="hovered = true" @mouseleave="hovered = false">
        <!-- Lock Icon -->
        <div v-if="member.locked" class="absolute top-2 right-2 text-yellow-400">
            <LockIcon class="w-5 h-5" />
        </div>

        <!-- Member Overview -->
        <div class="flex justify-between items-start gap-2">
            <div class="space-y-0.5 max-w-[70%]">
                <div class="text-xl font-bold truncate">{{ member.name }}</div>
                <div class="text-sm pb-2 text-slate-400 whitespace-nowrap">
                    Power: {{ formatPower(member.power) }} | Castle: {{ member.castle }}
                </div>
                <Badge :label="member.role" variant="role" />
            </div>

            <!-- Status Badge with left margin for spacing -->
            <Badge :label="member.status.toUpperCase()" variant="status" class="-ml-2" />
        </div>

        <!-- Notes -->
        <div v-if="member.notes" class="text-xs italic mt-3 text-slate-400 truncate line-clamp-1">
            {{ member.notes }}
        </div>
    </div>
</template>


<script setup>
import { computed, ref } from 'vue'
import { LockClosedIcon as LockIcon } from '@heroicons/vue/24/outline'
import Badge from './Badge.vue'

const props = defineProps({ member: Object })
const emit = defineEmits(['view'])

const hovered = ref(false)

const openProfile = () => emit('view', props.member)

const formatPower = (n) =>
    Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n)

// Updated R1 to a gray-blue to reduce similarity with R5
const roleColorMap = {
    R5: '#FFD700',   // Gold
    R4: '#A855F7',   // Purple
    R3: '#3B82F6',   // Blue
    R2: '#10B981',   // Green
    R1: '#64748B',   // Slate-500 (soft gray-blue)
}

const highlightColor = computed(() => roleColorMap[props.member.role] || null)
</script>

<style scoped>
/* Optional: smooth box-shadow */
.group {
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
</style>