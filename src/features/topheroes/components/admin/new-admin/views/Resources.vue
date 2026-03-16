<!-- TopHeroes Resources.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-th-primary">Resource Management</h1>
                    <p class="text-sm text-foreground/70 mt-1">Manage game assets, images, and downloadable content</p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto">
                    <button @click="toggleView" class="btn-th-soft flex-1 lg:flex-none">
                        <component :is="viewMode === 'grid' ? List : LayoutGrid" class="h-4 w-4 mr-2" />
                        {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
                    </button>
                    <button @click="showUploadModal = true" class="btn-th-primary flex-1 lg:flex-none">
                        <Upload class="h-4 w-4 mr-2" />
                        Upload Resource
                    </button>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Total Resources</div>
                        <div class="text-2xl font-bold text-th-primary">{{ totalResources }}</div>
                        <div class="text-xs text-foreground/60">{{ formatSize(totalSize) }}</div>
                    </div>
                    <FolderOpen class="h-8 w-8 text-th-primary" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Images</div>
                        <div class="text-2xl font-bold text-th-success">{{ imageCount }}</div>
                        <div class="text-xs text-foreground/60">{{ imageTypes.join(', ') }}</div>
                    </div>
                    <ImageIcon class="h-8 w-8 text-th-success" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Documents</div>
                        <div class="text-2xl font-bold text-th-warning">{{ documentCount }}</div>
                        <div class="text-xs text-foreground/60">PDF, DOC, XLS</div>
                    </div>
                    <FileText class="h-8 w-8 text-th-warning" />
                </div>
            </div>
            <div class="th-stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm text-foreground/70">Videos</div>
                        <div class="text-2xl font-bold text-th-secondary">{{ videoCount }}</div>
                        <div class="text-xs text-foreground/60">MP4, WebM</div>
                    </div>
                    <Video class="h-8 w-8 text-th-secondary" />
                </div>
            </div>
        </div>

        <!-- Categories & Filters -->
        <div class="mb-6">
            <div class="elev-card p-4">
                <div class="flex flex-col lg:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <input v-model="searchQuery" type="search" placeholder="Search resources by name or tag..."
                                class="pl-10 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition" />
                        </div>
                    </div>
                    <div class="flex gap-3 flex-wrap">
                        <select v-model="filterCategory"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition">
                            <option value="">All Categories</option>
                            <option value="hero-images">Hero Images</option>
                            <option value="ui-assets">UI Assets</option>
                            <option value="guides">Guide Resources</option>
                            <option value="templates">Templates</option>
                            <option value="misc">Miscellaneous</option>
                        </select>
                        <select v-model="filterType"
                            class="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-th-primary/50 transition">
                            <option value="">All Types</option>
                            <option value="image">Images</option>
                            <option value="document">Documents</option>
                            <option value="video">Videos</option>
                            <option value="archive">Archives</option>
                        </select>
                        <button @click="bulkDownload" class="btn-th-soft" :disabled="selectedResources.length === 0">
                            <Download class="h-4 w-4 mr-2" />
                            Download ({{ selectedResources.length }})
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Resource Categories Tabs -->
        <div class="mb-6 flex flex-wrap gap-1 p-1 bg-card rounded-lg border border-border">
            <button v-for="category in resourceCategories" :key="category.id" @click="activeCategory = category.id"
                :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2',
                    activeCategory === category.id
                        ? 'bg-th-primary text-white shadow-sm'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                ]">
                <component :is="category.icon" class="h-4 w-4" />
                {{ category.name }}
                <span class="text-xs opacity-75">({{ getCategoryCount(category.id) }})</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="elev-card p-12 text-center">
            <div class="th-loading-spinner mx-auto mb-4"></div>
            <h3 class="text-xl font-semibold text-foreground mb-2">Loading Resources</h3>
            <p class="text-foreground/60">Fetching your assets...</p>
        </div>

        <!-- Resources Grid -->
        <div v-else-if="viewMode === 'grid'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="resource in filteredResources" :key="resource.id" class="resource-card group"
                @click="previewResource(resource)">

                <!-- Resource Preview -->
                <div class="aspect-square rounded-lg overflow-hidden mb-3 relative bg-foreground/5">
                    <!-- Image Preview -->
                    <img v-if="resource.type === 'image'" :src="resource.thumbnail || resource.url" :alt="resource.name"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />

                    <!-- Document Preview -->
                    <div v-else-if="resource.type === 'document'"
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-th-warning/20 to-th-warning/10">
                        <FileText class="w-12 h-12 text-th-warning" />
                    </div>

                    <!-- Video Preview -->
                    <div v-else-if="resource.type === 'video'"
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-th-secondary/20 to-th-secondary/10 relative">
                        <Video class="w-12 h-12 text-th-secondary" />
                        <div
                            class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play class="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <!-- Archive Preview -->
                    <div v-else
                        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-th-primary/20 to-th-primary/10">
                        <Archive class="w-12 h-12 text-th-primary" />
                    </div>

                    <!-- Selection Checkbox -->
                    <div class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="checkbox" :value="resource.id" v-model="selectedResources"
                            class="w-4 h-4 text-th-primary bg-white border-gray-300 rounded focus:ring-th-primary/30" />
                    </div>

                    <!-- File Size -->
                    <div
                        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {{ formatSize(resource.size) }}
                    </div>
                </div>

                <!-- Resource Info -->
                <div class="space-y-2">
                    <h3 class="font-medium text-foreground group-hover:text-th-primary transition-colors truncate"
                        :title="resource.name">
                        {{ resource.name }}
                    </h3>

                    <div class="flex items-center justify-between text-sm">
                        <span class="px-2 py-1 bg-th-primary/10 text-th-primary rounded text-xs font-medium">
                            {{ getTypeLabel(resource.type) }}
                        </span>
                        <span class="text-foreground/60">{{ formatDate(resource.uploadedAt) }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-xs text-foreground/60">
                        <span>{{ resource.dimensions || resource.duration || 'N/A' }}</span>
                        <span>•</span>
                        <span>{{ resource.downloads || 0 }} downloads</span>
                    </div>
                </div>

                <!-- Actions -->
                <div
                    class="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="flex items-center gap-1">
                        <button @click.stop="downloadResource(resource)" class="p-1.5 hover:bg-th-success/10 rounded">
                            <Download class="w-4 h-4 text-th-success" />
                        </button>
                        <button @click.stop="copyResourceUrl(resource)" class="p-1.5 hover:bg-th-primary/10 rounded">
                            <Link class="w-4 h-4 text-th-primary" />
                        </button>
                        <button @click.stop="editResource(resource)" class="p-1.5 hover:bg-th-warning/10 rounded">
                            <Edit class="w-4 h-4 text-th-warning" />
                        </button>
                    </div>
                    <button @click.stop="deleteResource(resource)" class="p-1.5 hover:bg-th-danger/10 rounded">
                        <Trash2 class="w-4 h-4 text-th-danger" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Resources List -->
        <div v-else class="elev-card overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-border/60">
                        <tr>
                            <th class="w-8 px-4 py-3">
                                <input type="checkbox" @change="toggleAllSelection" :checked="allResourcesSelected"
                                    class="w-4 h-4 text-th-primary bg-background border-border rounded focus:ring-th-primary/30" />
                            </th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Name</th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Type</th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Size</th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Uploaded
                            </th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Downloads
                            </th>
                            <th class="text-left px-4 py-3 text-xs font-medium text-foreground/70 uppercase">Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border/60">
                        <tr v-for="resource in filteredResources" :key="resource.id"
                            class="hover:bg-foreground/2 transition">
                            <td class="px-4 py-3">
                                <input type="checkbox" :value="resource.id" v-model="selectedResources"
                                    class="w-4 h-4 text-th-primary bg-background border-border rounded focus:ring-th-primary/30" />
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded bg-th-primary/10 flex items-center justify-center">
                                        <component :is="getTypeIcon(resource.type)" class="w-4 h-4 text-th-primary" />
                                    </div>
                                    <div>
                                        <div class="font-medium text-foreground">{{ resource.name }}</div>
                                        <div class="text-sm text-foreground/60">{{ resource.category }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <span class="px-2 py-1 bg-th-primary/10 text-th-primary rounded text-xs font-medium">
                                    {{ getTypeLabel(resource.type) }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-foreground/80">{{ formatSize(resource.size) }}</td>
                            <td class="px-4 py-3 text-foreground/60">{{ formatDate(resource.uploadedAt) }}</td>
                            <td class="px-4 py-3 text-foreground/80">{{ resource.downloads || 0 }}</td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-1">
                                    <button @click="downloadResource(resource)"
                                        class="p-1 hover:bg-th-success/10 rounded">
                                        <Download class="w-4 h-4 text-th-success" />
                                    </button>
                                    <button @click="copyResourceUrl(resource)"
                                        class="p-1 hover:bg-th-primary/10 rounded">
                                        <Link class="w-4 h-4 text-th-primary" />
                                    </button>
                                    <button @click="editResource(resource)" class="p-1 hover:bg-th-warning/10 rounded">
                                        <Edit class="w-4 h-4 text-th-warning" />
                                    </button>
                                    <button @click="deleteResource(resource)" class="p-1 hover:bg-th-danger/10 rounded">
                                        <Trash2 class="w-4 h-4 text-th-danger" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Upload Modal -->
        <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-background rounded-xl shadow-2xl w-full max-w-lg border border-border/20">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-th-primary">Upload Resource</h3>
                        <button @click="showUploadModal = false" class="p-2 hover:bg-foreground/5 rounded-lg">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Upload Area -->
                    <div class="mb-6">
                        <div class="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-th-primary/50 transition-colors cursor-pointer"
                            @drop="handleDrop" @dragover.prevent @dragenter.prevent>
                            <Upload class="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                            <p class="text-foreground/80 mb-2">Drag and drop files here, or click to browse</p>
                            <p class="text-sm text-foreground/60">Supports images, documents, videos, and archives</p>
                            <input type="file" multiple class="hidden" ref="fileInput" @change="handleFileSelect" />
                        </div>
                    </div>

                    <!-- Upload Form -->
                    <form @submit.prevent="uploadFiles" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Category</label>
                            <select v-model="uploadForm.category" required
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all">
                                <option value="hero-images">Hero Images</option>
                                <option value="ui-assets">UI Assets</option>
                                <option value="guides">Guide Resources</option>
                                <option value="templates">Templates</option>
                                <option value="misc">Miscellaneous</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-foreground/80 mb-2">Tags (optional)</label>
                            <input v-model="uploadForm.tags" type="text" placeholder="hero, strategy, tutorial"
                                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-th-primary/30 focus:border-th-primary bg-background transition-all" />
                            <p class="text-xs text-foreground/60 mt-1">Separate tags with commas</p>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="showUploadModal = false" class="btn-th-soft flex-1">
                                Cancel
                            </button>
                            <button type="submit" class="btn-th-primary flex-1" :disabled="selectedFiles.length === 0">
                                Upload {{ selectedFiles.length }} Files
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
    Upload, Download, Search, Edit, Trash2, FolderOpen, FileText,
    Video, Archive, Link, List, LayoutGrid, X, Play,
    ImageIcon as Image
} from 'lucide-vue-next'

// Reactive state
const loading = ref(false)
const viewMode = ref('grid')
const activeCategory = ref('all')
const searchQuery = ref('')
const filterCategory = ref('')
const filterType = ref('')
const selectedResources = ref([])
const showUploadModal = ref(false)
const selectedFiles = ref([])

// Form state
const uploadForm = ref({
    category: 'hero-images',
    tags: ''
})

// Resource categories
const resourceCategories = ref([
    { id: 'all', name: 'All Resources', icon: FolderOpen },
    { id: 'hero-images', name: 'Hero Images', icon: Image },
    { id: 'ui-assets', name: 'UI Assets', icon: LayoutGrid },
    { id: 'guides', name: 'Guide Resources', icon: FileText },
    { id: 'templates', name: 'Templates', icon: Archive },
    { id: 'misc', name: 'Miscellaneous', icon: FolderOpen }
])

// Sample resources data
const resources = ref([
    {
        id: 1,
        name: 'hero_avatar_mage.png',
        type: 'image',
        category: 'hero-images',
        size: 1024000,
        dimensions: '512x512',
        url: '/resources/hero_avatar_mage.png',
        thumbnail: '/resources/thumbs/hero_avatar_mage.png',
        uploadedAt: new Date('2024-01-15'),
        downloads: 156,
        tags: ['hero', 'mage', 'avatar']
    },
    {
        id: 2,
        name: 'team_building_guide.pdf',
        type: 'document',
        category: 'guides',
        size: 2048000,
        url: '/resources/team_building_guide.pdf',
        uploadedAt: new Date('2024-01-12'),
        downloads: 89,
        tags: ['guide', 'team', 'strategy']
    },
    {
        id: 3,
        name: 'ui_button_set.zip',
        type: 'archive',
        category: 'ui-assets',
        size: 512000,
        url: '/resources/ui_button_set.zip',
        uploadedAt: new Date('2024-01-10'),
        downloads: 43,
        tags: ['ui', 'buttons', 'assets']
    },
    {
        id: 4,
        name: 'gameplay_trailer.mp4',
        type: 'video',
        category: 'misc',
        size: 15728640,
        duration: '2:45',
        url: '/resources/gameplay_trailer.mp4',
        uploadedAt: new Date('2024-01-08'),
        downloads: 201,
        tags: ['video', 'trailer', 'gameplay']
    }
])

// Computed properties
const filteredResources = computed(() => {
    let filtered = resources.value

    if (activeCategory.value !== 'all') {
        filtered = filtered.filter(r => r.category === activeCategory.value)
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(query) ||
            r.tags.some(tag => tag.toLowerCase().includes(query))
        )
    }

    if (filterCategory.value) {
        filtered = filtered.filter(r => r.category === filterCategory.value)
    }

    if (filterType.value) {
        filtered = filtered.filter(r => r.type === filterType.value)
    }

    return filtered.sort((a, b) => b.uploadedAt - a.uploadedAt)
})

const totalResources = computed(() => resources.value.length)
const totalSize = computed(() => resources.value.reduce((sum, r) => sum + r.size, 0))
const imageCount = computed(() => resources.value.filter(r => r.type === 'image').length)
const documentCount = computed(() => resources.value.filter(r => r.type === 'document').length)
const videoCount = computed(() => resources.value.filter(r => r.type === 'video').length)

const imageTypes = computed(() => ['PNG', 'JPG', 'SVG'])

const allResourcesSelected = computed(() => {
    return filteredResources.value.length > 0 &&
        selectedResources.value.length === filteredResources.value.length
})

// Helper functions
const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return resources.value.length
    return resources.value.filter(r => r.category === categoryId).length
}

const getTypeIcon = (type) => {
    const icons = {
        image: Image,
        document: FileText,
        video: Video,
        archive: Archive
    }
    return icons[type] || FileText
}

const getTypeLabel = (type) => {
    const labels = {
        image: 'Image',
        document: 'Document',
        video: 'Video',
        archive: 'Archive'
    }
    return labels[type] || 'File'
}

const formatSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unit = 0

    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024
        unit++
    }

    return `${size.toFixed(1)} ${units[unit]}`
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

const toggleAllSelection = () => {
    if (allResourcesSelected.value) {
        selectedResources.value = []
    } else {
        selectedResources.value = filteredResources.value.map(r => r.id)
    }
}

const previewResource = (resource) => {
    console.log('Preview resource:', resource.name)
    // Open resource preview modal or navigate to preview page
}

const downloadResource = (resource) => {
    console.log('Download resource:', resource.name)
    // Trigger download
    resource.downloads = (resource.downloads || 0) + 1
}

const copyResourceUrl = async (resource) => {
    try {
        await navigator.clipboard.writeText(resource.url)
        console.log('Copied URL for:', resource.name)
    } catch (error) {
        console.error('Failed to copy URL:', error)
    }
}

const editResource = (resource) => {
    console.log('Edit resource:', resource.name)
    // Open edit modal
}

const deleteResource = (resource) => {
    if (confirm(`Are you sure you want to delete "${resource.name}"?`)) {
        const index = resources.value.findIndex(r => r.id === resource.id)
        if (index > -1) {
            resources.value.splice(index, 1)
        }
    }
}

const bulkDownload = () => {
    console.log('Bulk download:', selectedResources.value.length, 'resources')
    // Create download for selected resources
}

const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    selectedFiles.value = files
}

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    selectedFiles.value = files
}

const uploadFiles = () => {
    if (selectedFiles.value.length === 0) return

    // Simulate upload process
    selectedFiles.value.forEach(file => {
        const resource = {
            id: Date.now() + Math.random(),
            name: file.name,
            type: getFileType(file.type),
            category: uploadForm.value.category,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date(),
            downloads: 0,
            tags: uploadForm.value.tags.split(',').map(t => t.trim()).filter(Boolean)
        }

        resources.value.unshift(resource)
    })

    // Reset form
    selectedFiles.value = []
    uploadForm.value = {
        category: 'hero-images',
        tags: ''
    }
    showUploadModal.value = false
}

const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet')) return 'document'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive'
    return 'document'
}

onMounted(() => {
    // Load resources data
})
</script>

<style scoped>
.resource-card {
    @apply elev-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
}
</style>