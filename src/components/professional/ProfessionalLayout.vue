<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">

    <!-- Mobile overlay -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="mobileMenuOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'professional-sidebar border-r border-gray-200 dark:border-gray-700 flex flex-col h-full flex-shrink-0 z-50',
        'fixed lg:relative inset-y-0 left-0 w-64',
        'transform transition-transform duration-200 ease-in-out',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo/Brand -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <router-link to="/professional" class="flex items-center gap-2" @click="mobileMenuOpen = false">
          <Briefcase :size="22" class="text-blue-400" />
          <h1 class="text-lg font-bold text-white">Professional</h1>
        </router-link>
        <button
          class="lg:hidden text-gray-400 hover:text-white p-1"
          @click="mobileMenuOpen = false"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <router-link
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="professional-nav-item flex items-center gap-3"
          :class="{ 'active': isActive(item.path) }"
          @click="mobileMenuOpen = false"
        >
          <component :is="item.icon" :size="19" />
          <span class="flex-1">{{ item.name }}</span>
          <span
            v-if="item.badgeCount > 0"
            class="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium"
          >
            {{ item.badgeCount }}
          </span>
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userEmail }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Mobile header bar -->
      <header class="lg:hidden h-14 flex items-center gap-3 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <button
          class="p-1.5 -ml-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="mobileMenuOpen = true"
        >
          <Menu :size="22" />
        </button>
        <h2 class="text-base font-semibold text-gray-900 dark:text-white truncate">
          {{ currentPageTitle }}
        </h2>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import {
  Home,
  Building2,
  Users,
  FolderKanban,
  Receipt,
  Package,
  FileText,
  CreditCard,
  Settings,
  Briefcase,
  Menu,
  X
} from 'lucide-vue-next'

const route = useRoute()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()

const mobileMenuOpen = ref(false)

// Close mobile menu on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const navigation = computed(() => [
  { name: 'Dashboard', path: '/professional/home', icon: Home, badgeCount: 0 },
  { name: 'Company', path: '/professional/company', icon: Building2, badgeCount: 0 },
  { name: 'Contacts', path: '/professional/contacts', icon: Users, badgeCount: 0 },
  { name: 'Jobs', path: '/professional/jobs', icon: FolderKanban, badgeCount: professionalStore.stats.activeJobs || 0 },
  { name: 'Expenses', path: '/professional/expenses', icon: Receipt, badgeCount: 0 },
  { name: 'Catalogue', path: '/professional/catalogue', icon: Package, badgeCount: 0 },
  { name: 'Invoices', path: '/professional/invoices', icon: FileText, badgeCount: (professionalStore.stats.pendingInvoices || 0) + (professionalStore.stats.overdueInvoices || 0) },
  { name: 'Payments', path: '/professional/payments', icon: CreditCard, badgeCount: 0 },
  { name: 'Settings', path: '/professional/settings', icon: Settings, badgeCount: 0 },
])

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const currentPageTitle = computed(() => {
  return route.meta?.title || 'Professional'
})

const userName = computed(() => mainStore.user?.displayName || mainStore.user?.email || 'User')
const userEmail = computed(() => mainStore.user?.email || '')
const userInitials = computed(() => {
  const name = userName.value
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

onMounted(() => {
  professionalStore.applyTheme()
})
</script>

<style>
/* Global styles for professional module */
.professional-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
}
:root.dark .professional-card,
.dark .professional-card {
  background: #1f2937;
  border-color: #374151;
}
.btn-professional-primary {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #2563eb;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease;
}
.btn-professional-primary:hover {
  background-color: #1d4ed8;
}
.professional-nav-item {
  display: flex;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  transition: all 0.15s ease;
  text-decoration: none;
}
.professional-nav-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}
.professional-nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}
.dark .professional-nav-item {
  color: #9ca3af;
}
.dark .professional-nav-item:hover {
  background-color: #1f2937;
  color: #f3f4f6;
}
.dark .professional-nav-item.active {
  background-color: rgba(37, 99, 235, 0.15);
  color: #60a5fa;
}

/* Dark mode overrides for shadcn/vue Input component */
.dark input[type="text"],
.dark input[type="email"],
.dark input[type="number"],
.dark input[type="tel"],
.dark input[type="url"],
.dark input[type="date"],
.dark input[type="password"],
.dark input[type="search"],
.dark textarea,
.dark select {
  color: #f3f4f6 !important;
  background-color: #374151 !important;
  border-color: #4b5563 !important;
}
.dark input::placeholder,
.dark textarea::placeholder {
  color: #6b7280 !important;
}
/* shadcn Input component specific override */
.dark [data-slot="input"],
.dark .bg-transparent {
  color: #f3f4f6 !important;
}
/* Checkbox stays as-is */
.dark input[type="checkbox"] {
  background-color: transparent !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>