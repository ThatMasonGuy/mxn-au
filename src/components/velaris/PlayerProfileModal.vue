<template>
    <Dialog :open="true" @update:open="(val) => !val && $emit('close')">
        <DialogContent class="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700">
            <!-- Header -->
            <div class="flex justify-between items-start border-b border-slate-700 pb-4">
                <DialogHeader>
                    <DialogTitle class="text-2xl font-bold text-white">{{ member.name }}</DialogTitle>
                    <DialogDescription class="sr-only">
                        Member details.
                    </DialogDescription>
                    <div class="space-x-2">
                        <Badge :label="member.role" variant="role" />
                        <Badge :label="member.status" variant="status" />
                    </div>
                </DialogHeader>
                <div class="space-x-2 mt-1">
                    <Button variant="outline" size="sm" @click="handleViewEvents"
                        class=" text-slate-600 hover:text-white">
                        <CalendarDaysIcon class="mr-1 h-4 w-4" />
                        Events
                    </Button>
                    <Button variant="secondary" size="sm" @click="showEditForm = true"
                        class="text-slate-600 hover:text-white">
                        <PencilIcon class="mr-1 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" @click="confirmDelete = true">
                        <TrashIcon class="mr-1 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-if="showEditForm" class="mt-4 bg-slate-800 p-4 rounded-md border border-slate-700">
                <h3 class="text-lg font-semibold text-white mb-3">Edit Member</h3>
                <form @submit.prevent="saveEdit" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="editForm.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="power">Power</Label>
                            <Input id="power" v-model="editForm.power" type="number" />
                        </div>
                        <div class="space-y-2">
                            <Label for="castle">Castle</Label>
                            <Input id="castle" v-model="editForm.castle" />
                        </div>
                        <div class="space-y-2">
                            <Label for="country">Country</Label>
                            <Input id="country" v-model="editForm.country" />
                        </div>
                        <div class="space-y-2">
                            <Label for="discord">Discord</Label>
                            <Input id="discord" v-model="editForm.discord" />
                        </div>
                        <div class="space-y-2">
                            <Label for="server">Server</Label>
                            <Input id="server" v-model="editForm.server" />
                        </div>
                        <div class="space-y-2">
                            <Label for="role">Role</Label>
                            <Select v-model="editForm.role" class="bg-slate-700" required>
                                <SelectTrigger class="bg-slate-700">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="R5">R5</SelectItem>
                                    <SelectItem value="R4">R4</SelectItem>
                                    <SelectItem value="R3">R3</SelectItem>
                                    <SelectItem value="R2">R2</SelectItem>
                                    <SelectItem value="R1">R1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="status">Status</Label>
                            <Select v-model="editForm.status">
                                <SelectTrigger class="bg-slate-700" required>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="kicked">Kicked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label for="otherNames">Other Names (comma separated)</Label>
                        <Input id="otherNames" v-model="editForm.otherNames" class="bg-slate-700" />
                    </div>

                    <div class="space-y-2">
                        <Label for="notes">Notes</Label>
                        <Textarea id="notes" v-model="editForm.notes" rows="3" />
                    </div>

                    <div class="flex justify-end space-x-2">
                        <Button type="button" variant="outline" @click="showEditForm = false">Cancel</Button>
                        <Button type="submit" variant="default">Save Changes</Button>
                    </div>
                </form>
            </div>

            <!-- Main Content -->
            <div v-else class="space-y-6 mt-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Power</div>
                        <div class="text-white font-semibold">{{ formatPower(member.power) }}</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Castle</div>
                        <div class="text-white font-semibold">{{ member.castle }}</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Status</div>
                        <div class="text-white font-semibold">{{ member.status }}</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Country</div>
                        <div class="text-white font-semibold">{{ member.country || '—' }}</div>
                    </div>
                    <div class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Discord</div>
                        <div class="text-white font-semibold">{{ member.discord || '—' }}</div>
                    </div>
                    <div v-if="member.server" class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Server</div>
                        <div class="text-white font-semibold">{{ member.server }}</div>
                    </div>
                    <div v-if="member.gameUid" class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Game UID</div>
                        <div class="text-white font-semibold">{{ member.gameUid }}</div>
                    </div>
                    <div v-if="member.updatedAt" class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Last Updated</div>
                        <div class="text-white font-semibold">{{ formatDate(member.updatedAt) }}</div>
                    </div>
                    <div v-if="member.updatedByUserName" class="bg-slate-800 p-3 rounded-md">
                        <div class="text-xs uppercase text-slate-400 mb-1">Updated By</div>
                        <div class="text-white font-semibold">{{ member.updatedByUserName }}</div>
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="member.notes" class="bg-slate-800 p-4 rounded-md">
                    <div class="text-xs uppercase text-slate-400 mb-2">Notes</div>
                    <p class="text-slate-300">{{ member.notes }}</p>
                </div>

                <!-- Other Names -->
                <div v-if="member.otherNames?.length" class="bg-slate-800 p-4 rounded-md">
                    <div class="text-xs uppercase text-slate-400 mb-2">Other Names</div>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="(name, i) in member.otherNames" :key="i"
                            class="bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-200">
                            {{ name }}
                        </div>
                    </div>
                </div>

                <!-- History Timeline -->
                <div v-if="history.length" class="mt-8">
                    <div class="font-semibold text-lg text-white mb-4 flex items-center">
                        <ClockIcon class="mr-2 h-5 w-5" />
                        Change History
                    </div>
                    <div class="space-y-4 border-l-2 border-slate-700 pl-4">
                        <div v-for="(entry, i) in visibleHistory" :key="i" class="relative">
                            <div
                                class="absolute -left-6 top-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900">
                            </div>
                            <div class="bg-slate-800 rounded-lg p-3 shadow-md">
                                <div class="text-sm text-slate-300 mb-2 flex justify-between">
                                    <span class="flex items-center">
                                        <UserIcon class="mr-1 h-4 w-4" />
                                        <span class="font-semibold">{{ entry.updatedBy }}</span>
                                    </span>
                                    <span class="text-slate-400">{{ formatDate(entry.updatedAt) }}</span>
                                </div>
                                <div class="text-xs space-y-2 bg-slate-850 rounded p-2">
                                    <div v-for="(change, key) in entry.changes" :key="key"
                                        class="grid grid-cols-12 gap-2">
                                        <span class="text-slate-400 font-medium col-span-3">{{ formatFieldName(key)
                                        }}</span>
                                        <div class="col-span-9 flex items-center">
                                            <span class="line-through text-red-400 bg-red-900/20 px-2 py-0.5 rounded">{{
                                                change.from || '—' }}</span>
                                            <ArrowRightIcon class="h-3 w-3 mx-2 text-slate-500" />
                                            <span class="text-green-400 bg-green-900/20 px-2 py-0.5 rounded">{{
                                                change.to || '—' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="canLoadMore" class="text-center mt-6">
                        <Button size="sm" variant="outline" @click="loadMore" class="w-full">
                            <ChevronDownIcon class="mr-1 h-4 w-4" />
                            Load More History
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="confirmDelete" @update:open="(val) => !val && (confirmDelete = false)">
        <DialogContent class="max-w-md bg-slate-900 border border-slate-700">
            <DialogHeader>
                <DialogTitle class="text-xl font-bold text-white">Confirm Deletion</DialogTitle>
                <DialogDescription class="text-slate-300">
                    Are you sure you want to delete <span class="font-semibold text-white">{{ member.name }}</span>?
                    This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <div class="flex justify-end space-x-2 mt-6">
                <Button variant="outline" @click="confirmDelete = false">Cancel</Button>
                <Button variant="destructive" @click="handleDelete">
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
import Badge from './Badge.vue'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import { getAuth } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { useToast } from '@/components/ui/toast';
import MemberEventTimelineModal from './MemberEventTimelineModal.vue'
import { useMemberEvents } from '@/composables/topheroes/admin/useMemberEvents'

const { toast } = useToast();

// Import Heroicons
import {
    CalendarDaysIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    ArrowRightIcon,
    ChevronDownIcon,
    ClockIcon
} from '@heroicons/vue/24/outline'

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

// State management
const showEditForm = ref(false)
const confirmDelete = ref(false)
const editForm = ref({})
const showEventModal = ref(false)

const handleViewEvents = () => {
    showEventModal.value = true
}

// Initialize edit form with member data when edit button is clicked
const initEditForm = () => {
    editForm.value = { ...props.member }
}

// Watch for edit button click to initialize form
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

// Save changes
const saveEdit = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    const uid = user?.uid || 'unknown'

    const oldData = props.member
    const newData = { ...editForm.value }

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

        emit('delete', props.member.id) // Optional if parent needs to react
        emit('close') // 💥 Close the modal
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

// Format field names for better display
const formatFieldName = (key) => {
    if (!key) return ''
    // Convert camelCase to Title Case with spaces
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
}
</script>