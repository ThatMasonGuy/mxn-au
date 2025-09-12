import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useKvKComparisonDailyOption(selectedComparisonGuilds, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const comparisonColours = chartTheme.comparisonColours
        const dayTasks = chartTheme.dayTasks
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        const GRID_DENSE_X = { top: 70, right: '10%', bottom: 100, left: '10%', containLabel: true }
        const GRID_MOBILE_DENSE_X = { top: 50, right: 10, bottom: 40, left: 10, containLabel: true }

        if (!selectedComparisonGuilds.value.length) {
            return applyTheme({
                title: { text: 'Guild Daily Performance Comparison', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'axis' },
                grid: GRID_DENSE_X,
                xAxis: { type: 'category', data: [] },
                yAxis: { type: 'value' },
                series: []
            })
        }

        const dayLabels = allDays.value.map(d => dayTasks[`D${d}`])

        const option = {
            title: { text: 'Guild Daily Performance Comparison', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: { top: 30, left: 'center', textStyle: { fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'line', lineStyle: { color: '#bbb', type: 'dashed' } },
                formatter: params => {
                    let content = `<strong>${params[0].axisValue}</strong><br/>`
                    params.forEach(item => {
                        const guild = selectedComparisonGuilds.value.find(g => g.shortCode === item.seriesName)
                        const serverInfo = guild ? ` (${guild.server})` : ''
                        content += `${item.marker} ${item.seriesName}${serverInfo}: <strong>${formatTooltipNumber(item.value)}</strong><br/>`
                    })
                    return content
                }
            },
            grid: GRID_DENSE_X,
            xAxis: {
                type: 'category',
                data: dayLabels,
                axisTick: { alignWithLabel: true },
                axisLabel: { fontWeight: 'bold', interval: 0 }
            },
            yAxis: { type: 'value', axisLabel: { formatter: formatAxisNumber } },
            series: selectedComparisonGuilds.value.map((guild, i) => ({
                name: guild.shortCode,
                type: 'line',
                smooth: 0.3,
                symbol: 'circle',
                symbolSize: 6,
                hoverAnimation: false,
                lineStyle: { width: 3, color: comparisonColours[i % comparisonColours.length] },
                itemStyle: { color: comparisonColours[i % comparisonColours.length], borderWidth: 1, borderColor: '#fff' },
                emphasis: { focus: 'series', lineStyle: { width: 4 }, itemStyle: { borderWidth: 2, borderColor: '#000' } },
                data: allDays.value.map(d => guild[`D${d}`] || 0)
            })),
            media: [{
                query: { maxWidth: 800 },
                option: {
                    grid: GRID_MOBILE_DENSE_X,
                    xAxis: { axisLabel: { rotate: 45 } }
                }
            }]
        }

        return applyTheme(option)
    })
}