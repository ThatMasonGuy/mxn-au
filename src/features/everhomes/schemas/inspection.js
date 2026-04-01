// src/features/everhomes/schemas/inspection.js

// ─── Property Inspection — Report Schema ──────────────────────────────────────
// Single source of truth for everything the frontend needs to render the
// inspection workflow. ReportPage.vue reads this and passes it to useReportState.
//
// Key difference from handover: optionalMode is 'dynamic' — users add room
// instances from the pool rather than toggling a fixed list. Rooms with
// multipleAllowed: true can be added multiple times (Bedroom 1, Bedroom 2 etc.).
//
// OOA rooms use itemsKey: 'bedroom' — they render the bedroom checklist but
// are labelled and tracked as OOA throughout.
//
// Ensuite sections are not standalone pool items — they are created automatically
// when a bedroom instance has hasEnsuite: true. The composable handles this.

import {
    ClipboardCheck,
    Moon,
    Bath,
    Sparkles,
    Tv,
    UtensilsCrossed,
    Flame,
    Wrench,
    Monitor,
    Truck,
    Sun,
    Trees,
    Archive,
    Building2,
    Home,
} from 'lucide-vue-next'

import { CHECKLIST_ITEMS, _common } from '../data/inspectionItems.js'

// ─── Report Subtype Picker ────────────────────────────────────────────────────
// Entry and Exit reports are removed — the government compliance requirements
// are too specific for the current schema. They will return as separate schemas
// when the spec is finalised.

const REPORT_SUBTYPES = [
    { key: 'routine', label: 'Routine Inspection' },
    { key: 'event',   label: 'Event Response' },
]

// ─── Marketing Photo Slots ────────────────────────────────────────────────────
// Identical to handover slots but optional: true — user must toggle the section
// on in setup before it appears in the checklist.

const MARKETING_SLOTS = [
    { key: 'frontExterior', label: 'Front Exterior', hint: 'Full front view of the property from the street' },
    { key: 'kitchenWide',   label: 'Kitchen Wide',   hint: 'Wide-angle shot showing the full kitchen' },
    { key: 'livingArea',    label: 'Living Area',    hint: 'Main living space — open and well-lit' },
    { key: 'mainBedroom',   label: 'Main Bedroom',   hint: 'Primary bedroom — bed area and window' },
    { key: 'bathroom',      label: 'Bathroom',       hint: 'Main bathroom — clean and bright' },
    { key: 'outdoorGarden', label: 'Outdoor / Garden', hint: 'Backyard, patio, or balcony area' },
    { key: 'streetView',    label: 'Street View',    hint: 'Property from across the street with surroundings' },
]

// ─── Schema Export ────────────────────────────────────────────────────────────

export default {
    // ── Identity ──────────────────────────────────────────────────────────────
    reportType: 'inspection',
    cacheVersion: 'v2',
    collection: 'inspections',

    // ── Display ───────────────────────────────────────────────────────────────
    title: 'Property Inspection',
    subtitle: 'Walk through property rooms and capture photos for each area.',
    topBarLabel: 'Inspection',

    // ── Backend / email config ────────────────────────────────────────────────
    emailSubjectPrefix: 'Inspection Report',
    fromName: 'Everhomes Inspections',

    // ── Setup step picker ─────────────────────────────────────────────────────
    pickerMode: 'reportSubtype',
    pickerOptions: REPORT_SUBTYPES,

    // ── SDA badge filtering ───────────────────────────────────────────────────
    // Inspection does not filter by SDA category — all items are always shown.
    sdaFilter: false,

    // ── Section system ────────────────────────────────────────────────────────
    optionalMode: 'dynamic',

    sections: {
        // Forced sections — always included, always in this order relative to
        // their orderGroup. The composable uses orderGroup to interleave forced
        // and pool sections in the correct walk-through sequence:
        //
        //   'first'    — placed before everything else (driveway)
        //   'core'     — entry, living, kitchen — always after first
        //   'optional' — user-added single-instance areas
        //   'rooms'    — bedrooms, ensuites, bathrooms (added by user)
        //   'last'     — general property — always last regardless of position
        forced: [
            { key: 'entry',   label: 'Entry / Hallway',   color: '#EA580C', icon: Home,           gradient: 'linear-gradient(135deg,#EA580C,#FB923C)', orderGroup: 'core' },
            { key: 'living',  label: 'Living Room',        color: '#D97706', icon: Tv,             gradient: 'linear-gradient(135deg,#D97706,#FBBF24)', orderGroup: 'core' },
            { key: 'kitchen', label: 'Kitchen',            color: '#C2410C', icon: Flame,          gradient: 'linear-gradient(135deg,#C2410C,#F97316)', orderGroup: 'core' },
            { key: 'general', label: 'General Property',   color: '#059669', icon: ClipboardCheck, gradient: 'linear-gradient(135deg,#059669,#10B981)', orderGroup: 'last' },
        ],

        // Pool — user adds these from the setup step.
        //
        // multipleAllowed: true  — can add multiple instances (Bedroom 1, 2, 3...)
        // multipleAllowed: false — one-shot toggle (either added or not)
        // canHaveEnsuite: true   — when adding this room, user gets a toggle for
        //                          an ensuite. The composable creates a paired
        //                          ensuite section automatically if toggled.
        // itemsKey               — which CHECKLIST_ITEMS key to use for this room's
        //                          checklist. Defaults to `key` if not specified.
        //                          OOA uses 'bedroom' so it gets the bedroom items.
        pool: [
            // ── First (arrive at property) ─────────────────────────────────
            { key: 'driveway', label: 'Driveway',       color: '#64748B', icon: Truck,         gradient: 'linear-gradient(135deg,#475569,#94A3B8)', multipleAllowed: false, orderGroup: 'first' },

            // ── Optional single-instance areas ────────────────────────────
            { key: 'dining',   label: 'Dining Room',    color: '#B45309', icon: UtensilsCrossed, gradient: 'linear-gradient(135deg,#B45309,#F59E0B)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'laundry',  label: 'Laundry',        color: '#0D9488', icon: Wrench,          gradient: 'linear-gradient(135deg,#0D9488,#2DD4BF)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'study',    label: 'Study / Office', color: '#4F46E5', icon: Monitor,         gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'garage',   label: 'Garage / Carport', color: '#475569', icon: Truck,         gradient: 'linear-gradient(135deg,#475569,#94A3B8)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'outdoor',  label: 'Patio / Balcony', color: '#0891B2', icon: Sun,            gradient: 'linear-gradient(135deg,#0891B2,#38BDF8)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'garden',   label: 'Garden / Lawn',  color: '#15803D', icon: Trees,           gradient: 'linear-gradient(135deg,#15803D,#4ADE80)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'common',   label: 'Common Area',    color: '#7C3AED', icon: Building2,       gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)', multipleAllowed: false, orderGroup: 'optional' },
            { key: 'storage',  label: 'Storage',        color: '#6B7280', icon: Archive,         gradient: 'linear-gradient(135deg,#6B7280,#D1D5DB)', multipleAllowed: false, orderGroup: 'optional' },

            // ── Multi-instance rooms ───────────────────────────────────────
            { key: 'bedroom',  label: 'Bedroom',        color: '#7C3AED', icon: Moon,            gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)', multipleAllowed: true, canHaveEnsuite: true,  orderGroup: 'rooms' },
            { key: 'ooa',      label: 'OOA',            color: '#64748B', icon: Building2,       gradient: 'linear-gradient(135deg,#475569,#94A3B8)', multipleAllowed: true, canHaveEnsuite: false, itemsKey: 'bedroom', orderGroup: 'rooms' },
            { key: 'bathroom', label: 'Bathroom',       color: '#0284C7', icon: Sparkles,        gradient: 'linear-gradient(135deg,#0284C7,#38BDF8)', multipleAllowed: true, orderGroup: 'rooms' },

            // ── Ensuite — not user-selectable from pool directly ──────────
            // Ensuite sections are created by the composable when a bedroom
            // has hasEnsuite: true. This entry exists so the composable can
            // resolve the section's icon, gradient, and itemsKey.
            { key: 'ensuite',  label: 'Ensuite',        color: '#0891B2', icon: Bath,            gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)', multipleAllowed: true, _managed: true, orderGroup: 'rooms' },
        ],
    },

    // ── Marketing photos ──────────────────────────────────────────────────────
    marketingPhotos: {
        optional: true,     // User explicitly enables in setup
        slots: MARKETING_SLOTS,
    },

    // ── Signatures ────────────────────────────────────────────────────────────
    signatures: {
        staff: true,
        tenants: false,     // Tenant signatures removed — no longer required
    },

    // ── Form builder defaults ─────────────────────────────────────────────────
    // Applied when the user clicks "Start" on a fresh form (no cached state).
    //
    // defaults.sections defines the room instances pre-added to the checklist.
    // Each entry matches a pool key. The composable resolves labels, itemsKey,
    // and ensuite pairing from the pool definition at init time.
    defaults: {
        reportSubtype: 'routine',   // Pre-select Routine Inspection in the picker
        dateToToday: true,          // Pre-fill inspection date with today's date
        bathrooms: 1,               // Number of standalone bathroom instances
        optionalSections: ['dining', 'laundry'],  // Pre-toggled optional areas
        sections: [
            { key: 'bedroom', instance: 1, hasEnsuite: true },
            { key: 'bedroom', instance: 2, hasEnsuite: true },
            { key: 'ooa',     instance: 1, hasEnsuite: false },
        ],
    },

    // ── Checklist item definitions ────────────────────────────────────────────
    items: CHECKLIST_ITEMS,
    fallback: _common,      // Used when a room type has no entry in CHECKLIST_ITEMS
}
