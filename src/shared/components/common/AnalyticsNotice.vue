<template>
  <aside
    v-if="showNotice"
    class="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-zinc-950/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5"
    aria-label="Google Analytics choice"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="max-w-xl">
        <p class="font-semibold">Help improve MXN?</p>
        <p class="mt-1 text-sm leading-6 text-zinc-300">
          Allow Google Analytics so I can see which pages and tools are useful. You can change this later.
        </p>
      </div>

      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <router-link
          to="/analytics"
          class="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          Details
        </router-link>
        <button
          type="button"
          class="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          @click="declineOptionalAnalytics"
        >
          Decline
        </button>
        <button
          type="button"
          class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
          @click="acceptOptionalAnalytics"
        >
          Continue
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  getOptionalAnalyticsPreference,
  setOptionalAnalyticsEnabled,
  trackPageView,
} from '@/shared/analytics/analytics'

const route = useRoute()
const visible = ref(!getOptionalAnalyticsPreference().choiceMade)
const showNotice = computed(() => visible.value && route.path !== '/analytics')

async function acceptOptionalAnalytics() {
  await setOptionalAnalyticsEnabled(true)
  await trackPageView(route)
  visible.value = false
}

async function declineOptionalAnalytics() {
  await setOptionalAnalyticsEnabled(false)
  visible.value = false
}
</script>
