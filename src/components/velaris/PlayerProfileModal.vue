<template>
    <Dialog :open="true" @update:open="(val) => !val && $emit('close')">
        <DialogContent
            class="w-full max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <!-- Scrollable content -->
            <div class="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <!-- Enhanced Header -->
                <div
                    class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-slate-700/50 pb-6 mb-6">
                    <DialogHeader class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="relative">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-xl">
                                    <User class="w-8 h-8 text-slate-400" />
                                </div>
                                <div
                                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full border-2 border-slate-900 flex items-center justify-center">
                                    <Crown v-if="member.role === 'R5'" class="w-3 h-3 text-white" />
                                    <Shield v-else-if="member.role === 'R4'" class="w-3 h-3 text-white" />
                                    <Star v-else-if="member.role === 'R3'" class="w-3 h-3 text-white" />
                                    <Users v-else-if="member.role === 'R2'" class="w-3 h-3 text-white" />
                                    <UserCheck v-else class="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <DialogTitle
                                    class="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                                    {{ member.name }}
                                </DialogTitle>
                                <div class="flex flex-wrap gap-2">
                                    <Badge :label="member.role" variant="role" />
                                    <Badge :label="member.status" variant="status" />
                                </div>
                            </div>
                        </div>
                        <DialogDescription class="sr-only">
                            Member details and profile information.
                        </DialogDescription>
                    </DialogHeader>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" @click="handleViewEvents"
                            class="bg-slate-800/50 border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/70 backdrop-blur-sm">
                            <Calendar class="mr-2 h-4 w-4" />
                            Events
                        </Button>
                        <Button variant="secondary" size="sm" @click="showEditForm = true"
                            class="bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-500/50 text-blue-300 hover:text-blue-200 backdrop-blur-sm">
                            <Edit class="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" @click="confirmDelete = true"
                            class="bg-red-600/20 border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 text-red-300 hover:text-red-200 backdrop-blur-sm">
                            <Trash2 class="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <!-- Edit Form -->
                <div v-if="showEditForm"
                    class="mb-6 bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <Edit class="w-5 h-5" />
                        Edit Member
                    </h3>
                    <form @submit.prevent="saveEdit" class="space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="name">Name</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="name" v-model="editForm.name" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="power">Power</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="power" v-model="editForm.power" type="number" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="castle">Castle</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="castle" v-model="editForm.castle" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="country">Country</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="country" v-model="editForm.country" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="discord">Discord</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="discord" v-model="editForm.discord" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="server">Server</Label>
                                <Input
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    id="server" v-model="editForm.server" />
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="role">Role</Label>
                                <Select v-model="editForm.role" required>
                                    <SelectTrigger
                                        class="bg-slate-800/80 border-slate-600/50 text-white focus:border-cyan-500/50">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-800 border-slate-600">
                                        <SelectItem value="R5">R5</SelectItem>
                                        <SelectItem value="R4">R4</SelectItem>
                                        <SelectItem value="R3">R3</SelectItem>
                                        <SelectItem value="R2">R2</SelectItem>
                                        <SelectItem value="R1">R1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label class="text-slate-300 font-medium" for="status">Status</Label>
                                <Select v-model="editForm.status">
                                    <SelectTrigger
                                        class="bg-slate-800/80 border-slate-600/50 text-white focus:border-cyan-500/50"
                                        required>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-800 border-slate-600">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="kicked">Kicked</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label class="text-slate-300 font-medium" for="otherNames">Other Names (comma
                                separated)</Label>
                            <Input
                                class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                id="otherNames" v-model="editForm.otherNames" />
                        </div>

                        <div class="space-y-2">
                            <Label class="text-slate-300 font-medium" for="notes">Notes</Label>
                            <Textarea
                                class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                id="notes" v-model="editForm.notes" rows="3" />
                        </div>

                        <div class="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="outline" @click="showEditForm = false"
                                class="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/70">
                                Cancel
                            </Button>
                            <Button type="submit"
                                class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                <!-- Main Profile Content -->
                <div v-else class="space-y-8">
                    <!-- Enhanced Stats Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Zap class="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Power</div>
                            </div>
                            <div class="text-white font-bold text-xl">{{ formatPower(member.power) }}</div>
                        </div>

                        <div
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Castle class="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Castle</div>
                            </div>
                            <div class="text-white font-bold text-xl">{{ member.castle }}</div>
                        </div>

                        <div
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Activity class="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Status</div>
                            </div>
                            <div class="text-white font-bold capitalize">{{ member.status }}</div>
                        </div>

                        <div v-if="member.country"
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <MapPin class="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Country</div>
                            </div>
                            <div class="text-white font-bold">{{ member.country }}</div>
                        </div>

                        <div v-if="member.discord"
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <MessageCircle
                                    class="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Discord</div>
                            </div>
                            <div class="text-white font-bold">{{ member.discord }}</div>
                        </div>

                        <div v-if="member.server"
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Server class="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Server</div>
                            </div>
                            <div class="text-white font-bold">{{ member.server }}</div>
                        </div>

                        <div v-if="member.gameUid"
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Hash class="w-5 h-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Game UID</div>
                            </div>
                            <div class="text-white font-bold">{{ member.gameUid }}</div>
                        </div>

                        <div v-if="member.updatedAt"
                            class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 group">
                            <div class="flex items-center gap-3 mb-2">
                                <Clock class="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                                <div class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Updated</div>
                            </div>
                            <div class="text-white font-bold text-sm">{{ formatDate(member.updatedAt) }}</div>
                        </div>
                    </div>

                    <!-- Notes Section -->
                    <div v-if="member.notes"
                        class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                        <div class="flex items-center gap-3 mb-4">
                            <MessageSquare class="w-5 h-5 text-slate-400" />
                            <div class="text-sm uppercase text-slate-400 font-semibold tracking-wide">Notes</div>
                        </div>
                        <p class="text-slate-300 leading-relaxed">{{ member.notes }}</p>
                    </div>

                    <!-- Other Names -->
                    <div v-if="member.otherNames?.length"
                        class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
                        <div class="flex items-center gap-3 mb-4">
                            <Tags class="w-5 h-5 text-slate-400" />
                            <div class="text-sm uppercase text-slate-400 font-semibold tracking-wide">Other Names</div>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="(name, i) in member.otherNames" :key="i"
                                class="bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 px-4 py-2 rounded-full text-sm text-slate-200 hover:bg-slate-600/50 hover:border-slate-500/50 transition-all duration-300">
                                {{ name }}
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced History Timeline -->
                    <div v-if="history.length" class="space-y-6">
                        <div class="flex items-center gap-3">
                            <History class="w-6 h-6 text-slate-400" />
                            <h3 class="font-bold text-xl text-white">Change History</h3>
                        </div>

                        <div class="space-y-4 border-l-2 border-gradient-to-b from-cyan-500 to-blue-600 pl-6 relative">
                            <div v-for="(entry, i) in visibleHistory" :key="i" class="relative">
                                <div
                                    class="absolute -left-8 top-3 w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full border-2 border-slate-900 shadow-lg shadow-cyan-500/30">
                                </div>

                                <div
                                    class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 shadow-xl hover:border-slate-600/70 transition-all duration-300">
                                    <div class="text-sm text-slate-300 mb-3 flex justify-between items-center">
                                        <span class="flex items-center gap-2">
                                            <User class="w-4 h-4" />
                                            <span class="font-semibold">{{ entry.updatedBy }}</span>
                                        </span>
                                        <span class="text-slate-400 text-xs">{{ formatDate(entry.updatedAt) }}</span>
                                    </div>

                                    <div
                                        class="text-xs space-y-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
                                        <div v-for="(change, key) in entry.changes" :key="key"
                                            class="grid grid-cols-12 gap-3 items-center">
                                            <span class="text-slate-400 font-medium col-span-3 capitalize">{{
                                                formatFieldName(key) }}</span>
                                            <div class="col-span-9 flex items-center gap-2">
                                                <span
                                                    class="line-through text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-800/30">
                                                    {{ change.from || '—' }}
                                                </span>
                                                <ArrowRight class="h-3 w-3 text-slate-500" />
                                                <span
                                                    class="text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-800/30">
                                                    {{ change.to || '—' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="canLoadMore" class="text-center">
                            <Button size="sm" variant="outline" @click="loadMore"
                                class="bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/70">
                                <ChevronDown class="mr-2 h-4 w-4" />
                                Load More History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <!-- Enhanced Delete Confirmation Dialog -->
    <Dialog :open="confirmDelete" @update:open="(val) => !val && (confirmDelete = false)">
        <DialogContent
            class="max-w-md bg-gradient-to-br from-slate-900 to-red-950/20 border border-red-500/30 shadow-2xl shadow-red-500/10">
            <DialogHeader>
                <DialogTitle class="text-xl font-bold text-white flex items-center gap-2">
                    <AlertTriangle class="w-5 h-5 text-red-400" />
                    Confirm Deletion
                </DialogTitle>
                <DialogDescription class="text-slate-300 mt-2">
                    Are you sure you want to delete <span class="font-semibold text-white">{{ member.name }}</span>?
                    This action cannot be undone and will permanently remove all member data.
                </DialogDescription>
            </DialogHeader>
            <div class="flex justify-end space-x-3 mt-6">
                <Button variant="outline" @click="confirmDelete = false"
                    class="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/70">
                    Cancel
                </Button>
                <Button variant="destructive" @click="handleDelete"
                    class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/25">
                    <Trash2 class="w-4 h-4 mr-2" />
                    Delete Forever
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    <MemberEventTimelineModal v-if="showEventModal" :member="member" :events="memberEvents"
        @close="showEventModal = false" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Calendar, Edit, Trash2, User, Crown, Shield, Star, Users, UserCheck,
    Zap, Castle, Activity, MapPin, MessageCircle, Server, Hash, Clock,
    MessageSquare, Tags, History, ArrowRight, ChevronDown, AlertTriangle
} from 'lucide-vue-next'
import Badge from './Badge.vue'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { getAuth } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { useToast } from '@/components/ui/toast';
import MemberEventTimelineModal from './MemberEventTimelineModal.vue'
import { useMemberEvents } from '@/composables/topheroes/admin/useMemberEvents'

const { toast } = useToast();
const { updateMember, deleteMemberById } = useMembers()

const props = defineProps({
    member: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'edit', 'delete', 'viewEvents'])
const { events: memberEvents, loadEvents } = useMemberEvents(props.member.id)

onMounted(() => {
    loadEvents()
})

const showEditForm = ref(false)
const confirmDelete = ref(false)
const editForm = ref({})
const showEventModal = ref(false)

const handleViewEvents = () => {
    showEventModal.value = true
}

const initEditForm = () => {
    editForm.value = { ...props.member }
}

watch(showEditForm, (newVal) => {
    if (newVal) initEditForm()
})

const getChanges = (oldData, newData) => {
    const changes = {}
    Object.keys(newData).forEach(key => {
        if (newData[key] !== oldData[key]) {
            changes[key] = {
                from: oldData[key] ?? null,
                to: newData[key]
            }
        }
    })
    return changes
}

const saveEdit = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    const uid = user?.uid || 'unknown'

    const oldData = props.member
    const newData = { ...editForm.value }

    if (typeof newData.otherNames === 'string') {
        newData.otherNames = newData.otherNames
            .split(',')
            .map(name => name.trim())
            .filter(name => !!name)
    }

    const changes = getChanges(oldData, newData)
    if (!Object.keys(changes).length) {
        showEditForm.value = false
        return
    }

    const updatedAt = serverTimestamp()

    const updatedMember = {
        ...newData,
        updatedBy: uid,
        updatedAt,
        history: [
            ...(oldData.history || []),
            {
                updatedBy: uid,
                updatedAt: new Date(),
                changes
            }
        ]
    }

    try {
        await updateMember(props.member.id, updatedMember)
        emit('edit', updatedMember)
        toast({
            variant: 'success',
            title: 'Update successful',
            description: `${updatedMember.name} was successfully updated.`
        })
        showEditForm.value = false
    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Update failed',
            description: `Could not update member ${updatedMember.name}.`
        })
        console.error('Failed to update member:', err)
    }
}

const handleDelete = async () => {
    try {
        await deleteMemberById(props.member.id)

        toast({
            variant: 'destructive',
            title: 'Successfully deleted',
            description: `Deleted member ${props.member.name}.`
        })

        emit('delete', props.member.id)
        emit('close')
        confirmDelete.value = false
    } catch (err) {
        console.error('Failed to delete member:', err)
        toast({
            variant: 'destructive',
            title: 'Deletion failed',
            description: `Could not delete ${props.member.name}.`
        })
    }
}

const history = computed(() =>
    (props.member.history || []).slice().reverse()
)

const visibleCount = ref(3)
const visibleHistory = computed(() => history.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < history.value.length)

const loadMore = () => {
    visibleCount.value += 3
}

const formatPower = (n) =>
    Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(n)

const formatDate = (d) => {
    const date = typeof d === 'string' ? new Date(d) : d?.toDate?.() || new Date()
    return date.toLocaleDateString('en-AU', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })
}

const formatFieldName = (key) => {
    if (!key) return ''
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
}
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(6, 182, 212, 0.5) rgba(51, 65, 85, 0.3);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(51, 65, 85, 0.3);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #06b6d4, #3b82f6);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #0891b2, #2563eb);
}
</style>