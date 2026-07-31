export function normaliseEmailDeliveries(results, targets) {
  return results.map((result, index) => {
    const target = targets[index]
    const error = result.status === 'rejected'
      ? result.reason
      : result.value?.error

    return {
      ...target,
      sent: !error,
      providerId: error ? null : result.value?.data?.id ?? null,
      error: error?.message ?? (error ? String(error) : null),
    }
  })
}
