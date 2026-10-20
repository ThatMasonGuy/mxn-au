// A flush includes edits made while a save is in flight. Concurrent callers
// share the same drain, so copying a link or submitting never races a backup.
export function createDraftSaveQueue(save) {
  let revision = 0
  let savedRevision = -1
  let pending = null

  function markChanged() {
    revision += 1
  }

  function flush() {
    if (pending) return pending
    pending = (async () => {
      let result
      while (savedRevision !== revision) {
        const savingRevision = revision
        result = await save()
        savedRevision = savingRevision
      }
      return result
    })().finally(() => { pending = null })
    return pending
  }

  return { markChanged, flush }
}
