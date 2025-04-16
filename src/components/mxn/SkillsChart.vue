<!-- src/components/mxn/SkillsChart.vue -->
<template>
    <section id="skills" class="px-8 py-16 max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-blue-300 mb-12">Skills Breakdown</h2>
        <canvas ref="chartCanvas" class="w-full max-w-xl mx-auto"></canvas>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const chartCanvas = ref(null)

onMounted(() => {
    new Chart(chartCanvas.value, {
        type: 'radar',
        data: {
            labels: ['Vue.js', 'Firebase', 'Tailwind', 'Python', 'Linux Admin', 'Automation', 'Game Dev'],
            datasets: [
                {
                    label: "Mason's Skills",
                    data: [95, 90, 93, 80, 85, 95, 88],
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 40,
                    suggestedMax: 100,
                    pointLabels: { color: '#fff' },
                    ticks: { color: '#999', backdropColor: 'transparent' }
                }
            }
        }
    })
})
</script>