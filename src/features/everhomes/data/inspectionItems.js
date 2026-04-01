// src/features/everhomes/data/inspectionItems.js

// ─── Inspection Checklist Definitions ────────────────────────────────────────
// Mirrors the backend checklistSchemas/inspectionItems.mjs.
// If you add/rename/remove items here, do the same in the backend file.

export const _common = [
    {
        group: 'Structure',
        items: [
            { id: 'walls', label: 'Walls' },
            { id: 'ceiling', label: 'Ceiling' },
            { id: 'floor', label: 'Floor / Carpet' },
        ]
    },
    {
        group: 'Fixtures',
        items: [
            { id: 'lighting', label: 'Lighting' },
            { id: 'power', label: 'Power Points & Switches' },
            { id: 'window', label: 'Windows, Latches & Flyscreens' },
            { id: 'door', label: 'Door, Lock & Handle' },
        ]
    },
]

export const CHECKLIST_ITEMS = {
    general: [
        {
            group: 'Safety & Compliance',
            items: [
                { id: 'smokeAlarms', label: 'Smoke Alarms — Present & Functional' },
                { id: 'fireSafety', label: 'Fire Safety Equipment — Extinguisher / Blanket' },
                { id: 'fireSafetyType', label: 'Fire Safety — Equipment Type', type: 'text', placeholder: 'e.g. Powder ABE extinguisher' },
                { id: 'fireSafetyLocation', label: 'Fire Safety — Equipment Location', type: 'text', placeholder: 'e.g. Kitchen hallway, laundry' },
                { id: 'fireSafetyDate', label: 'Fire Safety — Last Service Date', type: 'text', placeholder: 'e.g. 14/03/2025' },
                { id: 'upsBattery', label: 'UPS / Battery Backup — Present & Functional' },
                { id: 'upsBatteryLocation', label: 'UPS / Battery Backup — Location', type: 'text', placeholder: 'e.g. Garage cabinet' },
                { id: 'upsBatteryDate', label: 'UPS / Battery Backup — Last Service Date', type: 'text', placeholder: 'e.g. 14/03/2025' },
            ]
        },
        {
            group: 'Meter Readings',
            items: [
                { id: 'waterMeter', label: 'Water Meter Reading', type: 'text', placeholder: 'e.g. 12345.67 kL' },
                { id: 'nmiReading', label: 'National Metering Identifier (NMI)', type: 'text', placeholder: 'e.g. 6305012345' },
            ]
        },
    ],

    bedroom: [
        ..._common,
        {
            group: 'Bedroom Fixtures',
            items: [
                { id: 'wardrobe', label: 'Wardrobe / Robe' },
                { id: 'blinds', label: 'Window Coverings / Blinds' },
                { id: 'aircon', label: 'Air Conditioning Unit' },
                { id: 'fan', label: 'Ceiling / Standing Fan' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'duress', label: 'Emergency Call / Duress Button', sda: true },
                { id: 'grabRail', label: 'Grab Rail', sda: true },
                { id: 'hoist', label: 'Ceiling Hoist / Tracking', sda: true },
            ]
        },
    ],

    ensuite: [
        ..._common,
        {
            group: 'Bathroom Fixtures',
            items: [
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'toilet', label: 'Toilet — Flush, Seat, Cistern' },
                { id: 'basin', label: 'Basin / Vanity — Taps, Drain' },
                { id: 'shower', label: 'Shower / Bath — Taps, Drain' },
                { id: 'exhaust', label: 'Exhaust Fan' },
                { id: 'mirror', label: 'Mirror / Cabinet' },
                { id: 'towelRail', label: 'Towel Rail(s)' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'rollIn', label: 'Roll-in Shower / Chair Space', sda: true },
                { id: 'grabShower', label: 'Grab Rails — Shower', sda: true },
                { id: 'grabToilet', label: 'Grab Rails — Toilet', sda: true },
                { id: 'nonSlip', label: 'Non-Slip Flooring', sda: true },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings', sda: true },
                { id: 'duress', label: 'Emergency Call / Duress Button', sda: true },
            ]
        },
    ],

    bathroom: [
        ..._common,
        {
            group: 'Bathroom Fixtures',
            items: [
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'toilet', label: 'Toilet — Flush, Seat, Cistern' },
                { id: 'basin', label: 'Basin / Vanity — Taps, Drain' },
                { id: 'shower', label: 'Shower / Bath — Taps, Drain' },
                { id: 'exhaust', label: 'Exhaust Fan' },
                { id: 'mirror', label: 'Mirror / Cabinet' },
                { id: 'towelRail', label: 'Towel Rail(s)' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'rollIn', label: 'Roll-in Shower / Chair Space', sda: true },
                { id: 'grabShower', label: 'Grab Rails — Shower', sda: true },
                { id: 'grabToilet', label: 'Grab Rails — Toilet', sda: true },
                { id: 'nonSlip', label: 'Non-Slip Flooring', sda: true },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings', sda: true },
                { id: 'duress', label: 'Emergency Call / Duress Button', sda: true },
            ]
        },
    ],

    living: [
        ..._common,
        {
            group: 'Living Room',
            items: [
                { id: 'blinds', label: 'Window Coverings / Blinds' },
                { id: 'tv', label: 'TV Aerial / Data Outlet' },
                { id: 'aircon', label: 'Air Conditioning Unit' },
                { id: 'fan', label: 'Ceiling / Standing Fan' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'turning', label: 'Accessible Turning Radius Clear', sda: true },
                { id: 'pathways', label: 'Pathways Unobstructed', sda: true },
            ]
        },
    ],

    dining: [
        ..._common,
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'turning', label: 'Accessible Turning Radius Clear', sda: true },
                { id: 'pathways', label: 'Pathways Unobstructed', sda: true },
            ]
        },
    ],

    kitchen: [
        ..._common,
        {
            group: 'Kitchen Fixtures',
            items: [
                { id: 'sink', label: 'Sink — Taps, No Leaks, Drain' },
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'cooktop', label: 'Cooktop / Oven — Functional' },
                { id: 'rangehood', label: 'Rangehood / Exhaust — Functional' },
                { id: 'cabinets', label: 'Cabinets & Drawers' },
                { id: 'fridge', label: 'Fridge Space / Connections' },
                { id: 'dishwasher', label: 'Dishwasher' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'adjBench', label: 'Accessible / Adjustable Benchtop', sda: true },
                { id: 'clearance', label: 'Under-Bench Wheelchair Clearance', sda: true },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings', sda: true },
            ]
        },
    ],

    laundry: [
        ..._common,
        {
            group: 'Laundry Fixtures',
            items: [
                { id: 'taps', label: 'Taps — Hot & Cold, No Leaks' },
                { id: 'drain', label: 'Drain — Unobstructed' },
                { id: 'connections', label: 'Washer / Dryer Connections' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'height', label: 'Accessible Machine Height', sda: true },
                { id: 'clearance', label: 'Wheelchair Clearance / Turning', sda: true },
            ]
        },
    ],

    study: [
        ..._common,
        {
            group: 'Study / Office',
            items: [
                { id: 'data', label: 'Data / Phone Outlets' },
                { id: 'blinds', label: 'Window Coverings / Blinds' },
            ]
        },
    ],

    garage: [
        {
            group: 'Structure',
            items: [
                { id: 'walls', label: 'Walls' },
                { id: 'ceiling', label: 'Ceiling' },
                { id: 'floor', label: 'Floor — Cracks, Oil Stains' },
            ]
        },
        {
            group: 'Garage / Carport',
            items: [
                { id: 'door', label: 'Door — Opens/Closes, Auto Reverse' },
                { id: 'remote', label: 'Remote / Key Pad Access' },
                { id: 'lighting', label: 'Lighting' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'width', label: 'Bay Width Accessible (≥3.2m)', sda: true },
                { id: 'threshold', label: 'No Step at Entry', sda: true },
            ]
        },
    ],

    outdoor: [
        {
            group: 'Patio / Balcony',
            items: [
                { id: 'floor', label: 'Surface — Cracks, Damage' },
                { id: 'walls', label: 'Walls / Balustrade' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'drainage', label: 'Drainage — No Pooling' },
                { id: 'door', label: 'Access Door / Sliding' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'nonSlip', label: 'Non-Slip Surface', sda: true },
                { id: 'ramp', label: 'Ramp / Level Access', sda: true },
                { id: 'threshold', label: 'Accessible Threshold (≤12mm)', sda: true },
            ]
        },
    ],

    garden: [
        {
            group: 'Garden / Lawn',
            items: [
                { id: 'lawn', label: 'Lawn — Maintained, No Hazards' },
                { id: 'paths', label: 'Paths / Paving — Level, No Trip Hazards' },
                { id: 'tap', label: 'Garden Tap / Irrigation' },
                { id: 'fencing', label: 'Fencing / Gates' },
                { id: 'lighting', label: 'External Lighting' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'access', label: 'Accessible Path to/from Entry', sda: true },
            ]
        },
    ],

    storage: [
        {
            group: 'Structure',
            items: [
                { id: 'walls', label: 'Walls' },
                { id: 'ceiling', label: 'Ceiling' },
                { id: 'floor', label: 'Floor' },
            ]
        },
        {
            group: 'Storage',
            items: [
                { id: 'door', label: 'Door / Access — Functional, Locks' },
                { id: 'interior', label: 'Interior — Clean, Dry, No Pests' },
                { id: 'lighting', label: 'Lighting' },
            ]
        },
    ],

    entry: [
        {
            group: 'Structure',
            items: [
                { id: 'walls', label: 'Walls' },
                { id: 'ceiling', label: 'Ceiling' },
                { id: 'floor', label: 'Floor / Mat Area' },
            ]
        },
        {
            group: 'Entry / Hallway',
            items: [
                { id: 'lighting', label: 'Lighting' },
                { id: 'frontDoor', label: 'Front Door — Lock, Handle, Seal' },
                { id: 'intercom', label: 'Doorbell / Intercom' },
                { id: 'keySafe', label: 'Key Safe / Lockbox' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'threshold', label: 'No Step at Threshold / Ramp Present', sda: true },
                { id: 'turning', label: 'Turning Space Inside Entry', sda: true },
            ]
        },
    ],

    driveway: [
        {
            group: 'Driveway / Parking',
            items: [
                { id: 'surface', label: 'Surface — Cracks, Damage, Potholes' },
                { id: 'marking', label: 'Line Marking / Bay Designation' },
                { id: 'lighting', label: 'External Lighting' },
            ]
        },
    ],

    common: [
        {
            group: 'Common Area',
            items: [
                { id: 'floor', label: 'Floor / Carpet' },
                { id: 'walls', label: 'Walls' },
                { id: 'ceiling', label: 'Ceiling' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'exits', label: 'Emergency Exits — Clear & Signposted' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'pathways', label: 'Accessible Pathways Unobstructed', sda: true },
                { id: 'signage', label: 'Accessible Signage Adequate', sda: true },
                { id: 'duress', label: 'Emergency Call Points Functional', sda: true },
            ]
        },
    ],
}

/** Returns the checklist groups for a room type, falling back to _common. */
export function getChecklistGroups(type) {
    return CHECKLIST_ITEMS[type] ?? _common
}