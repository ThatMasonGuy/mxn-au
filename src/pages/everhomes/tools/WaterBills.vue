<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent title="Water Bill Calculator" subtitle="SDA Participant Cost Distribution Tool"
            gradient="from-teal-500 to-blue-500" />

        <main class="container mx-auto px-4 py-8">
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Bill Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SmartInput v-model="billCost" label="Bill Cost ($)" type="currency" prefix="$" placeholder="0.00" />
                    <SmartInput v-model="billStartDate" label="Bill Start Date" type="date" />
                    <SmartInput v-model="billEndDate" label="Bill End Date" type="date" />
                </div>
                <div v-if="dateError" class="mt-2 text-red-500 text-sm">
                    {{ dateError }}
                </div>
                <div class="mt-4">
                    <div class="p-2 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-700">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <InformationCircleIcon class="h-4 w-4 text-blue/20" />
                            </div>
                            <div class="ml-3">
                                <p>Bill spans <strong>{{ billDurationDays }}</strong> days with a daily rate of
                                    <strong>${{ dailyRate.toFixed(2) }}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="flex bg-gray-100 border-b border-gray-200">
                    <button @click="activeTab = 'easy'"
                        :class="['px-6 py-3 text-sm md:text-base font-medium focus:outline-none',
                            activeTab === 'easy' ? 'bg-white text-teal-600 border-t-2 border-teal-500' : 'text-gray-600']">
                        Easy Mode
                    </button>
                    <button @click="activeTab = 'advanced'"
                        :class="['px-6 py-3 text-sm md:text-base font-medium focus:outline-none',
                            activeTab === 'advanced' ? 'bg-white text-teal-600 border-t-2 border-teal-500' : 'text-gray-600']">
                        Advanced Mode
                    </button>
                </div>

                <div class="p-6">
                    <div v-if="activeTab === 'easy'">
                        <div class="mb-6">
                            <div class="flex flex-wrap gap-4 items-end">
                                <div class="flex-1 min-w-[200px]">
                                    <SmartInput v-model="participantCount" label="Number of Participants" type="number" placeholder="1" min="1" />
                                </div>
                                <div class="flex-1 min-w-[200px]">
                                    <SmartInput v-model="easyModeStartDate" :min="billStartDate" :max="billEndDate" label="Participation Start Date" type="date" />
                                </div>
                                <div class="flex-1 min-w-[200px]">
                                    <SmartInput v-model="easyModeEndDate" :min="easyModeStartDate || billStartDate" :max="billEndDate" label="Participation Start Date" type="date" />
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 space-y-4">
                            <div class="bg-teal-50 p-6 rounded-lg shadow-sm border border-teal-100">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="text-center">
                                        <p class="text-sm text-gray-600 mb-1">Cost Per Participant</p>
                                        <p class="text-2xl font-bold text-teal-700">${{
                                            easyModePerPersonCost.toFixed(2)
                                            }}</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-sm text-gray-600 mb-1">Untenanted Cost</p>
                                        <p class="text-2xl font-bold text-teal-700">${{
                                            easyModeUntenantedCost.toFixed(2) }}</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-sm text-gray-600 mb-1">Total Bill</p>
                                        <p class="text-2xl font-bold text-teal-700">${{ billCost || 0 }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-700">
                                <p>For {{ participantCount }} participant(s) over {{ easyModeDays }} days from {{
                                    formatDate(easyModeStartDate) }} to {{ formatDate(easyModeEndDate) }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'advanced'">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Participant</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date</th>
                                        <th
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Still Active</th>
                                        <th
                                            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cost ($)</th>
                                        <th
                                            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr v-for="(participant, index) in participants" :key="index">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Participant_{{ index + 1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <input type="date" v-model="participant.startDate" :min="billStartDate"
                                                :max="billEndDate"
                                                class="px-2 py-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500" />
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <input type="date"
                                                :value="participant.stillActive ? billEndDate : participant.endDate"
                                                :disabled="participant.stillActive"
                                                @input="participant.endDate = $event.target.value"
                                                :min="participant.startDate" :max="billEndDate"
                                                class="px-2 py-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500" />

                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <label class="inline-flex items-center">
                                                <input type="checkbox" v-model="participant.stillActive"
                                                    class="rounded text-teal-600 focus:ring-teal-500" />
                                            </label>
                                        </td>
                                        <td
                                            class="px-6 py-4 text-gray-700 whitespace-nowrap text-sm text-right font-medium">
                                            ${{ getCostForParticipant(index).toFixed(2) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <button @click="removeParticipant(index)"
                                                class="text-red-600 hover:text-red-800 focus:outline-none">
                                                <span class="sr-only">Delete</span>
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr class="bg-gray-50">
                                        <td colspan="4"
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Untenanted Cost
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                                            ${{ advancedResults?.untenantedCost?.toFixed(2) || '0.00' }}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr class="bg-teal-50">
                                        <td colspan="4"
                                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-800">
                                            Total
                                        </td>
                                        <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-right text-teal-800 font-bold">
                                            ${{ advancedResults?.total?.toFixed(2) || (billCost || 0).toFixed(2) }}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="mt-4">
                            <button @click="addParticipant"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                Add Another Participant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
    differenceInCalendarDays,
    eachDayOfInterval,
    isWithinInterval,
    parseISO,
    format,
    isAfter
} from 'date-fns';
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/components/everhomes/ui/ToolBannerComponent.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'
import SmartInput from '@/components/everhomes/ui/SmartInput.vue'

const billCost = ref(0);
const billStartDate = ref('');
const billEndDate = ref('');
const dateError = ref('');

const activeTab = ref('easy');

const participantCount = ref(1);
const easyModeStartDate = ref('');
const easyModeEndDate = ref('');

const participants = ref([
    {
        name: 'Participant_1',
        startDate: '',
        endDate: '',
        stillActive: false,
    }
]);

function formatDate(dateString) {
    if (!dateString) return 'Not set';

    const date = parseISO(dateString);
    return format(date, 'dd MMM yyyy');
}

const billDurationDays = computed(() => {
    if (!billStartDate.value || !billEndDate.value) return 0;

    const start = parseISO(billStartDate.value);
    const end = parseISO(billEndDate.value);

    if (isAfter(start, end)) {
        dateError.value = 'End date must be after start date';
        return 0;
    } else {
        dateError.value = '';
    }

    return differenceInCalendarDays(end, start) + 1;
});

const dailyRate = computed(() => {
    if (billDurationDays.value <= 0 || !billCost.value) return 0;
    return billCost.value / billDurationDays.value;
});

const easyModeDays = computed(() => {
    if (!easyModeStartDate.value || !easyModeEndDate.value) return 0;

    const start = parseISO(easyModeStartDate.value);
    const end = parseISO(easyModeEndDate.value);

    if (isAfter(start, end)) return 0;

    return differenceInCalendarDays(end, start) + 1;
});

const easyModeTotalCost = computed(() => {
    return dailyRate.value * easyModeDays.value;
});

const easyModePerPersonCost = computed(() => {
    if (participantCount.value <= 0 || easyModeTotalCost.value <= 0) return 0;
    return easyModeTotalCost.value / participantCount.value;
});

const easyModeUntenantedCost = computed(() => {
    if (!billCost.value) return 0;
    return Math.max(0, billCost.value - easyModePerPersonCost.value * participantCount.value);
});

function addParticipant() {
    const newIndex = participants.value.length + 1;
    participants.value.push({
        name: `Participant_${newIndex}`,
        startDate: '',
        endDate: '',
        stillActive: false,
    });
}

function removeParticipant(index) {
    participants.value.splice(index, 1);

    participants.value.forEach((participant, idx) => {
        participant.name = `Participant_${idx + 1}`;
    });

    if (participants.value.length === 0) {
        addParticipant();
    }
}

function calculateAdvancedCosts() {
    if (!billStartDate.value || !billEndDate.value || !billCost.value || participants.value.length === 0) {
        return null;
    }

    const billStart = parseISO(billStartDate.value);
    const billEnd = parseISO(billEndDate.value);
    const totalDays = differenceInCalendarDays(billEnd, billStart) + 1;
    const costPerDay = billCost.value / totalDays;

    const costMap = {};
    participants.value.forEach((_, i) => {
        const name = `Participant_${i + 1}`;
        costMap[name] = 0;
    });

    let untenantedCost = 0;
    const days = eachDayOfInterval({ start: billStart, end: billEnd });

    days.forEach(day => {
        const activeParticipants = participants.value
            .map((p, i) => {
                const rawStart = p.startDate ? parseISO(p.startDate) : null;
                const rawEnd = p.stillActive || !p.endDate ? billEnd : parseISO(p.endDate);
                const name = `Participant_${i + 1}`;

                if (!rawStart) return null;

                const clampedStart = rawStart < billStart ? billStart : rawStart;
                const clampedEnd = rawEnd > billEnd ? billEnd : rawEnd;

                if (isWithinInterval(day, { start: clampedStart, end: clampedEnd })) {
                    return { name };
                }

                return null;
            })
            .filter(Boolean);

        if (activeParticipants.length > 0) {
            const perPersonCost = costPerDay / activeParticipants.length;
            activeParticipants.forEach(p => {
                costMap[p.name] += perPersonCost;
            });
        } else {
            untenantedCost += costPerDay;
        }
    });

    const results = Object.entries(costMap).map(([name, cost]) => ({
        name,
        cost: parseFloat(cost.toFixed(2)),
    }));

    return {
        participants: results,
        untenantedCost: parseFloat(untenantedCost.toFixed(2)),
        total: parseFloat((results.reduce((acc, p) => acc + p.cost, 0) + untenantedCost).toFixed(2))
    };
}

const advancedResults = computed(() => {
    return calculateAdvancedCosts();
});

function getCostForParticipant(index) {
    if (!advancedResults.value) return 0;
    const name = `Participant_${index + 1}`;
    const result = advancedResults.value.participants.find(p => p.name === name);
    return result ? result.cost : 0;
}

watch(billStartDate, (newValue) => {
    if (newValue && !easyModeStartDate.value) {
        easyModeStartDate.value = newValue;
        participants.value.forEach(p => {
            if (!p.startDate) p.startDate = newValue;
        });
    }
});

watch(billEndDate, (newValue) => {
    if (newValue && !easyModeEndDate.value) {
        easyModeEndDate.value = newValue;
        participants.value.forEach(p => {
            if (!p.endDate && !p.stillActive) p.endDate = newValue;
        });
    }
});
</script>