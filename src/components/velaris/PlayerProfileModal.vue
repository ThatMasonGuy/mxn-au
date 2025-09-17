<template>
    <Dialog :open="true" @update:open="(val) => !val && $emit('close')">
        <DialogContent
            class="w-full h-full sm:w-full sm:h-auto sm:max-w-[95vw] lg:max-w-4xl sm:max-h-[95vh] overflow-hidden sm:mx-auto sm:rounded-lg rounded-none border-0 sm:border px-3 sm:px-6">
            <!-- Fixed Header -->
            <DialogHeader class="pb-3 lg:pb-4 border-b border-border flex-shrink-0">
                <!-- Mobile: Stack vertically, Desktop: One row -->
                <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 lg:gap-6">
                    <!-- Left: avatar + meta -->
                    <div class="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <div class="w-12 lg:w-16 h-12 lg:h-16 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 border-2 flex items-center justify-center text-white font-bold text-lg lg:text-xl"
                                :style="avatarStyle">
                                {{ member.name.slice(0, 2).toUpperCase() }}
                            </div>
                            <div class="absolute -bottom-0.5 lg:-bottom-1 -right-0.5 lg:-right-1 w-5 lg:w-6 h-5 lg:h-6 rounded-full border-2 border-background flex items-center justify-center"
                                :style="roleIconStyle">
                                <component :is="getRoleIcon(member.role)"
                                    class="w-2.5 lg:w-3 h-2.5 lg:h-3 text-white" />
                            </div>
                        </div>

                        <!-- Name + details -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-start">
                                <DialogTitle class="text-xl lg:text-2xl font-bold text-foreground truncate">
                                    {{ member.name }}
                                </DialogTitle>
                            </div>

                            <div class="flex flex-wrap gap-2 mt-1">
                                <Badge :label="member.role" variant="role" />
                                <Badge :label="member.status" variant="status" />
                            </div>

                            <div v-if="member.tags?.length" class="flex flex-wrap gap-1 mt-1">
                                <Tag v-for="tagId in member.tags.slice(0, 3)" :key="tagId" :tag-id="tagId" />
                                <span v-if="member.tags.length > 3"
                                    class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                                    +{{ member.tags.length - 3 }}
                                </span>
                            </div>
                        </div>
                    </div>


                    <!-- Right: Compact inline buttons -->
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <Button variant="outline" size="sm" @click="handleViewEvents"
                            class="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2">
                            <Calendar class="h-4 w-4" />
                            <span class="hidden sm:ml-2 sm:inline">Events</span>
                        </Button>
                        <Button variant="outline" size="sm" @click="showEditForm = true"
                            class="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2">
                            <Edit class="h-4 w-4" />
                            <span class="hidden sm:ml-2 sm:inline">Edit</span>
                        </Button>
                        <Button variant="destructive" size="sm" @click="confirmDelete = true"
                            class="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 sm:p-2">
                            <Trash2 class="h-4 w-4" />
                            <span class="hidden sm:ml-2 sm:inline">Delete</span>
                        </Button>
                    </div>
                </div>
            </DialogHeader>

            <!-- Scrollable Content Area -->
            <div class="flex-1 overflow-y-auto -mr-3 pr-2 sm:pb-8 sm:mb-24 sm:-mr-0 sm:pr-2 lg:pr-3"
                style="height: calc(100vh - 140px); max-height: calc(95vh - 140px);">
                <div class="py-3 lg:py-4 space-y-4">
                    <!-- Edit Form -->
                    <div v-if="showEditForm"
                        class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-3 lg:p-4 border-2 border-blue-200 dark:border-blue-800 space-y-3 lg:space-y-4">
                        <div class="flex items-center justify-between">
                            <h3
                                class="text-base lg:text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                <Edit class="w-4 lg:w-5 h-4 lg:h-5 text-blue-600" />
                                Edit Member Details
                            </h3>
                            <Button variant="ghost" size="sm" @click="showEditForm = false" class="h-8 w-8 p-0">
                                <X class="h-4 w-4" />
                            </Button>
                        </div>

                        <form @submit.prevent="saveEdit" class="space-y-3 lg:space-y-4">
                            <!-- Basic Info - Mobile: 1 col, Tablet: 2 col, Desktop: 3 col -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div class="space-y-1.5">
                                    <Label for="edit-name" class="text-sm">Name</Label>
                                    <Input id="edit-name" v-model="editForm.name" class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label for="edit-power" class="text-sm">Power</Label>
                                    <Input id="edit-power" v-model="editForm.power" type="number" class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5 sm:col-span-2 lg:col-span-1">
                                    <Label for="edit-castle" class="text-sm">Castle Level</Label>
                                    <Input id="edit-castle" v-model="editForm.castle" type="number"
                                        class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label for="edit-country" class="text-sm">Country</Label>
                                    <Input id="edit-country" v-model="editForm.country" class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label for="edit-discord" class="text-sm">Discord</Label>
                                    <Input id="edit-discord" v-model="editForm.discord" class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5 sm:col-span-2 lg:col-span-1">
                                    <Label for="edit-server" class="text-sm">Server</Label>
                                    <Input id="edit-server" v-model="editForm.server" class="text-sm h-9" />
                                </div>
                                <div class="space-y-1.5">
                                    <Label for="edit-role" class="text-sm">Role</Label>
                                    <Select v-model="editForm.role">
                                        <SelectTrigger class="text-sm h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="R5">R5 - Leader</SelectItem>
                                            <SelectItem value="R4">R4 - Officer</SelectItem>
                                            <SelectItem value="R3">R3 - Elite</SelectItem>
                                            <SelectItem value="R2">R2 - Member</SelectItem>
                                            <SelectItem value="R1">R1 - Recruit</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5">
                                    <Label for="edit-status" class="text-sm">Status</Label>
                                    <Select v-model="editForm.status">
                                        <SelectTrigger class="text-sm h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="left">Left</SelectItem>
                                            <SelectItem value="kicked">Kicked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-1.5 sm:col-span-2 lg:col-span-1">
                                    <Label for="edit-gameuid" class="text-sm">Game UID</Label>
                                    <Input id="edit-gameuid" v-model="editForm.gameUid" class="text-sm h-9" />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <Label for="edit-othernames" class="text-sm">Other Names (comma separated)</Label>
                                <Input id="edit-othernames" v-model="editForm.otherNames"
                                    placeholder="alias1, alias2, alias3" class="text-sm h-9" />
                            </div>

                            <!-- Tags Section -->
                            <div class="space-y-3">
                                <Label class="text-sm">Tags</Label>
                                <div class="space-y-2">
                                    <!-- Selected Tags -->
                                    <div v-if="editForm.tags && editForm.tags.length > 0" class="flex flex-wrap gap-2">
                                        <Tag v-for="tagId in editForm.tags" :key="tagId" :tag-id="tagId" removable
                                            @remove="removeTag" />
                                    </div>
                                    <!-- Add Tag Dropdown -->
                                    <Select v-model="selectedTagToAdd" @update:model-value="addTag">
                                        <SelectTrigger class="w-full text-sm h-9">
                                            <SelectValue placeholder="Add a tag..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="[tagId, tagInfo] in availableTagsForAdd" :key="tagId"
                                                :value="tagId">
                                                <div class="flex items-center gap-2">
                                                    <span class="text-sm">{{ tagInfo.label }}</span>
                                                    <span class="text-xs text-foreground/50">{{ tagInfo.description
                                                        }}</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <Label for="edit-notes" class="text-sm">Notes</Label>
                                <Textarea id="edit-notes" v-model="editForm.notes" rows="3" class="text-sm" />
                            </div>

                            <div class="flex items-center justify-end gap-2 pt-3 border-t border-border">
                                <Button type="button" variant="outline" @click="showEditForm = false" size="sm">
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>

                    <!-- Profile View -->
                    <div v-else class="space-y-3">
                        <!-- Stats Grid - Mobile: 2 cols, Desktop: up to 4 cols -->
                        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3">
                            <div
                                class="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <Zap class="w-3 h-3 text-yellow-600" />
                                    <span class="text-xs text-yellow-800 dark:text-yellow-200 font-medium">Power</span>
                                </div>
                                <div class="text-base lg:text-lg font-bold text-yellow-900 dark:text-yellow-100">{{
                                    formatPower(member.power) }}</div>
                            </div>

                            <div
                                class="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <Castle class="w-3 h-3 text-purple-600" />
                                    <span class="text-xs text-purple-800 dark:text-purple-200 font-medium">Castle</span>
                                </div>
                                <div class="text-base lg:text-lg font-bold text-purple-900 dark:text-purple-100">{{
                                    member.castle ||
                                    '-' }}</div>
                            </div>

                            <div
                                class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <Activity class="w-3 h-3 text-green-600" />
                                    <span class="text-xs text-green-800 dark:text-green-200 font-medium">Status</span>
                                </div>
                                <div
                                    class="text-sm lg:text-base font-semibold text-green-900 dark:text-green-100 capitalize">
                                    {{
                                        member.status }}</div>
                            </div>

                            <div v-if="member.country"
                                class="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <MapPin class="w-3 h-3 text-blue-600" />
                                    <span class="text-xs text-blue-800 dark:text-blue-200 font-medium">Country</span>
                                </div>
                                <div class="text-sm lg:text-base font-semibold text-blue-900 dark:text-blue-100">{{
                                    member.country }}</div>
                            </div>

                            <div v-if="member.discord"
                                class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <MessageCircle class="w-3 h-3 text-indigo-600" />
                                    <span
                                        class="text-xs text-indigo-800 dark:text-indigo-200 font-medium">Discord</span>
                                </div>
                                <div class="text-sm lg:text-base font-semibold text-indigo-900 dark:text-indigo-100">{{
                                    member.discord }}</div>
                            </div>

                            <div v-if="member.server"
                                class="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <Server class="w-3 h-3 text-cyan-600" />
                                    <span class="text-xs text-cyan-800 dark:text-cyan-200 font-medium">Server</span>
                                </div>
                                <div class="text-sm lg:text-base font-semibold text-cyan-900 dark:text-cyan-100">{{
                                    member.server }}</div>
                            </div>

                            <div v-if="member.gameUid"
                                class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                                <div class="flex items-center gap-2 mb-1">
                                    <Hash class="w-3 h-3 text-orange-600" />
                                    <span class="text-xs text-orange-800 dark:text-orange-200 font-medium">Game
                                        UID</span>
                                </div>
                                <div
                                    class="text-xs lg:text-sm font-mono text-orange-900 dark:text-orange-100 break-all">
                                    {{ member.gameUid }}</div>
                            </div>

                            <div v-if="member.updatedAt"
                                class="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg p-3 border border-pink-200 dark:border-pink-800 col-span-2 lg:col-span-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <Clock class="w-3 h-3 text-pink-600" />
                                    <span class="text-xs text-pink-800 dark:text-pink-200 font-medium">Last
                                        Updated</span>
                                </div>
                                <div class="text-xs lg:text-sm font-semibold text-pink-900 dark:text-pink-100">{{
                                    formatDate(member.updatedAt) }}</div>
                            </div>
                        </div>

                        <!-- Notes Section -->
                        <div v-if="member.notes"
                            class="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
                            <div class="flex items-center gap-2 mb-2">
                                <MessageSquare class="w-4 h-4 text-slate-600" />
                                <h4 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Notes</h4>
                            </div>
                            <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{{ member.notes }}</p>
                        </div>

                        <!-- Other Names -->
                        <div v-if="member.otherNames?.length"
                            class="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-lg p-3 border border-violet-200 dark:border-violet-800">
                            <div class="flex items-center gap-2 mb-2">
                                <Tags class="w-4 h-4 text-violet-600" />
                                <h4 class="font-semibold text-violet-800 dark:text-violet-200 text-sm">Other Names</h4>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="(name, i) in member.otherNames" :key="i"
                                    class="bg-violet-100 dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700 px-2 py-0.5 rounded-full text-xs text-violet-800 dark:text-violet-200 font-medium">
                                    {{ name }}
                                </span>
                            </div>
                        </div>

                        <!-- Compact History Timeline -->
                        <div v-if="history.length" class="space-y-2">
                            <div class="flex items-center gap-2">
                                <History class="w-4 h-4 text-slate-600" />
                                <h4 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Change History</h4>
                            </div>

                            <div class="space-y-2">
                                <div v-for="(entry, i) in visibleHistory" :key="i"
                                    class="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
                                    <div class="flex justify-between items-center gap-2 mb-1">
                                        <div class="flex items-center gap-2">
                                            <User class="w-3 h-3 text-slate-500" />
                                            <span class="font-medium text-xs text-slate-700 dark:text-slate-300">{{
                                                entry.updatedBy }}</span>
                                        </div>
                                        <span class="text-xs text-slate-500">{{ formatDate(entry.updatedAt) }}</span>
                                    </div>

                                    <div class="space-y-2">
                                        <div v-for="(change, key) in entry.changes" :key="key"
                                            class="bg-slate-100 dark:bg-slate-800/50 rounded p-2 border">
                                            <div
                                                class="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize mb-1">
                                                {{
                                                    formatFieldName(key) }}</div>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <div class="flex items-center gap-1">
                                                    <span
                                                        class="text-xs text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded line-through break-words">
                                                        {{ change.from || '—' }}
                                                    </span>
                                                    <ArrowRight class="h-3 w-3 text-slate-400 flex-shrink-0" />
                                                    <span
                                                        class="text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded break-words">
                                                        {{ change.to || '—' }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="canLoadMore" class="text-center">
                                <Button variant="outline" size="sm" @click="loadMore" class="h-8 text-xs">
                                    <ChevronDown class="h-3 w-3 mr-1" />
                                    Load More
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog :open="confirmDelete" @update:open="(val) => !val && (confirmDelete = false)">
        <DialogContent
            class="w-full h-full sm:w-auto sm:h-auto sm:max-w-md sm:max-h-[95vh] sm:mx-auto sm:rounded-lg rounded-none border-0 sm:border">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2 text-foreground">
                    <AlertTriangle class="w-5 h-5 text-red-500" />
                    Confirm Deletion
                </DialogTitle>
                <DialogDescription class="text-foreground/80">
                    Are you sure you want to delete <span class="font-semibold">{{ member.name }}</span>?
                    This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <div class="flex items-center justify-end gap-2 mt-6">
                <Button variant="outline" @click="confirmDelete = false" size="sm">
                    Cancel
                </Button>
                <Button variant="destructive" @click="handleDelete" size="sm">
                    <Trash2 class="w-4 h-4 mr-2" />
                    Delete Forever
                </Button>
            </div>
        </DialogContent>
    </Dialog>

    <!-- Events Modal -->
    <MemberEventTimelineModal v-if="showEventModal" :member="member" :events="memberEvents"
        @close="showEventModal = false" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
    Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Calendar, Edit, Trash2, User, Crown, Shield, Star, Users, UserCheck,
    Zap, Castle, Activity, MapPin, MessageCircle, Server, Hash, Clock,
    MessageSquare, Tags, History, ArrowRight, ChevronDown, AlertTriangle, X
} from 'lucide-vue-next'
import Badge from './Badge.vue'
import Tag from './Tag.vue'
import { useMembers, MEMBER_TAGS } from '@/composables/topheroes/admin/useMembers'
import { getAuth } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { useToast } from '@/components/ui/toast'
import MemberEventTimelineModal from './MemberEventTimelineModal.vue'
import { useMemberEvents } from '@/composables/topheroes/admin/useMemberEvents'

const { toast } = useToast()
const { updateMember, deleteMemberById } = useMembers()

const props = defineProps({
    member: { type: Object, required: true }
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
const selectedTagToAdd = ref('')

// Helper functions
const formatPower = (n) => {
    if (!n) return '0'
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

const formatDate = (d) => {
    if (!d) return '—'
    const date = typeof d.toDate === 'function' ? d.toDate() : new Date(d)
    return date.toLocaleDateString('en-AU', {
        year: '2-digit', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
    })
}

const formatFieldName = (key) => {
    if (!key) return ''
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
}

const getRoleIcon = (role) => {
    const icons = { R5: Crown, R4: Shield, R3: Star, R2: Users, R1: UserCheck }
    return icons[role] || UserCheck
}

const roleColorMap = {
    R5: '#eab308', R4: '#a855f7', R3: '#3b82f6', R2: '#22c55e', R1: '#64748b'
}

const avatarStyle = computed(() => {
    const color = roleColorMap[props.member.role]
    if (!color) return {}
    return {
        background: `linear-gradient(135deg, ${color}80, ${color}60)`,
        borderColor: color + '60'
    }
})

const roleIconStyle = computed(() => {
    const color = roleColorMap[props.member.role] || '#64748b'
    return { backgroundColor: color }
})

// Tag management
const availableTagsForAdd = computed(() => {
    const currentTags = editForm.value.tags || []
    return Object.entries(MEMBER_TAGS).filter(([tagId]) => !currentTags.includes(tagId))
})

const addTag = (tagId) => {
    if (tagId && editForm.value.tags && !editForm.value.tags.includes(tagId)) {
        editForm.value.tags.push(tagId)
    }
    selectedTagToAdd.value = ''
}

const removeTag = (tagId) => {
    if (editForm.value.tags) {
        editForm.value.tags = editForm.value.tags.filter(id => id !== tagId)
    }
}

// Edit form handling
const initEditForm = () => {
    editForm.value = {
        ...props.member,
        otherNames: props.member.otherNames?.join(', ') || '',
        tags: [...(props.member.tags || [])] // Clone the tags array
    }
}

watch(showEditForm, (newVal) => {
    if (newVal) initEditForm()
})

const getChanges = (oldData, newData) => {
    const changes = {}
    Object.keys(newData).forEach(key => {
        // Special handling for arrays (tags, otherNames)
        if (Array.isArray(newData[key]) && Array.isArray(oldData[key])) {
            const oldSet = new Set(oldData[key])
            const newSet = new Set(newData[key])
            const areEqual = oldSet.size === newSet.size && [...oldSet].every(x => newSet.has(x))
            if (!areEqual) {
                changes[key] = {
                    from: oldData[key]?.join(', ') || '',
                    to: newData[key]?.join(', ') || ''
                }
            }
        } else if (newData[key] !== oldData[key]) {
            changes[key] = { from: oldData[key] ?? null, to: newData[key] }
        }
    })
    return changes
}

const saveEdit = async () => {
    const auth = getAuth()
    const uid = auth.currentUser?.uid || 'unknown'
    const oldData = props.member
    const newData = { ...editForm.value }

    // Process other names
    if (typeof newData.otherNames === 'string') {
        newData.otherNames = newData.otherNames
            .split(',').map(name => name.trim()).filter(name => !!name)
    }

    // Ensure tags is properly handled
    if (!newData.tags) {
        newData.tags = []
    }

    const changes = getChanges(oldData, newData)
    if (!Object.keys(changes).length) {
        showEditForm.value = false
        return
    }

    const updatedMember = {
        ...newData,
        updatedBy: uid,
        updatedAt: serverTimestamp(),
        history: [
            ...(oldData.history || []),
            { updatedBy: uid, updatedAt: new Date(), changes }
        ]
    }

    try {
        await updateMember(props.member.id, updatedMember)
        emit('edit', updatedMember)
        toast({
            variant: 'success',
            title: 'Member Updated',
            description: `${updatedMember.name} was successfully updated.`
        })
        showEditForm.value = false
    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
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
            title: 'Member Deleted',
            description: `${props.member.name} has been deleted.`
        })
        emit('delete', props.member.id)
        emit('close')
        confirmDelete.value = false
    } catch (err) {
        console.error('Failed to delete member:', err)
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: `Could not delete ${props.member.name}.`
        })
    }
}

const handleViewEvents = () => {
    showEventModal.value = true
}

// History management
const history = computed(() => (props.member.history || []).slice().reverse())
const visibleCount = ref(3)
const visibleHistory = computed(() => history.value.slice(0, visibleCount.value))
const canLoadMore = computed(() => visibleCount.value < history.value.length)
const loadMore = () => { visibleCount.value += 3 }
</script>

<style scoped>
/* Custom scrollbar styling with proper spacing */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground)) hsl(var(--muted));
}

.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: hsl(var(--muted));
    border-radius: 4px;
    margin: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: hsl(var(--muted-foreground));
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--foreground) / 0.6);
}

/* Text utilities */
.break-all {
    word-break: break-all;
    overflow-wrap: break-word;
}
</style>