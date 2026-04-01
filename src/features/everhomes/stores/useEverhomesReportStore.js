// src/features/everhomes/stores/useEverhomesReportStore.js

// ─── Everhomes Report Store ───────────────────────────────────────────────────
// Holds all reactive state for the active report. Persisted automatically via
// pinia-plugin-persistedstate — components and composables never touch
// localStorage directly.
//
// State is namespaced by reportType so handover and inspection never collide.
// The key includes the schema's cacheVersion so a version bump automatically
// orphans stale cached data with zero migration code.
//
// Cache key format: everhomes_report_${reportType}_${cacheVersion}
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
// ── Deferred save on active uploads ──────────────────────────────────────────
// The plugin's shouldPersist hook returns false while any photo is uploading,
// so mid-upload state is not written to disk mid-flight. The composable calls
// flushPersist() when the last upload completes, triggering an immediate save.

import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

// ─── Photo serialisation helpers ──────────────────────────────────────────────

function serialisePhoto(p) {
    return {
        url:          p.url ?? null,
        thumbUrl:     p.thumbUrl ?? p.url ?? null,
        storagePath:  p.storagePath ?? '',
        caption:      p.caption ?? '',
        // Interrupted uploads are marked so the UI can offer a retry button.
        uploadStatus: p.uploadStatus === 'done' ? 'done' : 'interrupted',
    }
}

function rehydratePhoto(p) {
    return {
        // Blob previewUrls do not survive sessions — restore from the permanent URL.
        previewUrl:   p.url ?? null,
        thumbUrl:     p.thumbUrl ?? p.url ?? null,
        url:          p.url ?? null,
        storagePath:  p.storagePath ?? '',
        caption:      p.caption ?? '',
        // Surface interrupted uploads as failed so the retry button appears.
        uploadStatus: p.uploadStatus === 'done' ? 'done' : 'failed',
    }
}

function serialisePhotos(photos = []) {
    return (photos ?? []).map(serialisePhoto)
}

function rehydratePhotos(photos = []) {
    // Only rehydrate photos that have something recoverable — a URL or a storagePath.
    return (photos ?? []).filter((p) => p.url || p.storagePath).map(rehydratePhoto)
}

function serialiseChecklistData(data = {}) {
    return Object.fromEntries(
        Object.entries(data).map(([id, section]) => [
            id,
            {
                status: section.status ?? 'unchecked',
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
                notes:  section.notes  ?? '',
                items:  section.items  ?? {},
                inputs: section.inputs ?? {},
                photos: rehydratePhotos(section.photos),
            },
        ])
    )
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEverhomesReportStore = defineStore(
    'everhomesReport',
    () => {

        // ── Active report identity ─────────────────────────────────────────────
        // Set by ReportPage.vue on mount from route params + schema.
        // Persisted so the plugin can build the correct storage key.
        const reportType   = ref(null)  // 'handover' | 'inspection'
        const cacheVersion = ref(null)  // from schema.cacheVersion e.g. 'v1'

        // ── Setup state ───────────────────────────────────────────────────────
        const setup = reactive({
            propertyAddress:  '',
            inspectionDate:   '',
            inspectorName:    '',
            inspectorEmail:   '',
            reportId:         null,   // Firestore document ID, assigned on first cloud function call
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
            setup.pickerValue      = null
            setup.selectedOptional = []
            setup.showMarketing    = false
            setup.rooms            = []
            setup.bathrooms        = 1

            checklistSections.value = []
            Object.keys(checklistData).forEach((k) => delete checklistData[k])
            Object.keys(marketingPhotos).forEach((k) => delete marketingPhotos[k])

            // Don't reset activeUploadCount here — if uploads are somehow still
            // running when reset is called, the gate in shouldPersist still holds.
        }

        // ── Computed ──────────────────────────────────────────────────────────

        const hasChecklistStarted = computed(() => checklistSections.value.length > 0)

        return {
            reportType,
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
            // Dynamic key derived from the store's own reportType + cacheVersion.
            // Each report type gets an isolated localStorage entry.
            // A cacheVersion bump on the schema automatically orphans old data.
            key: () => {
                const store = useEverhomesReportStore()
                if (store.reportType && store.cacheVersion) {
                    return `everhomes_report_${store.reportType}_${store.cacheVersion}`
                }
                // Before reportType is set (initial hydration), use a temporary key.
                // This should only ever hold null/empty state.
                return 'everhomes_report_unkeyed'
            },

            // Block persistence while any upload is in flight.
            // The composable triggers a $patch after the last upload resolves,
            // which causes the plugin to re-evaluate and write the settled state.
            shouldPersist: () => {
                const store = useEverhomesReportStore()
                return !store.hasActiveUploads
            },

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
                            reportType:        data.reportType        ?? null,
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