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

export function extractSdaPricingData(workbook, filename) {
    const benchmarkRows = XLSX.utils.sheet_to_json(
        workbook.Sheets['Benchmark Amounts'], { header: 1, defval: '' }
    )

    const benchmarks = {
        // New Builds: 4 variants (sprinklers × ITC)
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

    const locationFactors = {
        newBuild: extractLocationSheet(workbook.Sheets['Location Factors - New Builds']),
        other:    extractLocationSheet(workbook.Sheets['Location Factors - Other']),
    }

    const mrrc = extractMrrc(workbook.Sheets['MRRC'])

    const fyMatch = filename.match(/(\d{4}[-–]\d{2,4})/)
    const financialYear = fyMatch ? fyMatch[1] : 'Unknown'

    const warnings = []
    if (benchmarks.newBuild_noSprinklers_itcClaimed.length < 10)
        warnings.push(`Expected 11 New Build dwellings, found ${benchmarks.newBuild_noSprinklers_itcClaimed.length}`)
    if (locationFactors.newBuild.length < 80)
        warnings.push(`Expected ~89 locations, found ${locationFactors.newBuild.length}`)
    if (!mrrc.single.perAnnum)
        warnings.push('Could not extract MRRC figures — check the MRRC sheet')

    return { benchmarks, locationFactors, mrrc, financialYear, warnings, valid: warnings.length === 0 }
}
