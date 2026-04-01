// src/features/everhomes/schemas/handover.js

// ─── Handover / Annual Review — Report Schema ─────────────────────────────────
// Single source of truth for everything the frontend needs to render the handover
// workflow. ReportPage.vue reads this and passes it to useReportState — nothing
// else in the component tree knows or cares which report type it is.
//
// Backend (generateInspectionReport.mjs) is unaffected by changes here.
// The only shared contract is item `id` values in handoverItems.js — if you
// rename those, update the backend handoverItems.mjs to match.

import {
    ClipboardCheck,
    DoorOpen,
    Columns,
    AppWindow,
    Droplets,
    UtensilsCrossed,
    Wrench,
    BedDouble,
    Sofa,
    Rows3,
    ParkingSquare,
    MoveUp,
    TreePine,
    ShieldAlert,
} from 'lucide-vue-next'

import { HANDOVER_ITEMS } from '../data/handoverItems.js'

// ─── SDA Design Category Picker ──────────────────────────────────────────────
// `includes` defines which badge values are "visible" when this category is
// selected. Items whose badges array contains at least one value in `includes`
// will be shown. Items with no badges array are always shown.

const SDA_CATEGORIES = [
    {
        key: 'HPS',
        label: 'High Physical Support',
        color: '#7c3aed',
        includes: ['HPS', 'FA', 'IL'],
    },
    {
        key: 'FA',
        label: 'Fully Accessible',
        color: '#2563eb',
        includes: ['FA', 'IL'],
    },
    {
        key: 'IL',
        label: 'Improved Liveability',
        color: '#d97706',
        includes: ['IL'],
    },
    {
        key: 'R',
        label: 'Robust',
        color: '#e11d48',
        includes: ['R', 'IL'],
    },
]

// ─── Marketing Photo Slots ────────────────────────────────────────────────────

const MARKETING_SLOTS = [
    { key: 'frontExterior', label: 'Front Exterior', hint: 'Full front view of the property from the street' },
    { key: 'kitchenWide', label: 'Kitchen Wide', hint: 'Wide-angle shot showing the full kitchen' },
    { key: 'livingArea', label: 'Living Area', hint: 'Main living space — open and well-lit' },
    { key: 'mainBedroom', label: 'Main Bedroom', hint: 'Primary bedroom — bed area and window' },
    { key: 'bathroom', label: 'Bathroom', hint: 'Main bathroom — clean and bright' },
    { key: 'outdoorGarden', label: 'Outdoor / Garden', hint: 'Backyard, patio, or balcony area' },
    { key: 'streetView', label: 'Street View', hint: 'Property from across the street with surroundings' },
]

// ─── Schema Export ────────────────────────────────────────────────────────────

export default {
    // ── Identity ──────────────────────────────────────────────────────────────
    reportType: 'handover',
    cacheVersion: 'v1',
    collection: 'handovers',

    // ── Display ───────────────────────────────────────────────────────────────
    title: 'Handover / Annual Review',
    subtitle: 'SDA Dwelling Suitability Review — select the sections applicable to this property.',
    topBarLabel: 'Handover Review',

    // ── Backend / email config ────────────────────────────────────────────────
    emailSubjectPrefix: 'Property Handover',
    fromName: 'Everhomes Onboarding',

    // ── Setup step picker ─────────────────────────────────────────────────────
    // 'sdaCategory' — renders the SDA design category chip picker (handover)
    // 'reportSubtype' — renders the report type picker (inspection)
    // null — no picker, setup step only shows address/date/staff fields
    pickerMode: 'sdaCategory',
    pickerOptions: SDA_CATEGORIES,

    // ── SDA badge filtering ───────────────────────────────────────────────────
    // When true, checklist items with a `badges` array are filtered based on
    // the selected pickerOption's `includes` list. Items with no badges are
    // always shown. When false, all items are always shown.
    sdaFilter: true,

    // ── Section system ────────────────────────────────────────────────────────
    // 'toggle' — fixed pool of optional sections the user toggles on/off
    // 'dynamic' — user adds room instances from a pool (supports multipleAllowed)
    optionalMode: 'toggle',

    sections: {
        // Forced sections are always included. Rendered as locked chips in setup.
        // Displayed in the order declared here.
        forced: [
            { key: 'general',   label: 'General & Compliance',  color: '#0D9488', icon: ClipboardCheck,    gradient: 'linear-gradient(135deg,#0D9488,#2DD4BF)' },
            { key: 'entrance',  label: 'Entrance & Doors',       color: '#EA580C', icon: DoorOpen,          gradient: 'linear-gradient(135deg,#EA580C,#FB923C)' },
            { key: 'corridors', label: 'Corridors',              color: '#7C3AED', icon: Columns,           gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)' },
            { key: 'windows',   label: 'Windows & Glazing',      color: '#0284C7', icon: AppWindow,         gradient: 'linear-gradient(135deg,#0284C7,#38BDF8)' },
            { key: 'sanitary',  label: 'Sanitary / Bathrooms',   color: '#0891B2', icon: Droplets,          gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)' },
            { key: 'kitchen',   label: 'Kitchen',                color: '#C2410C', icon: UtensilsCrossed,   gradient: 'linear-gradient(135deg,#C2410C,#F97316)' },
            { key: 'laundry',   label: 'Laundry',                color: '#4F46E5', icon: Wrench,            gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)' },
            { key: 'bedroom',   label: 'Bedroom(s)',             color: '#7C3AED', icon: BedDouble,         gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)' },
            { key: 'living',    label: 'Living Areas',           color: '#D97706', icon: Sofa,              gradient: 'linear-gradient(135deg,#D97706,#FBBF24)' },
        ],

        // Pool sections can be toggled on/off by the user in the setup step.
        // sdaOnly: ['R'] means this section is hidden in setup unless the
        // selected SDA category key matches one of the values listed.
        pool: [
            { key: 'accessway',  label: 'Accessways',      color: '#0891B2', icon: Rows3,         gradient: 'linear-gradient(135deg,#0891B2,#38BDF8)' },
            { key: 'carParking', label: 'Car Parking',      color: '#475569', icon: ParkingSquare, gradient: 'linear-gradient(135deg,#475569,#94A3B8)' },
            { key: 'stairs',     label: 'Stairs & Lifts',   color: '#64748B', icon: MoveUp,        gradient: 'linear-gradient(135deg,#64748B,#CBD5E1)' },
            { key: 'external',   label: 'External Areas',   color: '#15803D', icon: TreePine,      gradient: 'linear-gradient(135deg,#15803D,#4ADE80)' },
            { key: 'breakout',   label: 'Breakout Room',    color: '#B45309', icon: ShieldAlert,   gradient: 'linear-gradient(135deg,#B45309,#F59E0B)', sdaOnly: ['R'] },
        ],
    },

    // ── Marketing photos ──────────────────────────────────────────────────────
    // optional: false — section always visible, no toggle
    // optional: true  — user explicitly enables it in setup
    // null            — marketing photos not available for this report type
    marketingPhotos: {
        optional: false,
        slots: MARKETING_SLOTS,
    },

    // ── Signatures ────────────────────────────────────────────────────────────
    signatures: {
        staff: true,
        tenants: false,
    },

    // ── Form builder defaults ─────────────────────────────────────────────────
    // Applied when the user clicks "Start" on a fresh form (no cached state).
    defaults: {
        sdaCategory: null,          // No SDA category pre-selected — user must choose
        dateToToday: true,          // Pre-fill inspection date with today's date
        optionalSections: [],       // No optional sections toggled on by default
    },

    // ── Checklist item definitions ────────────────────────────────────────────
    items: HANDOVER_ITEMS,
}
