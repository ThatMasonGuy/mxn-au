import { useMainStore } from '@/stores/useMainStore'
import { useToast } from '@/components/ui/toast'

export function checkRouteAccess(to) {
    const store = useMainStore()
    const { toast } = useToast()

    const requiresAuth = to.meta?.requiresAuth
    const requiredRole = to.meta?.role
    const isAuthenticated = !!store.user
    const userRole = store.user?.role || null

    const base = '/' + (to.path.split('/')[1] || '') // e.g. /personal or /topheroes
    const pathFor = (suffix) => `${base}/${suffix}`

    // --- Auth Guard ---
    if (requiresAuth && !isAuthenticated) {
        toast({
            title: 'Sign in required',
            description: 'Please log in to access this area.',
            variant: 'warning',
        })

        return {
            blocked: true,
            redirect: { path: pathFor('login'), query: { redirect: to.fullPath } },
        }
    }

    // --- Role Guard ---
    if (requiredRole && userRole !== requiredRole) {
        toast({
            title: 'Unauthorized',
            description: `You need the '${requiredRole}' role to view this page.`,
            variant: 'error',
        })

        return {
            blocked: true,
            redirect: { path: pathFor('unauthorized'), query: { role: requiredRole } },
        }
    }

    return { blocked: false }
}
