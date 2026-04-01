// src/features/everhomes/data/handoverItems.js

// ─── Handover / Annual Review Checklist Definitions ──────────────────────────
// Based on the Everhomes Annual SDA Dwelling Suitability Review Form.
// Used for initial handover assessments and annual compliance reviews.
//
// badges: [] indicates which SDA design categories this item applies to.
//   HPS = High Physical Support  |  FA = Fully Accessible
//   IL  = Improved Liveability   |  R  = Robust
//
// Items with no badges array are applicable to all categories.
// If you add/rename/remove items here, do the same in the backend file.

export const HANDOVER_ITEMS = {

    general: [
        {
            group: 'Floors, Walls & Ceilings',
            items: [
                { id: 'floorFirmness', label: 'Internal Flooring — Firmness and Evenness' },
                { id: 'carpetSpec', label: 'Carpet — Pile <11mm, Backing <4mm, Total ≤15mm', badges: ['FA', 'HPS'], sda: true },
                { id: 'floorTransitions', label: 'Floor Surface Transitions — Max 3mm Vertical or 5mm Bevelled' },
                { id: 'floorSlipRes', label: 'Slip Resistance of Internal Floor Finishes — P3 or R10' },
                { id: 'floorContrast', label: 'Colour Contrast Between Floor and Wall Surfaces', badges: ['IL'], sda: true },
                { id: 'wallResilience', label: 'Resilience of Wall and Floor Materials', badges: ['R'], sda: true },
                { id: 'recessedLighting', label: 'Recessed Lighting Fixtures', badges: ['R'], sda: true },
            ],
        },
        {
            group: 'Electrical',
            items: [
                { id: 'switchLocation', label: 'Light Switches — Located 900–1000mm Above Floor, Aligned with Door Handle' },
                { id: 'switchDimmable', label: 'Dimmable Lighting — Living Areas and Bedrooms' },
                { id: 'gpoType', label: 'GPOs — Rocker / Toggle / Push Pad, Minimum Width 35mm' },
                { id: 'gpoHeight', label: 'GPOs Installed 600–1100mm Above Floor', badges: ['FA', 'HPS'], sda: true },
                { id: 'hvacPresent', label: 'Reverse Cycle Air Conditioning — Living Areas and Bedrooms', badges: ['FA', 'HPS'], sda: true },
                { id: 'hvacZoned', label: 'Ducted Air Conditioning Zoned into Habitable Rooms', badges: ['FA', 'HPS'], sda: true },
                { id: 'emergPower', label: 'Emergency Power — Minimum 2 Hour Outage Coverage', badges: ['HPS'], sda: true },
                { id: 'emergGpos', label: 'Emergency Power — 2 Double GPOs in Participant Bedrooms', badges: ['HPS'], sda: true },
                { id: 'emergDoors', label: 'Emergency Power — Covers Automated Entry / Egress Doors', badges: ['HPS'], sda: true },
            ],
        },
        {
            group: 'Security & General Fixtures',
            items: [
                { id: 'securityScreens', label: 'Security Screens — Present', type: 'yesno' },
                { id: 'ceilingFans', label: 'Ceiling Fans — Present', type: 'yesno' },
                { id: 'airConditioning', label: 'Air Conditioning — Present', type: 'yesno' },
            ],
        },
        {
            group: 'Fire Safety & Evacuation',
            items: [
                { id: 'smokeAlarms', label: 'Smoke Alarms — Present in Bedrooms and Living Spaces' },
                { id: 'evacPlan', label: 'Emergency Evacuation Plan — Provided with Path of Travel to Safe Place' },
                { id: 'fireSafetyEquip', label: 'Fire Safety Equipment — Extinguisher / Blanket Present', type: 'yesno' },
                { id: 'fireSafetyType', label: 'Fire Safety — Equipment Type', type: 'text', placeholder: 'e.g. Powder ABE extinguisher', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'fireSafetyLocation', label: 'Fire Safety — Equipment Location', type: 'text', placeholder: 'e.g. Kitchen hallway, laundry', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'fireSafetyDate', label: 'Fire Safety — Last Service Date', type: 'text', placeholder: 'e.g. 14/03/2025', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'sprinklers', label: 'Fire Sprinklers — Present', type: 'yesno' },
                { id: 'sprinklerValvePhoto', label: 'Fire Sprinklers — Photo of High Pressure Water Valve / Backflow Prevention Taken', type: 'yesno', showIf: { id: 'sprinklers', value: 'yes' } },
                { id: 'emergLighting', label: 'Emergency Lighting — NCC Compliant' },
                { id: 'designDrawings', label: 'Design Drawings Provided to Site Manager, Staff and Residents (egress / retreat)', badges: ['R'], sda: true },
                { id: 'upsBattery', label: 'UPS / Battery Backup — Present & Functional', type: 'yesno' },
                { id: 'upsBatteryLocation', label: 'UPS / Battery Backup — Location', type: 'text', placeholder: 'e.g. Garage cabinet', showIf: { id: 'upsBattery', value: 'yes' } },
                { id: 'upsBatteryDate', label: 'UPS / Battery Backup — Last Service Date', type: 'text', placeholder: 'e.g. 14/03/2025', showIf: { id: 'upsBattery', value: 'yes' } },
            ],
        },
        {
            group: 'Assistive Technology', sda: true,
            items: [
                { id: 'internet', label: 'High Speed Internet — Stable with Wi-Fi Coverage Throughout', badges: ['HPS', 'FA'], sda: true },
                { id: 'intercom', label: 'Video / Intercom Communication System', badges: ['HPS'], sda: true },
            ],
        },
        {
            group: 'Meter Readings',
            items: [
                { id: 'waterMeter', label: 'Water Meter Reading', type: 'text', placeholder: 'e.g. 12345.67 kL' },
                { id: 'nmiReading', label: 'National Metering Identifier (NMI)', type: 'text', placeholder: 'e.g. 6305012345' },
            ],
        },
        {
            group: 'Whitegoods & Warranties',
            items: [
                { id: 'whitegoodsSupplied', label: 'Are Whitegoods Supplied?', type: 'yesno' },
                { id: 'warrantyType', label: 'Are the Warranties Digital or Paper?', type: 'text', placeholder: 'e.g. Digital — stored in DocuSign', showIf: { id: 'whitegoodsSupplied', value: 'yes' } },
                { id: 'warrantiesHeld', label: 'Do You Have the Warranties?', type: 'yesno', showIf: { id: 'whitegoodsSupplied', value: 'yes' } },
            ],
        },
        {
            group: 'Keys',
            items: [
                { id: 'keysHeld', label: 'Do You Have the Keys?', type: 'yesno' },
                { id: 'keysGarage', label: 'Keys — Garage', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysScreenDoor', label: 'Keys — Screen Door', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysFrontDoor', label: 'Keys — Front Door', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysDeadlock', label: 'Keys — Deadlock', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysLetterbox', label: 'Keys — Letterbox', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysWindows', label: 'Keys — Windows', type: 'number', placeholder: 'Count', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysOther', label: 'Keys — Other', type: 'text', placeholder: 'e.g. 2× mailbox, 1× pool', showIf: { id: 'keysHeld', value: 'yes' } },
            ],
        },
        {
            group: 'Builder Defects',
            items: [
                { id: 'builderDefects', label: 'Were There Any Defects to be Rectified by the Builder?', type: 'yesno' },
                { id: 'builderNotified', label: 'Was the Builder Notified of Defects?', type: 'yesno', showIf: { id: 'builderDefects', value: 'yes' } },
                { id: 'builderResolved', label: 'Have All Defects Been Resolved?', type: 'yesno', showIf: { id: 'builderDefects', value: 'yes' } },
                { id: 'builderDefectsNotes', label: 'Defect Description', type: 'multiline', placeholder: 'Describe the defects and their current status', showIf: { id: 'builderDefects', value: 'yes' } },
            ],
        },
        {
            group: 'SDA Compliance',
            items: [
                { id: 'sdaCount', label: 'Number of SDA Dwellings on Parcel of Land', type: 'number', placeholder: 'e.g. 2' },
                { id: 'roomCount', label: 'Number of Participant Bedrooms (Excluding OOA)', type: 'number', placeholder: 'e.g. 4' },
                { id: 'vandaalProof', label: 'High Impact / Vandal Proof Fittings and Fixtures', badges: ['R'], sda: true },
                { id: 'roomSize', label: 'Is the Size or Usability of All Rooms in Dwelling Suitable?', type: 'yesno' },
                { id: 'sdaSuitability', label: 'Suitability of Dwelling to be Used as SDA' },
            ],
        },
    ],

    accessway: [
        {
            group: 'Accessways',
            items: [
                { id: 'outdoorAccessible', label: 'Are All Outdoor Areas Accessible?', type: 'yesno' },
                { id: 'slipResistant', label: 'Are Outdoor Surfaces Slip Resistant?', type: 'yesno' },
                { id: 'outdoorCovered', label: 'Are Outdoor Areas Covered?', type: 'yesno' },
            ],
        },
    ],

    carParking: [
        {
            group: 'Car Parking for Participants',
            items: [
                { id: 'parkingType', label: 'Carport or Garage?', type: 'text', placeholder: 'e.g. Double garage' },
                { id: 'parkingCount', label: 'Number of Car Parks', type: 'number', placeholder: 'e.g. 2' },
                { id: 'parkingAccess', label: 'Access from Car Parking Space to Entry Doorway' },
                { id: 'wheelchairSuitable', label: 'Wheelchair Vehicle Suitable?', type: 'yesno' },
                { id: 'parkingSlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'parkingGradient', label: 'Gradient (Slope) — Compliant' },
                { id: 'vertClearance', label: 'Vertical Clearance of Roof (including Carports)' },
            ],
        },
    ],

    entrance: [
        {
            group: 'Threshold & Landing',
            items: [
                { id: 'stepFreeLanding', label: 'Step-Free Landing Area and Doorway Threshold — Front Door' },
                { id: 'landingGradient', label: 'Landing Gradient (Slope) — Compliant' },
                { id: 'landingCrossfall', label: 'Landing Crossfall — Compliant' },
                { id: 'thresholdFlush', label: 'Threshold Flush or Ramp Present' },
                { id: 'entranceDoorCirc', label: 'Door Circulation Space — Both Sides of Front Door' },
                { id: 'coveredEntry', label: 'Covered Roof Area Over Entry' },
            ],
        },
        {
            group: 'Door Automation', sda: true,
            items: [
                { id: 'autoCabling', label: 'Power & Control Cabling (GPO) to Head of Entry Doors', badges: ['HPS'], sda: true },
                { id: 'autoHardware', label: 'Door Automation Hardware — Functional' },
            ],
        },
        {
            group: 'Doorways & Hardware',
            items: [
                { id: 'clearOpeningHPS', label: 'Doorway Clear Opening Width — 920mm Minimum', badges: ['HPS'], sda: true },
                { id: 'clearOpeningFA', label: 'Doorway Clear Opening Width — 900mm Minimum', badges: ['FA'], sda: true },
                { id: 'clearOpeningIL', label: 'Doorway Clear Opening Width — 820mm Minimum', badges: ['IL'], sda: true },
                { id: 'clearOpeningR', label: 'Doorway Clear Opening Width — 850mm Minimum', badges: ['R'], sda: true },
                { id: 'doorCircSpace', label: 'Doorway Circulation Space — Compliant' },
                { id: 'doorAngle', label: 'All Doors Open to 90° or More' },
                { id: 'handleHeight', label: 'Door Handle Height — 900–1100mm Above Floor' },
                { id: 'swingHandles', label: 'Swinging Door Handles — Lever with Kick Back (except Robust)' },
                { id: 'slidingHandles', label: 'Sliding Door Handles — D Handle Ergonomically Designed (except Robust)' },
                { id: 'intThreshold', label: 'Internal Doorway Level Transition — Max 3mm Vertical or 5mm Bevelled' },
                { id: 'doorResilience', label: 'Door Resilience — Solid Core Timber / Laminated or Polycarbonate Glazing', badges: ['R'], sda: true },
                { id: 'lumContrast', label: 'Luminance Contrast — Min 30% Between Door Leaf and Surrounding Surfaces (50mm wide)', badges: ['IL'], sda: true },
            ],
        },
    ],

    corridors: [
        {
            group: 'Corridors',
            items: [
                { id: 'corridorWidthFA', label: 'Width — 1200mm Skirting to Skirting', badges: ['FA', 'HPS'], sda: true },
                { id: 'corridorWidthRIL', label: 'Width — 1000mm Skirting to Skirting' },
                { id: 'corridorCirc', label: 'Door Circulation Space in Corridor — Compliant' },
                { id: 'storageCupboard', label: '600mm Wide Storage Cupboard with Adjustable Shelving (separate to bedroom robe)' },
            ],
        },
    ],

    windows: [
        {
            group: 'Windows & Glazing',
            items: [
                { id: 'blindsInstalled', label: 'Does the Property Have Blinds Installed?', type: 'yesno' },
                { id: 'sillHeight', label: 'Window Sill Height — Max 1000mm in Living Areas and at Least One Bedroom', badges: ['HPS', 'FA'], sda: true },
                { id: 'windowReach', label: 'Window Controls Reachable — 600–1100mm Above Floor', badges: ['HPS', 'FA'], sda: true },
                { id: 'blindCabling', label: 'Power & Control Cabling for Blind Automation (capped GPO)', badges: ['HPS'], sda: true },
                { id: 'windowLocks', label: 'Windows — Lockable' },
                { id: 'glazingStrip', label: 'Contrasting Glazing Strip — 75mm Wide, 900–1000mm Above Floor', badges: ['IL', 'R'], sda: true },
                { id: 'glazingMaterial', label: 'Glazed Areas — Laminated Glass or Polycarbonate Resin Thermoplastic', badges: ['R'], sda: true },
            ],
        },
    ],

    sanitary: [
        {
            group: 'Fixtures & Quantity',
            items: [
                { id: 'basinCount', label: 'Hand Wash Basins — Count', type: 'number', placeholder: 'e.g. 2' },
                { id: 'basinFunction', label: 'Hand Wash Basins — Accessible, Located and Functional' },
            ],
        },
        {
            group: 'Toilet',
            items: [
                { id: 'wcCount', label: 'Toilets — Count', type: 'number', placeholder: 'e.g. 2' },
                { id: 'wcFunction', label: 'Toilets — Accessible, Located and Functional' },
                { id: 'bidetCapable', label: 'Bidet Capable? (See Notes for Details)', type: 'yesno' },
                { id: 'toiletBackrest', label: 'Toilet Backrest — Present' },
                { id: 'toiletGrabrail', label: 'Grab Rails — Present and Compliant' },
                { id: 'toiletClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'toiletContrast', label: 'Toilet Seat Luminance Contrast — Min 30% with Background', badges: ['IL'], sda: true },
            ],
        },
        {
            group: 'Shower Area',
            items: [
                { id: 'showerCount', label: 'Showers — Count', type: 'number', placeholder: 'e.g. 1' },
                { id: 'showerFunction', label: 'Showers — Accessible, Located and Functional' },
                { id: 'showerClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'noShowerScreen', label: 'No Shower Screens or Screen Fixtures Present' },
                { id: 'showerGrabrail', label: 'Vertical Support Grab Rail — Present', badges: ['HPS', 'FA'], sda: true },
                { id: 'curtainRail', label: 'Curtain Rail — Present', badges: ['HPS', 'FA'], sda: true },
                { id: 'showerGradient', label: 'Shower Floor Gradient — No Notable Changes', badges: ['HPS', 'FA'], sda: true },
                { id: 'showerTaps', label: 'Lever Style Shower Tap — Present', badges: ['HPS', 'FA'], sda: true },
                { id: 'towelRail', label: 'Towel Rail — Present' },
            ],
        },
        {
            group: 'Hand Wash Basin',
            items: [
                { id: 'basinClear', label: 'Clear Space in Front with Sufficient Circulation Space' },
                { id: 'kneeClear', label: 'Knee and Toe Clearance Under Basin' },
                { id: 'basinTaps', label: 'Tapware — Lever or Sensor Type, Within Reach' },
            ],
        },
        {
            group: 'Other Sanitary',
            items: [
                { id: 'bathtub', label: 'Bathtub — Compliant' },
                { id: 'otherGrabrails', label: 'Other Grab Rails — Present and Compliant' },
                { id: 'sanitarySlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'wallCabinets', label: 'Wall Cabinets — Accessible and Compliant' },
                { id: 'wallReinforcement', label: 'Wall Reinforcement (Thick Sheeting) — Present' },
                { id: 'robustBathroomFixtures', label: 'Robust Fixtures — Present and Compliant', badges: ['R'], sda: true },
            ],
        },
    ],

    kitchen: [
        {
            group: 'Functional Requirements',
            items: [
                { id: 'kitchenSink', label: 'Sink with Tap — Present and Functional' },
                { id: 'kitchenDishwasher', label: 'Dishwasher — Present (required for all categories)' },
                { id: 'dishwasherDrawer', label: 'Dishwasher — Drawer Style', badges: ['FA', 'HPS'], sda: true },
                { id: 'hasFridge', label: 'Is There a Fridge?', type: 'yesno' },
                { id: 'kitchenSlipRes', label: 'Slip Resistance of Flooring — Compliant' },
            ],
        },
        {
            group: 'Clearance & Lighting',
            items: [
                { id: 'benchClearance', label: 'Clearance in Front of Fixed Benches and Appliances' },
                { id: 'applianceRecess', label: 'Recessed Areas for Appliances' },
                { id: 'taskLighting', label: 'Task Lighting — 300 Lux, Max 1500mm Intervals, Over Benchtops' },
            ],
        },
        {
            group: 'Oven', sda: true,
            items: [
                { id: 'kitchenOven', label: 'Built-in Oven — Present and Functional' },
                { id: 'ovenDoorHinge', label: 'Oven Door — Side Hinged, Latch Side Next to Accessible Benchtop', badges: ['FA', 'HPS'], sda: true },
                { id: 'ovenHandle', label: 'Oven Door Handle Height — 600–1100mm Above Floor', badges: ['FA', 'HPS'], sda: true },
                { id: 'ovenRails', label: 'Telescopic Rails on at Least One Shelf', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Benchtop', sda: true,
            items: [
                { id: 'accessBench', label: 'Accessible Benchtop Next to Cooktop and Oven — 600mm Depth', badges: ['FA', 'HPS'], sda: true },
                { id: 'benchKnee', label: 'Under-Bench Knee / Toe Space — 900mm Wide, 440mm Deep', badges: ['FA', 'HPS'], sda: true },
                { id: 'adjBench', label: 'Height Adjustable Benchtop — 600mm × 440mm, 720–1020mm Range', badges: ['FA', 'HPS'], sda: true },
                { id: 'benchGpo', label: 'GPO Within 300mm of Benchtop Front Edge, Max 1100mm High', badges: ['FA', 'HPS'], sda: true },
                { id: 'benchMaterial', label: 'Benchtop Made of Robust Materials', badges: ['R'], sda: true },
            ],
        },
        {
            group: 'Kitchen Cupboards',
            items: [
                { id: 'belowHandles', label: 'Below-Bench Cupboards — D Pull Handles (Top) or Push-to-Release' },
                { id: 'aboveHandles', label: 'Above-Bench Cupboards — D Pull Handles (Bottom) or Push-to-Release' },
                { id: 'overhangLip', label: 'Above-Bench Cupboards — 20mm Overhanging Lip' },
                { id: 'cabinetMaterial', label: 'Cabinetry Made of Robust Materials', badges: ['R'], sda: true },
            ],
        },
        {
            group: 'Cooktop', sda: true,
            items: [
                { id: 'kitchenCooktop', label: 'Fixed Cooktop with Rangehood — Present and Functional' },
                { id: 'cooktopType', label: 'Cooktop — Electric or Induction (No Gas)', badges: ['FA', 'HPS'], sda: true },
                { id: 'cooktopPosition', label: 'Cooktop — Min 300mm from Internal Corner / Wall', badges: ['FA', 'HPS'], sda: true },
                { id: 'cooktopControls', label: 'Cooktop Controls — Accessible Side or Near Front Edge', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Kitchen Tapware',
            items: [
                { id: 'kitchenTaps', label: 'Tapware — Lever or Sensor, Max 300mm from Benchtop Edge', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Accessible Storage', sda: true,
            items: [
                { id: 'accessPantry', label: 'Wheelchair Accessible Pantry — Extendable Basket or Full Pull-Out Style', badges: ['FA', 'HPS'], sda: true },
            ],
        },
    ],

    laundry: [
        {
            group: 'Laundry Fixtures',
            items: [
                { id: 'laundryAvail', label: 'Laundry Access with Sink or Tub and Taps — Available' },
                { id: 'washerDryer', label: 'Is There a Washer / Dryer?', type: 'yesno' },
                { id: 'applianceDepth', label: 'Appliance Depth — 700mm Required', showIf: { id: 'washerDryer', value: 'yes' } },
                { id: 'laundrySlipRes', label: 'Slip Resistance of Flooring — Compliant' },
            ],
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'laundryClearRIL', label: 'Clearance in Front of Fixed Benches — 1000mm', badges: ['R', 'IL'], sda: true },
                { id: 'laundryClearFA', label: 'Clearance in Front of Fixed Benches — 1500mm', badges: ['HPS', 'FA'], sda: true },
                { id: 'laundryTaps', label: 'Tapware — Sensor or Lever, Max 300mm from Edge', badges: ['FA', 'HPS'], sda: true },
            ],
        },
    ],

    bedroom: [
        {
            group: 'Bedroom Compliance',
            items: [
                { id: 'sdaBedroom', label: 'At Least One SDA Compliant Bedroom — Present' },
                { id: 'bedroomSizeRIL', label: 'Bedroom Size — Min 3100mm × 3100mm Wall to Wall', badges: ['IL', 'R'], sda: true },
                { id: 'bedroomSizeFA', label: 'Bedroom — Queen Bed Allowance with Circulation (1540mm Transfer Side, 1000mm Other Sides)', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Door Circulation', sda: true,
            items: [
                { id: 'intDoorCirc', label: 'Internal Door Circulation — 1540mm Wide, 1450mm Deep, Clear of Queen Bed', badges: ['FA', 'HPS'], sda: true },
                { id: 'extDoorCirc', label: 'External Door Circulation — 1200mm Skirting to Skirting + 110mm Hinge Side', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Robe',
            items: [
                { id: 'robeWidth', label: 'Robe Width — 1400mm Minimum' },
                { id: 'robeSections', label: 'Robe — Multiple Smaller Sections' },
                { id: 'robeAccess', label: 'Clearance in Front of Robe — 1540mm Minimum', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Electrical',
            items: [
                { id: 'bedroomGpos', label: '3 Double GPOs at Head of Bed + 1 Double GPO on Opposite Wall', badges: ['FA', 'HPS'], sda: true },
                { id: 'ceilingGpo', label: 'GPO in Ceiling for Ceiling Hoist Power', badges: ['HPS'], sda: true },
                { id: 'bedroomDimmer', label: 'Dimmable Lights — Present' },
                { id: 'soundInsulation', label: 'Bedroom Sound Insulation — Wall Insulation Present', badges: ['R'], sda: true },
            ],
        },
        {
            group: 'Ceiling Hoist',
            items: [
                { id: 'ceilingHoistCompatible', label: 'Is the Bedroom Compatible with a Ceiling Hoist?', type: 'yesno' },
                { id: 'ceilingHoistPresent', label: 'Is There a Ceiling Hoist Installed?', type: 'yesno', showIf: { id: 'ceilingHoistCompatible', value: 'yes' } },
            ],
        },
        {
            group: 'Ceiling Hoist Detail', sda: true,
            items: [
                { id: 'hoistTravel', label: 'Hoist — Covers Full Width and Length of Bed', badges: ['HPS'], sda: true, showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistCapacity', label: 'Hoist — 250kg Load Capacity Minimum', badges: ['HPS'], sda: true, showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistMount', label: 'Hoist — Ceiling or Wall Mounted', badges: ['HPS'], sda: true, showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistCert', label: 'Hoist — Engineer Inspected and Certified', badges: ['HPS'], sda: true, showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
            ],
        },
    ],

    living: [
        {
            group: 'Living Areas',
            items: [
                { id: 'livingCount', label: 'At Least One Living Area — Present and Functional' },
                { id: 'livingDimmer', label: 'Dimmable Lights — Present' },
                { id: 'tvAntenna', label: 'Is There a TV Antenna?', type: 'yesno' },
                { id: 'recessedTvFixture', label: 'Is There a Recessed Robust TV Fixture?', type: 'yesno', badges: ['R'], sda: true },
            ],
        },
        {
            group: 'SDA / Accessibility', sda: true,
            items: [
                { id: 'turningSpace', label: 'Free Space Clear of Furniture — 2250mm Diameter', badges: ['FA', 'HPS'], sda: true },
            ],
        },
    ],

    stairs: [
        {
            group: 'Level Access',
            items: [
                { id: 'entryLevel', label: 'All Internal Areas on Entry Level or Accessible by Lift (IL: bedrooms may be on upper level)', badges: ['R', 'FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Internal Stairways',
            items: [
                { id: 'stairHandrails', label: 'Handrails — Continuous on Both Sides, AS1428.1 Compliant' },
                { id: 'stairWidth', label: 'Clear Width — Minimum 1000mm' },
                { id: 'noWinders', label: 'No Winders on Landings' },
                { id: 'closedRisers', label: 'Closed Risers — Present' },
                { id: 'stairSlipRes', label: 'Slip Resistance — P3 or R10' },
                { id: 'nosingStrips', label: 'Nosing Strips — Present' },
                { id: 'tgsis', label: 'TGSIs — Present' },
            ],
        },
        {
            group: 'Lifts',
            items: [
                { id: 'liftDoor', label: 'Lift Door Opening — Minimum 900mm' },
                { id: 'liftSize', label: 'Lift Size — 1100mm Wide × 1400mm (Direction of Travel)' },
                { id: 'liftCompliance', label: 'Lift — NCC Clause E3.6 Compliant' },
            ],
        },
    ],

    external: [
        {
            group: 'External Stairways',
            items: [
                { id: 'extNosing', label: 'Nosing Strips — Present' },
                { id: 'extTgsis', label: 'TGSIs — Present with Raised Tactile on Handrail' },
            ],
        },
        {
            group: 'Letterbox', sda: true,
            items: [
                { id: 'letterboxArea', label: 'Hard-Standing Area — 1540mm × 2070mm', badges: ['FA', 'HPS'], sda: true },
                { id: 'letterboxPath', label: 'Accessible Path from Dwelling to Letterbox', badges: ['FA', 'HPS'], sda: true },
                { id: 'letterboxLock', label: 'Letterbox — Lockable', badges: ['FA', 'HPS'], sda: true },
                { id: 'letterboxHeight', label: 'Letterbox Height — 600–1100mm', badges: ['FA', 'HPS'], sda: true },
            ],
        },
        {
            group: 'Ramps & Accessways',
            items: [
                { id: 'accessWidthRIL', label: 'Accessway Minimum Clear Width — 1000mm', badges: ['R', 'IL'], sda: true },
                { id: 'accessWidthFA', label: 'Accessway Minimum Clear Width — 1200mm (1500mm if Curved)', badges: ['FA', 'HPS'], sda: true },
                { id: 'accessLanding', label: 'Level Landings — Min 1200mm × 1200mm, Exclusive of Door Swing' },
                { id: 'accessVertical', label: 'Vertical Clearance — Minimum 2000mm Along All Paths of Travel' },
            ],
        },
        {
            group: 'Utility Documentation',
            items: [
                { id: 'meterBoxPhoto', label: 'Meter Box — Photo Taken' },
                { id: 'powerBoxPhoto', label: 'Power Box — Photo Taken' },
                { id: 'nbnPhoto', label: 'NBN — Photo Taken' },
                { id: 'solarPhoto', label: 'Solar — Photo Taken' },
            ],
        },
    ],

    breakout: [
        {
            group: 'Breakout Room', sda: true,
            items: [
                { id: 'breakoutSeparate', label: 'Breakout Room is a Separate Room — Not a Study or Living / Dining Area', badges: ['R'], sda: true },
            ],
        },
    ],

}

/** Returns the handover checklist groups for an area, falling back to an empty array. */
export function getHandoverGroups(area) {
    return HANDOVER_ITEMS[area] ?? []
}
