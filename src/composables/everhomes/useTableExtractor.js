import * as XLSX from 'xlsx'
import { simpleHash } from '@/utils/hash'
import { slugify } from '@/utils/slugify'

export function useTableExtractor() {
    function extractTablesFromWorkbook(workbook) {
        const sheetTables = {}
        const namedRanges = (workbook.Workbook?.Names || []).filter(n => {
            const name = n.Name || n.name
            const ref = n.Ref || n.ref
            return name && ref && !name.startsWith('_xlnm')
        })

        for (const named of namedRanges) {
            const name = named.Name || named.name
            const ref = named.Ref || named.ref
            if (!ref.includes('!')) continue

            const [sheetPart, rangePart] = ref.split('!')
            const sheetName = sheetPart.replace(/^'/, '').replace(/'$/, '').trim()
            const range = rangePart

            const actualSheetName = Object.keys(workbook.Sheets).find(
                key => key.trim().replace(/^'/, '').replace(/'$/, '') === sheetName
            )

            if (!actualSheetName || !range.includes(':')) continue
            const worksheet = workbook.Sheets[actualSheetName]

            try {
                const jsonData = extractRawCells(worksheet, range)

                const headers = jsonData[0]
                const preview = jsonData.slice(1, 6)
                const types = guessTypes(preview)
                const hash = simpleHash({ headers, types, preview })

                if (!sheetTables[sheetName]) sheetTables[sheetName] = []

                sheetTables[sheetName].push({
                    sourceSheet: sheetName,
                    tableName: name,
                    detectionMethod: 'named-range',
                    originalName: name,
                    tableId: `${slugify(sheetName)}-${slugify(name)}-${hash.slice(0, 5)}`,
                    createdAt: new Date().toISOString(),
                    detectedHeaders: headers,
                    detectedTypes: types,
                    headers: [...headers],
                    columnTypes: [...types],
                    preview,
                    rowCount: jsonData.length - 1,
                    columnCount: headers.length,
                    hash,
                    excluded: false,
                    cellReference: range,
                    detected: true,
                    updated: false,
                    schemaVersion: '1.0'
                })

            } catch (err) {
                console.error(`[💥 CRASHED] "${name}" on "${sheetName}" | range ${range}`, err)
            }

        }

        return sheetTables
    }

    function extractRawCells(worksheet, range) {
        const decoded = XLSX.utils.decode_range(range)
        const headers = []
        const dataRows = []

        const colStart = decoded.s.c
        const colEnd = decoded.e.c
        const rowStart = decoded.s.r
        const rowEnd = decoded.e.r

        const headerRowIndex = rowStart - 1

        // --- HEADER ROW EXTRACTION ---
        if (headerRowIndex < 0) {
            console.warn(`[⚠️ Named range starts at row 1 — no row above for headers. Using placeholder headers.]`)
            for (let c = colStart; c <= colEnd; c++) {
                const columnLetter = XLSX.utils.encode_col(c)
                headers.push(`Column ${columnLetter}`)
            }
        } else {
            let allNull = true
            for (let c = colStart; c <= colEnd; c++) {
                const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c })
                const cell = worksheet[cellRef]
                const val = cell?.v ?? null
                if (val !== null) allNull = false
                headers.push(val)
            }

            if (allNull) {
                console.warn(`[⚠️ Header row is entirely empty — falling back to Column A/B/etc names.]`)
                for (let i = 0; i < headers.length; i++) {
                    headers[i] = headers[i] ?? `Column ${XLSX.utils.encode_col(colStart + i)}`
                }
            }
        }

        // --- DATA ROW EXTRACTION ---
        for (let r = rowStart; r <= rowEnd; r++) {
            const row = []
            for (let c = colStart; c <= colEnd; c++) {
                const cellRef = XLSX.utils.encode_cell({ r, c })
                const cell = worksheet[cellRef]
                row.push(cell?.v ?? null)
            }
            dataRows.push(row)
        }

        return [headers, ...dataRows]
    }

    function guessTypes(previewRows) {
        const cols = previewRows[0]?.length || 0
        const types = Array(cols).fill('string')

        for (let col = 0; col < cols; col++) {
            const values = previewRows.map(row => row[col])
            if (values.every(v => typeof v === 'number')) types[col] = 'number'
            else if (values.every(v => typeof v === 'string' && /^\$[\d,.]+$/.test(v))) types[col] = 'currency'
        }

        return types
    }

    function enrichParsedSheets(parsedSheets, extractedTables) {
        return parsedSheets.map(sheet => {
            const normalizedSheetName = sheet.name.trim().replace(/^'/, '').replace(/'$/, '')
            const tables = extractedTables[normalizedSheetName] || []
            const tableCount = tables.length

            return {
                ...sheet,
                tables,
                hasTables: tableCount > 0,
                tableCount,
                selected: sheet.selected ?? tableCount > 0
            }
        })
    }

    return { extractTablesFromWorkbook, enrichParsedSheets }
}
