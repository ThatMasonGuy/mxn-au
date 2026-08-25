const GA4_METRICS = ['activeUsers', 'newUsers', 'sessions', 'views', 'events']

function asNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function roundMoney(value) {
  return Math.round((asNumber(value) + Number.EPSILON) * 1_000_000) / 1_000_000
}

function ga4Metrics(row) {
  return Object.fromEntries(GA4_METRICS.map((metric, index) => [
    metric,
    asNumber(row?.metricValues?.[index]?.value),
  ]))
}

function ga4Date(value) {
  const match = String(value ?? '').match(/^(\d{4})(\d{2})(\d{2})$/)
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null
}

export function createGa4Summary(summaryReport, dailyReport, propertyId) {
  const totals = ga4Metrics(summaryReport?.rows?.[0])
  const daily = (dailyReport?.rows ?? [])
    .map((row) => ({
      date: ga4Date(row?.dimensionValues?.[0]?.value),
      ...ga4Metrics(row),
    }))
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    propertyId,
    range: { start: '30daysAgo', end: 'today' },
    totals,
    daily,
    scope: 'Optional GA4 data from visitors who chose analytics. Signed-in operational events are reported separately.',
  }
}

export function createBillingSummary(rows, { now = new Date(), projectId, datasetId } = {}) {
  const services = new Map()
  const daily = new Map()
  let grossCost = 0
  let credits = 0
  let reportedThrough = null
  let currency = null

  for (const row of rows ?? []) {
    const rowGross = asNumber(row.grossCost)
    const rowCredits = asNumber(row.credits)
    const rowNet = asNumber(row.netCost ?? rowGross + rowCredits)
    const serviceName = String(row.service ?? 'Other Google Cloud services')
    const usageDate = String(row.usageDate ?? '')
    const service = services.get(serviceName) ?? {
      name: serviceName,
      grossCost: 0,
      credits: 0,
      netCost: 0,
    }

    service.grossCost += rowGross
    service.credits += rowCredits
    service.netCost += rowNet
    services.set(serviceName, service)

    if (/^\d{4}-\d{2}-\d{2}$/.test(usageDate)) {
      const day = daily.get(usageDate) ?? { date: usageDate, netCost: 0 }
      day.netCost += rowNet
      daily.set(usageDate, day)
      if (!reportedThrough || usageDate > reportedThrough) reportedThrough = usageDate
    }

    grossCost += rowGross
    credits += rowCredits
    currency ||= row.currency || null
  }

  const nowParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Brisbane',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now)
  const year = Number(nowParts.find((part) => part.type === 'year')?.value)
  const month = Number(nowParts.find((part) => part.type === 'month')?.value)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const daysReported = reportedThrough ? Number(reportedThrough.slice(-2)) : 0
  const netCost = grossCost + credits

  return {
    projectId,
    datasetId,
    month: `${year}-${String(month).padStart(2, '0')}`,
    currency: currency || 'AUD',
    reportedThrough,
    grossCost: roundMoney(grossCost),
    credits: roundMoney(credits),
    netCost: roundMoney(netCost),
    projectedMonthEnd: daysReported > 0
      ? roundMoney((netCost / daysReported) * daysInMonth)
      : null,
    projectionBasis: daysReported > 0
      ? `${daysReported} reported ${daysReported === 1 ? 'day' : 'days'} scaled across ${daysInMonth} days.`
      : 'Waiting for the first exported cost rows.',
    services: [...services.values()]
      .map((service) => ({
        ...service,
        grossCost: roundMoney(service.grossCost),
        credits: roundMoney(service.credits),
        netCost: roundMoney(service.netCost),
      }))
      .sort((a, b) => b.netCost - a.netCost || a.name.localeCompare(b.name)),
    daily: [...daily.values()]
      .map((day) => ({ ...day, netCost: roundMoney(day.netCost) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    scope: 'Cloud Billing export for project mxn-au. Costs can lag behind usage and remain estimates until invoiced.',
  }
}
