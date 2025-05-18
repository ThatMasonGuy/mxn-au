<template>
    <div class="bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100 min-h-screen">
        <div class="px-6 max-w-7xl mx-auto space-y-8">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6">
                <div>
                    <h1 class="text-4xl font-bold tracking-tight text-white">Guild Roster</h1>
                    <p class="text-slate-400 mt-1 text-sm">View, edit, and manage all registered VLR members.</p>
                </div>
                <Button @click="openAddModal" class="w-full md:w-auto">➕ Add Member</Button>
            </div>

            <!-- Search and Filters -->
            <div
                class="flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground border-t border-b py-4 border-slate-700">
                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full md:w-auto">
                    <input v-model="searchQuery" type="text" placeholder="Search by name or UID..."
                        class="bg-slate-800 text-slate-100 placeholder-slate-500 text-sm px-3 py-2 rounded w-full sm:w-64 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                    <select v-model="filterRole"
                        class="bg-slate-800 border border-slate-700 text-slate-100 rounded px-3 py-2 text-sm">
                        <option value="">All Roles</option>
                        <option value="R5">R5</option>
                        <option value="R4">R4</option>
                        <option value="R3">R3</option>
                        <option value="R2">R2</option>
                        <option value="R1">R1</option>
                    </select>

                    <select v-model="filterStatus"
                        class="bg-slate-800 border border-slate-700 text-slate-100 rounded px-3 py-2 text-sm">
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="left">Left</option>
                        <option value="kicked">Kicked</option>
                    </select>
                </div>

                <div class="text-slate-400 italic w-full md:w-auto text-right">
                    Showing {{ filteredMembers.length }} member<span v-if="filteredMembers.length !== 1">s</span>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div v-for="i in 8" :key="i" class="animate-pulse bg-slate-800 h-40 rounded-xl"></div>
            </div>

            <!-- Grouped by Role -->
            <div v-else>
                <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role">
                    <details class="group" :open="true" @toggle="e => toggleStates[role] = e.target.open">
                        <summary
                            class="flex justify-between items-center py-4 border-b border-slate-700 cursor-pointer select-none">
                            <div class="text-white font-semibold text-lg tracking-wide">
                                {{ role }}
                                <span class="text-slate-500 font-normal">({{ groupedMembers[role]?.length || 0
                                    }})</span>
                            </div>
                            <ChevronDownIcon class="w-5 h-5 text-slate-400 transition-transform duration-300"
                                :class="{ 'rotate-180': toggleStates[role] }" />
                        </summary>

                        <Transition name="fade-collapse">
                            <div v-if="toggleStates[role]"
                                class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
                                <MemberCard v-for="member in groupedMembers[role]" :key="member.id" :member="member"
                                    @view="openProfile" @edit="editMember" @delete="deleteMember"
                                    @events="viewEvents" />
                            </div>
                        </Transition>

                        <Transition name="fade-collapse">
                            <div v-if="toggleStates[role] && !groupedMembers[role]?.length"
                                class="text-slate-500 italic px-1 py-4">
                                No members in this role.
                            </div>
                        </Transition>
                    </details>
                </div>
            </div>

            <!-- No results -->
            <div v-if="!isLoading && !filteredMembers.length" class="text-center text-slate-400 italic mt-10">
                No members found. Try adjusting your filters.
            </div>

            <!-- Modals -->
            <MemberFormModal v-if="showModal" :initial="editingMember" @close="closeModal" />
            <PlayerProfileModal v-if="selectedMember" :member="selectedMember" @close="selectedMember = null" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MemberCard from '@/components/velaris/MemberCard.vue'
import MemberFormModal from '@/components/velaris/MemberFormModal.vue'
import PlayerProfileModal from '@/components/velaris/PlayerProfileModal.vue'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
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
        const matchesStatus = !filterStatus.value || m.status === filterStatus.value
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
  transition: all 0.3s ease;
  overflow: hidden;
}
.fade-collapse-enter-from,
.fade-collapse-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
  max-height: 0;
}
.fade-collapse-enter-to,
.fade-collapse-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 999px;
}
</style>