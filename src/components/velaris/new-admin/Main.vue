<!-- Main.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <Header @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <div class="grid grid-cols-1 lg:[grid-template-columns:var(--sidebar,260px)_1fr]"
            :style="{ '--sidebar': sidebarCollapsed ? '72px' : '260px' }">

            <Sidebar :mobile-open="sidebarOpen" :active-view="activeView" :collapsed="sidebarCollapsed"
                @navigate="handleNavigation" @close-mobile="sidebarOpen = false"
                @toggle-collapse="handleSidebarCollapse" />

            <!-- Main Content Area -->
            <main class="min-h-[calc(100dvh-4rem)] p-4 lg:p-6">
                <div class="mx-auto w-full max-w-[110rem]">
                    <!-- Loading State -->
                    <transition name="fade" mode="out-in">
                        <div v-if="loading" class="space-y-6">
                            <LoadingSpinner />
                        </div>
                        <!-- Dynamic Component -->
                        <component v-else :is="currentComponent" :key="activeView" class="animate-fade-in" />
                    </transition>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, nextTick, onMounted } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { useTopheroesAdminStore } from '@/stores/topheroesAdmin/useTopheroesAdminStore'

const store = useTopheroesAdminStore()

const Dashboard = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Dashboard.vue')), 0)
    })
)

const Members = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Members.vue')), 0)
    })
)

const Events = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Events.vue')), 0)
    })
)

const GuildVsGuild = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/GuildVsGuild.vue')), 0)
    })
)

const Rankings = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Rankings.vue')), 0)
    })
)

const Settings = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Settings.vue')), 0)
    })
)

const AuditLog = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/AuditLog.vue')), 0) // Heaviest component
    })
)

const Time = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Time.vue')), 0)
    })
)

const Calendar = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Calendar.vue')), 0)
    })
)

const Heroes = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Heroes.vue')), 0)
    })
)

const componentMap = {
    'dashboard': Dashboard,
    'members': Members,
    'events': Events,
    'guild-vs-guild': GuildVsGuild,
    'rankings': Rankings,
    'settings': Settings,
    'audit-log': AuditLog,
    'time': Time,
    'calendar': Calendar,
    'heroes': Heroes
}

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const activeView = ref('dashboard')
const loading = ref(false)

const currentComponent = computed(() => {
    return componentMap[activeView.value] || Dashboard
})

async function handleNavigation(view) {
    if (activeView.value === view) return

    loading.value = true
    sidebarOpen.value = false

    await nextTick()

    activeView.value = view

    setTimeout(() => {
        loading.value = false
    }, 200)
}

function handleSidebarCollapse(collapsed) {
    sidebarCollapsed.value = collapsed
    if (store) {
        store.sidebarExpanded = !collapsed
    }
}

onMounted(() => {
    store.init()
    sidebarCollapsed.value = !store.sidebarExpanded
})
</script>