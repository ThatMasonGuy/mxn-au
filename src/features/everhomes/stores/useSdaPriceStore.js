// Firestore collection: everhomesSdaPricing
//
// Documents written on import:
//   config                                   — metadata + MRRC
//   benchmarks_{tableKey}                    — 8 documents
//   locationFactors_newBuild                 — new build location factors
//   locationFactors_other                    — existing + legacy location factors
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
    collection, doc, getDoc, getDocs, writeBatch
} from 'firebase/firestore'
import { firestore } from '@/firebase'

const COL = 'everhomesSdaPricing'

const BENCHMARK_KEYS = [
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
        config: null,          // { financialYear, importedAt, sourceFile, importedBy, mrrc }
        benchmarks: {},        // keyed by BENCHMARK_KEYS
        locationFactors: {},   // { newBuild: [...], other: [...] }
        loading: false,
        uploading: false,
        error: null,
    }),

    getters: {
        hasData: (state) => !!state.config,

        locationNames: (state) => {
            return (state.locationFactors.newBuild || []).map(l => l.name)
        },

        // Returns the benchmark row for a given table key and dwelling name
        getBenchmarkRow: (state) => (tableKey, dwelling) => {
            const table = state.benchmarks[tableKey]
            if (!table) return null
            return table.find(r => r.dwelling === dwelling) || null
        },

        // Returns location factor for a given dwelling (by factor index) and factorSet ('newBuild' | 'other')
        getLocationFactor: (state) => (locationName, factorIndex, factorSet = 'newBuild') => {
            const locations = state.locationFactors[factorSet] || []
            const loc = locations.find(l => l.name === locationName)
            if (!loc) return null
            return loc.factors[factorIndex] ?? null
        },
    },

    actions: {
        async fetchData() {
            this.loading = true
            this.error = null
            try {
                const snap = await getDocs(collection(firestore, COL))
                if (snap.empty) {
                    this.config = null
                    return
                }

                snap.forEach(docSnap => {
                    const id = docSnap.id
                    const data = docSnap.data()

                    if (id === 'config') {
                        this.config = data
                    } else if (id.startsWith('benchmarks_')) {
                        const key = id.replace('benchmarks_', '')
                        this.benchmarks[key] = data.dwellings
                    } else if (id === 'locationFactors_newBuild') {
                        this.locationFactors.newBuild = data.locations
                    } else if (id === 'locationFactors_other') {
                        this.locationFactors.other = data.locations
                    }
                })
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        },

        async uploadData({ benchmarks, locationFactors, mrrc, financialYear }, sourceFile, importedBy) {
            this.uploading = true
            this.error = null
            try {
                const batch = writeBatch(firestore)

                // Config + MRRC
                batch.set(doc(firestore, COL, 'config'), {
                    financialYear,
                    sourceFile,
                    importedBy,
                    importedAt: new Date().toISOString(),
                    mrrc,
                })

                // Benchmark tables
                for (const key of BENCHMARK_KEYS) {
                    batch.set(
                        doc(firestore, COL, `benchmarks_${key}`),
                        { dwellings: benchmarks[key] }
                    )
                }

                // Location factors
                batch.set(
                    doc(firestore, COL, 'locationFactors_newBuild'),
                    { locations: locationFactors.newBuild }
                )
                batch.set(
                    doc(firestore, COL, 'locationFactors_other'),
                    { locations: locationFactors.other }
                )

                await batch.commit()

                // Reflect in local state immediately
                this.config = { financialYear, sourceFile, importedBy, importedAt: new Date().toISOString(), mrrc }
                this.benchmarks = Object.fromEntries(BENCHMARK_KEYS.map(k => [k, benchmarks[k]]))
                this.locationFactors = { newBuild: locationFactors.newBuild, other: locationFactors.other }
            } catch (err) {
                this.error = err.message
                throw err
            } finally {
                this.uploading = false
            }
        },
    },
})
