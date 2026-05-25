<template>
    <LayoutComponent
        :header="true"
        :footer="true"
        :background="false"
        bg-style="linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%)"
    >
        <main class="relative min-h-screen overflow-hidden bg-[#0b1525]">
            <!-- Background -->
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div
                    class="absolute inset-0"
                    style="background: linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%);"
                />

                <div
                    class="absolute inset-0 opacity-70"
                    style="background-image: radial-gradient(circle, rgba(148, 163, 184, 0.14) 1px, transparent 1px); background-size: 28px 28px;"
                />

                <div class="absolute left-1/2 top-16 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div class="absolute right-[-12rem] top-80 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
                <div class="absolute bottom-0 left-[-10rem] h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div class="relative mx-auto max-w-7xl px-3 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
                <!-- Hero -->
                <section class="mb-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:mb-10 sm:rounded-[2rem] sm:p-8 lg:p-10">
                    <div class="grid min-w-0 gap-6 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px] lg:items-end">
                        <div class="min-w-0">
                            <div class="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300">
                                <Building2 class="h-3.5 w-3.5 shrink-0" />
                                <span class="truncate">SDA Property Management</span>
                            </div>

                            <h1 class="max-w-full text-[clamp(2.6rem,14vw,4rem)] font-black leading-[0.9] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                <span class="block whitespace-nowrap">Everhomes</span>
                                <span class="block bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                                    Tools
                                </span>
                            </h1>

                            <p class="mt-5 max-w-2xl text-[14px] leading-6 sm:leading-7 text-slate-300 sm:text-lg">
                                Fast internal tools for billing, inspections, handovers, compliance, and the tiny admin rituals civilisation apparently runs on.
                            </p>

                            <div class="mt-7 min-w-0 max-w-2xl">
                                <ToolSearchComponent v-model="searchQuery" class="w-full min-w-0" />
                            </div>
                        </div>

                        <aside class="hidden min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 lg:block">                            
                            <div class="flex items-center justify-between gap-4">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Tool suite
                                    </p>

                                    <div class="mt-1 flex items-end gap-2">
                                        <p class="text-3xl font-black leading-none text-white">
                                            {{ tools.length }}
                                        </p>

                                        <p class="pb-0.5 text-xs font-medium text-slate-500">
                                            total tools
                                        </p>
                                    </div>
                                </div>

                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                                    <Wrench class="h-5 w-5 text-cyan-300" />
                                </div>
                            </div>

                            <div class="mt-4 flex flex-wrap gap-2">
                                <div
                                    v-for="cat in categories"
                                    :key="cat.id"
                                    class="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5"
                                >
                                    <span class="text-sm font-bold leading-none text-white">
                                        {{ cat.tools.length }}
                                    </span>

                                    <span class="text-[11px] font-medium text-slate-400">
                                        {{ cat.label }}
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <!-- Quick access -->
                <section v-if="!searchQuery" class="mb-8 sm:mb-10">
                    <div class="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                                Quick access
                            </p>

                            <h2 class="mt-1 text-xl font-bold text-white">
                                Common workflows
                            </h2>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <QuickToolCard
                            v-for="tool in quickAccessTools"
                            :key="tool.id"
                            :tool="tool"
                        />
                    </div>
                </section>

                <!-- Search results -->
                <section v-if="searchQuery">
                    <div class="mb-6 flex items-center justify-between gap-4">
                        <p class="text-sm text-slate-500">
                            <span class="font-semibold text-slate-200">{{ filteredTools.length }}</span>
                            result{{ filteredTools.length !== 1 ? 's' : '' }} for
                            <span class="font-medium text-slate-300">"{{ searchQuery }}"</span>
                        </p>

                        <button
                            type="button"
                            class="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-teal-400/40 hover:text-teal-300"
                            @click="searchQuery = ''"
                        >
                            Clear
                        </button>
                    </div>

                    <div v-if="filteredTools.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ToolCard
                            v-for="tool in filteredTools"
                            :key="tool.id"
                            :tool="tool"
                        />
                    </div>

                    <div v-else class="rounded-[2rem] border border-white/10 bg-white/[0.045] py-20 text-center">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                            <Search class="h-5 w-5 text-slate-500" />
                        </div>

                        <p class="font-semibold text-slate-300">
                            No tools found
                        </p>

                        <p class="mt-1 text-sm text-slate-600">
                            Try a different keyword. Humanity survives another search miss.
                        </p>
                    </div>
                </section>

                <!-- Categorised sections -->
                <section v-else class="space-y-8 sm:space-y-10">
                    <section
                        v-for="cat in categories"
                        :key="cat.id"
                        class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 sm:rounded-[2rem] sm:p-5"
                    >
                        <div class="mb-5 flex items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
                            <div class="flex min-w-0 items-center gap-3">
                                <div
                                    class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                                    :style="{
                                        background: hexToRgba(cat.accentHex, 0.13),
                                        border: `1px solid ${hexToRgba(cat.accentHex, 0.24)}`
                                    }"
                                >
                                    <component
                                        :is="cat.icon"
                                        class="h-5 w-5"
                                        :style="{ color: cat.accentHex }"
                                    />
                                </div>

                                <div class="min-w-0">
                                    <h2 class="truncate text-lg font-bold text-white">
                                        {{ cat.label }}
                                    </h2>

                                    <p class="mt-0.5 line-clamp-2 text-sm text-slate-500">
                                        {{ cat.description }}
                                    </p>
                                </div>
                            </div>

                            <span
                                class="hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex"
                                :style="{
                                    color: cat.accentHex,
                                    background: hexToRgba(cat.accentHex, 0.1),
                                    border: `1px solid ${hexToRgba(cat.accentHex, 0.18)}`
                                }"
                            >
                                {{ cat.tools.length }} tool{{ cat.tools.length !== 1 ? 's' : '' }}
                            </span>
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <ToolCard
                                v-for="tool in cat.tools"
                                :key="tool.id"
                                :tool="tool"
                            />
                        </div>
                    </section>
                </section>
            </div>
        </main>
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
    Sparkles,
} from 'lucide-vue-next'

const searchQuery = ref('')

function hexToRgb(hex) {
    const s = hex.replace('#', '')
    const n = parseInt(s, 16)

    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function hexToRgba(hex, a = 1) {
    const [r, g, b] = hexToRgb(hex)

    return `rgba(${r}, ${g}, ${b}, ${a})`
}

const ToolCard = defineComponent({
    name: 'ToolCard',
    props: {
        tool: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return () => {
            const t = props.tool

            return h(
                RouterLink,
                {
                    to: t.link,
                    class: [
                        'tool-card group relative min-h-[178px] overflow-hidden rounded-3xl p-5',
                        'border bg-white/[0.055] transition-all duration-200',
                        'hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-2xl',
                        'focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                    ],
                    style: {
                        borderColor: hexToRgba(t.colorHex, 0.22),
                        '--tool-color': t.colorHex,
                        '--tool-color-glow': hexToRgba(t.colorHex, 0.22),
                    }
                },
                () => [
                    h('div', {
                        class: 'pointer-events-none absolute inset-x-0 top-0 h-px opacity-80',
                        style: {
                            background: `linear-gradient(to right, transparent, ${t.colorHex}, transparent)`
                        }
                    }),

                    h('div', {
                        class: 'pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-40 blur-3xl transition-opacity duration-200 group-hover:opacity-100',
                        style: {
                            background: hexToRgba(t.colorHex, 0.18)
                        }
                    }),

                    h('div', { class: 'relative flex h-full flex-col' }, [
                        h('div', { class: 'mb-5 flex items-start justify-between gap-4' }, [
                            h('div', {
                                class: 'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:scale-105',
                                style: {
                                    background: hexToRgba(t.colorHex, 0.13),
                                    borderColor: hexToRgba(t.colorHex, 0.24)
                                }
                            }, [
                                h(t.icon, {
                                    class: 'h-5 w-5',
                                    style: {
                                        color: t.colorHex
                                    }
                                })
                            ]),

                            t.badges?.length
                                ? h(
                                    'div',
                                    { class: 'flex flex-wrap justify-end gap-1' },
                                    t.badges.map((b, i) =>
                                        h(BadgeComponent, {
                                            key: i,
                                            ...b
                                        })
                                    )
                                )
                                : null
                        ]),

                        h('div', { class: 'min-h-[68px] flex-1' }, [
                            h('h3', {
                                class: 'text-base font-bold leading-snug text-white'
                            }, t.title),

                            h('p', {
                                class: 'mt-2 text-sm leading-6 text-slate-400 transition-colors duration-200 group-hover:text-slate-300'
                            }, t.byline)
                        ]),

                        h('div', {
                            class: 'mt-5 flex items-center justify-between gap-3'
                        }, [
                            h('div', { class: 'flex flex-wrap gap-1.5' }, [
                                h('span', {
                                    class: 'rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                                    style: {
                                        color: t.colorHex,
                                        background: hexToRgba(t.colorHex, 0.09),
                                        borderColor: hexToRgba(t.colorHex, 0.18)
                                    }
                                }, t.categoryLabel)
                            ]),

                            h('div', {
                                class: 'flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-all duration-200 group-hover:text-white'
                            }, [
                                h('span', {}, 'Open'),

                                h(ArrowRight, {
                                    class: 'h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5'
                                })
                            ])
                        ])
                    ])
                ]
            )
        }
    }
})

const QuickToolCard = defineComponent({
    name: 'QuickToolCard',
    props: {
        tool: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return () => {
            const t = props.tool

            return h(
                RouterLink,
                {
                    to: t.link,
                    class: [
                        'quick-tool-card group relative overflow-hidden rounded-3xl border',
                        'px-5 py-5 transition-all duration-200',
                        'hover:-translate-y-0.5'
                    ],
                    style: {
                        borderColor: hexToRgba(t.colorHex, 0.24),
                        background: `linear-gradient(135deg, ${hexToRgba(t.colorHex, 0.14)} 0%, rgba(255, 255, 255, 0.075) 42%, rgba(255, 255, 255, 0.045) 100%)`,
                        '--quick-glow': hexToRgba(t.colorHex, 0.2),
                    }
                },
                () => [
                    h('div', {
                        class: 'absolute inset-y-0 left-0 w-1',
                        style: {
                            background: t.colorHex
                        }
                    }),

                    h('div', {
                        class: 'pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-45 blur-3xl transition-opacity duration-200 group-hover:opacity-100',
                        style: {
                            background: hexToRgba(t.colorHex, 0.22)
                        }
                    }),

                    h('div', { class: 'relative flex min-h-[58px] items-center gap-4 pl-2' }, [
                        h('div', {
                            class: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-lg shadow-black/10',
                            style: {
                                background: hexToRgba(t.colorHex, 0.14),
                                borderColor: hexToRgba(t.colorHex, 0.26)
                            }
                        }, [
                            h(t.icon, {
                                class: 'h-5 w-5',
                                style: {
                                    color: t.colorHex
                                }
                            })
                        ]),

                        h('div', { class: 'min-w-0 flex-1' }, [
                            h('div', { class: 'flex items-center gap-2' }, [
                                h('h3', {
                                    class: 'truncate text-sm font-bold text-white'
                                }, t.title),

                                t.badges?.length
                                    ? h(Sparkles, {
                                        class: 'h-3.5 w-3.5 shrink-0 text-emerald-300'
                                    })
                                    : null
                            ]),

                            h('p', {
                                class: 'mt-1 line-clamp-2 text-xs leading-5 text-slate-400'
                            }, t.byline)
                        ]),

                        h(ArrowRight, {
                            class: 'h-4 w-4 shrink-0 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white'
                        })
                    ])
                ]
            )
        }
    }
})

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
        title: 'Participant SDA Funding Details',
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

const toolsWithCategoryLabels = computed(() =>
    tools.map(tool => {
        const category = categoryMeta.find(cat => cat.id === tool.category)

        return {
            ...tool,
            categoryLabel: category?.label ?? tool.category
        }
    })
)

const categories = computed(() =>
    categoryMeta
        .map(cat => ({
            ...cat,
            tools: toolsWithCategoryLabels.value.filter(tool => tool.category === cat.id)
        }))
        .filter(cat => cat.tools.length > 0)
)

const quickAccessTools = computed(() => {
    const priority = ['water', 'inspection-checklist', 'sda-return']

    return priority
        .map(id => toolsWithCategoryLabels.value.find(tool => tool.id === id))
        .filter(Boolean)
})

const filteredTools = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()

    if (!q) {
        return toolsWithCategoryLabels.value
    }

    return toolsWithCategoryLabels.value.filter(tool =>
        tool.title.toLowerCase().includes(q) ||
        tool.byline.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q)
    )
})
</script>

<style scoped>
.tool-card:hover {
    box-shadow:
        0 18px 48px rgba(0, 0, 0, 0.35),
        0 0 42px var(--tool-color-glow);
}

.quick-tool-card:hover {
    box-shadow:
        0 16px 38px rgba(0, 0, 0, 0.24),
        0 0 34px var(--quick-glow);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 420px) {
    :deep(input) {
        min-width: 0;
    }
}
</style>
