import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function usePowerScatterOption(players) {
    const { applyTheme } = useChartTheme()

    // Short formatters for axis/tooltip
    const short2 = (n) => {
        const abs = Math.abs(n)
        if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B'
        if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M'
        if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K'
        return n.toFixed(2)
    }
    const short0 = (n) => {
        const abs = Math.abs(n)
        if (abs >= 1e9) return (n / 1e9).toFixed(0) + 'B'
        if (abs >= 1e6) return (n / 1e6).toFixed(0) + 'M'
        if (abs >= 1e3) return (n / 1e3).toFixed(0) + 'K'
        return n.toFixed(0)
    }

    return computed(() => {
        const theme = useChartTheme()
        const roleColorsStatic = theme.roleColorsStatic.value
        const formatAxisNumber = theme.formatAxisNumber
        const formatTooltipNumber = theme.formatTooltipNumber

        // STANDARDIZED GRID to match Role/Castle charts (fixes left label clipping)
        const GRID_STD = { top: 70, right: '10%', bottom: 60, left: '10%', containLabel: true }
        const GRID_MOBILE = { top: 70, right: 10, bottom: 30, left: 10, containLabel: true }

        const grouped = { R1: [], R2: [], R3: [], R4: [], R5: [] }
        const pts = []

            ; (players.value || []).forEach(p => {
                const total = p?.['Total Score'] || 0
                const role = p?.Role
                const x = p?.Power
                const y = total
                if (role && grouped[role] && Number.isFinite(x) && Number.isFinite(y)) {
                    const point = { value: [x, y], player: p.Player }
                    grouped[role].push(point)
                    pts.push([x, y])
                }
            })

        // Trendline
        const n = pts.length || 0
        const sumX = pts.reduce((s, [x]) => s + x, 0)
        const sumY = pts.reduce((s, [, y]) => s + y, 0)
        const sumXY = pts.reduce((s, [x, y]) => s + x * y, 0)
        const sumX2 = pts.reduce((s, [x]) => s + x * x, 0)
        const denom = n * sumX2 - sumX * sumX
        const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0
        const intercept = n !== 0 ? (sumY - slope * sumX) / n : 0
        const minX = pts.length ? Math.min(...pts.map(p => p[0])) : 0
        const maxX = pts.length ? Math.max(...pts.map(p => p[0])) : 0

        const option = {
            title: { text: 'Power vs Score', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: { top: 30, data: Object.keys(grouped), selectedMode: 'multiple', textStyle: { fontWeight: 'bold' } },
            grid: GRID_STD,
            tooltip: {
                formatter: param => {
                    const [power, score] = param.data.value
                    const name = param.data.player || 'Unknown'
                    return `<strong>${name}</strong><br/>Power: ${short2(power)}<br/>Score: <strong>${formatTooltipNumber(score)}</strong>`
                }
            },
            xAxis: {
                type: 'value',
                axisLabel: { margin: 8, formatter: (v) => short0(v), hideOverlap: true }
            },
            yAxis: {
                type: 'value',
                min: 0,
                axisLabel: { margin: 8, formatter: (v) => formatAxisNumber(v) },
                splitLine: { lineStyle: { type: 'dashed', width: 1 } }
            },
            series: [
                ...Object.entries(grouped).map(([role, data]) => ({
                    name: role,
                    type: 'scatter',
                    data,
                    symbolSize: (param) => {
                        const s = param?.value?.[1] ?? 0
                        return s >= 1e7 ? 20 : s >= 1e6 ? 16 : 12
                    },
                    itemStyle: { color: roleColorsStatic[role] || '#93c5fd', opacity: 0.85, borderColor: '#fff', borderWidth: 1 }
                })),
                {
                    name: 'Trendline',
                    type: 'line',
                    data: pts.length ? [
                        [minX, slope * minX + intercept],
                        [maxX, slope * maxX + intercept],
                    ] : [],
                    symbol: 'none',
                    lineStyle: { type: 'dashed', width: 2 },
                    tooltip: { show: false }
                }
            ],
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            media: [{
                query: { maxWidth: 800 },
                option: {
                    grid: GRID_MOBILE,
                    xAxis: { axisLabel: { rotate: 45, margin: 10, formatter: (v) => short0(v), hideOverlap: true } }
                }
            }]
        }

        return applyTheme(option)
    })
}
