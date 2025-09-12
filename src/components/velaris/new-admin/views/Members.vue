<template>
    <div class="flex gap-6 h-full">
        <!-- Main Content Area -->
        <div class="flex-1 min-w-0">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl font-semibold text-velaris-purple">Members</h1>
                <p class="text-sm text-foreground/70 mt-1">Manage your guild members and track their performance</p>
            </div>

            <!-- Stats Pills -->
            <div class="mb-6 flex flex-wrap items-center gap-3">
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-green/15 px-4 py-2 text-sm text-velaris-green">
                    <Users class="h-4 w-4" />
                    {{ totalMembers }} Total Members
                </div>
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-teal/15 px-4 py-2 text-sm text-velaris-teal">
                    <span class="h-2 w-2 rounded-full bg-velaris-teal animate-pulse"></span>
                    {{ activeMembers }} Active
                </div>
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-amber/15 px-4 py-2 text-sm text-velaris-amber">
                    <Crown class="h-4 w-4" />
                    {{ officerCount }} Officers
                </div>
            </div>

            <!-- Actions Bar -->
            <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input v-model="searchQuery" type="search" placeholder="Search members by name or UID..."
                            class="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition w-full sm:w-80" />
                    </div>
                    <select v-model="filterRole"
                        class="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition">
                        <option value="">All Roles</option>
                        <option value="R5">R5 - Leader</option>
                        <option value="R4">R4 - Officer</option>
                        <option value="R3">R3 - Elite</option>
                        <option value="R2">R2 - Member</option>
                        <option value="R1">R1 - Recruit</option>
                    </select>
                    <select v-model="filterStatus"
                        class="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition">
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="left">Left</option>
                        <option value="kicked">Kicked</option>
                    </select>
                    <select v-model="filterTag"
                        class="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition">
                        <option value="">All Tags</option>
                        <option v-for="tagId in Object.keys(MEMBER_TAGS)" :key="tagId" :value="tagId">
                            {{ MEMBER_TAGS[tagId].label }}
                        </option>
                    </select>
                    <button v-if="hasActiveFilters" @click="clearFilters" class="btn-soft-violet text-xs">
                        <RotateCcw class="h-3 w-3" />
                        Clear
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <div class="text-sm text-foreground/60">
                        {{ filteredMembers.length }} of {{ totalMembers }}
                    </div>
                    <button class="btn-soft-violet">
                        <Download class="h-4 w-4" />
                        Export
                    </button>
                    <button @click="openAddModal" class="btn-solid-purple">
                        <UserPlus class="h-4 w-4" />
                        Add Member
                    </button>
                    <button @click="sidebarOpen = !sidebarOpen" class="btn-soft-violet lg:hidden">
                        <BarChart3 class="h-4 w-4" />
                        Stats
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <div v-for="i in 8" :key="i" class="member-card animate-pulse">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-full bg-foreground/10"></div>
                                <div class="space-y-1">
                                    <div class="h-4 bg-foreground/10 rounded w-20"></div>
                                    <div class="h-3 bg-foreground/10 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="h-3 bg-foreground/10 rounded"></div>
                            <div class="h-3 bg-foreground/10 rounded"></div>
                            <div class="h-3 bg-foreground/10 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Members Grid -->
            <div v-else-if="filteredMembers.length > 0" class="space-y-8">
                <!-- Active/Inactive Members by Role -->
                <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role">
                    <div v-if="groupedActiveMembers[role]?.length > 0" class="space-y-4">
                        <!-- Role Header -->
                        <div class="flex items-center gap-3 pb-2 border-b border-border/50">
                            <div :class="[
                                'w-3 h-6 rounded-full',
                                role === 'R5' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
                                    role === 'R4' ? 'bg-gradient-to-b from-purple-400 to-purple-600' :
                                        role === 'R3' ? 'bg-gradient-to-b from-blue-400 to-blue-600' :
                                            role === 'R2' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                                                'bg-gradient-to-b from-slate-400 to-slate-600'
                            ]"></div>
                            <component :is="getRoleIcon(role)" class="w-5 h-5" :class="getRoleIconColor(role)" />
                            <h3 class="text-lg font-semibold text-foreground">{{ getRoleLabel(role) }}</h3>
                            <span
                                class="text-sm text-foreground/60 bg-card px-2 py-1 rounded-full border border-border/50">
                                {{ groupedActiveMembers[role].length }}
                            </span>
                        </div>

                        <!-- Active Members Grid for this role -->
                        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            <MemberCard v-for="member in groupedActiveMembers[role]" :key="member.id" :member="member"
                                @view="viewMemberProfile" @edit="editMember" @delete="deleteMember"
                                @events="viewEvents" />
                        </div>
                    </div>
                </div>

                <!-- Former Members Section -->
                <div v-if="formerMembers.length > 0" class="space-y-4">
                    <div class="flex items-center gap-3 pb-2 border-b border-border/50 opacity-60">
                        <div class="w-3 h-6 rounded-full bg-gradient-to-b from-slate-500 to-slate-600"></div>
                        <UserX class="w-5 h-5 text-slate-500" />
                        <h3 class="text-lg font-semibold text-foreground/60">Former Members</h3>
                        <span
                            class="text-sm text-foreground/40 bg-card/50 px-2 py-1 rounded-full border border-border/30">
                            {{ formerMembers.length }}
                        </span>
                    </div>

                    <!-- Former Members Grid -->
                    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 opacity-50">
                        <MemberCard v-for="member in formerMembers" :key="member.id" :member="member"
                            @view="viewMemberProfile" @edit="editMember" @delete="deleteMember" @events="viewEvents" />
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="!isLoading && totalMembers === 0"
                class="text-center py-16 text-foreground/60 bg-card/50 rounded-2xl border border-border/50">
                <Users class="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 class="text-xl font-semibold mb-2">No members found</h3>
                <p class="text-foreground/50 mb-6">No members have been added to the guild yet</p>
                <button @click="openAddModal" class="btn-solid-purple">
                    <UserPlus class="h-4 w-4 mr-2" />
                    Add First Member
                </button>
            </div>

            <!-- No Search Results -->
            <div v-else-if="!isLoading && totalMembers > 0 && filteredMembers.length === 0"
                class="text-center py-16 text-foreground/60 bg-card/50 rounded-2xl border border-border/50">
                <SearchX class="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 class="text-xl font-semibold mb-2">No matching members</h3>
                <p class="text-foreground/50 mb-6">Try adjusting your search criteria or filters</p>
                <button @click="clearFilters" class="btn-soft-violet">
                    <RotateCcw class="h-4 w-4 mr-2" />
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- Sidebar - Hidden on mobile unless toggled -->
        <div v-if="sidebarOpen || !isMobile"
            class="w-80 bg-card border border-border rounded-xl p-6 space-y-6 h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)]">

            <!-- Sidebar Header -->
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-foreground">Guild Analytics</h2>
                <button @click="sidebarOpen = false" class="lg:hidden p-1 hover:bg-foreground/10 rounded">
                    <X class="w-4 h-4" />
                </button>
            </div>

            <!-- Quick Stats -->
            <div class="space-y-3">
                <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Overview</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div
                        class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/30">
                        <div class="text-2xl font-bold text-green-700 dark:text-green-400">{{ stats.active }}</div>
                        <div class="text-xs text-green-600 dark:text-green-500">Active</div>
                    </div>
                    <div
                        class="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-lg p-3 border border-red-200/50 dark:border-red-800/30">
                        <div class="text-2xl font-bold text-red-700 dark:text-red-400">{{ stats.inactive + (stats.left
                            || 0) + (stats.kicked || 0) }}</div>
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
                        <span class="font-semibold">{{ formatPower(stats.totalPower) }}</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                        <span class="text-sm text-foreground/70">Average</span>
                        <span class="font-semibold">{{ formatPower(stats.averagePower) }}</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                        <span class="text-sm text-foreground/70">Highest</span>
                        <span class="font-semibold">{{ formatPower(stats.maxPower) }}</span>
                    </div>
                    <div class="flex justify-between items-center p-2 bg-foreground/5 rounded">
                        <span class="text-sm text-foreground/70">Average Castle</span>
                        <span class="font-semibold">{{ stats.averageCastle }}</span>
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
                        <span class="font-semibold">{{ stats.roles[role] || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- Tag Distribution -->
            <div v-if="Object.keys(stats.tagStats).length > 0" class="space-y-3">
                <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Tag Distribution</h3>
                <div class="space-y-2">
                    <div v-for="[tagId, count] in Object.entries(stats.tagStats).sort(([, a], [, b]) => b - a)"
                        :key="tagId" class="flex items-center justify-between p-2 bg-foreground/5 rounded">
                        <Tag :tag-id="tagId" size="xs" />
                        <span class="font-semibold">{{ count }}</span>
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
                        <span class="font-semibold text-yellow-800 dark:text-yellow-200">{{ stats.withoutDiscord
                            }}</span>
                    </div>
                    <div v-if="stats.withoutGameUid > 0"
                        class="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded">
                        <div class="flex items-center gap-2">
                            <AlertTriangle class="w-4 h-4 text-orange-600" />
                            <span class="text-sm text-orange-800 dark:text-orange-200">Missing Game UID</span>
                        </div>
                        <span class="font-semibold text-orange-800 dark:text-orange-200">{{ stats.withoutGameUid
                            }}</span>
                    </div>
                </div>
            </div>

            <!-- Country Distribution -->
            <div v-if="Object.keys(stats.countries).length > 0" class="space-y-3">
                <h3 class="text-sm font-medium text-foreground/70 uppercase tracking-wide">Top Countries</h3>
                <div class="space-y-2">
                    <div v-for="[country, count] in Object.entries(stats.countries).sort(([, a], [, b]) => b - a).slice(0, 5)"
                        :key="country" class="flex items-center justify-between p-2 bg-foreground/5 rounded">
                        <span class="text-sm">{{ country }}</span>
                        <span class="font-semibold">{{ count }}</span>
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
                    <Users class="w-4 w-4" />
                    Bulk Actions
                </button>
            </div>
        </div>

        <!-- Modals -->
        <MemberFormModal v-if="showModal" :initial="editingMember" @close="closeModal" @save="saveMember" />
        <PlayerProfileModal v-if="selectedMember" :member="selectedMember" @close="selectedMember = null" />

        <!-- Mobile Sidebar Overlay -->
        <div v-if="sidebarOpen && isMobile" class="fixed inset-0 bg-black/50 z-40 lg:hidden"
            @click="sidebarOpen = false">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Users, Clock, Search, Filter, Download, UserPlus, MoreHorizontal,
    Crown, RotateCcw, SearchX, Shield, Star, UserCheck, UserX, BarChart3,
    X, AlertTriangle, FileText
} from 'lucide-vue-next'
import MemberCard from '@/components/velaris/MemberCard.vue'
import MemberFormModal from '@/components/velaris/MemberFormModal.vue'
import PlayerProfileModal from '@/components/velaris/PlayerProfileModal.vue'
import Tag from '@/components/velaris/Tag.vue'
import { useMembers, MEMBER_TAGS } from '@/composables/topheroes/admin/useMembers'

const { members, loadMembers, addMember, updateMember, deleteMemberById, getMemberStats } = useMembers()

// UI State
const showModal = ref(false)
const editingMember = ref(null)
const selectedMember = ref(null)
const isLoading = ref(true)
const sidebarOpen = ref(false)
const isMobile = ref(false)

// Filter state
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const filterTag = ref('')

// Initialize data on mount
onMounted(async () => {
    await loadMembers()
    isLoading.value = false
})

// Computed Statistics
const stats = computed(() => getMemberStats())
const totalMembers = computed(() => members.value.length)
const activeMembers = computed(() => members.value.filter(m => m.status === 'active').length)
const officerCount = computed(() => members.value.filter(m => ['R4', 'R5'].includes(m.role)).length)

// Formatting helper
const formatPower = (n) => {
    if (!n) return '0'
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

// Filtering
const filteredMembers = computed(() => {
    return members.value.filter((m) => {
        const matchesQuery = !searchQuery.value ||
            m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            String(m.gameUid).includes(searchQuery.value)

        const matchesRole = !filterRole.value || m.role === filterRole.value
        const matchesStatus = !filterStatus.value || m.status === filterStatus.value
        const matchesTag = !filterTag.value || (m.tags && m.tags.includes(filterTag.value))

        return matchesQuery && matchesRole && matchesStatus && matchesTag
    })
})

// Group active/inactive members by role (sorted alphabetically)
const groupedActiveMembers = computed(() => {
    const groups = { R5: [], R4: [], R3: [], R2: [], R1: [] }

    filteredMembers.value
        .filter(member => member.status === 'active' || member.status === 'inactive')
        .forEach(member => {
            if (groups[member.role]) {
                groups[member.role].push(member)
            }
        })

    // Sort each group alphabetically by name
    Object.keys(groups).forEach(role => {
        groups[role].sort((a, b) => a.name.localeCompare(b.name))
    })

    return groups
})

// Get former members (left/kicked) sorted alphabetically
const formerMembers = computed(() => {
    return filteredMembers.value
        .filter(member => member.status === 'left' || member.status === 'kicked')
        .sort((a, b) => a.name.localeCompare(b.name))
})

const hasActiveFilters = computed(() =>
    searchQuery.value || filterRole.value || filterStatus.value || filterTag.value
)

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

// Actions
const openAddModal = () => {
    editingMember.value = null
    showModal.value = true
}

const editMember = (member) => {
    editingMember.value = member
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingMember.value = null
}

const saveMember = async (data) => {
    try {
        if (data.id) {
            await updateMember(data.id, data)
        } else {
            await addMember(data)
        }
        closeModal()
    } catch (error) {
        console.error('Failed to save member:', error)
    }
}

const deleteMember = async (member) => {
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
        try {
            await deleteMemberById(member.id)
        } catch (error) {
            console.error('Failed to delete member:', error)
        }
    }
}

const viewMemberProfile = (member) => {
    selectedMember.value = member
}

const viewEvents = (member) => {
    console.log('View events for', member.name)
}

const clearFilters = () => {
    searchQuery.value = ''
    filterRole.value = ''
    filterStatus.value = ''
    filterTag.value = ''
}
</script>