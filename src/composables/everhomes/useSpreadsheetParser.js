// @/composables/everhomes/useSpreadsheetParser.js
import * as XLSX from 'xlsx'

export function useSpreadsheetParser() {
    const parseSpreadsheet = async (file) => {
        const data = await file.arrayBuffer()
        const workbook = XLSX.read(data, { type: 'array' })

        return workbook.SheetNames.map((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            return {
                name: sheetName,
                rawData: json,
                rowCount: json.length,
                columnCount: Math.max(...json.map((r) => r.length))
            }
        })
    }

    return { parseSpreadsheet }
}