<template>
    <Dialog :open="true" @update:open="(val) => !val && $emit('close')">
        <DialogContent
            class="w-full max-w-4xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div
                    class="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000">
                </div>
            </div>

            <!-- Scrollable content -->
            <div class="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <!-- Enhanced Header -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-700/50 mb-6">
                    <div class="space-y-2">
                        <DialogTitle
                            class="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                            <UserPlus class="w-8 h-8 text-cyan-400" />
                            Add New Member
                        </DialogTitle>
                        <DialogDescription class="text-slate-400 text-sm max-w-2xl">
                            Fill in the member details below to add them to the guild roster. All fields marked with *
                            are required.
                        </DialogDescription>
                    </div>

                    <Button size="sm" variant="outline" @click="showBulkImport = true"
                        class="bg-slate-800/50 border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/70 backdrop-blur-sm group">
                        <Upload class="w-4 h-4 mr-2 group-hover:text-cyan-400 transition-colors" />
                        Bulk Import
                    </Button>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-8">
                    <!-- Core Information Section -->
                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User class="w-5 h-5 text-cyan-400" />
                            Core Information
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <Label for="name" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    Name
                                </Label>
                                <Input id="name" v-model="form.name" placeholder="funkyfrog"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <Label for="role" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    Role
                                </Label>
                                <Select v-model="form.role" required>
                                    <SelectTrigger
                                        class="bg-slate-800/80 border-slate-600/50 text-white focus:border-cyan-500/50 hover:border-slate-500/70 transition-all duration-300">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-800 border-slate-600">
                                        <SelectItem value="R5" class="flex items-center gap-2">
                                            <Crown class="w-4 h-4 text-yellow-400" />
                                            R5 - Leader
                                        </SelectItem>
                                        <SelectItem value="R4" class="flex items-center gap-2">
                                            <Shield class="w-4 h-4 text-purple-400" />
                                            R4 - Officer
                                        </SelectItem>
                                        <SelectItem value="R3" class="flex items-center gap-2">
                                            <Star class="w-4 h-4 text-blue-400" />
                                            R3 - Elite
                                        </SelectItem>
                                        <SelectItem value="R2" class="flex items-center gap-2">
                                            <Users class="w-4 h-4 text-green-400" />
                                            R2 - Member
                                        </SelectItem>
                                        <SelectItem value="R1" class="flex items-center gap-2">
                                            <UserCheck class="w-4 h-4 text-slate-400" />
                                            R1 - Recruit
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="space-y-2">
                                <Label for="status" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    Status
                                </Label>
                                <Select v-model="form.status" required>
                                    <SelectTrigger
                                        class="bg-slate-800/80 border-slate-600/50 text-white focus:border-cyan-500/50 hover:border-slate-500/70 transition-all duration-300">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-slate-800 border-slate-600">
                                        <SelectItem value="active" class="flex items-center gap-2">
                                            <Activity class="w-4 h-4 text-green-400" />
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive" class="flex items-center gap-2">
                                            <Pause class="w-4 h-4 text-yellow-400" />
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="left" class="flex items-center gap-2">
                                            <LogOut class="w-4 h-4 text-blue-400" />
                                            Left
                                        </SelectItem>
                                        <SelectItem value="kicked" class="flex items-center gap-2">
                                            <Ban class="w-4 h-4 text-red-400" />
                                            Kicked
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <!-- Game Statistics Section -->
                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Zap class="w-5 h-5 text-yellow-400" />
                            Game Statistics
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <Label for="power" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    <Zap class="w-4 h-4 text-yellow-400" />
                                    Power
                                </Label>
                                <Input id="power" type="number" v-model.number="form.power" placeholder="44100000"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <Label for="castle" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    <Castle class="w-4 h-4 text-purple-400" />
                                    Castle Level
                                </Label>
                                <Input id="castle" type="number" v-model.number="form.castle" placeholder="40"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <Label for="gameUid" class="text-slate-300 font-medium flex items-center gap-2">
                                    <Hash class="w-4 h-4 text-orange-400" />
                                    Game UID
                                </Label>
                                <Input id="gameUid" v-model="form.gameUid" placeholder="396541251549"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300" />
                            </div>
                        </div>
                    </div>

                    <!-- Contact & Location Section -->
                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Globe class="w-5 h-5 text-blue-400" />
                            Contact & Location
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <Label for="country" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    <MapPin class="w-4 h-4 text-blue-400" />
                                    Country
                                </Label>
                                <Input id="country" v-model="form.country" placeholder="United States"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300"
                                    required />
                            </div>

                            <div class="space-y-2">
                                <Label for="discord" class="text-slate-300 font-medium flex items-center gap-2">
                                    <MessageCircle class="w-4 h-4 text-indigo-400" />
                                    Discord
                                </Label>
                                <Input id="discord" v-model="form.discord" placeholder="@username"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300" />
                            </div>

                            <div class="space-y-2">
                                <Label for="server" class="text-slate-300 font-medium flex items-center gap-2">
                                    <span class="text-red-400">*</span>
                                    <Server class="w-4 h-4 text-cyan-400" />
                                    Server
                                </Label>
                                <Input id="server" v-model="form.server" placeholder="s10154"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300"
                                    required />
                            </div>
                        </div>
                    </div>

                    <!-- Additional Information Section -->
                    <div class="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText class="w-5 h-5 text-slate-400" />
                            Additional Information
                        </h3>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <Label for="otherNames" class="text-slate-300 font-medium flex items-center gap-2">
                                    <Tags class="w-4 h-4 text-slate-400" />
                                    Other Names (comma separated)
                                </Label>
                                <Input id="otherNames" v-model="otherNamesInput" placeholder="froggy, frog, frogvader"
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300" />
                                <p class="text-xs text-slate-500">Enter alternative names or nicknames separated by
                                    commas</p>
                            </div>

                            <div class="space-y-2">
                                <Label for="notes" class="text-slate-300 font-medium flex items-center gap-2">
                                    <MessageSquare class="w-4 h-4 text-slate-400" />
                                    Notes
                                </Label>
                                <Textarea id="notes" v-model="form.notes"
                                    placeholder="Optional notes or commentary about this member..."
                                    class="bg-slate-800/80 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 hover:border-slate-500/70 transition-all duration-300 min-h-[100px]" />
                                <p class="text-xs text-slate-500">Add any relevant notes about the member's performance,
                                    behavior, or special circumstances</p>
                            </div>

                            <div
                                class="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                <input type="checkbox" id="locked" v-model="form.locked"
                                    class="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" />
                                <Label for="locked"
                                    class="text-slate-300 font-medium flex items-center gap-2 cursor-pointer">
                                    <Lock class="w-4 h-4 text-yellow-400" />
                                    Lock Member Profile
                                </Label>
                                <div class="ml-auto">
                                    <span class="text-xs text-slate-500">Prevents accidental edits</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-700/50">
                        <Button type="button" variant="outline" @click="$emit('close')"
                            class="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/70 hover:border-slate-500/70 order-2 sm:order-1">
                            <X class="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit"
                            class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 order-1 sm:order-2">
                            <UserPlus class="w-4 h-4 mr-2" />
                            Add Member
                        </Button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>

    <BulkMemberImportModal v-if="showBulkImport" @close="showBulkImport = false" @imported="onBulkImport" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    UserPlus, Upload, User, Crown, Shield, Star, Users, UserCheck,
    Activity, Pause, LogOut, Ban, Zap, Castle, Hash, Globe, MapPin,
    MessageCircle, Server, FileText, Tags, MessageSquare, Lock, X
} from 'lucide-vue-next'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import BulkMemberImportModal from './BulkMemberImportModal.vue'
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();

const showBulkImport = ref(false)
const { addMember } = useMembers()

const props = defineProps({
    initial: Object
})

const emit = defineEmits(['close'])

const onBulkImport = () => {
    showBulkImport.value = false
    emit('close')
}

const form = ref({
    name: '',
    role: '',
    status: '',
    power: null,
    castle: null,
    country: '',
    discord: '',
    server: '',
    gameUid: '',
    notes: '',
    otherNames: [],
    locked: false
})

const otherNamesInput = ref('')

watchEffect(() => {
    if (!props.initial) return
    form.value = { ...props.initial }
    otherNamesInput.value = props.initial.otherNames?.join(', ') || ''
})

const handleSubmit = async () => {
    const otherNamesArray = otherNamesInput.value
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)

    const payload = {
        ...form.value,
        otherNames: otherNamesArray
    }

    try {
        await addMember(payload)
        toast({
            variant: 'success',
            title: 'Member Added Successfully',
            description: `${form.value.name} has been added to the guild roster.`
        })
        emit('close')
    } catch (err) {
        console.error('Failed to add member:', err)
        toast({
            variant: 'destructive',
            title: 'Failed to Add Member',
            description: `Unable to add ${form.value.name}. Please try again.`
        })
    }
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

/* Form field animations */
input:focus,
textarea:focus,
select:focus {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(6, 182, 212, 0.15), 0 0 0 3px rgba(6, 182, 212, 0.1);
}

/* Enhanced button animations */
button:hover {
    transform: translateY(-1px);
}

/* Section hover effects */
.bg-slate-800\/30:hover {
    background-color: rgba(30, 41, 59, 0.4);
    border-color: rgba(71, 85, 105, 0.7);
}
</style>