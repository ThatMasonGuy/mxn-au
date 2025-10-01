<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="w-full h-full sm:w-full sm:h-auto sm:max-w-[95vw] lg:max-w-4xl sm:max-h-[95vh] overflow-hidden sm:mx-auto sm:rounded-lg rounded-none border-0 sm:border px-3 sm:px-6">
            <!-- Fixed Header -->
            <DialogHeader class="pb-3 lg:pb-4 border-b border-border flex-shrink-0">
                <div class="flex items-start gap-3 lg:gap-4">
                    <div class="relative flex-shrink-0">
                        <div
                            class="w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400 flex items-center justify-center">
                            <Calendar class="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                        </div>
                    </div>
                    <div class="space-y-0.5 sm:space-y-1 lg:space-y-2 flex-1 min-w-0">
                        <DialogTitle
                            class="text-lg lg:text-2xl font-bold text-foreground flex items-start gap-2 lg:gap-3">
                            <span class="leading-tight">Event History</span>
                            <span
                                class="text-sm lg:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                                {{ member.name }}
                            </span>
                        </DialogTitle>
                        <div class="flex items-center gap-3 text-xs text-foreground/60">
                            <div class="flex items-center gap-1">
                                <Trophy class="w-3 h-3" />
                                <span>{{ sortedEvents.length }} event{{ sortedEvents.length !== 1 ? 's' : '' }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Activity class="w-3 h-3" />
                                <span>{{ activeEvents.length }} active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto -mr-3 sm:mr-0 pr-2 sm:pr-2 lg:pr-3 sm:pb-4"
                style="height: calc(100vh - 120px); max-height: calc(95vh - 120px);">
                <div class="py-3 lg:py-4 space-y-3">
                    <!-- Event Statistics Cards - Mobile: 2 col, Desktop: 4 col -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        <div
                            class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                            <div class="flex items-center gap-1 mb-0.5">
                                <Swords class="w-3 h-3 text-blue-600" />
                                <span class="text-xs font-medium text-blue-800 dark:text-blue-200 truncate">KvK</span>
                            </div>
                            <div class="text-lg font-bold text-blue-900 dark:text-blue-100">{{ kvkEvents.length }}</div>
                        </div>

                        <div
                            class="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                            <div class="flex items-center gap-1 mb-0.5">
                                <Shield class="w-3 h-3 text-purple-600" />
                                <span
                                    class="text-xs font-medium text-purple-800 dark:text-purple-200 truncate">GvG</span>
                            </div>
                            <div class="text-lg font-bold text-purple-900 dark:text-purple-100">{{ gvgEvents.length }}
                            </div>
                        </div>

                        <div
                            class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-2 border border-green-200 dark:border-green-800">
                            <div class="flex items-center gap-1 mb-0.5">
                                <Crown class="w-3 h-3 text-green-600" />
                                <span class="text-xs font-medium text-green-800 dark:text-green-200 truncate">GR</span>
                            </div>
                            <div class="text-lg font-bold text-green-900 dark:text-green-100">{{ grEvents.length }}
                            </div>
                        </div>

                        <div
                            class="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
                            <div class="flex items-center gap-1 mb-0.5">
                                <TrendingUp class="w-3 h-3 text-orange-600" />
                                <span class="text-xs font-medium text-orange-800 dark:text-orange-200 truncate">GvG
                                    Avg</span>
                            </div>
                            <div class="text-lg font-bold text-orange-900 dark:text-orange-100">{{
                                formatNumber(gvgAverageScore) }}</div>
                        </div>
                    </div>

                    <!-- Events Timeline -->
                    <div v-if="sortedEvents.length" class="space-y-3">
                        <div v-for="event in sortedEvents" :key="event.id" class="relative">
                            <!-- Event Card -->
                            <div class="rounded-lg border transition-all duration-200 hover:shadow-md bg-card"
                                :class="getEventCardClasses(event.type)">

                                <!-- Event Header -->
                                <div class="p-3 border-b border-border/50">
                                    <div class="flex items-center justify-between gap-3">
                                        <div class="flex items-center gap-2 min-w-0 flex-1">
                                            <div class="w-7 h-7 rounded-lg border-2 border-background flex items-center justify-center flex-shrink-0 shadow-lg"
                                                :style="getEventIconStyle(event.type)">
                                                <component :is="getEventIcon(event.type)" class="w-4 h-4 text-white" />
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <div class="flex items-center gap-2">
                                                    <span
                                                        class="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-white shadow-sm"
                                                        :style="getEventBadgeStyle(event.type)">
                                                        {{ event.type }}
                                                    </span>
                                                    <span
                                                        class="font-mono text-xs font-semibold truncate text-foreground/80">{{
                                                            event.eventId
                                                        }}</span>
                                                </div>
                                                <div class="flex items-center gap-1 mt-1 text-xs text-foreground/60">
                                                    <CalendarDays class="w-3 h-3" />
                                                    {{ formatDate(event.eventId) }}
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-2 flex-shrink-0">
                                            <div class="text-center bg-muted/80 rounded-lg p-2 min-w-[50px] border">
                                                <div class="text-xs text-muted-foreground font-medium">Rank</div>
                                                <div class="text-sm font-bold text-foreground">#{{ event.calculatedRank
                                                    || event.overallRank || '—'
                                                    }}
                                                </div>
                                            </div>
                                            <div class="text-center bg-muted/80 rounded-lg p-2 min-w-[60px] border">
                                                <div class="text-xs text-muted-foreground font-medium">Score</div>
                                                <div class="text-sm font-bold text-foreground">{{
                                                    formatNumber(getEventScore(event)) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Event Details -->
                                <div class="p-3" :class="{ 'opacity-60': editingEvent === event.id }">
                                    <div class="grid lg:grid-cols-2 gap-4">
                                        <!-- Core Stats -->
                                        <div class="space-y-3">
                                            <h4
                                                class="text-xs font-semibold text-foreground/70 flex items-center gap-2">
                                                <BarChart3 class="w-3 h-3" />
                                                Performance Stats
                                            </h4>
                                            <div class="grid grid-cols-2 gap-2">
                                                <div
                                                    class="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg p-2.5 text-center border border-yellow-200 dark:border-yellow-800">
                                                    <div class="flex items-center justify-center gap-1 mb-1">
                                                        <Zap class="w-3 h-3 text-yellow-600" />
                                                        <span
                                                            class="text-xs text-yellow-800 dark:text-yellow-200 font-medium">Power</span>
                                                    </div>
                                                    <div class="font-bold text-sm text-yellow-900 dark:text-yellow-100">
                                                        {{
                                                            formatPower(event.power) }}</div>
                                                </div>
                                                <div
                                                    class="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg p-2.5 text-center border border-purple-200 dark:border-purple-800">
                                                    <div class="flex items-center justify-center gap-1 mb-1">
                                                        <Castle class="w-3 h-3 text-purple-600" />
                                                        <span
                                                            class="text-xs text-purple-800 dark:text-purple-200 font-medium">Castle</span>
                                                    </div>
                                                    <div class="font-bold text-sm text-purple-900 dark:text-purple-100">
                                                        {{
                                                            event.castle }}</div>
                                                </div>
                                                <div
                                                    class="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 rounded-lg p-2.5 text-center border border-blue-200 dark:border-blue-800">
                                                    <div class="flex items-center justify-center gap-1 mb-1">
                                                        <Star class="w-3 h-3 text-blue-600" />
                                                        <span
                                                            class="text-xs text-blue-800 dark:text-blue-200 font-medium">Role</span>
                                                    </div>
                                                    <div class="font-bold text-sm text-blue-900 dark:text-blue-100">{{
                                                        event.role }}</div>
                                                </div>
                                                <div
                                                    class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-2.5 text-center border border-amber-200 dark:border-amber-800">
                                                    <div class="flex items-center justify-center gap-1 mb-1">
                                                        <Trophy class="w-3 h-3 text-amber-600" />
                                                        <span
                                                            class="text-xs text-amber-800 dark:text-amber-200 font-medium">Rank</span>
                                                    </div>
                                                    <div class="font-bold text-sm text-amber-900 dark:text-amber-100">
                                                        #{{
                                                            event.calculatedRank || event.overallRank || '—' }}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Event-Specific Performance Section -->
                                        <div class="space-y-3">
                                            <!-- Daily Scores (for KvK/GvG) -->
                                            <div v-if="event.type === 'KvK' || event.type === 'GvG'">
                                                <h4
                                                    class="text-xs font-semibold text-foreground/70 flex items-center gap-2 mb-2">
                                                    <Calendar class="w-3 h-3" />
                                                    Daily Performance
                                                </h4>
                                                <div class="grid grid-cols-3 gap-1.5">
                                                    <div v-for="d in 6" :key="d"
                                                        class="bg-muted/60 rounded-lg p-2 text-center transition-all border border-border/50"
                                                        :class="event[`scoreD${d}`] > 0 ? 'border-primary/30 bg-primary/10 ring-1 ring-primary/20' : 'opacity-60'">
                                                        <div class="text-xs text-foreground/60 mb-1 font-medium">D{{ d
                                                            }}</div>
                                                        <div class="font-bold text-xs text-foreground">{{
                                                            formatNumber(event[`scoreD${d}`] || 0) }}</div>
                                                        <div v-if="event[`scoreD${d}`] > 0"
                                                            class="w-full bg-border rounded-full h-1 mt-1.5">
                                                            <div class="bg-primary h-1 rounded-full transition-all duration-500"
                                                                :style="{ width: `${Math.min(100, (event[`scoreD${d}`] / Math.max(...Array.from({ length: 6 }, (_, i) => event[`scoreD${i + 1}`] || 0))) * 100)}%` }">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Guild Race Performance -->
                                            <div v-else-if="event.type === 'GR'">
                                                <h4
                                                    class="text-xs font-semibold text-foreground/70 flex items-center gap-2 mb-2">
                                                    <Crown class="w-3 h-3" />
                                                    Guild Race Performance
                                                </h4>
                                                <div class="space-y-2">
                                                    <!-- Main GR Score Display -->
                                                    <div
                                                        class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                                        <div class="flex items-center justify-between">
                                                            <div class="flex items-center gap-2">
                                                                <div
                                                                    class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                                                    <Crown class="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <div
                                                                        class="text-xs text-green-800 dark:text-green-200 font-medium">
                                                                        Total Score</div>
                                                                    <div
                                                                        class="text-lg font-bold text-green-900 dark:text-green-100">
                                                                        {{ formatNumber(event.score ||
                                                                        event.overallScore || 0) }}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="text-right">
                                                                <div
                                                                    class="text-xs text-green-800 dark:text-green-200 font-medium">
                                                                    Position</div>
                                                                <div
                                                                    class="text-lg font-bold text-green-900 dark:text-green-100">
                                                                    #{{ event.calculatedRank || event.overallRank || '—'
                                                                    }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Additional GR Stats if available -->
                                                    <div v-if="event.grPhase || event.grCategory"
                                                        class="grid grid-cols-2 gap-2">
                                                        <div v-if="event.grPhase"
                                                            class="bg-muted/60 rounded-lg p-2 text-center border">
                                                            <div class="text-xs text-foreground/60 mb-1">Phase</div>
                                                            <div class="font-medium text-xs">{{ event.grPhase }}</div>
                                                        </div>
                                                        <div v-if="event.grCategory"
                                                            class="bg-muted/60 rounded-lg p-2 text-center border">
                                                            <div class="text-xs text-foreground/60 mb-1">Category</div>
                                                            <div class="font-medium text-xs">{{ event.grCategory }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Notes -->
                                    <div v-if="event.notes"
                                        class="mt-4 bg-muted/40 rounded-lg p-3 border border-border/50">
                                        <div class="flex items-center gap-2 mb-2">
                                            <MessageSquare class="w-3 h-3 text-foreground/60" />
                                            <span class="text-xs font-semibold text-foreground">Notes</span>
                                        </div>
                                        <p class="text-xs leading-relaxed text-foreground/80">{{ event.notes }}</p>
                                    </div>
                                </div>

                                <!-- Edit Form -->
                                <div v-if="editingEvent === event.id"
                                    class="p-3 bg-muted/50 backdrop-blur-sm border-t border-border">
                                    <h4 class="text-xs font-semibold mb-2 flex items-center gap-2 text-foreground">
                                        <Edit class="w-3 h-3" />
                                        Edit Event Data
                                    </h4>

                                    <div class="grid lg:grid-cols-2 gap-3 mb-3">
                                        <div class="space-y-2">
                                            <div class="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium mb-1 text-foreground">Power</label>
                                                    <input v-model="editForm.power"
                                                        class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs h-8" />
                                                </div>
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium mb-1 text-foreground">Castle</label>
                                                    <input v-model="editForm.castle"
                                                        class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs h-8" />
                                                </div>
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium mb-1 text-foreground">Role</label>
                                                    <input v-model="editForm.role"
                                                        class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs h-8" />
                                                </div>
                                                <div>
                                                    <label
                                                        class="block text-xs font-medium mb-1 text-foreground">Rank</label>
                                                    <input v-model="editForm.overallRank"
                                                        class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs h-8" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="space-y-2">
                                            <!-- Daily Scores for KvK/GvG -->
                                            <div v-if="editForm.type === 'KvK' || editForm.type === 'GvG'">
                                                <label class="block text-xs font-medium text-foreground">Daily
                                                    Scores</label>
                                                <div class="grid grid-cols-3 gap-1.5">
                                                    <div v-for="d in 6" :key="d">
                                                        <input v-model="editForm[`scoreD${d}`]"
                                                            :placeholder="`Day ${d}`"
                                                            class="w-full bg-background rounded px-1.5 py-1 border border-border focus:border-primary focus:outline-none transition-all text-xs h-7" />
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Single Score for GR -->
                                            <div v-else-if="editForm.type === 'GR'">
                                                <label class="block text-xs font-medium text-foreground">Guild Race
                                                    Score</label>
                                                <input v-model="editForm.score" placeholder="Total Score"
                                                    class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="block text-xs font-medium mb-1 text-foreground">Notes</label>
                                        <textarea v-model="editForm.notes"
                                            class="w-full bg-background rounded px-2 py-1.5 border border-border focus:border-primary focus:outline-none transition-all text-xs"
                                            rows="2"></textarea>
                                    </div>

                                    <div class="flex justify-end gap-1.5">
                                        <Button variant="outline" size="sm" @click="editingEvent = null"
                                            class="h-7 px-2 text-xs">
                                            Cancel
                                        </Button>
                                        <Button size="sm" @click="saveChanges(event)" class="h-7 px-2 text-xs">
                                            Save
                                        </Button>
                                    </div>
                                </div>

                                <!-- Action Button -->
                                <div v-if="editingEvent !== event.id" class="px-3 pb-3">
                                    <Button variant="ghost" size="sm" @click="toggleEdit(event.id)"
                                        class="text-foreground/70 hover:text-foreground hover:bg-muted h-7 w-7 sm:w-auto sm:h-8 p-0 sm:px-2">
                                        <Edit class="w-3 h-3" />
                                        <span class="hidden sm:ml-2 sm:inline text-xs">Edit Event</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else class="text-center py-12">
                        <div class="w-12 h-12 mx-auto mb-3 bg-muted rounded-xl border flex items-center justify-center">
                            <Calendar class="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 class="text-base font-semibold text-foreground/80 mb-2">No Events Recorded</h3>
                        <p class="text-sm text-foreground/60">Event participation history will appear here once data is
                            available.</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { firestore } from '@/firebase'
import { useToast } from '@/components/ui/toast'
import {
    Calendar, Trophy, Swords, Shield, Crown, TrendingUp, CalendarDays,
    BarChart3, Zap, Castle, Star, MessageSquare, Edit, Activity
} from 'lucide-vue-next'

const { toast } = useToast()

const props = defineProps({
    member: Object,
    events: Array
})

const emit = defineEmits(['close'])
const editingEvent = ref(null)
const editForm = ref({})

// Event dates cache
const eventDates = ref({})
const loadingDates = ref(new Set())

// Function to fetch event start date from events collection
const fetchEventDate = async (eventId) => {
    if (eventDates.value[eventId] || loadingDates.value.has(eventId)) {
        return eventDates.value[eventId]
    }

    try {
        loadingDates.value.add(eventId)
        const eventDocRef = doc(firestore, 'topheroes', 'velaris', 'events', eventId)
        const eventDocSnap = await getDoc(eventDocRef)

        if (eventDocSnap.exists()) {
            const eventData = eventDocSnap.data()
            const startDate = eventData.startDate
            eventDates.value[eventId] = startDate
            return startDate
        } else {
            console.warn(`Event document not found for eventId: ${eventId}`)
            return null
        }
    } catch (error) {
        console.error(`Error fetching event date for ${eventId}:`, error)
        return null
    } finally {
        loadingDates.value.delete(eventId)
    }
}

// Fetch all event dates on component mount
onMounted(async () => {
    const eventIds = [...new Set(props.events.map(event => event.eventId))]
    await Promise.all(eventIds.map(eventId => fetchEventDate(eventId)))
})

// Enhanced event type styling with better contrast and uniqueness
const eventStyles = {
    KvK: {
        bg: 'bg-gradient-to-br from-blue-500/15 to-indigo-600/15 dark:from-blue-400/8 dark:to-indigo-500/8',
        border: 'border-blue-400/60 dark:border-blue-500/60',
        text: 'text-blue-900 dark:text-blue-100',
        icon: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        iconSolid: '#2563eb'
    },
    GvG: {
        bg: 'bg-gradient-to-br from-purple-500/15 to-violet-600/15 dark:from-purple-400/8 dark:to-violet-500/8',
        border: 'border-purple-400/60 dark:border-purple-500/60',
        text: 'text-purple-900 dark:text-purple-100',
        icon: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
        iconSolid: '#9333ea'
    },
    GR: {
        bg: 'bg-gradient-to-br from-green-500/15 to-emerald-600/15 dark:from-green-400/8 dark:to-emerald-500/8',
        border: 'border-green-400/60 dark:border-green-500/60',
        text: 'text-green-900 dark:text-green-100',
        icon: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        iconSolid: '#059669'
    }
}

const getEventCardClasses = (type) => {
    const style = eventStyles[type] || eventStyles.KvK
    return `${style.bg} ${style.border} ${style.text} border-2 shadow-sm hover:shadow-md`
}

const getEventIconStyle = (type) => {
    const style = eventStyles[type] || eventStyles.KvK
    return {
        background: style.icon
    }
}

const getEventBadgeStyle = (type) => {
    const style = eventStyles[type] || eventStyles.KvK
    return {
        background: style.icon
    }
}

const getEventIcon = (type) => {
    return { KvK: Swords, GvG: Shield, GR: Crown }[type] || Calendar
}

// Function to get the appropriate score for display based on event type
const getEventScore = (event) => {
    if (event.type === 'GR') {
        return event.score || event.overallScore || 0
    } else {
        return event.overallScore || 0
    }
}

const toggleEdit = (id) => {
    editingEvent.value = editingEvent.value === id ? null : id
    if (editingEvent.value) {
        const target = props.events.find(e => e.id === id)
        editForm.value = { ...target }
    }
}

const formatDate = (eventId) => {
    const eventDate = eventDates.value[eventId]
    if (!eventDate) return '—'

    try {
        const date = typeof eventDate.toDate === 'function' ? eventDate.toDate() : new Date(eventDate)
        return date.toLocaleDateString('en-AU', {
            year: 'numeric', month: 'short', day: 'numeric'
        })
    } catch (error) {
        console.error('Error formatting date:', error)
        return '—'
    }
}

const formatPower = (n) => Intl.NumberFormat('en', {
    notation: 'compact', maximumFractionDigits: 1
}).format(Number(n) || 0)

const formatNumber = (n) => Intl.NumberFormat('en', {
    maximumFractionDigits: 0
}).format(Number(n) || 0)

const sortedEvents = computed(() => {
    return [...props.events].sort((a, b) => {
        // Parse event IDs: format is {guildId}-{eventType}-{MM}-{YYYY}
        const parseEventId = (eventId) => {
            const parts = eventId.split('-')
            if (parts.length >= 4) {
                const month = parseInt(parts[parts.length - 2]) // MM
                const year = parseInt(parts[parts.length - 1])   // YYYY
                return new Date(year, month - 1) // month is 0-indexed in Date constructor
            }
            return new Date(0) // fallback for malformed IDs
        }

        const dateA = parseEventId(a.eventId)
        const dateB = parseEventId(b.eventId)

        return dateB.getTime() - dateA.getTime() // Newest first
    })
})

const kvkEvents = computed(() => props.events.filter(e => e.type === 'KvK'))
const gvgEvents = computed(() => props.events.filter(e => e.type === 'GvG'))
const grEvents = computed(() => props.events.filter(e => e.type === 'GR'))
const activeEvents = computed(() => props.events.filter(e => getEventScore(e) > 0))

// Updated to only calculate average from GvG events
const gvgAverageScore = computed(() => {
    const gvgScores = gvgEvents.value
        .map(e => e.overallScore || 0)
        .filter(s => s > 0)
    return gvgScores.length ? gvgScores.reduce((a, b) => a + b, 0) / gvgScores.length : 0
})

const saveChanges = async (event) => {
    const auth = getAuth()
    const uid = auth.currentUser?.uid || 'system'

    const eventRef = doc(firestore, `topheroes/velaris/members/${props.member.id}/events/${event.id}`)
    const memberRef = doc(firestore, `topheroes/velaris/members/${props.member.id}`)

    const updates = { ...editForm.value }

    // Recalculate overallScore based on event type
    if (updates.type === 'GR') {
        // For Guild Race, use the single score field
        updates.overallScore = Number(updates.score) || 0
    } else if (['KvK', 'GvG'].includes(updates.type)) {
        // For KvK/GvG, sum the daily scores
        const dayScores = [1, 2, 3, 4, 5, 6].map(d => Number(updates[`scoreD${d}`]) || 0)
        updates.overallScore = dayScores.reduce((sum, val) => sum + val, 0)
    }

    // Detect changes
    const changes = {}
    Object.keys(updates).forEach(key => {
        if (event[key] !== updates[key]) {
            changes[key] = { from: event[key] ?? null, to: updates[key] ?? null }
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
            title: 'Event Updated',
            description: `${event.eventId} was updated successfully.`
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
/* Custom scrollbar styling */
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

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>