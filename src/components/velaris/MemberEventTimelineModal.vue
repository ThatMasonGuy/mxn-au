<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="w-full max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl shadow-black/50 backdrop-blur-xl">

            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div
                    class="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000">
                </div>
                <div
                    class="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-500">
                </div>
            </div>

            <!-- Scrollable content -->
            <div class="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <!-- Enhanced Header -->
                <DialogHeader class="border-b border-slate-700/50 pb-6 mb-8">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Calendar class="w-6 h-6 text-white" />
                        </div>
                        <div class="space-y-2">
                            <DialogTitle class="text-3xl font-bold text-white flex items-center gap-3">
                                Event History
                                <span
                                    class="text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    {{ member.name }}
                                </span>
                            </DialogTitle>
                            <div class="flex items-center gap-2 text-slate-400 text-sm">
                                <Trophy class="w-4 h-4" />
                                <span>{{ sortedEvents.length }} event{{ sortedEvents.length !== 1 ? 's' : '' }}
                                    recorded</span>
                                <span class="text-slate-600">•</span>
                                <span>{{ activeEvents.length }} active participation{{ activeEvents.length !== 1 ? 's' :
                                    '' }}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <!-- Event Statistics Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
                        <div class="flex items-center gap-3 mb-2">
                            <Swords class="w-5 h-5 text-blue-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold tracking-wide">KvK Events</span>
                        </div>
                        <div class="text-white font-bold text-xl">{{ kvkEvents.length }}</div>
                    </div>

                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
                        <div class="flex items-center gap-3 mb-2">
                            <Shield class="w-5 h-5 text-purple-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold tracking-wide">GvG Events</span>
                        </div>
                        <div class="text-white font-bold text-xl">{{ gvgEvents.length }}</div>
                    </div>

                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
                        <div class="flex items-center gap-3 mb-2">
                            <Crown class="w-5 h-5 text-green-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold tracking-wide">GR Events</span>
                        </div>
                        <div class="text-white font-bold text-xl">{{ grEvents.length }}</div>
                    </div>

                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300">
                        <div class="flex items-center gap-3 mb-2">
                            <TrendingUp class="w-5 h-5 text-cyan-400" />
                            <span class="text-xs uppercase text-slate-400 font-semibold tracking-wide">Avg Score</span>
                        </div>
                        <div class="text-white font-bold text-xl">{{ formatNumber(averageScore) }}</div>
                    </div>
                </div>

                <!-- Events Timeline -->
                <div class="relative">
                    <!-- Timeline line -->
                    <div
                        class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 opacity-30">
                    </div>

                    <div class="space-y-8">
                        <div v-for="event in sortedEvents" :key="event.id" class="relative">
                            <!-- Enhanced Timeline dot -->
                            <div :class="['absolute left-4 top-6 w-8 h-8 rounded-full border-2 border-slate-900 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110', eventColor(event.type)]"
                                :style="{ boxShadow: `0 0 20px ${eventGlowColor(event.type)}40` }">
                                <component :is="eventIconComponent(event.type)" class="w-4 h-4 text-white font-bold" />
                            </div>

                            <!-- Enhanced Event card -->
                            <div class="ml-20 group">
                                <div class="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-slate-600/70 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-[1.01]"
                                    :class="{ 'ring-2 ring-cyan-500/30': editingEvent === event.id }">

                                    <!-- Event header -->
                                    <div
                                        class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/30">
                                        <div class="flex items-center gap-4">
                                            <span
                                                :class="['px-4 py-2 rounded-xl text-sm font-bold tracking-wide uppercase shadow-lg', eventBadgeColor(event.type)]"
                                                :style="{ boxShadow: `0 0 15px ${eventGlowColor(event.type)}30` }">
                                                {{ event.type }}
                                            </span>
                                            <div class="space-y-1">
                                                <div class="text-slate-300 font-mono text-lg font-semibold">{{
                                                    event.eventId }}</div>
                                                <div class="text-slate-400 text-sm flex items-center gap-2">
                                                    <CalendarDays class="w-4 h-4" />
                                                    {{ formatDate(event.enteredDate) }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <div
                                                class="text-center bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                                                <div class="text-xs text-slate-400 mb-1">Rank</div>
                                                <div class="text-xl font-bold text-white">#{{ event.overallRank }}</div>
                                            </div>
                                            <div
                                                class="text-center bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
                                                <div class="text-xs text-slate-400 mb-1">Score</div>
                                                <div class="text-xl font-bold text-white">{{
                                                    formatNumber(event.overallScore) }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Event details -->
                                    <div class="mt-6" :class="{ 'opacity-50': editingEvent === event.id }">
                                        <div class="grid lg:grid-cols-2 gap-6">
                                            <!-- Left column - Core stats -->
                                            <div class="space-y-4">
                                                <h4
                                                    class="text-sm uppercase text-slate-400 font-semibold tracking-wide flex items-center gap-2">
                                                    <BarChart3 class="w-4 h-4" />
                                                    Performance Stats
                                                </h4>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div
                                                        class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                                                        <div class="flex items-center gap-2 text-slate-400 mb-1">
                                                            <Zap class="w-3 h-3" />
                                                            <span class="text-xs">Power</span>
                                                        </div>
                                                        <div class="text-white font-bold">{{ formatPower(event.power) }}
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                                                        <div class="flex items-center gap-2 text-slate-400 mb-1">
                                                            <Castle class="w-3 h-3" />
                                                            <span class="text-xs">Castle</span>
                                                        </div>
                                                        <div class="text-white font-bold">{{ event.castle }}</div>
                                                    </div>
                                                    <div
                                                        class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                                                        <div class="flex items-center gap-2 text-slate-400 mb-1">
                                                            <Star class="w-3 h-3" />
                                                            <span class="text-xs">Role</span>
                                                        </div>
                                                        <div class="text-white font-bold">{{ event.role }}</div>
                                                    </div>
                                                    <div
                                                        class="bg-slate-700/50 rounded-lg p-3 border border-slate-600/30">
                                                        <div class="flex items-center gap-2 text-slate-400 mb-1">
                                                            <Trophy class="w-3 h-3" />
                                                            <span class="text-xs">Rank</span>
                                                        </div>
                                                        <div class="text-white font-bold">#{{ event.overallRank }}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Right column - Daily scores (for KvK/GvG) -->
                                            <div v-if="!event.score" class="space-y-4">
                                                <h4
                                                    class="text-sm uppercase text-slate-400 font-semibold tracking-wide flex items-center gap-2">
                                                    <Calendar class="w-4 h-4" />
                                                    Daily Performance
                                                </h4>
                                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    <div v-for="d in 6" :key="d"
                                                        :class="['bg-slate-700/50 rounded-lg p-3 border text-center transition-all duration-300',
                                                            event[`scoreD${d}`] > 0 ? 'border-slate-500/50 shadow-lg' : 'border-slate-600/30 opacity-60']">
                                                        <div class="text-xs text-slate-400 mb-1">Day {{ d }}</div>
                                                        <div class="text-white font-bold text-lg">{{
                                                            formatNumber(event[`scoreD${d}`] || 0) }}</div>
                                                        <div v-if="event[`scoreD${d}`] > 0"
                                                            class="w-full bg-slate-600 rounded-full h-1 mt-2">
                                                            <div class="bg-gradient-to-r from-cyan-500 to-blue-600 h-1 rounded-full transition-all duration-500"
                                                                :style="{ width: `${Math.min(100, (event[`scoreD${d}`] / Math.max(...Array.from({ length: 6 }, (_, i) => event[`scoreD${i + 1}`] || 0))) * 100)}%` }">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Notes section -->
                                        <div v-if="event.notes"
                                            class="mt-6 bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                                            <div class="flex items-center gap-2 text-slate-400 mb-2">
                                                <MessageSquare class="w-4 h-4" />
                                                <span class="text-xs uppercase font-semibold tracking-wide">Notes</span>
                                            </div>
                                            <p class="text-slate-300 leading-relaxed">{{ event.notes }}</p>
                                        </div>
                                    </div>

                                    <!-- Edit form -->
                                    <div v-if="editingEvent === event.id"
                                        class="mt-6 bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 shadow-2xl">
                                        <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Edit class="w-5 h-5" />
                                            Edit Event Data
                                        </h4>

                                        <div class="grid lg:grid-cols-2 gap-6 mb-6">
                                            <div class="space-y-4">
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label
                                                            class="block text-xs text-slate-300 mb-2 font-medium">Power</label>
                                                        <input v-model="editForm.power"
                                                            class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label
                                                            class="block text-xs text-slate-300 mb-2 font-medium">Castle</label>
                                                        <input v-model="editForm.castle"
                                                            class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label
                                                            class="block text-xs text-slate-300 mb-2 font-medium">Role</label>
                                                        <input v-model="editForm.role"
                                                            class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                                                    </div>
                                                    <div>
                                                        <label
                                                            class="block text-xs text-slate-300 mb-2 font-medium">Rank</label>
                                                        <input v-model="editForm.overallRank"
                                                            class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="space-y-4">
                                                <label class="block text-xs text-slate-300 mb-2 font-medium">Daily
                                                    Scores</label>
                                                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    <div v-for="d in 6" :key="d">
                                                        <input v-model="editForm[`scoreD${d}`]"
                                                            :placeholder="`Day ${d}`"
                                                            class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mb-6">
                                            <label class="block text-xs text-slate-300 mb-2 font-medium">Notes</label>
                                            <textarea v-model="editForm.notes"
                                                class="w-full bg-slate-700/80 rounded-lg px-3 py-2 text-white border border-slate-600/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                                rows="3"></textarea>
                                        </div>

                                        <div class="flex justify-end gap-3">
                                            <Button variant="outline" size="sm" @click="editingEvent = null"
                                                class="bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/70">
                                                Cancel
                                            </Button>
                                            <Button size="sm" @click="saveChanges(event)"
                                                class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>

                                    <!-- Action buttons -->
                                    <div class="mt-6 flex justify-end">
                                        <Button v-if="editingEvent !== event.id" variant="ghost" size="sm"
                                            @click="toggleEdit(event.id)"
                                            class="text-slate-400 hover:text-white hover:bg-slate-700/50 group">
                                            <Edit class="w-4 h-4 mr-2 group-hover:text-cyan-400 transition-colors" />
                                            Edit Event
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="!sortedEvents.length" class="text-center py-16">
                    <div
                        class="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center">
                        <Calendar class="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 class="text-xl font-semibold text-slate-400 mb-2">No Events Recorded</h3>
                    <p class="text-slate-500">Event participation history will appear here once data is available.</p>
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
import { useToast } from '@/components/ui/toast'
import {
    Calendar, Trophy, Swords, Shield, Crown, TrendingUp, CalendarDays,
    BarChart3, Zap, Castle, Star, MessageSquare, Edit
} from 'lucide-vue-next'

const { toast } = useToast()

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
    KvK: 'bg-gradient-to-br from-blue-500 to-blue-600',
    GvG: 'bg-gradient-to-br from-purple-500 to-purple-600',
    GR: 'bg-gradient-to-br from-green-500 to-green-600'
}[type] || 'bg-gradient-to-br from-slate-500 to-slate-600')

const eventBadgeColor = (type) => ({
    KvK: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    GvG: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    GR: 'bg-green-500/20 text-green-300 border border-green-500/30'
}[type] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30')

const eventGlowColor = (type) => ({
    KvK: '#3B82F6',
    GvG: '#A855F7',
    GR: '#10B981'
}[type] || '#64748B')

const eventIconComponent = (type) => ({
    KvK: Swords,
    GvG: Shield,
    GR: Crown
}[type] || Calendar)

const sortedEvents = computed(() => [...props.events].sort((a, b) => new Date(b.enteredDate) - new Date(a.enteredDate)))

const kvkEvents = computed(() => props.events.filter(e => e.type === 'KvK'))
const gvgEvents = computed(() => props.events.filter(e => e.type === 'GvG'))
const grEvents = computed(() => props.events.filter(e => e.type === 'GR'))
const activeEvents = computed(() => props.events.filter(e => e.overallScore > 0))

const averageScore = computed(() => {
    const scores = props.events.map(e => e.overallScore || 0).filter(s => s > 0)
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
})

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

input:focus,
textarea:focus {
    transform: translateY(-1px);
}
</style>