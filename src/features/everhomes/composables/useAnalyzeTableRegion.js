import * as XLSX from 'xlsx'

export function analyzeTableRegion(namedRangeRef, worksheet) {
    const decoded = XLSX.utils.decode_range(namedRangeRef)

    const top = Math.max(decoded.s.r - 5, 0)
    const bottom = decoded.e.r + 2
    const left = Math.max(decoded.s.c - 4, 0)
    const right = decoded.e.c + 4

    const matrix = []

    for (let r = top; r <= bottom; r++) {
        const row = []
        for (let c = left; c <= right; c++) {
            const cellRef = XLSX.utils.encode_cell({ r, c })
            const cell = worksheet[cellRef]
            row.push(cell?.v ?? null)
        }
        matrix.push(row)
    }

    const regionStats = {
        longestRowIndex: -1,
        maxLength: 0,
    }

    matrix.forEach((row, i) => {
        const combined = row.map(cell => (cell ?? '').toString()).join(' ')
        if (combined.length > regionStats.maxLength) {
            regionStats.maxLength = combined.length
            regionStats.longestRowIndex = i
        }
    })

    return {
        matrix,
        bounds: {
            top,
            bottom,
            left,
            right
        },
        offset: {
            rowOffset: decoded.s.r - top,
            colOffset: decoded.s.c - left
        },
        stats: regionStats
    }
}
