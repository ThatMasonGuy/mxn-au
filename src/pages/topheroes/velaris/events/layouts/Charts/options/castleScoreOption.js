import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useCastleScoreOption(players, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const castleMap = new Map()
        players.value.forEach(p => {
            const c = p.Castle
            if (!castleMap.has(c)) castleMap.set(c, { total: 0, count: 0 })
            castleMap.get(c).total += p['Total Score']
            castleMap.get(c).count += 1
        })

        const entries = [...castleMap.entries()].sort((a, b) => a[0] - b[0])
        const xData = entries.map(([castle]) => castle)
        const yData = entries.map(([_, v]) =>
            v.count > 0 ? Math.round(v.total / v.count) : 0
        )

        const option = {
            baseOption: {
                title: {
                    text: 'Castle Level vs Avg Score',
                    left: 'center',
                    textStyle: { fontSize: 18, fontWeight: 'bold' }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: p => `Castle ${p[0].axisValue}<br/>Avg Score: ${p[0].value.toLocaleString()}`
                },
                grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLabel: { fontWeight: 'bold' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: v =>
                            v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v.toLocaleString()
                    }
                },
                series: [{
                    type: 'line',
                    data: yData,
                    areaStyle: { opacity: 0.3 },
                    smooth: true,
                    symbol: 'circle',
                    itemStyle: { color: '#6366f1' },
                    lineStyle: { color: '#6366f1', width: 3 }
                }]
            },
            media: [{
                query: { maxWidth: 600 },
                option: {
                    grid: { top: 50, bottom: 50, left: '5%', right: '5%' }
                }
            }]
        }

        return applyTheme(option)
    })
}
