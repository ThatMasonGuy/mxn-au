// /composables/useImportStore.js
import { ref } from 'vue'
const file = ref(null)
const parsedSheets = ref([])

function setParsedSheets(sheets) {
    parsedSheets.value = sheets
}

export function useImportStore() {
    return {
        file,
        parsedSheets,
        setParsedSheets
    }
}

const sheets = ref([
    {
        name: 'New Builds',
        rowCount: 64,
        columnCount: 12,
        hasTables: true,
        selected: true,
        tables: [
            {
                headers: ['Location', 'Design Category', 'Price'],
                types: ['string', 'string', 'currency'],
                preview: [
                    ['NSW Metro', 'Improved Liveability', '$342.00'],
                    ['VIC Regional', 'Robust', '$512.00'],
                    ['QLD Metro', 'Fully Accessible', '$389.00']
                ],
                excluded: false
            }
        ]
    },
    {
        name: 'Legacy Pricing',
        rowCount: 39,
        columnCount: 9,
        hasTables: true,
        selected: true,
        schemaVersion: '1.0',
        createdAt: new Date().toISOString(),
        tables: [
            {
                sourceSheet: 'Legacy Pricing',
                tableName: 'Legacy Pricing',
                tableId: 'legacy-pricing-legacy-pricing-sdvab',
                createdAt: new Date().toISOString(),
                detectedHeaders: ['Legacy Type', 'Region', 'Daily Rate'],
                detectedTypes: ['string', 'string', 'currency'],
                headers: ['Legacy Type', 'Region', 'Daily Rate'],
                columnTypes: ['string', 'string', 'currency'],
                preview: [
                    ['Type A', 'Metro', '$220.00'],
                    ['Type B', 'Regional', '$210.00'],
                    ['Type C', 'Remote', '$230.00']
                ],
                rowCount: 3,
                columnCount: 3,
                hash: 'sdvaberobaerby',
                excluded: false,
                cellReference: "A1:C3",
                detected: true,
                updated: false,
                schemaVersion: '1.0'
            },
            {
                sourceSheet: 'Legacy Pricing',
                tableName: 'Annual Averages',
                tableId: 'legacy-pricing-annual-averages-b24o5',
                createdAt: new Date().toISOString(),
                detectedHeaders: ['Type', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                detectedTypes: ['string', 'currency', 'currency', 'currency', 'currency', 'currency'],
                headers: ['Type', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                columnTypes: ['string', 'currency', 'currency', 'currency', 'currency', 'currency'],
                preview: [
                    ['Type A', '$100.00', '$200.00', '$300.00', '$400.00', '$500.00'],
                    ['Type B', '$110.00', '$210.00', '$310.00', '$410.00', '$510.00'],
                    ['Type C', '$120.00', '$220.00', '$320.00', '$420.00', '$520.00'],
                    ['Type D', '$130.00', '$230.00', '$330.00', '$430.00', '$530.00'],
                    ['Type E', '$140.00', '$240.00', '', '$440.00', '$540.00'],
                    ['Type F', '$150.00', '$250.00', '$350.00', '', '$550.00']
                ],
                rowCount: 6,
                columnCount: 6,
                hash: 'b24o5tybofwe',
                excluded: false,
                cellReference: "A4:C9",
                detected: true,
                updated: false,
                schemaVersion: '1.0'
            }
        ]
    },
    {
        name: 'Calculation Notes',
        rowCount: 122,
        columnCount: 4,
        hasTables: false,
        selected: false,
        tables: []
    },
    {
        name: 'Instructions',
        rowCount: 27,
        columnCount: 3,
        hasTables: false,
        selected: false,
        tables: []
    }
])