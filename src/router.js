// @/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { checkRouteAccess } from '@/utils/useRouteGuards'
import { waitForAuth } from '@/auth'
import { useMainStore } from '@/stores/useMainStore'
import { updateMetaTagsEnhanced } from '@/utils/useDynamicMetaTags'

const routeModules = import.meta.glob('./routers/modules/*.js', { eager: true })
const routes = Object.values(routeModules).flatMap(module => module.default || [])

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    },
})

let lastLoggedPath = null
let pageViewDebounce = null

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} | MXN.au` : 'MXN.au'

    await waitForAuth()
    const accessCheck = checkRouteAccess(to)
    if (accessCheck.blocked) {
        return next(accessCheck.redirect)
    }
    next()
})

router.afterEach((to, from) => {
    
    if (pageViewDebounce) {
        clearTimeout(pageViewDebounce)
    }

    pageViewDebounce = setTimeout(() => {
        const store = useMainStore()
        if (store.isAuthenticated &&
            to.path !== lastLoggedPath &&
            to.path !== from.path) {
            lastLoggedPath = to.path

            import('@/utils/useLogUserEvent')
                .then(({ logPageView }) => logPageView(to.path))
                .catch(err => console.warn('[Router] Failed to log page view:', err))
        }
    }, 300)
})

export default router