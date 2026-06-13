// @/features/server/composables/useDashboardUi.js
import { computed, ref } from 'vue'
import { useLocalStorage, useMediaQuery } from '@vueuse/core'

/**
 * Dashboard UI state for the SSH portal.
 * - Server rail collapse follows the viewport until the user sets an explicit
 *   preference, which then persists across sessions.
 * - Aliases panel is a transient slide-over (not persisted).
 */
export const useDashboardUi = () => {
  const isNarrow = useMediaQuery('(max-width: 1024px)')

  // 'auto' | 'collapsed' | 'expanded'
  const railPref = useLocalStorage('ssh.dashboard.railPref', 'auto')

  const railCollapsed = computed(() =>
    railPref.value === 'auto' ? isNarrow.value : railPref.value === 'collapsed'
  )

  const toggleRail = () => {
    railPref.value = railCollapsed.value ? 'expanded' : 'collapsed'
  }

  const collapseRail = () => {
    railPref.value = 'collapsed'
  }

  const aliasesOpen = ref(false)
  const toggleAliases = () => {
    aliasesOpen.value = !aliasesOpen.value
  }

  return {
    isNarrow,
    railCollapsed,
    toggleRail,
    collapseRail,
    aliasesOpen,
    toggleAliases,
  }
}
