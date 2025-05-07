import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function usePowerScatterOption(players) {
    const { roleColorsStatic } = useChartTheme()

    return computed(() => {
        const grouped = { R1: [], R2: [], R3: [], R4: [], R5: [] }
        const pts = []

        players.value.forEach(p => {
            if (p['Total Score'] > 0 && grouped[p.Role]) {
                const x = p.Power
                const y = p['Total Score']
                grouped[p.Role].push({ value: [x, y], player: p.Player })
                pts.push([x, y])
            }
        })

        const n = pts.length
        const sumX = pts.reduce((s, [x]) => s + x, 0)
        const sumY = pts.reduce((s, [, y]) => s + y, 0)
        const sumXY = pts.reduce((s, [x, y]) => s + x * y, 0)
        const sumX2 = pts.reduce((s, [x]) => s + x * x, 0)
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
        const intercept = (sumY - slope * sumX) / n
        const minX = Math.min(...pts.map(p => p[0]))
        const maxX = Math.max(...pts.map(p => p[0]))

        return {
            baseOption: {
                title: { text: 'Power vs Score', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                legend: {
                    top: 30,
                    data: Object.keys(grouped),
                    selectedMode: 'multiple',
                    textStyle: { fontWeight: 'bold' }
                },
                tooltip: {
                    formatter: param => {
                        const [power, score] = param.data.value
                        const name = param.data.player || 'Unknown'
                        const fmtScore = score >= 1e6
                            ? (score / 1e6).toFixed(1) + 'M'
                            : score.toLocaleString()
                        return `<strong>${name}</strong><br/>Power: ${power}M<br/>Score: ${fmtScore}`
                    }
                },
                grid: { top: 80, bottom: 60, left: '10%', right: '10%' },
                xAxis: { type: 'value' },
                yAxis: { type: 'value', min: 0 },
                series: [
                    ...Object.entries(grouped).map(([role, data]) => ({
                        name: role,
                        type: 'scatter',
                        data,
                        symbolSize: val => {
                            const s = val.value?.[1] || 0
                            return s >= 1e7 ? 20 : s >= 1e6 ? 16 : 12
                        },
                        itemStyle: {
                            color: roleColorsStatic[role],
                            opacity: 0.85,
                            borderColor: '#fff',
                            borderWidth: 1
                        }
                    })),
                    {
                        name: 'Trendline',
                        type: 'line',
                        data: [
                            [minX, slope * minX + intercept],
                            [maxX, slope * maxX + intercept]
                        ],
                        symbol: 'none',
                        lineStyle: { type: 'dashed', width: 2, color: '#6366f1' },
                        tooltip: { show: false }
                    }
                ],
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicOut'
            }
        }
    })
}
