const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY
const FORMAT_VERSION = 'v2'
const PBKDF2_ITERATIONS = 310000
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const assertEncryptionKey = () => {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured')
    }
}

const bytesToBase64 = (bytes) => {
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary)
}

const base64ToBytes = (value) => {
    const binary = atob(value)
    return Uint8Array.from(binary, character => character.charCodeAt(0))
}

const deriveEncryptionKey = async (salt, usage) => {
    const keyMaterial = await globalThis.crypto.subtle.importKey(
        'raw',
        encoder.encode(String(ENCRYPTION_KEY)),
        'PBKDF2',
        false,
        ['deriveKey'],
    )

    return globalThis.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt,
            iterations: PBKDF2_ITERATIONS,
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        [usage],
    )
}

export const encryptCredential = async (credential) => {
    assertEncryptionKey()
    if (!credential) throw new Error('Credential is required')

    const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveEncryptionKey(salt, 'encrypt')
    const ciphertext = await globalThis.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(String(credential)),
    )

    return [
        FORMAT_VERSION,
        bytesToBase64(salt),
        bytesToBase64(iv),
        bytesToBase64(new Uint8Array(ciphertext)),
    ].join(':')
}

const decryptCurrentCredential = async (encryptedCredential) => {
    const [version, encodedSalt, encodedIv, encodedCiphertext, ...extra] = encryptedCredential.split(':')
    if (
        version !== FORMAT_VERSION ||
        !encodedSalt ||
        !encodedIv ||
        !encodedCiphertext ||
        extra.length > 0
    ) {
        throw new Error('Encrypted credential has an invalid format')
    }

    const salt = base64ToBytes(encodedSalt)
    const iv = base64ToBytes(encodedIv)
    if (salt.length !== 16 || iv.length !== 12) {
        throw new Error('Encrypted credential has invalid parameters')
    }

    const key = await deriveEncryptionKey(salt, 'decrypt')
    const plaintext = await globalThis.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        base64ToBytes(encodedCiphertext),
    )
    return decoder.decode(plaintext)
}

const decryptLegacyCredential = async (encryptedCredential) => {
    const CryptoJS = (await import('crypto-js')).default
    const bytes = CryptoJS.AES.decrypt(encryptedCredential, String(ENCRYPTION_KEY))
    const plaintext = bytes.toString(CryptoJS.enc.Utf8)
    if (!plaintext) throw new Error('Unable to decrypt legacy credential')
    return plaintext
}

export const decryptCredential = async (encryptedCredential) => {
    assertEncryptionKey()
    if (!encryptedCredential) throw new Error('Encrypted credential is required')

    return encryptedCredential.startsWith(`${FORMAT_VERSION}:`)
        ? decryptCurrentCredential(encryptedCredential)
        : decryptLegacyCredential(encryptedCredential)
}
