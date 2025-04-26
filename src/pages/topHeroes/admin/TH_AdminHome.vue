<!-- @/pages/topHeroes/admin/TH_AdminHome.vue -->
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
          <NavCard
            @click="navigateTo('/topheroes/admin/castle-data')"
            :image="castleDataImage"
            title="Castle Data"
            text="View and manage castle data"
          />
          <NavCard
            @click="navigateTo('/topheroes/admin/excalidraw')"
            :image="excalidrawImage"
            title="Excalidraw"
            text="Open Excalidraw board"
          />
          <NavCard
            @click="navigateTo('/topheroes/admin/kanban')"
            :image="kanbanImage"
            title="KanBan"
            text="Manage tasks on your Kanban board"
          />
          <NavCard
            @click="navigateTo('/topheroes/admin/settings')"
            :image="settingsImage"
            title="Settings"
            text="Configure your admin settings"
          />
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import router from '@/router';
  import { signOut } from '@/auth'; // Make sure signOut is implemented in auth.js
  import NavCard from '@/archived/NavCard.vue';
  import { Button } from '@/components/ui/button';
  
  // Import images (update the paths if your assets are located elsewhere)
  import castleDataImage from '@/assets/images/topHeroes/admin/CastleData.jpg';
  import excalidrawImage from '@/assets/images/topHeroes/admin/Excalidraw.jpg';
  import kanbanImage from '@/assets/images/topHeroes/admin/Kanban.jpg';
  import settingsImage from '@/assets/images/topHeroes/admin/Settings.jpg';
  
  // Navigate to the specified path
  const navigateTo = (path) => {
    router.push(path);
  };
  
  // Handle logout by calling the signOut function,
  // clearing storage, and redirecting to the sign-in page.
  const handleLogout = async () => {
    try {
      await signOut();
      // Clear stored auth tokens/user info (if not already handled in signOut)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      router.push('/topheroes/admin/signin');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  </script>
  