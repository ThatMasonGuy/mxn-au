// @/utils/useRouteGuards.js
import { useMainStore } from '@/stores/useMainStore'
import { useToast } from '@/components/ui/toast'

export function checkRouteAccess(to) {
    const store = useMainStore()
    const { toast } = useToast()

    // No requirements? Allow access
    if (!to.meta?.requiresAuth && !to.meta?.role) {
        return { blocked: false }
    }

    // Auth required but not authenticated
    if (to.meta.requiresAuth && !store.isAuthenticated) {
        toast({
            title: 'Authentication required',
            description: 'Please log in to continue.',
            variant: 'warning',
        })

        return {
            blocked: true,
            redirect: {
                path: '/login',
                query: { redirect: to.fullPath }
            },
        }
    }

    // Role required but user lacks it
    if (to.meta.role && !store.hasRole(to.meta.role)) {
        toast({
            title: 'Unauthorized',
            description: `You need the '${to.meta.role}' role to access this page.`,
            variant: 'error',
        })

        return {
            blocked: true,
            redirect: {
                path: '/unauth',
                query: {
                    role: to.meta.role,
                    redirect: to.fullPath
                }
            },
        }
    }

    // Permission-based access (optional)
    if (to.meta.permission && !store.hasPermission(to.meta.permission)) {
        toast({
            title: 'Insufficient permissions',
            description: 'You do not have permission to access this feature.',
            variant: 'error',
        })

        return {
            blocked: true,
            redirect: {
                path: '/unauth',
                query: {
                    permission: to.meta.permission,
                    redirect: to.fullPath
                }
            },
        }
    }

    return { blocked: false }
}