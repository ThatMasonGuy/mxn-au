<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent title="SDA Price Calculator" subtitle="Estimate Location Adjusted Annual SDA Amount"
            gradient="from-purple-600 to-pink-500" />

        <main class="container mx-auto px-4 py-8 space-y-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Dwelling Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SmartInput v-model="dwelling" label="Dwelling enrolled as" type="select"
                        :options="dwellingOptions" />
                    <SmartInput v-model="buildingType" label="Building Type" type="select" :options="buildingOptions" />
                    <SmartInput v-model="designCategory" label="Design Category" type="select"
                        :options="designOptions" />
                </div>
                <!-- Assumptions Info Bar -->
                <div class="mt-4">
                    <div class="p-2 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-700">
                        <div class="flex items-start justify-between">
                            <div class="flex items-start">
                                <InformationCircleIcon class="h-4 w-4 text-blue-500 mt-0.5" />
                                <p class="ml-2">
                                    Calculations assume <strong>With OOA</strong>, <strong>With Fire
                                        Sprinklers</strong>,
                                    and <strong>No Tax Credits Claimed</strong>.
                                </p>
                            </div>
                            <button @click="showAdvanced = !showAdvanced"
                                class="text-blue-700 hover:underline ml-4 text-sm font-medium">
                                {{ showAdvanced ? 'Hide assumptions' : 'Adjust assumptions' }}
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Toggleable Additional Info Section -->
                <Transition name="expand">
                    <div v-show="showAdvanced" class="bg-white/80 rounded-lg shadow-lg p-6 mt-4">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4">Additional Info</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SmartInput v-model="ooa" label="On-site Overnight Assistance (OOA)" type="select"
                                :options="ooaOptions" />
                            <SmartInput v-model="sprinklers" label="Fire Sprinklers" type="select"
                                :options="sprinklerOptions" />
                            <SmartInput v-model="inputTax" label="Input Tax Credits Claimed?" type="select"
                                :options="taxOptions" />
                        </div>
                    </div>
                </Transition>

            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Location Info</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SmartInput v-model="location" label="Location (SA4)" type="select" :options="locationOptions" />
                    <SmartInput v-model="locationFactor" label="Location Factor" type="number" step="0.01"
                        placeholder="0.98" />
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Results</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SmartInput v-model="benchmarkPrice" label="Annual Benchmark Price" type="currency" prefix="$"
                        placeholder="0.00" />
                    <div class="text-center">
                        <p class="text-sm text-gray-600 mb-1">Location Adjusted SDA Amount</p>
                        <p class="text-2xl font-bold text-purple-600">${{ adjustedSdaAmount.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/components/everhomes/ui/ToolBannerComponent.vue'
import SmartInput from '@/components/everhomes/ui/SmartInput.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'

const showAdvanced = ref(false)

// Form Fields
const dwelling = ref('Post-2023 New Build')
const buildingType = ref('Villa/Duplex/Townhouse, 1 resident')
const designCategory = ref('High Physical Support')
const ooa = ref('With OOA')
const sprinklers = ref('With Fire Sprinklers')
const inputTax = ref('Input Tax Credits were not claimed')
const location = ref('QLD - Logan - Beaudesert')
const locationFactor = ref(0.98)
const benchmarkPrice = ref(77114)

// Options
const dwellingOptions = [
    { label: 'Post-2023 New Build', value: 'Post-2023 New Build' },
    { label: 'Legacy Stock', value: 'Legacy Stock' }
]

const buildingOptions = [
    { label: 'Villa/Duplex/Townhouse, 1 resident', value: 'Villa/Duplex/Townhouse, 1 resident' },
    { label: 'Apartment, 1 resident', value: 'Apartment, 1 resident' }
]

const designOptions = [
    { label: 'High Physical Support', value: 'High Physical Support' },
    { label: 'Robust', value: 'Robust' },
    { label: 'Improved Liveability', value: 'Improved Liveability' },
    { label: 'Fully Accessible', value: 'Fully Accessible' }
]

const ooaOptions = [
    { label: 'With OOA', value: 'With OOA' },
    { label: 'Without OOA', value: 'Without OOA' }
]

const sprinklerOptions = [
    { label: 'With Fire Sprinklers', value: 'With Fire Sprinklers' },
    { label: 'Without Fire Sprinklers', value: 'Without Fire Sprinklers' }
]

const taxOptions = [
    { label: 'Input Tax Credits were not claimed', value: 'Input Tax Credits were not claimed' },
    { label: 'Input Tax Credits were claimed', value: 'Input Tax Credits were claimed' }
]

const locationOptions = [
    { label: 'QLD - Logan - Beaudesert', value: 'QLD - Logan - Beaudesert' },
    { label: 'NSW - Central Coast', value: 'NSW - Central Coast' }
]

// Calculated
const adjustedSdaAmount = computed(() => benchmarkPrice.value * locationFactor.value)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

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
    max-height: 500px;
    /* or something generous like 1000px */
    opacity: 1;
}
</style>