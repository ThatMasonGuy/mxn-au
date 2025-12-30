// @/composables/everhomes/useSpreadsheetParser.js
import * as XLSX from 'xlsx'

export function useSpreadsheetParser() {
    const parseSpreadsheet = async (file) => {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: 'array' })

        return workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null })
            
            // Calculate max column count safely
            const columnLengths = json.map((r) => (Array.isArray(r) ? r.length : 0))
            const columnCount = columnLengths.length > 0 ? Math.max(...columnLengths) : 0
            
            return {
                name: sheetName,
                rawData: json,
                rowCount: json.length,
                columnCount,
                tables: [],
                hasTables: false,
                selected: false
            }
        })
    }

    return { parseSpreadsheet }
}