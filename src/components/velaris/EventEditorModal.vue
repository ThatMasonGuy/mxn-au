<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent class="max-w-4xl bg-slate-900 border border-slate-700">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold text-white">
                    Editing Event: {{ event.eventId }} ({{ event.type }})
                </DialogTitle>
                <DialogDescription class="text-slate-300">
                    Manage participating members, scores, and metadata.
                </DialogDescription>
            </DialogHeader>

            <div class="mt-4 text-sm text-slate-300">
                <div class="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label class="text-slate-400 text-xs">Guild</label>
                        <div class="text-white font-medium">{{ event.guild }}</div>
                    </div>
                    <div>
                        <label class="text-slate-400 text-xs">Date</label>
                        <div class="text-white font-medium">{{ formatDate(event.enteredDate) }}</div>
                    </div>
                </div>
            </div>

            <div class="mt-6">
                <div class="text-white font-semibold mb-2">Participants</div>
                <div class="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <EventParticipantTable :participants="participants" />
                </div>
            </div>

            <div class="mt-6 flex justify-end">
                <Button variant="outline" @click="$emit('close')">Close</Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import EventParticipantTable from './EventParticipantTable.vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'

const props = defineProps({
    event: Object
})

const participants = ref([])

const formatDate = (d) => {
    const date = typeof d?.toDate === 'function' ? d.toDate() : new Date(d)
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const loadParticipants = () => {
    const refCol = collection(firestore, `topheroes/velaris/events/${props.event.id}/participants`)
    onSnapshot(refCol, (snapshot) => {
        participants.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
}

onMounted(() => {
    loadParticipants()
})
</script>

<style scoped></style>