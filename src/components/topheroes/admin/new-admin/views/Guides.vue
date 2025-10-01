<!-- TopHeroes Guides.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-th-primary">Guides Management</h1>
                    <p class="text-sm text-foreground/70 mt-1">Create and manage TopHeroes strategy guides and tutorials
                    </p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto">
                    <button @click="toggleView" class="btn-th-soft flex-1 lg:flex-none">
                        <component :is="viewMode === 'grid' ? List : LayoutGrid" class="h-4 w-4 mr-2" />
                        {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
                    </button>
                    <button @click="showCreateGuide = true" class="btn-th-primary flex-1 lg:flex-none">
                        <Plus class="h-4 w-4 mr-2" />
                        New Guide
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Pills -->
        <div class="mb-6 flex flex-wrap items-center gap-3">
            <div class="inline-flex items-center gap-2 rounded-full bg-th-success/15 px-4 py-2 text-sm text-th-success">
                <BookOpen class="h-4 w-4" />
                {{ publishedGuides.length }} Published
            </div>
            <div class="inline-flex items-center gap-2 rounded-full bg-th-warning/15 px-4 py-2 text-sm text-th-warning">
                <Edit class="h-4 w-4" />
                {{ draftGuides.length }} Drafts
            </div>
            <div class="inline-flex items-center gap-2 rounded-full bg-th-primary/15 px-4 py-2 text-sm text-th-primary">
                <Eye class="h-4 w-4" />
                {{ totalViews.toLocaleString() }} Total Views
            </div>
            <div v-if="featuredGuides.length > 0"
                class="inline-flex items-center gap-2 rounded-full bg-th-secondary/15 px-4 py-2 text-sm text-th-secondary">
                <Star class="h-4 w-4" />
                {{ featuredGuides.length }} Featured
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="mb-6">
            <div class="elev-card p-4 lg:p-6">
                <div class="flex flex-col lg:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <input v-model="searchQuery" type="search"
                                placeholder="Search guides by title, category, or content..."
                                class="pl-10 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition" />
                        </div>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                        <select v-model="filterCategory"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition min-w-32">
                            <option value="">All Categories</option>
                            <option value="general">General</option>
                            <option value="heroes">Heroes</option>
                            <option value="events">Events</option>
                            <option value="strategy">Strategy</option>
                            <option value="building">Building</option>
                            <option value="combat">Combat</option>
                        </select>
                        <select v-model="filterStatus"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition min-w-28">
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                        <button @click="exportGuides" class="btn-th-soft">
                            <Download class="h-4 w-4 mr-2" />
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="elev-card p-12 text-center">
            <div class="th-loading-spinner mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold text-foreground mb-2">Loading Guides</h3>
            <p class="text-foreground/60">Fetching your content...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredGuides.length === 0" class="elev-card p-12 text-center">
            <div class="w-16 h-16 bg-th-primary/15 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen class="w-8 h-8 text-th-primary" />
            </div>
            <h3 class="text-xl font-semibold text-foreground mb-2">No guides found</h3>
            <p class="text-foreground/60 mb-6">
                {{ hasActiveFilters ? 'Try adjusting your search or filters.' : 'Get started by creating your first guide.' }}
            </p>
            <button @click="showCreateGuide = true" class="btn-th-primary">
                <Plus class="w-4 h-4 mr-2" />
                Create New Guide
            </button>
        </div>

        <!-- Guides Content -->
        <div v-else>
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="guide in filteredGuides" :key="guide.id" class="th-guide-card group cursor-pointer"
                    @click="editGuide(guide)">

                    <!-- Guide Thumbnail -->
                    <div
                        class="aspect-video bg-gradient-to-br from-th-primary/20 to-th-secondary/20 rounded-lg mb-4 relative overflow-hidden">
                        <img v-if="guide.thumbnail" :src="guide.thumbnail" :alt="guide.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <BookOpen class="w-12 h-12 text-th-primary/60" />
                        </div>

                        <!-- Status Badge -->
                        <div class="absolute top-2 right-2">
                            <span class="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                                :class="getStatusClass(guide.status)">
                                {{ guide.status }}
                            </span>
                        </div>

                        <!-- Featured Badge -->
                        <div v-if="guide.featured" class="absolute top-2 left-2">
                            <span
                                class="px-2 py-1 bg-th-secondary/90 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                                <Star class="w-3 h-3 inline mr-1" />
                                Featured
                            </span>
                        </div>
                    </div>

                    <!-- Guide Info -->
                    <div class="space-y-3">
                        <div>
                            <h3
                                class="font-semibold text-foreground group-hover:text-th-primary transition-colors line-clamp-2">
                                {{ guide.title }}
                            </h3>
                            <p class="text-sm text-foreground/60 mt-1 line-clamp-2">
                                {{ guide.description }}
                            </p>
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <span class="px-2 py-1 bg-th-primary/10 text-th-primary rounded text-xs font-medium">
                                {{ getCategoryName(guide.category) }}
                            </span>
                            <span class="text-foreground/60">{{ formatDate(guide.updatedAt) }}</span>
                        </div>

                        <div class="flex items-center justify-between text-sm text-foreground/60">
                            <div class="flex items-center gap-4">
                                <span class="flex items-center gap-1">
                                    <Eye class="w-4 h-4" />
                                    {{ guide.views || 0 }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <Star class="w-4 h-4" />
                                    {{ guide.rating?.toFixed(1) || '0.0' }}
                                </span>
                            </div>
                            <span>{{ guide.readTime || 5 }}min read</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div
                        class="mt-4 pt-4 border-t border-border/20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click.stop="editGuide(guide)"
                            class="text-th-primary hover:underline text-sm font-medium">
                            Edit Guide
                        </button>
                        <div class="flex items-center gap-2">
                            <button @click.stop="toggleFeatured(guide)" class="p-1 hover:bg-th-secondary/10 rounded">
                                <Star
                                    :class="['w-4 h-4', guide.featured ? 'text-th-secondary fill-current' : 'text-foreground/40']" />
                            </button>
                            <button @click.stop="duplicateGuide(guide)" class="p-1 hover:bg-th-primary/10 rounded">
                                <Copy class="w-4 h-4 text-foreground/60" />
                            </button>
                            <button @click.stop="deleteGuide(guide)" class="p-1 hover:bg-th-danger/10 rounded">
                                <Trash2 class="w-4 h-4 text-th-danger/60" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- List View -->
            <div v-else class="elev-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="border-b border-border/60">
                            <tr>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Title
                                </th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">
                                    Category</th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Status
                                </th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Views
                                </th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Rating
                                </th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Updated
                                </th>
                                <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border/60">
                            <tr v-for="guide in filteredGuides" :key="guide.id"
                                class="hover:bg-foreground/2 transition cursor-pointer" @click="editGuide(guide)">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-3">
                                        <div v-if="guide.featured" class="w-2 h-2 bg-th-secondary rounded-full"></div>
                                        <div>
                                            <div class="font-medium text-foreground">{{ guide.title }}</div>
                                            <div class="text-sm text-foreground/60 line-clamp-1">{{ guide.description }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-3">
                                    <span
                                        class="px-2 py-1 bg-th-primary/10 text-th-primary rounded text-xs font-medium">
                                        {{ getCategoryName(guide.category) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="getStatusClass(guide.status)">
                                        {{ guide.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-foreground/80">{{ (guide.views || 0).toLocaleString() }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-1">
                                        <Star class="w-4 h-4 text-th-secondary" />
                                        <span class="text-foreground/80">{{ guide.rating?.toFixed(1) || '0.0' }}</span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-foreground/60">{{ formatDate(guide.updatedAt) }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-1">
                                        <button @click.stop="editGuide(guide)"
                                            class="p-1 hover:bg-th-primary/10 rounded">
                                            <Edit class="w-4 h-4 text-th-primary" />
                                        </button>
                                        <button @click.stop="duplicateGuide(guide)"
                                            class="p-1 hover:bg-th-success/10 rounded">
                                            <Copy class="w-4 h-4 text-th-success" />
                                        </button>
                                        <button @click.stop="deleteGuide(guide)"
                                            class="p-1 hover:bg-th-danger/10 rounded">
                                            <Trash2 class="w-4 h-4 text-th-danger" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create Guide Modal -->
        <div v-if="showCreateGuide" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-background rounded-xl shadow-2xl w-full max-w-md border border-border/20">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-th-primary">Create New Guide</h3>
                        <button @click="showCreateGuide = false" class="p-2 hover:bg-foreground/5 rounded-lg">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <form @submit.prevent="createGuide" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Guide Title</label>
                            <input v-model="newGuide.title" type="text" required placeholder="Enter guide title"
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Category</label>
                            <select v-model="newGuide.category" required
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all">
                                <option value="general">General</option>
                                <option value="heroes">Heroes</option>
                                <option value="events">Events</option>
                                <option value="strategy">Strategy</option>
                                <option value="building">Building</option>
                                <option value="combat">Combat</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Description</label>
                            <textarea v-model="newGuide.description" rows="3"
                                placeholder="Brief description of the guide..."
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all resize-none"></textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="showCreateGuide = false" class="btn-th-soft flex-1">
                                Cancel
                            </button>
                            <button type="submit" class="btn-th-primary flex-1">
                                Create Guide
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    BookOpen, Plus, Search, Download, Edit, Eye, Star, Copy, Trash2,
    List, LayoutGrid, X, Filter
} from 'lucide-vue-next'

// Reactive state
const loading = ref(false)
const viewMode = ref('grid')
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const showCreateGuide = ref(false)

// Form data
const newGuide = ref({
    title: '',
    category: 'general',
    description: ''
})

// Sample guides data (would come from store/API)
const guides = ref([
    {
        id: 1,
        title: 'Ultimate Hero Team Building Guide',
        description: 'Learn how to build the perfect team composition for maximum synergy and power.',
        category: 'heroes',
        status: 'published',
        views: 12543,
        rating: 4.8,
        readTime: 12,
        featured: true,
        updatedAt: new Date('2024-01-15'),
        thumbnail: null
    },
    {
        id: 2,
        title: 'GvG Battle Strategy Mastery',
        description: 'Advanced tactics and positioning strategies for Guild vs Guild battles.',
        category: 'strategy',
        status: 'published',
        views: 8921,
        rating: 4.6,
        readTime: 18,
        featured: false,
        updatedAt: new Date('2024-01-12'),
        thumbnail: null
    },
    {
        id: 3,
        title: 'Resource Management for New Players',
        description: 'Essential tips for managing gold, gems, and other resources efficiently.',
        category: 'general',
        status: 'draft',
        views: 0,
        rating: 0,
        readTime: 8,
        featured: false,
        updatedAt: new Date('2024-01-10'),
        thumbnail: null
    },
    {
        id: 4,
        title: 'Event Participation Optimization',
        description: 'How to maximize rewards from seasonal events and competitions.',
        category: 'events',
        status: 'published',
        views: 6754,
        rating: 4.3,
        readTime: 15,
        featured: true,
        updatedAt: new Date('2024-01-08'),
        thumbnail: null
    }
])

// Computed properties
const filteredGuides = computed(() => {
    let filtered = guides.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(guide =>
            guide.title.toLowerCase().includes(query) ||
            guide.description.toLowerCase().includes(query) ||
            guide.category.toLowerCase().includes(query)
        )
    }

    if (filterCategory.value) {
        filtered = filtered.filter(guide => guide.category === filterCategory.value)
    }

    if (filterStatus.value) {
        filtered = filtered.filter(guide => guide.status === filterStatus.value)
    }

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt)
})

const publishedGuides = computed(() => guides.value.filter(g => g.status === 'published'))
const draftGuides = computed(() => guides.value.filter(g => g.status === 'draft'))
const featuredGuides = computed(() => guides.value.filter(g => g.featured))
const totalViews = computed(() => guides.value.reduce((sum, g) => sum + (g.views || 0), 0))

const hasActiveFilters = computed(() =>
    searchQuery.value || filterCategory.value || filterStatus.value
)

// Helper functions
const getCategoryName = (category) => {
    const categories = {
        general: 'General',
        heroes: 'Heroes',
        events: 'Events',
        strategy: 'Strategy',
        building: 'Building',
        combat: 'Combat'
    }
    return categories[category] || category
}

const getStatusClass = (status) => {
    const classes = {
        published: 'bg-th-success/15 text-th-success',
        draft: 'bg-th-warning/15 text-th-warning',
        archived: 'bg-foreground/10 text-foreground/60'
    }
    return classes[status] || 'bg-foreground/10 text-foreground/60'
}

const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

// Actions
const toggleView = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const createGuide = () => {
    const guide = {
        id: Date.now(),
        ...newGuide.value,
        status: 'draft',
        views: 0,
        rating: 0,
        readTime: 5,
        featured: false,
        updatedAt: new Date()
    }

    guides.value.unshift(guide)

    // Reset form
    newGuide.value = {
        title: '',
        category: 'general',
        description: ''
    }

    showCreateGuide.value = false
}

const editGuide = (guide) => {
    console.log('Edit guide:', guide.title)
    // Navigate to guide editor
}

const duplicateGuide = (guide) => {
    const duplicate = {
        ...guide,
        id: Date.now(),
        title: guide.title + ' (Copy)',
        status: 'draft',
        views: 0,
        featured: false,
        updatedAt: new Date()
    }

    guides.value.unshift(duplicate)
}

const toggleFeatured = (guide) => {
    guide.featured = !guide.featured
}

const deleteGuide = (guide) => {
    if (confirm(`Are you sure you want to delete "${guide.title}"?`)) {
        const index = guides.value.findIndex(g => g.id === guide.id)
        if (index > -1) {
            guides.value.splice(index, 1)
        }
    }
}

const exportGuides = () => {
    console.log('Export guides')
}

onMounted(() => {
    // Load guides data
})
</script>

<style scoped>
.line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
</style>