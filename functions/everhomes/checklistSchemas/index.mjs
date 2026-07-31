// functions/everhomes/checklistSchemas/index.mjs

// ─── Report Schema Registry ───────────────────────────────────────────────────
// Each entry defines everything the cloud function needs to generate a report
// for a given workflow. Add new report types here — zero changes to the function.
//
// Schema shape:
// {
//   items:               { [roomType]: GroupDef[] }   — checklist definitions keyed by room type
//   fallback:            GroupDef[]                   — used when room.type has no match in items
//   docTitle:            string                       — subtitle on PDF cover page
//   collection:          string                       — Firestore collection for status updates
//   emailSubjectPrefix:  string                       — prefix for email subject line
//   fromName:            string                       — Resend "from" display name
// }

import { CHECKLIST_ITEMS as inspectionItems, _common } from './inspectionItems.mjs';
import { HANDOVER_ITEMS as handoverItems } from './handoverItems.mjs';

export const REPORT_SCHEMAS = {
  inspection: {
    items: inspectionItems,
    fallback: _common,
    docTitle: 'Property Inspection Report',
    collection: 'inspections',
    emailSubjectPrefix: 'Inspection Report',
    fromName: 'Everhomes Inspections',
    sdaFilter: false,
    pickerOptions: [],
    requiredSections: ['entry', 'living', 'kitchen', 'general'],
  },

  handover: {
    items: handoverItems,
    fallback: [],
    docTitle: 'Handover / Annual Review',
    collection: 'handovers',
    emailSubjectPrefix: 'Property Handover',
    fromName: 'Everhomes Onboarding',
    sdaFilter: true,
    requiredSections: [
      'general',
      'entrance',
      'corridors',
      'windows',
      'sanitary',
      'kitchen',
      'laundry',
      'bedroom',
      'living',
    ],
    pickerOptions: [
      { key: 'HPS', includes: ['HPS', 'FA', 'IL'] },
      { key: 'FA', includes: ['FA', 'IL'] },
      { key: 'IL', includes: ['IL'] },
      { key: 'R', includes: ['R', 'IL'] },
    ],
  },
};

export function getSchema(reportType) {
  return REPORT_SCHEMAS[reportType] ?? null;
}
