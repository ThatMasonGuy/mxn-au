// Firestore collection: everhomesSdaPricing
//
// One document per financial year (doc id = year, e.g. '2025-26'):
//   {
//     financialYear, importedAt, importedBy, sourceFile,
//     mrrc,
//     benchmarks: { newBuild_noSprinklers_itcClaimed: [...], ... 8 keys },
//     appendixH:  { newBuild_noSprinklers_itcClaimed: [...], ... 6 keys },
//     locationFactors: { newBuild: [...], other: [...] }
//   }
//
// Legacy format (pre-versioning): a flat 'config' doc plus 'benchmarks_*' and
// 'locationFactors_*' docs at the collection root. fetchData() detects this
// shape and assembles it as a single legacy year so the existing tool keeps
// working until the admin re-uploads.
//
// Required Firestore security rules:
//   match /everhomesSdaPricing/{docId} {
//     allow read: if true;
//     allow write: if request.auth != null
//       && get(/databases/$(database)/documents/users/$(request.auth.uid))
//            .data.roles.hasAny(['admin']);
//   }

import { defineStore } from 'pinia'
import {
    collection, doc, getDocs, setDoc,
} from 'firebase/firestore'
import { firestore } from '@/firebase'

const COL = 'everhomesSdaPricing'

const LEGACY_BENCHMARK_KEYS = [
    'newBuild_noSprinklers_itcClaimed',
    'newBuild_withSprinklers_itcClaimed',
    'newBuild_noSprinklers_itcNotClaimed',
    'newBuild_withSprinklers_itcNotClaimed',
    'existingStock_noSprinklers',
    'existingStock_withSprinklers',
    'legacyStock_noSprinklers',
    'legacyStock_withSprinklers',
]

export const useSdaPriceStore = defineStore('sdaPrice', {
    state: () => ({
        // { '2025-26': { config, benchmarks, appendixH, locationFactors }, ... }
        yearData: {},
        selectedYear: null,
        loading: false,
        uploading: false,
        error: null,
    }),

    getters: {
        // Sorted descending — newest year first
        availableYears: (state) => Object.keys(state.yearData).sort().reverse(),

        latestYear: (state) => {
            const sorted = Object.keys(state.yearData).sort()
            return sorted[sorted.length - 1] ?? null
        },

        // Convenience: the full bundle for the active year
        currentYear: (state) => state.yearData[state.selectedYear] ?? null,

        hasData:         (state) => !!state.yearData[state.selectedYear]?.config,
        config:          (state) => state.yearData[state.selectedYear]?.config ?? null,
        benchmarks:      (state) => state.yearData[state.selectedYear]?.benchmarks ?? {},
        appendixH:       (state) => state.yearData[state.selectedYear]?.appendixH ?? {},
        locationFactors: (state) => state.yearData[state.selectedYear]?.locationFactors ?? {},

        hasAppendixH: (state) => {
            const tables = state.yearData[state.selectedYear]?.appendixH ?? {}
            return Object.keys(tables).length > 0
        },

        locationNames: (state) => {
            const lf = state.yearData[state.selectedYear]?.locationFactors?.newBuild ?? []
            return lf.map(l => l.name)
        },

        // Returns the benchmark row for a given table key and dwelling name
        getBenchmarkRow: (state) => (tableKey, dwelling) => {
            const table = state.yearData[state.selectedYear]?.benchmarks?.[tableKey]
            if (!table) return null
            return table.find(r => r.dwelling === dwelling) || null
        },

        // Returns ALL Appendix H sub-rows for a dwelling (one per occupancy offset)
        getAppendixHRows: (state) => (tableKey, dwelling) => {
            const table = state.yearData[state.selectedYear]?.appendixH?.[tableKey]
            if (!table) return []
            return table.filter(r => r.dwelling === dwelling)
        },

        // Returns the specific Appendix H row for (dwelling, sdaEligibleCount)
        getAppendixHRow: (state) => (tableKey, dwelling, sdaEligibleCount) => {
            const table = state.yearData[state.selectedYear]?.appendixH?.[tableKey]
            if (!table) return null
            return table.find(r => r.dwelling === dwelling && r.sdaEligibleCount === sdaEligibleCount) || null
        },

        // Returns location factor for a given dwelling (by factor index) and factorSet ('newBuild' | 'other')
        getLocationFactor: (state) => (locationName, factorIndex, factorSet = 'newBuild') => {
            const locations = state.yearData[state.selectedYear]?.locationFactors?.[factorSet] || []
            const loc = locations.find(l => l.name === locationName)
            if (!loc) return null
            return loc.factors[factorIndex] ?? null
        },
    },

    actions: {
        setYear(year) {
            if (this.yearData[year]) this.selectedYear = year
        },

        async fetchData() {
            this.loading = true
            this.error = null
            try {
                const snap = await getDocs(collection(firestore, COL))

                const yearData = {}
                let legacyConfig = null
                const legacyBenchmarks = {}
                const legacyLocationFactors = {}

                snap.forEach(docSnap => {
                    const id = docSnap.id
                    const data = docSnap.data()

                    if (id === 'config') {
                        legacyConfig = data
                    } else if (id.startsWith('benchmarks_')) {
                        legacyBenchmarks[id.replace('benchmarks_', '')] = data.dwellings
                    } else if (id === 'locationFactors_newBuild') {
                        legacyLocationFactors.newBuild = data.locations
                    } else if (id === 'locationFactors_other') {
                        legacyLocationFactors.other = data.locations
                    } else if (data.financialYear && data.benchmarks) {
                        // New per-year format
                        yearData[data.financialYear] = {
                            config: {
                                financialYear: data.financialYear,
                                importedAt:    data.importedAt,
                                importedBy:    data.importedBy,
                                sourceFile:    data.sourceFile,
                                mrrc:          data.mrrc,
                            },
                            benchmarks:      data.benchmarks ?? {},
                            appendixH:       data.appendixH ?? {},
                            locationFactors: data.locationFactors ?? {},
                        }
                    }
                })

                // Adopt legacy flat-doc data only if no per-year doc already covers it
                if (legacyConfig?.financialYear && !yearData[legacyConfig.financialYear]) {
                    yearData[legacyConfig.financialYear] = {
                        config: legacyConfig,
                        benchmarks: legacyBenchmarks,
                        appendixH: {},
                        locationFactors: legacyLocationFactors,
                    }
                }

                this.yearData = yearData

                // Default to the latest year, but preserve an explicit user choice
                if (!this.selectedYear || !yearData[this.selectedYear]) {
                    this.selectedYear = this.latestYear
                }
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        async uploadData({ benchmarks, appendixH, locationFactors, mrrc, financialYear }, sourceFile, importedBy) {
            if (!financialYear || financialYear === 'Unknown') {
                const err = new Error('Cannot upload dataset without a valid financial year')
                this.error = err.message
                throw err
            }
            this.uploading = true
            this.error = null
            try {
                const importedAt = new Date().toISOString()
                const docData = {
                    financialYear,
                    sourceFile,
                    importedBy,
                    importedAt,
                    mrrc,
                    benchmarks,
                    appendixH: appendixH ?? {},
                    locationFactors,
                }

                await setDoc(doc(firestore, COL, financialYear), docData)

                this.yearData = {
                    ...this.yearData,
                    [financialYear]: {
                        config: { financialYear, sourceFile, importedBy, importedAt, mrrc },
                        benchmarks,
                        appendixH: appendixH ?? {},
                        locationFactors,
                    },
                }
                this.selectedYear = financialYear
            } catch (err) {
                this.error = err.message
                throw err
            } finally {
                this.uploading = false
            }
        },
    },
})

// Exported for tooling/tests if they need to enumerate the legacy doc IDs
export { LEGACY_BENCHMARK_KEYS }
