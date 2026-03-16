const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY

export const encryptCredential = async (credential) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured')
    }

    if (!credential) {
        throw new Error('Credential is required')
    }

    const CryptoJS = (await import('crypto-js')).default
    const encrypted = CryptoJS.AES.encrypt(String(credential), String(ENCRYPTION_KEY))
    const result = encrypted.toString()

    return result
}

export const decryptCredential = async (encryptedCredential) => {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured')
    }

    const CryptoJS = (await import('crypto-js')).default
    const bytes = CryptoJS.AES.decrypt(encryptedCredential, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}