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

// ─── Constants ────────────────────────────────────────────────────────────────

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

// Status values that count as "checked" for progress purposes
const CHECKED_STATUSES = new Set(['ok', 'attention', 'issue', 'na'])

// Item types that are inputs — they go into section.inputs, not section.items
const INPUT_TYPES = new Set(['text', 'number', 'multiline', 'yesno'])

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

    function handleOnline()  { isOnline.value = true }
    function handleOffline() { isOnline.value = false }

    onMounted(() => {
        window.addEventListener('online',  handleOnline)
        window.addEventListener('offline', handleOffline)
    })
    onUnmounted(() => {
        window.removeEventListener('online',  handleOnline)
        window.removeEventListener('offline', handleOffline)
    })

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
            const { id, value } = item.showIf
            const currentVal = store.checklistData[sectionId]?.inputs?.[id] ??
                               store.checklistData[sectionId]?.items?.[id]  ??
                               ''
            if (currentVal !== value) return false
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

    // ── Section building — toggle mode (handover) ─────────────────────────────
    function buildToggleSections() {
        const sections = []

        for (const s of schemaSections.forced) {
            sections.push({ id: `section-${s.key}`, key: s.key, label: s.label, meta: s })
            seedSectionData(`section-${s.key}`, s.key)
        }

        for (const s of schemaSections.pool) {
            if (store.setup.selectedOptional.includes(s.key)) {
                sections.push({ id: `section-${s.key}`, key: s.key, label: s.label, meta: s })
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
            const entry = { id: `section-${s.key}`, key: s.key, label: s.label, meta: s }
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

            const entry = { id: `section-${s.key}`, key: s.key, label: s.label, meta: s }
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
            const count    = instanceCount[room.key]
            const sectionId = `${room.key}_${count}`
            const label    = room.label || `${poolEntry.label} ${count}`

            rooms.push({ id: sectionId, key: room.key, label, isOOA: room.isOOA ?? false, isEnsuite: false, meta: poolEntry })
            seedSectionData(sectionId, poolEntry.itemsKey ?? room.key)

            // Auto-create ensuite if this room has one
            if (room.hasEnsuite) {
                const ensuitePoolEntry = poolByKey['ensuite']
                const ensuiteId    = `ensuite_${count}`
                const ensuiteLabel = `${label} — Ensuite`
                rooms.push({ id: ensuiteId, key: 'ensuite', label: ensuiteLabel, isOOA: false, isEnsuite: true, meta: ensuitePoolEntry })
                seedSectionData(ensuiteId, 'ensuite')
            }
        }

        // Standalone bathrooms
        for (let i = 0; i < (store.setup.bathrooms ?? 1); i++) {
            const sectionId = `bathroom_${i + 1}`
            const label     = store.setup.bathrooms > 1 ? `Bathroom ${i + 1}` : 'Bathroom'
            const poolEntry = poolByKey['bathroom']
            rooms.push({ id: sectionId, key: 'bathroom', label, isOOA: false, isEnsuite: false, meta: poolEntry })
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

        // Seed reportId if not already set
        if (!store.setup.reportId) {
            store.setup.reportId = crypto.randomUUID()
        }

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
    const MAX_UPLOAD_ATTEMPTS  = 3
    const UPLOAD_TIMEOUT_MS    = 30_000

    async function uploadPhotoToStorage(file, pathPrefix) {
        const reportId = store.setup.reportId
        if (!reportId) throw new Error('No report ID — start the report first')

        const ext  = file.name.split('.').pop() || 'jpg'
        const path = `${reportType}s/${reportId}/${pathPrefix}_${Date.now()}.${ext}`
        const ref  = storageRef(storage, path)

        let lastError
        for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
            try {
                await Promise.race([
                    new Promise((resolve, reject) => {
                        const task = uploadBytesResumable(ref, file)
                        task.on('state_changed', null, reject, resolve)
                    }),
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Upload timeout')), UPLOAD_TIMEOUT_MS)
                    ),
                ])
                const url = await getDownloadURL(ref)
                return { url, storagePath: path }
            } catch (err) {
                lastError = err
                if (attempt < MAX_UPLOAD_ATTEMPTS) {
                    await new Promise((r) => setTimeout(r, 1000 * attempt))
                }
            }
        }
        throw lastError
    }

    async function addPhoto(sectionId, file) {
        const entry = store.checklistData[sectionId]
        if (!entry) return

        const previewUrl = URL.createObjectURL(file)
        const photo = reactive({
            previewUrl,
            thumbUrl:     previewUrl,
            url:          null,
            storagePath:  null,
            caption:      '',
            uploadStatus: 'uploading',
        })

        entry.photos.push(photo)
        store.trackUploadStart()

        // Return the reactive photo entry immediately so the caller (PhotoPanel)
        // can set the caption before the upload completes.
        uploadPhotoToStorage(file, `photos/${sectionId}`)
            .then(({ url, storagePath }) => {
                photo.url          = url
                photo.thumbUrl     = url
                photo.storagePath  = storagePath
                photo.uploadStatus = 'done'
            })
            .catch(() => {
                photo.uploadStatus = 'failed'
            })
            .finally(() => {
                store.trackUploadEnd()
            })

        return photo
    }

    async function retryPhoto(sectionId, photoIdx) {
        const photo = store.checklistData[sectionId]?.photos?.[photoIdx]
        if (!photo || photo.uploadStatus !== 'failed') return

        photo.uploadStatus = 'uploading'
        store.trackUploadStart()

        try {
            // If we have a storagePath the upload may have completed server-side —
            // try to get the download URL before re-uploading.
            if (photo.storagePath) {
                try {
                    const ref = storageRef(storage, photo.storagePath)
                    const url = await getDownloadURL(ref)
                    photo.url          = url
                    photo.thumbUrl     = url
                    photo.uploadStatus = 'done'
                    return
                } catch {
                    // Not there — fall through to re-upload
                }
            }
            // Need the original File to re-upload, which we don't have after a
            // page crash. The user will need to re-add the photo manually.
            // Surface a clear error status rather than hanging.
            photo.uploadStatus = 'failed'
            photo.retryNote    = 'Please remove and re-add this photo.'
        } finally {
            store.trackUploadEnd()
        }
    }

    function removePhoto(sectionId, photoIdx) {
        const photos = store.checklistData[sectionId]?.photos
        if (!photos) return
        const photo = photos[photoIdx]
        if (photo?.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(photo.previewUrl)
        }
        photos.splice(photoIdx, 1)
    }

    // ── Marketing photo upload ────────────────────────────────────────────────
    async function addMarketingPhoto(slotKey, file) {
        if (!store.marketingPhotos[slotKey]) {
            store.marketingPhotos[slotKey] = []
        }

        const previewUrl = URL.createObjectURL(file)
        const photo = reactive({
            previewUrl,
            thumbUrl:     previewUrl,
            url:          null,
            storagePath:  null,
            uploadStatus: 'uploading',
        })

        store.marketingPhotos[slotKey].push(photo)
        store.trackUploadStart()

        uploadPhotoToStorage(file, `marketing/${slotKey}`)
            .then(({ url, storagePath }) => {
                photo.url          = url
                photo.thumbUrl     = url
                photo.storagePath  = storagePath
                photo.uploadStatus = 'done'
            })
            .catch(() => {
                photo.uploadStatus = 'failed'
            })
            .finally(() => {
                store.trackUploadEnd()
            })

        return photo
    }

    function removeMarketingPhoto(slotKey, photoIdx) {
        const photos = store.marketingPhotos[slotKey]
        if (!photos) return
        const photo = photos[photoIdx]
        if (photo?.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(photo.previewUrl)
        }
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