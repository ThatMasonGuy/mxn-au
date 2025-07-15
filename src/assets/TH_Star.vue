<template>
  <svg :width="size" :height="size" viewBox="0 0 1536 1024" xmlns="http://www.w3.org/2000/svg"
    :style="{ verticalAlign: 'middle' }">
    <defs>
      <linearGradient :id="uniqueGradientId" x1="0" x2="0" y1="0" y2="1">
        <stop v-if="color === 'gold'" offset="0%" stop-color="#FFFBE9" />
        <stop v-if="color === 'gold'" offset="60%" stop-color="#FFD700" />
        <stop v-if="color === 'gold'" offset="100%" stop-color="#B99A16" />
        <stop v-if="color === 'red'" offset="0%" stop-color="#FFB5B5" />
        <stop v-if="color === 'red'" offset="60%" stop-color="#E84855" />
        <stop v-if="color === 'red'" offset="100%" stop-color="#A30015" />
        <stop v-if="color === 'white'" offset="0%" stop-color="#FFFFFF" />
        <stop v-if="color === 'white'" offset="80%" stop-color="#E6E6E6" />
        <stop v-if="color === 'white'" offset="100%" stop-color="#B7C0C7" />
      </linearGradient>
    </defs>
    <g>
      <path v-for="(point, idx) in points" :key="idx" :transform="point.transform" :d="point.d"
        :fill="idx < steps ? `url(#${uniqueGradientId})` : 'none'" :stroke="`url(#${uniqueGradientId})`"
        :stroke-width="2" :opacity="1" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: { type: String, default: 'gold' },
  size: { type: [String, Number], default: 32 },
  steps: { type: Number, default: 0 },
  starId: { type: String, default: () => Math.random().toString(36).substr(2, 9) } // new!
});

const uniqueGradientId = computed(() => `${props.color}-gradient-${props.starId}`);

// The 5 points of the star, IN ORDER: start at top, go anti-clockwise
const points = [
  { // Top
    transform: "translate(749,36)",
    d: "m0 0 3 3 13 24 13 23 14 26 16 29 15 28 13 23 12 22 13 23 16 30 13 23 15 28 9 16-1 5-10 13-14 19-16 21-14 19-10 13-16 21-14 19-10 13-15 20-10 13-15 20-14 18-3 4-4-2-10-13-13-17-14-18-9-12-16-21-15-20-13-17-16-21-21-28-16-21-14-19-5-7 2-5 14-26 13-23 14-26 10-18 13-24 10-18 13-24 13-23 10-19 13-23 7-14 13-23 12-23zm0 57-16 29-13 24-13 23-15 28-16 29-13 24-13 23-14 25-16 29-3 6 14 18 14 19 14 18 14 19 16 21 15 20 16 21 21 28 9 13 5-5 14-19 10-13 51-68 16-21 24-32 13-17 1-2-13-23-15-27-14-25-13-23-13-24-13-23-12-22-40-72z"
  },
  { // Top left
    transform: "translate(570,363)",
    d: "m0 0h4l14 19 12 15 13 17 13 16 20 26 11 14 12 15 11 14 14 18 33 42v3l-42 15-59 21-48 17-43 15-45 16-15 5-4-1-11-11-7-8-8-8-7-8-7-7-7-8-9-9-7-8-15-16-11-12-16-17-12-13-15-16-11-12-14-15-24-26-15-16-11-12-15-16-14-15v-2l60-6 63-6 56-5 94-9zm-12 28-85 8-177 16-6 1 6 7 11 12 15 16 9 10 15 16 12 13 11 12 14 15 12 13 4 5 13 13 7 8 4 5h2l2 4 8 8 7 8 16 17 12 13 9 10 11-3 48-17 105-37 36-13 5-2-2-4-10-13-13-16-13-17-14-17-10-13-11-14-12-15-13-17-13-16-11-15z"
  },
  { // Bottom left
    transform: "translate(733,586)",
    d: "m0 0h3v250l-9 6-25 14-48 28-28 16-27 16-25 14-24 14-26 15-17 10-24 14-26 15-27 16h-2l1-9 25-143 23-134 9-53 4-3 54-19 38-14 29-10 94-33zm-24 36-18 7-54 19-89 32-37 13-2 3-19 114-19 110-7 40 1 3 14-8 17-10 29-17 24-14 26-15 48-28 78-45 9-5v-199z"
  },
  { // Bottom right
    transform: "translate(766,586)",
    d: "m0 0 9 2 34 12 28 10 47 17 151 55 2 9 11 68 21 133 20 125-1 3-42-24-50-28-24-14-27-15-24-14-22-12-21-12-26-15-50-28-23-13-12-7-1-1zm26 37v199l21 12 25 14 23 13 27 15 21 12 18 10 49 28 27 15 21 12 23 13 8 4-6-38-16-97-16-101-5-31-5-3-44-16-49-18-50-18-47-17-22-8z"
  },
  { // Top right
    transform: "translate(929,363)",
    d: "m0 0h11l328 30 21 2 3 1v2h-2l-2 4-8 8-7 8-15 16-12 13-14 15-12 13-14 15-9 10-15 16-12 13-14 15-11 12-12 13-15 16-12 13-30 32-12 13-10 10-5 6-7-1-50-18-140-50-61-22-15-6 2-5 13-16 9-12 12-15 10-13 22-28 14-18 13-17 11-14 28-36 13-17zm13 28-13 16-13 17-12 15-44 56-12 15-10 13-13 16-7 9 3 3 46 16 53 19 60 21 53 19 6 2h4l7-8 7-7 7-8 10-10 7-8 14-15 11-12 9-10 44-47 12-13 14-15 12-13 9-10 16-17 14-15 1-3-265-24-20-2z"
  },
]
</script>
