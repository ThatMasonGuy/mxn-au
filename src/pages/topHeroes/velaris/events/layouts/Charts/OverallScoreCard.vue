<template>
    <div ref="cardObserverEl" class="bg-white rounded-lg shadow-md px-4 sm:px-6 md:px-8 py-6 sm:py-8
      flex flex-col items-center justify-center text-center gap-3 sm:gap-4">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-600">
            Overall Score
        </h3>

        <CountUp :endVal="score" :duration="2.5" :options="{ separator: ',' }"
            class="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold animate-score-gradient" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import CountUp from 'vue-countup-v3'

const props = defineProps({
    score: { type: Number, required: true }
})
</script>