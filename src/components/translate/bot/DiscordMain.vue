<!-- DiscordMain.vue -->
<template>
    <div class="min-h-screen translate-gradient-bg text-foreground">
        <!-- Authentication Flow (Full Screen) -->
        <div v-if="!store.isAuthenticated" class="min-h-screen">
            <Authentication @authenticated="handleAuthentication" />
        </div>

        <!-- Server Selection (Full Screen) -->
        <div v-else-if="!store.isServerSelected" class="min-h-screen">
            <ServerSelection @server-selected="handleServerSelection" />
        </div>

        <!-- Bot Not Added (Full Screen) -->
        <div v-else-if="!store.isBotInSelectedServer" class="min-h-screen">
            <BotInvitation @bot-added="handleBotAdded" />
        </div>

        <!-- Main Dashboard Layout -->
        <div v-else>
            <DiscordHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <div class="flex">
                <DiscordSidebar :mobile-open="sidebarOpen" :active-view="activeView" :collapsed="sidebarCollapsed"
                    @navigate="handleNavigation" @close-mobile="sidebarOpen = false"
                    @toggle-collapse="handleSidebarCollapse" />

                <!-- Main Content Area -->
                <main class="flex-1 min-h-[calc(100dvh-4rem)] p-4 lg:p-6">
                    <div class="mx-auto w-full max-w-[110rem]">
                        <!-- Loading State -->
                        <transition name="fade" mode="out-in">
                            <div v-if="loading" class="space-y-6">
                                <DiscordLoadingSpinner />
                            </div>
                            <!-- Dynamic Component -->
                            <component v-else :is="currentComponent" :key="activeView" class="animate-fade-in" />
                        </transition>
                    </div>
                </main>
            </div>
        </div>

        <!-- Noise Overlay -->
        <div class="translate-noise-overlay"></div>
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent, nextTick, onMounted, watch } from 'vue'
import DiscordHeader from './DiscordHeader.vue'
import DiscordSidebar from './DiscordSidebar.vue'
import DiscordLoadingSpinner from './DiscordLoadingSpinner.vue'
import { useDiscordBotStore } from '@/stores/useDiscordBotStore'

const store = useDiscordBotStore()

// Authentication and setup components (no lazy loading since they're initial flow)
import Authentication from './pages/Authentication.vue'
import ServerSelection from './pages/ServerSelection.vue'
import BotInvitation from './pages/BotInvitation.vue'

// Lazy loaded dashboard components
const Dashboard = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Dashboard.vue')), 300)
    })
)

const TranslationSettings = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/TranslationSettings.vue')), 400)
    })
)

const ReactionRoles = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/ReactionRoles.vue')), 450)
    })
)

const Analytics = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Analytics.vue')), 500)
    })
)

const Settings = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/Settings.vue')), 400)
    })
)

const ServerAnalytics = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/ServerAnalytics.vue')), 550)
    })
)

const BotConfiguration = defineAsyncComponent(() =>
    new Promise(resolve => {
        setTimeout(() => resolve(import('./views/BotConfiguration.vue')), 350)
    })
)

const componentMap = {
    'dashboard': Dashboard,
    'translation': TranslationSettings,
    'reaction-roles': ReactionRoles,
    'analytics': Analytics,
    'server-analytics': ServerAnalytics,
    'settings': Settings,
    'config': BotConfiguration,
}

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const activeView = ref('dashboard')
const loading = ref(false)

const currentComponent = computed(() => {
    return componentMap[activeView.value] || Dashboard
})

// Event handlers for the authentication flow
const handleAuthentication = () => {
    // Authentication successful, store will handle state updates
    console.log('Authentication successful')
}

const handleServerSelection = (server) => {
    store.setSelectedServer(server)
    console.log('Server selected:', server.name)
}

const handleBotAdded = () => {
    // Bot successfully added to server
    console.log('Bot added to server')
}

async function handleNavigation(view) {
    if (activeView.value === view) return

    // Validate navigation based on current state
    if (!store.availableViews.includes(view)) {
        console.warn(`Navigation to ${view} not allowed in current state`)
        return
    }

    loading.value = true
    sidebarOpen.value = false

    await nextTick()

    activeView.value = view
    store.navigate(view)

    setTimeout(() => {
        loading.value = false
    }, 200)
}

function handleSidebarCollapse(collapsed) {
    sidebarCollapsed.value = collapsed
    store.sidebarExpanded = !collapsed
    store.savePreferences()
}

// Watch for store state changes that should trigger navigation
watch(() => store.currentView, (newView) => {
    if (newView && newView !== activeView.value) {
        activeView.value = newView
    }
})

// Watch for authentication state changes
watch(() => store.isAuthenticated, (isAuth) => {
    if (!isAuth) {
        activeView.value = 'dashboard'
        sidebarOpen.value = false
    }
})

// Watch for server selection changes
watch(() => store.selectedServer, (server) => {
    if (server && store.isBotInSelectedServer) {
        // If we have a server and bot is added, navigate to dashboard
        if (activeView.value === 'config') {
            activeView.value = 'dashboard'
        }
    }
})

onMounted(() => {
    // Initialize store
    store.init()

    // Set initial sidebar state
    sidebarCollapsed.value = !store.sidebarExpanded

    // Set initial view based on store state
    if (store.isAuthenticated && store.isServerSelected && store.isBotInSelectedServer) {
        activeView.value = store.currentView || 'dashboard'
    }
})
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Animate fade in for components */
.animate-fade-in {
    animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>