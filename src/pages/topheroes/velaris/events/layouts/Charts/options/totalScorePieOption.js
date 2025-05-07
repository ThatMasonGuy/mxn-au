import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useTotalScorePieOption(players, allDays) {
    const { dayTasks } = useChartTheme()

    return computed(() => {
        const labels = allDays.value.map(d => dayTasks[`D${d}`])
        const pieData = labels.map((label, idx) => {
            const key = `Score (D${idx + 1})`
            const total = players.value.reduce((s, p) => s + (p[key] || 0), 0)
            return { name: label, value: total }
        })

        return {
            baseOption: {
                title: {
                    text: 'Total Score by Day',
                    left: 'center',
                    textStyle: { fontSize: 18, fontWeight: 'bold' }
                },
                tooltip: { trigger: 'item', formatter: '{b}<br/>Score: {c} ({d}%)' },
                legend: {
                    orient: 'horizontal',
                    top: 40,
                    left: 'center',
                    textStyle: { fontWeight: 'bold' }
                },
                series: [{
                    type: 'pie',
                    radius: ['45%', '70%'],
                    center: ['50%', '60%'],
                    data: pieData,
                    label: {
                        formatter: '{b}: {d}%',
                        fontWeight: 'bold'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0,0,0,0.2)'
                        }
                    }
                }]
            },
            media: [{
                query: { maxWidth: 600 },
                option: {
                    series: [{ radius: ['40%', '65%'] }],
                    grid: { left: '5%', right: '5%' }
                }
            }]
        }
    })
}
