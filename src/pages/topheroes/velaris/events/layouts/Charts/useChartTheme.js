export function useChartTheme() {
    const roleColorsGradient = {
        R1: ['#34d399', '#6ee7b7'],
        R2: ['#60a5fa', '#93c5fd'],
        R3: ['#f472b6', '#f9a8d4'],
        R4: ['#facc15', '#fde68a'],
        R5: ['#a78bfa', '#ddd6fe']
    }

    const roleColorsStatic = {
        R1: '#6ee7b7',
        R2: '#93c5fd',
        R3: '#f9a8d4',
        R4: '#fde68a',
        R5: '#ddd6fe'
    }

    // Theme-specific color palettes
    const lightPalette = ['#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6']
    const darkPalette = ['#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827']
    const colorPalette = [
        '#60a5fa', '#f472b6', '#34d399', '#facc15', '#a78bfa',
        '#fb923c', '#38bdf8', '#c084fc', '#f87171', '#4ade80'
    ]

    const playerGradients = [
        ['#60a5fa', '#93c5fd'],
        ['#f472b6', '#f9a8d4'],
        ['#34d399', '#6ee7b7'],
        ['#facc15', '#fde68a'],
        ['#a78bfa', '#ddd6fe'],
        ['#fb923c', '#fdba74'],
        ['#38bdf8', '#7dd3fc'],
        ['#c084fc', '#d8b4fe'],
        ['#f87171', '#fca5a5'],
        ['#4ade80', '#86efac']
    ]

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

    const themePresets = {
        light: {
            textColor: '#333',
            axisLine: '#ccc',
            gridLine: '#eee',
            background: '#fff',
            palette: lightPalette
        },
        dark: {
            textColor: '#e0e0e0',
            axisLine: '#555',
            gridLine: '#444',
            background: '#1e1e1e',
            palette: darkPalette
        },
        lightColour: {
            textColor: '#1f2937',
            axisLine: '#d1d5db',
            gridLine: '#e5e7eb',
            background: '#fff',
            palette: colorPalette
        },
        darkColour: {
            textColor: '#f3f4f6',
            axisLine: '#4b5563',
            gridLine: '#374151',
            background: '#1f2937',
            palette: colorPalette
        }
    }

    /**
     * Apply a theme to the chart options
     * @param {Object} option - The chart options object
     * @param {string} theme - Theme name: 'light', 'dark', 'lightColour', or 'darkColour'
     * @returns {Object} The modified chart options
     */
    function applyTheme(option, theme = 'lightColour') {
        // Default to lightColour if an invalid theme is provided
        const themeKey = Object.keys(themePresets).includes(theme) ? theme : 'lightColour'
        const colors = themePresets[themeKey]
        const base = option.baseOption || option

        // Set global text style
        base.textStyle = { color: colors.textColor }

        // Set color palette based on theme
        base.color = colors.palette

        // Style the X axis
        if (base.xAxis) {
            if (Array.isArray(base.xAxis)) {
                base.xAxis.forEach(axis => {
                    axis.axisLine = { lineStyle: { color: colors.axisLine } }
                    axis.axisLabel = { color: colors.textColor }
                    axis.splitLine = {
                        show: themeKey.includes('light'),
                        lineStyle: { color: colors.gridLine, type: 'dashed' }
                    }
                })
            } else {
                base.xAxis.axisLine = { lineStyle: { color: colors.axisLine } }
                base.xAxis.axisLabel = { color: colors.textColor }
                base.xAxis.splitLine = {
                    show: themeKey.includes('light'),
                    lineStyle: { color: colors.gridLine, type: 'dashed' }
                }
            }
        }

        // Style the Y axis
        if (base.yAxis) {
            if (Array.isArray(base.yAxis)) {
                base.yAxis.forEach(axis => {
                    axis.axisLine = { lineStyle: { color: colors.axisLine } }
                    axis.axisLabel = { color: colors.textColor }
                    axis.splitLine = { lineStyle: { color: colors.gridLine, type: 'dashed' } }
                })
            } else {
                base.yAxis.axisLine = { lineStyle: { color: colors.axisLine } }
                base.yAxis.axisLabel = { color: colors.textColor }
                base.yAxis.splitLine = { lineStyle: { color: colors.gridLine, type: 'dashed' } }
            }
        }

        // Configure legend
        if (base.legend) {
            base.legend.textStyle = { color: colors.textColor }
        }

        // Apply theme to tooltip
        if (base.tooltip) {
            if (!base.tooltip.textStyle) base.tooltip.textStyle = {}
            base.tooltip.textStyle.color = themeKey.includes('dark') ? '#fff' : '#333'
            base.tooltip.backgroundColor = themeKey.includes('dark') ? 'rgba(50, 50, 50, 0.7)' : 'rgba(255, 255, 255, 0.7)'
            base.tooltip.borderColor = colors.axisLine
        }

        // Configure series colors based on theme
        if (base.series && Array.isArray(base.series)) {
            base.series.forEach((series, index) => {
                // Skip special chart types like pie/donut that have their own coloring
                if (!series.type || (series.type !== 'pie' && series.type !== 'donut')) {
                    if (!series.itemStyle) series.itemStyle = {}
                    if (!series.lineStyle) series.lineStyle = {}

                    // Use theme-specific colors
                    if (themeKey === 'light') {
                        // For light theme, use neutral colors
                        series.itemStyle.color ||= lightPalette[index % lightPalette.length]
                        series.lineStyle.color ||= lightPalette[index % lightPalette.length]
                    } else if (themeKey === 'dark') {
                        // For dark theme, use neutral dark colors
                        series.itemStyle.color ||= darkPalette[index % darkPalette.length]
                        series.lineStyle.color ||= darkPalette[index % darkPalette.length]
                    } else {
                        // For colored themes, use the colorful palette
                        series.itemStyle.color ||= colorPalette[index % colorPalette.length]
                        series.lineStyle.color ||= colorPalette[index % colorPalette.length]
                    }
                }
            })
        }

        // Set background
        if (base.grid) {
            base.grid.backgroundColor = colors.background
        }

        // Set chart background
        if (base.backgroundColor === undefined) {
            base.backgroundColor = colors.background
        }

        return option
    }

    /**
     * Get the appropriate palette for the current theme
     * @param {string} theme - Theme name
     * @returns {Array} Color palette array
     */
    function getThemePalette(theme = 'lightColour') {
        return themePresets[theme]?.palette || colorPalette
    }

    return {
        applyTheme,
        getThemePalette,
        roleColorsGradient,
        roleColorsStatic,
        playerGradients,
        dayTasks,
        comparisonColours,
        themePresets
    }
}