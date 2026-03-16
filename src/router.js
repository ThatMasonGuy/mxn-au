// @/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { checkRouteAccess } from '@/shared/utils/useRouteGuards'
import { waitForAuth } from '@/auth'
import { useMainStore } from '@/shared/stores/useMainStore'
import { updateMetaTagsEnhanced } from '@/shared/utils/useDynamicMetaTags'
import { useLoadingScreen } from '@/shared/composables/useLoadingScreen'

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

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} | MXN.au` : 'MXN.au'

    // Start the debounced loading screen
    startLoading(to.meta.loadingMessage || '')

    await waitForAuth()
    const accessCheck = checkRouteAccess(to)
    if (accessCheck.blocked) {
        stopLoading()
        return next(accessCheck.redirect)
    }
    next()
})

router.afterEach((to, from) => {
    // Hide the loading screen
    stopLoading()
    
    if (pageViewDebounce) {
        clearTimeout(pageViewDebounce)
    }

    pageViewDebounce = setTimeout(() => {
        const store = useMainStore()
        if (store.isAuthenticated &&
            to.path !== lastLoggedPath &&
            to.path !== from.path) {
            lastLoggedPath = to.path

            import('@/shared/utils/useLogUserEvent')
                .then(({ logPageView }) => logPageView(to.path))
                .catch(err => console.warn('[Router] Failed to log page view:', err))
        }
    }, 300)
})

export default router