import { useThemeStore } from '@/stores/useThemeStore'
import { computed } from 'vue'

export function useChartTheme() {
    const themeStore = useThemeStore()

    // Define theme colors directly
    const themeColors = {
        light: {
            textColor: '#1e293b',           // Dark gray for good contrast
            axisLine: '#cbd5e1',           // Light gray
            gridLine: '#f1f5f9',           // Very light gray
            backgroundColor: 'transparent',
        },
        dark: {
            textColor: '#f1f5f9',           // Light gray
            axisLine: '#475569',           // Medium gray
            gridLine: '#334155',           // Dark gray
            backgroundColor: 'transparent',
        },
        velaris: {
            textColor: '#1e293b',           // Dark for light velaris
            axisLine: '#cbd5e1',
            gridLine: '#f1f5f9',
            backgroundColor: 'transparent',
        },
        velarisDark: {
            textColor: '#f1f5f9',           // Light for dark velaris
            axisLine: '#475569',
            gridLine: '#334155',
            backgroundColor: 'transparent',
        },
        froggy: {
            textColor: '#1e293b',           // Dark for light froggy
            axisLine: '#cbd5e1',
            gridLine: '#f1f5f9',
            backgroundColor: 'transparent',
        },
        froggyDark: {
            textColor: '#f1f5f9',           // Light for dark froggy
            axisLine: '#475569',
            gridLine: '#334155',
            backgroundColor: 'transparent',
        }
    }

    // Standard color palette that works well across all themes
    const colorPalette = [
        '#3b82f6',  // Blue
        '#ef4444',  // Red
        '#10b981',  // Green
        '#f59e0b',  // Amber
        '#8b5cf6',  // Purple
        '#f97316',  // Orange
        '#06b6d4',  // Cyan
        '#84cc16',  // Lime
        '#ec4899',  // Pink
        '#6b7280'   // Gray
    ]

    // Get current theme colors - reactive to store changes
    const currentThemeColors = computed(() => {
        const theme = themeStore.currentTheme
        const isDark = theme.includes('Dark') || theme === 'dark'

        // Get the appropriate color scheme
        let colors = themeColors.light // default
        if (theme === 'dark' || theme === 'darkColour') {
            colors = themeColors.dark
        } else if (theme === 'velaris') {
            colors = themeColors.velaris
        } else if (theme === 'velarisDark') {
            colors = themeColors.velarisDark
        } else if (theme === 'froggy') {
            colors = themeColors.froggy
        } else if (theme === 'froggyDark') {
            colors = themeColors.froggyDark
        }

        return {
            ...colors,
            palette: colorPalette,
            isDark
        }
    })

    // Common number formatter for axis labels (K, M, B)
    function formatAxisNumber(value) {
        const absValue = Math.abs(value)
        if (absValue >= 1e9) {
            return (value / 1e9).toFixed(0) + 'B'
        } else if (absValue >= 1e6) {
            return (value / 1e6).toFixed(0) + 'M'
        } else if (absValue >= 1e3) {
            return (value / 1e3).toFixed(0) + 'K'
        }
        return value.toLocaleString()
    }

    // Formatter for tooltip values - shows exact value with commas
    function formatTooltipNumber(value) {
        return value.toLocaleString()
    }

    function applyTheme(chartOption) {
        const colors = currentThemeColors.value

        // Set global styles
        chartOption.textStyle = { color: colors.textColor }
        chartOption.color = colors.palette
        chartOption.backgroundColor = colors.backgroundColor

        // Axis defaults
        const axisBaseStyle = {
            axisLine: { lineStyle: { color: colors.axisLine, width: 1 } },
            axisLabel: { color: colors.textColor, fontSize: 12 },
            splitLine: {
                show: true,
                lineStyle: { color: colors.gridLine, type: 'dashed', width: 1, opacity: 0.8 }
            }
        }

        // Helper: apply style + default formatter only to numeric axes
        const decorateAxis = (axis) => {
            if (!axis) return
            Object.assign(axis, axisBaseStyle)
            // Only set short-number formatter for numeric axes if the chart didn't define one
            const isValueAxis = (axis.type ?? 'value') === 'value'
            if (isValueAxis) {
                const hasFormatter = axis.axisLabel && typeof axis.axisLabel.formatter !== 'undefined'
                if (!hasFormatter) {
                    axis.axisLabel = axis.axisLabel || {}
                    axis.axisLabel.formatter = (v) => formatAxisNumber(v) // K / M / B
                }
            }
        }

        // Apply to xAxis/yAxis (handles array or single object)
        if (chartOption.xAxis) {
            Array.isArray(chartOption.xAxis)
                ? chartOption.xAxis.forEach(decorateAxis)
                : decorateAxis(chartOption.xAxis)
        }
        if (chartOption.yAxis) {
            Array.isArray(chartOption.yAxis)
                ? chartOption.yAxis.forEach(decorateAxis)
                : decorateAxis(chartOption.yAxis)
        }

        // Legend
        if (chartOption.legend) {
            chartOption.legend.textStyle = { color: colors.textColor, fontSize: 12 }
        }

        // Title (no stroke)
        if (chartOption.title) {
            chartOption.title.textStyle = {
                ...(chartOption.title.textStyle || {}),
                color: colors.textColor,
                fontSize: 16,
                fontWeight: 'bold'
            }
            delete chartOption.title.textStyle.textBorderColor
            delete chartOption.title.textStyle.textBorderWidth
        }

        // Tooltip
        if (chartOption.tooltip) {
            chartOption.tooltip.textStyle = { color: colors.textColor }
            chartOption.tooltip.backgroundColor = colors.isDark
                ? 'rgba(30, 30, 30, 0.95)'
                : 'rgba(255, 255, 255, 0.95)'
            chartOption.tooltip.borderColor = colors.axisLine
            chartOption.tooltip.borderWidth = 1
        }

        // Responsive legend media (kept as-is)
        if (!chartOption.media) chartOption.media = []
        const hasLegend = chartOption.legend && chartOption.series && chartOption.series.length > 1
        if (hasLegend) {
            chartOption.media.push({
                query: { maxWidth: 600 },
                option: {
                    legend: { orient: 'horizontal', bottom: 0, left: 'center' },
                    grid: { left: '5%', right: '5%' }
                }
            })
        }

        return chartOption
    }

    // Static color mappings that adapt to dark mode
    const roleColorsStatic = computed(() => {
        const isDark = currentThemeColors.value.isDark
        if (isDark) {
            // Slightly brighter colors for dark mode
            return {
                R1: '#86efac', R2: '#a5f3fc', R3: '#fbbf24', R4: '#fde68a', R5: '#e9d5ff'
            }
        } else {
            return {
                R1: '#6ee7b7', R2: '#93c5fd', R3: '#f9a8d4', R4: '#fde68a', R5: '#ddd6fe'
            }
        }
    })

    const roleColorsGradient = computed(() => {
        const isDark = currentThemeColors.value.isDark
        if (isDark) {
            // Adjusted gradients for dark mode - lighter colors
            return {
                R1: ['#4ade80', '#86efac'],
                R2: ['#67e8f9', '#a5f3fc'],
                R3: ['#f472b6', '#fbbf24'],
                R4: ['#fbbf24', '#fef3c7'],
                R5: ['#c084fc', '#e9d5ff']
            }
        } else {
            return {
                R1: ['#34d399', '#6ee7b7'],
                R2: ['#60a5fa', '#93c5fd'],
                R3: ['#f472b6', '#f9a8d4'],
                R4: ['#facc15', '#fde68a'],
                R5: ['#a78bfa', '#ddd6fe']
            }
        }
    })

    const playerGradients = computed(() => {
        const isDark = currentThemeColors.value.isDark
        if (isDark) {
            // Brighter gradients for dark mode
            return [
                ['#67e8f9', '#a5f3fc'], ['#f472b6', '#fbbf24'], ['#4ade80', '#86efac'],
                ['#fbbf24', '#fef3c7'], ['#c084fc', '#e9d5ff'], ['#fb923c', '#fed7aa'],
                ['#38bdf8', '#bae6fd'], ['#d8b4fe', '#f3e8ff'], ['#fca5a5', '#fecaca'],
                ['#86efac', '#bbf7d0']
            ]
        } else {
            return [
                ['#60a5fa', '#93c5fd'], ['#f472b6', '#f9a8d4'], ['#34d399', '#6ee7b7'],
                ['#facc15', '#fde68a'], ['#a78bfa', '#ddd6fe'], ['#fb923c', '#fdba74'],
                ['#38bdf8', '#7dd3fc'], ['#c084fc', '#d8b4fe'], ['#f87171', '#fca5a5'],
                ['#4ade80', '#86efac']
            ]
        }
    })

    const dayTasks = {
        D1: 'Construction',
        D2: 'Research',
        D3: 'Rally',
        D4: 'Hero',
        D5: 'Training',
        D6: 'Combat'
    }

    const comparisonColours = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ]

    return {
        applyTheme,
        currentThemeColors,
        getThemePalette: computed(() => currentThemeColors.value.palette),
        roleColorsStatic,
        roleColorsGradient,
        playerGradients,
        dayTasks,
        comparisonColours,
        formatAxisNumber,
        formatTooltipNumber
    }
}