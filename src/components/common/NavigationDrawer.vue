<template>
    <Sheet>
        <SheetTrigger as-child>
            <button class="text-white hover:text-indigo-400 transition sm:hidden" aria-label="Open Navigation">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </SheetTrigger>
        <SheetContent side="right"
            class="w-80 h-full bg-gradient-to-bl from-gray-800 via-gray-900 to-black text-white flex flex-col justify-between p-4 shadow-2xl border-l border-white/10">
            <div>
                <SheetHeader>
                    <SheetTitle class="text-lg font-bold text-white mb-4">TopHeroes Navigation</SheetTitle>
                </SheetHeader>
                <div class="pt-6 border-t border-white/10">
                </div>

                <nav class="space-y-4">
                    <div>
                        <RouterLink to="/topheroes"
                            class="block px-3 py-2 rounded-lg bg-white/5 text-white/90 font-medium shadow-inner">
                            🏠 Home
                        </RouterLink>
                    </div>

                    <div v-for="group in sortedRouteGroups" :key="group.label" class="space-y-2">
                        <div>
                            <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                                <RouterLink :to="group.root.path" class="w-4/5 text-left text-white font-semibold">
                                    {{ group.label }}
                                </RouterLink>
                                <button v-if="group.children.length" @click="toggleGroup(group.label)"
                                    class="w-1/5 text-sm text-gray-400 hover:text-white ml-2 text-right">
                                    ▼
                                </button>
                            </div>
                            <div v-if="expandedGroups.includes(group.label)" class="ml-4 mt-2 space-y-1">
                                <RouterLink v-for="child in group.children" :key="child.path" :to="child.path"
                                    class="block px-2 py-1 rounded-md bg-white/5 text-white/80">
                                    {{ child.meta.title }}
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Drawer Footer -->
            <div class="pt-6 border-t border-white/10 mt-4">
                <RouterLink to="/topheroes/admin/signin"
                    class="flex items-center gap-2 text-white px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 font-semibold shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.121 17.804A9 9 0 1119.88 6.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Admin Login
                </RouterLink>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const router = useRouter()
const expandedGroups = ref([])

const toggleGroup = (label) => {
    if (expandedGroups.value.includes(label)) {
        expandedGroups.value = expandedGroups.value.filter(l => l !== label)
    } else {
        expandedGroups.value.push(label)
    }
}

const sortedRouteGroups = computed(() => {
    const all = router.getRoutes().filter(r =>
        r.path.startsWith('/topheroes') &&
        r.meta?.title &&
        r.meta?.drawerVisible !== false &&
        !r.path.includes(':') &&
        !Array.isArray(r.alias) &&
        typeof r.alias !== 'string'
    )

    const groups = {}

    all.forEach(route => {
        const segments = route.path.split('/').filter(Boolean)
        const groupKey = segments[1] || 'Main'
        const isChild = segments.length > 2

        if (!groups[groupKey]) {
            groups[groupKey] = { root: null, children: [] }
        }

        if (isChild) {
            groups[groupKey].children.push(route)
        } else if (!groups[groupKey].root || route.meta.drawerRanking < groups[groupKey].root.meta.drawerRanking) {
            groups[groupKey].root = route
        }
    })

    return Object.entries(groups)
        .filter(([key]) => key.toLowerCase() !== 'main')
        .map(([key, { root, children }]) => ({
            label: root.meta.title,
            root,
            children: children.sort((a, b) => (a.meta.drawerRanking || 0) - (b.meta.drawerRanking || 0)),
            drawerRanking: root.meta.drawerRanking || 0
        }))
        .sort((a, b) => a.drawerRanking - b.drawerRanking)
})
</script>