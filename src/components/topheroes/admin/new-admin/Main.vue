<!-- TopHeroes Main.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground theme-topheroes">
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
import { useTopHeroesAdminStore } from '@/stores/useTopHeroesAdminStore'

const store = useTopHeroesAdminStore()

const Dashboard = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Dashboard.vue')), 0)
    })
)

const Guides = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Guides.vue')), 0)
    })
)

const Heroes = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Heroes.vue')), 0)
    })
)

const Events = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Events.vue')), 0)
    })
)

const Schedules = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Schedules.vue')), 0)
    })
)

const Resources = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Resources.vue')), 0)
    })
)

const Analytics = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Analytics.vue')), 0)
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

const componentMap = {
    'dashboard': Dashboard,
    'guides': Guides,
    'heroes': Heroes,
    'events': Events,
    'schedules': Schedules,
    'resources': Resources,
    'analytics': Analytics,
    'settings': Settings,
    'audit-log': AuditLog
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
        store.setSidebarExpanded(!collapsed)
    }
}

onMounted(() => {
    store.init()
    sidebarCollapsed.value = !store.settings.sidebarExpanded

    // Apply theme properly
    if (store.settings.theme === 'topheroes') {
        document.documentElement.className = 'theme-topheroes'
    } else if (store.settings.theme === 'froggy') {
        document.documentElement.className = 'froggy theme-velaris'
    } else {
        document.documentElement.className = 'theme-velaris'
    }
    
    if (store.settings.isDark) {
        document.documentElement.classList.add('dark')
    }
})
</script>

<style scoped>
/* Component-specific styles if needed */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>