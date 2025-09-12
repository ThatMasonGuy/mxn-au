// 3. Fix kvkDailyServerBattleOption.js
import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useDailyServerBattleOption(servers, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const dayTasks = chartTheme.dayTasks
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const days = Array.isArray(allDays?.value) ? allDays.value : []
        const serverList = Array.isArray(servers?.value) ? servers.value : []

        if (!serverList.length || !days.length) {
            return applyTheme({
                title: { text: 'Daily Server Battle Results', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: [] },
                yAxis: { type: 'value' },
                series: []
            })
        }

        const dayLabels = days.map(d => dayTasks[`D${d}`] || `Day ${d}`)

        // Use reliable colors instead of CSS custom properties
        const serverColors = [
            '#10b981',  // Green
            '#ef4444',  // Red  
            '#f59e0b',  // Orange
            '#8b5cf6'   // Purple
        ]

        const series = serverList.map((server, index) => {
            const dailyScores = days.map(day => server.dailyTotals[`D${day}`] || 0)

            return {
                name: server.serverName,
                type: 'bar',
                data: dailyScores,
                itemStyle: {
                    color: serverColors[index % serverColors.length],
                    borderRadius: [2, 2, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                }
            }
        })

        // Calculate daily winners for annotations
        const dailyWinners = days.map(day => {
            let maxScore = 0
            let winner = null
            serverList.forEach(server => {
                const score = server.dailyTotals[`D${day}`] || 0
                if (score > maxScore) {
                    maxScore = score
                    winner = server
                }
            })
            return winner
        })

        const option = {
            title: { text: 'Daily Server Battle Results', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: {
                top: 30,
                left: 'center',
                textStyle: { fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const dayIndex = params[0].dataIndex
                    const dayName = params[0].axisValue
                    const winner = dailyWinners[dayIndex]

                    let content = `<strong>${dayName}</strong><br/>`
                    if (winner) {
                        content += `<div style="color: #10b981; font-weight: bold; margin-bottom: 4px;">👑 ${winner.serverName} Wins!</div>`
                    }

                    params.forEach(item => {
                        const isWinner = winner && item.seriesName === winner.serverName
                        const winnerIcon = isWinner ? '👑 ' : ''
                        content += `${item.marker} ${winnerIcon}${item.seriesName}: <strong>${formatTooltipNumber(item.value)}</strong><br/>`
                    })

                    return content
                }
            },
            xAxis: {
                type: 'category',
                data: dayLabels,
                axisTick: { alignWithLabel: true },
                axisLabel: { fontWeight: 'bold', interval: 0, rotate: days.length > 7 ? 45 : 0 }
            },
            yAxis: {
                type: 'value',
                min: 0,
                axisLabel: { formatter: formatAxisNumber },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            },
            series,
            animation: true,
            animationDuration: 1000,
            animationDelay: (idx) => idx * 100
        }

        return applyTheme(option)
    })
}