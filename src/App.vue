<template>
  <div id="app" class="flex flex-col min-h-screen bg-black text-white relative scroll-smooth">
    <TooltipProvider>

      <!-- Headers -->
      <TopHeroesHeader v-if="isTopHeroes && layout === 'default'" />
      <TopHeroesAdminHeader v-else-if="isTopHeroes && layout === 'admin'" />

      <Toaster position="bottom-right" richColors />

      <!-- Page Content -->
      <div class="flex-grow flex flex-col">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.fullPath" ref="pageRef" class="flex-grow min-h-screen flex flex-col"
            :class="{
              'pt-28 pb-32': isTopHeroes && (layout === 'default' || layout === 'admin')
            }" />
        </router-view>
      </div>

      <!-- Footers -->
      <TopHeroesFooter v-if="isTopHeroes && layout === 'default'" :author="pageAuthor" />
      <TopHeroesAdminFooter v-else-if="isTopHeroes && layout === 'admin'" :author="pageAuthor" />

    </TooltipProvider>
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import TopHeroesHeader from '@/components/topHeroes/TopHeroesHeader.vue'
import TopHeroesFooter from '@/components/topHeroes/TopHeroesFooter.vue'
import TopHeroesAdminHeader from '@/components/topHeroes/admin/TopHeroesAdminHeader.vue'
import TopHeroesAdminFooter from '@/components/topHeroes/admin/TopHeroesAdminFooter.vue'
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageRef = ref(null)
const pageAuthor = ref('[VLR]Mason in s10154')

// Dynamic author pulling
watchEffect(() => {
  const exposed = pageRef.value?.exposed || pageRef.value
  pageAuthor.value = exposed?.author || '[VLR]Mason in s10154'
})

// Computed layout from meta
const layout = computed(() => route.meta?.layout || 'default')

// Check if current route is under /topheroes
const isTopHeroes = computed(() => route.path.startsWith('/topheroes'))
</script>

<style>
#app {
  min-height: 100vh;
  background-color: black;
}
</style>
