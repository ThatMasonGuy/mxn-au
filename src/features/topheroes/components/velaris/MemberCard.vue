<template>
    <div class="relative cursor-pointer rounded-xl p-3 lg:p-4 transition-all duration-300 bg-card border hover:bg-card/95 flex flex-col h-full min-w-0"
        @click="openProfile" @mouseenter="hovered = true" @mouseleave="hovered = false" :class="{
            'opacity-60 grayscale': member.status !== 'active',
        }" :style="cardStyle">
        <!-- Lock indicator -->
        <div v-if="member.locked" class="absolute top-2 lg:top-3 right-2 lg:right-3 z-10">
            <Lock class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-amber-500" />
        </div>

        <!-- Header with avatar and basic info -->
        <div class="flex items-start justify-between mb-3 lg:mb-4 min-w-0">
            <div class="flex items-center gap-2 lg:gap-3 min-w-0 flex-1 pr-2">
                <div class="relative flex-shrink-0">
                    <div class="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 flex items-center justify-center text-white font-semibold text-xs lg:text-sm"
                        :style="avatarStyle">
                        {{ member.name.slice(0, 2).toUpperCase() }}
                    </div>
                    <!-- Status indicator -->
                    <div v-if="member.status === 'active'"
                        class="absolute -bottom-0.5 -right-0.5 w-3 lg:w-4 h-3 lg:h-4 bg-green-500 rounded-full border-2 border-background">
                    </div>
                </div>

                <div class="min-w-0 flex-1">
                    <h4 class="font-semibold text-sm lg:text-base text-foreground truncate">{{ member.name }}</h4>
                    <div class="flex items-center gap-1.5 lg:gap-2 mt-0.5 lg:mt-1">
                        <component :is="getRoleIcon(member.role)" class="w-3 lg:w-3.5 h-3 lg:h-3.5 flex-shrink-0"
                            :class="getRoleIconColor(member.role)" />
                        <span class="text-xs text-foreground/70 truncate">{{ getRoleLabel(member.role) }}</span>
                    </div>
                </div>
            </div>

            <!-- Status badge -->
            <Badge :label="member.status" variant="status" class="flex-shrink-0 text-xs" />
        </div>

        <!-- Tags Section (if any tags exist) -->
        <div v-if="member.tags && member.tags.length > 0" class="mb-2 lg:mb-3">
            <div class="flex flex-wrap gap-1">
                <Tag v-for="tagId in member.tags.slice(0, 2)" :key="tagId" :tag-id="tagId" size="xs" />
                <!-- Show +N indicator if more than 2 tags on mobile, 3 on desktop -->
                <span v-if="member.tags.length > 2"
                    class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10 flex-shrink-0">
                    +{{ member.tags.length - 2 }}
                </span>
            </div>
        </div>

        <!-- Stats grid -->
        <div class="grid grid-cols-2 gap-2 lg:gap-3 mb-3 lg:mb-4 text-xs lg:text-sm">
            <div class="flex items-center gap-1.5 lg:gap-2 min-w-0">
                <Zap class="w-3 lg:w-3.5 h-3 lg:h-3.5 text-yellow-500 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                    <div class="text-xs text-foreground/60">Power</div>
                    <div class="font-semibold text-xs lg:text-sm truncate">{{ formatPower(member.power) }}</div>
                </div>
            </div>

            <div class="flex items-center gap-1.5 lg:gap-2 min-w-0">
                <Castle class="w-3 lg:w-3.5 h-3 lg:h-3.5 text-purple-500 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                    <div class="text-xs text-foreground/60">Castle</div>
                    <div class="font-semibold text-xs lg:text-sm truncate">{{ member.castle || '-' }}</div>
                </div>
            </div>

            <div v-if="member.country" class="flex items-center gap-1.5 lg:gap-2 min-w-0">
                <MapPin class="w-3 lg:w-3.5 h-3 lg:h-3.5 text-blue-500 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                    <div class="text-xs text-foreground/60">Country</div>
                    <div class="font-semibold text-xs truncate">{{ member.country }}</div>
                </div>
            </div>

            <div v-if="member.gameUid" class="flex items-center gap-1.5 lg:gap-2 min-w-0">
                <Hash class="w-3 lg:w-3.5 h-3 lg:h-3.5 text-orange-500 flex-shrink-0" />
                <div class="min-w-0 flex-1">
                    <div class="text-xs text-foreground/60">UID</div>
                    <div class="font-mono text-xs truncate">{{ member.gameUid }}</div>
                </div>
            </div>
        </div>

        <!-- Notes (if present) - properly truncated -->
        <div v-if="member.notes" class="mb-3 lg:mb-4">
            <div class="text-xs text-foreground/70 bg-foreground/5 rounded-md p-2 min-w-0">
                <div class="flex items-start gap-1.5 min-w-0">
                    <MessageSquare class="w-3.5 lg:w-4 h-3.5 lg:h-4 text-foreground/50 shrink-0 mt-0.5" />
                    <span class="italic text-xs leading-relaxed line-clamp-2 min-w-0 break-words">
                        {{ member.notes }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Spacer to push actions to bottom -->
        <div class="flex-1"></div>

        <!-- Action buttons - pinned to bottom -->
        <div class="flex items-center justify-between pt-2 lg:pt-3 border-t border-border/30 mt-auto">
            <div class="flex items-center gap-0.5 lg:gap-1">
                <button @click.stop="$emit('edit', member)"
                    class="p-1.5 lg:p-2 hover:bg-foreground/10 rounded-md transition-colors touch-manipulation"
                    title="Edit member">
                    <Edit class="w-3.5 h-3.5 text-foreground/60 hover:text-foreground/80" />
                </button>
                <button @click.stop="$emit('events', member)"
                    class="p-1.5 lg:p-2 hover:bg-foreground/10 rounded-md transition-colors touch-manipulation"
                    title="View events">
                    <Calendar class="w-3.5 h-3.5 text-foreground/60 hover:text-foreground/80" />
                </button>
                <button @click.stop="$emit('delete', member)"
                    class="p-1.5 lg:p-2 hover:bg-foreground/10 rounded-md transition-colors touch-manipulation"
                    title="Delete member">
                    <Trash2 class="w-3.5 h-3.5 text-red-500/70 hover:text-red-500" />
                </button>
            </div>

            <!-- Other names indicator -->
            <div v-if="member.otherNames?.length" class="flex items-center gap-1 flex-shrink-0">
                <Users class="w-3 h-3 text-foreground/50" />
                <span class="text-xs text-foreground/50">+{{ member.otherNames.length }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
    Lock, Zap, Castle, MapPin, Hash, MessageSquare, Edit, Calendar, Trash2, Users,
    Crown, Shield, Star, UserCheck
} from 'lucide-vue-next'
import Badge from './Badge.vue'
import Tag from './Tag.vue'

const props = defineProps({
    member: { type: Object, required: true }
})

const emit = defineEmits(['view', 'edit', 'delete', 'events'])

const hovered = ref(false)

const openProfile = () => emit('view', props.member)

const formatPower = (n) => {
    if (!n) return '0'
    return Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(n)
}

const getRoleLabel = (role) => {
    const labels = {
        R5: 'Leader',
        R4: 'Officer',
        R3: 'Elite',
        R2: 'Member',
        R1: 'Recruit'
    }
    return labels[role] || role
}

const getRoleIcon = (role) => {
    const icons = {
        R5: Crown,
        R4: Shield,
        R3: Star,
        R2: Users,
        R1: UserCheck
    }
    return icons[role] || UserCheck
}

const getRoleIconColor = (role) => {
    const colors = {
        R5: 'text-yellow-500',
        R4: 'text-purple-500',
        R3: 'text-blue-500',
        R2: 'text-green-500',
        R1: 'text-slate-500'
    }
    return colors[role] || 'text-slate-500'
}

const roleColorMap = {
    R5: '#eab308', // yellow-500
    R4: '#a855f7', // purple-500
    R3: '#3b82f6', // blue-500
    R2: '#22c55e', // green-500
    R1: '#64748b', // slate-500
}

const highlightColor = computed(() => roleColorMap[props.member.role] || null)

// Subtle card styling - clean borders and shadows
const cardStyle = computed(() => {
    const color = highlightColor.value
    if (!color || props.member.status !== 'active') {
        return {
            borderColor: 'hsl(var(--border))',
            boxShadow: hovered.value
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)'
        }
    }

    return {
        background: `linear-gradient(135deg, hsl(var(--card)) 98%, ${color}08 100%)`,
        borderColor: color + '40',
        boxShadow: hovered.value
            ? `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px ${color}20`
            : `0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px ${color}15`
    }
})

// Avatar styling with role-based colors
const avatarStyle = computed(() => {
    const color = highlightColor.value
    if (!color) return {}

    return {
        background: `linear-gradient(135deg, ${color}80, ${color}60)`,
        borderColor: color + '60'
    }
})
</script>

<style scoped>
/* Ensure smooth transitions without layout shift */
.transition-all {
    transition-property: box-shadow, background-color, border-color, opacity;
}

/* Multi-line truncation for notes */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}

/* Ensure proper text breaking */
.break-words {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

/* Mobile touch improvements */
.touch-manipulation {
    touch-action: manipulation;
}

@media (hover: none) and (pointer: coarse) {
    .cursor-pointer {
        cursor: default;
    }

    button {
        min-height: 44px;
        min-width: 44px;
    }

    /* Increase touch target sizes on mobile */
    button {
        padding: 8px;
    }
}

/* Ensure truncation works properly */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

/* Better mobile spacing */
@media (max-width: 1023px) {
    .member-card {
        min-height: 200px;
    }
}
</style>