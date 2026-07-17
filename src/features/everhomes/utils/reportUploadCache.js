const DB_NAME = 'everhomes-report-upload-recovery'
const STORE_NAME = 'files'
const DB_VERSION = 1

let databasePromise = null

function openDatabase() {
  if (databasePromise) return databasePromise
  if (!('indexedDB' in window)) return Promise.reject(new Error('Offline file recovery is unavailable in this browser.'))

  databasePromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open offline file recovery.'))
  })

  return databasePromise
}

async function run(mode, callback) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode)
    const request = callback(transaction.objectStore(STORE_NAME))
    transaction.oncomplete = () => resolve(request?.result)
    transaction.onerror = () => reject(transaction.error ?? request?.error ?? new Error('Offline file recovery failed.'))
    transaction.onabort = () => reject(transaction.error ?? new Error('Offline file recovery was aborted.'))
  })
}

export async function rememberReportUploadFile(photoId, file) {
  if (!photoId || !(file instanceof Blob)) return false
  await run('readwrite', (store) => store.put(file, photoId))
  return true
}

export async function recoverReportUploadFile(photoId) {
  if (!photoId) return null
  return run('readonly', (store) => store.get(photoId))
}

export async function forgetReportUploadFile(photoId) {
  if (!photoId) return
  await run('readwrite', (store) => store.delete(photoId))
}
