// src/features/everhomes/stores/useEverhomesReportStore.js

// ─── Everhomes Report Store ───────────────────────────────────────────────────
// Holds all reactive state for the active report. Persisted automatically via
// pinia-plugin-persistedstate — components and composables never touch
// localStorage directly.
//
// Inspection and Handover use different Pinia store IDs and persistence keys,
// so their drafts can coexist without state leaking between routes. cacheVersion
// is checked after rehydration and resets only the stale report-type draft.
//
// ── Photo persistence strategy ────────────────────────────────────────────────
// We never drop photos that were uploading when the page closed. Instead:
//
//   uploadStatus: 'done'      → persisted as-is, rehydrated normally
//   uploadStatus: 'uploading' → persisted as 'interrupted', rehydrated as
//                               'failed' so the user gets a retry button
//   uploadStatus: 'failed'    → persisted as 'failed', rehydrated as 'failed'
//
// Blob previewUrls are session-only memory addresses — they're stripped on
// persist and restored from the permanent `url` on rehydration.
//
// Uploading photos are persisted as recoverable failed entries. Their original
// File objects live in IndexedDB so an interrupted upload can be retried.

import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

// ─── Photo serialisation helpers ──────────────────────────────────────────────

function serialisePhoto(p) {
    return {
        id:           p.id ?? null,
        url:          p.url ?? null,
        thumbUrl:     p.thumbUrl ?? p.url ?? null,
        storagePath:  p.storagePath ?? '',
        intendedStoragePath: p.intendedStoragePath ?? p.storagePath ?? '',
        caption:      p.caption ?? '',
        errorCode:    p.errorCode ?? null,
        errorMessage: p.errorMessage ?? '',
        retryable:    p.retryable !== false,
        retryNote:    p.retryNote ?? '',
        attempts:     p.attempts ?? 0,
        fileSize:     p.fileSize ?? 0,
        localBackupAvailable: p.localBackupAvailable !== false,
        // Interrupted uploads are marked so the UI can offer a retry button.
        uploadStatus: p.uploadStatus === 'done' ? 'done' : 'failed',
    }
}

function rehydratePhoto(p) {
    return {
        id:           p.id ?? null,
        // Blob previewUrls do not survive sessions — restore from the permanent URL.
        previewUrl:   p.url ?? null,
        thumbUrl:     p.thumbUrl ?? p.url ?? null,
        url:          p.url ?? null,
        storagePath:  p.storagePath ?? '',
        intendedStoragePath: p.intendedStoragePath ?? p.storagePath ?? '',
        caption:      p.caption ?? '',
        errorCode:    p.errorCode ?? null,
        errorMessage: p.errorMessage ?? '',
        retryable:    p.retryable !== false,
        retryNote:    p.retryNote ?? '',
        attempts:     p.attempts ?? 0,
        fileSize:     p.fileSize ?? 0,
        localBackupAvailable: p.localBackupAvailable !== false,
        // Surface interrupted uploads as failed so the retry button appears.
        uploadStatus: p.uploadStatus === 'done' ? 'done' : 'failed',
    }
}

function serialisePhotos(photos = []) {
    return (photos ?? []).map(serialisePhoto)
}

function rehydratePhotos(photos = []) {
    // Only rehydrate photos that have something recoverable — a URL or a storagePath.
    return (photos ?? []).filter((p) => p.id || p.url || p.storagePath).map(rehydratePhoto)
}

function serialiseChecklistData(data = {}) {
    return Object.fromEntries(
        Object.entries(data).map(([id, section]) => [
            id,
            {
                status: section.status ?? 'unchecked',
                manualStatus: section.manualStatus ?? null,
                notes:  section.notes  ?? '',
                items:  section.items  ?? {},
                inputs: section.inputs ?? {},
                photos: serialisePhotos(section.photos),
            },
        ])
    )
}

function rehydrateChecklistData(data = {}) {
    return Object.fromEntries(
        Object.entries(data).map(([id, section]) => [
            id,
            {
                status: section.status ?? 'unchecked',
                manualStatus: section.manualStatus ?? null,
                notes:  section.notes  ?? '',
                items:  section.items  ?? {},
                inputs: section.inputs ?? {},
                photos: rehydratePhotos(section.photos),
            },
        ])
    )
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const REPORT_STORE_CONFIG = Object.freeze({
    inspection: Object.freeze({
        storeId: 'everhomesInspectionReport',
        storageKey: 'everhomes_report_inspection',
    }),
    handover: Object.freeze({
        storeId: 'everhomesHandoverReport',
        storageKey: 'everhomes_report_handover',
    }),
})

function createEverhomesReportStore(reportType) {
    const config = REPORT_STORE_CONFIG[reportType]
    return defineStore(
    config.storeId,
    () => {

        // ── Active report identity ─────────────────────────────────────────────
        // Fixed by the store factory so Inspection and Handover can never share
        // the same Pinia identity or persisted browser cache.
        const activeReportType = ref(reportType)
        const cacheVersion = ref(null)  // from schema.cacheVersion e.g. 'v1'

        // ── Setup state ───────────────────────────────────────────────────────
        const setup = reactive({
            propertyAddress:  '',
            inspectionDate:   '',
            inspectorName:    '',
            inspectorEmail:   '',
            reportId:         null,   // Server-backed draft/document ID
            draftAccessKey:   null,   // Opaque capability for the login-free draft session
            pickerValue:      null,   // Selected sdaCategory key or reportSubtype key
            selectedOptional: [],     // string[] of toggled optional section keys (toggle mode)
            showMarketing:    false,  // Whether marketing photo section is enabled
            // Dynamic room builder — inspection only (optionalMode: 'dynamic')
            rooms:    [],             // { id, key, label, hasEnsuite, isOOA }[]
            bathrooms: 1,
        })

        // ── Checklist state ───────────────────────────────────────────────────
        // Ordered list of active section descriptors, built by the composable.
        const checklistSections = ref([])

        // Keyed by section instance ID (e.g. 'bedroom_1', 'general', 'ooa_1').
        // { [sectionId]: { status, notes, items: {}, inputs: {}, photos: [] } }
        const checklistData = reactive({})

        // ── Marketing photos ──────────────────────────────────────────────────
        // { [slotKey]: Photo[] }
        const marketingPhotos = reactive({})

        // ── Upload tracking ───────────────────────────────────────────────────
        // Session-only — intentionally not persisted. Always rehydrates as 0.
        // The composable increments/decrements as uploads start and finish.
        const activeUploadCount = ref(0)

        const hasActiveUploads = computed(() => activeUploadCount.value > 0)

        function trackUploadStart() {
            activeUploadCount.value++
        }

        function trackUploadEnd() {
            activeUploadCount.value = Math.max(0, activeUploadCount.value - 1)
        }

        // ── Actions ───────────────────────────────────────────────────────────

        /**
         * Seed checklist data entries for a list of section IDs.
         * Called by the composable after building the section list.
         * Existing entries are preserved — only missing ones are initialised.
         */
        function ensureSectionData(sectionIds) {
            for (const id of sectionIds) {
                if (!checklistData[id]) {
                    checklistData[id] = {
                        status: 'unchecked',
                        manualStatus: null,
                        notes:  '',
                        items:  {},
                        inputs: {},
                        photos: [],
                    }
                }
            }
        }

        /**
         * Full reset — returns all state to defaults and clears persisted cache.
         * Called when the user explicitly starts a new form or clears an existing one.
         * The plugin will overwrite localStorage on the next reactive change.
         */
        function resetAll() {
            setup.propertyAddress  = ''
            setup.inspectionDate   = ''
            setup.inspectorName    = ''
            setup.inspectorEmail   = ''
            setup.reportId         = null
            setup.draftAccessKey   = null
            setup.pickerValue      = null
            setup.selectedOptional = []
            setup.showMarketing    = false
            setup.rooms            = []
            setup.bathrooms        = 1

            checklistSections.value = []
            Object.keys(checklistData).forEach((k) => delete checklistData[k])
            Object.keys(marketingPhotos).forEach((k) => delete marketingPhotos[k])

            // Don't reset activeUploadCount here — if uploads are somehow still
            // running when reset is called, it must still be able to balance its
            // own tracking counter when the upload finishes.
        }

        // ── Computed ──────────────────────────────────────────────────────────

        const hasChecklistStarted = computed(() => checklistSections.value.length > 0)

        return {
            reportType: activeReportType,
            cacheVersion,
            setup,
            checklistSections,
            checklistData,
            marketingPhotos,
            activeUploadCount,
            hasActiveUploads,
            trackUploadStart,
            trackUploadEnd,
            ensureSectionData,
            resetAll,
            hasChecklistStarted,
        }
    },

    // ── Persistence config ────────────────────────────────────────────────────
    {
        persist: {
            // Persistence configuration is resolved once when Pinia creates the
            // store, so this key must be static.
            key: config.storageKey,

            serializer: {
                serialize(state) {
                    return JSON.stringify({
                        reportType:        state.reportType,
                        cacheVersion:      state.cacheVersion,
                        setup:             state.setup,
                        checklistSections: state.checklistSections,
                        checklistData:     serialiseChecklistData(state.checklistData),
                        marketingPhotos:   Object.fromEntries(
                            Object.entries(state.marketingPhotos ?? {}).map(([slot, photos]) => [
                                slot,
                                serialisePhotos(photos),
                            ])
                        ),
                        // activeUploadCount excluded — session-only
                    })
                },

                deserialize(raw) {
                    try {
                        const data = JSON.parse(raw)
                        return {
                            reportType,
                            cacheVersion:      data.cacheVersion      ?? null,
                            setup:             data.setup             ?? {},
                            checklistSections: data.checklistSections ?? [],
                            checklistData:     rehydrateChecklistData(data.checklistData),
                            marketingPhotos:   Object.fromEntries(
                                Object.entries(data.marketingPhotos ?? {}).map(([slot, photos]) => [
                                    slot,
                                    rehydratePhotos(photos),
                                ])
                            ),
                            activeUploadCount: 0, // always reset on rehydration
                        }
                    } catch {
                        // Corrupt or unrecognised cache shape — start fresh.
                        // The plugin will overwrite this key on the next save.
                        return {}
                    }
                },
            },
        },
    }
    )
}

const useInspectionReportStore = createEverhomesReportStore('inspection')
const useHandoverReportStore = createEverhomesReportStore('handover')

function migrateLegacyUnkeyedCache(reportType) {
    if (typeof window === 'undefined') return
    const config = REPORT_STORE_CONFIG[reportType]
    if (window.localStorage.getItem(config.storageKey)) return

    const legacyKey = 'everhomes_report_unkeyed'
    const raw = window.localStorage.getItem(legacyKey)
    if (!raw) return

    try {
        const legacy = JSON.parse(raw)
        if (legacy.reportType === reportType) {
            window.localStorage.setItem(config.storageKey, raw)
            window.localStorage.removeItem(legacyKey)
        }
    } catch {
        // Ignore an unrecognised legacy cache and start this report type cleanly.
    }
}

export function useEverhomesReportStore(reportType) {
    if (!REPORT_STORE_CONFIG[reportType]) {
        throw new Error(`Unsupported Everhomes report type: ${reportType}`)
    }

    migrateLegacyUnkeyedCache(reportType)
    return reportType === 'handover'
        ? useHandoverReportStore()
        : useInspectionReportStore()
}
