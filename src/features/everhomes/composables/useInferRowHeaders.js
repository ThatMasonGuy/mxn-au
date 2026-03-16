export function inferRowHeaders(matrix, offset, rowCount = 20) {
    const maxColsToCheck = 4 // we'll check up to 4 columns to the left
    const colStart = offset.colOffset
    const rowStart = offset.rowOffset
    const rowHeaders = []

    for (let r = rowStart; r < Math.min(matrix.length, rowStart + rowCount); r++) {
        const row = matrix[r]
        if (!row) continue

        let header = null
        let helper = null
        let semantic = null

        // Go from nearest to farthest left
        for (let c = 1; c <= maxColsToCheck; c++) {
            const cell = row[colStart - c]
            if (!cell || typeof cell !== 'string') continue

            const value = cell.trim()

            if (c === 1 && value === '') continue // ignore empty buffer
            else if (c === 1 && !header) header = value
            else if (c === 2 && !helper) helper = value
            else if (c === 3 && !semantic) semantic = value
        }

        rowHeaders.push({
            rowIndex: r,
            label: header || helper || semantic || null,
            details: {
                header,
                helper,
                semantic
            }
        })
    }

    return rowHeaders
}
