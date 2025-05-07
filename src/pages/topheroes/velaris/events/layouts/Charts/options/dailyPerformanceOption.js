import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useDailyPerformanceOption(players, allDays) {
    const { playerGradients, dayTasks } = useChartTheme()

    return computed(() => {
        const top5 = players.value
            .filter(p => allDays.value.some(d => p[`Score (D${d})`] > 0))
            .slice(0, 5)

        const dayLabels = allDays.value.map(d => dayTasks[`D${d}`])

        return {
            baseOption: {
                title: { text: 'Daily Performance (Top 5)', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(50,50,50,0.9)',
                    borderColor: '#888',
                    borderWidth: 1,
                    textStyle: { color: '#fff' },
                    axisPointer: { type: 'line', lineStyle: { color: '#bbb', type: 'dashed' } }
                },
                grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
                xAxis: {
                    type: 'category',
                    data: dayLabels,
                    axisLabel: { fontWeight: 'bold', interval: 0 }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString()
                    }
                },
                legend: {
                    data: top5.map(p => p.Player),
                    orient: 'horizontal',
                    bottom: 0,
                    textStyle: { fontWeight: 'bold' }
                },
                series: top5.map((p, i) => {
                    const [start, end] = playerGradients[i % playerGradients.length]
                    return {
                        name: p.Player,
                        type: 'line',
                        smooth: 0.3,
                        symbol: 'circle',
                        symbolSize: 6,
                        lineStyle: {
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: start },
                                { offset: 1, color: end }
                            ])
                        },
                        itemStyle: {
                            color: end,
                            borderWidth: 1,
                            borderColor: '#fff'
                        },
                        emphasis: {
                            focus: 'series',
                            lineStyle: { width: 4 },
                            itemStyle: { borderWidth: 2, borderColor: '#000' }
                        },
                        data: allDays.value.map(d => p[`Score (D${d})`] || 0)
                    }
                }),
                animation: true,
                animationDuration: 800,
                animationEasing: 'cubicOut'
            }
        }
    })
}
