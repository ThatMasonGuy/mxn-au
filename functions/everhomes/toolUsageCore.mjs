export const EVERHOMES_USAGE_TOOLS = Object.freeze({
  'water-bills': {
    name: 'Water Bills',
    events: { opened: [], calculation_completed: ['easy', 'advanced'] },
  },
  'placement-fees': {
    name: 'Placement Fees',
    events: { opened: [], calculation_completed: ['fixed', 'three_weeks'] },
  },
  'participant-sda-funding': {
    name: 'Participant SDA Funding',
    events: {
      opened: [],
      calculator_selected: ['sda', 'appendix_h'],
      calculation_completed: ['sda', 'appendix_h'],
    },
  },
  'qr-code': {
    name: 'QR Code Generator',
    events: {
      opened: [],
      qr_generated: ['text', 'wifi'],
      downloaded: ['png', 'svg'],
      copied: ['image', 'data'],
    },
  },
  'inspection-report': {
    name: 'Inspection Report',
    events: { opened: [], report_started: [], report_submitted: [] },
  },
  'handover-report': {
    name: 'Handover Report',
    events: { opened: [], report_started: [], report_submitted: [] },
  },
  'spreadsheet-import': {
    name: 'Spreadsheet Import',
    events: { opened: [], import_started: [], import_completed: [] },
  },
})

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DEVICE_CLASSES = new Set(['mobile', 'tablet', 'desktop', 'unknown'])

export class ToolUsageRequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function normaliseEverhomesUsageEvent(body = {}) {
  const toolId = typeof body.toolId === 'string' ? body.toolId.trim() : ''
  const action = typeof body.action === 'string' ? body.action.trim() : ''
  const variant = typeof body.variant === 'string' ? body.variant.trim() : null
  const eventId = typeof body.eventId === 'string' ? body.eventId.trim() : ''
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
  const device = DEVICE_CLASSES.has(body.device) ? body.device : 'unknown'
  const tool = EVERHOMES_USAGE_TOOLS[toolId]

  if (!tool) throw new ToolUsageRequestError(400, 'Unsupported Everhomes tool')
  if (!Object.hasOwn(tool.events, action)) throw new ToolUsageRequestError(400, 'Unsupported tool action')
  if (!UUID_PATTERN.test(eventId)) throw new ToolUsageRequestError(400, 'Invalid event ID')
  if (!UUID_PATTERN.test(sessionId)) throw new ToolUsageRequestError(400, 'Invalid session ID')

  const allowedVariants = tool.events[action]
  if (allowedVariants.length === 0 && variant !== null) {
    throw new ToolUsageRequestError(400, 'This action does not accept a variant')
  }
  if (allowedVariants.length > 0 && !allowedVariants.includes(variant)) {
    throw new ToolUsageRequestError(400, 'Unsupported tool variant')
  }

  return {
    eventId,
    sessionId,
    toolId,
    toolName: tool.name,
    action,
    variant,
    device,
    meaningfulUse: !['opened', 'calculator_selected'].includes(action),
  }
}

export function brisbaneDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Brisbane',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}
