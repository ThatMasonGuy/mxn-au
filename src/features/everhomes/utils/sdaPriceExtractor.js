import * as XLSX from 'xlsx'

function parseNum(val) {
    if (val === '' || val === null || val === undefined) return null
    const s = String(val).toLowerCase().trim()
    if (s === 'na' || s === 'n/a') return null
    const n = Number(s)
    return isNaN(n) ? null : n
}

function extractNewBuildRows(rows, startRow) {
    const result = []
    for (let i = 0; i < 11; i++) {
        const row = rows[startRow + i] || []
        const dwelling = String(row[2] || '').trim()
        if (!dwelling) continue
        result.push({
            dwelling,
            residents: Number(row[3]) || null,
            improvedLiveabilityNoOOA:    parseNum(row[5]),
            improvedLiveabilityWithOOA:  parseNum(row[6]),
            fullyAccessibleNoOOA:        parseNum(row[7]),
            fullyAccessibleWithOOA:      parseNum(row[8]),
            robustNoOOA:                 parseNum(row[9]),
            robustWithOOA:               parseNum(row[10]),
            robustBreakoutNoOOA:         parseNum(row[11]),
            robustBreakoutWithOOA:       parseNum(row[12]),
            highPhysicalSupportNoOOA:    parseNum(row[13]),
            highPhysicalSupportWithOOA:  parseNum(row[14]),
        })
    }
    return result
}

function extractExistingRows(rows, startRow, count = 11) {
    const result = []
    for (let i = 0; i < count; i++) {
        const row = rows[startRow + i] || []
        const dwelling = String(row[2] || '').trim()
        if (!dwelling) continue
        result.push({
            dwelling,
            residents: Number(row[3]) || null,
            basicNoOOA:                  parseNum(row[4]),
            improvedLiveabilityNoOOA:    parseNum(row[5]),
            improvedLiveabilityWithOOA:  parseNum(row[6]),
            fullyAccessibleNoOOA:        parseNum(row[7]),
            fullyAccessibleWithOOA:      parseNum(row[8]),
            robustNoOOA:                 parseNum(row[9]),
            robustWithOOA:               parseNum(row[10]),
            robustBreakoutNoOOA:         parseNum(row[11]),
            robustBreakoutWithOOA:       parseNum(row[12]),
            highPhysicalSupportNoOOA:    parseNum(row[13]),
            highPhysicalSupportWithOOA:  parseNum(row[14]),
        })
    }
    return result
}

// Each Appendix H benchmark table has 26 rows: 11 dwellings with variable sub-rows
// (one per non-SDA occupancy offset). Total = 1+1+2+2+1+2+3+2+3+4+5 = 26.
const APPENDIX_H_BLOCK = [
    { dwelling: 'Apartment, 1 bedroom, 1 resident',    maxResidents: 1, count: 1 },
    { dwelling: 'Apartment, 2 bedrooms, 1 resident',   maxResidents: 1, count: 1 },
    { dwelling: 'Apartment, 2 bedrooms, 2 residents',  maxResidents: 2, count: 2 },
    { dwelling: 'Apartment, 3 bedrooms, 2 residents',  maxResidents: 2, count: 2 },
    { dwelling: 'Villa/Duplex/Townhouse, 1 resident',  maxResidents: 1, count: 1 },
    { dwelling: 'Villa/Duplex/Townhouse, 2 residents', maxResidents: 2, count: 2 },
    { dwelling: 'Villa/Duplex/Townhouse, 3 residents', maxResidents: 3, count: 3 },
    { dwelling: 'House, 2 residents',                  maxResidents: 2, count: 2 },
    { dwelling: 'House, 3 residents',                  maxResidents: 3, count: 3 },
    { dwelling: 'Group Home, 4 residents',             maxResidents: 4, count: 4 },
    { dwelling: 'Group Home, 5 residents',             maxResidents: 5, count: 5 },
]

function extractAppendixHTable(rows, startRow, hasBasic) {
    const result = []
    let offset = 0
    for (const block of APPENDIX_H_BLOCK) {
        for (let i = 0; i < block.count; i++) {
            const row = rows[startRow + offset + i] || []
            const entry = {
                dwelling:                    block.dwelling,
                maxResidents:                block.maxResidents,
                sdaEligibleCount:            block.maxResidents - i,
                improvedLiveabilityNoOOA:    parseNum(row[5]),
                improvedLiveabilityWithOOA:  parseNum(row[6]),
                fullyAccessibleNoOOA:        parseNum(row[7]),
                fullyAccessibleWithOOA:      parseNum(row[8]),
                robustNoOOA:                 parseNum(row[9]),
                robustWithOOA:               parseNum(row[10]),
                robustBreakoutNoOOA:         parseNum(row[11]),
                robustBreakoutWithOOA:       parseNum(row[12]),
                highPhysicalSupportNoOOA:    parseNum(row[13]),
                highPhysicalSupportWithOOA:  parseNum(row[14]),
            }
            if (hasBasic) entry.basicNoOOA = parseNum(row[4])
            result.push(entry)
        }
        offset += block.count
    }
    return result
}

function extractLocationSheet(ws) {
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    const locations = []
    // Data begins at row index 5 (row 4 is dwelling-type column headers)
    for (let i = 5; i < rows.length; i++) {
        const row = rows[i]
        const name = String(row[1] || '').trim()
        if (!name) continue
        locations.push({
            name,
            // 12 factors: Apt1br1r, Apt2br1r, Apt2br2r, Apt3br2r,
            //             VDT1r, VDT2r, VDT3r,
            //             House2r, House3r, GH4r, GH5r, Legacy6+
            factors: [
                parseNum(row[2]),
                parseNum(row[3]),
                parseNum(row[4]),
                parseNum(row[5]),
                parseNum(row[6]),
                parseNum(row[7]),
                parseNum(row[8]),
                parseNum(row[9]),
                parseNum(row[10]),
                parseNum(row[11]),
                parseNum(row[12]),
                parseNum(row[13]),
            ],
        })
    }
    return locations
}

function extractMrrc(ws) {
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
    return {
        single: {
            perFortnight: parseNum(rows[9]?.[5]),
            perAnnum:     parseNum(rows[10]?.[5]),
        },
        couple: {
            perFortnight: parseNum(rows[9]?.[6]),
            perAnnum:     parseNum(rows[10]?.[6]),
        },
    }
}

function extractFinancialYear(filename) {
    // Accept hyphen, en-dash, or underscore between the two years (NDIS filenames vary)
    const m = filename.match(/(\d{4})[-_–](\d{2,4})/)
    if (!m) return 'Unknown'
    const start = m[1]
    const end = m[2].length === 2 ? m[2] : m[2].slice(-2)
    return `${start}-${end}`
}

export function extractSdaPricingData(workbook, filename) {
    const benchmarkRows = XLSX.utils.sheet_to_json(
        workbook.Sheets['Benchmark Amounts'], { header: 1, defval: '' }
    )

    const benchmarks = {
        // New Builds: 4 variants (sprinklers x ITC)
        newBuild_noSprinklers_itcClaimed:     extractNewBuildRows(benchmarkRows, 10),
        newBuild_withSprinklers_itcClaimed:   extractNewBuildRows(benchmarkRows, 25),
        newBuild_noSprinklers_itcNotClaimed:  extractNewBuildRows(benchmarkRows, 40),
        newBuild_withSprinklers_itcNotClaimed: extractNewBuildRows(benchmarkRows, 55),
        // Existing Stock: 2 variants (sprinklers only)
        existingStock_noSprinklers:           extractExistingRows(benchmarkRows, 72),
        existingStock_withSprinklers:         extractExistingRows(benchmarkRows, 87),
        // Legacy Stock: 2 variants (5 dwelling rows each)
        legacyStock_noSprinklers:             extractExistingRows(benchmarkRows, 104, 5),
        legacyStock_withSprinklers:           extractExistingRows(benchmarkRows, 113, 5),
    }

    // Appendix H Amounts — 6 tables (no Legacy variant; Appendix H doesn't apply to Legacy)
    // Row offsets match the 'Appendix H Amounts' sheet (0-indexed against sheet_to_json output):
    //   New Build NS GC  → rows 11-36 (start=10)
    //   New Build WS GC  → rows 41-66 (start=40)
    //   New Build NS GN  → rows 71-96 (start=70)
    //   New Build WS GN  → rows 101-126 (start=100)
    //   Existing NS      → rows 133-158 (start=132, has Basic column)
    //   Existing WS      → rows 163-188 (start=162, has Basic column)
    const appendixHSheet = workbook.Sheets['Appendix H Amounts']
    const appendixH = {}
    if (appendixHSheet) {
        const appendixHRows = XLSX.utils.sheet_to_json(appendixHSheet, { header: 1, defval: '' })
        appendixH.newBuild_noSprinklers_itcClaimed     = extractAppendixHTable(appendixHRows, 10, false)
        appendixH.newBuild_withSprinklers_itcClaimed   = extractAppendixHTable(appendixHRows, 40, false)
        appendixH.newBuild_noSprinklers_itcNotClaimed  = extractAppendixHTable(appendixHRows, 70, false)
        appendixH.newBuild_withSprinklers_itcNotClaimed = extractAppendixHTable(appendixHRows, 100, false)
        appendixH.existingStock_noSprinklers           = extractAppendixHTable(appendixHRows, 132, true)
        appendixH.existingStock_withSprinklers         = extractAppendixHTable(appendixHRows, 162, true)
    }

    const locationFactors = {
        newBuild: extractLocationSheet(workbook.Sheets['Location Factors - New Builds']),
        other:    extractLocationSheet(workbook.Sheets['Location Factors - Other']),
    }

    const mrrc = extractMrrc(workbook.Sheets['MRRC'])

    const financialYear = extractFinancialYear(filename)

    const warnings = []
    if (financialYear === 'Unknown')
        warnings.push('Could not detect financial year from filename — dataset cannot be saved without one')
    if (benchmarks.newBuild_noSprinklers_itcClaimed.length < 10)
        warnings.push(`Expected 11 New Build dwellings, found ${benchmarks.newBuild_noSprinklers_itcClaimed.length}`)
    if (locationFactors.newBuild.length < 80)
        warnings.push(`Expected ~89 locations, found ${locationFactors.newBuild.length}`)
    if (!mrrc.single.perAnnum)
        warnings.push('Could not extract MRRC figures - check the MRRC sheet')
    if (!appendixHSheet)
        warnings.push("'Appendix H Amounts' sheet not found — Appendix H tool will be unavailable for this dataset")
    else if (Object.keys(appendixH).length !== 6)
        warnings.push(`Expected 6 Appendix H tables, found ${Object.keys(appendixH).length}`)

    return { benchmarks, appendixH, locationFactors, mrrc, financialYear, warnings, valid: warnings.length === 0 }
}
