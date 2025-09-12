import { computed } from 'vue'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useGuildDistributionOption(guilds) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const guildList = Array.isArray(guilds?.value) ? guilds.value : []

        if (!guildList.length) {
            return applyTheme({
                title: { text: 'Guild Score Distribution', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'item' },
                grid: { top: 70, right: '10%', bottom: 60, left: '10%', containLabel: true },
                xAxis: { type: 'category', data: [] },
                yAxis: { type: 'value' },
                series: []
            })
        }

        // Create score ranges for distribution
        const scoreRanges = [
            { min: 0, max: 500000000, label: '0-500M' },
            { min: 500000000, max: 1000000000, label: '500M-1B' },
            { min: 1000000000, max: 1500000000, label: '1B-1.5B' },
            { min: 1500000000, max: 2000000000, label: '1.5B-2B' },
            { min: 2000000000, max: 2500000000, label: '2B-2.5B' },
            { min: 2500000000, max: Infinity, label: '2.5B+' }
        ]

        // Count guilds in each range and separate by server
        const serverData = {}
        const rangeCounts = {}

        guildList.forEach(guild => {
            const score = guild.totalScore || 0
            const server = guild.server

            if (!serverData[server]) {
                serverData[server] = {}
                scoreRanges.forEach(range => {
                    serverData[server][range.label] = 0
                })
            }

            const range = scoreRanges.find(r => score >= r.min && score < r.max)
            if (range) {
                serverData[server][range.label]++
                rangeCounts[range.label] = (rangeCounts[range.label] || 0) + 1
            }
        })

        const servers = Object.keys(serverData)
        const labels = scoreRanges.map(r => r.label)

        // Create series for each server
        const serverColors = [
            'var(--velaris-green)',
            'var(--velaris-red)',
            'var(--velaris-blue)',
            'var(--velaris-purple)'
        ]

        const series = servers.map((server, index) => ({
            name: `Server ${server}`,
            type: 'bar',
            stack: 'guilds',
            data: labels.map(label => serverData[server][label] || 0),
            itemStyle: {
                color: serverColors[index % serverColors.length],
                borderRadius: index === servers.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            }
        }))

        const option = {
            title: {
                text: 'Guild Score Distribution by Server',
                left: 'center',
                textStyle: { fontSize: 18, fontWeight: 'bold' }
            },
            legend: {
                top: 30,
                left: 'center',
                textStyle: { fontWeight: 'bold' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: params => {
                    const range = params[0].axisValue
                    const total = rangeCounts[range] || 0

                    let content = `<strong>Score Range: ${range}</strong><br/>`
                    content += `<strong>Total Guilds: ${total}</strong><br/><br/>`

                    params.forEach(item => {
                        if (item.value > 0) {
                            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
                            content += `${item.marker} ${item.seriesName}: <strong>${item.value}</strong> (${percentage}%)<br/>`
                        }
                    })

                    return content
                }
            },
            grid: {
                top: 70,
                right: '10%',
                bottom: 60,
                left: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: labels,
                axisTick: { alignWithLabel: true },
                axisLabel: {
                    fontWeight: 'bold',
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                min: 0,
                axisLabel: { formatter: '{value}' },
                splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
                name: 'Number of Guilds',
                nameLocation: 'middle',
                nameGap: 40,
                nameTextStyle: {
                    fontWeight: 'bold',
                    color: 'var(--foreground)'
                }
            },
            series,
            animation: true,
            animationDuration: 1000,
            animationDelay: (idx) => idx * 50,
            media: [{
                query: { maxWidth: 800 },
                option: {
                    grid: { top: 70, right: 10, bottom: 80, left: 10, containLabel: true },
                    xAxis: { axisLabel: { rotate: 45 } }
                }
            }]
        }

        return applyTheme(option)
    })
}