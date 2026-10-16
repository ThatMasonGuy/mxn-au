import { auth } from '@/firebase'

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

export function createIdSightingCredentials() {
  const hex = (size) => Array.from(crypto.getRandomValues(new Uint8Array(size)), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return { recordId: hex(16), accessKey: hex(32) }
}

export async function idSightingRequest(payload, { admin = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (admin) {
    const token = await auth.currentUser?.getIdToken()
    if (!token) throw new Error('Your administrator session has expired. Please sign in again.')
    headers.Authorization = `Bearer ${token}`
  }
  try {
    const response = await fetch(`${FUNCTIONS_URL}/everhomesIdSighting`, {
      method: 'POST', headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(125_000),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(body.error ?? 'The record service could not finish. Please try again.')
      error.status = response.status
      throw error
    }
    return body
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') throw new Error(payload.action === 'delete'
      ? 'Deletion took too long. Refresh records before trying to delete it again.'
      : 'The record service took too long. Retry with the same details to recover your record.')
    throw error
  }
}

export async function downloadIdSighting(payload, options) {
  const result = await idSightingRequest({ ...payload, action: 'download' }, options)
  const bytes = Uint8Array.from(atob(result.pdfBase64), (character) => character.charCodeAt(0))
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = result.filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}
