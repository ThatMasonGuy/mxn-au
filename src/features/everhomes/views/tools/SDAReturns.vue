<template>
    <div>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent
            :title="calculatorTitle"
            :subtitle="calculatorSubtitle"
            :gradient="calculatorGradient"
            spacious
        >
            <template #actions>
                <div class="flex flex-col items-start gap-2 sm:items-end sm:pb-0.5">
                    <button
                        type="button"
                        class="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-3.5 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        @click="openCalculatorChooser"
                    >
                        <ArrowsRightLeftIcon class="h-4 w-4" />
                        Switch calculator
                    </button>
                    <p v-if="store.config" class="text-xs font-mono text-white/75">
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

                <div
                    class="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:px-5"
                    :class="isAppendixH ? 'border-teal-100' : 'border-purple-100'"
                >
                    <div class="flex min-w-0 items-center gap-3">
                        <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            :class="isAppendixH ? 'bg-teal-50 text-teal-700' : 'bg-purple-50 text-purple-700'"
                        >
                            <UsersIcon v-if="isAppendixH" class="h-5 w-5" />
                            <CalculatorIcon v-else class="h-5 w-5" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[11px] font-bold uppercase tracking-widest" :class="accentTextClass">
                                Active calculator
                            </p>
                            <p class="truncate text-base font-bold text-gray-900">{{ calculatorTitle }}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 sm:max-w-md sm:text-right">
                        {{ isAppendixH
                            ? 'For SDA-eligible participants sharing with people who are not SDA-eligible.'
                            : 'For standard SDA participant funding based on the enrolled dwelling.' }}
                    </p>
                </div>

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
                            class="self-start inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
                            :class="advancedButtonClass"
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
                            class="relative min-h-16 text-left rounded-xl border px-4 py-3 pr-10 text-sm transition-all"
                            :class="optionCardClass(stockType, opt.value)"
                        >
                            <span
                                v-if="stockType === opt.value"
                                class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                                :class="accentSolidClass"
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
                        <div v-for="item in defaultAssumptions" :key="item.label" class="rounded-xl border px-4 py-3" :class="softPanelClass">
                            <p class="mb-1 text-[11px] font-semibold uppercase tracking-wide" :class="mutedAccentTextClass">{{ item.label }}</p>
                            <p class="text-sm font-semibold" :class="strongAccentTextClass">{{ item.value }}</p>
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
                        <div v-if="isAppendixH" class="sm:col-span-2 rounded-xl border border-teal-100 bg-teal-50/70 p-4">
                            <div class="mb-3 flex items-start gap-2.5">
                                <UsersIcon class="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                                <div>
                                    <p class="text-sm font-semibold text-teal-900">Shared living arrangement</p>
                                    <p class="mt-0.5 text-xs leading-5 text-teal-700">
                                        Select between 1 and one less than the maximum number of bedrooms. Where the spreadsheet provides a one-participant amount for a one-bedroom dwelling, it is retained.
                                    </p>
                                </div>
                            </div>
                            <SmartInput
                                v-if="appendixEligibleOptions.length"
                                v-model="sdaEligibleCount"
                                label="SDA-eligible participants"
                                type="select"
                                :options="appendixEligibleOptions"
                            />
                            <div v-else class="rounded-lg border border-amber-200 bg-white px-3 py-2.5">
                                <p class="text-xs font-bold uppercase tracking-wide text-amber-600">SDA-eligible participants</p>
                                <p class="mt-1 text-sm font-semibold text-amber-900">N/A</p>
                                <p class="mt-0.5 text-xs leading-5 text-amber-700">
                                    No Appendix H participant amount is available for this dwelling in the selected dataset.
                                </p>
                            </div>
                        </div>
                        <div class="sm:col-span-2 space-y-1">
                            <div class="flex items-center justify-between">
                                <label class="block text-sm font-medium text-gray-700">Location (SA4 Region)</label>
                                <button
                                    @click="showQldOnly = !showQldOnly"
                                    class="text-xs font-medium transition-colors"
                                    :class="accentLinkClass"
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
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                                        :class="accentSolidClass"
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
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                                        :class="accentSolidClass"
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
                                        class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                                        :class="accentSolidClass"
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
                <div v-if="isNACombo || isAppendixAmountUnavailable"
                    class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <ExclamationTriangleIcon class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p class="text-sm font-medium text-amber-800">
                            {{ isAppendixAmountUnavailable ? 'Appendix H amount unavailable' : 'Combination not applicable' }}
                        </p>
                        <p class="text-xs text-amber-600 mt-0.5">
                            {{ isAppendixAmountUnavailable
                                ? 'The selected pricing dataset does not contain an Appendix H amount for this combination.'
                                : naReason }}
                        </p>
                    </div>
                </div>

                <!-- Results -->
                <div v-if="!isNACombo && !isAppendixAmountUnavailable && benchmarkAmount !== null" class="rounded-2xl shadow-md overflow-hidden">

                    <!-- Hero result -->
                    <div class="bg-gradient-to-br px-6 py-7 text-center text-white" :class="calculatorGradient">
                        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-white/70">
                            {{ isAppendixH ? 'Appendix H Adjusted SDA Amount' : 'Adjusted SDA Amount' }}
                        </p>
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
                        <div class="flex flex-wrap items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium" :class="equationBarClass">
                            <span>{{ formatCurrency(benchmarkAmount) }}</span>
                            <span :class="mutedAccentTextClass">x</span>
                            <span>{{ locationFactor?.toFixed(2) }}</span>
                            <span :class="mutedAccentTextClass">=</span>
                            <span class="font-bold">{{ formatCurrency(adjustedAmount) }}<span class="font-normal" :class="mutedAccentTextClass">/yr</span></span>
                        </div>

                        <!-- MRRC / Net to Provider foldout -->
                        <div class="border-t border-gray-100 pt-3">
                            <button
                                @click="showAdvancedResults = !showAdvancedResults"
                                class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                                :class="accentLinkClass"
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
                                                ? `bg-white shadow-sm border-gray-200 ${strongAccentTextClass}`
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

    <Teleport to="body">
        <Transition name="chooser">
            <div
                v-if="showCalculatorChooser"
                class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="calculator-chooser-title"
                @keydown.esc.prevent
            >
                <div class="my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
                    <div class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 px-5 py-6 text-center text-white sm:px-8 sm:py-8">
                        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_40%)]" />
                        <div class="relative">
                            <p class="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75">Participant SDA Funding Details</p>
                            <h2 id="calculator-chooser-title" class="text-2xl font-black tracking-tight sm:text-3xl">Which calculator do you need?</h2>
                            <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85">
                                Choose before continuing so the funding amount is calculated against the correct pricing table.
                            </p>
                        </div>
                    </div>

                    <div class="grid gap-3 bg-slate-50 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
                        <button
                            ref="chooserFirstButton"
                            type="button"
                            class="group relative flex min-h-52 flex-col rounded-2xl border-2 border-purple-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 sm:p-6"
                            @click="selectCalculator('sda')"
                        >
                            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200">
                                <CalculatorIcon class="h-6 w-6" />
                            </span>
                            <span class="text-xl font-black text-slate-900">SDA Calculator</span>
                            <span class="mt-2 text-sm leading-6 text-slate-500">
                                Standard participant SDA funding based on the enrolled dwelling, design and location.
                            </span>
                            <span class="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-purple-700">
                                Use SDA Calculator
                                <ArrowRightIcon class="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>

                        <button
                            type="button"
                            class="group relative flex min-h-52 flex-col rounded-2xl border-2 border-teal-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:border-teal-100 disabled:hover:shadow-sm sm:p-6"
                            :disabled="store.hasData && !store.hasAppendixH"
                            @click="selectCalculator('appendixH')"
                        >
                            <span class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-200">
                                <UsersIcon class="h-6 w-6" />
                            </span>
                            <span class="text-xl font-black text-slate-900">Appendix H Calculator</span>
                            <span class="mt-2 text-sm leading-6 text-slate-500">
                                Shared living arrangements with both SDA-eligible and non-SDA-eligible residents.
                            </span>
                            <span v-if="store.hasData && !store.hasAppendixH" class="mt-auto pt-5 text-sm font-bold text-amber-700">
                                Appendix H data is not available for this year
                            </span>
                            <span v-else class="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-teal-700">
                                Use Appendix H Calculator
                                <ArrowRightIcon class="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </div>

                    <p class="border-t border-slate-200 bg-white px-5 py-3 text-center text-xs leading-5 text-slate-400">
                        You will be asked again after 30 minutes of inactivity to help prevent using a stale calculator.
                    </p>
                </div>
            </div>
        </Transition>
    </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/features/everhomes/components/ui/ToolBannerComponent.vue'
import SmartInput from '@/features/everhomes/components/ui/SmartInput.vue'
import { useSdaPriceStore } from '@/features/everhomes/stores/useSdaPriceStore'
import { isValidAppendixHParticipantRow } from '@/features/everhomes/utils/sdaAppendixH'
import { trackEverhomesToolUsage } from '@/features/everhomes/utils/toolUsage'
import {
    ExclamationTriangleIcon,
    TableCellsIcon,
    ChevronDownIcon,
    AdjustmentsHorizontalIcon,
    ArrowRightIcon,
    ArrowsRightLeftIcon,
    CalculatorIcon,
    CheckIcon,
    UsersIcon,
} from '@heroicons/vue/24/outline'

const store = useSdaPriceStore()

const STALE_AFTER_MS = 30 * 60 * 1000
const activeCalculator = ref(null)
const showCalculatorChooser = ref(true)
const chooserFirstButton = ref(null)
let lastActivityAt = Date.now()
let staleTimer = null

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
const sdaEligibleCount = ref(null)

// Static option lists
const ALL_STOCK_TYPE_OPTIONS = [
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

const isAppendixH = computed(() => activeCalculator.value === 'appendixH')
const calculatorTitle = computed(() => isAppendixH.value ? 'Appendix H Calculator' : 'SDA Calculator')
const calculatorSubtitle = computed(() => isAppendixH.value
    ? 'Participant SDA Funding Details · shared living arrangements'
    : 'Participant SDA Funding Details · standard SDA pricing')
const calculatorGradient = computed(() => isAppendixH.value
    ? 'from-teal-600 to-cyan-500'
    : 'from-purple-600 to-pink-500')

const accentTextClass = computed(() => isAppendixH.value ? 'text-teal-600' : 'text-purple-600')
const mutedAccentTextClass = computed(() => isAppendixH.value ? 'text-teal-400' : 'text-purple-400')
const strongAccentTextClass = computed(() => isAppendixH.value ? 'text-teal-800' : 'text-purple-800')
const accentSolidClass = computed(() => isAppendixH.value ? 'bg-teal-600' : 'bg-purple-600')
const accentLinkClass = computed(() => isAppendixH.value
    ? 'text-teal-600 hover:text-teal-800'
    : 'text-purple-600 hover:text-purple-800')
const advancedButtonClass = computed(() => isAppendixH.value
    ? 'border-teal-100 bg-teal-50 text-teal-700 hover:bg-teal-100'
    : 'border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100')
const softPanelClass = computed(() => isAppendixH.value
    ? 'border-teal-100 bg-teal-50/70'
    : 'border-purple-100 bg-purple-50/70')
const equationBarClass = computed(() => isAppendixH.value
    ? 'bg-teal-50 text-teal-700'
    : 'bg-purple-50 text-purple-700')

const stockTypeOptions = computed(() => isAppendixH.value
    ? ALL_STOCK_TYPE_OPTIONS.filter(option => option.value !== 'legacyStock')
    : ALL_STOCK_TYPE_OPTIONS)

const defaultAssumptions = computed(() => [
    { label: 'Stock Type', value: 'New Build' },
    { label: 'OOA', value: 'With OOA' },
    { label: 'Input Tax Credits', value: 'Not Claimed' },
])

// Derived option lists
const dwellingOptions = computed(() => {
    const dwellings = DWELLING_SETS[stockType.value] || []
    return dwellings.map(dwellingName => ({ label: dwellingName, value: dwellingName }))
})

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

const appendixDwellingRows = computed(() => {
    if (!isAppendixH.value) return []
    const table = store.appendixH[tableKey.value] ?? []
    return table
        .filter(row => row.dwelling === dwelling.value && isValidAppendixHParticipantRow(row))
        .sort((a, b) => b.sdaEligibleCount - a.sdaEligibleCount)
})

const appendixEligibleOptions = computed(() => {
    const rows = appendixDwellingRows.value
    const maxResidents = rows[0]?.maxResidents ?? 0
    return rows.map(row => {
        const eligible = row.sdaEligibleCount
        const otherResidents = Math.max(0, maxResidents - eligible)
        const eligibleLabel = `${eligible} SDA-eligible ${eligible === 1 ? 'participant' : 'participants'}`
        const otherLabel = otherResidents === 0
            ? 'all residents SDA-eligible'
            : `${otherResidents} non-SDA-eligible ${otherResidents === 1 ? 'resident' : 'residents'}`
        return { label: `${eligibleLabel} · ${otherLabel}`, value: eligible }
    })
})

// Direct state reads - no getter-function indirection so Vue tracks deps reliably.
const currentDwellingRow = computed(() => {
    const table = isAppendixH.value
        ? store.appendixH[tableKey.value]
        : store.benchmarks[tableKey.value]
    if (!table) return null
    return table.find(row => row.dwelling === dwelling.value
        && (!isAppendixH.value || isValidAppendixHParticipantRow(row))
        && (!isAppendixH.value || String(row.sdaEligibleCount) === String(sdaEligibleCount.value))) ?? null
})

const benchmarkAmount = computed(() => {
    const row = currentDwellingRow.value
    if (!row) return null
    return row[benchmarkKey.value] ?? null
})

const isAppendixAmountUnavailable = computed(() => isAppendixH.value && !currentDwellingRow.value)

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
        ? (isAppendixH.value
            ? 'bg-teal-50/80 text-teal-950 shadow-sm border-teal-600 ring-2 ring-teal-500/25'
            : 'bg-purple-50/80 text-purple-950 shadow-sm border-purple-600 ring-2 ring-purple-500/25')
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 border-gray-200'
}

function optionBylineClass(currentValue, optionValue) {
    if (currentValue !== optionValue) return 'text-gray-500'
    return isAppendixH.value ? 'text-teal-700' : 'text-purple-700'
}

// Cascade resets
function setStockType(val) {
    if (isAppendixH.value && val === 'legacyStock') return
    stockType.value = val
    const dwellings = isAppendixH.value
        ? dwellingOptions.value.map(option => option.value)
        : (DWELLING_SETS[val] || [])
    if (!dwellings.includes(dwelling.value)) dwelling.value = dwellings[0] || ''
    const cats = CATEGORY_SETS[val] || []
    if (!cats.includes(designCategory.value)) designCategory.value = cats[0] || ''
    syncAppendixEligibleCount()
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
    syncAppendixEligibleCount()
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

function syncAppendixEligibleCount() {
    if (!isAppendixH.value) return
    const counts = appendixDwellingRows.value.map(row => String(row.sdaEligibleCount))
    if (!counts.includes(String(sdaEligibleCount.value))) {
        sdaEligibleCount.value = appendixDwellingRows.value[0]?.sdaEligibleCount ?? null
    }
}

function syncAppendixDwelling() {
    if (!isAppendixH.value) return
    const validDwellings = dwellingOptions.value.map(option => option.value)
    if (!validDwellings.includes(dwelling.value)) {
        dwelling.value = validDwellings[0] ?? ''
    }
    syncAppendixEligibleCount()
}

function selectCalculator(calculator) {
    if (calculator === 'appendixH' && store.hasData && !store.hasAppendixH) return
    activeCalculator.value = calculator
    if (calculator === 'appendixH' && stockType.value === 'legacyStock') {
        setStockType('newBuild')
    }
    syncAppendixDwelling()
    showCalculatorChooser.value = false
    lastActivityAt = Date.now()
    scheduleStalePrompt()
    void trackEverhomesToolUsage({
        toolId: 'participant-sda-funding',
        action: 'calculator_selected',
        variant: calculator === 'appendixH' ? 'appendix_h' : 'sda',
    })
}

function openCalculatorChooser() {
    showCalculatorChooser.value = true
}

function promptForStaleCalculator() {
    if (!showCalculatorChooser.value) showCalculatorChooser.value = true
}

function scheduleStalePrompt() {
    if (staleTimer) window.clearTimeout(staleTimer)
    if (showCalculatorChooser.value) return
    const remaining = Math.max(0, STALE_AFTER_MS - (Date.now() - lastActivityAt))
    staleTimer = window.setTimeout(promptForStaleCalculator, remaining)
}

function recordActivity() {
    if (showCalculatorChooser.value || document.hidden) return
    lastActivityAt = Date.now()
    scheduleStalePrompt()
}

function handleVisibilityChange() {
    if (document.hidden) return
    if (Date.now() - lastActivityAt >= STALE_AFTER_MS) {
        promptForStaleCalculator()
        return
    }
    scheduleStalePrompt()
}

function handlePageShow(event) {
    if (event.persisted) promptForStaleCalculator()
}

// Init
onMounted(async () => {
    document.body.style.overflow = 'hidden'
    document.addEventListener('pointerdown', recordActivity, { capture: true, passive: true })
    document.addEventListener('keydown', recordActivity, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pageshow', handlePageShow)

    await nextTick()
    chooserFirstButton.value?.focus()

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

    syncAppendixDwelling()
})

watch(showCalculatorChooser, async show => {
    document.body.style.overflow = show ? 'hidden' : ''
    if (show) {
        if (staleTimer) window.clearTimeout(staleTimer)
        await nextTick()
        chooserFirstButton.value?.focus()
    }
})

watch(appendixDwellingRows, syncAppendixEligibleCount)

watch(() => store.appendixH[tableKey.value], syncAppendixDwelling)

watch([activeCalculator, adjustedAmount], ([calculator, amount]) => {
    if (!calculator || amount === null) return
    void trackEverhomesToolUsage({
        toolId: 'participant-sda-funding',
        action: 'calculation_completed',
        variant: calculator === 'appendixH' ? 'appendix_h' : 'sda',
    })
})

onBeforeUnmount(() => {
    if (staleTimer) window.clearTimeout(staleTimer)
    document.body.style.overflow = ''
    document.removeEventListener('pointerdown', recordActivity, { capture: true })
    document.removeEventListener('keydown', recordActivity, { capture: true })
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('pageshow', handlePageShow)
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

.chooser-enter-active,
.chooser-leave-active {
    transition: opacity 0.2s ease;
}
.chooser-enter-active > div,
.chooser-leave-active > div {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.chooser-enter-from,
.chooser-leave-to {
    opacity: 0;
}
.chooser-enter-from > div,
.chooser-leave-to > div {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}
</style>
