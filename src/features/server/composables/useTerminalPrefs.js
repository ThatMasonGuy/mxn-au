// @/features/server/composables/useTerminalPrefs.js
import { useLocalStorage } from '@vueuse/core'

// Singleton so every Terminal instance shares (and reacts to) the same prefs
let _fontSize

const DEFAULT_FONT_SIZE = 14
export const MIN_FONT_SIZE = 9
export const MAX_FONT_SIZE = 30

export const useTerminalPrefs = () => {
  if (!_fontSize) {
    _fontSize = useLocalStorage('ssh.terminal.fontSize', DEFAULT_FONT_SIZE)
  }

  const zoomIn = () => { _fontSize.value = Math.min(MAX_FONT_SIZE, _fontSize.value + 1) }
  const zoomOut = () => { _fontSize.value = Math.max(MIN_FONT_SIZE, _fontSize.value - 1) }
  const zoomReset = () => { _fontSize.value = DEFAULT_FONT_SIZE }

  return { fontSize: _fontSize, zoomIn, zoomOut, zoomReset }
}
