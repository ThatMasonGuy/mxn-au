import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useCastleScoreOption(players, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const GRID_STD = { top: 70, right: '10%', bottom: 60, left: '10%', containLabel: true }
        const GRID_MOBILE_STD = { top: 70, right: 10, bottom: 30, left: 10, containLabel: true }

        const castleMap = new Map()
        players.value.forEach(p => {
            const c = p.Castle
            if (!castleMap.has(c)) castleMap.set(c, { total: 0, count: 0 })
            castleMap.get(c).total += p['Total Score']
            castleMap.get(c).count += 1
        })

        const entries = [...castleMap.entries()].sort((a, b) => a[0] - b[0])
        const xData = entries.map(([castle]) => castle)
        const yData = entries.map(([_, v]) => v.count > 0 ? Math.round(v.total / v.count) : 0)

        const option = {
            title: { text: 'Castle Level vs Avg Score', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                formatter: p => `Castle ${p[0].axisValue}<br/>Avg Score: <strong>${formatTooltipNumber(p[0].value)}</strong>`
            },
            grid: GRID_STD,
            xAxis: { type: 'category', data: xData, axisLabel: { fontWeight: 'bold' } },
            yAxis: { type: 'value', axisLabel: { formatter: formatAxisNumber } },
            series: [{
                type: 'line',
                data: yData,
                areaStyle: { opacity: 0.3 },
                smooth: true,
                symbol: 'circle',
                itemStyle: { color: '#6366f1' },
                lineStyle: { color: '#6366f1', width: 3 }
            }],
            media: [{ query: { maxWidth: 800 }, option: { grid: GRID_MOBILE_STD } }]
        }

        return applyTheme(option)
    })
}
