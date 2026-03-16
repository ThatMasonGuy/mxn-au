// src/composables/useLoadingScreen.js
// Shared reactive state for the route loading screen.
// Used by router.js (to trigger) and App.vue (to render).

import { ref, readonly } from 'vue'

const isLoading = ref(false)
const loadingMessage = ref('')

let showTimer = null
let minDisplayTimer = null
let shownAt = 0

const DEBOUNCE_MS = 300   // Don't show loader for fast navigations
const MIN_DISPLAY_MS = 400 // Once shown, keep visible at least this long

/**
 * Call when a navigation starts.
 * @param {string} [message] - Optional loading message from route meta
 */
function startLoading(message = '') {
  loadingMessage.value = message
  clearTimeout(showTimer)
  clearTimeout(minDisplayTimer)

  // Stage 1: wait before showing (anti-flicker)
  showTimer = setTimeout(() => {
    isLoading.value = true
    shownAt = Date.now()
  }, DEBOUNCE_MS)
}

/**
 * Call when navigation has resolved.
 */
function stopLoading() {
  clearTimeout(showTimer)

  if (!isLoading.value) {
    // Loader was never shown — nothing to hide
    return
  }

  // Enforce minimum display time so it doesn't flash
  const elapsed = Date.now() - shownAt
  const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

  clearTimeout(minDisplayTimer)
  minDisplayTimer = setTimeout(() => {
    isLoading.value = false
    loadingMessage.value = ''
  }, remaining)
}

export function useLoadingScreen() {
  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    startLoading,
    stopLoading,
  }
}
