import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { personalUnauthorizedRedirect } from '@/routers/modules/personalRoutes'
import { useToast } from '@/components/ui/toast'

// Dynamically import all route modules from /modules
const routeModules = import.meta.glob('./routers/modules/*.js', { eager: true })

// Flatten all module exports into a single array
const routes = Object.values(routeModules).flatMap(module => module.default || [])

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

// --- Router Guards ---
router.beforeEach((to, from, next) => {
    const { requiresAuth, role, title } = to.meta

    // --- 1. Dynamic Title ---
    if (title) {
        document.title = `${title} | MXN.au`
    } else {
        document.title = 'MXN.au'
    }

    // --- 2. Check for unmatched route ---
    if (!to.matched.length) {
        console.warn('No matching route, redirecting to /404')
        return next('/404')
    }

    const mainStore = useMainStore()
    const isAuthenticated = !!mainStore.user
    const userRole = mainStore.user?.role || null
    const { toast } = useToast()

    // --- 3. Auth Guard ---
    if (requiresAuth && !isAuthenticated) {
        console.warn('Blocked: Login required.')

        // Contextual unauthenticated redirects
        if (to.path.startsWith('/personal')) {
            toast({
                title: 'Sign in required',
                description: 'Please log in to access your personal tools.',
                variant: 'warning'
            })
            return next({ path: '/personal/login', query: { redirect: to.fullPath } })
        }

        // Default fallback
        toast({
            title: 'Authentication required',
            description: 'You must be logged in to view this page.',
            variant: 'warning'
        })
        return next({ path: '/', query: { redirect: to.fullPath } })
    }

    // --- 4. Role Guard ---
    if (role && userRole !== role) {
        console.warn(`Blocked: Role "${role}" required.`)

        if (to.path.startsWith('/personal')) {
            return next({ path: personalUnauthorizedRedirect, query: { role } })
        }

        return next({ path: '/unauthorized', query: { role } })
    }

    return next()
})

export default router
