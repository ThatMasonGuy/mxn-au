import * as XLSX from 'xlsx'
import { simpleHash } from '@/utils/hash'
import { slugify } from '@/utils/slugify'

function labelForMethod(method) {
    switch (method) {
        case 'named-range':
            return 'Named Range'
        case 'defined-table':
            return 'Defined Table'
        case 'heuristic':
        default:
            return 'Heuristic Match'
    }
}

export function useTableExtractor() {
    function extractTablesFromWorkbook(workbook) {
        const sheetTables = {}

        const definedTables = (workbook.Workbook?.Names || []).filter(n => n.name === '_xlnm._FilterDatabase')

        for (const table of definedTables) {
            const ref = table.Ref
            const sheetMatch = ref.match(/^'?([^']+)'?!/)
            if (!sheetMatch) continue

            const sheetName = sheetMatch[1]
            const range = ref.split('!')[1].replace(/^'/, '')
            const worksheet = workbook.Sheets[sheetName]
            if (!worksheet || !range.includes(':')) continue

            try {
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range })

                if (!jsonData.length) continue

                const headers = jsonData[0]
                const preview = jsonData.slice(1, 6)
                const types = guessTypes(preview)
                const hash = simpleHash({ headers, types, preview })

                if (!sheetTables[sheetName]) sheetTables[sheetName] = []

                sheetTables[sheetName].push({
                    sourceSheet: sheetName,
                    tableName: `Auto Table ${sheetTables[sheetName].length + 1} - ${labelForMethod('defined-table')}`,
                    detectionMethod: 'defined-table',
                    tableId: `${slugify(sheetName)}-defined-${hash.slice(0, 5)}`,
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
                console.warn(`⚠️ Failed to parse defined table on sheet "${sheetName}" with range "${range}"`, err)
            }
        }

        const namedRanges = workbook.Workbook?.Names || []
        console.log('Workbook Names:', workbook.Workbook?.Names)

        for (const named of namedRanges) {
            if (!named.ref || !named.name || named.name.startsWith('_xlnm')) continue
        
            const match = named.ref.match(/^'?([^']+)'?!\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/)
            if (!match) continue
        
            const sheetName = match[1]
            const range = named.ref.split('!')[1].replace(/^'/, '')
            const worksheet = workbook.Sheets[sheetName]
            if (!worksheet || !range.includes(':')) continue
        
            try {
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range })
                if (!jsonData.length) continue
        
                const headers = jsonData[0]
                const preview = jsonData.slice(1, 6)
                const types = guessTypes(preview)
                const hash = simpleHash({ headers, types, preview })
        
                if (!sheetTables[sheetName]) sheetTables[sheetName] = []
        
                sheetTables[sheetName].push({
                    sourceSheet: sheetName,
                    tableName: `Auto Table ${sheetTables[sheetName].length + 1} - ${labelForMethod('named-range')}`,
                    detectionMethod: 'named-range',
                    originalName: named.name,
                    tableId: `${slugify(sheetName)}-${slugify(named.name)}-${hash.slice(0, 5)}`,
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
                console.warn(`⚠️ Failed to parse named range "${named.name}" on "${sheetName}" at ${range}`, err)
            }
        }        

        for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName]
            const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            if (!rawData.length) continue
            if (!sheetTables[sheetName]) sheetTables[sheetName] = []

            const alreadyCoveredRanges = sheetTables[sheetName].map(t => t.cellReference)

            let current = null

            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i]
                const isEmpty = row.every(c => c == null || c === '')

                if (!isEmpty && !current) {
                    current = { start: i, rows: [row] }
                } else if (!isEmpty && current) {
                    current.rows.push(row)
                } else if (isEmpty && current) {
                    if (current.rows.length > 1) {
                        const start = current.start + 1
                        const end = current.start + current.rows.length
                        const range = `A${start}:Z${end}` // refine range if needed
                        const headers = current.rows[0]
                        const preview = current.rows.slice(1, 6)
                        const types = guessTypes(preview)
                        const hash = simpleHash({ headers, types, preview })

                        sheetTables[sheetName].push({
                            sourceSheet: sheetName,
                            tableName: `Auto Table ${sheetTables[sheetName].length + 1} - ${labelForMethod('heuristic')}`,
                            detectionMethod: 'heuristic',
                            tableId: `${slugify(sheetName)}-auto-${hash.slice(0, 5)}`,
                            createdAt: new Date().toISOString(),
                            detectedHeaders: headers,
                            detectedTypes: types,
                            headers: [...headers],
                            columnTypes: [...types],
                            preview,
                            rowCount: current.rows.length - 1,
                            columnCount: headers.length,
                            hash,
                            excluded: false,
                            cellReference: range,
                            detected: true,
                            updated: false,
                            schemaVersion: '1.0'
                        })
                    }
                    current = null
                }
            }
        }

        return sheetTables
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

    return { extractTablesFromWorkbook }
}