<template>
    <section class="space-y-5">
        <div class="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 sm:flex-row sm:items-center sm:justify-between sm:rounded-[2rem] sm:p-5">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">Usage analytics</p>
                <h2 class="mt-1 text-xl font-bold text-white">Everhomes tools</h2>
                <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                    Anonymous operational usage only. No addresses, calculator inputs, QR contents, report answers or participant details are collected.
                </p>
            </div>

            <button
                type="button"
                class="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
                @click="loadUsage"
            >
                <RefreshCw class="h-4 w-4" :class="loading ? 'animate-spin' : ''" />
                Refresh usage
            </button>
        </div>

        <div class="flex w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:w-fit">
            <button
                v-for="option in periodOptions"
                :key="option.days"
                type="button"
                class="min-w-[5.5rem] rounded-xl px-3 py-2 text-xs font-bold transition"
                :class="periodDays === option.days
                    ? 'border border-cyan-400/30 bg-cyan-400/15 text-cyan-200'
                    : 'border border-transparent text-slate-500 hover:bg-white/[0.05] hover:text-slate-300'"
                @click="periodDays = option.days"
            >
                {{ option.label }}
            </button>
        </div>

        <div v-if="loading && !dailyRows.length" class="flex items-center justify-center gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] py-24 text-slate-500">
            <Loader2 class="h-5 w-5 animate-spin text-cyan-300" />
            <span class="text-sm">Loading usage…</span>
        </div>

        <div v-else-if="error" class="rounded-[2rem] border border-red-400/20 bg-red-500/10 px-5 py-8 text-center">
            <AlertCircle class="mx-auto h-6 w-6 text-red-300" />
            <p class="mt-3 font-semibold text-red-100">Could not load usage analytics</p>
            <p class="mt-1 text-sm text-red-200/80">{{ error }}</p>
        </div>

        <template v-else>
            <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <article
                    v-for="stat in summaryStats"
                    :key="stat.label"
                    class="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5"
                >
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-xs font-semibold text-slate-500">{{ stat.label }}</p>
                        <component :is="stat.icon" class="h-4 w-4" :style="{ color: stat.color }" />
                    </div>
                    <p class="mt-4 text-3xl font-black leading-none text-white tabular-nums">{{ stat.value }}</p>
                    <p class="mt-2 text-[11px] leading-4 text-slate-600">{{ stat.hint }}</p>
                </article>
            </div>

            <div class="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
                <section class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[2rem] sm:p-5">
                    <div class="mb-5">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/70">Tool ranking</p>
                        <h3 class="mt-1 text-lg font-bold text-white">Usage by tool</h3>
                    </div>

                    <div class="space-y-3">
                        <article
                            v-for="tool in rankedTools"
                            :key="tool.id"
                            class="rounded-2xl border border-white/[0.08] bg-slate-950/30 p-4"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-bold text-white">{{ tool.name }}</p>
                                    <p class="mt-1 text-xs text-slate-500">
                                        {{ formatNumber(tool.opened) }} open{{ tool.opened === 1 ? '' : 's' }} · {{ formatNumber(tool.meaningfulUses) }} meaningful use{{ tool.meaningfulUses === 1 ? '' : 's' }}
                                    </p>
                                </div>
                                <p class="shrink-0 text-xl font-black text-slate-200 tabular-nums">{{ formatNumber(tool.totalEvents) }}</p>
                            </div>
                            <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    class="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                                    :style="{ width: `${tool.percentage}%` }"
                                />
                            </div>
                        </article>
                    </div>
                </section>

                <section class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[2rem] sm:p-5">
                    <div class="mb-5">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">Calculator split</p>
                        <h3 class="mt-1 text-lg font-bold text-white">Participant SDA funding</h3>
                        <p class="mt-1 text-xs leading-5 text-slate-500">Selections and completed calculations by calculator.</p>
                    </div>

                    <div class="space-y-3">
                        <article
                            v-for="calculator in calculatorSplit"
                            :key="calculator.id"
                            class="rounded-2xl border p-4"
                            :style="{ borderColor: calculator.border, background: calculator.background }"
                        >
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <p class="text-sm font-bold text-white">{{ calculator.name }}</p>
                                    <p class="mt-1 text-xs text-slate-400">{{ calculator.completed }} completed</p>
                                </div>
                                <p class="text-2xl font-black text-white tabular-nums">{{ calculator.total }}</p>
                            </div>
                        </article>
                    </div>
                </section>
            </div>

            <section class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[2rem] sm:p-5">
                <div class="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">Recent activity</p>
                        <h3 class="mt-1 text-lg font-bold text-white">Latest tool events</h3>
                    </div>
                    <p class="text-xs text-slate-600">Most recent {{ recentEvents.length }}</p>
                </div>

                <div v-if="!recentEvents.length" class="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-600">
                    No usage has been recorded yet.
                </div>

                <div v-else class="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/25">
                    <div
                        v-for="event in recentEvents"
                        :key="event.id"
                        class="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4"
                    >
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-slate-200">{{ event.toolName }}</p>
                            <p class="mt-0.5 text-xs text-slate-500">
                                {{ actionLabel(event.action) }}<span v-if="event.variant"> · {{ variantLabel(event.variant) }}</span> · {{ deviceLabel(event.device) }}
                            </p>
                        </div>
                        <p class="text-xs font-medium text-slate-600">{{ formatRelative(event.createdAt) }}</p>
                    </div>
                </div>
            </section>
        </template>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle2,
    Eye,
    Loader2,
    RefreshCw,
} from '@lucide/vue'

import { firestore } from '@/firebase'
import { EVERHOMES_TOOL_CATALOGUE } from '@/features/everhomes/utils/toolUsage'

const periodOptions = [
    { days: 7, label: '7 days' },
    { days: 30, label: '30 days' },
    { days: 90, label: '90 days' },
]

const periodDays = ref(30)
const dailyRows = ref([])
const recentEvents = ref([])
const loading = ref(false)
const error = ref('')

function brisbaneDateKey(date) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Brisbane',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date)
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
    return `${values.year}-${values.month}-${values.day}`
}

const periodStart = computed(() => brisbaneDateKey(new Date(Date.now() - (periodDays.value - 1) * 86_400_000)))
const filteredDailyRows = computed(() => dailyRows.value.filter(row => row.date >= periodStart.value))

const rankedTools = computed(() => {
    const rows = EVERHOMES_TOOL_CATALOGUE.map(tool => {
        const matching = filteredDailyRows.value.filter(row => row.toolId === tool.id)
        return {
            ...tool,
            opened: matching.reduce((sum, row) => sum + Number(row.opened || 0), 0),
            meaningfulUses: matching.reduce((sum, row) => sum + Number(row.meaningfulUses || 0), 0),
            totalEvents: matching.reduce((sum, row) => sum + Number(row.totalEvents || 0), 0),
        }
    }).sort((a, b) => b.totalEvents - a.totalEvents || a.name.localeCompare(b.name))
    const largest = Math.max(1, ...rows.map(row => row.totalEvents))
    return rows.map(row => ({ ...row, percentage: row.totalEvents ? Math.max(3, Math.round(row.totalEvents / largest * 100)) : 0 }))
})

const totalOpened = computed(() => rankedTools.value.reduce((sum, tool) => sum + tool.opened, 0))
const totalMeaningfulUses = computed(() => rankedTools.value.reduce((sum, tool) => sum + tool.meaningfulUses, 0))
const toolsUsed = computed(() => rankedTools.value.filter(tool => tool.totalEvents > 0).length)
const activeSessions = computed(() => new Set(
    recentEvents.value
        .filter(event => event.date >= periodStart.value)
        .map(event => event.sessionId)
        .filter(Boolean),
).size)

const summaryStats = computed(() => [
    { label: 'Tool opens', value: formatNumber(totalOpened.value), hint: `During the last ${periodDays.value} days`, icon: Eye, color: '#38bdf8' },
    { label: 'Meaningful uses', value: formatNumber(totalMeaningfulUses.value), hint: 'Calculations, reports and exports', icon: CheckCircle2, color: '#2dd4bf' },
    { label: 'Tools active', value: `${toolsUsed.value}/${EVERHOMES_TOOL_CATALOGUE.length}`, hint: 'Tools with recorded activity', icon: BarChart3, color: '#a78bfa' },
    { label: 'Recent sessions', value: formatNumber(activeSessions.value), hint: 'Anonymous sessions in loaded activity', icon: Activity, color: '#fbbf24' },
])

const calculatorSplit = computed(() => {
    const matching = filteredDailyRows.value.filter(row => row.toolId === 'participant-sda-funding')
    const totals = { sda: 0, appendix_h: 0 }
    const completed = { sda: 0, appendix_h: 0 }
    for (const row of matching) {
        totals.sda += Number(row.variants?.sda || 0)
        totals.appendix_h += Number(row.variants?.appendix_h || 0)
        completed.sda += Number(row.actionVariants?.calculation_completed?.sda || 0)
        completed.appendix_h += Number(row.actionVariants?.calculation_completed?.appendix_h || 0)
    }
    return [
        { id: 'sda', name: 'SDA Calculator', total: totals.sda, completed: completed.sda, border: 'rgba(168,85,247,0.25)', background: 'rgba(168,85,247,0.08)' },
        { id: 'appendix_h', name: 'Appendix H Calculator', total: totals.appendix_h, completed: completed.appendix_h, border: 'rgba(20,184,166,0.25)', background: 'rgba(20,184,166,0.08)' },
    ]
})

async function loadUsage() {
    loading.value = true
    error.value = ''
    try {
        const [dailySnapshot, recentSnapshot] = await Promise.all([
            getDocs(query(collection(firestore, 'everhomesToolUsageDaily'), orderBy('date', 'desc'), limit(700))),
            getDocs(query(collection(firestore, 'everhomesToolUsage'), orderBy('createdAt', 'desc'), limit(100))),
        ])
        dailyRows.value = dailySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        recentEvents.value = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (loadError) {
        console.error('Failed to load Everhomes tool usage:', loadError)
        error.value = loadError.message ?? 'Unknown Firestore error'
    } finally {
        loading.value = false
    }
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-AU').format(Number(value) || 0)
}

function actionLabel(action) {
    return ({
        opened: 'Opened',
        calculation_completed: 'Calculation completed',
        calculator_selected: 'Calculator selected',
        qr_generated: 'QR generated',
        downloaded: 'Downloaded',
        copied: 'Copied',
        report_started: 'Report started',
        report_submitted: 'Report submitted',
        import_started: 'Import started',
        import_completed: 'Import completed',
    })[action] ?? action
}

function variantLabel(variant) {
    return ({
        sda: 'SDA Calculator',
        appendix_h: 'Appendix H Calculator',
        three_weeks: '3 weeks',
        easy: 'Easy mode',
        advanced: 'Advanced mode',
        wifi: 'Wi-Fi',
        text: 'Text or URL',
        png: 'PNG',
        svg: 'SVG',
        image: 'Image',
        data: 'Data',
    })[variant] ?? variant
}

function deviceLabel(device) {
    return ({ mobile: 'Mobile', tablet: 'Tablet', desktop: 'Desktop' })[device] ?? 'Unknown device'
}

function formatRelative(timestamp) {
    const milliseconds = timestamp?.toMillis?.() ?? 0
    if (!milliseconds) return 'Just now'
    const difference = Date.now() - milliseconds
    const minutes = Math.floor(difference / 60_000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(milliseconds).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(loadUsage)
</script>
