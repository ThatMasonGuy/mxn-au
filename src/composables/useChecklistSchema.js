// composables/useChecklistSchema.js
import { inspectionItems } from '@/data/inspectionItems.js'
import { handoverItems } from '@/data/handoverItems.js'

const schemas = { inspection: inspectionItems, handover: handoverItems }

export function useChecklistSchema(reportType) {
    return schemas[reportType] ?? schemas.inspection
}