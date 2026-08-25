const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normaliseReportRecipient(value) {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length > 0 && email.length <= 320 && EMAIL_PATTERN.test(email) ? email : null
}

export function addReportRecipients(existing, input, maxRecipients = 20) {
  const recipients = Array.from(new Set(
    (Array.isArray(existing) ? existing : [])
      .map(normaliseReportRecipient)
      .filter(Boolean),
  ))
  const invalid = []
  let overflow = false

  for (const candidate of String(input ?? '').split(/[,;\s]+/).filter(Boolean)) {
    const email = normaliseReportRecipient(candidate)
    if (!email) {
      invalid.push(candidate)
      continue
    }
    if (recipients.includes(email)) continue
    if (recipients.length >= maxRecipients) {
      overflow = true
      continue
    }
    recipients.push(email)
  }

  return { recipients, invalid, overflow }
}
