import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useComparisonDailyOption(selectedComparisonPlayers, allDays) {
    const { comparisonColours, dayTasks } = useChartTheme()

    return computed(() => {
        if (!selectedComparisonPlayers.value.length) {
            return {
                baseOption: {
                    title: {
                        text: 'Daily Performance Comparison',
                        left: 'center',
                        textStyle: { fontSize: 18, fontWeight: 'bold' }
                    },
                    tooltip: { trigger: 'axis' },
                    grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
                    xAxis: { type: 'category', data: [] },
                    yAxis: { type: 'value' },
                    series: [],
                },
                media: []
            }
        }

        const dayLabels = allDays.value.map(d => dayTasks[`D${d}`])

        return {
            baseOption: {
                title: {
                    text: 'Daily Performance Comparison',
                    left: 'center',
                    textStyle: { fontSize: 18, fontWeight: 'bold' }
                },
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
                    axisTick: { alignWithLabel: true },
                    axisLabel: { fontWeight: 'bold', interval: 0 }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString()
                    }
                },
                legend: {
                    data: selectedComparisonPlayers.value.map(p => p.Player),
                    orient: 'horizontal',
                    bottom: 0,
                    textStyle: { fontWeight: 'bold' }
                },
                series: selectedComparisonPlayers.value.map((player, i) => ({
                    name: player.Player,
                    type: 'line',
                    smooth: 0.3,
                    symbol: 'circle',
                    symbolSize: 6,
                    hoverAnimation: false,
                    lineStyle: {
                        width: 3,
                        color: comparisonColours[i % comparisonColours.length]
                    },
                    itemStyle: {
                        color: comparisonColours[i % comparisonColours.length],
                        borderWidth: 1,
                        borderColor: '#fff'
                    },
                    emphasis: {
                        focus: 'series',
                        lineStyle: { width: 4 },
                        itemStyle: { borderWidth: 2, borderColor: '#000' }
                    },
                    data: allDays.value.map(d => player[`Score (D${d})`] || 0)
                }))
            },
            media: [{
                query: { maxWidth: 600 },
                option: {
                    grid: { top: 50, bottom: 50, left: '5%', right: '5%' }
                }
            }]
        }
    })
}
