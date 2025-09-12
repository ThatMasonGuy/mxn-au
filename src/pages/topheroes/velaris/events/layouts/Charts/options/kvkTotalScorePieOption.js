// 1. Fix kvkTotalScorePieOption.js
import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { GraphicComponent } from 'echarts/components'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

echarts.use([GraphicComponent])

export function useKvKTotalScorePieOption(servers) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        if (!servers.value || servers.value.length === 0) {
            return applyTheme({
                title: { text: 'Server Score Distribution', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'item' },
                series: []
            })
        }

        // Use reliable colors instead of CSS custom properties
        const winnerColor = '#10b981'  // Green
        const loserColor = '#ef4444'   // Red

        const pieData = servers.value.map((server, index) => ({
            name: server.serverName,
            value: server.totalScore,
            itemStyle: {
                color: index === 0 ? winnerColor : loserColor
            }
        }))

        const option = {
            title: { text: 'Server Score Distribution', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: { top: 30, left: 'center', textStyle: { fontWeight: 'bold' } },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    const percentage = params.percent
                    const margin = servers.value.length > 1 ?
                        Math.abs(servers.value[0].totalScore - servers.value[1].totalScore) : 0
                    return `<strong>${params.name}</strong><br/>Score: ${formatTooltipNumber(params.value)} (${percentage}%)<br/>Margin: ${formatTooltipNumber(margin)}`
                }
            },
            series: [{
                type: 'pie',
                radius: ['45%', '70%'],
                center: ['50%', '58%'],
                data: pieData,
                label: {
                    formatter: params => `${params.name}: ${params.percent}%`,
                    fontWeight: 'bold'
                },
                emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } }
            }],
            graphic: servers.value.length > 1 ? {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: `${servers.value[0].serverName}\nWINS!`,
                    textAlign: 'center',
                    fill: winnerColor,
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            } : null,
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