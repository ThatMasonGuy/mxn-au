import { httpsCallable } from 'firebase/functions'
import { functions } from '@/firebase'

const encryptOnServer = httpsCallable(functions, 'encryptServerCredential')

export const encryptCredential = async (credential) => {
  const { data } = await encryptOnServer({ credential })
  return data.encryptedCredential
}
