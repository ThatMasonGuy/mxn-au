<template>
    <div class="space-y-4 lg:space-y-6">
        <!-- Quick Stats -->
        <div class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Overview</h3>
            <div class="grid grid-cols-2 gap-3">
                <div
                    class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/30">
                    <div class="text-xl lg:text-2xl font-bold text-green-700 dark:text-green-400">{{ stats.active }}
                    </div>
                    <div class="text-xs text-green-600 dark:text-green-500">Active</div>
                </div>
                <div
                    class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-lg p-3 border border-red-200/50 dark:border-red-800/30">
                    <div class="text-xl lg:text-2xl font-bold text-red-700 dark:text-red-400">{{ stats.inactive +
                        (stats.left || 0) + (stats.kicked || 0) }}</div>
                    <div class="text-xs text-red-600 dark:text-red-500">Inactive</div>
                </div>
            </div>
        </div>

        <!-- Power Statistics -->
        <div class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Power Statistics</h3>
            <div class="space-y-2">
                <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                    <span class="text-sm text-foreground/70">Total Power</span>
                    <span class="font-semibold text-sm">{{ formatPower(stats.totalPower) }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                    <span class="text-sm text-foreground/70">Average</span>
                    <span class="font-semibold text-sm">{{ formatPower(stats.averagePower) }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                    <span class="text-sm text-foreground/70">Highest</span>
                    <span class="font-semibold text-sm">{{ formatPower(stats.maxPower) }}</span>
                </div>
                <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                    <span class="text-sm text-foreground/70">Average Castle</span>
                    <span class="font-semibold text-sm">{{ stats.averageCastle }}</span>
                </div>
            </div>
        </div>

        <!-- Role Distribution -->
        <div class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Role Distribution</h3>
            <div class="space-y-2">
                <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role"
                    class="flex items-center justify-between p-2 bg-foreground/5 rounded">
                    <div class="flex items-center gap-2">
                        <component :is="getRoleIcon(role)" class="w-4 h-4" :class="getRoleIconColor(role)" />
                        <span class="text-sm">{{ getRoleLabel(role) }}</span>
                    </div>
                    <span class="font-semibold text-sm">{{ stats.roles[role] || 0 }}</span>
                </div>
            </div>
        </div>

        <!-- Tag Distribution -->
        <div v-if="Object.keys(stats.tagStats || {}).length > 0" class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Tag Distribution</h3>
            <div class="space-y-2">
                <div v-for="[tagId, count] in Object.entries(stats.tagStats || {}).sort(([, a], [, b]) => b - a)"
                    :key="tagId" class="flex items-center justify-between p-2 bg-foreground/5 rounded">
                    <Tag :tag-id="tagId" size="xs" />
                    <span class="font-semibold text-sm">{{ count }}</span>
                </div>
            </div>
        </div>

        <!-- Data Quality Issues -->
        <div class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Data Quality</h3>
            <div class="space-y-2">
                <div v-if="stats.withoutDiscord > 0"
                    class="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded">
                    <div class="flex items-center gap-2">
                        <AlertTriangle class="w-4 h-4 text-yellow-600" />
                        <span class="text-sm text-yellow-800 dark:text-yellow-200">Missing Discord</span>
                    </div>
                    <span class="font-semibold text-sm text-yellow-800 dark:text-yellow-200">{{ stats.withoutDiscord
                        }}</span>
                </div>
                <div v-if="stats.withoutGameUid > 0"
                    class="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded">
                    <div class="flex items-center gap-2">
                        <AlertTriangle class="w-4 h-4 text-orange-600" />
                        <span class="text-sm text-orange-800 dark:text-orange-200">Missing Game UID</span>
                    </div>
                    <span class="font-semibold text-sm text-orange-800 dark:text-orange-200">{{ stats.withoutGameUid
                        }}</span>
                </div>
                <div v-if="(!stats.withoutDiscord || stats.withoutDiscord === 0) && (!stats.withoutGameUid || stats.withoutGameUid === 0)"
                    class="flex items-center justify-center p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded">
                    <span class="text-sm text-green-800 dark:text-green-200 font-medium">✓ All data complete</span>
                </div>
            </div>
        </div>

        <!-- Country Distribution -->
        <div v-if="Object.keys(stats.countries || {}).length > 0" class="space-y-3">
            <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Top Countries</h3>
            <div class="space-y-2">
                <div v-for="[country, count] in Object.entries(stats.countries || {}).sort(([, a], [, b]) => b - a).slice(0, 5)"
                    :key="country" class="flex items-center justify-between p-2 bg-foreground/5 rounded">
                    <span class="text-sm truncate">{{ country }}</span>
                    <span class="font-semibold text-sm flex-shrink-0 ml-2">{{ count }}</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-4 border-t border-border">
            <button class="w-full btn-soft-violet text-sm">
                <FileText class="w-4 h-4" />
                Generate Report
            </button>
            <button class="w-full btn-soft-violet text-sm">
                <Users class="w-4 h-4" />
                Bulk Actions
            </button>
        </div>
    </div>
</template>

<script setup>
import { Crown, Shield, Star, Users, UserCheck, AlertTriangle, FileText } from 'lucide-vue-next'
import Tag from './Tag.vue'

defineProps({
    stats: {
        type: Object,
        required: true,
        default: () => ({
            active: 0,
            inactive: 0,
            left: 0,
            kicked: 0,
            totalPower: 0,
            averagePower: 0,
            maxPower: 0,
            averageCastle: 0,
            roles: {},
            tagStats: {},
            countries: {},
            withoutDiscord: 0,
            withoutGameUid: 0
        })
    },
    formatPower: {
        type: Function,
        required: true
    }
})

// Helper Functions
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
        R5: 'text-yellow-400',
        R4: 'text-purple-400',
        R3: 'text-blue-400',
        R2: 'text-green-400',
        R1: 'text-slate-400'
    }
    return colors[role] || 'text-slate-400'
}
</script>