<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-600 shadow-xl">
            <DialogHeader class="border-b border-slate-700 pb-4">
                <DialogTitle class="text-3xl font-bold text-white flex items-center">
                    <div class="h-8 w-1 bg-indigo-500 mr-3 rounded-full"></div>
                    Event History – {{ member.name }}
                </DialogTitle>
            </DialogHeader>

            <div class="space-y-6 border-l-2 border-indigo-500/40 pl-6 mt-8 relative">
                <div v-for="event in sortedEvents" :key="event.id" class="relative">
                    <!-- Timeline dot -->
                    <div
                        :class="['absolute -left-8 top-2 w-6 h-6 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center', eventColor(event.type)]">
                        <span class="text-xs font-bold text-white">{{ eventIcon(event.type) }}</span>
                    </div>

                    <!-- Event card -->
                    <div
                        class="bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-slate-700 transition-all hover:border-slate-600">
                        <!-- Event header -->
                        <div
                            class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
                            <div class="flex items-center gap-3">
                                <span
                                    :class="['px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase', eventBadgeColor(event.type)]">
                                    {{ event.type }}
                                </span>
                                <span class="text-slate-300 font-mono">{{ event.eventId }}</span>
                            </div>
                            <div class="text-slate-400 text-sm">
                                {{ formatDate(event.enteredDate) }}
                            </div>
                        </div>

                        <!-- Event details -->
                        <div class="mt-4" :class="{ 'opacity-50': editingEvent === event.id }">
                            <div class="grid md:grid-cols-2 gap-4">
                                <!-- Left column - Core stats -->
                                <div class="space-y-2">
                                    <div class="flex items-center">
                                        <div class="w-20 text-slate-400 text-sm">Power:</div>
                                        <div class="text-white font-bold">{{ formatPower(event.power) }}</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-20 text-slate-400 text-sm">Castle:</div>
                                        <div class="text-white font-medium">{{ event.castle }}</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-20 text-slate-400 text-sm">Role:</div>
                                        <div class="text-white font-medium">{{ event.role }}</div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="w-20 text-slate-400 text-sm">Rank:</div>
                                        <div class="text-white font-medium">#{{ event.overallRank }}</div>
                                    </div>
                                </div>

                                <!-- Right column - Overall score -->
                                <div class="flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-sm text-slate-400">Overall Score</div>
                                        <div class="text-3xl font-bold text-white">{{ formatNumber(event.overallScore)
                                            }}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Day scores -->
                            <div v-if="!event.score" class="mt-6">
                                <div class="text-xs uppercase text-slate-400 mb-2 font-semibold">Daily Scores</div>
                                <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                                    <div v-for="d in 6" :key="d" :class="['bg-slate-700/80 px-2 py-2 rounded-lg text-center transition-all',
                                        event[`scoreD${d}`] > 0 ? 'border border-slate-600 shadow-inner' : 'opacity-50']">
                                        <span class="text-xs text-slate-400 block">Day {{ d }}</span>
                                        <span class="text-white font-medium">{{ formatNumber(event[`scoreD${d}`] || 0)
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Notes section -->
                            <div v-if="event.notes" class="mt-4 bg-slate-700/30 p-3 rounded-lg border border-slate-700">
                                <div class="text-xs uppercase text-slate-400 mb-1 font-semibold">Notes</div>
                                <p class="text-slate-300 text-sm">{{ event.notes }}</p>
                            </div>
                        </div>

                        <!-- Edit form -->
                        <div v-if="editingEvent === event.id"
                            class="mt-5 bg-slate-700/60 backdrop-blur p-4 rounded-xl border border-slate-600 shadow-lg">
                            <div class="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs text-slate-300 mb-1">Power</label>
                                    <input v-model="editForm.power"
                                        class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label class="block text-xs text-slate-300 mb-1">Castle</label>
                                    <input v-model="editForm.castle"
                                        class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div class="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs text-slate-300 mb-1">Role</label>
                                    <input v-model="editForm.role"
                                        class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label class="block text-xs text-slate-300 mb-1">Overall Rank</label>
                                    <input v-model="editForm.overallRank"
                                        class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-xs text-slate-300 mb-1">Daily Scores</label>
                                <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                                    <div v-for="d in 6" :key="d">
                                        <input v-model="editForm[`scoreD${d}`]" :placeholder="`Day ${d}`"
                                            class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-xs text-slate-300 mb-1">Notes</label>
                                <textarea v-model="editForm.notes"
                                    class="w-full bg-slate-800 rounded px-3 py-2 text-white border border-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    rows="2"></textarea>
                            </div>

                            <div class="flex justify-end gap-2 pt-2">
                                <Button variant="outline" size="sm" @click="editingEvent = null"
                                    class="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    Cancel
                                </Button>
                                <Button variant="default" size="sm" @click="saveChanges(event)"
                                    class="bg-indigo-600 hover:bg-indigo-700">
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 flex justify-end">
                            <Button v-if="editingEvent !== event.id" variant="ghost" size="sm"
                                @click="toggleEdit(event.id)" class="text-slate-300 hover:bg-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="w-4 h-4 mr-1">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { firestore } from '@/firebase'
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();

const props = defineProps({
    member: Object,
    events: Array
})

const emit = defineEmits(['close'])
const editingEvent = ref(null)
const editForm = ref({})

const toggleEdit = (id) => {
    editingEvent.value = editingEvent.value === id ? null : id
    if (editingEvent.value) {
        const target = props.events.find(e => e.id === id)
        editForm.value = { ...target }
    }
}

const formatDate = (d) => {
    if (!d) return '—'
    const date = typeof d.toDate === 'function' ? d.toDate() : new Date(d)
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatPower = (n) => Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
}).format(Number(n) || 0)

const formatNumber = (n) => Intl.NumberFormat('en').format(Number(n) || 0)

const eventColor = (type) => ({
    KvK: 'bg-blue-500',
    GvG: 'bg-purple-600',
    GR: 'bg-green-500'
}[type] || 'bg-slate-500')

const eventBadgeColor = (type) => ({
    KvK: 'bg-blue-500/20 text-blue-300',
    GvG: 'bg-purple-500/20 text-purple-300',
    GR: 'bg-green-500/20 text-green-300'
}[type] || 'bg-slate-500/20 text-slate-300')

const eventIcon = (type) => ({
    KvK: 'K',
    GvG: 'G',
    GR: 'R'
}[type] || '?')

const sortedEvents = computed(() => [...props.events].sort((a, b) => new Date(b.enteredDate) - new Date(a.enteredDate)))

const saveChanges = async (event) => {
  const auth = getAuth()
  const uid = auth.currentUser?.uid || 'system'

  const eventRef = doc(firestore, `topheroes/velaris/members/${props.member.id}/events/${event.id}`)
  const memberRef = doc(firestore, `topheroes/velaris/members/${props.member.id}`)

  const updates = { ...editForm.value }

  // Recalculate overallScore
  if (['KvK', 'GvG'].includes(updates.type)) {
    const dayScores = [1, 2, 3, 4, 5, 6].map(d => Number(updates[`scoreD${d}`]) || 0)
    updates.overallScore = dayScores.reduce((sum, val) => sum + val, 0)
  } else if (updates.type === 'GR') {
    updates.overallScore = Number(updates.score) || 0
  }

  // Detect changes
  const changes = {}
  Object.keys(updates).forEach(key => {
    if (event[key] !== updates[key]) {
      changes[key] = {
        from: event[key] ?? null,
        to: updates[key] ?? null
      }
    }
  })

  try {
    await updateDoc(eventRef, updates)

    if (Object.keys(changes).length > 0) {
      await updateDoc(memberRef, {
        history: arrayUnion({
          updatedBy: uid,
          updatedAt: new Date(),
          changes
        })
      })
    }

    toast({
      variant: 'success',
      title: 'Update Successful',
      description: `${event.eventId} was updated.`
    })

    editingEvent.value = null
  } catch (err) {
    console.error('Failed to update event:', err)
    toast({
      variant: 'destructive',
      title: 'Update Failed',
      description: `Could not update ${event.eventId}.`
    })
  }
}
</script>

<style scoped>
input,
textarea {
    outline: none;
    transition: all 0.2s;
}
</style>