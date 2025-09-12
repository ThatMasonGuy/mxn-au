import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useTotalScorePieOption(players, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const dayTasks = chartTheme.dayTasks
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const labels = allDays.value.map(d => dayTasks[`D${d}`])
        const pieData = labels.map((label, idx) => {
            const key = `Score (D${idx + 1})`
            const total = players.value.reduce((s, p) => s + (p[key] || 0), 0)
            return { name: label, value: total }
        })

        const option = {
            title: { text: 'Total Score by Day', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: { top: 30, left: 'center', textStyle: { fontWeight: 'bold' } }, // align with others
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    const percentage = params.percent
                    return `<strong>${params.name}</strong><br/>Score: ${formatTooltipNumber(params.value)} (${percentage}%)`
                }
            },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '58%'], // push slightly down to mirror Role’s top spacing + legend
                data: pieData,
                label: {
                    formatter: params => `${params.name}: ${params.percent}%`,
                    fontWeight: 'bold'
                },
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
            }],
            media: [{
                query: { maxWidth: 800 },
                option: {
                    series: [{ radius: ['40%', '65%'], center: ['50%', '56%'] }]
                }
            }]
        }

        return applyTheme(option)
    })
}
