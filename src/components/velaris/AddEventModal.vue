<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent class="max-w-lg bg-slate-900 border border-slate-700 text-slate-200">
            <DialogHeader>
                <DialogTitle class="text-xl font-bold text-white">Add New Event</DialogTitle>
                <DialogDescription class="text-slate-400">Fill in the event details below.</DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4 mt-4"
                :class="{ 'opacity-50 pointer-events-none': isSubmitting }">
                <div>
                    <Label for="guildShort" class="text-sm">Guild Short Code</Label>
                    <Input id="guildShort" v-model="form.guildShort" required
                        class="bg-slate-800 border-slate-700 text-white" maxlength="3" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="type" class="text-sm">Event Status</Label>
                        <Select v-model="form.status" @update:modelValue="updateEventName">
                            <SelectTrigger class="bg-slate-800 border-slate-700 text-white w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent class="bg-slate-800 text-white">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label for="type" class="text-sm">Event Type</Label>
                        <Select v-model="form.type">
                            <SelectTrigger class="bg-slate-800 border-slate-700 text-white w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent class="bg-slate-800 text-white">
                                <SelectItem value="KvK">KvK</SelectItem>
                                <SelectItem value="GvG">GvG</SelectItem>
                                <SelectItem value="GR">GR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <Label for="startDate" class="text-sm">Start Date</Label>
                        <Input id="startDate" type="date" v-model="form.startDate" required
                            class="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div>
                        <Label for="endDate" class="text-sm">End Date</Label>
                        <Input id="endDate" type="date" v-model="form.endDate" required
                            class="bg-slate-800 border-slate-700 text-white" />
                    </div>
                </div>
                <div>
                    <Label for="eventId" class="text-sm">Generated Event ID</Label>
                    <Input id="eventId" :value="generatedId" readonly
                        class="bg-slate-800 border-slate-700 text-gray-400" />
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <Button variant="outline" type="button" @click="$emit('close')" :disabled="isSubmitting"
                        class="text-gray-700">Cancel</Button>
                    <Button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white" :disabled="isSubmitting">
                        <span v-if="!isSubmitting">Create</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4" />
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                            </svg>
                            Creating...
                        </span>
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
const router = useRouter()

const emit = defineEmits(['close'])
const { toast } = useToast()

const user = getAuth().currentUser
const isSubmitting = ref(false)

const form = ref({
    eventId: '',
    status: 'active',
    type: '',
    event: '',
    guild: 'Velaris',
    guildShort: 'VLR',
    startDate: '',
    endDate: '',
})

const updateEventName = (val) => {
    const map = { KvK: 'Kingdom vs Kingdom', GvG: 'Guild vs Guild', GR: 'Guild Race' }
    form.value.event = map[val] || ''
}

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

        await setDoc(eventRef, {
            ...form.value,
            eventId,
            startDate: new Date(form.value.startDate),
            endDate: new Date(form.value.endDate),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            memberIds: [],
            enteredBy: user?.userName || 'Unknown'
        })

        toast({
            variant: 'success',
            title: 'Event created',
            description: `${form.value.eventId} has been created.`
        })

        emit('close')
        router.push(`/topheroes/velaris/admin/events/${form.value.eventId}/edit`)
    } catch (err) {
        console.error('Failed to add event:', err)
        toast({
            variant: 'destructive',
            title: 'Failed to create event',
            description: `${form.value.eventId} could not be created.`
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>