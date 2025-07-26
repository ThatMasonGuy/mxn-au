<!-- @/pages/topheroes/admin/TH_AdminHome.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header with Logout button -->
    <header class="flex items-center justify-between p-4 bg-white shadow">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>
      <Button @click="handleLogout" variant="outline">Logout</Button>
    </header>

    <!-- Main content area with navigation tiles -->
    <main class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <NavCard @click="navigateTo('/topheroes/admin/castle-data')" :image="castleDataImage" title="Castle Data"
          text="View and manage castle data" />
        <NavCard @click="navigateTo('/topheroes/admin/excalidraw')" :image="excalidrawImage" title="Excalidraw"
          text="Open Excalidraw board" />
        <NavCard @click="navigateTo('/topheroes/admin/kanban')" :image="kanbanImage" title="KanBan"
          text="Manage tasks on your Kanban board" />
        <NavCard @click="navigateTo('/topheroes/admin/settings')" :image="settingsImage" title="Settings"
          text="Configure your admin settings" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useMainStore } from '@/stores/useMainStore'
import { signOut } from '@/auth'
import router from '@/router'
import NavCard from '@/components/topheroes/ToolCard.vue'
import { Button } from '@/components/ui/button'

// Import images
import castleDataImage from '@/assets/images/topHeroes/admin/CastleData.jpg'
import excalidrawImage from '@/assets/images/topHeroes/admin/Excalidraw.jpg'
import kanbanImage from '@/assets/images/topHeroes/admin/Kanban.jpg'
import settingsImage from '@/assets/images/topHeroes/admin/Settings.jpg'

const mainStore = useMainStore()

// Navigate to the specified path
const navigateTo = (path) => {
  router.push(path)
}

// Handle logout
const handleLogout = async () => {
  try {
    await signOut()
    mainStore.clearAuth()
    router.push('/login')
  } catch (error) {
    console.error('[handleLogout] Error during logout:', error)
  }
}
</script>
