import assert from 'node:assert/strict'

import {
  CHECKLIST_ITEMS as localInspectionItems,
  _common as localInspectionFallback,
} from '../src/features/everhomes/data/inspectionItems.js'
import { HANDOVER_ITEMS as localHandoverItems } from '../src/features/everhomes/data/handoverItems.js'
import {
  CHECKLIST_ITEMS as functionInspectionItems,
  _common as functionInspectionFallback,
} from '../functions/everhomes/checklistSchemas/inspectionItems.mjs'
import { HANDOVER_ITEMS as functionHandoverItems } from '../functions/everhomes/checklistSchemas/handoverItems.mjs'
import inspectionSchema from '../src/features/everhomes/schemas/inspection.js'
import handoverSchema from '../src/features/everhomes/schemas/handover.js'
import { REPORT_SCHEMAS as functionReportSchemas } from '../functions/everhomes/checklistSchemas/index.mjs'

const allowedTypes = new Set(['text', 'number', 'date', 'multiline', 'yesno'])

function validateSchema(name, schema) {
  assert.ok(schema && typeof schema === 'object', `${name} must export a schema object`)
  assert.ok(Array.isArray(schema.general), `${name} must include a general section`)

  let groupCount = 0
  let itemCount = 0

  for (const [sectionKey, groups] of Object.entries(schema)) {
    assert.ok(Array.isArray(groups), `${name}.${sectionKey} must be an array of groups`)
    const ids = new Set()

    for (const group of groups) {
      groupCount += 1
      assert.equal(typeof group.group, 'string', `${name}.${sectionKey} has a group without a label`)
      assert.ok(Array.isArray(group.items), `${name}.${sectionKey}.${group.group} must have an items array`)

      for (const item of group.items) {
        itemCount += 1
        assert.equal(typeof item.id, 'string', `${name}.${sectionKey}.${group.group} has an item without an id`)
        assert.equal(typeof item.label, 'string', `${name}.${sectionKey}.${group.group}.${item.id} has no label`)
        assert.ok(!ids.has(item.id), `${name}.${sectionKey} contains duplicate item id "${item.id}"`)
        ids.add(item.id)
        if (item.type !== undefined) {
          assert.ok(allowedTypes.has(item.type), `${name}.${sectionKey}.${item.id} has unsupported type "${item.type}"`)
        }
      }
    }

    for (const group of groups) {
      for (const item of group.items) {
        if (item.showIf) {
          assert.ok(
            ids.has(item.showIf.id),
            `${name}.${sectionKey}.${item.id} depends on missing item "${item.showIf.id}"`,
          )
        }
      }
    }
  }

  const remotesItems = schema.general
    .flatMap((group) => group.items)
    .filter((item) => item.id === 'allRemotesWorking')
  assert.equal(remotesItems.length, 1, `${name}.general must contain allRemotesWorking exactly once`)
  assert.deepEqual(
    remotesItems[0],
    { id: 'allRemotesWorking', label: 'All remotes are working', type: 'yesno' },
    `${name}.general.allRemotesWorking does not match the reporting contract`,
  )

  return { sections: Object.keys(schema).length, groups: groupCount, items: itemCount }
}

assert.deepEqual(
  functionInspectionItems,
  localInspectionItems,
  'Inspection browser and Cloud Function checklist schemas are out of sync',
)
assert.deepEqual(
  functionInspectionFallback,
  localInspectionFallback,
  'Inspection browser and Cloud Function fallback schemas are out of sync',
)
assert.deepEqual(
  functionHandoverItems,
  localHandoverItems,
  'Handover browser and Cloud Function checklist schemas are out of sync',
)

for (const browserSchema of [inspectionSchema, handoverSchema]) {
  const functionSchema = functionReportSchemas[browserSchema.reportType]
  assert.ok(functionSchema, `Cloud Function schema missing for ${browserSchema.reportType}`)
  assert.equal(functionSchema.collection, browserSchema.collection, `${browserSchema.reportType} collection is out of sync`)
  assert.equal(functionSchema.docTitle, browserSchema.docTitle, `${browserSchema.reportType} PDF title is out of sync`)
  assert.equal(functionSchema.emailSubjectPrefix, browserSchema.emailSubjectPrefix, `${browserSchema.reportType} email subject is out of sync`)
  assert.equal(functionSchema.fromName, browserSchema.fromName, `${browserSchema.reportType} sender name is out of sync`)
  assert.equal(functionSchema.sdaFilter, browserSchema.sdaFilter, `${browserSchema.reportType} SDA filter flag is out of sync`)
  assert.deepEqual(
    functionSchema.requiredSections,
    browserSchema.sections.forced.map((section) => section.itemsKey ?? section.key),
    `${browserSchema.reportType} required sections are out of sync`,
  )
  assert.deepEqual(
    functionSchema.pickerOptions,
    browserSchema.sdaFilter
      ? browserSchema.pickerOptions.map(({ key, includes }) => ({ key, includes }))
      : [],
    `${browserSchema.reportType} category visibility contract is out of sync`,
  )
}

const inspectionCounts = validateSchema('inspection', localInspectionItems)
const handoverCounts = validateSchema('handover', localHandoverItems)

console.log('Everhomes report schemas are in sync.', {
  inspection: inspectionCounts,
  handover: handoverCounts,
})
