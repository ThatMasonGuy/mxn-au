<!-- src/pages/topHeroes/TH_SpeedUps.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
    <TopHeroesHeader />

    <div class="flex-grow flex flex-col items-center p-4 sm:p-8">
      <h1 class="text-2xl sm:text-4xl font-extrabold text-center mb-4 sm:mb-8">
        Speed-up Calculator
      </h1>

      <div class="overflow-x-auto w-full max-w-screen-lg">
        <table class="table-auto w-full text-center border-collapse border border-gray-600 text-sm sm:text-base">
          <thead class="bg-gray-800">
            <tr>
              <th class="border border-gray-600 px-2 sm:px-4 py-2">Type</th>
              <th v-for="time in times" :key="time" class="border border-gray-600 px-2 sm:px-4 py-2">
                {{ time }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="type in speedUpTypes" :key="type">
              <td class="border border-gray-600 px-2 sm:px-4 py-2 font-medium">
                {{ type }}
              </td>
              <td v-for="time in times" :key="time" class="border border-gray-600 px-2 sm:px-4 py-2">
                <shad-input v-model.number="speedUps[type][time]" type="number" placeholder="0"
                  class="w-16 sm:w-20 text-center bg-gray-800 text-white border border-gray-600 rounded text-xs sm:text-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 sm:mt-6 w-full max-w-screen-lg flex flex-col sm:flex-row justify-between gap-2">
        <shad-button @click="calculateTotals"
          class="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md text-sm sm:text-base">
          Calculate Totals
        </shad-button>
        <shad-button @click="clearInputs"
          class="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md text-sm sm:text-base">
          Clear All
        </shad-button>
      </div>

      <div v-if="results" class="mt-6 sm:mt-8 p-4 sm:p-6 w-full max-w-screen-lg bg-gray-800 rounded-md shadow-inner text-sm sm:text-base">
        <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-2">Results</h2>
        <div class="grid grid-cols-1 gap-2 sm:gap-4">
          <div v-for="(total, type) in results" :key="type" class="flex justify-between border-b border-gray-600 py-1 sm:py-2">
            <div class="text-base sm:text-lg">{{ type }}</div>
            <div class="pl-4 text-base text-right sm:text-xl font-bold">{{ formatTime(total) }}</div>
          </div>
        </div>

        <p class="mt-4 sm:mt-6 text-lg sm:text-xl font-extrabold text-center">
          Total Speed-ups:<span class="text-blue-500 pl-2">{{ formatTime(grandTotal) }}</span>
        </p>
      </div>
    </div>

    <TopHeroesFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Input as ShadInput, Button as ShadButton } from '@/components/ui';
import TopHeroesHeader from '@/components/TopHeroesHeader.vue';
import TopHeroesFooter from '@/components/TopHeroesFooter.vue';

const speedUpTypes = ['Universal', 'Building', 'Research', 'Training', 'Healing'];
const times = [
  '1 Minute',
  '5 Minutes',
  '15 Minutes',
  '30 Minutes',
  '1 Hour',
  '3 Hours',
  '8 Hours',
];

const timeConversion = {
  '1 Minute': 1,
  '5 Minutes': 5,
  '15 Minutes': 15,
  '30 Minutes': 30,
  '1 Hour': 60,
  '3 Hours': 180,
  '8 Hours': 480,
};

const speedUps = ref(
  Object.fromEntries(
    speedUpTypes.map((type) => [
      type,
      Object.fromEntries(times.map((time) => [time, 0])),
    ])
  )
);

const results = ref(null);
const grandTotal = ref(0);

const calculateTotals = () => {
  let total = 0;
  results.value = {};

  for (const type of speedUpTypes) {
    let typeTotal = 0;
    for (const time of times) {
      typeTotal += speedUps.value[type][time] * timeConversion[time];
    }
    results.value[type] = typeTotal;
    total += typeTotal;
  }

  grandTotal.value = total;
};

const clearInputs = () => {
  for (const type of speedUpTypes) {
    for (const time of times) {
      speedUps.value[type][time] = 0;
    }
  }
  results.value = null;
  grandTotal.value = 0;
};

const formatTime = (totalMinutes) => {
  const units = {
    year: 525600,
    month: 43200,
    week: 10080,
    day: 1440,
    hour: 60,
    minute: 1,
  };
  const result = [];

  for (const [unit, value] of Object.entries(units)) {
    const count = Math.floor(totalMinutes / value);
    if (count > 0) {
      result.push(`${count} ${unit}${count > 1 ? 's' : ''}`);
      totalMinutes %= value;
    }
  }

  return result.length > 0 ? result.join(', ') : '0 minutes';
};
</script>
