<!-- TopHeroes Sidebar.vue -->
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
            <SidebarItem v-for="item in contentItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />
            <div :class="collapsed ? 'my-4 h-px bg-border/80 w-6' : 'my-3 h-px bg-border/60'"></div>
            <SidebarItem v-for="item in systemItems" :key="item.key" :icon="item.icon" :label="item.label"
                :active="activeView === item.key" :collapsed="collapsed" @click="$emit('navigate', item.key)" />
        </nav>

        <div :class="collapsed ? 'px-0 pb-3 mt-4' : 'p-3'">
            <!-- New Guide: text in expanded, plus icon in collapsed -->
            <button v-if="!collapsed"
                class="w-full rounded-lg bg-th-primary px-3 py-2 text-sm text-white hover:bg-th-secondary transition shadow-[0_0_24px_hsl(214_88%_41%/0.25)]">
                New Guide
            </button>
            <button v-else
                class="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-th-primary hover:bg-th-secondary transition shadow-[0_0_24px_hsl(214_88%_41%/0.25)]"
                aria-label="New Guide">
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
                    <div class="flex items-center gap-3">
                        <div class="h-6 w-6 rounded-full bg-th-primary/20 flex items-center justify-center">
                            <Shield class="h-3 w-3 text-th-primary" />
                        </div>
                        <span class="text-sm font-semibold">TopHeroes Admin</span>
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
                    <SidebarItem v-for="item in contentItems" :key="item.key" :icon="item.icon" :label="item.label"
                        :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />
                    <div class="my-3 h-px bg-border/60"></div>
                    <SidebarItem v-for="item in systemItems" :key="item.key" :icon="item.icon" :label="item.label"
                        :active="activeView === item.key" @click="handleMobileNavigate(item.key)" />
                </nav>
                <div class="pt-3">
                    <button
                        class="w-full rounded-lg bg-th-primary px-3 py-2 text-sm text-white hover:bg-th-secondary transition shadow-[0_0_24px_hsl(214_88%_41%/0.25)]">
                        New Guide
                    </button>
                </div>
            </aside>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue'
import SidebarItem from './SidebarItem.vue'
import {
    LayoutDashboard, BookOpen, Users, Calendar, BarChart3, Settings,
    ChevronLeft, ChevronRight, X, Plus, Shield, Clock,
    FileText, Zap, TrendingUp, Database
} from 'lucide-vue-next'

const props = defineProps({
    mobileOpen: { type: Boolean, default: false },
    activeView: { type: String, default: 'dashboard' },
    collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['navigate', 'close-mobile', 'toggle-collapse'])

const navigationItems = computed(() => [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'analytics', icon: TrendingUp, label: 'Analytics' },
])

const contentItems = computed(() => [
    { key: 'guides', icon: BookOpen, label: 'Guides' },
    { key: 'heroes', icon: Users, label: 'Heroes' },
    { key: 'events', icon: Calendar, label: 'Events' },
    { key: 'schedules', icon: Clock, label: 'Schedules' },
    { key: 'resources', icon: Database, label: 'Resources' }
])

const systemItems = computed(() => [
    { key: 'settings', icon: Settings, label: 'Settings' },
    { key: 'audit-log', icon: FileText, label: 'Audit Log' },
])

function toggleCollapse() {
    emit('toggle-collapse', !props.collapsed)
}

function handleMobileNavigate(key) {
    emit('navigate', key)
    emit('close-mobile')
}
</script>