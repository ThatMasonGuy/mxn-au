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
            group: 'SDA Compliance', items: [
                { id: 'sdaSuitability', label: 'Suitability of Dwelling to be Used as SDA' },
                { id: 'sdaCount', label: 'Number of SDA Dwellings on Parcel of Land', type: 'number' },
                { id: 'roomSize', label: 'Size or Usability of All Rooms in Dwelling' },
                { id: 'storageCupboard', label: '600mm Wide Storage Cupboard with Adjustable Shelving (separate to bedroom robe)' },
                { id: 'vandaalProof', label: 'R: High Impact / Vandal Proof Fittings and Fixtures' },
            ]
        },
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
                { id: 'hvacZoned', label: 'FA/HPS: Ducted Air Conditioning Zoned into Habitable Rooms (if applicable)' },
                { id: 'emergPower', label: 'HPS: Emergency Power — Minimum 2 Hour Outage Coverage' },
                { id: 'emergGpos', label: 'HPS: Emergency Power — 2 Double GPOs in Participant Bedrooms' },
                { id: 'emergDoors', label: 'HPS: Emergency Power — Covers Automated Entry / Egress Doors' },
            ]
        },
        {
            group: 'Assistive Technology', sda: true, items: [
                { id: 'internet', label: 'HPS/FA: High Speed Internet — Stable with Wi-Fi Coverage Throughout' },
                { id: 'intercom', label: 'HPS: Video / Intercom Communication System' },
            ]
        },
        {
            group: 'Fire Safety & Evacuation', items: [
                { id: 'smokeAlarms', label: 'Smoke Alarms — Present in Bedrooms and Living Spaces' },
                { id: 'evacPlan', label: 'Emergency Evacuation Plan — Provided with Path of Travel to Safe Place' },
                { id: 'sprinklers', label: 'Fire Sprinklers (if provided)' },
                { id: 'emergLighting', label: 'Emergency Lighting (if required under NCC)' },
                { id: 'designDrawings', label: 'R: Design Drawings Provided to Site Manager, Staff and Residents (egress / retreat)' },
            ]
        },
    ],

    accessway: [
        {
            group: 'Pathway', items: [
                { id: 'pathCrossfall', label: 'Crossfall (Sideways Slope) — Within Tolerance' },
                { id: 'pathVertTol', label: 'Vertical Tolerance Between Abutting Surfaces and Cracks' },
                { id: 'pathTransition', label: 'Transition of Surface Materials — Compliant' },
                { id: 'pathSlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'pathLandings', label: 'Landings — Compliant' },
                { id: 'pathKerbRails', label: 'Kerb Rails — Present and Compliant (if required)' },
                { id: 'pathHandrails', label: 'Handrails or Walls — Present and Compliant (if required)' },
                { id: 'pathWidthFA', label: 'FA/HPS: Pathway Width — 1200mm Clear (1500mm if Curved)' },
                { id: 'pathWidthRIL', label: 'R/IL: Pathway Width — 1000mm Clear' },
            ]
        },
        {
            group: 'Step Ramp (if applicable)', items: [
                { id: 'stepRampGrad', label: 'Gradient (Slope) — 1:10 Maximum' },
                { id: 'stepRampLevel', label: 'Level Change — Within Tolerance' },
                { id: 'stepRampSlip', label: 'Slip Resistance — P5 or R12' },
                { id: 'stepRampWidthsFA', label: 'FA/HPS: Step Ramp Widths — 1000mm Min Width, 1540mm Door Circulation' },
                { id: 'stepRampWidthsRIL', label: 'R/IL: Step Ramp Widths — 850mm Min Width, 1000mm Door Circulation' },
            ]
        },
        {
            group: 'Ramp (if applicable)', items: [
                { id: 'rampLandings', label: 'Landings — Compliant' },
                { id: 'rampHandrails', label: 'Handrails — AS1428.1 Compliant' },
                { id: 'rampKerbRails', label: 'Kerb Rails — Present and Compliant' },
                { id: 'rampSlipRes', label: 'Slip Resistance — Compliant' },
            ]
        },
        {
            group: 'Gates (if applicable)', items: [
                { id: 'gates', label: 'Gates and Landings in Front of Them — Compliant' },
            ]
        },
    ],

    carParking: [
        {
            group: 'Car Parking for Participants', items: [
                { id: 'parkingAccess', label: 'Access from Car Parking Space to Entry Doorway' },
                { id: 'parkingDimensions', label: 'Car Parking Space Dimensions', type: 'text' },
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
                { id: 'thresholdFlush', label: 'Threshold Flush or Ramp Present (if required)' },
                { id: 'entranceDoorCirc', label: 'Door Circulation Space — Both Sides of Front Door' },
                { id: 'coveredEntry', label: 'Covered Roof Area Over Entry' },
            ]
        },
        {
            group: 'Door Automation (if applicable)', sda: true, items: [
                { id: 'autoCabling', label: 'HPS: Power & Control Cabling (GPO) to Head of Entry Doors' },
                { id: 'autoHardware', label: 'Door Automation Hardware — Functional (if installed)' },
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
            ]
        },
    ],

    windows: [
        {
            group: 'Windows & Glazing', items: [
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
                { id: 'wcCount', label: 'WC Pans — Count', type: 'number' },
                { id: 'wcFunction', label: 'WC Pans — Accessible, Located and Functional' },
                { id: 'basinCount', label: 'Hand Wash Basins — Count', type: 'number' },
                { id: 'basinFunction', label: 'Hand Wash Basins — Accessible, Located and Functional' },
                { id: 'showerCount', label: 'Showers — Count', type: 'number' },
                { id: 'showerFunction', label: 'Showers — Accessible, Located and Functional' },
            ]
        },
        {
            group: 'Toilet', items: [
                { id: 'toiletBackrest', label: 'Toilet Backrest — Present' },
                { id: 'toiletGrabrail', label: 'Grab Rails — Present and Compliant' },
                { id: 'toiletClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'toiletContrast', label: 'IL: Toilet Seat Luminance Contrast — Min 30% with Background' },
            ]
        },
        {
            group: 'Shower Area', items: [
                { id: 'showerClear', label: 'Clear Space in Front — Clear of Door Swing' },
                { id: 'noShowerScreen', label: 'No Shower Screens or Screen Fixtures Present' },
                { id: 'showerGrabrail', label: 'HPS/FA: Vertical Support Grab Rail — Present' },
                { id: 'curtainRail', label: 'HPS/FA: Curtain Rail — Present' },
                { id: 'showerGradient', label: 'HPS/FA: Shower Floor Gradient — No Notable Changes' },
                { id: 'showerTaps', label: 'HPS/FA: Lever Style Shower Tap — Present' },
            ]
        },
        {
            group: 'Hand Wash Basin', items: [
                { id: 'basinDepth', label: 'Basin Depth — Compliant' },
                { id: 'basinClear', label: 'Clear Space in Front with Sufficient Circulation Space' },
                { id: 'kneeClear', label: 'Knee and Toe Clearance Under Basin' },
                { id: 'basinTaps', label: 'Tapware — Lever or Sensor Type, Within Reach' },
            ]
        },
        {
            group: 'Other Sanitary', items: [
                { id: 'bathtub', label: 'Bathtub — Compliant (if applicable)' },
                { id: 'otherGrabrails', label: 'Other Grab Rails — Present and Compliant' },
                { id: 'sanitarySlipRes', label: 'Slip Resistance — Compliant' },
                { id: 'wallCabinets', label: 'Wall Cabinets — Accessible and Compliant' },
                { id: 'wallReinforcement', label: 'Wall Reinforcement (Thick Sheeting) — Present' },
            ]
        },
    ],

    kitchen: [
        {
            group: 'Functional Requirements', items: [
                { id: 'kitchenCooktop', label: 'Fixed Cooktop with Rangehood — Present and Functional' },
                { id: 'kitchenOven', label: 'Built-in Oven — Present and Functional' },
                { id: 'kitchenSink', label: 'Sink with Tap — Present and Functional' },
                { id: 'kitchenDishwasher', label: 'Dishwasher — Present (required for all categories)' },
                { id: 'dishwasherDrawer', label: 'FA/HPS: Dishwasher — Drawer Style' },
                { id: 'fridgeSpace', label: 'Fridge Space — 700mm Depth' },
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
            group: 'Wall Oven (FA/HPS)', sda: true, items: [
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
            group: 'Cooktop & Tapware (FA/HPS)', sda: true, items: [
                { id: 'cooktopType', label: 'FA/HPS: Cooktop — Electric or Induction (No Gas)' },
                { id: 'cooktopPosition', label: 'FA/HPS: Cooktop — Min 300mm from Internal Corner / Wall' },
                { id: 'cooktopControls', label: 'FA/HPS: Cooktop Controls — Accessible Side or Near Front Edge' },
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
                { id: 'applianceDepth', label: 'Appliance Depth — 700mm Required' },
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
            group: 'Electrical & Climate', items: [
                { id: 'bedroomGpos', label: 'FA/HPS: 3 Double GPOs at Head of Bed + 1 Double GPO on Opposite Wall' },
                { id: 'ceilingGpo', label: 'HPS: GPO in Ceiling for Ceiling Hoist Power' },
                { id: 'bedroomDimmer', label: 'Dimmable Lights — Present' },
                { id: 'bedroomHvac', label: 'FA/HPS: Reverse Cycle Air Conditioning — Panel 900–1100mm Above Floor, Min 500mm from Corner' },
                { id: 'bedroomSmoke', label: 'Smoke Alarms — Present and Functional' },
                { id: 'soundInsulation', label: 'R: Bedroom Sound Insulation — Wall Insulation Present' },
            ]
        },
        {
            group: 'Ceiling Hoist (HPS)', sda: true, items: [
                { id: 'hoistTravel', label: 'HPS: Hoist — Covers Full Width and Length of Bed' },
                { id: 'hoistCapacity', label: 'HPS: Hoist — 250kg Load Capacity Minimum' },
                { id: 'hoistMount', label: 'HPS: Hoist — Ceiling or Wall Mounted' },
                { id: 'hoistCert', label: 'HPS: Hoist — Engineer Inspected and Certified' },
            ]
        },
    ],

    living: [
        {
            group: 'Living Areas', items: [
                { id: 'livingCount', label: 'At Least One Living Area — Present and Functional' },
                { id: 'livingDimmer', label: 'Dimmable Lights — Present' },
                { id: 'livingSmoke', label: 'Smoke Alarms — Present and Functional' },
            ]
        },
        {
            group: 'SDA / Accessibility', sda: true, items: [
                { id: 'turningSpace', label: 'FA/HPS: Free Space Clear of Furniture — 2250mm Diameter' },
                { id: 'livingHvac', label: 'FA/HPS: Reverse Cycle Air Conditioning — Panel 900–1100mm Above Floor, Min 500mm from Corner' },
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
            group: 'Internal Stairways (if applicable)', items: [
                { id: 'stairHandrails', label: 'Handrails — Continuous on Both Sides, AS1428.1 Compliant' },
                { id: 'stairWidth', label: 'Clear Width — Minimum 1000mm' },
                { id: 'noWinders', label: 'No Winders on Landings' },
                { id: 'closedRisers', label: 'Closed Risers — Present' },
                { id: 'stairSlipRes', label: 'Slip Resistance — P3 or R10' },
                { id: 'nosingStrips', label: 'Nosing Strips — Present (if required by NCC)' },
                { id: 'tgsis', label: 'TGSIs — Present (if required by participants or NCC)' },
            ]
        },
        {
            group: 'Lifts (if applicable)', items: [
                { id: 'liftDoor', label: 'Lift Door Opening — Minimum 900mm' },
                { id: 'liftSize', label: 'Lift Size — 1100mm Wide × 1400mm (Direction of Travel)' },
                { id: 'liftCompliance', label: 'Lift — NCC Clause E3.6 Compliant' },
            ]
        },
    ],

    external: [
        {
            group: 'External Stairways (if applicable)', items: [
                { id: 'extNosing', label: 'Nosing Strips — Present (if required)' },
                { id: 'extTgsis', label: 'TGSIs — Present with Raised Tactile on Handrail (if required)' },
            ]
        },
        {
            group: 'Letterbox (FA/HPS)', sda: true, items: [
                { id: 'letterboxArea', label: 'FA/HPS: Hard-Standing Area — 1540mm × 2070mm' },
                { id: 'letterboxXfall', label: 'FA/HPS: Crossfall in Front — Less than 1:40 in Any Direction' },
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
            group: '1:20 Grade Accessways (if applicable)', items: [
                { id: 'grade20Landing', label: 'Mid-Landings — 1200mm Length Every 15m' },
                { id: 'grade20Turns', label: 'Turns — Comply with AS1428.1' },
                { id: 'grade20Edge', label: 'Edge Treatment — Firm & Level for 600mm, or Kerb / Handrail ≥450mm Present' },
                { id: 'grade20Slip', label: 'Slip Resistance — P4 or R11' },
            ]
        },
        {
            group: '1:10 Step Ramp (if applicable)', items: [
                { id: 'ramp10Change', label: 'Max Level Change — 190mm' },
                { id: 'ramp10Length', label: 'Max Length — 1900mm' },
                { id: 'ramp10Compliance', label: 'AS1428.1 Compliant' },
                { id: 'ramp10Slip', label: 'Slip Resistance — P5 or R12' },
                { id: 'ramp10WidthsFA', label: 'FA/HPS: Widths — 1200mm Min, 1540mm Door Circulation' },
                { id: 'ramp10WidthsRIL', label: 'R/IL: Widths — 1000mm Min, 1000mm Door Circulation' },
            ]
        },
        {
            group: '1:14 Ramp (if applicable)', items: [
                { id: 'ramp14Landings', label: '1200mm Landings at Max 9m Intervals — AS1428.1 Compliant' },
                { id: 'ramp14Handrails', label: 'Handrail Profile, Extensions and Kerb Rails — AS1428.1 Compliant' },
                { id: 'ramp14Slip', label: 'Slip Resistance — P4 or R11' },
                { id: 'ramp14WidthsFA', label: 'FA/HPS: Width — 1200mm Minimum' },
                { id: 'ramp14WidthsRIL', label: 'R/IL: Width — 1000mm Minimum' },
                { id: 'ramp14Boundary', label: 'Landing Space Fully Within Property Boundary' },
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
