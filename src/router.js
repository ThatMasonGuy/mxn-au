import { createRouter, createWebHistory } from 'vue-router'

// Dynamically import all route modules from /modules
const routeModules = import.meta.glob('./routers/modules/*.js', { eager: true })

// Flatten all module exports into a single array
const routes = Object.values(routeModules)
    .flatMap(module => module.default || [])

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // If using back/forward browser buttons
        if (savedPosition) {
            return savedPosition
        } else {
            // When navigating to a new route manually
            return { top: 0 }
        }
    },
})

// Fake auth store for now (replace with your real auth)
const fakeAuth = {
    isAuthenticated: false, // Change this to true if logged in
    userRole: null, // e.g. 'topheroesAdmin', 'serverAdmin', 'translateAdmin'
}

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

    // --- 3. Auth Guard ---
    if (requiresAuth && !fakeAuth.isAuthenticated) {
        console.warn('Blocked: Login required.')
        return next('/') // Or your login page
    }

    // --- 4. Role Guard ---
    if (role && fakeAuth.userRole !== role) {
        console.warn(`Blocked: Role "${role}" required.`)
        return next('/') // Or unauthorized page
    }

    return next()
})


export default router