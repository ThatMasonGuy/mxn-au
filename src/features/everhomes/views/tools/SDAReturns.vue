<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent
            title="SDA Price Calculator"
            subtitle="Location-adjusted annual SDA amounts per participant"
            gradient="from-purple-600 to-pink-500"
        >
            <template #actions>
                <div class="flex items-center gap-2">
                    <span v-if="store.config" class="text-xs text-white/70 font-mono">
                        {{ store.config.financialYear }}
                    </span>
                    <button
                        v-if="isAdmin || !store.hasData"
                        @click="showAdminPanel = !showAdminPanel"
                        class="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                        {{ showAdminPanel ? 'Close' : 'Update Dataset' }}
                    </button>
                </div>
            </template>
        </ToolBannerComponent>

        <main class="container mx-auto px-4 py-8 space-y-6">

            <!-- Admin Upload Panel -->
            <Transition name="expand">
                <div v-if="isAdmin && showAdminPanel" class="bg-white rounded-lg shadow-md border border-purple-200 overflow-hidden">
                    <div class="px-6 py-4 bg-purple-50 border-b border-purple-200 flex items-center gap-2">
                        <ArrowUpTrayIcon class="w-5 h-5 text-purple-600" />
                        <h2 class="font-semibold text-purple-800">Update Pricing Dataset</h2>
                        <span v-if="store.config" class="ml-auto text-xs text-purple-600">
                            Current: {{ store.config.financialYear }} · Imported {{ formatDate(store.config.importedAt) }}
                        </span>
                    </div>
                    <div class="p-6">
                        <p class="text-sm text-gray-600 mb-4">
                            Upload the <strong>NDIS SDA Price Calculator</strong> Excel file (.xlsx) published by the NDIA.
                            All users will immediately have access to the new pricing data.
                        </p>

                        <!-- File Drop Zone -->
                        <div
                            v-if="!uploadPreview"
                            @dragover.prevent="dragOver = true"
                            @dragleave="dragOver = false"
                            @drop.prevent="onDrop"
                            class="border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer"
                            :class="dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-300'"
                            @click="fileInput.click()"
                        >
                            <DocumentArrowUpIcon class="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p class="text-sm text-gray-600 font-medium">Drop the Excel file here or click to browse</p>
                            <p class="text-xs text-gray-400 mt-1">NDIS SDA Price Calculator 20XX-XX vX.X.xlsx</p>
                            <input ref="fileInput" type="file" accept=".xlsx" class="hidden" @change="onFileSelect" />
                        </div>

                        <!-- Parsing indicator -->
                        <div v-if="uploadStatus === 'parsing'" class="flex items-center gap-3 py-6 text-gray-600">
                            <div class="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <span class="text-sm">Extracting pricing data from spreadsheet…</span>
                        </div>

                        <!-- Preview -->
                        <div v-if="uploadPreview" class="space-y-4">
                            <div class="rounded-lg border p-4 space-y-2"
                                :class="uploadPreview.valid ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'">
                                <p class="text-sm font-semibold" :class="uploadPreview.valid ? 'text-green-800' : 'text-amber-800'">
                                    {{ uploadPreview.valid ? 'Ready to import' : 'Warnings detected — review before importing' }}
                                </p>
                                <ul class="text-sm space-y-1">
                                    <li class="text-gray-700">Financial year: <strong>{{ uploadPreview.financialYear }}</strong></li>
                                    <li class="text-gray-700">Benchmark tables: <strong>8</strong></li>
                                    <li class="text-gray-700">
                                        Locations: <strong>{{ uploadPreview.locationFactors.newBuild.length }}</strong> SA4 regions
                                    </li>
                                    <li class="text-gray-700">
                                        MRRC (single): <strong>{{ formatCurrency(uploadPreview.mrrc.single.perAnnum) }}/yr</strong>
                                    </li>
                                </ul>
                                <ul v-if="uploadPreview.warnings.length" class="text-sm text-amber-700 space-y-0.5 mt-2">
                                    <li v-for="w in uploadPreview.warnings" :key="w" class="flex gap-1">
                                        <ExclamationTriangleIcon class="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        {{ w }}
                                    </li>
                                </ul>
                            </div>

                            <div class="flex gap-3">
                                <button
                                    @click="confirmUpload"
                                    :disabled="store.uploading"
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    <div v-if="store.uploading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <CloudArrowUpIcon v-else class="w-4 h-4" />
                                    {{ store.uploading ? 'Saving to Firebase…' : 'Save to Firebase' }}
                                </button>
                                <button
                                    @click="cancelUpload"
                                    class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p v-if="store.error" class="text-sm text-red-600">
                                Error: {{ store.error }}
                            </p>
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- Loading -->
            <div v-if="store.loading" class="flex items-center justify-center py-24 gap-3 text-gray-500">
                <div class="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading pricing data…</span>
            </div>

            <!-- No data state -->
            <div v-else-if="!store.hasData" class="bg-white rounded-lg shadow-md p-12 text-center">
                <TableCellsIcon class="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 class="text-lg font-semibold text-gray-700 mb-2">No pricing data loaded</h2>
                <p v-if="isAdmin" class="text-sm text-gray-500">
                    Use the <strong>Update Dataset</strong> button above to upload the NDIS SDA Price Calculator.
                </p>
                <p v-else class="text-sm text-gray-500">
                    Ask your administrator to upload the NDIS SDA Price Calculator dataset.
                </p>
            </div>

            <!-- Calculator -->
            <template v-else>

                <!-- Dwelling Details -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold text-gray-800 mb-5">Dwelling Details</h2>

                    <!-- Stock Type Tabs -->
                    <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1 mb-5 w-full sm:w-auto sm:inline-flex">
                        <button
                            v-for="opt in stockTypeOptions" :key="opt.value"
                            @click="setStockType(opt.value)"
                            class="flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap"
                            :class="stockType === opt.value
                                ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                                : 'text-gray-500 hover:text-gray-700'"
                        >
                            {{ opt.label }}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <SmartInput
                            v-model="dwelling"
                            label="Dwelling Type"
                            type="select"
                            :options="dwellingOptions"
                            @update:model-value="onDwellingChange"
                        />
                        <SmartInput
                            v-model="designCategory"
                            label="Design Category"
                            type="select"
                            :options="categoryOptions"
                        />
                        <div class="space-y-1">
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium text-gray-700">Location (SA4 Region)</label>
                                <button
                                    @click="showQldOnly = !showQldOnly"
                                    class="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                                >
                                    {{ showQldOnly ? 'Show all states' : 'QLD only' }}
                                </button>
                            </div>
                            <SmartInput
                                v-model="location"
                                type="select"
                                :options="locationSelectOptions"
                            />
                        </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-6">
                        <!-- OOA (hidden for Basic) -->
                        <div v-if="designCategory !== 'basic'" class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700">On-site Overnight Accommodation</label>
                            <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                                <button v-for="opt in ooaOptions" :key="opt.value"
                                    @click="ooa = opt.value"
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all border"
                                    :class="ooa === opt.value ? 'bg-white text-purple-700 shadow-sm border-gray-200' : 'text-gray-500 hover:text-gray-700 border-transparent'"
                                >{{ opt.label }}</button>
                            </div>
                        </div>

                        <!-- Sprinklers -->
                        <div class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700">Fire Sprinklers</label>
                            <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                                <button v-for="opt in sprinklerOptions" :key="opt.value"
                                    @click="sprinklers = opt.value"
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all border"
                                    :class="sprinklers === opt.value ? 'bg-white text-purple-700 shadow-sm border-gray-200' : 'text-gray-500 hover:text-gray-700 border-transparent'"
                                >{{ opt.label }}</button>
                            </div>
                        </div>

                        <!-- ITC (New Build only) -->
                        <div v-if="stockType === 'newBuild'" class="space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700">Input Tax Credits</label>
                            <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                                <button v-for="opt in itcOptions" :key="opt.value"
                                    @click="itc = opt.value"
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all border"
                                    :class="itc === opt.value ? 'bg-white text-purple-700 shadow-sm border-gray-200' : 'text-gray-500 hover:text-gray-700 border-transparent'"
                                >{{ opt.label }}</button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- N/A combination warning -->
                <div v-if="isNACombo"
                    class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm font-medium text-amber-800">Combination not applicable (N/A)</p>
                        <p class="text-xs text-amber-600 mt-0.5">
                            {{ naReason }}
                        </p>
                    </div>
                </div>

                <!-- Results -->
                <div v-if="!isNACombo && benchmarkAmount !== null" class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex items-center justify-between mb-5">
                        <h2 class="text-xl font-semibold text-gray-800">Results</h2>
                        <span class="text-xs text-gray-400">{{ store.config?.financialYear }} pricing</span>
                    </div>

                    <!-- Primary results -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="rounded-lg bg-gray-50 border border-gray-200 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Annual Benchmark</p>
                            <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(benchmarkAmount) }}</p>
                            <p class="text-xs text-gray-400 mt-1">per participant</p>
                        </div>

                        <div class="rounded-lg bg-gray-50 border border-gray-200 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Location Factor</p>
                            <p class="text-2xl font-bold text-gray-800">× {{ locationFactor?.toFixed(2) ?? '—' }}</p>
                            <p class="text-xs text-gray-400 mt-1 truncate">{{ location }}</p>
                        </div>

                        <div class="rounded-lg bg-purple-50 border border-purple-200 p-4">
                            <p class="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-1">Adjusted SDA Amount</p>
                            <p class="text-2xl font-bold text-purple-700">{{ formatCurrency(adjustedAmount) }}</p>
                            <p class="text-xs text-purple-400 mt-1">per participant / year</p>
                        </div>
                    </div>

                    <!-- Always-visible breakdown bar -->
                    <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-sm text-blue-700">
                        <strong>{{ formatCurrency(benchmarkAmount) }}</strong>
                        × <strong>{{ locationFactor?.toFixed(2) }}</strong> location factor
                        = <strong>{{ formatCurrency(adjustedAmount) }}</strong> adjusted SDA amount per participant / year.
                    </div>

                    <!-- MRRC / Net to Provider foldout -->
                    <div class="mt-3">
                        <button
                            @click="showAdvancedResults = !showAdvancedResults"
                            class="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                        >
                            <ChevronDownIcon
                                class="w-4 h-4 transition-transform"
                                :class="showAdvancedResults ? 'rotate-180' : ''"
                            />
                            {{ showAdvancedResults ? 'Hide' : 'Show' }} MRRC &amp; net to provider
                        </button>

                        <Transition name="expand">
                            <div v-if="showAdvancedResults" class="mt-4 space-y-4">
                                <!-- MRRC type toggle -->
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-gray-600 font-medium">Participant status:</span>
                                    <div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                                        <button v-for="opt in mrrcTypeOptions" :key="opt.value"
                                            @click="mrrcType = opt.value"
                                            class="px-3 py-1.5 rounded-md text-sm font-medium transition-all border"
                                            :class="mrrcType === opt.value ? 'bg-white text-purple-700 shadow-sm border-gray-200' : 'text-gray-500 hover:text-gray-700 border-transparent'"
                                        >{{ opt.label }}</button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="rounded-lg bg-gray-50 border border-gray-200 p-4">
                                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">MRRC ({{ mrrcType === 'single' ? 'Single' : 'Couple' }})</p>
                                        <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(mrrcAmount) }}</p>
                                        <p class="text-xs text-gray-400 mt-1">max participant contribution / year</p>
                                    </div>

                                    <div class="rounded-lg bg-green-50 border border-green-200 p-4">
                                        <p class="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">Net to Provider</p>
                                        <p class="text-2xl font-bold text-green-700">{{ formatCurrency(netToProvider) }}</p>
                                        <p class="text-xs text-green-500 mt-1">adjusted SDA minus MRRC</p>
                                    </div>
                                </div>

                                <div class="p-3 bg-green-50 border-l-4 border-green-400 rounded text-sm text-green-700">
                                    <strong>{{ formatCurrency(adjustedAmount) }}</strong> adjusted SDA
                                    − <strong>{{ formatCurrency(mrrcAmount) }}</strong> MRRC ({{ mrrcType === 'single' ? 'single' : 'couple' }})
                                    = <strong>{{ formatCurrency(netToProvider) }}</strong> net to provider per participant / year.
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

            </template>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/features/everhomes/components/ui/ToolBannerComponent.vue'
import SmartInput from '@/features/everhomes/components/ui/SmartInput.vue'
import { useSdaPriceStore } from '@/features/everhomes/stores/useSdaPriceStore'
import { useMainStore } from '@/shared/stores/useMainStore'
import { extractSdaPricingData } from '@/features/everhomes/utils/sdaPriceExtractor'
import {
    ArrowUpTrayIcon,
    DocumentArrowUpIcon,
    CloudArrowUpIcon,
    ExclamationTriangleIcon,
    TableCellsIcon,
    ChevronDownIcon,
} from '@heroicons/vue/24/outline'

const store = useSdaPriceStore()
const mainStore = useMainStore()

const isAdmin = computed(() => mainStore.userRoles.includes('admin'))

// ── Admin upload state ────────────────────────────────────────────────────────
const showAdminPanel = ref(false)
const dragOver = ref(false)
const fileInput = ref(null)
const uploadStatus = ref(null)   // null | 'parsing' | 'preview'
const uploadPreview = ref(null)
const pendingFile = ref(null)

function onDrop(e) {
    dragOver.value = false
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
}

function onFileSelect(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
}

async function processFile(file) {
    pendingFile.value = file
    uploadStatus.value = 'parsing'
    uploadPreview.value = null
    try {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        uploadPreview.value = extractSdaPricingData(workbook, file.name)
        uploadStatus.value = 'preview'
    } catch (err) {
        uploadStatus.value = null
        alert(`Failed to parse file: ${err.message}`)
    }
}

async function confirmUpload() {
    if (!uploadPreview.value || !pendingFile.value) return
    try {
        await store.uploadData(
            uploadPreview.value,
            pendingFile.value.name,
            mainStore.user?.email ?? 'unknown'
        )
        cancelUpload()
        showAdminPanel.value = false
    } catch {
        // error shown via store.error
    }
}

function cancelUpload() {
    uploadStatus.value = null
    uploadPreview.value = null
    pendingFile.value = null
    if (fileInput.value) fileInput.value.value = ''
}

// ── Calculator state ──────────────────────────────────────────────────────────
const stockType = ref('newBuild')
const dwelling = ref('House, 2 residents')
const designCategory = ref('highPhysicalSupport')
const ooa = ref('withOOA')
const sprinklers = ref('noSprinklers')
const itc = ref('itcClaimed')
const mrrcType = ref('single')
const location = ref('QLD - Brisbane Inner City')
const showQldOnly = ref(true)
const showAdvancedResults = ref(false)

// ── Static option lists ───────────────────────────────────────────────────────
const stockTypeOptions = [
    { label: 'New Build', value: 'newBuild' },
    { label: 'Existing Stock', value: 'existingStock' },
    { label: 'Legacy Stock', value: 'legacyStock' },
]

const DWELLING_SETS = {
    newBuild: [
        'Apartment, 1 bedroom, 1 resident',
        'Apartment, 2 bedrooms, 1 resident',
        'Apartment, 2 bedrooms, 2 residents',
        'Apartment, 3 bedrooms, 2 residents',
        'Villa/Duplex/Townhouse, 1 resident',
        'Villa/Duplex/Townhouse, 2 residents',
        'Villa/Duplex/Townhouse, 3 residents',
        'House, 2 residents',
        'House, 3 residents',
        'Group Home, 4 residents',
        'Group Home, 5 residents',
    ],
    existingStock: [
        'Apartment, 1 bedroom, 1 resident',
        'Apartment, 2 bedrooms, 1 resident',
        'Apartment, 2 bedrooms, 2 residents',
        'Apartment, 3 bedrooms, 2 residents',
        'Villa/Duplex/Townhouse, 1 resident',
        'Villa/Duplex/Townhouse, 2 residents',
        'Villa/Duplex/Townhouse, 3 residents',
        'House, 2 residents',
        'House, 3 residents',
        'Group Home, 4 residents',
        'Group Home, 5 residents',
    ],
    legacyStock: [
        'Legacy Stock, 6 residents',
        'Legacy Stock, 7 residents',
        'Legacy Stock, 8 residents',
        'Legacy Stock, 9 residents',
        'Legacy Stock, 10 residents',
    ],
}

const CATEGORY_SETS = {
    newBuild:      ['improvedLiveability', 'fullyAccessible', 'robust', 'robustBreakout', 'highPhysicalSupport'],
    existingStock: ['basic', 'improvedLiveability', 'fullyAccessible', 'robust', 'robustBreakout', 'highPhysicalSupport'],
    legacyStock:   ['basic', 'improvedLiveability', 'fullyAccessible', 'robust', 'highPhysicalSupport'],
}

const CATEGORY_LABELS = {
    basic:                'Basic',
    improvedLiveability:  'Improved Liveability',
    fullyAccessible:      'Fully Accessible',
    robust:               'Robust',
    robustBreakout:       'Robust with Breakout Room',
    highPhysicalSupport:  'High Physical Support',
}

// Mapping from dwelling name to its column index in the location factor array
const DWELLING_FACTOR_INDEX = {
    'Apartment, 1 bedroom, 1 resident':    0,
    'Apartment, 2 bedrooms, 1 resident':   1,
    'Apartment, 2 bedrooms, 2 residents':  2,
    'Apartment, 3 bedrooms, 2 residents':  3,
    'Villa/Duplex/Townhouse, 1 resident':  4,
    'Villa/Duplex/Townhouse, 2 residents': 5,
    'Villa/Duplex/Townhouse, 3 residents': 6,
    'House, 2 residents':                  7,
    'House, 3 residents':                  8,
    'Group Home, 4 residents':             9,
    'Group Home, 5 residents':             10,
    'Legacy Stock, 6 residents':           11,
    'Legacy Stock, 7 residents':           11,
    'Legacy Stock, 8 residents':           11,
    'Legacy Stock, 9 residents':           11,
    'Legacy Stock, 10 residents':          11,
}

const ooaOptions = [
    { label: 'No OOA', value: 'noOOA' },
    { label: 'With OOA', value: 'withOOA' },
]
const sprinklerOptions = [
    { label: 'Without Sprinklers', value: 'noSprinklers' },
    { label: 'With Sprinklers', value: 'withSprinklers' },
]
const itcOptions = [
    { label: 'Not Claimed', value: 'itcNotClaimed' },
    { label: 'Claimed', value: 'itcClaimed' },
]
const mrrcTypeOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Couple', value: 'couple' },
]

// ── Derived option lists ──────────────────────────────────────────────────────
const dwellingOptions = computed(() =>
    (DWELLING_SETS[stockType.value] || []).map(d => ({ label: d, value: d }))
)

const categoryOptions = computed(() =>
    (CATEGORY_SETS[stockType.value] || []).map(cat => ({ label: CATEGORY_LABELS[cat], value: cat }))
)

const locationSelectOptions = computed(() => {
    const names = showQldOnly.value
        ? store.locationNames.filter(n => n.startsWith('QLD'))
        : store.locationNames
    return names.map(n => ({ label: n, value: n }))
})

// ── Lookup helpers ────────────────────────────────────────────────────────────
const tableKey = computed(() => {
    if (stockType.value === 'newBuild')
        return `newBuild_${sprinklers.value}_${itc.value}`
    if (stockType.value === 'existingStock')
        return `existingStock_${sprinklers.value}`
    return `legacyStock_${sprinklers.value}`
})

const benchmarkKey = computed(() => {
    if (designCategory.value === 'basic') return 'basicNoOOA'
    const ooaSuffix = ooa.value === 'noOOA' ? 'NoOOA' : 'WithOOA'
    return `${designCategory.value}${ooaSuffix}`
})

const currentDwellingRow = computed(() =>
    store.getBenchmarkRow(tableKey.value, dwelling.value)
)

const benchmarkAmount = computed(() => {
    const row = currentDwellingRow.value
    if (!row) return null
    return row[benchmarkKey.value] ?? null
})

const isNACombo = computed(() => benchmarkAmount.value === null && !!currentDwellingRow.value)

const naReason = computed(() => {
    if (!isNACombo.value) return ''
    const cat = CATEGORY_LABELS[designCategory.value] || designCategory.value
    return `${cat} is not available for "${dwelling.value}" under current SDA rules.`
})

const dwellingFactorIndex = computed(() => DWELLING_FACTOR_INDEX[dwelling.value] ?? null)

const locationFactorSet = computed(() =>
    stockType.value === 'newBuild' ? 'newBuild' : 'other'
)

const locationFactor = computed(() => {
    if (dwellingFactorIndex.value === null || !location.value) return null
    return store.getLocationFactor(location.value, dwellingFactorIndex.value, locationFactorSet.value)
})

const adjustedAmount = computed(() => {
    if (benchmarkAmount.value === null || locationFactor.value === null) return null
    return benchmarkAmount.value * locationFactor.value
})

const mrrcAmount = computed(() => store.config?.mrrc?.[mrrcType.value]?.perAnnum ?? null)

const netToProvider = computed(() => {
    if (adjustedAmount.value === null || mrrcAmount.value === null) return null
    return adjustedAmount.value - mrrcAmount.value
})

// ── Cascade resets ────────────────────────────────────────────────────────────
function setStockType(val) {
    stockType.value = val
    const dwellings = DWELLING_SETS[val] || []
    if (!dwellings.includes(dwelling.value)) dwelling.value = dwellings[0] || ''
    const cats = CATEGORY_SETS[val] || []
    if (!cats.includes(designCategory.value)) designCategory.value = cats[0] || ''
}

function onDwellingChange() {
    // If selected category is now N/A for the new dwelling, nudge to first valid one
    const row = currentDwellingRow.value
    if (!row) return
    const key = benchmarkKey.value
    if (row[key] === null) {
        const cats = CATEGORY_SETS[stockType.value] || []
        const valid = cats.find(cat => {
            const k = cat === 'basic' ? 'basicNoOOA' : `${cat}NoOOA`
            return row[k] !== null
        })
        if (valid) designCategory.value = valid
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
    await store.fetchData()
    if (!store.hasData) {
        showAdminPanel.value = true
    }
    if (store.locationNames.length && !location.value) {
        location.value = store.locationNames.find(n => n !== 'Median capital city') || store.locationNames[0]
    }
})

watch(() => store.locationNames, (names) => {
    if (names.length && !location.value) {
        location.value = names.find(n => n !== 'Median capital city') || names[0]
    }
})

// ── Formatting ────────────────────────────────────────────────────────────────
function formatCurrency(val) {
    if (val === null || val === undefined) return '—'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
.expand-enter-to,
.expand-leave-from {
    max-height: 800px;
    opacity: 1;
}
</style>
