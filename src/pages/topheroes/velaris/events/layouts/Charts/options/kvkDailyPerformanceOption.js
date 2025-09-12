import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { useChartTheme } from '@/pages/topheroes/velaris/events/layouts/Charts/useChartTheme'

export function useKvKDailyPerformanceOption(guildsOrTopPerformers, allDays) {
    const { applyTheme } = useChartTheme()

    return computed(() => {
        const chartTheme = useChartTheme()
        const playerGradients = chartTheme.playerGradients.value
        const dayTasks = chartTheme.dayTasks
        const formatAxisNumber = chartTheme.formatAxisNumber
        const formatTooltipNumber = chartTheme.formatTooltipNumber

        // STANDARDIZED GRID to match Role/Castle charts
        const GRID_DENSE_X = { top: 70, right: '10%', bottom: 60, left: '10%', containLabel: true }
        const GRID_MOBILE_DENSE_X = { top: 70, right: 10, bottom: 40, left: 10, containLabel: true }

        const days = Array.isArray(allDays?.value) ? allDays.value : []
        const hasDays = days.length > 0
        const pool = Array.isArray(guildsOrTopPerformers?.value) ? guildsOrTopPerformers.value : []

        if (!pool.length || !hasDays) {
            return applyTheme({
                title: { text: 'Top 5 Guild Daily Performance', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
                tooltip: { trigger: 'axis' },
                grid: GRID_DENSE_X,
                xAxis: { type: 'category', data: [] },
                yAxis: { type: 'value' },
                series: []
            })
        }

        const dayLabels = days.map(d => dayTasks[`D${d}`] || `Day ${d}`)

        const pickTop5 = (list) => {
            if (list.length <= 5) return list
            const totalFor = (g) => days.reduce((acc, d) => acc + (g?.[`D${d}`] || 0), 0)
            return [...list]
                .map(g => ({ g, total: totalFor(g) }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 5)
                .map(x => x.g)
        }

        const top5 = pickTop5(pool)

        const series = top5.map((guild, idx) => {
            const grad = playerGradients[idx % playerGradients.length] || ['#3b82f6', '#60a5fa']
            const [from, to] = Array.isArray(grad) ? grad : ['#3b82f6', '#60a5fa']
            return {
                name: guild?.shortCode || `Guild${idx + 1}`,
                type: 'line',
                smooth: true,
                showSymbol: true,
                symbolSize: 8,
                data: days.map(d => guild?.[`D${d}`] || 0),
                lineStyle: { width: 3 },
                itemStyle: { color: to },
                areaStyle: {
                    opacity: 0.15,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: from }, { offset: 1, color: to }
                    ])
                },
                emphasis: { focus: 'series' }
            }
        })

        const option = {
            title: { text: 'Top 5 Guild Daily Performance', left: 'center', textStyle: { fontSize: 18, fontWeight: 'bold' } },
            legend: { top: 30, left: 'center', textStyle: { fontWeight: 'bold' } },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'line' },
                formatter: params => {
                    const label = params?.[0]?.axisValue || ''
                    const lines = (params || []).map(it => {
                        const val = it?.value ?? 0
                        const nm = it?.seriesName || 'Unknown'
                        return `${it.marker || ''} ${nm}: <strong>${formatTooltipNumber(val)}</strong>`
                    })
                    return `<strong>${label}</strong><br/>${lines.join('<br/>')}`
                }
            },
            grid: GRID_DENSE_X,
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
            animationDuration: 800,
            animationEasing: 'quadraticOut',
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