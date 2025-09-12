import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme.js'
import * as echarts from 'echarts/core'

export function useRoleScoreOption(players) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const roleColorsGradient = chartTheme.roleColorsGradient.value
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const GRID_STD = { top: 70, right: '10%', bottom: 60, left: '10%', containLabel: true }
        const GRID_MOBILE_STD = { top: 70, right: 10, bottom: 30, left: 10, containLabel: true }

        const orderedRoles = ['R1', 'R2', 'R3', 'R4', 'R5']
        const roleScoresMap = Object.fromEntries(orderedRoles.map(r => [r, { total: 0, count: 0 }]))

            ; (players.value || []).forEach(player => {
                const r = player?.Role
                if (roleScoresMap[r]) {
                    roleScoresMap[r].total += player['Total Score'] || 0
                    roleScoresMap[r].count += 1
                }
            })

        const avgScores = orderedRoles.map(role => {
            const { total, count } = roleScoresMap[role]
            return count > 0 ? Math.round(total / count) : 0
        })

        const option = {
            title: { text: 'Avg Score by Role', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const v = params[0]?.value ?? 0
                    return `${params[0]?.axisValue}<br/><strong>${formatTooltipNumber(v)}</strong>`
                }
            },
            grid: GRID_STD,
            xAxis: { type: 'category', data: orderedRoles, axisLabel: { fontWeight: 'bold' } },
            yAxis: {
                type: 'value',
                axisLabel: { formatter: formatAxisNumber },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            },
            series: [{
                type: 'bar',
                data: avgScores,
                barWidth: '50%',
                itemStyle: {
                    borderRadius: [6, 6, 0, 0],
                    color: ({ dataIndex }) => {
                        const role = orderedRoles[dataIndex]
                        const [from, to] = roleColorsGradient[role] || ['#60a5fa', '#93c5fd']
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: from },
                            { offset: 1, color: to }
                        ])
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    fontWeight: 'bold',
                    formatter: v => formatAxisNumber(v.value ?? 0)
                },
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
            }],
            animation: true,
            animationDuration: 800,
            animationEasing: 'quadraticOut',
            media: [
                {
                    query: { maxWidth: 800 }, option: {
                        grid: GRID_MOBILE_STD,
                        xAxis: { axisLabel: { rotate: 0, margin: 10, hideOverlap: true } }
                    }
                }
            ]
        }

        return applyTheme(option)
    })
}
