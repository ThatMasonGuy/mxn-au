<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent title="Placement Fee Calculator" subtitle="SDA Participant Onboarding Cost Tool"
            gradient="from-emerald-500 to-lime-500" />

        <main class="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-5">
            <div class="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6">
                <div class="flex flex-col gap-1 mb-5">
                    <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Setup</p>
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Placement Details</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SmartInput v-model="moveInDate" label="Move-in Date" type="date" />
                    <SmartInput
                        v-model="durationType"
                        label="Duration"
                        type="select"
                        :options="durationOptions"
                    />
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input
                            type="date"
                            :value="calculatedEndDate"
                            disabled
                            class="w-full px-3 py-2 text-sm bg-gray-50 text-gray-600 border border-gray-200 rounded-md disabled:cursor-not-allowed"
                        />
                        <p class="mt-1 text-xs text-gray-500">
                            {{ calculatedEndDate ? `Ends ${formatDate(calculatedEndDate)}` : 'Only applies to 3 week placements' }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md border border-gray-100 p-4 sm:p-6">
                <div class="flex flex-col gap-1 mb-5">
                    <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Rates</p>
                    <h2 class="text-lg sm:text-xl font-semibold text-gray-800">Rate Information</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Annual SDA</label>
                        <label class="group relative w-full flex items-center cursor-text">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 group-hover:text-teal-500 transition">
                                $
                            </span>
                            <input
                                :value="annualSdaDisplay"
                                type="text"
                                inputmode="decimal"
                                placeholder="0.00"
                                class="w-full min-w-0 max-w-full pl-7 pr-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md group-focus-within:ring-2 group-focus-within:ring-teal-500 focus:outline-none placeholder-gray-400 transition"
                                @input="annualSda = parseCurrencyInput($event.target.value)"
                                @blur="annualSdaTouched = true"
                            />
                        </label>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fortnightly RRC</label>
                        <label class="group relative w-full flex items-center cursor-text">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 group-hover:text-teal-500 transition">
                                $
                            </span>
                            <input
                                :value="fortnightlyRrcDisplay"
                                type="text"
                                inputmode="decimal"
                                placeholder="0.00"
                                class="w-full min-w-0 max-w-full pl-7 pr-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md group-focus-within:ring-2 group-focus-within:ring-teal-500 focus:outline-none placeholder-gray-400 transition"
                                @input="fortnightlyRrc = parseCurrencyInput($event.target.value)"
                                @blur="fortnightlyRrcTouched = true"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-100">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Result</p>
                            <h2 class="mt-1 text-lg sm:text-xl font-semibold text-gray-800">Calculated Fee</h2>
                        </div>
                        <div class="text-left sm:text-right">
                            <p class="text-sm text-gray-500">Placement Fee</p>
                            <p class="text-3xl sm:text-4xl font-bold text-emerald-700 break-words">
                                {{ formatCurrency(placementFee) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div
                        v-for="result in resultCards"
                        :key="result.label"
                        class="p-4 sm:p-5 bg-gray-50/60"
                    >
                        <p class="text-sm text-gray-500 mb-1">{{ result.label }}</p>
                        <p class="text-xl sm:text-2xl font-bold text-gray-900 break-words">{{ result.value }}</p>
                        <p class="mt-1 text-xs text-gray-500">{{ result.hint }}</p>
                    </div>
                </div>

                <div class="p-4 sm:p-6 bg-emerald-50 border-t border-emerald-100">
                    <div class="flex gap-3">
                        <InformationCircleIcon class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div class="text-sm text-emerald-900">
                            <p class="font-semibold">How this was calculated</p>
                            <p class="mt-1 leading-6">
                                {{ calculationSummary }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/features/everhomes/components/ui/ToolBannerComponent.vue'
import SmartInput from '@/features/everhomes/components/ui/SmartInput.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

const moveInDate = ref('')
const durationType = ref('Fixed')
const annualSda = ref(0)
const fortnightlyRrc = ref(0)
const annualSdaTouched = ref(false)
const fortnightlyRrcTouched = ref(false)

const durationOptions = [
    { label: 'Fixed', value: 'Fixed' },
    { label: '3 Weeks', value: '3 Weeks' }
]

const locale = undefined
const placementDays = 21

function asNumber(value) {
    return Number(value) || 0
}

function formatCurrency(value) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(asNumber(value))
}

function formatInputNumber(value) {
    if (!asNumber(value)) return ''

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(asNumber(value))
}

function parseCurrencyInput(value) {
    const cleaned = String(value).replace(/[^\d.]/g, '')
    const firstDecimal = cleaned.indexOf('.')
    const normalised = firstDecimal === -1
        ? cleaned
        : `${cleaned.slice(0, firstDecimal + 1)}${cleaned.slice(firstDecimal + 1).replace(/\./g, '')}`

    return Number(normalised) || 0
}

function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }).format(asNumber(value))
}

function formatDate(value) {
    if (!value) return 'not set'

    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date(`${value}T00:00:00`))
}

const calculatedEndDate = computed(() => {
    if (durationType.value === '3 Weeks' && moveInDate.value) {
        const date = new Date(`${moveInDate.value}T00:00:00`)
        date.setDate(date.getDate() + placementDays)
        return date.toISOString().split('T')[0]
    }
    return ''
})

const annualSdaDisplay = computed(() => {
    return annualSdaTouched.value || asNumber(annualSda.value) ? formatInputNumber(annualSda.value) : ''
})

const fortnightlyRrcDisplay = computed(() => {
    return fortnightlyRrcTouched.value || asNumber(fortnightlyRrc.value) ? formatInputNumber(fortnightlyRrc.value) : ''
})

const dailyRateSda = computed(() => {
    return durationType.value === '3 Weeks' ? asNumber(annualSda.value) / 365 : 0
})

const dailyRateRrc = computed(() => {
    return durationType.value === '3 Weeks' ? asNumber(fortnightlyRrc.value) / 14 : 0
})

const placementFee = computed(() => {
    if (durationType.value === 'Fixed') return 6600
    if (durationType.value === '3 Weeks') {
        return (dailyRateSda.value + dailyRateRrc.value) * placementDays
    }
    return 0
})

const resultCards = computed(() => [
    {
        label: 'Daily Rate (SDA)',
        value: formatCurrency(dailyRateSda.value),
        hint: `${formatCurrency(asNumber(annualSda.value))} annual / ${formatNumber(365)} days`
    },
    {
        label: 'Daily Rate (RRC)',
        value: formatCurrency(dailyRateRrc.value),
        hint: `${formatCurrency(asNumber(fortnightlyRrc.value))} fortnightly / ${formatNumber(14)} days`
    },
    {
        label: 'Duration',
        value: durationType.value === '3 Weeks' ? `${formatNumber(placementDays)} days` : 'Fixed fee',
        hint: durationType.value === '3 Weeks' ? 'Used for the placement fee total' : 'Uses the standard placement amount'
    }
])

const calculationSummary = computed(() => {
    if (durationType.value === 'Fixed') {
        return `Fixed placements use the standard placement fee of ${formatCurrency(placementFee.value)}. SDA and RRC rates are not included in the fixed calculation.`
    }

    return `For a 3 week placement, the tool divides annual SDA (${formatCurrency(asNumber(annualSda.value))}) by ${formatNumber(365)} and fortnightly RRC (${formatCurrency(asNumber(fortnightlyRrc.value))}) by ${formatNumber(14)}, then adds those daily rates together and multiplies by ${formatNumber(placementDays)} days.`
})
</script>
