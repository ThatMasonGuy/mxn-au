// src/features/everhomes/composables/useReportState.js

// ─── useReportState ───────────────────────────────────────────────────────────
// Central composable for the report system. Takes a schema object (from
// src/features/everhomes/schemas/) and provides everything the page and
// components need to render and interact with the form.
//
// This composable owns:
//   - Section building (both 'toggle' and 'dynamic' modes)
//   - Item visibility (showIf + SDA filter) — single source of truth
//   - Progress tracking (isSectionComplete, submitStats) — bug 1 + 2 fixed
//   - Setup validation (schema-driven)
//   - Photo upload orchestration (bug 5 fixed — marketing included in gate)
//   - Online/offline detection (bug 7 fixed — tracked continuously, not just at submit)
//   - Submit payload construction
//   - Rebuild guard state (bug 6 — exposes hasPendingData for caller to confirm)
//
// What it does NOT own (stays in components):
//   - Signature pad refs and canvas logic → SubmitModal.vue
//   - Firestore listener / cloud function call → SubmitModal.vue
//   - Accordion open/close state → SectionAccordion.vue
//   - Caption editing state → PhotoPanel.vue

import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { storage } from '@/firebase'
import { useEverhomesReportStore } from '../stores/useEverhomesReportStore'
import {
    forgetReportUploadFile,
    recoverReportUploadFile,
    rememberReportUploadFile,
} from '../utils/reportUploadCache'
import {
    getReportDraft,
    recordReportUploadFailure,
    syncReportDraft,
} from '../utils/reportDraftApi'

// ─── Constants ────────────────────────────────────────────────────────────────

// Status values that count as "checked" for progress purposes
const CHECKED_STATUSES = new Set(['ok', 'attention', 'issue', 'na'])

// Item types that are inputs — they go into section.inputs, not section.items
const INPUT_TYPES = new Set(['text', 'number', 'date', 'multiline', 'yesno'])

// Firebase Storage error codes that are generally worth retrying automatically
const RETRYABLE_STORAGE_CODES = new Set([
    'storage/retry-limit-exceeded',
    'storage/unknown',
    'storage/quota-exceeded',
    'storage/canceled',
    'storage/timeout',
])

// ─── Composable ───────────────────────────────────────────────────────────────

export function useReportState(schema) {
    const store = useEverhomesReportStore()

    // ── Schema-derived constants ───────────────────────────────────────────────
    const {
        reportType,
        cacheVersion,
        optionalMode,
        sdaFilter,
        sections: schemaSections,
        items: schemaItems,
        fallback: schemaFallback = [],
        marketingPhotos: marketingConfig,
        defaults: schemaDefaults,
    } = schema

    // Resolve a pool entry by key — used by both modes
    const poolByKey = Object.fromEntries(
        (schemaSections.pool ?? []).map((p) => [p.key, p])
    )

    // ── Store identity ─────────────────────────────────────────────────────────
    // Set once on composable init so the plugin builds the right storage key.
    store.reportType   = reportType
    store.cacheVersion = cacheVersion

    // ── Online/offline tracking (bug 7) ───────────────────────────────────────
    // Tracked continuously — components can read isOnline and show a banner
    // rather than only discovering offline state at submit time.
    const isOnline = ref(navigator.onLine)
    const fatalError = reactive({
        open: false,
        title: 'Upload Error',
        message: '',
        logs: '',
    })
    const draftSync = reactive({
        status: 'idle', // idle | syncing | saved | offline | error | restoring
        lastSyncedAt: null,
        lastError: '',
        revision: 0,
        restoreError: '',
    })

    const DRAFT_SYNC_DEBOUNCE_MS = 1_500
    const retryFiles = new Map()
    let draftSyncTimer = null
    let draftSyncPromise = null
    let draftSyncQueued = false
    let restoringDraft = false

    function handleOnline()  {
        isOnline.value = true
        if (store.hasChecklistStarted) scheduleDraftSync({ immediate: true })
    }
    function handleOffline() {
        isOnline.value = false
        if (store.hasChecklistStarted) draftSync.status = 'offline'
    }

    function openFatalError(payload = {}) {
        fatalError.open = true
        fatalError.title = payload.title ?? 'Upload Error'
        fatalError.message = payload.message ?? 'An unexpected error occurred.'
        fatalError.logs = payload.logs ?? ''
    }

    function closeFatalError() {
        fatalError.open = false
        fatalError.title = 'Upload Error'
        fatalError.message = ''
        fatalError.logs = ''
    }

    function newDraftAccessKey() {
        return `${crypto.randomUUID().replaceAll('-', '')}${crypto.randomUUID().replaceAll('-', '')}`
    }

    function syncablePhoto(photo = {}) {
        return {
            id: photo.id ?? null,
            url: photo.url ?? null,
            thumbUrl: photo.url ?? photo.thumbUrl ?? null,
            storagePath: photo.storagePath ?? '',
            intendedStoragePath: photo.intendedStoragePath ?? photo.storagePath ?? '',
            caption: photo.caption ?? '',
            errorCode: photo.errorCode ?? null,
            errorMessage: photo.errorMessage ?? '',
            retryable: photo.retryable !== false,
            retryNote: photo.retryNote ?? '',
            attempts: photo.attempts ?? 0,
            uploadStatus: photo.uploadStatus === 'done' ? 'done' : 'failed',
        }
    }

    function buildDraftSnapshot() {
        const checklistData = Object.fromEntries(
            Object.entries(store.checklistData).map(([sectionId, section]) => [
                sectionId,
                {
                    status: section.status ?? 'unchecked',
                    notes: section.notes ?? '',
                    items: { ...(section.items ?? {}) },
                    inputs: { ...(section.inputs ?? {}) },
                    photos: (section.photos ?? []).map(syncablePhoto),
                },
            ])
        )

        return {
            version: 1,
            reportType,
            cacheVersion,
            setup: {
                propertyAddress: store.setup.propertyAddress ?? '',
                inspectionDate: store.setup.inspectionDate ?? '',
                inspectorName: store.setup.inspectorName ?? '',
                inspectorEmail: store.setup.inspectorEmail ?? '',
                pickerValue: store.setup.pickerValue ?? null,
                selectedOptional: [...(store.setup.selectedOptional ?? [])],
                showMarketing: store.setup.showMarketing === true,
                rooms: (store.setup.rooms ?? []).map((room) => ({ ...room })),
                bathrooms: store.setup.bathrooms ?? 1,
            },
            checklistSections: store.checklistSections.map((section) => ({ ...section })),
            checklistData,
            marketingPhotos: Object.fromEntries(
                Object.entries(store.marketingPhotos).map(([slot, photos]) => [
                    slot,
                    (photos ?? []).map(syncablePhoto),
                ])
            ),
        }
    }

    function ensureDraftIdentity() {
        if (!store.setup.reportId) store.setup.reportId = crypto.randomUUID()
        if (!store.setup.draftAccessKey) store.setup.draftAccessKey = newDraftAccessKey()
    }

    function draftRequestPayload() {
        ensureDraftIdentity()
        return {
            reportType,
            draftId: store.setup.reportId,
            draftAccessKey: store.setup.draftAccessKey,
        }
    }

    async function synchroniseDraft() {
        if (!store.hasChecklistStarted) return null
        if (!isOnline.value) {
            draftSync.status = 'offline'
            return null
        }
        if (draftSyncPromise) {
            draftSyncQueued = true
            return draftSyncPromise
        }

        draftSync.status = 'syncing'
        draftSync.lastError = ''
        const payload = {
            ...draftRequestPayload(),
            draft: buildDraftSnapshot(),
        }

        draftSyncPromise = syncReportDraft(payload)
            .then((result) => {
                draftSync.status = 'saved'
                draftSync.lastSyncedAt = new Date().toISOString()
                draftSync.revision = result.draftRevision ?? draftSync.revision
                return result
            })
            .catch((error) => {
                draftSync.status = navigator.onLine ? 'error' : 'offline'
                draftSync.lastError = error.message ?? 'Unable to back up this draft.'
                throw error
            })
            .finally(() => {
                draftSyncPromise = null
                if (draftSyncQueued) {
                    draftSyncQueued = false
                    scheduleDraftSync({ immediate: true })
                }
            })

        return draftSyncPromise
    }

    function scheduleDraftSync({ immediate = false } = {}) {
        if (restoringDraft || !store.hasChecklistStarted) return
        clearTimeout(draftSyncTimer)
        if (immediate) {
            synchroniseDraft().catch(() => {})
            return
        }
        draftSyncTimer = setTimeout(() => synchroniseDraft().catch(() => {}), DRAFT_SYNC_DEBOUNCE_MS)
    }

    async function flushDraftSync() {
        clearTimeout(draftSyncTimer)
        return synchroniseDraft()
    }

    const resumeLink = computed(() => {
        if (!store.setup.reportId || !store.setup.draftAccessKey || typeof window === 'undefined') return ''
        const root = `${window.location.origin}${window.location.pathname}${window.location.search}`
        return `${root}#everhomes-draft=${reportType}.${store.setup.reportId}.${store.setup.draftAccessKey}`
    })

    async function copyResumeLink() {
        if (!resumeLink.value) return false
        try {
            await navigator.clipboard.writeText(resumeLink.value)
            return true
        } catch {
            return false
        }
    }

    function restoreObject(target, value = {}) {
        Object.keys(target).forEach((key) => delete target[key])
        Object.assign(target, value)
    }

    async function restoreDraftFromLocation() {
        const hash = window.location.hash
        const prefix = '#everhomes-draft='
        if (!hash.startsWith(prefix)) return false

        const [hashType, draftId, draftAccessKey] = hash.slice(prefix.length).split('.')
        if (hashType !== reportType || !draftId || !draftAccessKey) {
            draftSync.restoreError = 'This resume link is invalid for this report type.'
            return false
        }

        restoringDraft = true
        draftSync.status = 'restoring'
        draftSync.restoreError = ''
        try {
            const result = await getReportDraft({
                reportType,
                draftId,
                draftAccessKey,
                includeDraft: true,
            })
            if (!result.draft) throw new Error('The saved draft did not contain recoverable report data.')

            store.resetAll()
            Object.assign(store.setup, result.draft.setup ?? {}, { reportId: draftId, draftAccessKey })
            store.checklistSections = result.draft.checklistSections ?? []
            restoreObject(store.checklistData, result.draft.checklistData ?? {})
            restoreObject(store.marketingPhotos, result.draft.marketingPhotos ?? {})
            draftSync.status = 'saved'
            draftSync.revision = result.draftRevision ?? 0
            draftSync.lastSyncedAt = result.draftUpdatedAt ?? null
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
            return true
        } catch (error) {
            draftSync.status = 'error'
            draftSync.restoreError = error.message ?? 'Could not restore that draft.'
            return false
        } finally {
            restoringDraft = false
        }
    }

    onMounted(() => {
        window.addEventListener('online',  handleOnline)
        window.addEventListener('offline', handleOffline)
        restoreDraftFromLocation().then((restored) => {
            if (!restored && store.hasChecklistStarted) scheduleDraftSync({ immediate: true })
        })
    })
    onUnmounted(() => {
        window.removeEventListener('online',  handleOnline)
        window.removeEventListener('offline', handleOffline)
        clearTimeout(draftSyncTimer)
    })

    watch(
        [
            () => store.setup,
            () => store.checklistSections,
            () => store.checklistData,
            () => store.marketingPhotos,
        ],
        () => scheduleDraftSync(),
        { deep: true }
    )

    // ── Setup validation ──────────────────────────────────────────────────────
    const setupErrors = reactive({
        address:      false,
        name:         false,
        email:        false,
        pickerValue:  false,
    })

    function validateSetup() {
        setupErrors.address     = !store.setup.propertyAddress.trim()
        setupErrors.name        = !store.setup.inspectorName.trim()
        setupErrors.email       = !store.setup.inspectorEmail.trim()
        // Only validate pickerValue if the schema has a picker
        setupErrors.pickerValue = schema.pickerMode !== null && !store.setup.pickerValue

        return !setupErrors.address &&
               !setupErrors.name   &&
               !setupErrors.email  &&
               !setupErrors.pickerValue
    }

    // ── SDA filter ────────────────────────────────────────────────────────────
    // Returns the set of badge values that are "active" for the current
    // pickerValue. Only relevant when schema.sdaFilter is true.
    const activeSdaBadges = computed(() => {
        if (!sdaFilter) return null // null = no filtering
        const selected = store.setup.pickerValue
        if (!selected) return null
        const option = (schema.pickerOptions ?? []).find((o) => o.key === selected)
        return option?.includes ? new Set(option.includes) : null
    })

    // ── Item visibility — single source of truth ──────────────────────────────
    // Bug 1 + 2 fix: every function that counts or evaluates items goes through
    // this. An item is visible if:
    //   1. Its showIf condition is satisfied (or it has no showIf)
    //   2. Its SDA badges pass the active filter (or sdaFilter is off)
    function isItemVisible(item, sectionId) {
        // ── showIf check ─────────────────────────────────────────────────
        if (item.showIf) {
            const { id, value, hasValue } = item.showIf
            const currentVal = store.checklistData[sectionId]?.inputs?.[id] ??
                               store.checklistData[sectionId]?.items?.[id]  ??
                               ''
            const isFilled = currentVal !== undefined && currentVal !== null && String(currentVal).trim() !== ''
            if (hasValue === true && !isFilled) return false
            if (hasValue === false && isFilled) return false
            if (hasValue === undefined && currentVal !== value) return false
        }

        // ── SDA badge filter ─────────────────────────────────────────────
        if (sdaFilter && activeSdaBadges.value && item.badges?.length) {
            if (!item.badges.some((b) => activeSdaBadges.value.has(b))) return false
        }

        return true
    }

    // ── Section item helpers ──────────────────────────────────────────────────
    // Returns the raw item definitions for a section, resolved via itemsKey.
    function getItemDefinitions(sectionKey) {
        const resolvedKey = poolByKey[sectionKey]?.itemsKey ?? sectionKey
        return schemaItems[resolvedKey] ?? schemaFallback
    }

    function getSectionType(section) {
        if (!section) return ''
        return section.type ??
               section.itemsKey ??
               section.meta?.itemsKey ??
               poolByKey[section.key]?.itemsKey ??
               section.key
    }

    // Returns all status-checkable items in a section, flattened from groups.
    function getStatusItems(sectionKey) {
        return getItemDefinitions(sectionKey).flatMap((g) =>
            g.items.filter((i) => !INPUT_TYPES.has(i.type))
        )
    }

    // Returns all input items in a section.
    function getInputItems(sectionKey) {
        return getItemDefinitions(sectionKey).flatMap((g) =>
            g.items.filter((i) => INPUT_TYPES.has(i.type))
        )
    }

    // ── Section group filtering ───────────────────────────────────────────────
    // Returns groups for a section with SDA-filtered and showIf-filtered items.
    // Used by ChecklistSection.vue to render only what's applicable.
    function getFilteredGroups(sectionId, sectionKey) {
        return getItemDefinitions(sectionKey)
            .map((group) => ({
                ...group,
                items: group.items.filter((item) => isItemVisible(item, sectionId)),
            }))
            .filter((group) => group.items.length > 0)
    }

    // ── Section data seeding ──────────────────────────────────────────────────
    // Seeds store.checklistData for a section if not already present.
    // Existing data is preserved — this is safe to call on resume.
    function seedSectionData(sectionId, sectionKey) {
        if (store.checklistData[sectionId]) return

        const items  = {}
        const inputs = {}

        getStatusItems(sectionKey).forEach((i) => { items[i.id]  = 'unchecked' })
        getInputItems(sectionKey).forEach((i)  => { inputs[i.id] = '' })

        store.checklistData[sectionId] = {
            status: 'unchecked',
            notes:  '',
            photos: [],
            items,
            inputs,
        }
    }

    function migrateLegacySectionData(nextId, legacyIds = []) {
        if (store.checklistData[nextId]) return
        const legacyId = legacyIds.find((id) => id && store.checklistData[id])
        if (!legacyId) return
        store.checklistData[nextId] = store.checklistData[legacyId]
    }

    // ── Section building — toggle mode (handover) ─────────────────────────────
    function buildToggleSections() {
        const sections = []

        for (const s of schemaSections.forced) {
            sections.push({ id: `section-${s.key}`, key: s.key, type: s.itemsKey ?? s.key, label: s.label, meta: s })
            seedSectionData(`section-${s.key}`, s.key)
        }

        for (const s of schemaSections.pool) {
            if (store.setup.selectedOptional.includes(s.key)) {
                sections.push({ id: `section-${s.key}`, key: s.key, type: s.itemsKey ?? s.key, label: s.label, meta: s })
                seedSectionData(`section-${s.key}`, s.key)
            }
        }

        return sections
    }

    // ── Section building — dynamic mode (inspection) ──────────────────────────
    // Ordering is driven by pool entry orderGroup values:
    //   'first' → 'core' → 'optional' → 'rooms' → 'last'
    function buildDynamicSections() {
        const first    = []
        const core     = []
        const optional = []
        const rooms    = []
        const last     = []

        // Forced sections — sorted into their orderGroup bucket
        for (const s of schemaSections.forced) {
            const entry = { id: `section-${s.key}`, key: s.key, type: s.itemsKey ?? s.key, label: s.label, meta: s }
            seedSectionData(`section-${s.key}`, s.key)
            switch (s.orderGroup) {
                case 'first': first.push(entry); break
                case 'last':  last.push(entry);  break
                default:      core.push(entry);  break
            }
        }

        // Pool sections — single-instance optionals toggled by the user
        for (const s of schemaSections.pool) {
            if (s._managed) continue // ensuites are added via room loop below
            if (s.multipleAllowed) continue // multi-instance rooms handled below
            if (!store.setup.selectedOptional.includes(s.key)) continue

            const entry = { id: `section-${s.key}`, key: s.key, type: s.itemsKey ?? s.key, label: s.label, meta: s }
            seedSectionData(`section-${s.key}`, s.key)
            switch (s.orderGroup) {
                case 'first': first.push(entry); break
                default:      optional.push(entry); break
            }
        }

        // Dynamic room instances — built from store.setup.rooms
        let instanceCount = {}
        for (const room of store.setup.rooms) {
            const poolEntry = poolByKey[room.key]
            if (!poolEntry) continue

            instanceCount[room.key] = (instanceCount[room.key] ?? 0) + 1
            const count = instanceCount[room.key]
            const sectionId = `room_${room.id}`
            const legacySectionId = `${room.key}_${count}`
            const label = room.label || `${poolEntry.label} ${count}`

            rooms.push({ id: sectionId, key: room.key, type: poolEntry.itemsKey ?? room.key, label, isOOA: room.isOOA ?? false, isEnsuite: false, meta: poolEntry })
            migrateLegacySectionData(sectionId, [legacySectionId])
            seedSectionData(sectionId, poolEntry.itemsKey ?? room.key)

            // Auto-create ensuite if this room has one
            if (room.hasEnsuite) {
                const ensuitePoolEntry = poolByKey['ensuite']
                const ensuiteId    = `ensuite_${room.id}`
                const legacyEnsuiteId = `ensuite_${count}`
                const ensuiteLabel = `${label} — Ensuite`
                rooms.push({ id: ensuiteId, key: 'ensuite', type: 'ensuite', label: ensuiteLabel, isOOA: false, isEnsuite: true, meta: ensuitePoolEntry })
                migrateLegacySectionData(ensuiteId, [legacyEnsuiteId])
                seedSectionData(ensuiteId, 'ensuite')
            }
        }

        // Standalone bathrooms
        for (let i = 0; i < (store.setup.bathrooms ?? 1); i++) {
            const sectionId = `bathroom_${i + 1}`
            const label     = store.setup.bathrooms > 1 ? `Bathroom ${i + 1}` : 'Bathroom'
            const poolEntry = poolByKey['bathroom']
            rooms.push({ id: sectionId, key: 'bathroom', type: 'bathroom', label, isOOA: false, isEnsuite: false, meta: poolEntry })
            seedSectionData(sectionId, 'bathroom')
        }

        return [...first, ...core, ...optional, ...rooms, ...last]
    }

    // ── Active section list ───────────────────────────────────────────────────
    // The computed list of sections currently in the checklist.
    // This is derived from store.checklistSections (which is what gets persisted).
    // Components read this — they never build sections themselves.
    const checklistSections = computed(() => store.checklistSections)

    // ── Start / rebuild checklist ─────────────────────────────────────────────

    // True if the checklist has been started and contains data the user would
    // lose if they rebuild. Exposed so the caller can show a confirm dialog
    // before calling startChecklist() — this is the bug 6 fix.
    const hasPendingData = computed(() => {
        if (!store.hasChecklistStarted) return false
        return store.checklistSections.some((s) => {
            const data = store.checklistData[s.id]
            if (!data) return false
            const hasItemData  = Object.values(data.items  ?? {}).some((v) => v !== 'unchecked')
            const hasInputData = Object.values(data.inputs ?? {}).some((v) => v !== '' && v != null)
            const hasPhotos    = (data.photos ?? []).length > 0
            const hasNotes     = (data.notes  ?? '').trim().length > 0
            return hasItemData || hasInputData || hasPhotos || hasNotes
        })
    })

    function startChecklist() {
        if (!validateSetup()) return false

        // A report gets a stable server-side identity as soon as it starts.
        // The opaque key is a login-free capability used to recover its draft.
        ensureDraftIdentity()

        // Apply schema defaults if this is a completely fresh start (no sections yet).
        // On a resume, the store already has the user's choices — don't overwrite them.
        if (!store.hasChecklistStarted) {
            if (schemaDefaults.dateToToday && !store.setup.inspectionDate) {
                store.setup.inspectionDate = new Date().toISOString().split('T')[0]
            }
            if (schemaDefaults.pickerValue && !store.setup.pickerValue) {
                store.setup.pickerValue = schemaDefaults.reportSubtype ?? schemaDefaults.sdaCategory ?? null
            }
            if (schemaDefaults.optionalSections?.length && !store.setup.selectedOptional.length) {
                store.setup.selectedOptional = [...schemaDefaults.optionalSections]
            }
            if (optionalMode === 'dynamic' && !store.setup.rooms.length) {
                // Seed the default room instances from the schema
                let instanceCount = {}
                store.setup.rooms = (schemaDefaults.sections ?? []).map((def) => {
                    const poolEntry = poolByKey[def.key]
                    instanceCount[def.key] = (instanceCount[def.key] ?? 0) + 1
                    return {
                        id:         crypto.randomUUID(),
                        key:        def.key,
                        label:      '',
                        hasEnsuite: def.hasEnsuite ?? false,
                        isOOA:      poolEntry?.key === 'ooa',
                    }
                })
                store.setup.bathrooms = schemaDefaults.bathrooms ?? 1
            }
        }

        const sections = optionalMode === 'toggle'
            ? buildToggleSections()
            : buildDynamicSections()

        store.checklistSections = sections
        scheduleDraftSync({ immediate: true })
        return true
    }

    // ── Optional section management ───────────────────────────────────────────
    function toggleOptionalSection(key) {
        const idx = store.setup.selectedOptional.indexOf(key)
        if (idx === -1) {
            store.setup.selectedOptional.push(key)
        } else {
            store.setup.selectedOptional.splice(idx, 1)
        }
    }

    function isOptionalSelected(key) {
        return store.setup.selectedOptional.includes(key)
    }

    // ── Visible optional pool (respects sdaOnly) ──────────────────────────────
    // For handover: hides pool items whose sdaOnly doesn't match pickerValue.
    const visiblePoolSections = computed(() => {
        return (schemaSections.pool ?? []).filter((s) => {
            if (s._managed) return false
            if (!s.sdaOnly) return true
            return s.sdaOnly.includes(store.setup.pickerValue)
        })
    })

    // ── Dynamic room management (inspection) ──────────────────────────────────
    function addRoom(key) {
        const poolEntry = poolByKey[key]
        if (!poolEntry || poolEntry._managed) return
        store.setup.rooms.push({
            id:         crypto.randomUUID(),
            key,
            label:      '',
            hasEnsuite: false,
            isOOA:      key === 'ooa',
        })
    }

    function removeRoom(roomId) {
        const idx = store.setup.rooms.findIndex((r) => r.id === roomId)
        if (idx !== -1) store.setup.rooms.splice(idx, 1)
    }

    function updateRoom(roomId, patch) {
        const room = store.setup.rooms.find((r) => r.id === roomId)
        if (room) Object.assign(room, patch)
    }

    // ── Per-item interactions ─────────────────────────────────────────────────
    function setItemStatus(sectionId, itemId, status) {
        const entry = store.checklistData[sectionId]
        if (!entry) return
        // Tap same status again → toggle off back to unchecked
        entry.items[itemId] = entry.items[itemId] === status ? 'unchecked' : status
        recomputeSectionStatus(sectionId)
    }

    function setItemInput(sectionId, itemId, value) {
        const entry = store.checklistData[sectionId]
        if (!entry) return
        entry.inputs[itemId] = value
        // Changing an input that other items depend on via showIf may affect
        // section completeness — recompute to keep progress bar accurate.
        recomputeSectionStatus(sectionId)
    }

    function setSectionNotes(sectionId, notes) {
        const entry = store.checklistData[sectionId]
        if (entry) entry.notes = notes
    }

    function setSectionStatus(sectionId, status) {
        const entry = store.checklistData[sectionId]
        if (entry) entry.status = status
    }

    // ── Section status auto-derivation ────────────────────────────────────────
    // Derives section-level status from visible item statuses.
    // Priority: issue > attention > ok. All-NA sections are left for manual pick.
    function recomputeSectionStatus(sectionId) {
        const section = store.checklistSections.find((s) => s.id === sectionId)
        if (!section) return

        const entry = store.checklistData[sectionId]
        if (!entry) return

        // Only look at visible status-type items
        const items = getStatusItems(section.key).filter((i) => isItemVisible(i, sectionId))
        if (!items.length) return

        const statuses = items.map((i) => entry.items[i.id] ?? 'unchecked')
        const checked  = statuses.filter((v) => CHECKED_STATUSES.has(v))

        if (checked.length === 0) {
            entry.status = 'unchecked'
            return
        }
        if (checked.every((v) => v === 'na')) {
            // All checked items are N/A — don't auto-override, let officer pick
            return
        }
        if (statuses.includes('issue'))     { entry.status = 'issue';     return }
        if (statuses.includes('attention')) { entry.status = 'attention'; return }
        entry.status = 'ok'
    }

    // ── Progress ──────────────────────────────────────────────────────────────
    // Bug 1 fix: isSectionComplete uses isItemVisible so hidden items don't
    // block completion. A section is complete when every *visible*
    // status-checkable item has been given a value (not 'unchecked').
    function isSectionComplete(sectionId) {
        const section = store.checklistSections.find((s) => s.id === sectionId)
        if (!section) return false

        const entry = store.checklistData[sectionId]
        if (!entry) return false

        const visibleItems = getStatusItems(section.key).filter((i) => isItemVisible(i, sectionId))
        if (!visibleItems.length) return false

        return visibleItems.every((i) => {
            const val = entry.items[i.id] ?? 'unchecked'
            return CHECKED_STATUSES.has(val)
        })
    }

    function isSectionAllNA(sectionId) {
        const section = store.checklistSections.find((s) => s.id === sectionId)
        if (!section) return false
        const entry = store.checklistData[sectionId]
        if (!entry) return false
        const visible = getStatusItems(section.key).filter((i) => isItemVisible(i, sectionId))
        const checked = visible.filter((i) => CHECKED_STATUSES.has(entry.items[i.id]))
        return checked.length > 0 && checked.every((i) => entry.items[i.id] === 'na')
    }

    const completedCount = computed(() =>
        store.checklistSections.filter((s) => isSectionComplete(s.id)).length
    )

    const incompleteSections = computed(() =>
        store.checklistSections.filter((s) => {
            const entry = store.checklistData[s.id]
            if (!entry) return false
            const visible  = getStatusItems(s.key).filter((i) => isItemVisible(i, s.id))
            const checked  = visible.filter((i) => CHECKED_STATUSES.has(entry.items[i.id] ?? 'unchecked'))
            return checked.length > 0 && checked.length < visible.length
        })
    )

    const progressPercent = computed(() => {
        if (!store.checklistSections.length) return 0
        return Math.round((completedCount.value / store.checklistSections.length) * 100)
    })

    const progressGradient = computed(() => {
        const p = progressPercent.value
        if (p === 100) return 'linear-gradient(90deg,#10B981,#059669)'
        if (p >= 60)   return 'linear-gradient(90deg,#0D9488,#10B981)'
        return 'linear-gradient(90deg,#0891B2,#0D9488)'
    })

    // ── Submit stats ──────────────────────────────────────────────────────────
    // Bug 2 fix: only counts visible items, not all items in checklistData.
    const submitStats = computed(() => {
        let ok = 0, attention = 0, issues = 0, total = 0

        for (const section of store.checklistSections) {
            const entry   = store.checklistData[section.id]
            if (!entry) continue
            const visible = getStatusItems(section.key).filter((i) => isItemVisible(i, section.id))
            for (const item of visible) {
                const status = entry.items[item.id] ?? 'unchecked'
                if (status === 'unchecked') continue
                total++
                if (status === 'ok')        ok++
                else if (status === 'attention') attention++
                else if (status === 'issue')    issues++
            }
        }

        return [
            { label: 'Total',     count: total,     color: '#64748B' },
            { label: 'OK',        count: ok,         color: '#10B981' },
            { label: 'Attention', count: attention,  color: '#F59E0B' },
            { label: 'Issues',    count: issues,     color: '#F43F5E' },
        ]
    })

    const flaggedSections = computed(() =>
        store.checklistSections
            .filter((s) => ['issue', 'attention'].includes(store.checklistData[s.id]?.status))
            .map((s)    => ({ ...s, status: store.checklistData[s.id].status }))
            .sort((a, b) => (a.status === 'issue' ? -1 : 1))
    )

    // ── Upload tracking ───────────────────────────────────────────────────────
    // Bug 5 fix: hasAnyUploading checks both section photos AND marketing photos.
    const hasAnyUploading = computed(() => {
        const sectionUploading = Object.values(store.checklistData).some((d) =>
            d.photos?.some((p) => p.uploadStatus === 'uploading')
        )
        if (sectionUploading) return true

        const marketingUploading = Object.values(store.marketingPhotos).some((photos) =>
            photos?.some((p) => p.uploadStatus === 'uploading')
        )
        return marketingUploading
    })

    // ── Photo upload ──────────────────────────────────────────────────────────
    const MAX_UPLOAD_ATTEMPTS = 3
    const INITIAL_UPLOAD_TIMEOUT_MS = 30_000
    const MANUAL_RETRY_TIMEOUT_MS = 120_000
    const MAX_IMAGE_BYTES = 15 * 1024 * 1024

    function classifyUploadError(err, context = {}) {
        const code = err?.code ?? 'unknown'
        const message = err?.message ?? 'Unknown upload error'
        const retryable = RETRYABLE_STORAGE_CODES.has(code) || /timeout/i.test(message)

        const info = {
            timestamp: new Date().toISOString(),
            code,
            message,
            retryable,
            path: context.path ?? '',
            pathPrefix: context.pathPrefix ?? '',
            sectionId: context.sectionId ?? '',
            slotKey: context.slotKey ?? '',
            fileName: context.fileName ?? '',
            fileType: context.fileType ?? '',
            fileSize: context.fileSize ?? 0,
            attempts: context.attempts ?? 0,
            timeoutMs: context.timeoutMs ?? 0,
            online: navigator.onLine,
        }

        info.logText = [
            `timestamp: ${info.timestamp}`,
            `code: ${info.code}`,
            `message: ${info.message}`,
            `retryable: ${String(info.retryable)}`,
            `path: ${info.path}`,
            `pathPrefix: ${info.pathPrefix}`,
            `sectionId: ${info.sectionId}`,
            `slotKey: ${info.slotKey}`,
            `fileName: ${info.fileName}`,
            `fileType: ${info.fileType}`,
            `fileSize: ${info.fileSize}`,
            `attempts: ${info.attempts}`,
            `timeoutMs: ${info.timeoutMs}`,
            `online: ${String(info.online)}`,
        ].join('\n')

        return info
    }

    function preflightImage(file) {
        if (!(file instanceof Blob)) {
            throw { code: 'storage/invalid-file', message: 'The selected file is no longer available in this browser.', retryable: false }
        }
        if (!file.type?.startsWith('image/')) {
            throw { code: 'storage/invalid-file-type', message: 'Only image files can be attached to a report.', retryable: false }
        }
        if (file.size >= MAX_IMAGE_BYTES) {
            throw { code: 'storage/file-too-large', message: 'This image is larger than the 15 MB upload limit.', retryable: false }
        }
    }

    function createStoragePath(pathPrefix, photoId, file) {
        const reportId = store.setup.reportId
        if (!reportId) throw new Error('No report ID — start the report first')
        const extension = file?.name?.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'jpg'
        return `${reportType}s/${reportId}/${pathPrefix}_${photoId}.${extension}`
    }

    function uploadWithDeadline(ref, file, metadata, timeoutMs) {
        return new Promise((resolve, reject) => {
            const task = uploadBytesResumable(ref, file, metadata)
            let settled = false
            let unsubscribe = null
            const finish = (callback, value) => {
                if (settled) return
                settled = true
                clearTimeout(timeout)
                unsubscribe?.()
                callback(value)
            }
            const timeout = setTimeout(() => {
                const timeoutError = Object.assign(new Error(`Upload timed out after ${Math.round(timeoutMs / 1000)} seconds.`), {
                    code: 'storage/timeout',
                })
                task.cancel()
                finish(reject, timeoutError)
            }, timeoutMs)
            unsubscribe = task.on(
                'state_changed',
                undefined,
                (error) => finish(reject, error),
                () => finish(resolve)
            )
        })
    }

    async function uploadPhotoToStorage(file, photo, pathPrefix, context = {}, { timeoutMs = INITIAL_UPLOAD_TIMEOUT_MS } = {}) {
        preflightImage(file)
        ensureDraftIdentity()
        const path = photo.intendedStoragePath || createStoragePath(pathPrefix, photo.id, file)
        photo.intendedStoragePath = path
        const ref = storageRef(storage, path)
        const metadata = {
            contentType: file.type || 'image/jpeg',
            customMetadata: { everhomesDraftKey: store.setup.draftAccessKey },
        }

        let lastError
        for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
            photo.attempts = attempt
            try {
                await uploadWithDeadline(ref, file, metadata, timeoutMs)
                const url = await getDownloadURL(ref)
                return { url, storagePath: path, attempts: attempt }
            } catch (err) {
                lastError = classifyUploadError(err, {
                    ...context,
                    path,
                    pathPrefix,
                    fileName: file?.name ?? '',
                    fileType: file?.type ?? '',
                    fileSize: file?.size ?? 0,
                    attempts: attempt,
                    timeoutMs,
                })
                if (attempt < MAX_UPLOAD_ATTEMPTS) {
                    await new Promise((resolve) => setTimeout(resolve, 1_000 * attempt))
                }
            }
        }
        throw lastError
    }

    async function recordUploadFailure(error, context = {}) {
        if (!store.setup.reportId || !store.setup.draftAccessKey) return
        // Store only terminal failures, so the admin view has useful evidence
        // without receiving a noisy event for every transient retry.
        await recordReportUploadFailure({
            ...draftRequestPayload(),
            failure: {
                ...error,
                sectionId: context.sectionId ?? '',
                slotKey: context.slotKey ?? '',
                occurredAtClient: error.timestamp ?? new Date().toISOString(),
            },
        }).catch(() => {})
    }

    async function uploadExistingPhoto(photo, file, pathPrefix, context, { manualRetry = false } = {}) {
        photo.uploadStatus = 'uploading'
        photo.errorCode = null
        photo.errorMessage = ''
        photo.retryNote = ''
        store.trackUploadStart()
        try {
            // Create/refresh the server draft before attempting the capability-
            // scoped upload. The report survives even if the browser then drops.
            await flushDraftSync()
            const uploaded = await uploadPhotoToStorage(
                file,
                photo,
                pathPrefix,
                context,
                { timeoutMs: manualRetry ? MANUAL_RETRY_TIMEOUT_MS : INITIAL_UPLOAD_TIMEOUT_MS }
            )
            photo.url = uploaded.url
            photo.thumbUrl = uploaded.url
            photo.storagePath = uploaded.storagePath
            photo.errorCode = null
            photo.errorMessage = ''
            photo.retryable = true
            photo.uploadStatus = 'done'
            await forgetReportUploadFile(photo.id).catch(() => {})
            retryFiles.delete(photo.id)
            scheduleDraftSync({ immediate: true })
            return true
        } catch (rawError) {
            const error = rawError?.logText
                ? rawError
                : classifyUploadError(rawError, {
                    ...context,
                    path: photo.intendedStoragePath ?? '',
                    fileName: file?.name ?? '',
                    fileType: file?.type ?? '',
                    fileSize: file?.size ?? 0,
                    attempts: photo.attempts ?? 0,
                    timeoutMs: manualRetry ? MANUAL_RETRY_TIMEOUT_MS : INITIAL_UPLOAD_TIMEOUT_MS,
                })
            photo.errorCode = error.code ?? 'unknown'
            photo.errorMessage = error.message ?? 'Upload failed'
            photo.retryable = error.retryable !== false
            photo.uploadStatus = 'failed'
            await recordUploadFailure(error, context)
            scheduleDraftSync({ immediate: true })
            if (import.meta.env.DEV) console.warn('[everhomes] photo upload failed', error)
            return false
        } finally {
            store.trackUploadEnd()
        }
    }

    async function addPhoto(sectionId, file) {
        const entry = store.checklistData[sectionId]
        if (!entry) {
            const missing = {
                code: 'section/not-found',
                message: `Photo upload section not found: ${sectionId}`,
                retryable: false,
                logText: [
                    `timestamp: ${new Date().toISOString()}`,
                    `code: section/not-found`,
                    `message: Photo upload section not found: ${sectionId}`,
                    `sectionId: ${sectionId}`,
                    `availableSectionIds: ${Object.keys(store.checklistData).join(', ')}`,
                ].join('\n'),
            }
            openFatalError({
                title: 'Upload Error',
                message: 'Oops, something went wrong while uploading this photo.',
                logs: missing.logText,
            })
            return
        }

        const previewUrl = URL.createObjectURL(file)
        const photo = reactive({
            id:           crypto.randomUUID(),
            previewUrl,
            thumbUrl:     previewUrl,
            url:          null,
            storagePath:  null,
            intendedStoragePath: '',
            caption:      '',
            errorCode:    null,
            errorMessage: '',
            retryable:    true,
            retryNote:    '',
            attempts:     0,
            uploadStatus: 'uploading',
        })

        entry.photos.push(photo)
        retryFiles.set(photo.id, file)
        await rememberReportUploadFile(photo.id, file).catch(() => {})

        // Return the entry immediately so captions remain editable while the
        // photo backs up and transfers in the background.
        uploadExistingPhoto(photo, file, `photos/${sectionId}`, { sectionId })

        return photo
    }

    async function retryPhoto(sectionId, photoIdx) {
        const photo = store.checklistData[sectionId]?.photos?.[photoIdx]
        if (!photo || photo.uploadStatus !== 'failed') return

        if (photo.storagePath) {
            try {
                const url = await getDownloadURL(storageRef(storage, photo.storagePath))
                photo.url = url
                photo.thumbUrl = url
                photo.uploadStatus = 'done'
                scheduleDraftSync({ immediate: true })
                return
            } catch {
                // The prior transfer did not reach Storage; retry the original.
            }
        }

        const file = retryFiles.get(photo.id) ?? await recoverReportUploadFile(photo.id).catch(() => null)
        if (!file) {
            photo.errorCode = 'storage/retry-file-unavailable'
            photo.errorMessage = 'The original image is no longer available on this device.'
            photo.retryNote = 'Choose the photo again to retry it.'
            photo.retryable = false
            scheduleDraftSync({ immediate: true })
            return
        }
        retryFiles.set(photo.id, file)
        await uploadExistingPhoto(photo, file, `photos/${sectionId}`, { sectionId }, { manualRetry: true })
    }

    function removePhoto(sectionId, photoIdx) {
        const photos = store.checklistData[sectionId]?.photos
        if (!photos) return
        const photo = photos[photoIdx]
        if (photo?.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(photo.previewUrl)
        }
        retryFiles.delete(photo?.id)
        forgetReportUploadFile(photo?.id).catch(() => {})
        photos.splice(photoIdx, 1)
    }

    // ── Marketing photo upload ────────────────────────────────────────────────
    async function addMarketingPhoto(slotKey, file) {
        if (!store.marketingPhotos[slotKey]) {
            store.marketingPhotos[slotKey] = []
        }

        const previewUrl = URL.createObjectURL(file)
        const photo = reactive({
            id:           crypto.randomUUID(),
            previewUrl,
            thumbUrl:     previewUrl,
            url:          null,
            storagePath:  null,
            intendedStoragePath: '',
            errorCode:    null,
            errorMessage: '',
            retryable:    true,
            retryNote:    '',
            attempts:     0,
            uploadStatus: 'uploading',
        })

        store.marketingPhotos[slotKey].push(photo)
        retryFiles.set(photo.id, file)
        await rememberReportUploadFile(photo.id, file).catch(() => {})
        uploadExistingPhoto(photo, file, `marketing/${slotKey}`, { slotKey })

        return photo
    }

    async function retryMarketingPhoto(slotKey, photoIdx) {
        const photo = store.marketingPhotos[slotKey]?.[photoIdx]
        if (!photo || photo.uploadStatus !== 'failed') return

        if (photo.storagePath) {
            try {
                const url = await getDownloadURL(storageRef(storage, photo.storagePath))
                photo.url = url
                photo.thumbUrl = url
                photo.uploadStatus = 'done'
                scheduleDraftSync({ immediate: true })
                return
            } catch {
                // Retry the retained original below.
            }
        }

        const file = retryFiles.get(photo.id) ?? await recoverReportUploadFile(photo.id).catch(() => null)
        if (!file) {
            photo.errorCode = 'storage/retry-file-unavailable'
            photo.errorMessage = 'The original image is no longer available on this device.'
            photo.retryNote = 'Choose the photo again to retry it.'
            photo.retryable = false
            scheduleDraftSync({ immediate: true })
            return
        }
        retryFiles.set(photo.id, file)
        await uploadExistingPhoto(photo, file, `marketing/${slotKey}`, { slotKey }, { manualRetry: true })
    }

    function removeMarketingPhoto(slotKey, photoIdx) {
        const photos = store.marketingPhotos[slotKey]
        if (!photos) return
        const photo = photos[photoIdx]
        if (photo?.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(photo.previewUrl)
        }
        retryFiles.delete(photo?.id)
        forgetReportUploadFile(photo?.id).catch(() => {})
        photos.splice(photoIdx, 1)
    }

    // ── Submit payload builder ────────────────────────────────────────────────
    // Constructs the full payload for the cloud function.
    // Only includes done photos. The signature data is passed in by SubmitModal
    // since the sig pad refs live there.
    function buildSubmitPayload(staffSignatureData) {
        const sections = store.checklistSections.map((section) => ({
            id:        section.id,
            key:       section.key,
            type:      getSectionType(section),
            label:     section.label,
            isOOA:     section.isOOA     ?? false,
            isEnsuite: section.isEnsuite ?? false,
            status:    store.checklistData[section.id]?.status  ?? 'unchecked',
            notes:     store.checklistData[section.id]?.notes   ?? '',
            items:     store.checklistData[section.id]?.items   ?? {},
            inputs:    store.checklistData[section.id]?.inputs  ?? {},
            photos: (store.checklistData[section.id]?.photos ?? [])
                .filter((p) => p.uploadStatus === 'done' && p.url)
                .map((p) => ({ url: p.url, caption: p.caption ?? '', storagePath: p.storagePath })),
        }))

        const marketingPayload = {}
        if (marketingConfig?.slots) {
            for (const slot of marketingConfig.slots) {
                const photos = (store.marketingPhotos[slot.key] ?? [])
                    .filter((p) => p.uploadStatus === 'done' && p.url)
                    .map((p) => ({ url: p.url, storagePath: p.storagePath }))
                if (photos.length) marketingPayload[slot.key] = photos
            }
        }

        return {
            reportType,
            reportSubtype:   store.setup.pickerValue,
            inspectionId:    store.setup.reportId,
            draftAccessKey:  store.setup.draftAccessKey,
            propertyAddress: store.setup.propertyAddress,
            inspectionDate:  store.setup.inspectionDate,
            inspectorName:   store.setup.inspectorName,
            inspectorEmail:  store.setup.inspectorEmail,
            rooms:           sections, // backend expects 'rooms' key for both report types
            signatures: {
                staff: {
                    name:      store.setup.inspectorName,
                    date:      store.setup.inspectionDate,
                    signature: staffSignatureData,
                },
                tenants: [], // tenant signatures removed
            },
            marketingPhotos: marketingPayload,
        }
    }

    // ── Style helpers ─────────────────────────────────────────────────────────
    function statusColour(status) {
        if (status === 'ok')        return '#10B981'
        if (status === 'attention') return '#F59E0B'
        if (status === 'issue')     return '#F43F5E'
        if (status === 'na')        return '#64748B'
        return '#475569'
    }

    function statusLabel(status) {
        if (status === 'ok')        return 'OK'
        if (status === 'attention') return 'Needs Attention'
        if (status === 'issue')     return 'Issue Found'
        if (status === 'na')        return 'N/A'
        return 'Unchecked'
    }

    function itemRowClass(status) {
        if (status === 'issue')     return 'bg-rose-500/10'
        if (status === 'attention') return 'bg-amber-500/10'
        if (status === 'ok')        return 'bg-emerald-500/10'
        return ''
    }

    function accordionBorderStyle(sectionId) {
        const status = store.checklistData[sectionId]?.status
        if (status === 'ok')        return { borderColor: '#10B98130' }
        if (status === 'attention') return { borderColor: '#F59E0B30' }
        if (status === 'issue')     return { borderColor: '#F43F5E40' }
        return { borderColor: '#1E293B' }
    }

    const SDA_CHIP_STYLES = {
        HPS: { background: '#7c3aed20', border: '1px solid #7c3aed60', color: '#c4b5fd' },
        FA:  { background: '#2563eb20', border: '1px solid #2563eb60', color: '#93c5fd' },
        IL:  { background: '#d9770620', border: '1px solid #d9770660', color: '#fcd34d' },
        R:   { background: '#e11d4820', border: '1px solid #e11d4860', color: '#fca5a5' },
    }

    function sdaChipStyle(chip) {
        return SDA_CHIP_STYLES[chip] ?? {
            background: '#47556920',
            border:     '1px solid #47556960',
            color:      '#94a3b8',
        }
    }

    // ── Public API ────────────────────────────────────────────────────────────
    // Wrapped in reactive() so computed refs auto-unwrap when accessed through
    // this object as a prop in child components. Without reactive(), computed
    // refs inside a plain object prop are NOT auto-unwrapped in templates.
    return reactive({
        // Store passthrough — components read setup state from here
        setup:             store.setup,
        checklistSections,
        checklistData:     store.checklistData,
        marketingPhotos:   store.marketingPhotos,

        // Schema
        schema,

        // Online state
        isOnline,
        fatalError,
        openFatalError,
        closeFatalError,
        draftSync,
        resumeLink,
        copyResumeLink,
        flushDraftSync,
        restoreDraftFromLocation,

        // Setup
        setupErrors,
        validateSetup,

        // Pickers + optionals
        activeSdaBadges,
        visiblePoolSections,
        toggleOptionalSection,
        isOptionalSelected,

        // Dynamic rooms (inspection)
        addRoom,
        removeRoom,
        updateRoom,

        // Checklist lifecycle
        hasPendingData,
        startChecklist,

        // Item access
        isItemVisible,
        getFilteredGroups,
        getStatusItems,
        getInputItems,

        // Interactions
        setItemStatus,
        setItemInput,
        setSectionNotes,
        setSectionStatus,
        recomputeSectionStatus,

        // Progress
        isSectionComplete,
        isSectionAllNA,
        completedCount,
        incompleteSections,
        progressPercent,
        progressGradient,

        // Submit
        submitStats,
        flaggedSections,
        hasAnyUploading,
        buildSubmitPayload,

        // Photos
        addPhoto,
        retryPhoto,
        removePhoto,
        addMarketingPhoto,
        retryMarketingPhoto,
        removeMarketingPhoto,

        // Helpers
        statusColour,
        statusLabel,
        itemRowClass,
        accordionBorderStyle,
        sdaChipStyle,

        // Store actions — wrap hasChecklistStarted in computed so it stays
        // reactive when accessed through the reactive() wrapper.
        resetAll:            store.resetAll,
        hasChecklistStarted: computed(() => store.hasChecklistStarted),
    })
}
