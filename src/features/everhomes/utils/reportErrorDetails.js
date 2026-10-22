export function reportErrorDetails(error, { operation, reportType, reportId, online } = {}) {
  // Deliberately exclude resume keys, request bodies and signed URLs.
  return [
    `operation: ${operation ?? 'report'}`,
    `reportType: ${reportType ?? ''}`,
    `reportId: ${reportId ?? ''}`,
    `code: ${error?.code ?? 'unknown'}`,
    `status: ${error?.status ?? ''}`,
    `endpoint: ${error?.endpoint ?? ''}`,
    `message: ${error?.message ?? 'Unknown report error'}`,
    `online: ${String(online ?? navigator.onLine)}`,
  ].join('\n')
}
