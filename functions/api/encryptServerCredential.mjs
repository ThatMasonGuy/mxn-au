import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { encryptCredential } from '../services/credentialCrypto.mjs'

const encryptionKey = defineSecret('SERVER_CREDENTIAL_ENCRYPTION_KEY')

export function createEncryptCredentialHandler(getSecret) {
  return async (request) => {
    if (!request.auth?.uid || request.auth.token?.firebase?.sign_in_provider === 'anonymous') {
      throw new HttpsError('unauthenticated', 'Sign in to save server credentials.')
    }
    const credential = request.data?.credential
    if (typeof credential !== 'string' || !credential || credential.length > 32768) {
      throw new HttpsError('invalid-argument', 'Credential must contain between 1 and 32768 characters.')
    }
    return { encryptedCredential: encryptCredential(credential, getSecret()) }
  }
}

export const encryptServerCredential = onCall(
  { region: 'australia-southeast1', secrets: [encryptionKey], maxInstances: 1, concurrency: 4, memory: '256MiB' },
  createEncryptCredentialHandler(() => encryptionKey.value()),
)
