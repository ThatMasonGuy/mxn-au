// @/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { checkRouteAccess } from '@/shared/utils/useRouteGuards'
import { waitForAuth } from '@/auth'
import { useMainStore } from '@/shared/stores/useMainStore'
import { updateMetaTagsEnhanced } from '@/shared/utils/useDynamicMetaTags'
import { useLoadingScreen } from '@/shared/composables/useLoadingScreen'
import { stableRoutePath } from '@/shared/analytics/analyticsPolicy'
import { trackPageView } from '@/shared/analytics/analytics'

const routeModules = import.meta.glob(['./features/*/routes.js', './router/mainRoutes.js'], { eager: true })
const routes = Object.values(routeModules).flatMap(module => module.default || [])

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    },
})

const { startLoading, stopLoading } = useLoadingScreen()

let lastLoggedPath = null
let pageViewDebounce = null

router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} | MXN.au` : 'MXN.au'

    // Start the debounced loading screen
    startLoading(to.meta.loadingMessage || '')

    await waitForAuth()
    const accessCheck = checkRouteAccess(to)
    if (accessCheck.blocked) {
        stopLoading()
        return accessCheck.redirect
    }
})

router.afterEach((to, from) => {
    updateMetaTagsEnhanced(to)

    void trackPageView(to)

    import('@/features/everhomes/utils/toolUsage')
        .then(({ trackEverhomesRouteUsage }) => trackEverhomesRouteUsage(to))
        .catch(err => console.warn('[Router] Failed to record Everhomes tool usage:', err))

    // Hide the loading screen
    stopLoading()
    
    if (pageViewDebounce) {
        clearTimeout(pageViewDebounce)
    }

    pageViewDebounce = setTimeout(() => {
        const store = useMainStore()
        const safePath = stableRoutePath(to)
        const previousSafePath = stableRoutePath(from)
        if (store.isAuthenticated &&
            safePath !== lastLoggedPath &&
            safePath !== previousSafePath) {
            lastLoggedPath = safePath

            import('@/shared/utils/useLogUserEvent')
                .then(({ logPageView }) => logPageView(safePath))
                .catch(err => console.warn('[Router] Failed to log page view:', err))
        }
    }, 300)
})

export default router
