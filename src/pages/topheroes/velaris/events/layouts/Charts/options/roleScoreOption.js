import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme.js'
import * as echarts from 'echarts/core'

export function useRoleScoreOption(players) {
    const { roleColorsGradient } = useChartTheme()

    return computed(() => {
        const orderedRoles = ['R1', 'R2', 'R3', 'R4', 'R5']
        const roleScoresMap = Object.fromEntries(orderedRoles.map(r => [r, { total: 0, count: 0 }]))

        players.value.forEach(player => {
            const r = player.Role
            if (roleScoresMap[r]) {
                roleScoresMap[r].total += player['Total Score']
                roleScoresMap[r].count += 1
            }
        })

        const avgScores = orderedRoles.map(role => {
            const { total, count } = roleScoresMap[role]
            return count > 0 ? Math.round(total / count) : 0
        })

        return {
            baseOption: {
                title: { text: 'Avg Score by Role', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: params => {
                        const v = params[0].value
                        return `${params[0].axisValue}<br/><strong>${v.toLocaleString()}</strong>`
                    }
                },
                grid: { top: 70, bottom: 60, left: '10%', right: '10%' },
                xAxis: {
                    type: 'category',
                    data: orderedRoles,
                    axisLabel: { fontWeight: 'bold' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: v => v >= 1e6
                            ? (v / 1e6).toFixed(1) + 'M'
                            : v.toLocaleString()
                    },
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
                            const [from, to] = roleColorsGradient[role]
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
                        formatter: v => {
                            const val = v.value
                            return val >= 1e6
                                ? (val / 1e6).toFixed(1) + 'M'
                                : val.toLocaleString()
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,0,0,0.2)'
                        }
                    }
                }],
                animation: true,
                animationDuration: 800,
                animationEasing: 'quadraticOut'
            }
        }
    })
}
