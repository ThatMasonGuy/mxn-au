<!-- src/App.vue -->
<template>
  <div id="app" class="flex flex-col min-h-screen">
    <TooltipProvider>
      <TopHeroesHeader v-if="$route.meta.requiresTHOverlay" />
      <TopHeroesAdminHeader v-if="$route.meta.requiresTHAdminOverlay" />
      <Toaster position="bottom-right" richColors />
      <div class="flex-grow flex flex-col">
        <router-view class="flex-grow" />
      </div>
      <TopHeroesFooter v-if="$route.meta.requiresTHOverlay" />
      <TopHeroesAdminFooter v-if="$route.meta.requiresTHAdminOverlay" />
    </TooltipProvider>
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import TopHeroesHeader from '@/components/topHeroes/TopHeroesHeader.vue';
import TopHeroesFooter from '@/components/topHeroes/TopHeroesFooter.vue';
import TopHeroesAdminHeader from '@/components/topHeroes/admin/TopHeroesAdminHeader.vue';
import TopHeroesAdminFooter from '@/components/topHeroes/admin/TopHeroesAdminFooter.vue';

</script>

<style>
#app {
  min-height: 100vh;
}
</style>