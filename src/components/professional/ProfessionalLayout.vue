<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Sidebar -->
    <aside
      class="w-64 professional-sidebar border-r border-gray-200 dark:border-gray-700 flex flex-col h-full flex-shrink-0">
      <!-- Logo/Brand -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <router-link to="/professional" class="flex items-center gap-2">
          <Briefcase :size="24" class="text-blue-600" />
          <h1 class="text-xl font-bold text-white">Professional</h1>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link v-for="item in navigation" :key="item.path" :to="item.path"
          class="professional-nav-item flex items-center gap-3" :class="{ 'active': isActive(item.path) }">
          <component :is="item.icon" :size="20" />
          <span>{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userEmail }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import {
  Home,
  Building2,
  Users,
  FileText,
  Settings,
  Briefcase
} from 'lucide-vue-next'

const route = useRoute()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()

const navigation = [
  { name: 'Dashboard', path: '/professional/home', icon: Home },
  { name: 'Company', path: '/professional/company', icon: Building2 },
  { name: 'Contacts', path: '/professional/contacts', icon: Users },
  { name: 'Invoices', path: '/professional/invoices', icon: FileText },
  { name: 'Settings', path: '/professional/settings', icon: Settings },
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

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
  // Apply theme on mount
  professionalStore.applyTheme()
})
</script>