// ─── Inspection Checklist Definitions ────────────────────────────────────────
// Mirrors the frontend CHECKLIST_ITEMS for the inspection workflow.
// Imported by the schema registry — do not import directly in the cloud function.

export const _common = [
    {
        group: 'Structure', items: [
            { id: 'walls', label: 'Walls' },
            { id: 'ceiling', label: 'Ceiling' },
            { id: 'floor', label: 'Floor / Carpet' },
        ]
    },
    {
        group: 'Fixtures', items: [
            { id: 'lighting', label: 'Lighting' },
            { id: 'power', label: 'Power Points & Switches' },
            { id: 'window', label: 'Windows, Latches & Flyscreens' },
            { id: 'door', label: 'Door, Lock & Handle' },
        ]
    },
];

export const CHECKLIST_ITEMS = {
    bedroom: [
        ..._common,
        {
            group: 'Bedroom Fixtures', items: [
                { id: 'wardrobe', label: 'Wardrobe / Robe' },
                { id: 'blinds', label: 'Window Coverings / Blinds' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'duress', label: 'Emergency Call / Duress Button' },
                { id: 'grabRail', label: 'Grab Rail (if applicable)' },
                { id: 'hoist', label: 'Ceiling Hoist / Tracking' },
            ]
        },
    ],
    ensuite: [
        ..._common,
        {
            group: 'Bathroom Fixtures', items: [
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'toilet', label: 'Toilet — Flush, Seat, Cistern' },
                { id: 'basin', label: 'Basin / Vanity — Taps, Drain' },
                { id: 'shower', label: 'Shower / Bath — Taps, Drain' },
                { id: 'exhaust', label: 'Exhaust Fan' },
                { id: 'mirror', label: 'Mirror / Cabinet' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'rollIn', label: 'Roll-in Shower / Chair Space' },
                { id: 'grabShower', label: 'Grab Rails — Shower' },
                { id: 'grabToilet', label: 'Grab Rails — Toilet' },
                { id: 'nonSlip', label: 'Non-Slip Flooring' },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings' },
                { id: 'duress', label: 'Emergency Call / Duress Button' },
            ]
        },
    ],
    bathroom: [
        ..._common,
        {
            group: 'Bathroom Fixtures', items: [
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'toilet', label: 'Toilet — Flush, Seat, Cistern' },
                { id: 'basin', label: 'Basin / Vanity — Taps, Drain' },
                { id: 'shower', label: 'Shower / Bath — Taps, Drain' },
                { id: 'exhaust', label: 'Exhaust Fan' },
                { id: 'mirror', label: 'Mirror / Cabinet' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'rollIn', label: 'Roll-in Shower / Chair Space' },
                { id: 'grabShower', label: 'Grab Rails — Shower' },
                { id: 'grabToilet', label: 'Grab Rails — Toilet' },
                { id: 'nonSlip', label: 'Non-Slip Flooring' },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings' },
                { id: 'duress', label: 'Emergency Call / Duress Button' },
            ]
        },
    ],
    living: [
        ..._common,
        {
            group: 'Living Room', items: [
                { id: 'blinds', label: 'Window Coverings / Blinds' },
                { id: 'tv', label: 'TV Aerial / Data Outlet' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'turning', label: 'Accessible Turning Radius Clear' },
                { id: 'pathways', label: 'Pathways Unobstructed' },
            ]
        },
    ],
    dining: [
        ..._common,
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'turning', label: 'Accessible Turning Radius Clear' },
                { id: 'pathways', label: 'Pathways Unobstructed' },
            ]
        },
    ],
    kitchen: [
        ..._common,
        {
            group: 'Kitchen Fixtures', items: [
                { id: 'sink', label: 'Sink — Taps, No Leaks, Drain' },
                { id: 'hotwater', label: 'Hot Water — Functional' },
                { id: 'cooktop', label: 'Cooktop / Oven — Functional' },
                { id: 'rangehood', label: 'Rangehood / Exhaust — Functional' },
                { id: 'cabinets', label: 'Cabinets & Drawers' },
                { id: 'fridge', label: 'Fridge Space / Connections' },
                { id: 'dishwasher', label: 'Dishwasher (if applicable)' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'adjBench', label: 'Accessible / Adjustable Benchtop' },
                { id: 'clearance', label: 'Under-Bench Wheelchair Clearance' },
                { id: 'leverTaps', label: 'Lever Taps / Accessible Fittings' },
            ]
        },
    ],
    laundry: [
        ..._common,
        {
            group: 'Laundry Fixtures', items: [
                { id: 'taps', label: 'Taps — Hot & Cold, No Leaks' },
                { id: 'drain', label: 'Drain — Unobstructed' },
                { id: 'connections', label: 'Washer / Dryer Connections' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'height', label: 'Accessible Machine Height' },
                { id: 'clearance', label: 'Wheelchair Clearance / Turning' },
            ]
        },
    ],
    study: [
        ..._common,
        {
            group: 'Study / Office', items: [
                { id: 'data', label: 'Data / Phone Outlets' },
                { id: 'blinds', label: 'Window Coverings / Blinds' },
            ]
        },
    ],
    garage: [
        {
            group: 'Garage / Carport', items: [
                { id: 'door', label: 'Door — Opens/Closes, Auto Reverse' },
                { id: 'remote', label: 'Remote / Key Pad Access' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'floor', label: 'Floor — Cracks, Oil Stains' },
                { id: 'walls', label: 'Walls' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'width', label: 'Bay Width Accessible (≥3.2m)' },
                { id: 'threshold', label: 'No Step at Entry' },
            ]
        },
    ],
    outdoor: [
        {
            group: 'Patio / Balcony', items: [
                { id: 'floor', label: 'Surface — Cracks, Damage' },
                { id: 'walls', label: 'Walls / Balustrade' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'drainage', label: 'Drainage — No Pooling' },
                { id: 'door', label: 'Access Door / Sliding' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'nonSlip', label: 'Non-Slip Surface' },
                { id: 'ramp', label: 'Ramp / Level Access (if applicable)' },
                { id: 'threshold', label: 'Accessible Threshold (≤12mm)' },
            ]
        },
    ],
    garden: [
        {
            group: 'Garden / Lawn', items: [
                { id: 'lawn', label: 'Lawn — Maintained, No Hazards' },
                { id: 'paths', label: 'Paths / Paving — Level, No Trip Hazards' },
                { id: 'tap', label: 'Garden Tap / Irrigation' },
                { id: 'fencing', label: 'Fencing / Gates' },
                { id: 'lighting', label: 'External Lighting' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'access', label: 'Accessible Path to/from Entry' },
            ]
        },
    ],
    storage: [
        {
            group: 'Storage', items: [
                { id: 'door', label: 'Door / Access — Functional, Locks' },
                { id: 'interior', label: 'Interior — Clean, Dry, No Pests' },
                { id: 'lighting', label: 'Lighting' },
            ]
        },
    ],
    entry: [
        {
            group: 'Entry / Foyer', items: [
                { id: 'floor', label: 'Floor / Mat Area' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'frontDoor', label: 'Front Door — Lock, Handle, Seal' },
                { id: 'intercom', label: 'Doorbell / Intercom' },
                { id: 'keySafe', label: 'Key Safe / Lockbox (if applicable)' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'threshold', label: 'No Step at Threshold / Ramp Present' },
                { id: 'turning', label: 'Turning Space Inside Entry' },
            ]
        },
    ],
    driveway: [
        {
            group: 'Driveway / Parking', items: [
                { id: 'surface', label: 'Surface — Cracks, Damage, Potholes' },
                { id: 'marking', label: 'Line Marking / Bay Designation' },
                { id: 'lighting', label: 'External Lighting' },
            ]
        },
    ],
    common: [
        {
            group: 'Common Area', items: [
                { id: 'floor', label: 'Floor / Carpet' },
                { id: 'walls', label: 'Walls' },
                { id: 'ceiling', label: 'Ceiling' },
                { id: 'lighting', label: 'Lighting' },
                { id: 'exits', label: 'Emergency Exits — Clear & Signposted' },
                { id: 'fire', label: 'Fire Extinguisher / Hydrant Accessible' },
                { id: 'smoke', label: 'Smoke Alarms — Present & Functional' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'pathways', label: 'Accessible Pathways Unobstructed' },
                { id: 'signage', label: 'Accessible Signage Adequate' },
                { id: 'duress', label: 'Emergency Call Points Functional' },
            ]
        },
    ],
};
