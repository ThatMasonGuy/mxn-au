import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto'

// Preserve the existing browser v2 format and passphrase.
export function encryptCredential(credential, secret) {
  if (typeof credential !== 'string' || !credential || credential.length > 32768) throw new Error('Invalid credential length')
  if (!secret) throw new Error('Encryption key is not configured')
  const salt = randomBytes(16)
  const iv = randomBytes(12)
  const key = pbkdf2Sync(secret, salt, 310000, 32, 'sha256')
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(credential, 'utf8'), cipher.final(), cipher.getAuthTag()])
  return ['v2', salt.toString('base64'), iv.toString('base64'), ciphertext.toString('base64')].join(':')
}
