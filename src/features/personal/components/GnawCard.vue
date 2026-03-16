<template>
    <component :is="resolvedTag" :to="routerTo" class="gnaw-card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 rounded-2xl">
        <div :class="[
            'relative overflow-hidden rounded-2xl border transition-all duration-500 gnaw-surface',
            disabled
                ? 'opacity-40 pointer-events-none grayscale saturate-0 gnaw-dormant'
                : 'gnaw-active',
            accentConfig.border,
        ]">
            <!-- Cave texture grain -->
            <div class="absolute inset-0 gnaw-grain pointer-events-none z-0" />

            <!-- Bioluminescent glow blob (hover) -->
            <div :class="[
                'absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 transition-all duration-700 ease-out pointer-events-none z-0',
                'group-hover:opacity-20',
                accentConfig.glowBlob,
            ]" />

            <!-- Corner spore clusters (decorative) -->
            <div class="absolute bottom-0 left-0 w-20 h-20 pointer-events-none z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <svg viewBox="0 0 80 80" fill="none" class="w-full h-full">
                    <circle cx="10" cy="70" r="6" :fill="accentConfig.svgFill" opacity="0.6"/>
                    <circle cx="22" cy="66" r="4" :fill="accentConfig.svgFill" opacity="0.4"/>
                    <circle cx="5" cy="58" r="3" :fill="accentConfig.svgFill" opacity="0.3"/>
                    <circle cx="30" cy="72" r="3" :fill="accentConfig.svgFill" opacity="0.25"/>
                </svg>
            </div>

            <!-- Badges -->
            <div v-if="badgesToRender.length" class="absolute top-3 right-3 z-20 flex flex-wrap gap-1.5 justify-end">
                <span v-for="(badge, i) in badgesToRender" :key="i" :class="[
                    'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] border',
                    getBadgeClass(badge),
                    badge === 'New!' || (badge?.glow) ? 'gnaw-badge-glow' : '',
                ]" :style="badge === 'New!' || badge?.glow ? { '--badge-glow': accentConfig.glowColor } : {}">
                    {{ typeof badge === 'string' ? badge : badge.label }}
                </span>
            </div>

            <!-- Main content -->
            <div class="relative z-10 p-5 flex flex-col h-full">

                <!-- Icon -->
                <div class="mb-4">
                    <div :class="[
                        'inline-flex items-center justify-center w-11 h-11 rounded-xl shadow-lg transition-all duration-300',
                        'group-hover:scale-110',
                        accentConfig.iconBg,
                    ]">
                        <component :is="icon" v-if="icon" :class="['w-5 h-5 transition-colors duration-300', accentConfig.iconColor]" />
                        <span v-else :class="['text-lg', accentConfig.iconColor]">🧌</span>
                    </div>
                </div>

                <!-- Title -->
                <h3 :class="[
                    'font-extrabold text-base leading-tight mb-2 gnaw-title transition-colors duration-300',
                    accentConfig.titleColor,
                ]">
                    {{ title }}
                </h3>

                <!-- Description -->
                <p class="text-sm leading-relaxed text-stone-400 flex-1 mb-5">
                    {{ desc }}
                </p>

                <!-- Footer CTA -->
                <div :class="[
                    'flex items-center gap-1.5 text-xs font-bold tracking-wide transition-all duration-300',
                    disabled ? 'text-stone-600' : accentConfig.footerColor,
                    !disabled && link ? 'group-hover:gap-2.5' : '',
                ]">
                    <template v-if="!disabled">
                        <span v-if="link">Venture in</span>
                        <span v-else class="italic text-stone-600">brewing in the cave...</span>
                        <ArrowRight v-if="link" class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </template>
                    <span v-else class="italic">dormant</span>
                </div>
            </div>

            <!-- Bottom glow bar -->
            <div :class="[
                'absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                accentConfig.glowBar,
            ]" />

            <!-- Active state shimmer on hover -->
            <div v-if="!disabled" class="gnaw-shimmer absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    </component>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps({
    icon: { type: [Object, Function], default: null },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    link: { type: String, default: null },
    badge: { type: [String, Object], default: null },
    badges: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    /**
     * Accent theme: 'lime' | 'amber' | 'violet' | 'teal' | 'rose' | 'sky' | 'orange' | 'emerald'
     * Defaults to 'lime' (the Gnaw brand color)
     */
    accent: { type: String, default: 'lime' },
})

const ACCENT_MAP = {
    lime: {
        border: 'border-lime-900/60 hover:border-lime-500/50',
        glowBlob: 'bg-lime-400',
        glowColor: '#a3e635',
        svgFill: '#a3e635',
        iconBg: 'bg-lime-950/80 ring-1 ring-lime-800/60',
        iconColor: 'text-lime-400 group-hover:text-lime-300',
        titleColor: 'text-lime-200 group-hover:text-lime-100',
        footerColor: 'text-lime-600 group-hover:text-lime-400',
        glowBar: 'bg-gradient-to-r from-transparent via-lime-500/60 to-transparent',
    },
    amber: {
        border: 'border-amber-900/60 hover:border-amber-500/50',
        glowBlob: 'bg-amber-400',
        glowColor: '#fbbf24',
        svgFill: '#fbbf24',
        iconBg: 'bg-amber-950/80 ring-1 ring-amber-800/60',
        iconColor: 'text-amber-400 group-hover:text-amber-300',
        titleColor: 'text-amber-200 group-hover:text-amber-100',
        footerColor: 'text-amber-600 group-hover:text-amber-400',
        glowBar: 'bg-gradient-to-r from-transparent via-amber-500/60 to-transparent',
    },
    violet: {
        border: 'border-violet-900/60 hover:border-violet-500/50',
        glowBlob: 'bg-violet-400',
        glowColor: '#a78bfa',
        svgFill: '#a78bfa',
        iconBg: 'bg-violet-950/80 ring-1 ring-violet-800/60',
        iconColor: 'text-violet-400 group-hover:text-violet-300',
        titleColor: 'text-violet-200 group-hover:text-violet-100',
        footerColor: 'text-violet-600 group-hover:text-violet-400',
        glowBar: 'bg-gradient-to-r from-transparent via-violet-500/60 to-transparent',
    },
    teal: {
        border: 'border-teal-900/60 hover:border-teal-500/50',
        glowBlob: 'bg-teal-400',
        glowColor: '#2dd4bf',
        svgFill: '#2dd4bf',
        iconBg: 'bg-teal-950/80 ring-1 ring-teal-800/60',
        iconColor: 'text-teal-400 group-hover:text-teal-300',
        titleColor: 'text-teal-200 group-hover:text-teal-100',
        footerColor: 'text-teal-600 group-hover:text-teal-400',
        glowBar: 'bg-gradient-to-r from-transparent via-teal-500/60 to-transparent',
    },
    rose: {
        border: 'border-rose-900/60 hover:border-rose-500/50',
        glowBlob: 'bg-rose-400',
        glowColor: '#fb7185',
        svgFill: '#fb7185',
        iconBg: 'bg-rose-950/80 ring-1 ring-rose-800/60',
        iconColor: 'text-rose-400 group-hover:text-rose-300',
        titleColor: 'text-rose-200 group-hover:text-rose-100',
        footerColor: 'text-rose-600 group-hover:text-rose-400',
        glowBar: 'bg-gradient-to-r from-transparent via-rose-500/60 to-transparent',
    },
    sky: {
        border: 'border-sky-900/60 hover:border-sky-500/50',
        glowBlob: 'bg-sky-400',
        glowColor: '#38bdf8',
        svgFill: '#38bdf8',
        iconBg: 'bg-sky-950/80 ring-1 ring-sky-800/60',
        iconColor: 'text-sky-400 group-hover:text-sky-300',
        titleColor: 'text-sky-200 group-hover:text-sky-100',
        footerColor: 'text-sky-600 group-hover:text-sky-400',
        glowBar: 'bg-gradient-to-r from-transparent via-sky-500/60 to-transparent',
    },
    orange: {
        border: 'border-orange-900/60 hover:border-orange-500/50',
        glowBlob: 'bg-orange-400',
        glowColor: '#fb923c',
        svgFill: '#fb923c',
        iconBg: 'bg-orange-950/80 ring-1 ring-orange-800/60',
        iconColor: 'text-orange-400 group-hover:text-orange-300',
        titleColor: 'text-orange-200 group-hover:text-orange-100',
        footerColor: 'text-orange-600 group-hover:text-orange-400',
        glowBar: 'bg-gradient-to-r from-transparent via-orange-500/60 to-transparent',
    },
    emerald: {
        border: 'border-emerald-900/60 hover:border-emerald-500/50',
        glowBlob: 'bg-emerald-400',
        glowColor: '#34d399',
        svgFill: '#34d399',
        iconBg: 'bg-emerald-950/80 ring-1 ring-emerald-800/60',
        iconColor: 'text-emerald-400 group-hover:text-emerald-300',
        titleColor: 'text-emerald-200 group-hover:text-emerald-100',
        footerColor: 'text-emerald-600 group-hover:text-emerald-400',
        glowBar: 'bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent',
    },
}

const accentConfig = computed(() => ACCENT_MAP[props.accent] ?? ACCENT_MAP.lime)

const resolvedTag = computed(() => {
    if (props.link && !props.disabled) return 'RouterLink'
    return 'div'
})

const routerTo = computed(() => {
    if (props.link && !props.disabled) return props.link
    return undefined
})

const badgesToRender = computed(() => {
    if (props.badges?.length) return props.badges
    if (props.badge) return [props.badge]
    return []
})

function getBadgeClass(badge) {
    const label = typeof badge === 'string' ? badge : badge.label
    switch (label) {
        case 'New!': return 'bg-lime-500/20 text-lime-300 border-lime-400/40'
        case 'Coming Soon': return 'bg-stone-700/50 text-stone-400 border-stone-600/40'
        case 'Removed': return 'bg-red-900/40 text-red-400 border-red-600/30'
        case 'Too Real': return 'bg-rose-900/40 text-rose-300 border-rose-500/30'
        case 'Phase 2': return 'bg-sky-900/40 text-sky-300 border-sky-500/30'
        case 'Shame': return 'bg-pink-900/40 text-pink-300 border-pink-500/30'
        case 'Private': return 'bg-violet-900/40 text-violet-300 border-violet-500/30'
        default: return 'bg-stone-700/40 text-stone-300 border-stone-500/30'
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');

.gnaw-title {
    font-family: 'Outfit', sans-serif;
}

.gnaw-surface {
    background: linear-gradient(135deg, #0c110a 0%, #111a0e 50%, #0e1509 100%);
}

.gnaw-grain::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
    opacity: 0.35;
    pointer-events: none;
    border-radius: inherit;
}

.gnaw-shimmer {
    background: linear-gradient(
        135deg,
        transparent 0%,
        rgba(255, 255, 255, 0.015) 50%,
        transparent 100%
    );
}

.gnaw-active:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.gnaw-dormant {
    background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
}

.gnaw-badge-glow {
    animation: badge-pulse 2.5s ease-in-out infinite;
    --badge-glow: #a3e635;
}

@keyframes badge-pulse {
    0%, 100% { box-shadow: 0 0 4px var(--badge-glow), 0 0 8px var(--badge-glow, #a3e63540); }
    50% { box-shadow: 0 0 8px var(--badge-glow), 0 0 16px var(--badge-glow, #a3e63530); }
}
</style>