<template>
    <div
        class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 relative overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div
                class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000">
            </div>
            <div
                class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500">
            </div>
        </div>

        <div class="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 py-8">
            <!-- Enhanced Header -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8">
                <div class="space-y-2">
                    <h1
                        class="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Guild Roster
                    </h1>
                    <p class="text-slate-400 text-sm lg:text-base max-w-2xl">
                        View, edit, and manage all registered VLR members with advanced filtering and real-time updates.
                    </p>
                    <div class="flex items-center gap-2 text-xs text-slate-500">
                        <Users class="w-4 h-4" />
                        <span>{{ members.length }} total members</span>
                        <span class="text-slate-600">•</span>
                        <span>{{filteredMembers.filter(m => m.status === 'active').length}} active</span>
                    </div>
                </div>
                <Button @click="openAddModal"
                    class="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105">
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    <Plus class="w-4 h-4 mr-2" />
                    <span class="relative z-10">Add Member</span>
                </Button>
            </div>

            <!-- Enhanced Search and Filters -->
            <div
                class="backdrop-blur-xl bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/20">
                <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto">
                        <!-- Search Input -->
                        <div class="relative group w-full sm:w-80">
                            <Search
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                            <input v-model="searchQuery" type="text" placeholder="Search by name or UID..."
                                class="w-full bg-slate-800/80 backdrop-blur-sm text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 hover:border-slate-500/70" />
                            <div
                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                            </div>
                        </div>

                        <!-- Role Filter -->
                        <select v-model="filterRole"
                            class="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-slate-100 rounded-xl px-4 py-3 text-sm hover:border-slate-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300">
                            <option value="">All Roles</option>
                            <option value="R5">R5 - Leader</option>
                            <option value="R4">R4 - Officer</option>
                            <option value="R3">R3 - Elite</option>
                            <option value="R2">R2 - Member</option>
                            <option value="R1">R1 - Recruit</option>
                        </select>

                        <!-- Status Filter -->
                        <select v-model="filterStatus"
                            class="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-slate-100 rounded-xl px-4 py-3 text-sm hover:border-slate-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300">
                            <option value="">All Statuses</option>
                            <option value="active-inactive">Active & Inactive</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="left">Left</option>
                            <option value="kicked">Kicked</option>
                        </select>
                    </div>

                    <!-- Results Counter -->
                    <div
                        class="text-slate-400 text-sm bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/30 w-full lg:w-auto text-center lg:text-right">
                        <Filter class="w-4 h-4 inline mr-2" />
                        Showing {{ filteredMembers.length }} of {{ members.length }} member<span
                            v-if="filteredMembers.length !== 1">s</span>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div v-for="i in 8" :key="i"
                    class="animate-pulse bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm h-48 rounded-2xl border border-slate-700/30 shadow-xl">
                    <div class="p-6 space-y-4">
                        <div class="h-4 bg-slate-700/50 rounded w-3/4"></div>
                        <div class="h-3 bg-slate-700/50 rounded w-1/2"></div>
                        <div class="flex gap-2">
                            <div class="h-6 bg-slate-700/50 rounded-full w-12"></div>
                            <div class="h-6 bg-slate-700/50 rounded-full w-16"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Grouped by Role -->
            <div v-if="!isLoading" class="space-y-8">
                <!-- Enhanced Grouped by Role -->
                <div v-if="!isLoading" class="space-y-8">
                    <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role" class="group">
                        <details class="overflow-hidden" open @toggle="e => toggleStates[role] = e.target.open">
                            <summary
                                class="flex justify-between items-center py-6 border-b border-slate-700/50 cursor-pointer select-none group-hover:border-slate-600/70 transition-colors duration-300">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="text-white font-bold text-xl lg:text-2xl tracking-wide flex items-center gap-3">
                                        <div :class="[
                                            'w-3 h-8 rounded-full',
                                            role === 'R5' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30' :
                                                role === 'R4' ? 'bg-gradient-to-b from-purple-400 to-purple-600 shadow-lg shadow-purple-500/30' :
                                                    role === 'R3' ? 'bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30' :
                                                        role === 'R2' ? 'bg-gradient-to-b from-green-400 to-green-600 shadow-lg shadow-green-500/30' :
                                                            'bg-gradient-to-b from-slate-400 to-slate-600 shadow-lg shadow-slate-500/30'
                                        ]"></div>
                                        {{ role }}
                                        <span
                                            class="text-slate-400 font-normal text-lg bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/30">
                                            {{ groupedMembers[role]?.length || 0 }}
                                        </span>
                                    </div>
                                </div>
                                <ChevronDown
                                    class="w-6 h-6 text-slate-400 transition-all duration-300 group-hover:text-slate-300"
                                    :class="{ 'rotate-180': toggleStates[role] }" />
                            </summary>

                            <div class="pt-6">
                                <div v-if="groupedMembers[role]?.length"
                                    class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    <MemberCard v-for="member in groupedMembers[role]" :key="member.id" :member="member"
                                        @view="openProfile" @edit="editMember" @delete="deleteMember"
                                        @events="viewEvents" />
                                </div>
                                <div v-else
                                    class="text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-700/30 backdrop-blur-sm">
                                    <Users class="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p class="text-lg font-medium">No members in this role</p>
                                    <p class="text-sm mt-1">Members will appear here when added to {{ role }}</p>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>

                <!-- Enhanced No Results -->
                <div v-if="!isLoading && members.length === 0"
                    class="text-center py-16 text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <SearchX class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 class="text-xl font-semibold mb-2">No members found</h3>
                    <p class="text-slate-500 mb-6">No members have been added to the guild yet</p>
                    <Button @click="openAddModal"
                        class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25">
                        <Plus class="w-4 h-4 mr-2" />
                        Add First Member
                    </Button>
                </div>

                <!-- No Search Results -->
                <div v-if="!isLoading && members.length > 0 && filteredMembers.length === 0"
                    class="text-center py-16 text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <SearchX class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 class="text-xl font-semibold mb-2">No matching members</h3>
                    <p class="text-slate-500 mb-6">Try adjusting your search criteria or filters</p>
                    <Button @click="() => { searchQuery = ''; filterRole = ''; filterStatus = ''; }" variant="outline"
                        class="border-slate-600 hover:border-slate-500 hover:bg-slate-700/50">
                        <RotateCcw class="w-4 h-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>

                <!-- Modals -->
                <MemberFormModal v-if="showModal" :initial="editingMember" @close="closeModal" />
                <PlayerProfileModal v-if="selectedMember" :member="selectedMember" @close="selectedMember = null" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Users, Search, Filter, ChevronDown, SearchX, RotateCcw } from 'lucide-vue-next'
import MemberCard from '@/components/velaris/MemberCard.vue'
import MemberFormModal from '@/components/velaris/MemberFormModal.vue'
import PlayerProfileModal from '@/components/velaris/PlayerProfileModal.vue'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast';

const { members, loadMembers, addMember, updateMember, deleteMemberById } = useMembers()

const showModal = ref(false)
const editingMember = ref(null)
const selectedMember = ref(null)
const isLoading = ref(true)
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const toggleStates = ref({
    R5: true,
    R4: true,
    R3: true,
    R2: true,
    R1: true,
})

onMounted(async () => {
    await loadMembers()
    isLoading.value = false
})

const filteredMembers = computed(() => {
    return members.value.filter((m) => {
        const matchesQuery = !searchQuery.value ||
            m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            String(m.gameUid).includes(searchQuery.value)
        const matchesRole = !filterRole.value || m.role === filterRole.value

        // Handle the special "active-inactive" filter
        let matchesStatus = true
        if (filterStatus.value) {
            if (filterStatus.value === 'active-inactive') {
                matchesStatus = m.status === 'active' || m.status === 'inactive'
            } else {
                matchesStatus = m.status === filterStatus.value
            }
        }

        return matchesQuery && matchesRole && matchesStatus
    })
})

const groupedMembers = computed(() => {
    const groups = { R5: [], R4: [], R3: [], R2: [], R1: [] }
    filteredMembers.value.forEach(member => {
        if (groups[member.role]) {
            groups[member.role].push(member)
        }
    })
    return groups
})

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
}

const saveMember = async (data) => {
    if (data.id) {
        await updateMember(data.id, data)
    } else {
        await addMember(data)
    }
    closeModal()
}

const deleteMember = async (id) => {
    await deleteMemberById(id)
}

const openProfile = (member) => {
    selectedMember.value = member
}

const viewEvents = (member) => {
    console.log('View event history for', member.name)
}
</script>

<style scoped>
.fade-collapse-enter-active,
.fade-collapse-leave-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    overflow: hidden;
}

.fade-collapse-enter-from,
.fade-collapse-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    max-height: 0;
}

.fade-collapse-enter-to,
.fade-collapse-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-height: 2000px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #06b6d4, #3b82f6);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0891b2, #2563eb);
}

/* Animated background */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}
</style>