<template>
    <div class="gnaw-root min-h-screen text-white overflow-x-hidden">

        <!-- Ambient background blobs -->
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-lime-900/20 blur-[100px]" />
            <div class="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-emerald-900/15 blur-[120px]" />
            <div class="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-lime-950/30 blur-[80px]" />
        </div>

        <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            <!-- ===== HEADER ===== -->
            <header class="mb-10 sm:mb-14">
                <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                    <!-- Brand lockup -->
                    <div class="flex items-center gap-4">
                        <!-- Gnaw logomark -->
                        <div class="relative flex-shrink-0">
                            <div class="gnaw-logo w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl ring-1 ring-lime-700/40">
                                <svg viewBox="0 0 40 40" fill="none" class="w-8 h-8 sm:w-9 sm:h-9">
                                    <!-- Goblin fang/gnaw mark -->
                                    <path d="M8 32 C8 32, 12 18, 20 14 C28 18, 32 32, 32 32" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.9"/>
                                    <path d="M14 32 L16 22 L20 28 L24 22 L26 32" stroke="#84cc16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                                    <circle cx="20" cy="11" r="3" fill="#a3e635" opacity="0.7"/>
                                    <circle cx="13" cy="14" r="1.5" fill="#65a30d" opacity="0.5"/>
                                    <circle cx="27" cy="14" r="1.5" fill="#65a30d" opacity="0.5"/>
                                </svg>
                            </div>
                            <!-- Glow ring -->
                            <div class="absolute inset-0 rounded-2xl blur-md bg-lime-500/20 -z-10" />
                        </div>

                        <div>
                            <div class="flex items-baseline gap-2 sm:gap-3">
                                <h1 class="gnaw-wordmark text-4xl sm:text-5xl font-black tracking-tight text-lime-300 leading-none drop-shadow-[0_0_20px_#a3e63550]">
                                    GNAW
                                </h1>
                                <span class="gnaw-badge-future text-[10px] sm:text-xs font-extrabold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full border border-lime-700/50 text-lime-500 bg-lime-950/60">
                                    BETA
                                </span>
                            </div>
                            <p class="text-stone-400 text-sm sm:text-base font-medium mt-0.5 leading-snug">
                                Your personal wellness den — eat, sleep, gnaw, repeat.
                            </p>
                        </div>
                    </div>

                    <!-- Meta info: future app teaser -->
                    <div class="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                        <a
                            href="https://gnaw.app"
                            target="_blank"
                            rel="noopener"
                            class="gnaw-future-pill flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-800/50 bg-lime-950/50 text-lime-500 text-xs font-bold tracking-wide hover:border-lime-600/60 hover:text-lime-400 transition-all duration-200 group"
                        >
                            <Globe class="w-3.5 h-3.5" />
                            gnaw.app
                            <ExternalLink class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <span class="hidden sm:flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                            <span class="w-1.5 h-1.5 rounded-full bg-lime-500 gnaw-pulse-dot" />
                            {{ activeCount }} active
                        </span>
                    </div>
                </div>

                <!-- Divider with goblin flair -->
                <div class="mt-8 flex items-center gap-3">
                    <div class="flex-1 h-px bg-gradient-to-r from-transparent via-lime-900/60 to-transparent" />
                    <div class="flex items-center gap-1.5 text-lime-800/70">
                        <Leaf class="w-3.5 h-3.5" />
                    </div>
                    <div class="flex-1 h-px bg-gradient-to-r from-transparent via-lime-900/60 to-transparent" />
                </div>
            </header>

            <!-- ===== STATS ROW ===== -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 sm:mb-12">
                <div v-for="stat in stats" :key="stat.label"
                    class="gnaw-stat-pill flex flex-col gap-1 px-4 py-3 rounded-xl border border-stone-800/60 bg-stone-950/40">
                    <span class="text-xl sm:text-2xl font-black" :class="stat.color">{{ stat.value }}</span>
                    <span class="text-stone-500 text-xs font-semibold uppercase tracking-widest">{{ stat.label }}</span>
                </div>
            </div>

            <!-- ===== ACTIVE BURROWS ===== -->
            <section class="mb-12">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center gap-2">
                        <Flame class="w-4 h-4 text-lime-500" />
                        <h2 class="gnaw-section-title text-xs font-extrabold uppercase tracking-[0.25em] text-lime-600">
                            Your Den
                        </h2>
                    </div>
                    <div class="flex-1 h-px bg-gradient-to-r from-lime-900/40 to-transparent" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GnawCard
                        v-for="tool in activeTools"
                        :key="tool.link"
                        :title="tool.title"
                        :desc="tool.desc"
                        :link="tool.link"
                        :icon="tool.icon"
                        :badges="tool.badges"
                        :accent="tool.accent"
                    />
                </div>
            </section>

            <!-- ===== BREWING IN THE CAVE ===== -->
            <section class="mb-16">
                <div class="flex items-center gap-3 mb-6">
                    <div class="flex items-center gap-2">
                        <FlaskConical class="w-4 h-4 text-stone-500" />
                        <h2 class="gnaw-section-title text-xs font-extrabold uppercase tracking-[0.25em] text-stone-600">
                            Brewing in the Cave
                        </h2>
                    </div>
                    <div class="flex-1 h-px bg-gradient-to-r from-stone-800/60 to-transparent" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <GnawCard
                        v-for="tool in comingTools"
                        :key="tool.title"
                        :title="tool.title"
                        :desc="tool.desc"
                        :link="null"
                        :icon="tool.icon"
                        :badges="tool.badges"
                        :accent="tool.accent"
                    />
                </div>
            </section>

            <!-- ===== GNAW.APP TEASER ===== -->
            <div class="gnaw-teaser-card relative overflow-hidden rounded-2xl border border-lime-900/40 p-6 sm:p-8">
                <!-- Background -->
                <div class="absolute inset-0 bg-gradient-to-br from-lime-950/40 via-stone-950/60 to-emerald-950/30" />
                <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-lime-500/5 blur-3xl pointer-events-none" />

                <div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <Sprout class="w-4 h-4 text-lime-500" />
                            <span class="text-xs font-extrabold uppercase tracking-[0.2em] text-lime-600">Coming Someday</span>
                        </div>
                        <h3 class="gnaw-wordmark text-2xl sm:text-3xl font-black text-lime-300 mb-2">gnaw.app</h3>
                        <p class="text-stone-400 text-sm leading-relaxed max-w-prose">
                            A standalone wellness companion for people who track things obsessively and want it to feel like
                            their own cozy underground fortress — not another sterile SaaS dashboard.
                            Food, sleep, mood, movement, journalling, and habits. All in one den.
                        </p>
                    </div>

                    <div class="flex flex-col gap-2 sm:flex-shrink-0">
                        <div v-for="feature in gnawFeatures" :key="feature" class="flex items-center gap-2 text-sm text-stone-400">
                            <CheckCircle2 class="w-4 h-4 text-lime-700 flex-shrink-0" />
                            {{ feature }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="mt-10 flex items-center justify-between text-xs text-stone-700 font-medium">
                <span>🧌 gnaw.app — not a real app yet</span>
                <span>/personal</span>
            </footer>
        </div>
    </div>
</template>

<script setup>
import {
    BarChart3, Moon, Frown, DollarSign, FlaskConical, Cpu,
    Archive, LayoutGrid, BookOpen, StickyNote, CheckSquare,
    Flame, Leaf, Globe, ExternalLink, Sprout, CheckCircle2,
    Dumbbell, Droplets, Heart, Scale, Timer, BrainCircuit,
    ActivitySquare, ClipboardList,
} from 'lucide-vue-next'

import GnawCard from '@/features/personal/components/GnawCard.vue'

// ── Active tools ──────────────────────────────────────────────────────────────
const activeTools = [
    {
        title: "Today's Queue",
        desc: "Your daily task plate. Pull from the queue, track progress, take notes, and feel like you accomplished something.",
        link: '/personal/todo',
        icon: CheckSquare,
        accent: 'lime',
        badges: ['New!'],
    },
    {
        title: 'Eat, you Goblin',
        desc: 'Food and hydration logging. Track macros, log Dares, and confront your caloric decisions in real-time.',
        link: '/personal/tracker',
        icon: BarChart3,
        accent: 'emerald',
        badges: ['New!'],
    },
    {
        title: 'AI Journal',
        desc: 'Context-aware journalling with AI-generated prompts. Or just write, old-school. The AI is there when you want it.',
        link: '/personal/journal',
        icon: BookOpen,
        accent: 'violet',
        badges: ['New!'],
    },
    {
        title: 'Dare Damage Log',
        desc: 'Track how much you\'ve spent on iced coffee. Experience financial guilt in glorious real-time.',
        link: '/personal/dare-shame',
        icon: DollarSign,
        accent: 'amber',
        badges: ['New!', 'Too Real'],
    },
    {
        title: 'Kanban Boards',
        desc: 'Your custom, no-bloat Kanban. Does exactly what you want, nothing more. No jira. No nonsense.',
        link: '/personal/kanban',
        icon: LayoutGrid,
        accent: 'teal',
        badges: ['New!'],
    },
    {
        title: 'Notes',
        desc: 'Block-based notes with an editor that actually behaves. Inline editing, rich formatting, linked to tasks.',
        link: '/personal/notes',
        icon: StickyNote,
        accent: 'sky',
        badges: [],
    },
    {
        title: 'Usage Costs',
        desc: 'See how much your AI habit is costing you. Spoiler: it\'s fine. Probably.',
        link: '/personal/usage',
        icon: ActivitySquare,
        accent: 'orange',
        badges: [],
    },
]

// ── Coming soon tools ─────────────────────────────────────────────────────────
const comingTools = [
    {
        title: 'Sleep Rituals',
        desc: 'Log sleep patterns, bedtime rituals, and scientifically assess how cooked you feel the next day.',
        icon: Moon,
        accent: 'sky',
        badges: ['Coming Soon'],
    },
    {
        title: 'Mood Oscillator',
        desc: 'A moody little chart with tags, emojis, and a graph of your slow descent into or out of chaos.',
        icon: Frown,
        accent: 'rose',
        badges: ['Coming Soon'],
    },
    {
        title: 'Body Metrics',
        desc: 'Weight, measurements, progress photos. Log the physical stuff without the toxic app energy.',
        icon: Scale,
        accent: 'teal',
        badges: ['Coming Soon'],
    },
    {
        title: 'Move Log',
        desc: 'Track workouts, walks, stretches, and any movement that counters the sitting. Gym or goblin cave — both valid.',
        icon: Dumbbell,
        accent: 'lime',
        badges: ['Coming Soon'],
    },
    {
        title: 'Habit Den',
        desc: 'Build habits like a creature of routine. Streaks, heatmaps, gentle shame spirals. You\'ve got this.',
        icon: CheckSquare,
        accent: 'amber',
        badges: ['Coming Soon'],
    },
    {
        title: 'Hydration Watch',
        desc: 'Water. You need it. This will remind you in a way that doesn\'t feel like your phone is lecturing you.',
        icon: Droplets,
        accent: 'sky',
        badges: ['Coming Soon'],
    },
    {
        title: 'Heart Rate & Vitals',
        desc: 'Sync from wearables or log manually. See trends, identify anomalies, feel like a biohacker.',
        icon: Heart,
        accent: 'rose',
        badges: ['Coming Soon'],
    },
    {
        title: 'Memory Vault',
        desc: 'Searchable sessions, semantic tags, and your full digital footprint — summarised and made useful.',
        icon: BrainCircuit,
        accent: 'violet',
        badges: ['Coming Soon', { label: 'Private', glow: false }],
    },
    {
        title: 'Focus Sessions',
        desc: 'Pomodoro-style focus blocks with task linking. Get into the zone, come out with receipts.',
        icon: Timer,
        accent: 'orange',
        badges: ['Coming Soon'],
    },
]

// ── Stats ─────────────────────────────────────────────────────────────────────
const activeCount = activeTools.length

const stats = [
    { label: 'Active Tools', value: activeCount, color: 'text-lime-400' },
    { label: 'In the Cave', value: comingTools.length, color: 'text-stone-400' },
    { label: 'Days Tracked', value: '—', color: 'text-amber-400' },
    { label: 'Tasks Done', value: '—', color: 'text-teal-400' },
]

// ── Gnaw.app teaser features ──────────────────────────────────────────────────
const gnawFeatures = [
    'Food & hydration tracking',
    'Sleep & recovery logging',
    'Mood & mental wellness',
    'Movement & exercise',
    'Habit & goal tracking',
    'AI-powered journalling',
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');

.gnaw-root {
    background: #090d07;
    font-family: 'Outfit', sans-serif;
}

.gnaw-wordmark {
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.03em;
}

.gnaw-section-title {
    font-family: 'Outfit', sans-serif;
}

.gnaw-logo {
    background: linear-gradient(135deg, #0c1a08 0%, #111f0b 100%);
    box-shadow: 0 0 24px rgba(163, 230, 53, 0.12), inset 0 1px 0 rgba(255,255,255,0.05);
}

.gnaw-stat-pill {
    background: linear-gradient(135deg, #0a0f08 0%, #0e150b 100%);
}

.gnaw-teaser-card {
    background: linear-gradient(135deg, #0a110a 0%, #0c150a 100%);
}

.gnaw-pulse-dot {
    animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(163, 230, 53, 0.4); }
    50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(163, 230, 53, 0); }
}
</style>