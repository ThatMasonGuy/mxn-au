import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY

export const encryptCredential = (credential) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured')
    }

    if (!credential) {
        throw new Error('Credential is required')
    }

    const encrypted = CryptoJS.AES.encrypt(String(credential), String(ENCRYPTION_KEY))
    const result = encrypted.toString()

    return result
}

export const decryptCredential = (encryptedCredential) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured')
    }

    const bytes = CryptoJS.AES.decrypt(encryptedCredential, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}