<!-- Sidebar.vue -->
<template>
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block border-r border-border bg-card sticky top-16 h-[calc(100dvh-4rem)]">
        <div
            :class="collapsed ? 'flex items-center justify-center px-1 py-3' : 'flex items-center justify-between p-3'">
            <span class="text-xs uppercase tracking-wide text-foreground/50" v-if="!collapsed">
                Navigation
            </span>
            <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-border/60 hover:bg-foreground/5 transition"
                aria-label="Collapse sidebar" @click="toggleCollapse">
                <component :is="collapsed ? ChevronRight : ChevronLeft" class="h-5 w-5 text-foreground/70" />
            </button>
        </div>

        <nav :class="collapsed ? 'px-1 pt-0 space-y-1 flex flex-col items-center' : 'p-3 pt-0 space-y-1'">
            <SidebarItem v-for="item in navigationItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />
            <div :class="collapsed ? 'my-4 h-px bg-border/80 w-6' : 'my-3 h-px bg-border/60'"></div>
            <SidebarItem v-for="item in settingsItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />
        </nav>

        <div :class="collapsed ? 'px-0 pb-3 mt-4' : 'p-3'">
            <!-- New Report: text in expanded, plus icon in collapsed -->
            <button v-if="!collapsed"
                class="w-full rounded-lg bg-velaris-purple px-3 py-2 text-sm text-white hover:bg-velaris-teal transition shadow-[0_0_24px_hsl(var(--velaris-purple)/0.35)]">
                New Report
            </button>
            <button v-else
                class="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-velaris-purple hover:bg-velaris-teal transition shadow-[0_0_24px_hsl(var(--velaris-purple)/0.35)]"
                aria-label="New Report">
                <Plus class="h-5 w-5 text-white" />
            </button>
        </div>
    </aside>

    <!-- Mobile Off-canvas sidebar -->
    <transition name="fade">
        <div v-if="mobileOpen" class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/50" @click="$emit('close-mobile')"></div>
            <aside class="absolute inset-y-0 left-0 w-72 border-r border-border bg-card p-3 shadow-2xl">
                <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <img :src="VLR" alt="VLR" class="h-6 w-6" style="filter: brightness(0) invert(1)" />
                        <span class="text-sm font-semibold">Velaris</span>
                    </div>
                    <button
                        class="inline-flex h-8 w-8 items-center justify-center rounded-md ring-1 ring-border/60 hover:bg-foreground/5"
                        @click="$emit('close-mobile')">
                        <X class="h-4 w-4" />
                    </button>
                </div>
                <nav class="space-y-1">
                    <SidebarItem v-for="item in navigationItems" :key="item.key" :icon="item.icon" :label="item.label"
                        :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />
                    <div class="my-3 h-px bg-border/60"></div>
                    <SidebarItem v-for="item in settingsItems" :key="item.key" :icon="item.icon" :label="item.label"
                        :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />
                </nav>
                <div class="pt-3">
                    <button
                        class="w-full rounded-lg bg-velaris-purple px-3 py-2 text-sm text-white hover:bg-velaris-teal transition shadow-[0_0_24px_hsl(var(--velaris-purple)/0.35)]">
                        New Report
                    </button>
                </div>
            </aside>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue'
import SidebarItem from './SidebarItem.vue'
import VLR from '@/assets/icons/VLR.svg'
import {
    Users, ActivitySquare, Shield, Trophy, Settings, FileText,
    LayoutDashboard, ChevronLeft, ChevronRight, X, Plus, Clock,
    Calendar, Swords
} from 'lucide-vue-next'

const props = defineProps({
    mobileOpen: { type: Boolean, default: false },
    activeView: { type: String, default: 'dashboard' },
    collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate', 'close-mobile', 'toggle-collapse'])

const navigationItems = computed(() => [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'members', icon: Users, label: 'Members' },
    { key: 'events', icon: ActivitySquare, label: 'Events' },
    { key: 'guild-vs-guild', icon: Shield, label: 'Guild vs Guild' },
    { key: 'rankings', icon: Trophy, label: 'Rankings' },
    { key: 'time', icon: Clock, label: 'Time' },
    { key: 'calendar', icon: Calendar, label: 'Calendar' },
    { key: 'heroes', icon: Swords, label: 'Heroes' }
])

const settingsItems = computed(() => [
    { key: 'settings', icon: Settings, label: 'Settings' },
    { key: 'audit-log', icon: FileText, label: 'Audit Log' },
])

function toggleCollapse() {
    // Emit the toggle event with the new state
    emit('toggle-collapse', !props.collapsed)
}

function handleMobileNavigate(key) {
    emit('navigate', key)
    emit('close-mobile')
}
</script>