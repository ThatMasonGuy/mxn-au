// functions/everhomes/checklistSchemas/handoverItems.mjs

// ─── Handover / Annual Review Checklist Definitions ──────────────────────────
// Mirrors the frontend handoverItems.js for the handover/annual review workflow.
// Imported by the schema registry — do not import directly in the cloud function.
//
// Label prefixes indicate applicable SDA design categories:
//   HPS = High Physical Support  |  FA = Fully Accessible
//   IL  = Improved Liveability   |  R  = Robust
//
// Items with type: 'number' or type: 'text' are input fields, not status checks.
// Their values are stored in section.inputs rather than section.items.

export const HANDOVER_ITEMS = {

    general: [
        {
            group: 'Floors, Walls & Ceilings', items: [
                { id: 'floorFirmness', label: 'Internal Flooring — Firmness and Evenness' },
                { id: 'carpetSpec', label: 'FA/HPS: Carpet — Pile <11mm, Backing <4mm, Total ≤15mm' },
                { id: 'floorTransitions', label: 'Floor Surface Transitions — Max 3mm Vertical or 5mm Bevelled' },
                { id: 'floorSlipRes', label: 'Slip Resistance of Internal Floor Finishes — P3 or R10' },
                { id: 'floorContrast', label: 'IL: Colour Contrast Between Floor and Wall Surfaces' },
                { id: 'wallResilience', label: 'R: Resilience of Wall and Floor Materials' },
                { id: 'recessedLighting', label: 'R: Recessed Lighting Fixtures' },
            ]
        },
        {
            group: 'Electrical', items: [
                { id: 'switchLocation', label: 'Light Switches — Located 900–1000mm Above Floor, Aligned with Door Handle' },
                { id: 'switchDimmable', label: 'Dimmable Lighting — Living Areas and Bedrooms' },
                { id: 'gpoType', label: 'GPOs — Rocker / Toggle / Push Pad, Minimum Width 35mm' },
                { id: 'gpoHeight', label: 'FA/HPS: GPOs Installed 600–1100mm Above Floor' },
                { id: 'hvacPresent', label: 'FA/HPS: Reverse Cycle Air Conditioning — Living Areas and Bedrooms' },
                { id: 'hvacZoned', label: 'FA/HPS: Ducted Air Conditioning Zoned into Habitable Rooms' },
                { id: 'emergPower', label: 'HPS: Emergency Power — Minimum 2 Hour Outage Coverage' },
                { id: 'emergGpos', label: 'HPS: Emergency Power — 2 Double GPOs in Participant Bedrooms' },
                { id: 'emergDoors', label: 'HPS: Emergency Power — Covers Automated Entry / Egress Doors' },
            ]
        },
        {
            group: 'Security & General Fixtures', items: [
                { id: 'securityScreens', label: 'Security Screens — Present', type: 'yesno' },
                { id: 'ceilingFans', label: 'Ceiling Fans — Present', type: 'yesno' },
                { id: 'airConditioning', label: 'Air Conditioning — Present', type: 'yesno' },
            ]
        },
        {
            group: 'Fire Safety & Evacuation', items: [
                { id: 'smokeAlarms', label: 'Smoke Alarms — Present in Bedrooms and Living Spaces' },
                { id: 'evacPlan', label: 'Emergency Evacuation Plan — Provided with Path of Travel to Safe Place' },
                { id: 'fireSafetyEquip', label: 'Fire Safety Equipment — Extinguisher / Blanket Present', type: 'yesno' },
                { id: 'fireSafetyType', label: 'Fire Safety — Equipment Type', type: 'text', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'fireSafetyLocation', label: 'Fire Safety — Equipment Location', type: 'text', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'fireSafetyDate', label: 'Fire Safety — Last Service Date', type: 'text', showIf: { id: 'fireSafetyEquip', value: 'yes' } },
                { id: 'sprinklers', label: 'Fire Sprinklers — Present', type: 'yesno' },
                { id: 'sprinklerValvePhoto', label: 'Fire Sprinklers — Photo of High Pressure Water Valve / Backflow Prevention Taken', type: 'yesno', showIf: { id: 'sprinklers', value: 'yes' } },
                { id: 'emergLighting', label: 'Emergency Lighting — NCC Compliant' },
                { id: 'designDrawings', label: 'R: Design Drawings Provided to Site Manager, Staff and Residents (egress / retreat)' },
                { id: 'upsBattery', label: 'UPS / Battery Backup — Present & Functional' },
                { id: 'upsBatteryLocation', label: 'UPS / Battery Backup — Location', type: 'text', showIf: { id: 'upsBattery', value: 'ok' } },
                { id: 'upsBatteryDate', label: 'UPS / Battery Backup — Last Service Date', type: 'text', showIf: { id: 'upsBattery', value: 'ok' } },
            ]
        },
        {
            group: 'Assistive Technology', sda: true, items: [
                { id: 'internet', label: 'HPS/FA: High Speed Internet — Stable with Wi-Fi Coverage Throughout' },
                { id: 'intercom', label: 'HPS: Video / Intercom Communication System' },
            ]
        },
        {
            group: 'Meter Readings', items: [
                { id: 'waterMeter', label: 'Water Meter Reading', type: 'text' },
                { id: 'nmiReading', label: 'National Metering Identifier (NMI)', type: 'text' },
            ]
        },
        {
            group: 'Whitegoods & Warranties', items: [
                { id: 'whitegoodsSupplied', label: 'Are Whitegoods Supplied?', type: 'yesno' },
                { id: 'warrantyType', label: 'Are the Warranties Digital or Paper?', type: 'text', showIf: { id: 'whitegoodsSupplied', value: 'yes' } },
                { id: 'warrantiesHeld', label: 'Do You Have the Warranties?', type: 'yesno', showIf: { id: 'whitegoodsSupplied', value: 'yes' } },
            ]
        },
        {
            group: 'Keys', items: [
                { id: 'keysHeld', label: 'Do You Have the Keys?', type: 'yesno' },
                { id: 'keysGarage', label: 'Keys — Garage', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysScreenDoor', label: 'Keys — Screen Door', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysFrontDoor', label: 'Keys — Front Door', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysDeadlock', label: 'Keys — Deadlock', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysLetterbox', label: 'Keys — Letterbox', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysWindows', label: 'Keys — Windows', type: 'number', showIf: { id: 'keysHeld', value: 'yes' } },
                { id: 'keysOther', label: 'Keys — Other', type: 'text', showIf: { id: 'keysHeld', value: 'yes' } },
            ]
        },
        {
            group: 'Builder Defects', items: [
                { id: 'builderDefects', label: 'Were There Any Defects to be Rectified by the Builder?', type: 'yesno' },
                { id: 'builderNotified', label: 'Was the Builder Notified of Defects?', type: 'yesno', showIf: { id: 'builderDefects', value: 'yes' } },
                { id: 'builderResolved', label: 'Have All Defects Been Resolved?', type: 'yesno', showIf: { id: 'builderDefects', value: 'yes' } },
                { id: 'builderDefectsNotes', label: 'Defect Description', type: 'multiline', showIf: { id: 'builderDefects', value: 'yes' } },
            ]
        },
        {
            group: 'SDA Compliance', items: [
                { id: 'sdaCount', label: 'Number of SDA Dwellings on Parcel of Land', type: 'number' },
                { id: 'roomCount', label: 'Number of Participant Bedrooms (Excluding OOA)', type: 'number' },
                { id: 'vandaalProof', label: 'R: High Impact / Vandal Proof Fittings and Fixtures' },
                { id: 'roomSize', label: 'Is the Size or Usability of All Rooms in Dwelling Suitable?', type: 'yesno' },
                { id: 'sdaSuitability', label: 'Suitability of Dwelling to be Used as SDA' },
            ]
        },
    ],

    accessway: [
        {
            group: 'Accessways', items: [
                { id: 'outdoorAccessible', label: 'Are All Outdoor Areas Accessible?', type: 'yesno' },
                { id: 'slipResistant', label: 'Are Outdoor Surfaces Slip Resistant?', type: 'yesno' },
                { id: 'outdoorCovered', label: 'Are Outdoor Areas Covered?', type: 'yesno' },
            ]
        },
    ],

    carParking: [
        {
            group: 'Car Parking for Participants', items: [
                { id: 'parkingType', label: 'Carport or Garage?', type: 'text' },
                { id: 'parkingCount', label: 'Number of Car Parks', type: 'number' },
                { id: 'parkingAccess', label: 'Access from Car Parking Space to Entry Doorway' },
                { id: 'wheelchairSuitable', label: 'Wheelchair Vehicle Suitable?', type: 'yesno' },
                { id: 'parkingSlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'parkingGradient', label: 'Gradient (Slope) — Compliant' },
                { id: 'vertClearance', label: 'Vertical Clearance of Roof (including Carports)' },
            ]
        },
    ],

    entrance: [
        {
            group: 'Threshold & Landing', items: [
                { id: 'stepFreeLanding', label: 'Step-Free Landing Area and Doorway Threshold — Front Door' },
                { id: 'landingGradient', label: 'Landing Gradient (Slope) — Compliant' },
                { id: 'landingCrossfall', label: 'Landing Crossfall — Compliant' },
                { id: 'thresholdFlush', label: 'Threshold Flush or Ramp Present' },
                { id: 'entranceDoorCirc', label: 'Door Circulation Space — Both Sides of Front Door' },
                { id: 'coveredEntry', label: 'Covered Roof Area Over Entry' },
            ]
        },
        {
            group: 'Door Automation', sda: true, items: [
                { id: 'autoCabling', label: 'HPS: Power & Control Cabling (GPO) to Head of Entry Doors' },
                { id: 'autoHardware', label: 'Door Automation Hardware — Functional' },
            ]
        },
        {
            group: 'Doorways & Hardware', items: [
                { id: 'clearOpeningHPS', label: 'HPS: Doorway Clear Opening Width — 920mm Minimum' },
                { id: 'clearOpeningFA', label: 'FA: Doorway Clear Opening Width — 900mm Minimum' },
                { id: 'clearOpeningIL', label: 'IL: Doorway Clear Opening Width — 820mm Minimum' },
                { id: 'clearOpeningR', label: 'R: Doorway Clear Opening Width — 850mm Minimum' },
                { id: 'doorCircSpace', label: 'Doorway Circulation Space — Compliant' },
                { id: 'doorAngle', label: 'All Doors Open to 90° or More' },
                { id: 'handleHeight', label: 'Door Handle Height — 900–1100mm Above Floor' },
                { id: 'swingHandles', label: 'Swinging Door Handles — Lever with Kick Back (except Robust)' },
                { id: 'slidingHandles', label: 'Sliding Door Handles — D Handle Ergonomically Designed (except Robust)' },
                { id: 'intThreshold', label: 'Internal Doorway Level Transition — Max 3mm Vertical or 5mm Bevelled' },
                { id: 'doorResilience', label: 'R: Door Resilience — Solid Core Timber / Laminated or Polycarbonate Glazing' },
                { id: 'lumContrast', label: 'IL: Luminance Contrast — Min 30% Between Door Leaf and Surrounding Surfaces (50mm wide)' },
            ]
        },
    ],

    corridors: [
        {
            group: 'Corridors', items: [
                { id: 'corridorWidthFA', label: 'FA/HPS: Width — 1200mm Skirting to Skirting' },
                { id: 'corridorWidthRIL', label: 'R/IL: Width — 1000mm Skirting to Skirting' },
                { id: 'corridorCirc', label: 'Door Circulation Space in Corridor — Compliant' },
                { id: 'storageCupboard', label: '600mm Wide Storage Cupboard with Adjustable Shelving (separate to bedroom robe)' },
            ]
        },
    ],

    windows: [
        {
            group: 'Windows & Glazing', items: [
                { id: 'blindsInstalled', label: 'Does the Property Have Blinds Installed?', type: 'yesno' },
                { id: 'sillHeight', label: 'HPS/FA: Window Sill Height — Max 1000mm in Living Areas and at Least One Bedroom' },
                { id: 'windowReach', label: 'HPS/FA: Window Controls Reachable — 600–1100mm Above Floor' },
                { id: 'blindCabling', label: 'HPS: Power & Control Cabling for Blind Automation (capped GPO)' },
                { id: 'windowLocks', label: 'Windows — Lockable' },
                { id: 'glazingStrip', label: 'IL/R: Contrasting Glazing Strip — 75mm Wide, 900–1000mm Above Floor' },
                { id: 'glazingMaterial', label: 'R: Glazed Areas — Laminated Glass or Polycarbonate Resin Thermoplastic' },
            ]
        },
    ],

    sanitary: [
        {
            group: 'Fixtures & Quantity', items: [
                { id: 'basinCount', label: 'Hand Wash Basins — Count', type: 'number' },
                { id: 'basinFunction', label: 'Hand Wash Basins — Accessible, Located and Functional' },
            ]
        },
        {
            group: 'Toilet', items: [
                { id: 'wcCount', label: 'Toilets — Count', type: 'number' },
                { id: 'wcFunction', label: 'Toilets — Accessible, Located and Functional' },
                { id: 'bidetCapable', label: 'Bidet Capable? (See Notes for Details)', type: 'yesno' },
                { id: 'toiletBackrest', label: 'Toilet Backrest — Present' },
                { id: 'toiletGrabrail', label: 'Grab Rails — Present and Compliant' },
                { id: 'toiletClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'toiletContrast', label: 'IL: Toilet Seat Luminance Contrast — Min 30% with Background' },
            ]
        },
        {
            group: 'Shower Area', items: [
                { id: 'showerCount', label: 'Showers — Count', type: 'number' },
                { id: 'showerFunction', label: 'Showers — Accessible, Located and Functional' },
                { id: 'showerClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'noShowerScreen', label: 'No Shower Screens or Screen Fixtures Present' },
                { id: 'showerGrabrail', label: 'HPS/FA: Vertical Support Grab Rail — Present' },
                { id: 'curtainRail', label: 'HPS/FA: Curtain Rail — Present' },
                { id: 'showerGradient', label: 'HPS/FA: Shower Floor Gradient — No Notable Changes' },
                { id: 'showerTaps', label: 'HPS/FA: Lever Style Shower Tap — Present' },
                { id: 'towelRail', label: 'Towel Rail — Present' },
            ]
        },
        {
            group: 'Hand Wash Basin', items: [
                { id: 'basinClear', label: 'Clear Space in Front with Sufficient Circulation Space' },
                { id: 'kneeClear', label: 'Knee and Toe Clearance Under Basin' },
                { id: 'basinTaps', label: 'Tapware — Lever or Sensor Type, Within Reach' },
            ]
        },
        {
            group: 'Other Sanitary', items: [
                { id: 'bathtub', label: 'Bathtub — Compliant' },
                { id: 'otherGrabrails', label: 'Other Grab Rails — Present and Compliant' },
                { id: 'sanitarySlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'wallCabinets', label: 'Wall Cabinets — Accessible and Compliant' },
                { id: 'wallReinforcement', label: 'Wall Reinforcement (Thick Sheeting) — Present' },
                { id: 'robustBathroomFixtures', label: 'R: Robust Fixtures — Present and Compliant' },
            ]
        },
    ],

    kitchen: [
        {
            group: 'Functional Requirements', items: [
                { id: 'kitchenSink', label: 'Sink with Tap — Present and Functional' },
                { id: 'kitchenDishwasher', label: 'Dishwasher — Present (required for all categories)' },
                { id: 'dishwasherDrawer', label: 'FA/HPS: Dishwasher — Drawer Style' },
                { id: 'hasFridge', label: 'Is There a Fridge?', type: 'yesno' },
                { id: 'kitchenSlipRes', label: 'Slip Resistance of Flooring — Compliant' },
            ]
        },
        {
            group: 'Clearance & Lighting', items: [
                { id: 'benchClearance', label: 'Clearance in Front of Fixed Benches and Appliances' },
                { id: 'applianceRecess', label: 'Recessed Areas for Appliances' },
                { id: 'taskLighting', label: 'Task Lighting — 300 Lux, Max 1500mm Intervals, Over Benchtops' },
            ]
        },
        {
            group: 'Oven', sda: true, items: [
                { id: 'kitchenOven', label: 'Built-in Oven — Present and Functional' },
                { id: 'ovenDoorHinge', label: 'FA/HPS: Oven Door — Side Hinged, Latch Side Next to Accessible Benchtop' },
                { id: 'ovenHandle', label: 'FA/HPS: Oven Door Handle Height — 600–1100mm Above Floor' },
                { id: 'ovenRails', label: 'FA/HPS: Telescopic Rails on at Least One Shelf' },
            ]
        },
        {
            group: 'Benchtop (FA/HPS)', sda: true, items: [
                { id: 'accessBench', label: 'FA/HPS: Accessible Benchtop Next to Cooktop and Oven — 600mm Depth' },
                { id: 'benchKnee', label: 'FA/HPS: Under-Bench Knee / Toe Space — 900mm Wide, 440mm Deep' },
                { id: 'adjBench', label: 'FA/HPS: Height Adjustable Benchtop — 600mm × 440mm, 720–1020mm Range' },
                { id: 'benchGpo', label: 'FA/HPS: GPO Within 300mm of Benchtop Front Edge, Max 1100mm High' },
                { id: 'benchMaterial', label: 'R: Benchtop Made of Robust Materials' },
            ]
        },
        {
            group: 'Kitchen Cupboards', items: [
                { id: 'belowHandles', label: 'Below-Bench Cupboards — D Pull Handles (Top) or Push-to-Release' },
                { id: 'aboveHandles', label: 'Above-Bench Cupboards — D Pull Handles (Bottom) or Push-to-Release' },
                { id: 'overhangLip', label: 'Above-Bench Cupboards — 20mm Overhanging Lip' },
                { id: 'cabinetMaterial', label: 'R: Cabinetry Made of Robust Materials' },
            ]
        },
        {
            group: 'Cooktop', sda: true, items: [
                { id: 'kitchenCooktop', label: 'Fixed Cooktop with Rangehood — Present and Functional' },
                { id: 'cooktopType', label: 'FA/HPS: Cooktop — Electric or Induction (No Gas)' },
                { id: 'cooktopPosition', label: 'FA/HPS: Cooktop — Min 300mm from Internal Corner / Wall' },
                { id: 'cooktopControls', label: 'FA/HPS: Cooktop Controls — Accessible Side or Near Front Edge' },
            ]
        },
        {
            group: 'Kitchen Tapware', items: [
                { id: 'kitchenTaps', label: 'FA/HPS: Tapware — Lever or Sensor, Max 300mm from Benchtop Edge' },
            ]
        },
        {
            group: 'Accessible Storage (FA/HPS)', sda: true, items: [
                { id: 'accessPantry', label: 'FA/HPS: Wheelchair Accessible Pantry — Extendable Basket or Full Pull-Out Style' },
            ]
        },
    ],

    laundry: [
        {
            group: 'Laundry Fixtures', items: [
                { id: 'laundryAvail', label: 'Laundry Access with Sink or Tub and Taps — Available' },
                { id: 'washerDryer', label: 'Is There a Washer / Dryer?', type: 'yesno' },
                { id: 'applianceDepth', label: 'Appliance Depth — 700mm Required', showIf: { id: 'washerDryer', value: 'yes' } },
                { id: 'laundrySlipRes', label: 'Slip Resistance of Flooring — Compliant' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'laundryClearRIL', label: 'R/IL: Clearance in Front of Fixed Benches — 1000mm' },
                { id: 'laundryClearFA', label: 'HPS/FA: Clearance in Front of Fixed Benches — 1500mm' },
                { id: 'laundryTaps', label: 'FA/HPS: Tapware — Sensor or Lever, Max 300mm from Edge' },
            ]
        },
    ],

    bedroom: [
        {
            group: 'Bedroom Compliance', items: [
                { id: 'sdaBedroom', label: 'At Least One SDA Compliant Bedroom — Present' },
                { id: 'bedroomSizeRIL', label: 'IL/R: Bedroom Size — Min 3100mm × 3100mm Wall to Wall' },
                { id: 'bedroomSizeFA', label: 'FA/HPS: Bedroom — Queen Bed Allowance with Circulation (1540mm Transfer Side, 1000mm Other Sides)' },
            ]
        },
        {
            group: 'Door Circulation (FA/HPS)', sda: true, items: [
                { id: 'intDoorCirc', label: 'FA/HPS: Internal Door Circulation — 1540mm Wide, 1450mm Deep, Clear of Queen Bed' },
                { id: 'extDoorCirc', label: 'FA/HPS: External Door Circulation — 1200mm Skirting to Skirting + 110mm Hinge Side' },
            ]
        },
        {
            group: 'Robe', items: [
                { id: 'robeWidth', label: 'Robe Width — 1400mm Minimum' },
                { id: 'robeSections', label: 'Robe — Multiple Smaller Sections' },
                { id: 'robeAccess', label: 'FA/HPS: Clearance in Front of Robe — 1540mm Minimum' },
            ]
        },
        {
            group: 'Electrical', items: [
                { id: 'bedroomGpos', label: 'FA/HPS: 3 Double GPOs at Head of Bed + 1 Double GPO on Opposite Wall' },
                { id: 'ceilingGpo', label: 'HPS: GPO in Ceiling for Ceiling Hoist Power' },
                { id: 'bedroomDimmer', label: 'Dimmable Lights — Present' },
                { id: 'soundInsulation', label: 'R: Bedroom Sound Insulation — Wall Insulation Present' },
            ]
        },
        {
            group: 'Ceiling Hoist', items: [
                { id: 'ceilingHoistCompatible', label: 'Is the Bedroom Compatible with a Ceiling Hoist?', type: 'yesno' },
                { id: 'ceilingHoistPresent', label: 'Is There a Ceiling Hoist Installed?', type: 'yesno', showIf: { id: 'ceilingHoistCompatible', value: 'yes' } },
            ]
        },
        {
            group: 'Ceiling Hoist (HPS)', sda: true, items: [
                { id: 'hoistTravel', label: 'HPS: Hoist — Covers Full Width and Length of Bed', showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistCapacity', label: 'HPS: Hoist — 250kg Load Capacity Minimum', showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistMount', label: 'HPS: Hoist — Ceiling or Wall Mounted', showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
                { id: 'hoistCert', label: 'HPS: Hoist — Engineer Inspected and Certified', showIf: { id: 'ceilingHoistPresent', value: 'yes' } },
            ]
        },
    ],

    living: [
        {
            group: 'Living Areas', items: [
                { id: 'livingCount', label: 'At Least One Living Area — Present and Functional' },
                { id: 'livingDimmer', label: 'Dimmable Lights — Present' },
                { id: 'tvAntenna', label: 'Is There a TV Antenna?', type: 'yesno' },
                { id: 'recessedTvFixture', label: 'R: Is There a Recessed Robust TV Fixture?', type: 'yesno' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'turningSpace', label: 'FA/HPS: Free Space Clear of Furniture — 2250mm Diameter' },
            ]
        },
    ],

    stairs: [
        {
            group: 'Level Access', items: [
                { id: 'entryLevel', label: 'R/FA/HPS: All Internal Areas on Entry Level or Accessible by Lift (IL: bedrooms may be on upper level)' },
            ]
        },
        {
            group: 'Internal Stairways', items: [
                { id: 'stairHandrails', label: 'Handrails — Continuous on Both Sides, AS1428.1 Compliant' },
                { id: 'stairWidth', label: 'Clear Width — Minimum 1000mm' },
                { id: 'noWinders', label: 'No Winders on Landings' },
                { id: 'closedRisers', label: 'Closed Risers — Present' },
                { id: 'stairSlipRes', label: 'Slip Resistance — P3 or R10' },
                { id: 'nosingStrips', label: 'Nosing Strips — Present' },
                { id: 'tgsis', label: 'TGSIs — Present' },
            ]
        },
        {
            group: 'Lifts', items: [
                { id: 'liftDoor', label: 'Lift Door Opening — Minimum 900mm' },
                { id: 'liftSize', label: 'Lift Size — 1100mm Wide × 1400mm (Direction of Travel)' },
                { id: 'liftCompliance', label: 'Lift — NCC Clause E3.6 Compliant' },
            ]
        },
    ],

    external: [
        {
            group: 'External Stairways', items: [
                { id: 'extNosing', label: 'Nosing Strips — Present' },
                { id: 'extTgsis', label: 'TGSIs — Present with Raised Tactile on Handrail' },
            ]
        },
        {
            group: 'Letterbox (FA/HPS)', sda: true, items: [
                { id: 'letterboxArea', label: 'FA/HPS: Hard-Standing Area — 1540mm × 2070mm' },
                { id: 'letterboxPath', label: 'FA/HPS: Accessible Path from Dwelling to Letterbox' },
                { id: 'letterboxLock', label: 'FA/HPS: Letterbox — Lockable' },
                { id: 'letterboxHeight', label: 'FA/HPS: Letterbox Height — 600–1100mm' },
            ]
        },
        {
            group: 'Ramps & Accessways', items: [
                { id: 'accessWidthRIL', label: 'R/IL: Accessway Minimum Clear Width — 1000mm' },
                { id: 'accessWidthFA', label: 'FA/HPS: Accessway Minimum Clear Width — 1200mm (1500mm if Curved)' },
                { id: 'accessLanding', label: 'Level Landings — Min 1200mm × 1200mm, Exclusive of Door Swing' },
                { id: 'accessVertical', label: 'Vertical Clearance — Minimum 2000mm Along All Paths of Travel' },
            ]
        },
        {
            group: 'Utility Documentation', items: [
                { id: 'meterBoxPhoto', label: 'Meter Box — Photo Taken' },
                { id: 'powerBoxPhoto', label: 'Power Box — Photo Taken' },
                { id: 'nbnPhoto', label: 'NBN — Photo Taken' },
                { id: 'solarPhoto', label: 'Solar — Photo Taken' },
            ]
        },
    ],

    breakout: [
        {
            group: 'Breakout Room (Robust Only)', sda: true, items: [
                { id: 'breakoutSeparate', label: 'R: Breakout Room is a Separate Room — Not a Study or Living / Dining Area' },
            ]
        },
    ],

};

/** Returns the handover checklist groups for an area, falling back to an empty array. */
export function getHandoverGroups(area) {
    return HANDOVER_ITEMS[area] ?? []
}
