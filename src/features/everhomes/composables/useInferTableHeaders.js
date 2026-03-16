import * as XLSX from 'xlsx'

export function inferTableHeaders(matrix, offset) {
    const headerCandidates = []
    const maxHeaderRows = 3

    for (let i = offset.rowOffset - maxHeaderRows; i < offset.rowOffset; i++) {
        if (i < 0) continue
        const row = matrix[i]
        if (!row) continue

        const signal = row.filter(cell => typeof cell === 'string' && cell.trim().length > 0).length
        const score = signal / row.length

        if (score > 0.25) headerCandidates.push(row)
    }

    const colStart = offset.colOffset
    const numCols = matrix[offset.rowOffset]?.length ?? 0
    const flatHeaders = []

    for (let c = colStart; c < numCols; c++) {
        const parts = []

        for (let r = 0; r < headerCandidates.length; r++) {
            const val = headerCandidates[r][c]
            if (val && typeof val === 'string') parts.push(val.trim())
        }

        const joined = parts.join(' - ')
        flatHeaders.push(joined || `Column ${XLSX.utils.encode_col(c)}`)
    }

    return {
        headers: flatHeaders,
        usedRows: headerCandidates.length,
        raw: headerCandidates
    }
}
