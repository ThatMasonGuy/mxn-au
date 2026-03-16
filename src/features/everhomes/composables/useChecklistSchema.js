// composables/useChecklistSchema.js
import { inspectionItems } from '@/features/everhomes/data/inspectionItems.js'
import { handoverItems } from '@/features/everhomes/data/handoverItems.js'

const schemas = { inspection: inspectionItems, handover: handoverItems }

export function useChecklistSchema(reportType) {
    return schemas[reportType] ?? schemas.inspection
}