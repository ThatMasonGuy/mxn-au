<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent
            title="Participant SDA Funding Details"
            subtitle="Location-adjusted annual SDA amounts per participant"
            gradient="from-purple-600 to-pink-500"
            spacious
        >
            <template #actions>
                <div v-if="store.config" class="text-left sm:text-right sm:pb-0.5">
                    <p class="text-xs font-mono text-white/75">
                        {{ store.config.financialYear }} - {{ formatDate(store.config.importedAt) }}
                    </p>
                </div>
            </template>
        </ToolBannerComponent>

        <main class="relative z-10 max-w-5xl mx-auto px-4 -mt-5 sm:-mt-6 pb-6 sm:pb-8 space-y-5">

            <!-- Loading -->
            <div v-if="store.loading" class="flex items-center justify-center py-24 gap-3 text-gray-400">
                <div class="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span class="text-sm">Loading pricing data...</span>
            </div>

            <!-- No data state -->
            <div v-else-if="!store.hasData" class="bg-white rounded-2xl shadow-md border border-gray-100 py-16 px-6 text-center">
                <div class="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
                    <TableCellsIcon class="w-7 h-7 text-purple-300" />
                </div>
                <h2 class="text-base font-semibold text-gray-700 mb-2">No pricing data loaded</h2>
                <p class="text-sm text-gray-400 max-w-xs mx-auto">
                    Upload or manage the NDIS SDA Price Calculator dataset in the Everhomes admin section.
                </p>
            </div>

            <!-- Calculator -->
            <template v-else>

                <!-- Dwelling Details -->
                <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                        <div class="min-w-0">
                            <h2 class="text-base font-semibold text-gray-800">Dwelling Details</h2>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ advancedMode ? 'Advanced pricing inputs are editable.' : 'Default funding assumptions are applied.' }}
                            </p>
                        </div>
                        <button
                            @click="toggleAdvancedMode"
                            class="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-100 bg-purple-50 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                        >
                            <AdjustmentsHorizontalIcon class="w-3.5 h-3.5" />
                            {{ advancedMode ? 'Default mode' : 'Advanced mode' }}
                        </button>
                    </div>

                    <!-- Stock Type options -->
                    <div v-if="advancedMode" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                        <button
                            v-for="opt in stockTypeOptions" :key="opt.value"
                            @click="setStockType(opt.value)"
                            class="relative text-left rounded-xl border px-4 py-3 pr-10 text-sm transition-all"
                            :class="optionCardClass(stockType, opt.value)"
                        >
                            <span
                                v-if="stockType === opt.value"
                                class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm"
                            >
                                <CheckIcon class="w-3.5 h-3.5" />
                            </span>
                            <span class="block text-[11px] font-semibold uppercase tracking-wide mb-1" :class="optionBylineClass(stockType, opt.value)">
                                Build Type
                            </span>
                            <span class="block font-semibold">{{ opt.label }}</span>
                        </button>
                    </div>

                    <!-- Default pinned assumptions -->
                    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                        <div v-for="item in defaultAssumptions" :key="item.label" class="rounded-xl bg-purple-50/70 border border-purple-100 px-4 py-3">
                            <p class="text-[11px] font-semibold uppercase tracking-wide text-purple-400 mb-1">{{ item.label }}</p>
                            <p class="text-sm font-semibold text-purple-800">{{ item.value }}</p>
                        </div>
                    </div>

                    <!-- Selects grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
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
                        <div class="sm:col-span-2 space-y-1">
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

                    <!-- Toggle options -->
                    <div
                        class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100"
                        :class="advancedMode ? 'sm:grid-cols-3' : 'sm:grid-cols-1'"
                    >

                        <!-- OOA (hidden for Basic) -->
                        <div v-if="advancedMode && designCategory !== 'basic'" class="space-y-2">
                            <label class="block text-xs font-semibold uppercase tracking-wide text-gray-400">OOA</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button v-for="opt in ooaOptions" :key="opt.value"
                                    @click="ooa = opt.value"
                                    class="relative text-left px-4 pt-3 pb-[30px] pr-10 rounded-xl text-sm transition-all border"
                                    :class="optionCardClass(ooa, opt.value)"
                                >
                                    <span
                                        v-if="ooa === opt.value"
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm"
                                    >
                                        <CheckIcon class="w-3.5 h-3.5" />
                                    </span>
                                    <span class="block font-semibold">{{ opt.label }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Sprinklers -->
                        <div class="space-y-2">
                            <label class="block text-xs font-semibold uppercase tracking-wide text-gray-400">Sprinklers</label>
                            <div class="grid grid-cols-1 gap-2" :class="advancedMode ? '' : 'sm:grid-cols-2'">
                                <button v-for="opt in sprinklerOptions" :key="opt.value"
                                    @click="sprinklers = opt.value"
                                    class="relative text-left px-4 py-3 pr-10 rounded-xl text-sm transition-all border"
                                    :class="optionCardClass(sprinklers, opt.value)"
                                >
                                    <span
                                        v-if="sprinklers === opt.value"
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm"
                                    >
                                        <CheckIcon class="w-3.5 h-3.5" />
                                    </span>
                                    <span class="block font-semibold">{{ opt.label }}</span>
                                    <span class="block text-xs mt-0.5" :class="optionBylineClass(sprinklers, opt.value)">
                                        {{ opt.byline }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- ITC (New Build only) -->
                        <div v-if="advancedMode && stockType === 'newBuild'" class="space-y-2">
                            <label class="block text-xs font-semibold uppercase tracking-wide text-gray-400">Input Tax Credits</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button v-for="opt in itcOptions" :key="opt.value"
                                    @click="itc = opt.value"
                                    class="relative text-left px-4 pt-3 pb-[30px] pr-10 rounded-xl text-sm transition-all border"
                                    :class="optionCardClass(itc, opt.value)"
                                >
                                    <span
                                        v-if="itc === opt.value"
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm"
                                    >
                                        <CheckIcon class="w-3.5 h-3.5" />
                                    </span>
                                    <span class="block font-semibold">{{ opt.label }}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- N/A combination warning -->
                <div v-if="isNACombo"
                    class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <ExclamationTriangleIcon class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm font-medium text-amber-800">Combination not applicable</p>
                        <p class="text-xs text-amber-600 mt-0.5">{{ naReason }}</p>
                    </div>
                </div>

                <!-- Results -->
                <div v-if="!isNACombo && benchmarkAmount !== null" class="rounded-2xl shadow-md overflow-hidden">

                    <!-- Hero result -->
                    <div class="bg-gradient-to-br from-purple-600 to-pink-500 px-6 py-7 text-center text-white">
                        <p class="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">Adjusted SDA Amount</p>
                        <p class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">{{ formatCurrency(adjustedAmount) }}</p>
                        <p class="text-sm text-white/60 mt-2">per participant / year - {{ store.config?.financialYear }}</p>
                    </div>

                    <div class="bg-white p-5 sm:p-6 space-y-4">
                        <!-- Benchmark + factor -->
                        <div class="grid grid-cols-2 gap-3">
                            <div class="rounded-xl bg-gray-50 border border-gray-100 p-4">
                                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Annual Benchmark</p>
                                <p class="text-xl font-bold text-gray-800">{{ formatCurrency(benchmarkAmount) }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">per participant</p>
                            </div>
                            <div class="rounded-xl bg-gray-50 border border-gray-100 p-4">
                                <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Location Factor</p>
                                <p class="text-xl font-bold text-gray-800">x {{ locationFactor?.toFixed(2) ?? '-' }}</p>
                                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ location }}</p>
                            </div>
                        </div>

                        <!-- Equation bar -->
                        <div class="flex flex-wrap items-center justify-center gap-1.5 px-4 py-3 bg-purple-50 rounded-xl text-sm text-purple-700 font-medium">
                            <span>{{ formatCurrency(benchmarkAmount) }}</span>
                            <span class="text-purple-400">x</span>
                            <span>{{ locationFactor?.toFixed(2) }}</span>
                            <span class="text-purple-400">=</span>
                            <span class="font-bold">{{ formatCurrency(adjustedAmount) }}<span class="font-normal text-purple-400">/yr</span></span>
                        </div>

                        <!-- MRRC / Net to Provider foldout -->
                        <div class="border-t border-gray-100 pt-3">
                            <button
                                @click="showAdvancedResults = !showAdvancedResults"
                                class="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                            >
                                <ChevronDownIcon
                                    class="w-4 h-4 transition-transform duration-200"
                                    :class="showAdvancedResults ? 'rotate-180' : ''"
                                />
                                {{ showAdvancedResults ? 'Hide' : 'Show' }} MRRC &amp; net to provider
                            </button>

                            <Transition name="expand">
                                <div v-if="showAdvancedResults" class="mt-4 space-y-4">

                                    <!-- MRRC type toggle -->
                                    <div class="flex flex-wrap items-center gap-3">
                                        <span class="text-sm text-gray-500">Participant status:</span>
                                        <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
                                            <button v-for="opt in mrrcTypeOptions" :key="opt.value"
                                                @click="mrrcType = opt.value"
                                                class="px-4 py-1.5 rounded-md text-sm font-medium transition-all border"
                                                :class="mrrcType === opt.value
                                                    ? 'bg-white text-purple-700 shadow-sm border-gray-200'
                                                    : 'text-gray-500 hover:text-gray-700 border-transparent'"
                                            >{{ opt.label }}</button>
                                        </div>
                                    </div>

                                    <!-- MRRC + Net cards -->
                                    <div class="grid grid-cols-2 gap-3">
                                        <div class="rounded-xl bg-gray-50 border border-gray-100 p-4">
                                            <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">MRRC - {{ mrrcType === 'single' ? 'Single' : 'Couple' }}</p>
                                            <p class="text-xl font-bold text-gray-800">{{ formatCurrency(mrrcAmount) }}</p>
                                            <p class="text-xs text-gray-400 mt-0.5">max contribution / yr</p>
                                        </div>
                                        <div class="rounded-xl bg-green-50 border border-green-100 p-4">
                                            <p class="text-[11px] font-semibold uppercase tracking-wide text-green-500 mb-1">Net to Provider</p>
                                            <p class="text-xl font-bold text-green-700">{{ formatCurrency(netToProvider) }}</p>
                                            <p class="text-xs text-green-400 mt-0.5">SDA minus MRRC</p>
                                        </div>
                                    </div>

                                    <!-- Net equation bar -->
                                    <div class="flex flex-wrap items-center justify-center gap-1.5 px-4 py-3 bg-green-50 rounded-xl text-sm text-green-700 font-medium">
                                        <span>{{ formatCurrency(adjustedAmount) }}</span>
                                        <span class="text-green-400">-</span>
                                        <span>{{ formatCurrency(mrrcAmount) }} MRRC</span>
                                        <span class="text-green-400">=</span>
                                        <span class="font-bold">{{ formatCurrency(netToProvider) }}<span class="font-normal text-green-400">/yr</span></span>
                                    </div>

                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

            </template>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/features/everhomes/components/ui/ToolBannerComponent.vue'
import SmartInput from '@/features/everhomes/components/ui/SmartInput.vue'
import { useSdaPriceStore } from '@/features/everhomes/stores/useSdaPriceStore'
import {
    ExclamationTriangleIcon,
    TableCellsIcon,
    ChevronDownIcon,
    AdjustmentsHorizontalIcon,
    CheckIcon,
} from '@heroicons/vue/24/outline'

const store = useSdaPriceStore()

// Calculator state
const stockType = ref('newBuild')
const dwelling = ref('Apartment, 1 bedroom, 1 resident')
const designCategory = ref('improvedLiveability')
const ooa = ref('withOOA')
const sprinklers = ref('withSprinklers')
const itc = ref('itcNotClaimed')
const mrrcType = ref('single')
const location = ref('')
const showQldOnly = ref(true)
const showAdvancedResults = ref(false)
const advancedMode = ref(false)

// Static option lists
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
    { label: 'Without Sprinklers', byline: 'Pre-Approval', value: 'noSprinklers' },
    { label: 'With Sprinklers', byline: 'Quote', value: 'withSprinklers' },
]
const itcOptions = [
    { label: 'Not Claimed', value: 'itcNotClaimed' },
    { label: 'Claimed', value: 'itcClaimed' },
]
const mrrcTypeOptions = [
    { label: 'Single', value: 'single' },
    { label: 'Couple', value: 'couple' },
]

const defaultAssumptions = [
    { label: 'Stock Type', value: 'New Build' },
    { label: 'OOA', value: 'With OOA' },
    { label: 'Input Tax Credits', value: 'Not Claimed' },
]

// Derived option lists
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

// Lookup helpers
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

// Direct state reads - no getter-function indirection so Vue tracks deps reliably.
const currentDwellingRow = computed(() => {
    const table = store.benchmarks[tableKey.value]
    if (!table) return null
    return table.find(r => r.dwelling === dwelling.value) ?? null
})

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
    const idx = dwellingFactorIndex.value
    if (idx === null || !location.value) return null
    const locs = store.locationFactors[locationFactorSet.value] ?? []
    const loc = locs.find(l => l.name === location.value)
    return loc?.factors[idx] ?? null
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

function optionCardClass(currentValue, optionValue) {
    return currentValue === optionValue
        ? 'bg-purple-50/80 text-purple-950 shadow-sm border-purple-600 ring-2 ring-purple-500/25'
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 border-gray-200'
}

function optionBylineClass(currentValue, optionValue) {
    return currentValue === optionValue ? 'text-purple-700' : 'text-gray-500'
}

// Cascade resets
function setStockType(val) {
    stockType.value = val
    const dwellings = DWELLING_SETS[val] || []
    if (!dwellings.includes(dwelling.value)) dwelling.value = dwellings[0] || ''
    const cats = CATEGORY_SETS[val] || []
    if (!cats.includes(designCategory.value)) designCategory.value = cats[0] || ''
}

function applyDefaultModePins() {
    stockType.value = 'newBuild'
    ooa.value = 'withOOA'
    itc.value = 'itcNotClaimed'

    const dwellings = DWELLING_SETS.newBuild
    if (!dwellings.includes(dwelling.value)) dwelling.value = dwellings[0] || ''

    const cats = CATEGORY_SETS.newBuild
    if (!cats.includes(designCategory.value)) designCategory.value = cats[0] || ''
}

function toggleAdvancedMode() {
    advancedMode.value = !advancedMode.value
    if (!advancedMode.value) applyDefaultModePins()
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

// Init
onMounted(async () => {
    await store.fetchData()

    if (!store.hasData) return

    // Resolve to a location name that actually exists in the Firestore dataset.
    // dwelling & designCategory use static option lists so they never need this.
    const names = store.locationNames
    const isValidLocation = location.value && names.includes(location.value)
    if (!isValidLocation) {
        const qld = names.filter(n => n.startsWith('QLD'))
        location.value = qld[0] ?? names.find(n => n !== 'Median capital city') ?? names[0] ?? ''
    }
})

// Formatting
function formatCurrency(val) {
    if (val === null || val === undefined) return '-'
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
