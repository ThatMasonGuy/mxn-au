<template>
  <div id="app" class="flex flex-col bg-black text-white relative scroll-smooth">
    <TooltipProvider>

      <!-- Headers (TopHeroes only when overlay is required) -->
      <TopHeroesHeader v-if="showTopHeroesOverlay && layout === 'default'" />
      <TopHeroesAdminHeader v-else-if="showTopHeroesOverlay && layout === 'admin'" />

      <Toaster />

      <!-- Page Content -->
      <div class="flex-grow">
        <router-view v-slot="{ Component, route }">
          <!-- Professional Layout Wrapper -->
          <ProfessionalLayout v-if="layout === 'professional'">
            <component :is="Component" :key="route.fullPath" ref="pageRef" />
          </ProfessionalLayout>

          <!-- Default Rendering -->
          <component v-else :is="Component" :key="route.fullPath" ref="pageRef" class="min-h-screen w-full" :class="{
            'pt-28 pb-32': showTopHeroesOverlay && (layout === 'default' || layout === 'admin')
          }" />
        </router-view>
      </div>

      <!-- Footers (TopHeroes only when overlay is required) -->
      <TopHeroesFooter v-if="showTopHeroesOverlay && layout === 'default'" :author="pageAuthor" />
      <TopHeroesAdminFooter v-else-if="showTopHeroesOverlay && layout === 'admin'" :author="pageAuthor" />

    </TooltipProvider>
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ref, computed, watchEffect, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

// Lazy load layout components - only load when actually needed!
const TopHeroesHeader = defineAsyncComponent(() => 
  import('@/components/topheroes/TopHeroesHeader.vue')
)
const TopHeroesFooter = defineAsyncComponent(() => 
  import('@/components/topheroes/TopHeroesFooter.vue')
)
const TopHeroesAdminHeader = defineAsyncComponent(() => 
  import('@/components/topheroes/admin/TopHeroesAdminHeader.vue')
)
const TopHeroesAdminFooter = defineAsyncComponent(() => 
  import('@/components/topheroes/admin/TopHeroesAdminFooter.vue')
)
const ProfessionalLayout = defineAsyncComponent(() => 
  import('@/components/professional/ProfessionalLayout.vue')
)

const route = useRoute()
const pageRef = ref(null)
const pageAuthor = ref('[VLR]Mason in s10154')

// Dynamic author pulling
watchEffect(() => {
  const exposed = pageRef.value?.exposed || pageRef.value
  pageAuthor.value = exposed?.author || '[VLR]Mason in s10154'
})

// Layout from meta (defaults to 'default')
const layout = computed(() => route.meta?.layout || 'default')

// Route must be under /topheroes
const isTopHeroes = computed(() => route.path?.startsWith('/topheroes'))

// Only show TopHeroes header/footer if path starts with /topheroes AND the page opts into the overlay
const showTopHeroesOverlay = computed(() => {
  return isTopHeroes.value && route.meta?.requiresOverlay === true
})
</script>

<style>
#app,
html,
body {
  min-height: 100dvh;
  background-color: black;
}
</style>