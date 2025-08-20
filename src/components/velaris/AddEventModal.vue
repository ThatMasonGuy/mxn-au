<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 text-slate-200 backdrop-blur-sm">
            <DialogHeader>
                <DialogTitle
                    class="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Add New Event
                </DialogTitle>
                <DialogDescription class="text-slate-400">
                    Fill in the event details below to create a new tournament or competition.
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6 mt-6"
                :class="{ 'opacity-50 pointer-events-none': isSubmitting }">

                <!-- Guild Information -->
                <div
                    class="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                        <Crown class="w-5 h-5 mr-2 text-amber-400" />
                        Guild Information
                    </h3>
                    <div>
                        <Label for="guildShort" class="text-sm font-medium text-slate-300">Guild Short Code</Label>
                        <Input id="guildShort" v-model="form.guildShort" required
                            class="mt-2 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                            maxlength="3" placeholder="e.g., VLR" />
                    </div>
                </div>

                <!-- Event Details -->
                <div
                    class="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                        <Calendar class="w-5 h-5 mr-2 text-indigo-400" />
                        Event Details
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label for="status" class="text-sm font-medium text-slate-300">Event Status</Label>
                            <Select v-model="form.status" @update:modelValue="updateEventName">
                                <SelectTrigger
                                    class="mt-2 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent class="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="active">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                            <span>Active</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="upcoming">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <span>Upcoming</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-2 h-2 bg-slate-400 rounded-full"></div>
                                            <span>Completed</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label for="type" class="text-sm font-medium text-slate-300">Event Type</Label>
                            <Select v-model="form.type">
                                <SelectTrigger
                                    class="mt-2 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent class="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="KvK">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded">
                                            </div>
                                            <span>Kingdom vs Kingdom</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="GvG">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded">
                                            </div>
                                            <span>Guild vs Guild</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="GR">
                                        <div class="flex items-center space-x-2">
                                            <div class="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded">
                                            </div>
                                            <span>Guild Race</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <!-- Date Configuration -->
                <div
                    class="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                        <CalendarDays class="w-5 h-5 mr-2 text-emerald-400" />
                        Date Configuration
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label for="startDate" class="text-sm font-medium text-slate-300">Start Date</Label>
                            <Input id="startDate" type="date" v-model="form.startDate" required
                                class="mt-2 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                        </div>
                        <div>
                            <Label for="endDate" class="text-sm font-medium text-slate-300">End Date</Label>
                            <Input id="endDate" type="date" v-model="form.endDate" required
                                class="mt-2 bg-slate-700/50 border-slate-600 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                        </div>
                    </div>
                </div>

                <!-- Generated Event ID -->
                <div
                    class="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg p-4 border border-indigo-500/30">
                    <Label for="eventId" class="text-sm font-medium text-indigo-300 flex items-center">
                        <Tag class="w-4 h-4 mr-2" />
                        Generated Event ID
                    </Label>
                    <Input id="eventId" :value="generatedId || 'Complete form to generate ID'" readonly
                        class="mt-2 bg-slate-700/30 border-slate-600/50 text-indigo-200 cursor-not-allowed" />
                    <p class="text-xs text-slate-400 mt-2">This ID will be automatically generated based on your
                        selections</p>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
                    <Button variant="outline" type="button" @click="$emit('close')" :disabled="isSubmitting"
                        class="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-all duration-200">
                        <X class="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button type="submit"
                        class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                        :disabled="isSubmitting || !generatedId">
                        <Plus v-if="!isSubmitting" class="w-4 h-4 mr-2" />
                        <div v-else
                            class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full">
                        </div>
                        {{ isSubmitting ? 'Creating...' : 'Create Event' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useToast } from '@/components/ui/toast'
import { getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { Crown, Calendar, CalendarDays, Tag, Plus, X } from 'lucide-vue-next'

const router = useRouter()
const emit = defineEmits(['close'])
const { toast } = useToast()

const user = getAuth().currentUser
const isSubmitting = ref(false)

const form = ref({
    eventId: '',
    status: 'active',
    type: '',
    guild: 'Velaris',
    guildShort: 'VLR',
    startDate: '',
    endDate: '',
});

const updateEventName = (val) => {
    const map = {
        KvK: 'Kingdom vs Kingdom',
        GvG: 'Guild vs Guild',
        GR: 'Guild Race',
    };
    return map[val] || 'Unknown Event';
};

const generatedId = computed(() => {
    if (!form.value.type || !form.value.guildShort || !form.value.startDate) return ''
    const date = new Date(form.value.startDate)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${form.value.guildShort.toLowerCase()}-${form.value.type.toLowerCase()}-${month}-${year}`
})

const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const eventId = generatedId.value
        const eventRef = doc(firestore, `topheroes/velaris/events/${eventId}`)
        const eventTitle = updateEventName(form.value.type);

        await setDoc(eventRef, {
            ...form.value,
            eventId,
            event: eventTitle,
            startDate: new Date(form.value.startDate),
            endDate: new Date(form.value.endDate),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            memberIds: [],
            enteredBy: user?.userName || user?.email || 'Unknown',
        });

        toast({
            variant: 'success',
            title: 'Event Created',
            description: `${eventTitle} has been created successfully.`
        })

        emit('close')
        router.push(`/topheroes/velaris/admin/events/${eventId}/edit`)
    } catch (err) {
        console.error('Failed to add event:', err)
        toast({
            variant: 'destructive',
            title: 'Failed to Create Event',
            description: 'There was an error creating your event. Please try again.'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Glass morphism effect */
.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}
</style>