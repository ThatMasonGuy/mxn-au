<template>
    <div class="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
        <GoblinTodoNav />

        <!-- Header -->
        <div class="px-6 py-5 border-b border-zinc-700 flex-shrink-0">
            <h1 class="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <CalendarRange :size="16" class="text-zinc-400" />
                Timeline
            </h1>
            <p class="text-xs text-zinc-500 mt-0.5">{{ days.length }} days recorded</p>
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <Loader2 :size="20" class="animate-spin text-zinc-500" />
        </div>

        <div v-else-if="!days.length" class="flex flex-col items-center justify-center py-20 text-zinc-600">
            <CalendarX :size="36" class="mb-3 opacity-50" />
            <p class="text-sm">No days recorded yet</p>
            <router-link :to="{ name: 'personal-todo' }" class="mt-2 text-xs text-emerald-400 hover:text-emerald-300">
                Start your first day →
            </router-link>
        </div>

        <div v-else class="flex-1 overflow-y-auto px-6 py-6">

            <!-- ── Contribution-style heat grid ──────────────────────────────── -->
            <div class="mb-10">
                <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Activity</p>
                <div class="overflow-x-auto pb-2">
                    <div class="flex gap-1 min-w-max">
                        <div v-for="col in calendarCols" :key="col.weekStart" class="flex flex-col gap-1">
                            <div v-for="cell in col.cells" :key="cell.dateStr" :class="[
                                'w-3.5 h-3.5 rounded-sm transition-all cursor-pointer',
                                cell.dateStr ? heatClass(cell) : 'bg-transparent',
                                cell.isToday ? 'ring-1 ring-emerald-400 ring-offset-1 ring-offset-zinc-900' : ''
                            ]" :title="cell.dateStr ? `${cell.dateStr} · ${cell.completedCount}/${cell.totalCount} done` : ''"
                                @click="cell.dateStr && navigateDay(cell.dateStr)" />
                        </div>
                    </div>
                    <!-- Legend -->
                    <div class="flex items-center gap-2 mt-2">
                        <span class="text-xs text-zinc-600">Less</span>
                        <div v-for="l in heatLegend" :key="l" :class="['w-3 h-3 rounded-sm', l]" />
                        <span class="text-xs text-zinc-600">More done</span>
                    </div>
                </div>
            </div>

            <!-- ── Day-by-day timeline ─────────────────────────────────────────── -->
            <div class="relative">
                <!-- Timeline spine -->
                <div class="absolute left-[22px] top-0 bottom-0 w-px bg-zinc-700" />

                <!-- Group by month -->
                <div v-for="group in groupedDays" :key="group.month" class="mb-8">
                    <!-- Month label -->
                    <div class="flex items-center gap-3 mb-4 pl-0">
                        <div
                            class="relative z-10 w-11 h-11 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center flex-shrink-0">
                            <CalendarDays :size="16" class="text-zinc-400" />
                        </div>
                        <h2 class="text-sm font-semibold text-zinc-300">{{ group.month }}</h2>
                    </div>

                    <!-- Days in month -->
                    <div class="space-y-3 pl-16">
                        <div v-for="day in group.days" :key="day.id" class="group relative">
                            <!-- Connector dot -->
                            <div :class="[
                                'absolute -left-10 top-3.5 w-3 h-3 rounded-full border-2 z-10 transition-colors',
                                day.id === todayId
                                    ? 'bg-emerald-500 border-emerald-400'
                                    : day.completedCount > 0
                                        ? 'bg-zinc-500 border-zinc-400'
                                        : 'bg-zinc-800 border-zinc-600'
                            ]" />

                            <!-- Day card -->
                            <router-link
                                :to="day.id === todayId ? { name: 'personal-todo' } : { name: 'personal-todo-day', params: { date: day.id } }"
                                class="block p-4 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all hover:bg-zinc-750 group-hover:shadow-lg"
                                style="text-decoration: none;">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2.5">
                                        <span class="text-sm font-medium text-zinc-100">
                                            {{ formatDayLabel(day.id) }}
                                        </span>
                                        <span v-if="day.id === todayId"
                                            class="text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-700/50">today</span>
                                        <span v-else-if="!day.closed"
                                            class="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 border border-zinc-600">open</span>
                                    </div>

                                    <!-- Task completion summary -->
                                    <div class="flex items-center gap-3">
                                        <!-- Mini completion bar -->
                                        <div v-if="day.totalCount > 0" class="flex items-center gap-2">
                                            <div class="w-20 h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                                                <div class="h-full rounded-full bg-emerald-500 transition-all"
                                                    :style="{ width: `${(day.completedCount / day.totalCount) * 100}%` }" />
                                            </div>
                                            <span class="text-xs text-zinc-400 tabular-nums">
                                                {{ day.completedCount }}/{{ day.totalCount }}
                                            </span>
                                        </div>
                                        <span v-else class="text-xs text-zinc-600">no tasks</span>

                                        <!-- Rolled indicator -->
                                        <span v-if="day.rolledCount > 0"
                                            class="text-xs text-amber-500 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/60"
                                            :title="`${day.rolledCount} task(s) rolled to next day`">{{ day.rolledCount
                                            }} rolled</span>

                                        <ChevronRight :size="14"
                                            class="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                    </div>
                                </div>

                                <!-- Task pills preview -->
                                <div v-if="day.taskTitles.length" class="flex flex-wrap gap-1.5 mt-2.5">
                                    <span v-for="(title, i) in day.taskTitles.slice(0, 5)" :key="i" :class="[
                                        'text-xs px-2 py-0.5 rounded-md border',
                                        day.completedTitles.includes(title)
                                            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-500 line-through'
                                            : 'bg-zinc-700 border-zinc-600 text-zinc-300'
                                    ]">{{ title }}</span>
                                    <span v-if="day.taskTitles.length > 5"
                                        class="text-xs px-2 py-0.5 rounded-md border bg-zinc-800 border-zinc-700 text-zinc-500">+{{
                                        day.taskTitles.length - 5 }} more</span>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarRange, CalendarDays, CalendarX, ChevronRight, Loader2 } from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/stores/useGoblinTodoStore'
import GoblinTodoNav from '@/components/personal/todo/GoblinTodoNav.vue'


const store = useGoblinTodoStore()
const router = useRouter()

const isLoading = ref(true)
const days = ref([])
const allDayTasks = ref([]) // { dayId, taskId, status }

const todayId = computed(() => store.getTodayStr())

onMounted(async () => {
    if (!store.isInitialized) await store.init()

    const [dayList, dayTaskList] = await Promise.all([
        store.loadDaysList(),
        store.loadAllDayTasks(),
    ])

    allDayTasks.value = dayTaskList

    // Enrich days with task data
    days.value = dayList.map(day => {
        const dts = allDayTasks.value.filter(dt => dt.dayId === day.id)
        const completedTitles = dts
            .filter(dt => dt.status === 'completed')
            .map(dt => store.tasks[dt.taskId]?.title).filter(Boolean)
        const taskTitles = dts
            .map(dt => store.tasks[dt.taskId]?.title).filter(Boolean)

        return {
            ...day,
            totalCount: dts.length,
            completedCount: dts.filter(dt => dt.status === 'completed').length,
            rolledCount: dts.filter(dt => dt.status === 'rolled').length,
            taskTitles,
            completedTitles,
        }
    })

    isLoading.value = false
})

// ─── Calendar grid ─────────────────────────────────────────────────────────────
const calendarCols = computed(() => {
    if (!days.value.length) return []

    const dayMap = {}
    days.value.forEach(d => { dayMap[d.id] = d })

    // Build a 16-week grid ending today
    const today = new Date()
    const cols = []
    for (let week = 15; week >= 0; week--) {
        const col = { weekStart: week, cells: [] }
        for (let day = 6; day >= 0; day--) {
            const d = new Date(today)
            d.setDate(d.getDate() - (week * 7 + day))
            const str = d.toISOString().split('T')[0]
            const data = dayMap[str]
            col.cells.push({
                dateStr: str,
                isToday: str === todayId.value,
                totalCount: data?.totalCount ?? 0,
                completedCount: data?.completedCount ?? 0,
                hasData: !!data,
            })
        }
        cols.push(col)
    }
    return cols
})

const heatClass = (cell) => {
    if (!cell.hasData) return 'bg-zinc-800 hover:bg-zinc-700'
    if (cell.totalCount === 0) return 'bg-zinc-700 hover:bg-zinc-600'
    const ratio = cell.completedCount / cell.totalCount
    if (ratio === 0) return 'bg-amber-950 hover:bg-amber-900'
    if (ratio < 0.5) return 'bg-emerald-900 hover:bg-emerald-800'
    if (ratio < 1) return 'bg-emerald-700 hover:bg-emerald-600'
    return 'bg-emerald-500 hover:bg-emerald-400'
}

const heatLegend = ['bg-zinc-800', 'bg-zinc-700', 'bg-emerald-900', 'bg-emerald-700', 'bg-emerald-500']

// ─── Grouped days ─────────────────────────────────────────────────────────────
const groupedDays = computed(() => {
    const groups = {}
    days.value.forEach(day => {
        const d = new Date(day.id + 'T00:00:00')
        const month = d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
        if (!groups[month]) groups[month] = { month, days: [] }
        groups[month].days.push(day)
    })
    return Object.values(groups)
})

const formatDayLabel = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
}

const navigateDay = (dateStr) => {
    if (dateStr === todayId.value) router.push({ name: 'personal-todo' })
    else router.push({ name: 'personal-todo-day', params: { date: dateStr } })
}
</script>