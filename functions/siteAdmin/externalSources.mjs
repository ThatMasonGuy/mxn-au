import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { BigQuery } from '@google-cloud/bigquery'
import { createBillingSummary, createGa4Summary } from './externalSourcesCore.mjs'

const GA4_PROPERTY_ID = '443572528'
const BILLING_PROJECT_ID = 'mxn-au'
const BILLING_DATASET_ID = 'mxn_billing'
const BILLING_TABLE_PREFIX = 'gcp_billing_export_v1_'

let analyticsClient
let bigQueryClient

function getAnalyticsClient() {
  analyticsClient ||= new BetaAnalyticsDataClient()
  return analyticsClient
}

function getBigQueryClient() {
  bigQueryClient ||= new BigQuery({ projectId: BILLING_PROJECT_ID })
  return bigQueryClient
}

export class SourceWaitingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'SourceWaitingError'
  }
}

export async function loadGa4Overview() {
  const client = getAnalyticsClient()
  const report = {
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'eventCount' },
    ],
  }
  const [summaryResult, dailyResult] = await Promise.all([
    client.runReport(report),
    client.runReport({
      ...report,
      dimensions: [{ name: 'date' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
  ])

  return createGa4Summary(summaryResult[0], dailyResult[0], GA4_PROPERTY_ID)
}

export async function loadBillingOverview() {
  const client = getBigQueryClient()
  const dataset = client.dataset(BILLING_DATASET_ID)
  const [[metadata], [tables]] = await Promise.all([
    dataset.getMetadata(),
    dataset.getTables({ autoPaginate: true }),
  ])
  const table = tables.find((candidate) => candidate.id?.startsWith(BILLING_TABLE_PREFIX))

  if (!table) {
    throw new SourceWaitingError('Billing export is connected. Waiting for Google to create the first cost table.')
  }
  if (!/^[A-Za-z0-9_]+$/.test(table.id)) {
    throw new Error('Billing export returned an unsupported table name')
  }

  const tablePath = `\`${BILLING_PROJECT_ID}.${BILLING_DATASET_ID}.${table.id}\``
  const [rows] = await client.query({
    location: metadata.location,
    maximumBytesBilled: '1000000000',
    params: { projectId: BILLING_PROJECT_ID },
    query: `
      SELECT
        FORMAT_DATE('%F', DATE(usage_start_time, 'Australia/Brisbane')) AS usageDate,
        service.description AS service,
        currency,
        SUM(cost) AS grossCost,
        SUM(COALESCE((SELECT SUM(credit.amount) FROM UNNEST(credits) AS credit), 0)) AS credits,
        SUM(cost + COALESCE((SELECT SUM(credit.amount) FROM UNNEST(credits) AS credit), 0)) AS netCost
      FROM ${tablePath}
      WHERE project.id = @projectId
        AND DATE(usage_start_time, 'Australia/Brisbane') >= DATE_TRUNC(CURRENT_DATE('Australia/Brisbane'), MONTH)
      GROUP BY usageDate, service, currency
      ORDER BY usageDate, netCost DESC
    `,
    useLegacySql: false,
  })

  return createBillingSummary(rows, {
    projectId: BILLING_PROJECT_ID,
    datasetId: BILLING_DATASET_ID,
  })
}
