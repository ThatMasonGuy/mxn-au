<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent class="max-w-2xl bg-slate-900 border border-slate-700 text-slate-200">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-white mb-2">Add Missing Member</DialogTitle>
                <DialogDescription class="text-slate-400">Select a member to add to the event.</DialogDescription>
            </DialogHeader>

            <div class="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div class="grid gap-3">
                    <div v-for="member in missingMembers" :key="member.id"
                        class="group relative mr-1 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20">

                        <!-- Member Info -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <!-- Avatar Placeholder -->
                                <div
                                    class="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                                    <span class="text-white font-semibold text-lg">{{
                                        member.name.charAt(0).toUpperCase() }}</span>
                                </div>

                                <!-- Member Details -->
                                <div>
                                    <h3
                                        class="font-semibold text-white text-lg group-hover:text-slate-100 transition-colors">
                                        {{ member.name }}
                                    </h3>
                                    <div class="flex items-center space-x-3 mt-1">
                                        <span class="text-slate-400 text-sm font-medium">{{ member.role }}</span>
                                        <span class="text-slate-500">•</span>
                                        <span class="text-slate-400 text-sm">
                                            <span class="font-mono font-semibold text-amber-400">{{
                                                member.power.toLocaleString() }}</span> power
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Add Button -->
                            <Button size="sm" variant="secondary" @click="addExistingMember(member)"
                                class="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105 shadow-md">
                                <span class="mr-1">+</span> Add
                            </Button>
                        </div>

                        <!-- Subtle hover indicator -->
                        <div
                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-slate-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="missingMembers.length === 0" class="text-center py-12">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <span class="text-slate-500 text-2xl">👥</span>
                    </div>
                    <p class="text-slate-400 text-lg">All members are already added</p>
                    <p class="text-slate-500 text-sm mt-1">Create a new member to add more players</p>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="flex justify-between items-center pt-6 border-t border-slate-700 mt-6">
                <Button variant="ghost" @click="$emit('close')"
                    class="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200">
                    Cancel
                </Button>
                <Button variant="outline" @click="showMemberForm = true"
                    class="bg-slate-800 hover:bg-slate-700 text-white border-slate-600 hover:border-slate-500 transition-all duration-200 hover:scale-105">
                    <span class="mr-2">+</span> Add New Member
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    <MemberFormModal v-if="showMemberForm" @close="onMemberFormClose" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import MemberFormModal from './MemberFormModal.vue'

const props = defineProps({
    allMembers: {
        type: Array,
        default: () => []
    },
    currentPlayers: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'add'])

const showMemberForm = ref(false)

const currentIds = computed(() => props.currentPlayers.map(p => p.id))

const missingMembers = computed(() => {
    return props.allMembers.filter(m => !currentIds.value.includes(m.id))
})

const addExistingMember = (member) => {
    emit('add', member)
}

const onMemberFormClose = () => {
    showMemberForm.value = false
    emit('close') // optional: trigger full refresh or let parent handle re-open
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
}
</style>