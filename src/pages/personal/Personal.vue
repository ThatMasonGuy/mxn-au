<template>
    <div class="min-h-screen bg-slate-950 text-white px-6 py-10">
        <div class="max-w-6xl mx-auto space-y-10">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-800 pb-6">
                <h1 class="text-4xl font-extrabold text-emerald-400 tracking-tight drop-shadow-[0_0_12px_#10b98188]">
                    Mason's Chaos Hub
                </h1>
                <span class="text-slate-500 text-sm">/personal</span>
            </div>

            <p class="text-slate-300 max-w-prose text-lg">
                A lovingly unstable collection of trackers, tools, and side quests. Expect glow, sass, and the
                occasional existential breakthrough.
            </p>

            <!-- Tool Cards -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ToolCard v-for="(tool, i) in sortedTools" :key="i" :title="tool.title" :desc="tool.description"
                    :link="tool.active ? tool.link : null" :icon="tool.icon" :badges="tool.badges"
                    :badgeStyles="badgeStyles" :colorClass="greenCardColor" :disabled="tool.disabled"
                    gradientOverlayClass="bg-gradient-to-t from-emerald-500/10 via-cyan-500/10 to-transparent"
                    contentOverlayClass="bg-emerald-900/20" iconColorClass="text-emerald-300"
                    iconBackgroundClass="bg-gradient-to-br from-emerald-700/40 to-cyan-700/40" footerAlign="right"
                    glowUnderlineClass="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                    <template #footer>
                        {{ tool.active ? 'Open →' : 'Coming soon' }}
                    </template>
                </ToolCard>
            </div>
        </div>
    </div>
</template>

<script setup>
import ToolCard from '@/components/topheroes/ToolCard.vue'
import {
    ChartBarIcon,
    MoonIcon,
    FaceFrownIcon,
    CurrencyDollarIcon,
    BeakerIcon,
    CpuChipIcon,
    ArchiveBoxIcon,
} from '@heroicons/vue/24/outline'

const greenCardColor =
    'bg-white/5 border-emerald-500/30 hover:shadow-emerald-500/40 hover:border-emerald-500/70'

const badgeStyles = {
    'Too Real': 'bg-rose-500/20 text-rose-300 border-rose-300/40',
    'Phase 2': 'bg-sky-500/20 text-sky-300 border-sky-300/40',
    Shame: 'bg-pink-500/20 text-pink-300 border-pink-300/40',
    Private: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-300/30',
}

const tools = [
    {
        title: '🍽️ Eat, you Goblin',
        description: 'Food and hydration logging with chaotic vibes and emotional damage built-in.',
        link: '/personal/tracker',
        active: true,
        icon: ChartBarIcon,
        badges: ['New!'],
    },
    {
        title: '🛌 Sleep Rituals',
        description: 'Log sleep patterns, bedtime rituals, and how cooked you feel the next day.',
        active: false,
        disabled: true,
        icon: MoonIcon,
        badges: ['Coming Soon'],
    },
    {
        title: '📉 Mood Oscillator',
        description: 'A moody little chart with tags, emojis, and existential vibes.',
        active: false,
        icon: FaceFrownIcon,
        badges: ['Coming Soon'],
    },
    {
        title: '💸 Dare Damage Log',
        description: 'Track how much you’ve spent on iced coffee. Experience financial guilt in real-time.',
        link: '/personal/dare-shame',
        active: true,
        icon: CurrencyDollarIcon,
        badges: ['New!', 'Too Real'],
    },
    {
        title: '🤖 AI.Journal',
        description: 'Chat to a context aware AI Journal, or switch back to oldschool journalling.',
        link: '/personal/journal',
        active: true,
        icon: BeakerIcon,
        badges: ['New!'],
    },
    {
        title: '🧠 Memory Vault',
        description: 'Frontend for the Activity Logger: searchable sessions, semantic tags, digital footprint.',
        active: false,
        icon: CpuChipIcon,
        badges: [
            'Phase 2',
            { label: 'Private', glow: true },
        ],
    },
    {
        title: '📦 Screenshot Graveyard',
        description: 'Old projects, cursed designs, half-finished UIs—archived in glorious shameful light.',
        active: false,
        icon: ArchiveBoxIcon,
        badges: ['Shame'],
    },
]

const sortedTools = tools.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))
</script>