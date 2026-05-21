<template>
    <LayoutComponent :header="true" :footer="true" :background="false" bg-style="linear-gradient(160deg, #121f33 0%, #0d1829 45%, #09121f 100%)" >
        <!-- ─── Page wrapper (background scoped here) ─────────────────────────── -->
        <div class="relative min-h-screen">

            <!-- Background: gradient + dot grid, no blobs -->
            <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
                <div class="absolute inset-0" style="background: linear-gradient(160deg, #121f33 0%, #0d1829 45%, #09121f 100%);" />
                <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px); background-size: 28px 28px;" />
                <!-- Teal accent line across the top -->
                <div class="absolute top-0 inset-x-0 h-px" style="background: linear-gradient(to right, transparent 5%, rgba(20,184,166,0.5) 40%, rgba(34,211,238,0.4) 60%, transparent 95%);" />
            </div>

        <!-- ─── Hero ──────────────────────────────────────────────────────────── -->
        <div class="relative pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-2xl mx-auto text-center">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400/90 text-xs font-medium tracking-wide mb-6">
                    <Building2 class="w-3 h-3 text-teal-400" />
                    SDA Property Management
                </div>

                <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    Everhomes
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400"> Tools</span>
                </h1>

                <p class="text-slate-400 text-base sm:text-lg mb-8">
                    Purpose-built for SDA property management.
                </p>

                <!-- Search -->
                <div class="max-w-md mx-auto">
                    <ToolSearchComponent v-model="searchQuery" />
                </div>
            </div>
        </div>

        <!-- ─── Content ───────────────────────────────────────────────────────── -->
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

            <!-- Search results -->
            <template v-if="searchQuery">
                <p class="text-slate-500 text-sm mb-6">
                    <span class="text-slate-300 font-medium">{{ filteredTools.length }}</span>
                    result{{ filteredTools.length !== 1 ? 's' : '' }} for
                    "<span class="text-slate-300">{{ searchQuery }}</span>"
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
                </div>

                <div v-if="!filteredTools.length" class="py-24 text-center">
                    <div class="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-3">
                        <Search class="w-5 h-5 text-slate-600" />
                    </div>
                    <p class="text-slate-400 font-medium mb-1">No tools found</p>
                    <p class="text-slate-600 text-sm mb-4">Try a different keyword</p>
                    <button @click="searchQuery = ''" class="text-teal-400 hover:text-teal-300 text-sm transition-colors">
                        Clear search
                    </button>
                </div>
            </template>

            <!-- Categorised sections -->
            <template v-else>
                <div class="space-y-12">
                    <section v-for="cat in categories" :key="cat.id">

                        <!-- Section header -->
                        <div class="flex items-center gap-2.5 mb-5 pb-4" style="border-bottom: 1px solid rgba(255,255,255,0.07)">
                            <div
                                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                :style="{ background: hexToRgba(cat.accentHex, 0.15), border: `1px solid ${hexToRgba(cat.accentHex, 0.2)}` }"
                            >
                                <component :is="cat.icon" class="w-3.5 h-3.5" :style="{ color: cat.accentHex }" />
                            </div>
                            <div>
                                <h2 class="text-white font-semibold text-sm leading-none">{{ cat.label }}</h2>
                                <p class="text-slate-500 text-xs mt-0.5">{{ cat.description }}</p>
                            </div>
                            <span class="ml-auto text-slate-700 text-xs font-medium tabular-nums">
                                {{ cat.tools.length }} tool{{ cat.tools.length !== 1 ? 's' : '' }}
                            </span>
                        </div>

                        <!-- Tool grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ToolCard v-for="tool in cat.tools" :key="tool.id" :tool="tool" />
                        </div>

                    </section>
                </div>
            </template>

        </div>

        </div><!-- end page wrapper -->
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolSearchComponent from '@/features/everhomes/components/ui/ToolSearchComponent.vue'
import BadgeComponent from '@/features/everhomes/components/ui/BadgeComponent.vue'

import {
    DollarSign,
    Banknote,
    Building2,
    ClipboardCheck,
    ClipboardList,
    QrCode,
    Wrench,
    Search,
    ArrowRight,
} from 'lucide-vue-next'

// ─── State ────────────────────────────────────────────────────────────────────
const searchQuery = ref('')

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const s = hex.replace('#', '')
    const n = parseInt(s, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function hexToRgba(hex, a = 1) {
    const [r, g, b] = hexToRgb(hex)
    return `rgba(${r},${g},${b},${a})`
}

// ─── Tool card component ──────────────────────────────────────────────────────
const ToolCard = defineComponent({
    name: 'ToolCard',
    props: { tool: { type: Object, required: true } },
    setup(props) {
        return () => {
            const t = props.tool
            return h(
                RouterLink,
                {
                    to: t.link,
                    class: 'tool-card group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/50 active:translate-y-0',
                    style: 'background: #0f1e30; border: 1px solid rgba(255,255,255,0.1);',
                },
                () => [
                    // Colored top accent strip
                    h('div', {
                        class: 'h-0.5 w-full shrink-0',
                        style: { background: `linear-gradient(to right, ${t.colorHex}, ${hexToRgba(t.colorHex, 0.3)})` }
                    }),

                    // Card body
                    h('div', { class: 'p-5 flex flex-col flex-1' }, [

                        // Top row: icon + badge
                        h('div', { class: 'flex items-start justify-between mb-4' }, [
                            h('div', {
                                class: 'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                                style: { background: hexToRgba(t.colorHex, 0.12), border: `1px solid ${hexToRgba(t.colorHex, 0.2)}` }
                            }, [
                                h(t.icon, { class: 'w-5 h-5', style: { color: t.colorHex } })
                            ]),
                            t.badges?.length
                                ? h('div', { class: 'flex gap-1' }, t.badges.map((b, i) => h(BadgeComponent, { key: i, ...b })))
                                : null
                        ]),

                        // Text
                        h('div', { class: 'flex-1' }, [
                            h('h3', { class: 'text-white font-semibold text-sm mb-1 leading-snug' }, t.title),
                            h('p', { class: 'text-slate-500 text-xs leading-relaxed' }, t.byline)
                        ]),

                        // Arrow footer
                        h('div', { class: 'mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150' }, [
                            h('span', { class: 'text-xs text-slate-500 mr-1.5' }, 'Open'),
                            h(ArrowRight, { class: 'w-3.5 h-3.5 text-slate-500' })
                        ])
                    ])
                ]
            )
        }
    }
})

// ─── Tool definitions ─────────────────────────────────────────────────────────
const tools = [
    {
        id: 'water',
        title: 'Water Bills',
        byline: 'Split SDA water bills by participant and date',
        link: '/everhomes/water-bills',
        icon: DollarSign,
        colorHex: '#0ea5e9',
        badges: [],
        category: 'finance'
    },
    {
        id: 'placement-fees',
        title: 'Placement Fees',
        byline: 'Calculate participant placement-related costs',
        link: '/everhomes/placement-fees',
        icon: Banknote,
        colorHex: '#10b981',
        badges: [],
        category: 'finance'
    },
    {
        id: 'sda-return',
        title: 'SDA Price Calculator',
        byline: 'Location-adjusted annual SDA amounts per participant',
        link: '/everhomes/sda-returns',
        icon: Building2,
        colorHex: '#8b5cf6',
        badges: [{ label: 'New', type: 'new' }],
        category: 'finance'
    },
    {
        id: 'inspection-checklist',
        title: 'Inspection Checklist',
        byline: 'Walk through property rooms and capture photos for each area',
        link: '/everhomes/inspection-checklist',
        icon: ClipboardCheck,
        colorHex: '#14b8a6',
        badges: [],
        category: 'inspection'
    },
    {
        id: 'handover-checklist',
        title: 'Handover Checklist',
        byline: 'SDA dwelling suitability review for handovers and annual compliance',
        link: '/everhomes/handover-checklist',
        icon: ClipboardList,
        colorHex: '#06b6d4',
        badges: [],
        category: 'inspection'
    },
    {
        id: 'qr-code',
        title: 'QR Code Generator',
        byline: 'Generate customisable QR codes for URLs, text, and Wi-Fi',
        link: '/everhomes/qr-code',
        icon: QrCode,
        colorHex: '#a855f7',
        badges: [{ label: 'New', type: 'new' }],
        category: 'utilities'
    },
]

// ─── Category config ──────────────────────────────────────────────────────────
const categoryMeta = [
    {
        id: 'finance',
        label: 'Finance',
        description: 'Billing, fees, and cost calculators',
        icon: Banknote,
        accentHex: '#0ea5e9'
    },
    {
        id: 'inspection',
        label: 'Inspection',
        description: 'Property walkthroughs and compliance checklists',
        icon: ClipboardList,
        accentHex: '#14b8a6'
    },
    {
        id: 'utilities',
        label: 'Utilities',
        description: 'General-purpose productivity tools',
        icon: Wrench,
        accentHex: '#a855f7'
    }
]

const categories = computed(() =>
    categoryMeta
        .map(cat => ({ ...cat, tools: tools.filter(t => t.category === cat.id) }))
        .filter(cat => cat.tools.length > 0)
)

const filteredTools = computed(() => {
    const q = searchQuery.value.toLowerCase()
    return tools.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.byline.toLowerCase().includes(q)
    )
})
</script>

<style scoped>
.tool-card:hover {
    background: #162538 !important;
    border-color: rgba(255, 255, 255, 0.18) !important;
}
</style>
