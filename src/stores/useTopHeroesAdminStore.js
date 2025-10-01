// @/stores/useTopHeroesAdminStore.js
import { defineStore } from 'pinia'
import { doc, collection, getDocs, getDoc, query, orderBy, limit } from 'firebase/firestore'
import { firestore } from '@/firebase'

const CACHE_EXPIRY = 10 * 60 * 1000 // 10 minutes

export const useTopHeroesAdminStore = defineStore('topheroesAdmin', {
    state: () => ({
        // Dashboard stats
        dashboardStats: {
            totalGuides: 0,
            activeEvents: 0,
            totalHeroes: 0,
            monthlyViews: 0,
            recentGuides: [],
            popularGuides: [],
            upcomingEvents: []
        },

        // Guides management
        guides: {
            list: [],
            categories: ['General', 'Events', 'Heroes', 'Strategy', 'Building', 'Combat'],
            isLoading: false,
            lastUpdated: null
        },

        // Heroes data
        heroes: {
            list: [],
            roles: ['Tank', 'DPS', 'Support', 'Healer', 'Assassin'],
            elements: ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark'],
            isLoading: false,
            lastUpdated: null
        },

        // Events scheduling
        events: {
            upcoming: [],
            active: [],
            templates: [],
            isLoading: false,
            lastUpdated: null
        },

        // Analytics data
        analytics: {
            guideViews: {},
            popularSearches: [],
            userMetrics: {
                totalUsers: 0,
                activeUsers: 0,
                newUsers: 0
            },
            isLoading: false,
            lastUpdated: null
        },

        // App settings
        settings: {
            theme: 'topheroes',
            isDark: false,
            sidebarExpanded: true,
            notifications: true
        },

        // Loading and error states
        isLoading: false,
        error: null,
        lastGlobalUpdate: null
    }),

    getters: {
        // Dashboard insights
        dashboardInsights: (state) => {
            const insights = []

            if (state.dashboardStats.monthlyViews > 50000) {
                insights.push({
                    icon: 'TrendingUp',
                    color: 'th-success',
                    text: `${(state.dashboardStats.monthlyViews / 1000).toFixed(1)}K monthly views - excellent reach!`
                })
            }

            if (state.guides.list.length > 20) {
                insights.push({
                    icon: 'BookOpen',
                    color: 'th-primary',
                    text: `${state.guides.list.length} comprehensive guides available`
                })
            }

            if (state.events.upcoming.length > 0) {
                insights.push({
                    icon: 'Calendar',
                    color: 'th-warning',
                    text: `${state.events.upcoming.length} upcoming events scheduled`
                })
            }

            return insights
        },

        // Recent activity feed
        recentActivity: (state) => {
            const activities = []

            // Recent guide updates
            state.guides.list
                .filter(g => g.lastUpdated)
                .sort((a, b) => b.lastUpdated - a.lastUpdated)
                .slice(0, 3)
                .forEach(guide => {
                    activities.push({
                        id: `guide-${guide.id}`,
                        type: 'guide_update',
                        icon: 'BookOpen',
                        color: 'text-th-primary',
                        message: `Guide "${guide.title}" was updated`,
                        time: guide.lastUpdated
                    })
                })

            // Upcoming events
            state.events.upcoming.slice(0, 2).forEach(event => {
                activities.push({
                    id: `event-${event.id}`,
                    type: 'event_upcoming',
                    icon: 'Calendar',
                    color: 'text-th-warning',
                    message: `Event "${event.name}" starts soon`,
                    time: event.startTime
                })
            })

            return activities.sort((a, b) => b.time - a.time).slice(0, 6)
        },

        // Top performing content
        topPerformers: (state) => {
            return state.dashboardStats.popularGuides
                .sort((a, b) => b.views - a.views)
                .slice(0, 8)
        },

        // System health indicators
        systemHealth: (state) => {
            const health = []

            // Content freshness
            const staleGuides = state.guides.list.filter(g => {
                const daysSinceUpdate = (Date.now() - (g.lastUpdated || 0)) / (1000 * 60 * 60 * 24)
                return daysSinceUpdate > 30
            }).length

            health.push({
                metric: 'Content Freshness',
                status: staleGuides < 3 ? 'healthy' : staleGuides < 8 ? 'warning' : 'critical',
                value: `${state.guides.list.length - staleGuides}/${state.guides.list.length} up-to-date`
            })

            // Event coverage
            health.push({
                metric: 'Event Coverage',
                status: state.events.upcoming.length > 2 ? 'healthy' : state.events.upcoming.length > 0 ? 'warning' : 'critical',
                value: `${state.events.upcoming.length} scheduled`
            })

            // User engagement
            const engagementScore = state.analytics.userMetrics.activeUsers / Math.max(state.analytics.userMetrics.totalUsers, 1) * 100
            health.push({
                metric: 'User Engagement',
                status: engagementScore > 40 ? 'healthy' : engagementScore > 20 ? 'warning' : 'critical',
                value: `${engagementScore.toFixed(1)}% active`
            })

            return health
        },

        isCacheStale: (state) => {
            if (!state.lastGlobalUpdate) return true
            return (Date.now() - state.lastGlobalUpdate) > CACHE_EXPIRY
        }
    },

    actions: {
        // Initialize the store
        async init() {
            // Load theme preference
            const savedTheme = localStorage.getItem('th-admin-theme')
            if (savedTheme) {
                this.settings.theme = savedTheme
                this.applyTheme()
            }

            // Load dark mode preference
            const savedDarkMode = localStorage.getItem('th-admin-dark-mode')
            if (savedDarkMode !== null) {
                this.settings.isDark = JSON.parse(savedDarkMode)
                this.applyDarkMode()
            }

            // Load sidebar preference
            const savedSidebar = localStorage.getItem('th-admin-sidebar')
            if (savedSidebar !== null) {
                this.settings.sidebarExpanded = JSON.parse(savedSidebar)
            }

            // Load initial data if cache is stale
            if (this.isCacheStale) {
                await this.loadDashboardData()
            }
        },

        // Load dashboard overview data
        async loadDashboardData(forceRefresh = false) {
            if (this.isLoading && !forceRefresh) return

            this.isLoading = true
            this.error = null

            try {
                // Check cache first
                if (!forceRefresh && !this.isCacheStale) {
                    this.isLoading = false
                    return
                }

                await Promise.all([
                    this.loadGuidesSummary(),
                    this.loadEventsSummary(),
                    this.loadHeroesSummary(),
                    this.loadAnalyticsSummary()
                ])

                this.lastGlobalUpdate = Date.now()
            } catch (error) {
                console.error('Failed to load dashboard data:', error)
                this.error = error.message || 'Failed to load dashboard data'
            } finally {
                this.isLoading = false
            }
        },

        // Load guides summary for dashboard
        async loadGuidesSummary() {
            try {
                const guidesRef = collection(firestore, 'topheroes/admin/guides')
                const guidesQuery = query(guidesRef, orderBy('lastUpdated', 'desc'), limit(50))
                const guidesSnap = await getDocs(guidesQuery)

                const guides = []
                guidesSnap.forEach(doc => {
                    guides.push({ id: doc.id, ...doc.data() })
                })

                this.dashboardStats.totalGuides = guides.length
                this.dashboardStats.recentGuides = guides.slice(0, 5)
                this.dashboardStats.popularGuides = guides
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 8)

                this.guides.list = guides
                this.guides.lastUpdated = Date.now()
            } catch (error) {
                console.error('Failed to load guides summary:', error)
                throw error
            }
        },

        // Load events summary
        async loadEventsSummary() {
            try {
                const eventsRef = collection(firestore, 'topheroes/admin/events')
                const eventsSnap = await getDocs(eventsRef)

                const events = []
                eventsSnap.forEach(doc => {
                    events.push({ id: doc.id, ...doc.data() })
                })

                const now = Date.now()
                const activeEvents = events.filter(e => e.startTime <= now && e.endTime >= now)
                const upcomingEvents = events
                    .filter(e => e.startTime > now)
                    .sort((a, b) => a.startTime - b.startTime)
                    .slice(0, 5)

                this.dashboardStats.activeEvents = activeEvents.length
                this.dashboardStats.upcomingEvents = upcomingEvents
                this.events.active = activeEvents
                this.events.upcoming = upcomingEvents
                this.events.lastUpdated = Date.now()
            } catch (error) {
                console.error('Failed to load events summary:', error)
                throw error
            }
        },

        // Load heroes summary
        async loadHeroesSummary() {
            try {
                const heroesRef = collection(firestore, 'topheroes/admin/heroes')
                const heroesSnap = await getDocs(heroesRef)

                const heroes = []
                heroesSnap.forEach(doc => {
                    heroes.push({ id: doc.id, ...doc.data() })
                })

                this.dashboardStats.totalHeroes = heroes.length
                this.heroes.list = heroes
                this.heroes.lastUpdated = Date.now()
            } catch (error) {
                console.error('Failed to load heroes summary:', error)
                throw error
            }
        },

        // Load analytics summary
        async loadAnalyticsSummary() {
            try {
                const analyticsRef = doc(firestore, 'topheroes/admin/analytics', 'summary')
                const analyticsSnap = await getDoc(analyticsRef)

                if (analyticsSnap.exists()) {
                    const data = analyticsSnap.data()
                    this.dashboardStats.monthlyViews = data.monthlyViews || 0
                    this.analytics.userMetrics = data.userMetrics || {}
                    this.analytics.popularSearches = data.popularSearches || []
                    this.analytics.lastUpdated = Date.now()
                }
            } catch (error) {
                console.error('Failed to load analytics summary:', error)
                // Non-critical, don't throw
            }
        },

        // Theme management
        applyTheme() {
            document.documentElement.className = `theme-${this.settings.theme}`
            localStorage.setItem('th-admin-theme', this.settings.theme)
        },

        toggleDarkMode() {
            this.settings.isDark = !this.settings.isDark
            this.applyDarkMode()
        },

        applyDarkMode() {
            if (this.settings.isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            localStorage.setItem('th-admin-dark-mode', JSON.stringify(this.settings.isDark))
        },

        setTheme(theme) {
            this.settings.theme = theme
            this.applyTheme()
        },

        // Sidebar management
        setSidebarExpanded(expanded) {
            this.settings.sidebarExpanded = expanded
            localStorage.setItem('th-admin-sidebar', JSON.stringify(expanded))
        },

        // Force refresh all data
        async forceRefresh() {
            await this.loadDashboardData(true)
        },

        // Utility functions
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K'
            }
            return num.toString()
        },

        formatTimeAgo(timestamp) {
            if (!timestamp) return 'Unknown'

            const now = Date.now()
            const diff = now - timestamp
            const minutes = Math.floor(diff / 60000)
            const hours = Math.floor(diff / 3600000)
            const days = Math.floor(diff / 86400000)

            if (minutes < 1) return 'just now'
            if (minutes < 60) return `${minutes}m ago`
            if (hours < 24) return `${hours}h ago`
            if (days < 7) return `${days}d ago`
            return new Date(timestamp).toLocaleDateString()
        }
    },

    persist: {
        paths: ['settings', 'dashboardStats', 'guides', 'heroes', 'events', 'analytics', 'lastGlobalUpdate']
    }
})