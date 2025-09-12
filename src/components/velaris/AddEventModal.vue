<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="max-w-2xl max-h-[90vh] bg-background border border-border/60 text-foreground backdrop-blur-sm flex flex-col">
            <DialogHeader class="flex-shrink-0">
                <DialogTitle
                    class="text-2xl font-bold bg-gradient-to-r from-velaris-purple to-velaris-teal bg-clip-text text-transparent">
                    Add New Event
                </DialogTitle>
                <DialogDescription class="text-foreground/70">
                    Fill in the event details below to create a new tournament or competition.
                </DialogDescription>
            </DialogHeader>

            <div class="flex-1 overflow-y-auto p-1 pt-0">
                <form @submit.prevent="handleSubmit" class="space-y-6 mt-6 pr-2"
                    :class="{ 'opacity-50 pointer-events-none': isSubmitting }">

                    <!-- Guild Information -->
                    <div class="elev-card p-4 border border-border/30">
                        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Crown class="w-5 h-5 mr-2 text-velaris-amber" />
                            Guild Information
                        </h3>
                        <div>
                            <Label for="guildShort" class="text-sm font-medium text-foreground/80">Guild Short
                                Code</Label>
                            <Input id="guildShort" v-model="form.guildShort" required
                                class="mt-2 bg-background border-border/60 text-foreground focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple transition-all duration-200"
                                maxlength="3" placeholder="e.g., VLR" />
                        </div>
                    </div>

                    <!-- Event Details -->
                    <div class="elev-card p-4 border border-border/30">
                        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Calendar class="w-5 h-5 mr-2 text-velaris-purple" />
                            Event Details
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label for="status" class="text-sm font-medium text-foreground/80">Event Status</Label>
                                <Select v-model="form.status" @update:modelValue="updateEventName">
                                    <SelectTrigger
                                        class="mt-2 bg-background border-border/60 text-foreground focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-background border-border/60 text-foreground">
                                        <SelectItem value="active" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-2 h-2 bg-velaris-green rounded-full"></div>
                                                <span>Active</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="upcoming" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-2 h-2 bg-velaris-teal rounded-full"></div>
                                                <span>Upcoming</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-2 h-2 bg-foreground/50 rounded-full"></div>
                                                <span>Completed</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label for="type" class="text-sm font-medium text-foreground/80">Event Type</Label>
                                <Select v-model="form.type">
                                    <SelectTrigger
                                        class="mt-2 bg-background border-border/60 text-foreground focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent class="bg-background border-border/60 text-foreground">
                                        <SelectItem value="KvK" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div
                                                    class="w-3 h-3 bg-gradient-to-r from-velaris-purple to-velaris-teal rounded">
                                                </div>
                                                <span>Kingdom vs Kingdom</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="GvG" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div
                                                    class="w-3 h-3 bg-gradient-to-r from-velaris-teal to-velaris-green rounded">
                                                </div>
                                                <span>Guild vs Guild</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="GR" class="hover:bg-foreground/5">
                                            <div class="flex items-center space-x-2">
                                                <div
                                                    class="w-3 h-3 bg-gradient-to-r from-velaris-amber to-velaris-purple rounded">
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
                    <div class="elev-card p-4 border border-border/30">
                        <h3 class="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <CalendarDays class="w-5 h-5 mr-2 text-velaris-green" />
                            Date Configuration
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label for="startDate" class="text-sm font-medium text-foreground/80">Start Date</Label>
                                <Input id="startDate" type="date" v-model="form.startDate" required
                                    class="mt-2 bg-background border-border/60 text-foreground focus:ring-2 focus:ring-velaris-green/50 focus:border-velaris-green transition-all duration-200" />
                            </div>
                            <div>
                                <Label for="endDate" class="text-sm font-medium text-foreground/80">End Date</Label>
                                <Input id="endDate" type="date" v-model="form.endDate" required
                                    class="mt-2 bg-background border-border/60 text-foreground focus:ring-2 focus:ring-velaris-green/50 focus:border-velaris-green transition-all duration-200" />
                            </div>
                        </div>
                    </div>

                    <!-- Generated Event ID -->
                    <div class="bg-velaris-purple/10 rounded-lg p-4 border border-velaris-purple/30">
                        <Label for="eventId" class="text-sm font-medium text-velaris-purple flex items-center">
                            <Tag class="w-4 h-4 mr-2" />
                            Generated Event ID
                        </Label>
                        <Input id="eventId" :value="generatedId || 'Complete form to generate ID'" readonly
                            class="mt-2 bg-background/50 border-border/50 text-velaris-purple cursor-not-allowed" />
                        <p class="text-xs text-foreground/60 mt-2">This ID will be automatically generated based on your
                            selections</p>
                    </div>
                </form>
            </div>

            <!-- Action Buttons - Fixed at bottom -->
            <div class="flex-shrink-0 flex justify-end gap-3 pt-3 border-t border-border/60 mt-3">
                <button type="button" @click="$emit('close')" :disabled="isSubmitting" class="btn-soft-violet">
                    <X class="w-4 h-4 mr-2" />
                    Cancel
                </button>
                <button type="submit" @click="handleSubmit" class="btn-solid-purple"
                    :disabled="isSubmitting || !generatedId">
                    <Plus v-if="!isSubmitting" class="w-4 h-4 mr-2" />
                    <div v-else
                        class="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full">
                    </div>
                    {{ isSubmitting ? 'Creating...' : 'Create Event' }}
                </button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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