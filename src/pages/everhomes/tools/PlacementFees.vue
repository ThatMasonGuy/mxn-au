<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent title="Placement Fee Calculator" subtitle="SDA Participant Onboarding Cost Tool"
            gradient="from-emerald-500 to-lime-500" />

        <main class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Placement Setup</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SmartInput v-model="moveInDate" label="Move-in Date" type="date" />
                    <SmartInput v-model="durationType" label="Duration" type="select" :options="[
                        { label: 'Fixed', value: 'Fixed' },
                        { label: '3 Weeks', value: '3 Weeks' }
                    ]" />
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                        <input type="date" :value="calculatedEndDate" disabled
                            class="w-full px-3 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded-md" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Rate Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SmartInput v-model="annualSda" label="Annual SDA" type="currency" prefix="$" placeholder="0.00" />
                    <SmartInput v-model="fortnightlyRrc" label="Fortnightly RRC" type="currency" prefix="$"
                        placeholder="0.00" />
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Calculated Results</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <p class="text-sm text-gray-600 mb-1">Daily Rate (SDA)</p>
                        <p class="text-2xl font-bold text-emerald-600">${{ dailyRateSda.toFixed(2) }}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-600 mb-1">Daily Rate (RRC)</p>
                        <p class="text-2xl font-bold text-emerald-600">${{ dailyRateRrc.toFixed(2) }}</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm text-gray-600 mb-1">Placement Fee</p>
                        <p class="text-2xl font-bold text-emerald-600">${{ placementFee.toFixed(2) }}</p>
                    </div>
                </div>
            </div>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/components/everhomes/ui/ToolBannerComponent.vue'
import SmartInput from '@/components/everhomes/ui/SmartInput.vue'

const moveInDate = ref('')
const durationType = ref('Fixed')
const annualSda = ref(0)
const fortnightlyRrc = ref(0)

const calculatedEndDate = computed(() => {
    if (durationType.value === '3 Weeks' && moveInDate.value) {
        const date = new Date(moveInDate.value)
        date.setDate(date.getDate() + 21)
        return date.toISOString().split('T')[0]
    }
    return ''
})

const dailyRateSda = computed(() => {
    return durationType.value === '3 Weeks' ? (annualSda.value || 0) / 365 : 0
})

const dailyRateRrc = computed(() => {
    return durationType.value === '3 Weeks' ? (fortnightlyRrc.value || 0) / 14 : 0
})

const placementFee = computed(() => {
    if (durationType.value === 'Fixed') return 6600
    if (durationType.value === '3 Weeks') {
        return ((dailyRateSda.value + dailyRateRrc.value) * 21)
    }
    return 0
})
</script>